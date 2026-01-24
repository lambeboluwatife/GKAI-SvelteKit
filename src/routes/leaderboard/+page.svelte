<script lang="ts">
	import LeaderboardCard from '$lib/components/LeaderboardCard.svelte';
	let { data } = $props();

	let currentCategory = $state<'efficiency' | 'wins' | 'streaks' | 'daily'>('efficiency');
	let currentTimeframe = $state<'all' | 'weekly' | 'monthly'>('all');
	let isNearMe = $state(false);

	interface LeaderboardEntry {
		rank: number;
		username: string;
		value: string | number;
		userId: string;
		level: number;
		tier?: string;
	}

	let leaderboard = $state<LeaderboardEntry[]>(data.initialLeaderboard);
	let isLoading = $state(false);

	const categories = [
		{
			id: 'efficiency',
			label: 'Logic Legends',
			description: 'Lowest average guesses (min 15 games)'
		},
		{ id: 'wins', label: 'The Titans', description: 'Most total games won' },
		{ id: 'streaks', label: 'The Unstoppable', description: 'Longest win streak achieved' },
		{ id: 'daily', label: 'Daily Tacticians', description: "Today's top crackers" }
	];

	const timeframes = [
		{ id: 'all', label: 'All-Time' },
		{ id: 'monthly', label: 'Monthly' },
		{ id: 'weekly', label: 'Weekly' }
	];

	async function fetchData() {
		isLoading = true;
		try {
			const res = await fetch(
				`/api/leaderboard?category=${currentCategory}&timeframe=${currentTimeframe}&nearMe=${isNearMe}`
			);
			leaderboard = await res.json();
		} catch (e) {
			console.error(e);
		} finally {
			isLoading = false;
		}
	}

	const topThree = $derived(leaderboard.slice(0, 3));
	const rest = $derived(leaderboard.slice(3));

	const valueLabels: any = {
		efficiency: 'Avg Guesses',
		wins: 'Total Wins',
		streaks: 'Best Streak',
		daily: 'Guesses'
	};
</script>

<svelte:head>
	<title>Leaderboard - GKAI | Global Rankings</title>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
	<div class="mb-12 text-center">
		<h1 class="mb-4 text-4xl font-black text-gray-900 md:text-5xl dark:text-white">
			Global Rankings
		</h1>
		<p class="text-lg text-gray-600 dark:text-gray-400">
			See how you compare against the best agents in the field.
		</p>
	</div>

	<!-- Category Tabs -->
	<div class="mb-8 flex flex-wrap justify-center gap-2">
		{#each categories as cat}
			<button
				onclick={() => {
					currentCategory = cat.id as any;
					fetchData();
				}}
				class="rounded-full px-6 py-3 font-bold transition-all
                {currentCategory === cat.id
					? 'scale-105 bg-indigo-600 text-white shadow-lg'
					: 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
			>
				{cat.label}
			</button>
		{/each}
	</div>

	<!-- Timeframe & Context Toggles -->
	<div class="mb-12 flex flex-col items-center justify-center gap-4 md:flex-row">
		<div class="inline-flex rounded-xl bg-gray-100 p-1 dark:bg-gray-900">
			{#each timeframes as tf}
				<button
					onclick={() => {
						currentTimeframe = tf.id as any;
						fetchData();
					}}
					class="rounded-lg px-4 py-1.5 text-sm font-bold transition-all
                    {currentTimeframe === tf.id
						? 'bg-white text-indigo-600 shadow-sm dark:bg-gray-800 dark:text-indigo-400'
						: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}"
				>
					{tf.label}
				</button>
			{/each}
		</div>

		{#if data.user}
			<button
				onclick={() => {
					isNearMe = !isNearMe;
					fetchData();
				}}
				class="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all
                {isNearMe
					? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
					: 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400'}"
			>
				<span>🎯</span> Show Near Me
			</button>
		{/if}
	</div>

	<!-- Description -->
	<div class="mb-12 text-center text-sm font-medium tracking-widest text-gray-500 uppercase">
		{categories.find((c) => c.id === currentCategory)?.description}
	</div>

	{#if isLoading}
		<div class="flex h-64 items-center justify-center">
			<div
				class="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"
			></div>
		</div>
	{:else if leaderboard.length === 0}
		<div
			class="flex h-64 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800"
		>
			<div class="mb-4 text-5xl">🔭</div>
			<p class="text-gray-500">No agents found for these criteria yet.</p>
		</div>
	{:else}
		<!-- Top 3 Podium (Only show if not in Near Me mode) -->
		{#if !isNearMe}
			<div class="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
				{#if topThree[1]}
					<div class="order-2 pt-8 md:order-1">
						<LeaderboardCard entry={topThree[1]} />
					</div>
				{/if}
				{#if topThree[0]}
					<div class="order-1 md:order-2">
						<LeaderboardCard entry={topThree[0]} />
					</div>
				{/if}
				{#if topThree[2]}
					<div class="order-3 pt-12 md:order-3">
						<LeaderboardCard entry={topThree[2]} />
					</div>
				{/if}
			</div>
		{/if}

		<!-- Ranking List -->
		<div
			class="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900"
		>
			<table class="w-full text-left">
				<thead class="bg-gray-50 dark:bg-gray-800/50">
					<tr>
						<th class="px-6 py-4 text-sm font-bold text-gray-500 uppercase">Rank</th>
						<th class="px-6 py-4 text-sm font-bold text-gray-500 uppercase">Agent</th>
						<th class="px-6 py-4 text-right text-sm font-bold text-gray-500 uppercase"
							>{valueLabels[currentCategory]}</th
						>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100 dark:divide-gray-800">
					{#each isNearMe ? leaderboard : rest as entry}
						<tr
							class="group transition-colors hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10
                            {data.user?.id === entry.userId
								? 'bg-indigo-50/50 dark:bg-indigo-900/20'
								: ''}"
						>
							<td class="px-6 py-4">
								<div class="flex items-center gap-2">
									<span class="text-lg font-bold text-gray-400">#{entry.rank}</span>
									{#if entry.tier}<span class="text-xl">{entry.tier}</span>{/if}
								</div>
							</td>
							<td class="px-6 py-4">
								<div class="flex items-center space-x-3">
									<div
										class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600 dark:bg-gray-800 dark:text-indigo-400"
									>
										{entry.username.charAt(0).toUpperCase()}
									</div>
									<div class="flex flex-col">
										<span class="font-bold text-gray-900 dark:text-white"
											>{entry.username}
											{#if data.user?.id === entry.userId}
												<span
													class="ml-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300"
													>You</span
												>
											{/if}
										</span>
										<span class="text-[10px] font-black tracking-tighter text-gray-400 uppercase"
											>Level {entry.level}</span
										>
									</div>
								</div>
							</td>
							<td class="px-6 py-4 text-right font-mono text-xl font-black text-indigo-600">
								{entry.value}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}

	<div class="mt-12 text-center text-sm text-gray-500">
		<p>Leaderboard updates in real-time as agents crack codes.</p>
	</div>
</div>

<style>
	button {
		transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}
</style>
