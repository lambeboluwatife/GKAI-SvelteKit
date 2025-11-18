<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	interface TimerModeProps {
		isActive: boolean;
		onTimeUp?: () => void;
		initialTime?: number; // in seconds
	}

	let { isActive = $bindable(false), onTimeUp, initialTime = 180 }: TimerModeProps = $props();

	let timeRemaining = $state(initialTime); // 3 minutes default
	let intervalId: number | null = null;
	let isRunning = $state(false);
	let isPaused = $state(false);

	// Format time as MM:SS
	const formattedTime = $derived(() => {
		const minutes = Math.floor(timeRemaining / 60);
		const seconds = timeRemaining % 60;
		return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	});

	// Get color based on time remaining
	const timeColor = $derived(() => {
		if (timeRemaining <= 30) return 'text-red-600 dark:text-red-400';
		if (timeRemaining <= 60) return 'text-yellow-600 dark:text-yellow-400';
		return 'text-green-600 dark:text-green-400';
	});

	// Get background color for timer display
	const timeBgColor = $derived(() => {
		if (timeRemaining <= 30)
			return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
		if (timeRemaining <= 60)
			return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
		return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
	});

	// Get progress percentage for visual bar
	const progressPercentage = $derived((timeRemaining / initialTime) * 100);

	function startTimer() {
		if (intervalId) return; // Already running

		isRunning = true;
		isPaused = false;

		intervalId = window.setInterval(() => {
			if (timeRemaining > 0 && !isPaused) {
				timeRemaining--;

				// Warning sound at 30 seconds (you'll implement this with sound effects)
				if (timeRemaining === 30) {
					console.log('⚠️ 30 seconds remaining!');
				}

				// Time's up!
				if (timeRemaining === 0) {
					stopTimer();
					if (onTimeUp) {
						onTimeUp();
					}
				}
			}
		}, 1000);
	}

	function stopTimer() {
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}
		isRunning = false;
	}

	function pauseTimer() {
		isPaused = !isPaused;
	}

	function resetTimer() {
		stopTimer();
		timeRemaining = initialTime;
		isRunning = false;
		isPaused = false;
	}

	// Start timer when mode becomes active
	$effect(() => {
		if (isActive && !isRunning) {
			startTimer();
		} else if (!isActive && isRunning) {
			stopTimer();
		}
	});

	// Cleanup on unmount
	onDestroy(() => {
		stopTimer();
	});

	// Export functions for parent component to use
	export function pause() {
		pauseTimer();
	}

	export function resume() {
		if (isPaused) pauseTimer();
	}

	export function reset() {
		resetTimer();
	}

	export function getTimeRemaining() {
		return timeRemaining;
	}
</script>

<div class="space-y-4">
	<!-- Timer Display -->
	<div class="rounded-xl border-2 p-6 text-center transition-all duration-300 {timeBgColor()}">
		<div class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
			{isPaused ? '⏸️ Paused' : '⏱️ Time Remaining'}
		</div>
		<div class="mb-3 font-mono text-5xl font-bold {timeColor()}">
			{formattedTime()}
		</div>

		<!-- Progress Bar -->
		<div class="relative h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
			<div
				class="h-full transition-all duration-1000 ease-linear {timeRemaining <= 30
					? 'bg-red-500'
					: timeRemaining <= 60
						? 'bg-yellow-500'
						: 'bg-green-500'}"
				style="width: {progressPercentage}%"
			></div>
		</div>

		<!-- Warning Messages -->
		{#if timeRemaining <= 30 && timeRemaining > 0}
			<div class="mt-3 animate-pulse text-sm font-semibold text-red-600 dark:text-red-400">
				⚠️ Hurry! Time is running out!
			</div>
		{:else if timeRemaining === 0}
			<div class="mt-3 text-sm font-semibold text-red-600 dark:text-red-400">⏰ Time's Up!</div>
		{/if}
	</div>

	<!-- Timer Controls (Optional - for testing) -->
	{#if import.meta.env.DEV}
		<div class="flex gap-2">
			<button
				onclick={pauseTimer}
				class="flex-1 rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
			>
				{isPaused ? '▶️ Resume' : '⏸️ Pause'}
			</button>
			<button
				onclick={resetTimer}
				class="flex-1 rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
			>
				🔄 Reset
			</button>
		</div>
	{/if}
</div>

<style>
	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.animate-pulse {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
</style>
