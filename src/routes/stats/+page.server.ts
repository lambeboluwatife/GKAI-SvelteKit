import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUserStatsCollection } from '$lib/server/db/collections';
import { ObjectId } from 'mongodb';

export const load: PageServerLoad = async ({ locals }) => {
	// 1. Check if user is authenticated
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	const userId = new ObjectId(locals.user.id);

	// 2. Fetch user stats
	const statsCollection = await getUserStatsCollection();
	const statsRecord = await statsCollection.findOne({ userId });

	// Default stats if none exist yet
	const defaultStats = {
		gamesPlayed: 0,
		gamesWon: 0,
		totalGuesses: 0,
		bestScore: null,
		currentStreak: 0,
		longestStreak: 0,
		averageGuesses: 0,
		lastPlayed: null,
		achievements: [],
		guessDistribution: {},
		recentGames: []
	};

	return {
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
					lastPlayed: statsRecord.lastPlayed?.toISOString() || null,
					recentGames: statsRecord.recentGames || []
				}
			: defaultStats
	};
};
