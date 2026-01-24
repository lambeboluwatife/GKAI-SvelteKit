import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUsersCollection, getUserStatsCollection } from '$lib/server/db/collections';
import { calculateEarnedAchievements } from '$lib/server/db/migrate';
import { ObjectId } from 'mongodb';

export const load: PageServerLoad = async ({ locals }) => {
	// 1. Check if user is authenticated
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	const userId = new ObjectId(locals.user.id);

	// 2. Fetch user details
	const usersCollection = await getUsersCollection();
	const userRecord = await usersCollection.findOne({ _id: userId });

	if (!userRecord) {
		// Should not happen if authenticated, but safety first
		throw redirect(303, '/login');
	}

	// 3. Fetch user stats
	const statsCollection = await getUserStatsCollection();
	let statsRecord = await statsCollection.findOne({ userId });

	// Live Fix: Backfill achievements if empty
	if (
		statsRecord &&
		(!statsRecord.achievements || statsRecord.achievements.length === 0) &&
		statsRecord.gamesWon > 0
	) {
		const newAchievements = calculateEarnedAchievements(statsRecord);
		if (newAchievements.length > 0) {
			await statsCollection.updateOne(
				{ _id: statsRecord._id },
				{ $set: { achievements: newAchievements } }
			);
			statsRecord.achievements = newAchievements; // Update in-memory for immediate return
		}
	}

	// Default stats if none exist yet
	const defaultStats = {
		gamesPlayed: 0,
		gamesWon: 0,
		totalGuesses: 0,
		bestScore: null,
		currentStreak: 0,
		longestStreak: 0,
		averageGuesses: 0,
		xp: 0,
		level: 1,
		achievements: [],
		guessDistribution: {}
	};

	return {
		user: {
			username: userRecord.username,
			email: userRecord.email,
			role: userRecord.role,
			createdAt: userRecord.createdAt,
			profile: userRecord.profile || {}
		},
		stats: statsRecord
			? {
					gamesPlayed: statsRecord.gamesPlayed,
					gamesWon: statsRecord.gamesWon,
					totalGuesses: statsRecord.totalGuesses,
					bestScore: statsRecord.bestScore,
					currentStreak: statsRecord.currentStreak,
					longestStreak: statsRecord.longestStreak,
					averageGuesses: statsRecord.averageGuesses,
					xp: statsRecord.xp || 0,
					level: statsRecord.level || 1,
					achievements: statsRecord.achievements,
					guessDistribution: statsRecord.guessDistribution,
					lastPlayed: statsRecord.lastPlayed
				}
			: defaultStats
	};
};
