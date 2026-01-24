import { json } from '@sveltejs/kit';
import { isUsernameTaken, isValidUsername } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const username = url.searchParams.get('username');

	if (!username) {
		return json({ error: 'Username is required' }, { status: 400 });
	}

	const validation = isValidUsername(username);
	if (!validation.valid) {
		return json({ available: false, message: validation.message });
	}

	try {
		const taken = await isUsernameTaken(username);
		return json({
			available: !taken,
			message: taken ? 'Username is already taken' : 'Username is available'
		});
	} catch (err) {
		console.error('Check username error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
