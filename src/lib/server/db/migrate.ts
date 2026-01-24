import { getUsersCollection, getUserStatsCollection } from './collections';

/**
 * Migration: Backfill usernames in the UserStats collection
 * for users created before the denormalization update.
 */
export async function migrateUsernames() {
	try {
		const usersCollection = await getUsersCollection();
		const statsCollection = await getUserStatsCollection();

		// Find all stats records that might needs updates (missing username OR empty achievements)
		const statsToUpdate = await statsCollection
			.find({
				$or: [
					{ username: { $exists: false } },
					{ username: null as any },
					{ username: '' },
					{ achievements: { $exists: false } },
					{ achievements: { $size: 0 } }
				]
			})
			.toArray();

		if (statsToUpdate.length === 0) {
			console.log('✅ No stats migration needed (all records up to date).');
			return;
		}

		console.log(`🔄 Migrating usernames for ${statsToUpdate.length} records...`);

		for (const stats of statsToUpdate) {
			const user = await usersCollection.findOne({ _id: stats.userId });
			const updates: any = {};

			if (user && !stats.username) {
				updates.username = user.username;
			}

			// Backfill basic achievements based on existing stats
			const achievements = stats.achievements || [];
			const addIf = (cond: boolean, name: string) => {
				if (cond && !achievements.includes(name)) achievements.push(name);
			};

			addIf(stats.gamesWon >= 1, 'First Victory');
			addIf(stats.gamesWon >= 10, 'Perfectionist');
			addIf(stats.gamesWon >= 50, 'Elite Agent');
			addIf(stats.gamesPlayed >= 25, 'Veteran Player');
			addIf(stats.longestStreak >= 5, 'On Fire');
			addIf(stats.bestScore !== null && stats.bestScore <= 10, 'Quick Thinker');
			addIf(stats.bestScore !== null && stats.bestScore <= 8, 'Master Codebreaker');
			addIf(stats.bestScore !== null && stats.bestScore <= 5, 'Sniper');

			if (
				Object.keys(updates).length > 0 ||
				achievements.length !== (stats.achievements?.length || 0)
			) {
				await statsCollection.updateOne({ _id: stats._id }, { $set: { ...updates, achievements } });
			}
		}

		console.log('✅ Username migration completed.');
	} catch (error) {
		console.error('❌ Migration failed:', error);
	}
}

/**
 * Utility to calculate achievements based on raw user statistics.
 */
export function calculateEarnedAchievements(stats: any): string[] {
	const achievements = stats.achievements || [];
	const addIf = (cond: boolean, name: string) => {
		if (cond && !achievements.includes(name)) achievements.push(name);
	};

	addIf(stats.gamesWon >= 1, 'First Victory');
	addIf(stats.gamesWon >= 10, 'Perfectionist');
	addIf(stats.gamesWon >= 50, 'Elite Agent');
	addIf(stats.gamesPlayed >= 25, 'Veteran Player');
	addIf(stats.longestStreak >= 5, 'On Fire');
	addIf(stats.bestScore !== null && stats.bestScore <= 10, 'Quick Thinker');
	addIf(stats.bestScore !== null && stats.bestScore <= 8, 'Master Codebreaker');
	addIf(stats.bestScore !== null && stats.bestScore <= 5, 'Sniper');

	return achievements;
}
