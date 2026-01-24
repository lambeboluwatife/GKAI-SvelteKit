import { json, error } from '@sveltejs/kit';
import { getGameHistoryCollection, getUserStatsCollection } from '$lib/server/db/collections';
import { getUserFromRequest } from '$lib/server/auth';
import type { RequestHandler } from './$types';
import { ObjectId } from 'mongodb';
import { calculateResult } from '$lib/server/game';

export const POST: RequestHandler = async (event) => {
	const user = getUserFromRequest(event);
	const gameHistoryCollection = await getGameHistoryCollection();

	if (!user) {
		throw error(401, 'Authentication required');
	}

	const { guess } = await event.request.json();
	const userId = new ObjectId(user.id);

	try {
		// Find the current active game
		let currentGame = await gameHistoryCollection.findOne({
			userId,
			isCompleted: false
		});

		if (!currentGame) {
			return json(
				{ message: 'No active game found. Please refresh to start a new sessions.' },
				{ status: 404 }
			);
		}

		if (currentGame.isCompleted) {
			return json({ message: 'This game has already been completed.' }, { status: 400 });
		}

		const result = calculateResult(guess, currentGame.secretCode);
		const won = result.killed === 4;

		// Update the game record
		const updatedGuesses = [
			...currentGame.guesses,
			{
				numbers: guess,
				killed: result.killed,
				injured: result.injured,
				timestamp: new Date()
			}
		];

		const guessCount = currentGame.guessCount + 1;

		await gameHistoryCollection.updateOne(
			{ _id: currentGame._id },
			{
				$set: {
					guesses: updatedGuesses,
					guessCount: guessCount,
					won: won,
					isCompleted: won, // End game if won
					completedAt: won ? new Date() : currentGame.completedAt
				}
			}
		);

		if (won) {
			await updateStats(userId, user.username, guessCount, true, currentGame);
		}

		return json({
			result,
			won,
			isCompleted: won,
			gameId: currentGame._id.toString()
		});
	} catch (err) {
		console.error('Game submission error:', err);
		return json(
			{ message: 'Failed to process guess. Please check your connection.' },
			{ status: 500 }
		);
	}
};

export const PATCH: RequestHandler = async (event) => {
	const user = getUserFromRequest(event);
	const gameHistoryCollection = await getGameHistoryCollection();

	if (!user) {
		throw error(401, 'Authentication required');
	}

	const { isCompleted, won } = await event.request.json();
	const userId = new ObjectId(user.id);

	let currentGame = await gameHistoryCollection.findOne({
		userId,
		isCompleted: false
	});

	if (!currentGame) {
		throw error(404, 'No active game found');
	}

	await gameHistoryCollection.updateOne(
		{ _id: currentGame._id },
		{
			$set: {
				isCompleted,
				won,
				completedAt: new Date()
			}
		}
	);

	await updateStats(userId, user.username, currentGame.guessCount, won, currentGame);

	return json({ success: true });
};

async function updateStats(
	userId: ObjectId,
	username: string,
	guesses: number,
	won: boolean,
	game: any
) {
	const statsCollection = await getUserStatsCollection();

	const stats = await statsCollection.findOne({ userId });

	if (!stats) {
		// Initialize stats if they don't exist
		const initialStats = {
			userId,
			username,
			gamesPlayed: 1,
			gamesWon: won ? 1 : 0,
			xp: won ? 100 + (30 - guesses) * 10 : 10,
			level: 1,
			totalGuesses: won ? guesses : 0,
			bestScore: won ? guesses : null,
			currentStreak: won ? 1 : 0,
			longestStreak: won ? 1 : 0,
			averageGuesses: won ? guesses : 0,
			lastPlayed: new Date(),
			achievements: [],
			recentGames: [
				{
					gameId: game._id.toString(),
					won,
					guesses,
					mode: game.mode,
					date: new Date()
				}
			],
			guessDistribution: won ? { [getRange(guesses)]: 1 } : {}
		};
		await statsCollection.insertOne(initialStats);
		return;
	}

	// Calculate XP
	const gainedXp = won ? 100 + (30 - guesses) * 10 : 10;
	const newXp = (stats.xp || 0) + gainedXp;
	const newLevel = Math.floor(Math.sqrt(newXp / 100)) + 1;

	const newGamesPlayed = stats.gamesPlayed + 1;
	const newGamesWon = won ? stats.gamesWon + 1 : stats.gamesWon;
	const newTotalGuesses = won ? stats.totalGuesses + guesses : stats.totalGuesses;
	const newCurrentStreak = won ? stats.currentStreak + 1 : 0;
	const newLongestStreak = Math.max(stats.longestStreak, newCurrentStreak);
	const newBestScore = won
		? stats.bestScore === null
			? guesses
			: Math.min(stats.bestScore, guesses)
		: stats.bestScore;
	const newAverageGuesses = newGamesWon > 0 ? newTotalGuesses / newGamesWon : 0;

	// Achievement Logic
	const newAchievements = [...(stats.achievements || [])];
	const checkAchievement = (name: string) => {
		if (!newAchievements.includes(name)) newAchievements.push(name);
	};

	if (won && guesses <= 5) checkAchievement('Sniper');
	if (won && guesses <= 8) checkAchievement('Master Codebreaker');
	if (won && guesses <= 10) checkAchievement('Quick Thinker');
	if (newCurrentStreak >= 5) checkAchievement('On Fire');
	if (newGamesWon >= 10) checkAchievement('Perfectionist');
	if (newGamesWon >= 50) checkAchievement('Elite Agent');
	if (stats.gamesPlayed >= 25 || stats.gamesPlayed + 1 >= 25) checkAchievement('Veteran Player');
	if (won) checkAchievement('First Victory');
	const newRecentGames = [
		...(stats.recentGames || []),
		{
			gameId: game._id.toString(),
			won,
			guesses,
			mode: game.mode,
			date: new Date()
		}
	].slice(0, 9);

	const updateData: any = {
		$set: {
			gamesPlayed: newGamesPlayed,
			gamesWon: newGamesWon,
			totalGuesses: newTotalGuesses,
			currentStreak: newCurrentStreak,
			longestStreak: newLongestStreak,
			bestScore: newBestScore,
			averageGuesses: newAverageGuesses,
			xp: newXp,
			level: newLevel,
			achievements: newAchievements,
			lastPlayed: new Date(),
			recentGames: newRecentGames
		}
	};

	if (won) {
		const range = getRange(guesses);
		updateData.$inc = { [`guessDistribution.${range}`]: 1 };
	}

	// Ensure fields exist for legacy users, and sync username
	updateData.$set.username = username;

	if (!stats.recentGames || !stats.guessDistribution || stats.xp === undefined) {
		updateData.$set.recentGames = newRecentGames;
		updateData.$set.xp = stats.xp ?? newXp;
		updateData.$set.level = stats.level ?? newLevel;
		if (!stats.guessDistribution) {
			updateData.$set.guessDistribution = won ? { [getRange(guesses)]: 1 } : {};
		}
	}

	await statsCollection.updateOne({ userId }, updateData);
}

function getRange(guesses: number): string {
	if (guesses <= 8) return '6-8';
	if (guesses <= 11) return '9-11';
	if (guesses <= 14) return '12-14';
	if (guesses <= 17) return '15-17';
	if (guesses <= 20) return '18-20';
	return '21+';
}
