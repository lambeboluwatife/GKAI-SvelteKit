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

	// Find the current active game
	let currentGame = await gameHistoryCollection.findOne({
		userId,
		isCompleted: false
	});

	if (!currentGame) {
		throw error(404, 'No active game found. Please refresh the page to start a new game.');
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
		await updateStats(userId, guessCount, true, currentGame);
	}

	return json({
		result,
		won,
		isCompleted: won,
		gameId: currentGame._id.toString()
	});
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

	await updateStats(userId, currentGame.guessCount, won, currentGame);

	return json({ success: true });
};

async function updateStats(userId: ObjectId, guesses: number, won: boolean, game: any) {
	const statsCollection = await getUserStatsCollection();

	const stats = await statsCollection.findOne({ userId });

	if (!stats) {
		// Initialize stats if they don't exist
		const initialStats = {
			userId,
			gamesPlayed: 1,
			gamesWon: won ? 1 : 0,
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
			lastPlayed: new Date(),
			recentGames: newRecentGames
		}
	};

	if (won) {
		const range = getRange(guesses);
		updateData.$inc = { [`guessDistribution.${range}`]: 1 };
	}

	// Ensure fields exist for legacy users
	if (!stats.recentGames || !stats.guessDistribution) {
		updateData.$set.recentGames = newRecentGames;
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
