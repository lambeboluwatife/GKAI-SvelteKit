import { MongoClient, Db } from 'mongodb';
import { MONGODB_URI } from '$env/static/private';

// Global MongoDB client for connection pooling
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

/**
 * Connect to MongoDB with connection pooling
 * Uses a cached connection in development to avoid multiple connections
 */
export async function connectToDatabase() {
	// Return cached connection if exists
	if (cachedClient && cachedDb) {
		return { client: cachedClient, db: cachedDb };
	}

	// Create new connection
	const client = new MongoClient(MONGODB_URI, {
		maxPoolSize: 10, // Maximum number of connections in the pool
		minPoolSize: 2, // Minimum number of connections
		maxIdleTimeMS: 30000, // Close connections after 30s of inactivity
		serverSelectionTimeoutMS: 5000, // Timeout after 5s if server not available
		socketTimeoutMS: 45000 // Socket timeout
	});

	try {
		await client.connect();
		console.log('✅ Connected to MongoDB');

		const db = client.db('gkai'); // Your database name

		// Cache the connection
		cachedClient = client;
		cachedDb = db;

		return { client, db };
	} catch (error) {
		console.error('❌ MongoDB connection error:', error);
		throw error;
	}
}

/**
 * Get database instance (automatically connects if needed)
 */
export async function getDb(): Promise<Db> {
	const { db } = await connectToDatabase();
	return db;
}

/**
 * Graceful shutdown
 * Call this when your app is shutting down
 */
export async function closeDatabase() {
	if (cachedClient) {
		await cachedClient.close();
		cachedClient = null;
		cachedDb = null;
		console.log('✅ MongoDB connection closed');
	}
}
