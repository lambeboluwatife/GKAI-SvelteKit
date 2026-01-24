<script lang="ts">
	import { goto } from '$app/navigation';

	let username = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let error = $state('');
	let loading = $state(false);

	let usernameAvailability = $state({ checking: false, available: true, message: '' });
	let usernameTimeout: ReturnType<typeof setTimeout>;

	// Check username availability
	async function checkUsername(name: string) {
		if (name.length < 3) {
			usernameAvailability = { checking: false, available: false, message: 'Too short' };
			return;
		}

		usernameAvailability.checking = true;
		try {
			const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(name)}`);
			const data = await res.json();
			usernameAvailability = {
				checking: false,
				available: data.available,
				message: data.message || ''
			};
		} catch (err) {
			console.error('Check username error:', err);
			usernameAvailability.checking = false;
		}
	}

	$effect(() => {
		if (username) {
			clearTimeout(usernameTimeout);
			usernameTimeout = setTimeout(() => checkUsername(username), 500);
		} else {
			usernameAvailability = { checking: false, available: true, message: '' };
		}
	});

	// Password strength indicator
	const passwordStrength = $derived.by(() => {
		if (password.length === 0) return { strength: 0, text: '', color: '' };

		let strength = 0;
		if (password.length >= 8) strength++;
		if (/[a-z]/.test(password)) strength++;
		if (/[A-Z]/.test(password)) strength++;
		if (/[0-9]/.test(password)) strength++;
		if (/[^a-zA-Z0-9]/.test(password)) strength++;

		const levels = [
			{ strength: 1, text: 'Very Weak', color: 'bg-red-500' },
			{ strength: 2, text: 'Weak', color: 'bg-orange-500' },
			{ strength: 3, text: 'Fair', color: 'bg-yellow-500' },
			{ strength: 4, text: 'Good', color: 'bg-blue-500' },
			{ strength: 5, text: 'Strong', color: 'bg-green-500' }
		];

		return levels[strength - 1] || levels[0];
	});

	async function handleRegister(event: SubmitEvent) {
		event.preventDefault();
		error = '';

		// Client-side validation
		if (password !== confirmPassword) {
			error = 'Passwords do not match';
			return;
		}

		loading = true;

		try {
			const response = await fetch('/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, email, password })
			});

			const data = await response.json();

			if (!response.ok) {
				error = data.error || 'Registration failed';
				return;
			}

			// Success! Redirect to game
			goto('/game');
		} catch (err) {
			error = 'Network error. Please try again.';
			console.error('Registration error:', err);
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Sign Up - GKAI</title>
	<meta name="description" content="Create your GKAI account" />
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950">
	<div class="w-full max-w-md">
		<!-- Logo/Title -->
		<div class="mb-8 text-center">
			<h1 class="mb-2 text-4xl font-bold text-gray-900 dark:text-gray-100">GKAI 🎯</h1>
			<p class="text-gray-600 dark:text-gray-400">Create your account and start playing!</p>
		</div>

		<!-- Register Form -->
		<div
			class="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-800 dark:bg-gray-900"
		>
			<h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">Sign Up</h2>

			{#if error}
				<div
					class="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
				>
					{error}
				</div>
			{/if}

			<form onsubmit={handleRegister} class="space-y-4">
				<!-- Username -->
				<div>
					<label
						for="username"
						class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						Username
					</label>
					<input
						id="username"
						type="text"
						bind:value={username}
						required
						disabled={loading}
						class="w-full rounded-lg border-2 bg-white px-4 py-3 text-gray-900 transition-colors focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-100 {username.length >=
						3
							? usernameAvailability.checking
								? 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-300 dark:border-gray-700 dark:focus:ring-indigo-700'
								: usernameAvailability.available
									? 'border-green-500 focus:border-green-600 focus:ring-green-300 dark:border-green-600 dark:focus:ring-green-800'
									: 'border-red-500 focus:border-red-600 focus:ring-red-300 dark:border-red-600 dark:focus:ring-red-800'
							: 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-300 dark:border-gray-700 dark:focus:ring-indigo-700'}"
						placeholder="Choose a username"
					/>
					<div class="mt-1 flex items-center justify-between">
						<p class="text-xs text-gray-500 dark:text-gray-400">
							3-20 characters, letters, numbers, and underscores only
						</p>
						{#if username.length >= 3}
							{#if usernameAvailability.checking}
								<span class="animate-pulse text-xs text-gray-500">Checking...</span>
							{:else if !usernameAvailability.available}
								<span class="text-xs font-medium text-red-500">{usernameAvailability.message}</span>
							{:else}
								<span class="text-xs font-medium text-green-500">Available!</span>
							{/if}
						{/if}
					</div>
				</div>

				<!-- Email -->
				<div>
					<label
						for="email"
						class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						Email
					</label>
					<input
						id="email"
						type="email"
						bind:value={email}
						required
						disabled={loading}
						class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 transition-colors focus:border-indigo-500 focus:ring-4 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-700"
						placeholder="Enter your email"
					/>
				</div>

				<!-- Password -->
				<div>
					<label
						for="password"
						class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						Password
					</label>
					<input
						id="password"
						type="password"
						bind:value={password}
						required
						disabled={loading}
						class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 transition-colors focus:border-indigo-500 focus:ring-4 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-700"
						placeholder="Create a password"
					/>

					<!-- Password Strength Indicator -->
					{#if password.length > 0}
						<div class="mt-2">
							<div class="mb-1 flex items-center justify-between">
								<span class="text-xs text-gray-600 dark:text-gray-400"> Password strength: </span>
								<span
									class="text-xs font-medium"
									style="color: {passwordStrength.color.replace('bg-', '')}"
								>
									{passwordStrength.text}
								</span>
							</div>
							<div class="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
								<div
									class="h-2 rounded-full transition-all duration-300 {passwordStrength.color}"
									style="width: {(passwordStrength.strength / 5) * 100}%"
								></div>
							</div>
						</div>
					{/if}

					<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
						Min 8 characters, uppercase, lowercase, and number
					</p>
				</div>

				<!-- Confirm Password -->
				<div>
					<label
						for="confirmPassword"
						class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						Confirm Password
					</label>
					<input
						id="confirmPassword"
						type="password"
						bind:value={confirmPassword}
						required
						disabled={loading}
						class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 transition-colors focus:border-indigo-500 focus:ring-4 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-700"
						placeholder="Confirm your password"
					/>
				</div>

				<!-- Submit Button -->
				<button
					type="submit"
					disabled={loading ||
						!username ||
						!email ||
						!password ||
						!confirmPassword ||
						!usernameAvailability.available ||
						usernameAvailability.checking}
					class="w-full transform rounded-lg bg-indigo-600 px-6 py-4 font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-indigo-700 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50 dark:disabled:bg-gray-700"
				>
					{loading ? 'Creating account...' : 'Create Account'}
				</button>
			</form>

			<!-- Divider -->
			<div class="my-6 flex items-center">
				<div class="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
				<span class="px-4 text-sm text-gray-500 dark:text-gray-400">or</span>
				<div class="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
			</div>

			<!-- Login Link -->
			<div class="text-center">
				<p class="text-gray-600 dark:text-gray-400">
					Already have an account?
					<a
						href="/login"
						class="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
					>
						Login
					</a>
				</p>
			</div>
		</div>

		<!-- Back to Home -->
		<div class="mt-6 text-center">
			<a
				href="/"
				class="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
			>
				← Back to home
			</a>
		</div>
	</div>
</div>
