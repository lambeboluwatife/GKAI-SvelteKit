<script lang="ts">
	import { goto } from '$app/navigation';

	let emailOrUsername = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleLogin(event: SubmitEvent) {
		event.preventDefault();

		error = '';
		loading = true;

		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ emailOrUsername, password })
			});

			const data = await response.json();

			if (!response.ok) {
				error = data.error || 'Login failed';
				return;
			}

			// Success! Redirect to game
			goto('/game');
		} catch (err) {
			error = 'Network error. Please try again.';
			console.error('Login error:', err);
		} finally {
			loading = false;
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleLogin();
		}
	}
</script>

<svelte:head>
	<title>Login - GKAI</title>
	<meta name="description" content="Login to your GKAI account" />
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950">
	<div class="w-full max-w-md">
		<!-- Logo/Title -->
		<div class="mb-8 text-center">
			<h1 class="mb-2 text-4xl font-bold text-gray-900 dark:text-gray-100">GKAI 🎯</h1>
			<p class="text-gray-600 dark:text-gray-400">Welcome back! Login to continue playing.</p>
		</div>

		<!-- Login Form -->
		<div
			class="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-800 dark:bg-gray-900"
		>
			<h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">Login</h2>

			{#if error}
				<div
					class="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
				>
					{error}
				</div>
			{/if}

			<form onsubmit={handleLogin} class="space-y-4">
				<!-- Email or Username -->
				<div>
					<label
						for="emailOrUsername"
						class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						Email or Username
					</label>
					<input
						id="emailOrUsername"
						type="text"
						bind:value={emailOrUsername}
						onkeypress={handleKeyPress}
						required
						disabled={loading}
						class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 transition-colors focus:border-indigo-500 focus:ring-4 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-700"
						placeholder="Enter your email or username"
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
						onkeypress={handleKeyPress}
						required
						disabled={loading}
						class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 transition-colors focus:border-indigo-500 focus:ring-4 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-700"
						placeholder="Enter your password"
					/>
				</div>

				<!-- Forgot Password Link -->
				<div class="text-right">
					<a
						href="/forgot-password"
						class="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
					>
						Forgot password?
					</a>
				</div>

				<!-- Submit Button -->
				<button
					type="submit"
					disabled={loading || !emailOrUsername || !password}
					class="w-full transform rounded-lg bg-indigo-600 px-6 py-4 font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-indigo-700 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50 dark:disabled:bg-gray-700"
				>
					{loading ? 'Logging in...' : 'Login'}
				</button>
			</form>

			<!-- Divider -->
			<div class="my-6 flex items-center">
				<div class="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
				<span class="px-4 text-sm text-gray-500 dark:text-gray-400">or</span>
				<div class="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
			</div>

			<!-- Register Link -->
			<div class="text-center">
				<p class="text-gray-600 dark:text-gray-400">
					Don't have an account?
					<a
						href="/register"
						class="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
					>
						Sign up
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
