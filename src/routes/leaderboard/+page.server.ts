import { getUserStatsCollection } from '$lib/server/db/collections';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const statsCollection = await getUserStatsCollection();

	// Default to efficiency for initial load
	const leaderboard = await statsCollection
		.find({ gamesPlayed: { $gte: 15 } })
		.sort({ averageGuesses: 1, gamesWon: -1 })
		.limit(10)
		.toArray();

	const initialData = leaderboard.map((entry: any, index: number) => ({
		rank: index + 1,
		username: entry.username || 'Unknown Agent',
		value: entry.averageGuesses.toFixed(1),
		userId: entry.userId?.toString(),
		level: entry.level || 1,
		tier: index + 1 <= 3 ? (index + 1 === 1 ? '👑' : index + 1 === 2 ? '💎' : '🔥') : undefined
	}));

	return {
		initialLeaderboard: initialData,
		user: locals.user
	};
};
