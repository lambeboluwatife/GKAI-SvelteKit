import { json } from '@sveltejs/kit';
import { getUsersCollection } from '$lib/server/db/collections';
import { verifyPassword, generateToken, setSessionCookie } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	try {
		const { emailOrUsername, password } = await event.request.json();

		if (!emailOrUsername || !password) {
			return json({ error: 'Email/Username and password are required' }, { status: 400 });
		}

		const usersCollection = await getUsersCollection();

		// Find user by email or username
		const user = await usersCollection.findOne({
			$or: [{ email: emailOrUsername.toLowerCase() }, { username: emailOrUsername }]
		});

		if (!user) {
			return json({ error: 'Invalid credentials' }, { status: 401 });
		}

		// Verify password
		const isPasswordValid = await verifyPassword(password, user.passwordHash);
		if (!isPasswordValid) {
			return json({ error: 'Invalid credentials' }, { status: 401 });
		}

		// Update last login
		await usersCollection.updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } });

		// Generate and set token
		const token = generateToken(user);
		setSessionCookie(event, token);

		return json({ success: true });
	} catch (err) {
		console.error('Login API error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
