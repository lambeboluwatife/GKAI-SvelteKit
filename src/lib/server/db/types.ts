// User types
export interface User {
	_id?: import('mongodb').ObjectId;
	username: string;
	email: string;
	passwordHash: string;
	role: 'user' | 'admin';
	createdAt: Date;
	lastLogin?: Date;
	profile?: {
		avatar?: string;
		bio?: string;
	};
}

export interface RecentGame {
	gameId: string;
	won: boolean;
	guesses: number;
	mode: 'normal' | 'timer' | 'daily';
	date: Date;
}

export interface UserStats {
	_id?: import('mongodb').ObjectId;
	userId: import('mongodb').ObjectId;
	gamesPlayed: number;
	gamesWon: number;
	totalGuesses: number;
	bestScore: number | null;
	currentStreak: number;
	longestStreak: number;
	averageGuesses: number;
	lastPlayed?: Date;
	achievements: string[];
	recentGames: RecentGame[];
	guessDistribution: Record<string, number>;
}

export interface GameHistory {
	_id?: import('mongodb').ObjectId;
	userId: import('mongodb').ObjectId;
	secretCode: number[];
	guessCount: number;
	won: boolean;
	mode: 'normal' | 'timer' | 'daily';
	duration?: number;
	guesses: Array<{
		numbers: number[];
		killed: number;
		injured: number;
		timestamp: Date;
	}>;
	isCompleted: boolean;
	completedAt: Date;
}

export interface DailyChallenge {
	_id?: import('mongodb').ObjectId;
	date: string; // YYYY-MM-DD
	secretCode: number[];
	seed: number;
	createdAt: Date;
	participants: number;
	completions: number;
}

export interface DailySubmission {
	_id?: import('mongodb').ObjectId;
	dailyChallengeId: import('mongodb').ObjectId;
	userId: import('mongodb').ObjectId;
	username: string;
	guessCount: number;
	guesses: Array<{
		numbers: number[];
		killed: number;
		injured: number;
	}>;
	timeToComplete?: number;
	completedAt: Date;
}
