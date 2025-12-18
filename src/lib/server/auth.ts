import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import type { RequestEvent } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import type { User } from './db';

if (!JWT_SECRET) {
	throw new Error('JWT_SECRET environment variable is required');
}

const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = '7d';

// JWT Payload interface
export interface JWTPayload {
	userId: string;
	email: string;
	username: string;
	role: 'user' | 'admin';
	iat?: number;
	exp?: number;
}

// Session user interface (what's stored in locals)
export interface SessionUser {
	id: string;
	email: string;
	username: string;
	role: 'user' | 'admin';
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
	return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
	return await bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(user: User): string {
	const payload: JWTPayload = {
		userId: user._id!.toString(),
		email: user.email,
		username: user.username,
		role: user.role
	};

	return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
	try {
		const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
		return decoded;
	} catch (err) {
		return null;
	}
}

/**
 * Get user from request cookies
 */
export function getUserFromRequest(event: RequestEvent): SessionUser | null {
	const token = event.cookies.get('session');
	if (!token) return null;

	const payload = verifyToken(token);
	if (!payload) return null;

	return {
		id: payload.userId,
		email: payload.email,
		username: payload.username,
		role: payload.role
	};
}

/**
 * Require authentication - throws error if not authenticated
 */
export function requireAuth(event: RequestEvent): SessionUser {
	const user = getUserFromRequest(event);
	if (!user) {
		throw error(401, 'Authentication required');
	}
	return user;
}

/**
 * Require admin role - throws error if not admin
 */
export function requireAdmin(event: RequestEvent): SessionUser {
	const user = requireAuth(event);
	if (user.role !== 'admin') {
		throw error(403, 'Admin access required');
	}
	return user;
}

/**
 * Set session cookie
 */
export function setSessionCookie(event: RequestEvent, token: string) {
	event.cookies.set('session', token, {
		path: '/',
		httpOnly: true, // Prevents JS access (XSS protection)
		sameSite: 'strict', // CSRF protection
		secure: process.env.NODE_ENV === 'production', // HTTPS only in production
		maxAge: 60 * 60 * 24 * 7 // 7 days in seconds
	});
}

/**
 * Clear session cookie (logout)
 */
export function clearSessionCookie(event: RequestEvent) {
	event.cookies.delete('session', { path: '/' });
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

/**
 * Validate password strength
 * Requirements: min 8 chars, at least 1 uppercase, 1 lowercase, 1 number
 */
export function isValidPassword(password: string): { valid: boolean; message?: string } {
	if (password.length < 8) {
		return { valid: false, message: 'Password must be at least 8 characters long' };
	}

	if (!/[a-z]/.test(password)) {
		return { valid: false, message: 'Password must contain at least one lowercase letter' };
	}

	if (!/[A-Z]/.test(password)) {
		return { valid: false, message: 'Password must contain at least one uppercase letter' };
	}

	if (!/[0-9]/.test(password)) {
		return { valid: false, message: 'Password must contain at least one number' };
	}

	return { valid: true };
}

/**
 * Validate username
 * Requirements: 3-20 chars, alphanumeric and underscore only
 */
export function isValidUsername(username: string): { valid: boolean; message?: string } {
	if (username.length < 3) {
		return { valid: false, message: 'Username must be at least 3 characters long' };
	}

	if (username.length > 20) {
		return { valid: false, message: 'Username must be at most 20 characters long' };
	}

	if (!/^[a-zA-Z0-9_]+$/.test(username)) {
		return {
			valid: false,
			message: 'Username can only contain letters, numbers, and underscores'
		};
	}

	return { valid: true };
}

/**
 * Sanitize user object (remove sensitive data)
 */
export function sanitizeUser(user: User): Omit<User, 'passwordHash'> {
	const { passwordHash, ...safeUser } = user;
	return safeUser;
}
