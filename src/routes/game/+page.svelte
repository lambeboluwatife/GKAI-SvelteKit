<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import confetti from 'canvas-confetti';
	import TimerMode from '$lib/components/TimerMode.svelte';

	let { data } = $props();
	// const { user } = data;

	let gameMode = $state<'normal' | 'timer'>('normal');
	let timerRef = $state<any>(null);

	// Game state
	interface GuessEntry {
		guess: (number | '')[];
		killed: number;
		injured: number;
		number: number;
	}

	let secretCode = $state<number[]>([]);
	let currentGuess = $state<(number | '')[]>(['', '', '', '']);
	let guessHistory = $state<GuessEntry[]>([]);
	let gameStatus = $state('playing'); // 'playing', 'won', 'gave-up'
	let guessCount = $state(0);
	let inputRefs = $state<HTMLInputElement[]>([]);
	let showRules = $state(false);
	let availableNumbers = $state([1, 2, 3, 4, 5, 6, 7, 8, 9]);

	function handleTimeUp() {
		gameStatus = 'time-up';
		saveGameStats(guessCount, false);
	}

	onMount(() => {
		startNewGame();
	});

	function startNewGame() {
		secretCode = generateSecretCode();
		currentGuess = ['', '', '', ''];
		guessHistory = [];
		gameStatus = 'playing';
		guessCount = 0;

		// Reset timer if in timer mode
		if (gameMode === 'timer' && timerRef) {
			timerRef.reset();
		}

		console.log('Secret Code (dev):', secretCode); // Remove in production
	}

	function generateSecretCode() {
		const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		const code = [];

		for (let i = 0; i < 4; i++) {
			const randomIndex = Math.floor(Math.random() * numbers.length);
			code.push(numbers[randomIndex]);
			numbers.splice(randomIndex, 1);
		}

		return code;
	}

	function handleInput(index: number, event: Event) {
		const value = (event.target as HTMLInputElement).value;

		// Only allow numbers 1-9
		if (value && !/^[1-9]$/.test(value)) {
			(event.target as HTMLInputElement).value = '';
			return;
		}

		// Update current guess
		currentGuess[index] = value ? parseInt(value) : '';

		// Auto-advance to next input
		if (value && index < 3) {
			inputRefs[index + 1]?.focus();
		}
	}

	function handleKeyDown(index: number, event: KeyboardEvent) {
		// Backspace: clear current and go to previous
		if (event.key === 'Backspace' && !currentGuess[index] && index > 0) {
			inputRefs[index - 1]?.focus();
		}

		// Arrow keys navigation
		if (event.key === 'ArrowLeft' && index > 0) {
			event.preventDefault();
			inputRefs[index - 1]?.focus();
		}
		if (event.key === 'ArrowRight' && index < 3) {
			event.preventDefault();
			inputRefs[index + 1]?.focus();
		}

		// Enter: submit guess
		if (event.key === 'Enter') {
			submitGuess();
		}
	}

	function handlePaste(event: ClipboardEvent) {
		event.preventDefault();
		const pastedData = event.clipboardData?.getData('text').trim() || '';

		// Check if pasted data is 4 digits
		if (/^[1-9]{4}$/.test(pastedData)) {
			const digits = pastedData.split('');
			// Check for no duplicates
			if (new Set(digits).size === 4) {
				currentGuess = digits.map((d) => parseInt(d));
				inputRefs[3]?.focus();
			}
		}
	}

	function submitGuess() {
		// Validate guess
		if (currentGuess.some((val) => val === '')) {
			alert('Please enter all 4 numbers');
			return;
		}

		// Check for duplicates
		if (new Set(currentGuess).size !== 4) {
			alert('All numbers must be different');
			return;
		}

		// Calculate killed and injured
		const result = calculateResult(
			currentGuess.map((val) => (val === '' ? null : val)) as (number | null)[],
			secretCode
		);

		guessCount++;
		guessHistory = [
			...guessHistory,
			{
				guess: [...currentGuess],
				killed: result.killed,
				injured: result.injured,
				number: guessCount
			}
		];

		// Check win condition
		if (result.killed === 4) {
			gameStatus = 'won';
			saveGameStats(guessCount, true);
			setTimeout(() => {
				celebrateWin();
			}, 500);
		}

		// Clear input for next guess
		currentGuess = ['', '', '', ''];
		inputRefs[0]?.focus();
	}

	function calculateResult(guess: (number | null)[], secret: number[]) {
		let killed = 0;
		let injured = 0;

		const secretCopy: (number | null)[] = [...secret];
		const guessCopy = [...guess];

		// First pass: count killed (exact matches)
		for (let i = 0; i < 4; i++) {
			if (guessCopy[i] === secretCopy[i]) {
				killed++;
				secretCopy[i] = null;
				guessCopy[i] = null;
			}
		}

		// Second pass: count injured (right number, wrong position)
		for (let i = 0; i < 4; i++) {
			if (guessCopy[i] !== null) {
				const foundIndex = secretCopy.indexOf(guessCopy[i]);
				if (foundIndex !== -1) {
					injured++;
					secretCopy[foundIndex] = null;
				}
			}
		}

		return { killed, injured };
	}

	function celebrateWin() {
		const killedEmoji = confetti.shapeFromText({ text: '💀', scalar: 3 });
		const targetEmoji = confetti.shapeFromText({ text: '🎯', scalar: 3 });
		const starEmoji = confetti.shapeFromText({ text: '⭐', scalar: 3 });
		const targetEmojis = confetti.shapeFromText({
			text: '🎯',
			scalar: 2
		});

		const duration = 5 * 1000;
		const animationEnd = Date.now() + duration;

		function randomInRange(min: number, max: number) {
			return Math.random() * (max - min) + min;
		}

		const interval = setInterval(function () {
			const timeLeft = animationEnd - Date.now();

			if (timeLeft <= 0) {
				return clearInterval(interval);
			}

			const particleCount = 50 * (timeLeft / duration);

			// Layer 1: Background - smaller, slower
			confetti({
				particleCount: particleCount * 0.5,
				startVelocity: 20,
				spread: 360,
				ticks: 100,
				zIndex: 98,
				shapes: ['circle'],
				scalar: 0.8,
				colors: ['#4F46E5', '#8B5CF6'],
				origin: { x: randomInRange(0.2, 0.8), y: Math.random() - 0.2 }
			});

			// Layer 2: Middle - 3D shapes
			confetti({
				particleCount,
				startVelocity: 30,
				spread: 360,
				ticks: 80,
				zIndex: 99,
				shapes: ['circle', 'square'],
				scalar: 1.5,
				colors: ['#10B981', '#F59E0B', '#EF4444'],
				gravity: 1.2,
				drift: randomInRange(-0.3, 0.3),
				origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
			});

			// Layer 3: Foreground - Big emojis
			confetti({
				particleCount: particleCount * 0.2,
				startVelocity: 35,
				spread: 360,
				ticks: 60,
				zIndex: 100,
				shapes: [killedEmoji, targetEmoji, starEmoji, targetEmoji],
				scalar: 3,
				gravity: 1,
				drift: randomInRange(-0.5, 0.5),
				origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
			});
		}, 250);
	}

	function saveGameStats(guesses: number, won: boolean) {
		// Load existing stats
		const savedStats = localStorage.getItem('gkai-stats');
		let stats: any = savedStats
			? JSON.parse(savedStats)
			: {
					gamesPlayed: 0,
					gamesWon: 0,
					totalGuesses: 0,
					bestScore: null,
					currentStreak: 0,
					longestStreak: 0,
					guessDistribution: {},
					recentGames: []
				};

		// Update stats
		stats.gamesPlayed++;
		if (won) {
			stats.gamesWon++;
			stats.totalGuesses += guesses;
			stats.currentStreak++;

			if (!stats.bestScore || guesses < stats.bestScore) {
				stats.bestScore = guesses;
			}

			if (stats.currentStreak > stats.longestStreak) {
				stats.longestStreak = stats.currentStreak;
			}

			// Update distribution
			let range: string;
			if (guesses <= 8) range = '6-8';
			else if (guesses <= 11) range = '9-11';
			else if (guesses <= 14) range = '12-14';
			else if (guesses <= 17) range = '15-17';
			else if (guesses <= 20) range = '18-20';
			else range = '21+';

			stats.guessDistribution[range] = (stats.guessDistribution[range] || 0) + 1;
		} else {
			stats.currentStreak = 0;
		}

		// Add to recent games
		stats.recentGames = [
			{
				guesses,
				won,
				date: new Date().toISOString(),
				mode: gameMode,
				timeRemaining: gameMode === 'timer' && timerRef ? timerRef.getTimeRemaining() : null
			},
			...stats.recentGames.slice(0, 9) // Keep last 10
		];

		stats.lastPlayed = new Date().toISOString();

		localStorage.setItem('gkai-stats', JSON.stringify(stats));
	}

	function giveUp() {
		if (confirm('Are you sure you want to give up and see the answer?')) {
			gameStatus = 'gave-up';
			saveGameStats(guessCount, false);
		}
	}

	function viewStats() {
		goto('/stats');
	}

	// Update available numbers based on current guess
	$effect(() => {
		const used = currentGuess.filter((n) => n !== '');
		availableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => !used.includes(n));
	});
</script>

<svelte:head>
	<title>Play GKAI - Crack the Code</title>
	<meta
		name="description"
		content="Play GKAI now. Use logic and deduction to guess the secret 4-digit code."
	/>
	<!-- Confetti Library -->
	<script
		src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js"
	></script>
</svelte:head>

<div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
	<!-- Game Header -->
	<div class="mb-8 text-center">
		<h1 class="mb-2 text-3xl font-bold text-gray-900 md:text-4xl dark:text-gray-100">
			Crack the Code
		</h1>
		<p class="text-gray-600 dark:text-gray-400">Guess the 4 secret numbers (1-9, no repeats)</p>
	</div>

	<!-- Game Mode Selector -->
	<div class="mb-6 flex justify-center gap-4">
		<button
			onclick={() => {
				gameMode = 'normal';
				startNewGame();
			}}
			class="rounded-lg px-6 py-3 font-semibold transition-all
           {gameMode === 'normal'
				? 'bg-indigo-600 text-white shadow-lg'
				: 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}"
		>
			🎯 Normal Mode
		</button>
		<button
			onclick={() => {
				gameMode = 'timer';
				startNewGame();
			}}
			class="rounded-lg px-6 py-3 font-semibold transition-all
           {gameMode === 'timer'
				? 'bg-indigo-600 text-white shadow-lg'
				: 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}"
		>
			⏱️ Timer Mode
		</button>
	</div>

	<div class="grid gap-8 lg:grid-cols-3">
		<!-- Main Game Area -->
		<div class="space-y-6 lg:col-span-2">
			<!-- Input Area -->
			<div
				class="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg md:p-8 dark:border-gray-800 dark:bg-gray-900"
			>
				<div class="mb-6 flex items-center justify-between">
					<h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
						Guess #{guessCount + 1}
					</h2>
					<button
						onclick={() => (showRules = !showRules)}
						class="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
					>
						{showRules ? 'Hide' : 'Show'} Rules
					</button>
				</div>

				{#if showRules}
					<div
						class="mb-6 rounded-lg border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-800 dark:bg-indigo-900/20"
					>
						<div class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
							<p><strong>💀 Killed:</strong> Right number, right position</p>
							<p><strong>🤕 Injured:</strong> Right number, wrong position</p>
							<p><strong>Goal:</strong> Get 4 killed to win!</p>
						</div>
					</div>
				{/if}

				<!-- Number Input Grid -->
				<div class="mb-6 flex justify-center gap-3">
					{#each [0, 1, 2, 3] as index}
						<input
							bind:this={inputRefs[index]}
							type="text"
							inputmode="numeric"
							maxlength="1"
							value={currentGuess[index] || ''}
							oninput={(e) => handleInput(index, e)}
							onkeydown={(e) => handleKeyDown(index, e)}
							onpaste={handlePaste}
							disabled={gameStatus !== 'playing'}
							class="h-16 w-16 rounded-xl border-2 text-center text-2xl font-bold md:h-20 md:w-20 md:text-3xl
                     {currentGuess[index]
								? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
								: 'border-gray-300 dark:border-gray-700'}
                     bg-white text-gray-900 transition-all duration-200
                     focus:border-indigo-500 focus:ring-4
                     focus:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800
                     dark:text-gray-100 dark:focus:ring-indigo-700"
						/>
					{/each}
				</div>

				<!-- Available Numbers Helper -->
				<div class="mb-6 text-center">
					<div class="mb-2 text-xs text-gray-500 dark:text-gray-400">Available Numbers</div>
					<div class="flex flex-wrap justify-center gap-2">
						{#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as num}
							<div
								class="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold
                          {availableNumbers.includes(num)
									? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
									: 'bg-gray-200 text-gray-400 line-through dark:bg-gray-700 dark:text-gray-600'}"
							>
								{num}
							</div>
						{/each}
					</div>
				</div>

				<!-- Action Buttons -->
				<div class="flex gap-3">
					<button
						onclick={submitGuess}
						disabled={gameStatus !== 'playing' || currentGuess.some((n) => n === '')}
						class="flex-1 transform rounded-lg bg-indigo-600 px-6 py-4 font-semibold
                   text-white shadow-md transition-all duration-200 hover:scale-105
                   hover:bg-indigo-700 hover:shadow-lg
                   active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50 dark:disabled:bg-gray-700"
					>
						Submit Guess
					</button>
					<button
						onclick={giveUp}
						disabled={gameStatus !== 'playing'}
						class="rounded-lg bg-gray-200 px-6 py-4 font-semibold text-gray-800
                   transition-all duration-200 hover:bg-gray-300 disabled:cursor-not-allowed
                   disabled:opacity-50 dark:bg-gray-800
                   dark:text-gray-200 dark:hover:bg-gray-700"
					>
						Give Up
					</button>
				</div>
			</div>

			<!-- Guess History -->
			<div
				class="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg md:p-8 dark:border-gray-800 dark:bg-gray-900"
			>
				<h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">Guess History</h2>

				{#if guessHistory.length === 0}
					<div class="py-12 text-center">
						<div class="mb-4 text-5xl">🤔</div>
						<p class="text-gray-500 dark:text-gray-400">No guesses yet. Make your first attempt!</p>
					</div>
				{:else}
					<div class="max-h-96 space-y-3 overflow-y-auto">
						{#each guessHistory.slice() as history}
							<div
								class="flex flex-col items-center justify-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 md:flex-row md:justify-between md:gap-2 dark:border-gray-700 dark:bg-gray-800"
							>
								<div class="flex items-center space-x-1.5 md:space-x-4">
									<div class="w-12 text-sm font-medium text-gray-500 dark:text-gray-400">
										#{history.number}
									</div>
									<div class="flex space-x-2">
										{#each history.guess as num}
											<div
												class="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-lg font-bold text-gray-900 md:h-10 md:w-10 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
											>
												{num}
											</div>
										{/each}
									</div>
								</div>
								<div class="flex space-x-3">
									<span
										class="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold whitespace-nowrap text-green-800 dark:bg-green-900/30 dark:text-green-400"
									>
										💀 {history.killed}
									</span>
									<span
										class="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold whitespace-nowrap text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
									>
										🤕 {history.injured}
									</span>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<!-- Sidebar -->
		<div class="space-y-6">
			{#if gameMode === 'timer'}
				<TimerMode
					bind:this={timerRef}
					isActive={gameStatus === 'playing'}
					onTimeUp={handleTimeUp}
					initialTime={180}
				/>
			{:else}
				<!-- Game Stats Card -->
				<div
					class="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900"
				>
					<h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Current Game</h3>
					<div class="space-y-3">
						<div class="flex items-center justify-between">
							<span class="text-gray-600 dark:text-gray-400">Guesses Made</span>
							<span class="text-2xl font-bold text-indigo-600 dark:text-indigo-400"
								>{guessCount}</span
							>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-gray-600 dark:text-gray-400">Status</span>
							<span
								class="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
							>
								{gameStatus === 'playing'
									? 'In Progress'
									: gameStatus === 'won'
										? 'Won!'
										: 'Gave Up'}
							</span>
						</div>
					</div>
				</div>
			{/if}

			<!-- Tips Card -->
			<div
				class="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6 dark:border-purple-900 dark:from-purple-950/30 dark:to-pink-950/30"
			>
				<h3 class="mb-3 flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100">
					<span class="mr-2">💡</span>
					Quick Tips
				</h3>
				<ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
					<!-- <li>• Start with different numbers (e.g., 1234, then 5678)</li> -->
					<li>• Track which numbers appear as killed/injured</li>
					<li>• 0 killed + 0 injured = none of those numbers</li>
					<li>• Use process of elimination systematically</li>
				</ul>
			</div>

			<!-- Actions -->
			<div class="space-y-3">
				<button
					onclick={viewStats}
					class="w-full rounded-lg bg-indigo-100 px-4 py-3 font-semibold text-indigo-700 transition-colors duration-200 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50"
				>
					View Statistics
				</button>
				<button
					onclick={startNewGame}
					class="w-full rounded-lg bg-gray-200 px-4 py-3 font-semibold text-gray-800 transition-colors duration-200 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
				>
					New Game
				</button>
			</div>
		</div>
	</div>

	<!-- Win Modal -->
	{#if gameStatus === 'won'}
		<div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
			<div
				class="animate-bounce-in w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl dark:border-gray-800 dark:bg-gray-900"
			>
				<div class="text-center">
					<div class="mb-4 text-6xl">🎉</div>
					<h2 class="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">Congratulations!</h2>
					<p class="mb-6 text-lg text-gray-600 dark:text-gray-400">
						You cracked the code in <span class="font-bold text-indigo-600 dark:text-indigo-400"
							>{guessCount}</span
						> guesses!
					</p>

					<div class="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
						<div class="mb-2 text-sm text-gray-600 dark:text-gray-400">The secret code was:</div>
						<div class="flex justify-center space-x-2">
							{#each secretCode as num}
								<div
									class="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500 text-xl font-bold text-white"
								>
									{num}
								</div>
							{/each}
						</div>
					</div>

					<div class="flex gap-3">
						<button
							onclick={startNewGame}
							class="flex-1 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-indigo-700"
						>
							Play Again
						</button>
						<button
							onclick={viewStats}
							class="flex-1 rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-800 transition-colors duration-200 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
						>
							View Stats
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Give Up Modal -->
	{#if gameStatus === 'gave-up' || gameStatus === 'time-up'}
		<div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
			<div
				class="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl dark:border-gray-800 dark:bg-gray-900"
			>
				<div class="text-center">
					<div class="mb-4 text-6xl">😔</div>
					<h2 class="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
						Better Luck Next Time!
					</h2>
					<p class="mb-6 text-lg text-gray-600 dark:text-gray-400">The secret code was:</p>

					<div class="mb-6 flex justify-center space-x-2">
						{#each secretCode as num}
							<div
								class="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-500 text-xl font-bold text-white"
							>
								{num}
							</div>
						{/each}
					</div>

					<div class="flex gap-3">
						<button
							onclick={startNewGame}
							class="flex-1 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-indigo-700"
						>
							Try Again
						</button>
						<button
							onclick={viewStats}
							class="flex-1 rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-800 transition-colors duration-200 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
						>
							View Stats
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	@keyframes bounce-in {
		0% {
			opacity: 0;
			transform: scale(0.3);
		}
		50% {
			opacity: 1;
			transform: scale(1.05);
		}
		70% {
			transform: scale(0.9);
		}
		100% {
			transform: scale(1);
		}
	}

	.animate-bounce-in {
		animation: bounce-in 0.5s ease-out;
	}
</style>
