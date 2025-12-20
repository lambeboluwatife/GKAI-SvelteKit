<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const { user, stats } = data;

	const formatDate = (date: Date | string) => {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	async function handleLogout() {
		try {
			const response = await fetch('/api/auth/logout', { method: 'POST' });
			if (response.ok) {
				window.location.href = '/login';
			}
		} catch (error) {
			console.error('Logout failed:', error);
		}
	}

	const winRate = $derived(
		stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0
	);

	const statCards = $derived([
		{ label: 'Games Played', value: stats.gamesPlayed, icon: '🎮', color: 'indigo' },
		{ label: 'Games Won', value: stats.gamesWon, icon: '🏆', color: 'green' },
		{ label: 'Win Rate', value: `${winRate}%`, icon: '📊', color: 'blue' },
		{
			label: 'Best Score',
			value: stats.bestScore ? `${stats.bestScore} guesses` : 'N/A',
			icon: '⭐',
			color: 'yellow'
		},
		{ label: 'Current Streak', value: stats.currentStreak, icon: '🔥', color: 'orange' },
		{ label: 'Avg Guesses', value: stats.averageGuesses || 'N/A', icon: '📈', color: 'purple' }
	]);
</script>

<svelte:head>
	<title>{user.username}'s Profile - GKAI</title>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
	<!-- Profile Header -->
	<div
		class="mb-12 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900"
	>
		<div class="h-32 bg-linear-to-r from-indigo-600 to-purple-600"></div>
		<div class="relative px-8 pb-8">
			<div class="relative -mt-16 mb-6 flex items-end space-x-6">
				<div
					class="flex h-32 w-32 items-center justify-center rounded-2xl border-4 border-white bg-indigo-100 text-4xl font-bold text-indigo-600 shadow-lg dark:border-gray-900 dark:bg-gray-800 dark:text-indigo-400"
				>
					{user.username.charAt(0).toUpperCase()}
				</div>
				<div class="mb-2">
					<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">{user.username}</h1>
					<p class="text-gray-600 dark:text-gray-400">{user.email}</p>
				</div>
			</div>

			<div class="flex flex-wrap items-center gap-4">
				<span
					class="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400"
				>
					Member since {formatDate(user.createdAt)}
				</span>
				{#if user.role === 'admin'}
					<span
						class="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
					>
						Admin
					</span>
				{/if}
			</div>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
		<!-- Left Column: Stats Summary -->
		<div class="space-y-8 lg:col-span-2">
			<section>
				<h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
					Performance Summary
				</h2>
				<div class="grid grid-cols-2 gap-4 md:grid-cols-3">
					{#each statCards as card}
						<div
							class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
						>
							<div class="mb-2 text-3xl">{card.icon}</div>
							<div class="text-2xl font-bold text-gray-900 dark:text-gray-100">{card.value}</div>
							<div class="text-sm text-gray-500 dark:text-gray-400">{card.label}</div>
						</div>
					{/each}
				</div>
			</section>

			<section>
				<div class="mb-6 flex items-center justify-between">
					<h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Achievements</h2>
					<a
						href="/stats"
						class="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
						>View detailed stats →</a
					>
				</div>

				{#if stats.achievements && stats.achievements.length > 0}
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						{#each stats.achievements as achievement}
							<div
								class="flex items-center space-x-4 rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
							>
								<div class="text-3xl">🏅</div>
								<div>
									<h3 class="font-semibold text-gray-900 dark:text-gray-100">{achievement}</h3>
									<p class="text-sm text-gray-500">Unlocked</p>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div
						class="rounded-xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-700"
					>
						<div class="mb-4 text-4xl">🎯</div>
						<p class="text-gray-600 dark:text-gray-400">
							No achievements unlocked yet. Keep playing to earn rewards!
						</p>
					</div>
				{/if}
			</section>
		</div>

		<!-- Right Column: Account & Actions -->
		<div class="space-y-8">
			<section
				class="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-800 dark:bg-gray-900"
			>
				<h2 class="mb-6 text-xl font-bold text-gray-900 dark:text-gray-100">Account Options</h2>

				<div class="space-y-4">
					<button
						onclick={() => goto('/game')}
						class="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white shadow-md transition-all hover:bg-indigo-700 active:scale-95"
					>
						Play Game
					</button>

					<button
						onclick={handleLogout}
						class="flex w-full items-center justify-center rounded-xl border-2 border-red-100 px-4 py-3 font-semibold text-red-600 transition-all hover:bg-red-50 dark:border-red-900/20 dark:hover:bg-red-900/10"
					>
						Logout
					</button>
				</div>
			</section>

			<section
				class="rounded-2xl border border-gray-200 bg-gray-50 p-8 dark:border-gray-800 dark:bg-gray-900/50"
			>
				<h3 class="mb-2 font-bold text-gray-900 dark:text-gray-100">Need Help?</h3>
				<p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
					If you have issues with your account or have suggestions, feel free to contact us.
				</p>
				<a
					href="/how-to-play"
					class="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
					>View How to Play</a
				>
			</section>
		</div>
	</div>
</div>
