// src/lib/server/db/collections.ts
import { Collection } from 'mongodb';
import { getDb } from './mongo';
import type { User, UserStats, GameHistory, DailyChallenge, DailySubmission } from './types';

/**
 * Type-safe collection helpers
 */
export async function getUsersCollection(): Promise<Collection<User>> {
	const db = await getDb();
	return db.collection<User>('users');
}

export async function getUserStatsCollection(): Promise<Collection<UserStats>> {
	const db = await getDb();
	return db.collection<UserStats>('userStats');
}

export async function getGameHistoryCollection(): Promise<Collection<GameHistory>> {
	const db = await getDb();
	return db.collection<GameHistory>('gameHistory');
}

export async function getDailyChallengesCollection(): Promise<Collection<DailyChallenge>> {
	const db = await getDb();
	return db.collection<DailyChallenge>('dailyChallenges');
}

export async function getDailySubmissionsCollection(): Promise<Collection<DailySubmission>> {
	const db = await getDb();
	return db.collection<DailySubmission>('dailySubmissions');
}
