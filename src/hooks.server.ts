// src/hooks.server.ts
import { getUserFromRequest } from '$lib/server/auth';
import { initializeDatabase, closeDatabase } from '$lib/server/db';
import type { Handle } from '@sveltejs/kit';

// Initialize database on server start
let dbInitialized = false;

if (!dbInitialized) {
	initializeDatabase()
		.then(() => {
			dbInitialized = true;
			console.log('🚀 Database initialized successfully');
		})
		.catch((error) => {
			console.error('❌ Failed to initialize database:', error);
			process.exit(1);
		});
}

// Graceful shutdown handler
if (typeof process !== 'undefined') {
	process.on('SIGINT', async () => {
		console.log('\n🛑 Shutting down gracefully...');
		await closeDatabase();
		process.exit(0);
	});

	process.on('SIGTERM', async () => {
		console.log('\n🛑 Shutting down gracefully...');
		await closeDatabase();
		process.exit(0);
	});
}

// Handle all requests
export const handle: Handle = async ({ event, resolve }) => {
	// Get user from session and add to event.locals
	const user = getUserFromRequest(event);
	event.locals.user = user;

	const response = await resolve(event);
	return response;
};
