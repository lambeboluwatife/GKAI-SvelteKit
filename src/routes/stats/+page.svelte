<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// Mock stats data - This will come from localStorage in the actual implementation
	let stats = $state<{
		gamesPlayed: number;
		gamesWon: number;
		totalGuesses: number;
		bestScore: number | null;
		currentStreak: number;
		longestStreak: number;
		averageGuesses: number;
		lastPlayed: string | null;
		guessDistribution: Record<string, number>;
		recentGames: Array<{ guesses: number; won: boolean; date: string }>;
	}>({
		gamesPlayed: 0,
		gamesWon: 0,
		totalGuesses: 0,
		bestScore: null,
		currentStreak: 0,
		longestStreak: 0,
		averageGuesses: 0,
		lastPlayed: null,
		guessDistribution: {},
		recentGames: []
	});

	let isLoading = $state(true);
	let hasPlayedBefore = $state(false);

	onMount(() => {
		loadStats();
	});

	function loadStats() {
		// Load from localStorage
		const savedStats = localStorage.getItem('gkai-stats');

		if (savedStats) {
			stats = JSON.parse(savedStats);
			hasPlayedBefore = stats.gamesPlayed > 0;
		} else {
			// Demo data for illustration
			stats = {
				gamesPlayed: 15,
				gamesWon: 12,
				totalGuesses: 156,
				bestScore: 6,
				currentStreak: 3,
				longestStreak: 7,
				averageGuesses: 13,
				lastPlayed: new Date().toISOString(),
				guessDistribution: {
					'6-8': 2,
					'9-11': 4,
					'12-14': 3,
					'15-17': 2,
					'18-20': 1,
					'21+': 0
				},
				recentGames: [
					{ guesses: 12, won: true, date: '2024-01-15' },
					{ guesses: 15, won: true, date: '2024-01-14' },
					{ guesses: 9, won: true, date: '2024-01-13' },
					{ guesses: 18, won: true, date: '2024-01-12' },
					{ guesses: 11, won: true, date: '2024-01-11' }
				]
			};
			hasPlayedBefore = true;
		}

		isLoading = false;
	}

	function resetStats() {
		if (confirm('Are you sure you want to reset all your statistics? This cannot be undone.')) {
			localStorage.removeItem('gkai-stats');
			stats = {
				gamesPlayed: 0,
				gamesWon: 0,
				totalGuesses: 0,
				bestScore: null,
				currentStreak: 0,
				longestStreak: 0,
				averageGuesses: 0,
				lastPlayed: null,
				guessDistribution: {},
				recentGames: /** @type {{guesses:number; won:boolean; date:string}[]} */ ([])
			};
			hasPlayedBefore = false;
		}
	}

	function startPlaying() {
		goto('/game');
	}

	// Calculated stats
	$effect(() => {
		if (stats.gamesWon > 0) {
			stats.averageGuesses = Math.round(stats.totalGuesses / stats.gamesWon);
		}
	});

	const winRate = $derived(
		stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0
	);

	const statCards = $derived([
		{
			label: 'Games Played',
			value: stats.gamesPlayed,
			icon: '🎮',
			color: 'indigo'
		},
		{
			label: 'Games Won',
			value: stats.gamesWon,
			icon: '🏆',
			color: 'green'
		},
		{
			label: 'Win Rate',
			value: `${winRate}%`,
			icon: '📊',
			color: 'blue'
		},
		{
			label: 'Best Score',
			value: stats.bestScore ? `${stats.bestScore} guesses` : 'N/A',
			icon: '⭐',
			color: 'yellow'
		},
		{
			label: 'Average Guesses',
			value: stats.averageGuesses || 'N/A',
			icon: '📈',
			color: 'purple'
		},
		{
			label: 'Current Streak',
			value: stats.currentStreak,
			icon: '🔥',
			color: 'orange'
		}
	]);

	const achievements = $derived([
		{
			title: 'First Victory',
			description: 'Win your first game',
			icon: '🎯',
			unlocked: stats.gamesWon >= 1,
			progress: stats.gamesWon >= 1 ? 100 : 0
		},
		{
			title: 'Quick Thinker',
			description: 'Win a game in 10 guesses or less',
			icon: '⚡',
			unlocked: stats.bestScore && stats.bestScore <= 10,
			progress: stats.bestScore ? Math.min((10 / stats.bestScore) * 100, 100) : 0
		},
		{
			title: 'Veteran Player',
			description: 'Play 25 games',
			icon: '🎖️',
			unlocked: stats.gamesPlayed >= 25,
			progress: Math.min((stats.gamesPlayed / 25) * 100, 100)
		},
		{
			title: 'Winning Streak',
			description: 'Win 5 games in a row',
			icon: '🔥',
			unlocked: stats.longestStreak >= 5,
			progress: Math.min((stats.longestStreak / 5) * 100, 100)
		},
		{
			title: 'Master Codebreaker',
			description: 'Win a game in 8 guesses or less',
			icon: '👑',
			unlocked: stats.bestScore && stats.bestScore <= 8,
			progress: stats.bestScore ? Math.min((8 / stats.bestScore) * 100, 100) : 0
		},
		{
			title: 'Perfectionist',
			description: 'Win 10 games',
			icon: '💎',
			unlocked: stats.gamesWon >= 10,
			progress: Math.min((stats.gamesWon / 10) * 100, 100)
		}
	]);
</script>

<svelte:head>
	<title>Your Stats - GKAI</title>
	<meta
		name="description"
		content="Track your GKAI performance, achievements, and progress. See your win rate, best scores, and game history."
	/>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
	<!-- Page Header -->
	<div class="mb-12 text-center">
		<h1 class="mb-4 text-4xl font-bold text-gray-900 md:text-5xl dark:text-gray-100">
			Your Statistics
		</h1>
		<p class="text-xl text-gray-600 dark:text-gray-400">Track your progress and achievements</p>
	</div>

	{#if isLoading}
		<div class="py-20 text-center">
			<div
				class="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"
			></div>
			<p class="mt-4 text-gray-600 dark:text-gray-400">Loading your stats...</p>
		</div>
	{:else if !hasPlayedBefore}
		<!-- Empty State -->
		<div class="mx-auto max-w-2xl py-16 text-center">
			<div
				class="rounded-2xl border border-gray-200 bg-white p-12 shadow-lg dark:border-gray-800 dark:bg-gray-900"
			>
				<div class="mb-6 text-6xl">📊</div>
				<h2 class="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">No Statistics Yet</h2>
				<p class="mb-8 text-gray-600 dark:text-gray-400">
					Start playing GKAI to track your performance, achievements, and progress!
				</p>
				<button
					onclick={startPlaying}
					class="transform rounded-lg bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-indigo-700 hover:shadow-xl"
				>
					Play Your First Game
				</button>
			</div>
		</div>
	{:else}
		<!-- Stats Overview Cards -->
		<section class="mb-12">
			<div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
				{#each statCards as card}
					<div
						class="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-md dark:border-gray-800 dark:bg-gray-900"
					>
						<div class="mb-2 text-3xl">{card.icon}</div>
						<div class="mb-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
							{card.value}
						</div>
						<div class="text-sm text-gray-600 dark:text-gray-400">
							{card.label}
						</div>
					</div>
				{/each}
			</div>
		</section>

		<!-- Guess Distribution Chart -->
		<section class="mb-12">
			<div
				class="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-800 dark:bg-gray-900"
			>
				<h2 class="mb-6 flex items-center text-2xl font-bold text-gray-900 dark:text-gray-100">
					<span class="mr-3 text-2xl">📊</span>
					Guess Distribution
				</h2>

				{#if Object.keys(stats.guessDistribution).length > 0}
					<div class="space-y-3">
						{#each Object.entries(stats.guessDistribution) as [range, count]}
							{@const maxCount = Math.max(...Object.values(stats.guessDistribution))}
							{@const percentage = (count / maxCount) * 100}

							<div class="flex items-center space-x-4">
								<div class="w-20 text-sm font-medium text-gray-600 dark:text-gray-400">
									{range} guesses
								</div>
								<div class="relative flex-1">
									<div class="h-8 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
										<div
											class="flex h-full items-center justify-end rounded-full bg-indigo-600 px-3 transition-all duration-500 dark:bg-indigo-500"
											style="width: {percentage}%"
										>
											{#if count > 0}
												<span class="text-sm font-semibold text-white">{count}</span>
											{/if}
										</div>
									</div>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<p class="py-8 text-center text-gray-600 dark:text-gray-400">
						No distribution data yet. Play more games to see your patterns!
					</p>
				{/if}
			</div>
		</section>

		<!-- Achievements -->
		<section class="mb-12">
			<div
				class="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-800 dark:bg-gray-900"
			>
				<h2 class="mb-6 flex items-center text-2xl font-bold text-gray-900 dark:text-gray-100">
					<span class="mr-3 text-2xl">🏆</span>
					Achievements
				</h2>

				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each achievements as achievement}
						<div
							class="relative overflow-hidden rounded-xl border-2 {achievement.unlocked
								? 'border-green-500 bg-linear-to-br from-green-50 to-emerald-50 dark:border-green-600 dark:from-green-950/30 dark:to-emerald-950/30'
								: 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'} p-6"
						>
							<div class="flex items-start space-x-4">
								<div class="text-4xl {achievement.unlocked ? '' : 'opacity-50 grayscale'}">
									{achievement.icon}
								</div>
								<div class="flex-1">
									<h3 class="mb-1 font-semibold text-gray-900 dark:text-gray-100">
										{achievement.title}
									</h3>
									<p class="mb-3 text-sm text-gray-600 dark:text-gray-400">
										{achievement.description}
									</p>

									{#if achievement.unlocked}
										<div
											class="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-400"
										>
											✓ Unlocked
										</div>
									{:else}
										<div class="space-y-1">
											<div class="flex justify-between text-xs text-gray-600 dark:text-gray-400">
												<span>Progress</span>
												<span>{Math.round(achievement.progress)}%</span>
											</div>
											<div class="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
												<div
													class="h-full rounded-full bg-indigo-600 transition-all duration-500 dark:bg-indigo-500"
													style="width: {achievement.progress}%"
												></div>
											</div>
										</div>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<!-- Recent Games History -->
		<section class="mb-12">
			<div
				class="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-800 dark:bg-gray-900"
			>
				<h2 class="mb-6 flex items-center text-2xl font-bold text-gray-900 dark:text-gray-100">
					<span class="mr-3 text-2xl">📜</span>
					Recent Games
				</h2>

				{#if stats.recentGames.length > 0}
					<div class="overflow-x-auto">
						<table class="w-full">
							<thead>
								<tr class="border-b border-gray-200 dark:border-gray-800">
									<th
										class="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400"
										>Date</th
									>
									<th
										class="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400"
										>Guesses</th
									>
									<th
										class="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400"
										>Result</th
									>
								</tr>
							</thead>
							<tbody>
								{#each stats.recentGames as game, i}
									<tr
										class="border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
									>
										<td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
											{new Date(game.date).toLocaleDateString()}
										</td>
										<td class="px-4 py-3">
											<span
												class="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400"
											>
												{game.guesses}
											</span>
										</td>
										<td class="px-4 py-3">
											{#if game.won}
												<span
													class="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-400"
												>
													✓ Won
												</span>
											{:else}
												<span
													class="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-800 dark:bg-red-900/30 dark:text-red-400"
												>
													✗ Lost
												</span>
											{/if}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{:else}
					<p class="py-8 text-center text-gray-600 dark:text-gray-400">
						No recent games to display
					</p>
				{/if}
			</div>
		</section>

		<!-- Actions -->
		<section class="flex flex-col items-center justify-center gap-4 sm:flex-row">
			<button
				onclick={startPlaying}
				class="w-full transform rounded-lg bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-indigo-700 hover:shadow-xl sm:w-auto"
			>
				Play Another Game
			</button>
			<button
				onclick={resetStats}
				class="w-full rounded-lg bg-gray-200 px-8 py-4 text-lg font-semibold text-gray-800 transition-all duration-200 hover:bg-gray-300 sm:w-auto dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
			>
				Reset Statistics
			</button>
		</section>
	{/if}
</div>
