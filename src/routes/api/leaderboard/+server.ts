import { json, error } from '@sveltejs/kit';
import {
	getUserStatsCollection,
	getDailySubmissionsCollection,
	getGameHistoryCollection
} from '$lib/server/db/collections';
import type { RequestHandler } from './$types';
import { ObjectId } from 'mongodb';
import { startOfWeek, startOfMonth } from 'date-fns';

export const GET: RequestHandler = async ({ url, locals }) => {
	const category = url.searchParams.get('category') || 'efficiency';
	const timeframe = url.searchParams.get('timeframe') || 'all';
	const showNearMe = url.searchParams.get('nearMe') === 'true';

	const statsCollection = await getUserStatsCollection();

	try {
		let rawData = [];

		if (timeframe === 'all') {
			rawData = await getAllTimeData(category, statsCollection);
		} else {
			rawData = await getTimeframedData(category, timeframe);
		}

		const totalPlayers = await statsCollection.countDocuments({ gamesPlayed: { $gt: 0 } });

		// Map and format results
		let results = rawData.map((entry: any, index: number) => {
			const rank = index + 1;
			return {
				rank,
				username: entry.username || 'Unknown Agent',
				value: formatValue(category, entry),
				userId: entry.userId?.toString() || entry._id?.toString(),
				level: entry.level || 1,
				tier: getTier(rank, totalPlayers)
			};
		});

		// Slice for Near Me if needed
		if (showNearMe && locals.user?.id) {
			const myId = locals.user.id;
			const myIndex = results.findIndex((r: any) => r.userId === myId);
			if (myIndex !== -1) {
				const start = Math.max(0, myIndex - 5);
				results = results.slice(start, start + 11);
			}
		}

		return json(results);
	} catch (err) {
		console.error('Leaderboard API error:', err);
		return json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
	}
};

async function getAllTimeData(category: string, collection: any) {
	const baseQuery: any = { gamesPlayed: { $gt: 0 } };
	let sort: any = {};

	if (category === 'efficiency') {
		baseQuery.gamesPlayed = { $gte: 15 };
		sort = { averageGuesses: 1, gamesWon: -1 };
	} else if (category === 'wins') {
		sort = { gamesWon: -1, averageGuesses: 1 };
	} else if (category === 'streaks') {
		sort = { longestStreak: -1, gamesWon: -1 };
	} else {
		// Daily logic would go here
	}

	return collection.find(baseQuery).sort(sort).limit(100).toArray();
}

async function getTimeframedData(category: string, timeframe: string) {
	const gameHistory = await getGameHistoryCollection();
	const startDate = timeframe === 'weekly' ? startOfWeek(new Date()) : startOfMonth(new Date());

	return gameHistory
		.aggregate([
			{ $match: { completedAt: { $gte: startDate }, won: true } },
			{
				$group: {
					_id: '$userId',
					gamesWon: { $sum: 1 },
					totalGuesses: { $sum: '$guessCount' }
				}
			},
			{
				$lookup: {
					from: 'userStats',
					localField: '_id',
					foreignField: 'userId',
					as: 'meta'
				}
			},
			{ $unwind: '$meta' },
			{
				$project: {
					userId: '$_id',
					username: '$meta.username',
					level: '$meta.level',
					gamesWon: 1,
					averageGuesses: { $divide: ['$totalGuesses', '$gamesWon'] }
				}
			},
			{ $sort: category === 'efficiency' ? { averageGuesses: 1 } : { gamesWon: -1 } },
			{ $limit: 100 }
		])
		.toArray();
}

function formatValue(category: string, entry: any) {
	if (category === 'efficiency') return entry.averageGuesses.toFixed(1);
	if (category === 'wins') return entry.gamesWon;
	if (category === 'streaks') return entry.longestStreak || 0;
	return entry.guessCount || 0;
}

function getTier(rank: number, total: number) {
	const percentile = (rank / Math.max(total, 1)) * 100;
	if (percentile <= 1) return '👑';
	if (percentile <= 5) return '💎';
	if (percentile <= 15) return '🔥';
	return undefined;
}
