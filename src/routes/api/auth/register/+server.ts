import { json } from '@sveltejs/kit';
import { getUsersCollection, getUserStatsCollection } from '$lib/server/db/collections';
import {
	hashPassword,
	generateToken,
	setSessionCookie,
	isValidEmail,
	isValidPassword,
	isValidUsername
} from '$lib/server/auth';
import type { RequestHandler } from './$types';
import type { User, UserStats } from '$lib/server/db/types';

export const POST: RequestHandler = async (event) => {
	try {
		const { username, email, password } = await event.request.json();

		// Validation
		if (!username || !email || !password) {
			return json({ error: 'All fields are required' }, { status: 400 });
		}

		if (!isValidEmail(email)) {
			return json({ error: 'Invalid email format' }, { status: 400 });
		}

		const usernameValidation = isValidUsername(username);
		if (!usernameValidation.valid) {
			return json({ error: usernameValidation.message }, { status: 400 });
		}

		const passwordValidation = isValidPassword(password);
		if (!passwordValidation.valid) {
			return json({ error: passwordValidation.message }, { status: 400 });
		}

		const usersCollection = await getUsersCollection();

		// Check if user already exists
		const existingUser = await usersCollection.findOne({
			$or: [{ email: email.toLowerCase() }, { username: username }]
		});

		if (existingUser) {
			if (existingUser.email === email.toLowerCase()) {
				return json({ error: 'Email already in use' }, { status: 400 });
			}
			return json({ error: 'Username already taken' }, { status: 400 });
		}

		// Create user
		const passwordHash = await hashPassword(password);
		const newUser: Omit<User, '_id'> = {
			username,
			email: email.toLowerCase(),
			passwordHash,
			role: 'user',
			createdAt: new Date(),
			lastLogin: new Date()
		};

		const result = await usersCollection.insertOne(newUser as User);
		const userId = result.insertedId;

		// Initialize user stats
		const userStatsCollection = await getUserStatsCollection();
		const initialStats: Omit<UserStats, '_id'> = {
			userId: userId,
			gamesPlayed: 0,
			gamesWon: 0,
			totalGuesses: 0,
			bestScore: null,
			currentStreak: 0,
			longestStreak: 0,
			averageGuesses: 0,
			achievements: [],
			guessDistribution: {
				'6-8': 0,
				'9-11': 0,
				'12-14': 0,
				'15-17': 0,
				'18-20': 0,
				'21+': 0
			}
		};

		await userStatsCollection.insertOne(initialStats as UserStats);

		// Generate and set token
		const token = generateToken({ ...newUser, _id: userId } as User);
		setSessionCookie(event, token);

		return json({ success: true });
	} catch (err) {
		console.error('Registration API error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
