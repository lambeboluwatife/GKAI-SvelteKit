import { getDb } from './mongo';
import { migrateUsernames } from './migrate';

/**
 * Initialize database indexes
 * Run this once on app startup or deployment
 */
export async function initializeDatabase() {
	try {
		const db = await getDb();

		// ... (indexes)
		await db.collection('users').createIndex({ email: 1 }, { unique: true });
		await db.collection('users').createIndex({ username: 1 }, { unique: true });

		// UserStats collection indexes
		await db.collection('userStats').createIndex({ userId: 1 }, { unique: true });
		await db.collection('userStats').createIndex({ bestScore: 1 });
		await db.collection('userStats').createIndex({ gamesWon: -1 });
		await db.collection('userStats').createIndex({ averageGuesses: 1 });
		await db.collection('userStats').createIndex({ longestStreak: -1 });

		// GameHistory collection indexes
		await db.collection('gameHistory').createIndex({ userId: 1 });
		await db.collection('gameHistory').createIndex({ completedAt: -1 });
		await db.collection('gameHistory').createIndex({ mode: 1 });

		// DailyChallenges collection indexes
		await db.collection('dailyChallenges').createIndex({ date: 1 }, { unique: true });

		// DailySubmissions collection indexes
		await db
			.collection('dailySubmissions')
			.createIndex({ dailyChallengeId: 1, userId: 1 }, { unique: true });
		await db.collection('dailySubmissions').createIndex({ guessCount: 1, completedAt: 1 });

		console.log('✅ Database indexes created');

		// Run migrations
		await migrateUsernames();
	} catch (error) {
		console.error('❌ Error creating indexes:', error);
		throw error;
	}
}
