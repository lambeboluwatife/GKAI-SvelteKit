import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ObjectId } from 'mongodb';
import {
	getUsersCollection,
	getUserStatsCollection,
	getGameHistoryCollection
} from '$lib/server/db/collections';
import { generateSecretCode } from '$lib/server/game';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	const userId = new ObjectId(locals.user.id);

	const usersCollection = await getUsersCollection();
	const userRecord = await usersCollection.findOne({ _id: userId });

	if (!userRecord) {
		// Should not happen if authenticated, but safety first
		throw redirect(303, '/login');
	}

	const user = {
		username: userRecord.username,
		email: userRecord.email,
		role: userRecord.role,
		createdAt: userRecord.createdAt,
		profile: userRecord.profile || {},
		id: userRecord._id.toString()
	};

	// Default stats if none exist yet
	const defaultStats = {
		gamesPlayed: 0,
		gamesWon: 0,
		totalGuesses: 0,
		bestScore: null,
		currentStreak: 0,
		longestStreak: 0,
		averageGuesses: 0,
		achievements: [],
		recentGames: [],
		guessDistribution: {}
	};

	const statsCollection = await getUserStatsCollection();
	const statsRecord = await statsCollection.findOne({ userId });

	// Game initialization/resume logic
	const gameHistoryCollection = await getGameHistoryCollection();
	let currentGame = await gameHistoryCollection.findOne({
		userId,
		isCompleted: false
	});

	if (!currentGame) {
		const secretCode = generateSecretCode();
		const result = await gameHistoryCollection.insertOne({
			userId,
			secretCode,
			guessCount: 0,
			won: false,
			mode: 'normal',
			isCompleted: false,
			completedAt: new Date(),
			guesses: []
		});
		currentGame = await gameHistoryCollection.findOne({ _id: result.insertedId });
	}

	return {
		user: user,
		stats: statsRecord
			? {
					gamesPlayed: statsRecord.gamesPlayed,
					gamesWon: statsRecord.gamesWon,
					totalGuesses: statsRecord.totalGuesses,
					bestScore: statsRecord.bestScore,
					currentStreak: statsRecord.currentStreak,
					longestStreak: statsRecord.longestStreak,
					averageGuesses: statsRecord.averageGuesses,
					achievements: statsRecord.achievements,
					guessDistribution: statsRecord.guessDistribution,
					recentGames: statsRecord.recentGames,
					lastPlayed: statsRecord.lastPlayed
				}
			: defaultStats,
		currentGame: currentGame
			? {
					id: currentGame._id.toString(),
					guessCount: currentGame.guessCount,
					guesses: currentGame.guesses,
					mode: currentGame.mode,
					secretCode: currentGame.secretCode,
					isCompleted: currentGame.isCompleted,
					completedAt: currentGame.completedAt,
					won: currentGame.won
				}
			: null
	};
};
