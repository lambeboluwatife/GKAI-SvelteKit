<script>
	import { goto } from '$app/navigation';

	const examples = [
		{
			secret: [2, 9, 8, 1],
			guess: [7, 2, 9, 1],
			killed: 1,
			injured: 2,
			explanation:
				'The number 1 is in position 4 in both secret and guess (KILLED). Numbers 2 and 9 are in the secret but in wrong positions (INJURED). The number 7 is not in the secret at all.'
		},
		{
			secret: [2, 9, 8, 1],
			guess: [2, 9, 8, 1],
			killed: 4,
			injured: 0,
			explanation: 'Perfect match! All 4 numbers are in the exact correct positions. You win! 🎉'
		},
		{
			secret: [2, 9, 8, 1],
			guess: [5, 6, 7, 3],
			killed: 0,
			injured: 0,
			explanation:
				'None of these numbers (5, 6, 7, 3) are in the secret. This means all 4 secret numbers must be from the remaining digits: 1, 2, 4, 8, 9.'
		},
		{
			secret: [2, 9, 8, 1],
			guess: [1, 8, 9, 2],
			killed: 0,
			injured: 4,
			explanation:
				'All 4 numbers are correct but ALL in wrong positions! This is a strong clue - you know the numbers, just need to rearrange them.'
		}
	];

	const strategies = [
		{
			title: 'Start with Different Numbers',
			description:
				'Your first few guesses should use completely different numbers to identify which digits are in the secret code.'
			// tip: 'Try: 1234, then 5678. This quickly narrows down which numbers are present.'
		},
		{
			title: 'Track Your Clues',
			description:
				'Keep mental notes of which numbers have appeared as killed or injured. Use previous results to inform your next guess.'
			// tip: 'If you get 2 injured with [1,2,3,4], you know 2 of these numbers are in the secret.'
		},
		{
			title: 'Test Positions Systematically',
			description:
				'Once you know which numbers are in the code, test different position combinations methodically.'
			// tip: 'If 2,9,8,1 are your numbers but all injured, try swapping pairs: [9,2,1,8], then [8,1,2,9]'
		},
		{
			title: 'Use Process of Elimination',
			description:
				"When you get 0 killed and 0 injured, you've eliminated 4 numbers! Focus on the remaining 5 digits."
			// tip: 'With 9 possible digits (1-9), three guesses can potentially narrow to the exact 4 numbers.'
		}
	];

	function startPlaying() {
		goto('/game');
	}
</script>

<svelte:head>
	<title>How to Play GKAI - Rules & Instructions</title>
	<meta
		name="description"
		content="Learn how to play GKAI. Understand the rules, killed vs injured mechanics, and strategies to crack the code faster."
	/>
</svelte:head>

<div class="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
	<!-- Page Header -->
	<div class="mb-16 text-center">
		<h1 class="mb-4 text-4xl font-bold text-gray-900 md:text-5xl dark:text-gray-100">
			How to Play GKAI
		</h1>
		<p class="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400">
			Master the rules and learn strategies to crack the code faster
		</p>
	</div>

	<!-- Game Overview -->
	<section class="mb-16">
		<div
			class="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-800 dark:bg-gray-900"
		>
			<h2 class="mb-6 flex items-center text-2xl font-bold text-gray-900 dark:text-gray-100">
				<span class="mr-3 text-3xl">🎯</span>
				Game Objective
			</h2>
			<p class="mb-4 text-lg text-gray-700 dark:text-gray-300">
				The computer selects 4 random numbers between 1 and 9 with no repeats. Your goal is to guess
				these 4 numbers in the exact correct order using logic and deduction.
			</p>
			<div class="mt-6 grid gap-6 md:grid-cols-2">
				<div class="rounded-lg bg-indigo-50 p-4 dark:bg-indigo-900/20">
					<div class="mb-2 font-semibold text-indigo-900 dark:text-indigo-300">✓ Valid Numbers</div>
					<p class="text-sm text-gray-700 dark:text-gray-400">
						Only use digits 1, 2, 3, 4, 5, 6, 7, 8, 9
					</p>
				</div>
				<div class="rounded-lg bg-indigo-50 p-4 dark:bg-indigo-900/20">
					<div class="mb-2 font-semibold text-indigo-900 dark:text-indigo-300">✓ No Repeats</div>
					<p class="text-sm text-gray-700 dark:text-gray-400">
						Each number can only appear once in the code
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Key Concepts -->
	<section class="mb-16">
		<h2 class="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
			Understanding Feedback
		</h2>

		<div class="grid gap-8 md:grid-cols-2">
			<!-- Killed -->
			<div
				class="rounded-2xl border-2 border-green-200 bg-linear-to-br from-green-50 to-emerald-50 p-4 dark:border-green-900 dark:from-green-950/30 dark:to-emerald-950/30"
			>
				<div class="mb-4 flex items-center">
					<div class="mr-3 text-4xl">💀</div>
					<h3 class="text-2xl font-bold text-green-900 dark:text-green-300">Killed</h3>
				</div>
				<p class="mb-4 text-gray-700 dark:text-gray-300">
					A number is <strong>killed</strong> when it's the correct number in the correct position.
				</p>
				<div
					class="rounded-lg border border-green-300 bg-white p-4 dark:border-green-800 dark:bg-gray-900"
				>
					<div class="mb-2 text-sm text-gray-600 dark:text-gray-400">Example:</div>
					<div class="flex items-center justify-between">
						<div>
							<div class="mb-1 text-xs text-gray-500 dark:text-gray-500">Secret Code</div>
							<div class="flex space-x-1">
								<div
									class="flex h-8 w-8 items-center justify-center rounded bg-gray-100 text-xs font-bold md:h-10 md:w-10 md:text-base dark:bg-gray-800"
								>
									2
								</div>
								<div
									class="flex h-8 w-8 items-center justify-center rounded bg-gray-100 text-xs font-bold md:h-10 md:w-10 md:text-base dark:bg-gray-800"
								>
									9
								</div>
								<div
									class="flex h-8 w-8 items-center justify-center rounded bg-gray-100 text-xs font-bold md:h-10 md:w-10 md:text-base dark:bg-gray-800"
								>
									8
								</div>
								<div
									class="flex h-8 w-8 items-center justify-center rounded bg-green-500 text-xs font-bold text-white md:h-10 md:w-10 md:text-base"
								>
									1
								</div>
							</div>
						</div>
						<div class="mt-3 px-1 text-2xl text-gray-400 md:px-2">=</div>
						<div>
							<div class="mb-1 text-xs text-gray-500 dark:text-gray-500">Your Guess</div>
							<div class="flex space-x-1">
								<div
									class="flex h-8 w-8 items-center justify-center rounded bg-gray-100 text-xs font-bold md:h-10 md:w-10 md:text-base dark:bg-gray-800"
								>
									7
								</div>
								<div
									class="flex h-8 w-8 items-center justify-center rounded bg-gray-100 text-xs font-bold md:h-10 md:w-10 md:text-base dark:bg-gray-800"
								>
									2
								</div>
								<div
									class="flex h-8 w-8 items-center justify-center rounded bg-gray-100 text-xs font-bold md:h-10 md:w-10 md:text-base dark:bg-gray-800"
								>
									9
								</div>
								<div
									class="flex h-8 w-8 items-center justify-center rounded bg-green-500 text-xs font-bold text-white md:h-10 md:w-10 md:text-base"
								>
									1
								</div>
							</div>
						</div>
					</div>
					<div class="mt-3 text-center text-sm font-medium text-green-700 dark:text-green-400">
						Position 4: Both have "1" → 1 Killed ✓
					</div>
				</div>
			</div>

			<!-- Injured -->
			<div
				class="rounded-2xl border-2 border-yellow-200 bg-linear-to-br from-yellow-50 to-amber-50 p-4 dark:border-yellow-900 dark:from-yellow-950/30 dark:to-amber-950/30"
			>
				<div class="mb-4 flex items-center">
					<div class="mr-3 text-4xl">🤕</div>
					<h3 class="text-2xl font-bold text-yellow-900 dark:text-yellow-300">Injured</h3>
				</div>
				<p class="mb-4 text-gray-700 dark:text-gray-300">
					A number is <strong>injured</strong> when it exists in the secret code but is in the wrong
					position.
				</p>
				<div
					class="rounded-lg border border-yellow-300 bg-white p-4 dark:border-yellow-800 dark:bg-gray-900"
				>
					<div class="mb-2 text-sm text-gray-600 dark:text-gray-400">Example:</div>
					<div class="flex items-center justify-between">
						<div>
							<div class="mb-1 text-xs text-gray-500 dark:text-gray-500">Secret Code</div>
							<div class="flex space-x-1">
								<div
									class="flex h-8 w-8 items-center justify-center rounded bg-yellow-500 text-xs font-bold text-white md:h-10 md:w-10 md:text-base"
								>
									2
								</div>
								<div
									class="flex h-8 w-8 items-center justify-center rounded bg-yellow-500 text-xs font-bold text-white md:h-10 md:w-10 md:text-base"
								>
									9
								</div>
								<div
									class="flex h-8 w-8 items-center justify-center rounded bg-gray-100 text-xs font-bold md:h-10 md:w-10 md:text-base dark:bg-gray-800"
								>
									8
								</div>
								<div
									class="flex h-8 w-8 items-center justify-center rounded bg-gray-100 text-xs font-bold md:h-10 md:w-10 md:text-base dark:bg-gray-800"
								>
									1
								</div>
							</div>
						</div>
						<div class="mt-3 px-1 text-2xl text-gray-400 md:px-2">=</div>
						<div>
							<div class="mb-1 text-xs text-gray-500 dark:text-gray-500">Your Guess</div>
							<div class="flex space-x-1">
								<div
									class="flex h-8 w-8 items-center justify-center rounded bg-gray-100 text-xs font-bold md:h-10 md:w-10 md:text-base dark:bg-gray-800"
								>
									7
								</div>
								<div
									class="flex h-8 w-8 items-center justify-center rounded bg-yellow-500 text-xs font-bold text-white md:h-10 md:w-10 md:text-base"
								>
									2
								</div>
								<div
									class="flex h-8 w-8 items-center justify-center rounded bg-yellow-500 text-xs font-bold text-white md:h-10 md:w-10 md:text-base"
								>
									9
								</div>
								<div
									class="flex h-8 w-8 items-center justify-center rounded bg-gray-100 text-xs font-bold md:h-10 md:w-10 md:text-base dark:bg-gray-800"
								>
									1
								</div>
							</div>
						</div>
					</div>
					<div class="mt-3 text-center text-sm font-medium text-yellow-700 dark:text-yellow-400">
						"2" and "9" are in secret but wrong spots → 2 Injured ⚠
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Detailed Examples -->
	<section class="mb-16">
		<h2 class="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
			Step-by-Step Examples
		</h2>

		<div class="space-y-6">
			{#each examples as example, i}
				<div
					class="rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-900"
				>
					<div class="mb-4 flex items-start justify-between">
						<div class="flex-1">
							<div class="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
								Example {i + 1}
							</div>

							<div class="mb-4 grid gap-4 md:grid-cols-2">
								<!-- Secret -->
								<div>
									<div class="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
										Secret Code
									</div>
									<div class="flex space-x-2">
										{#each example.secret as num}
											<div
												class="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-gray-300 bg-gray-100 text-lg font-bold text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
											>
												{num}
											</div>
										{/each}
									</div>
								</div>

								<!-- Guess -->
								<div>
									<div class="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
										Your Guess
									</div>
									<div class="flex space-x-2">
										{#each example.guess as num}
											<div
												class="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-indigo-300 bg-indigo-100 text-lg font-bold text-indigo-700 dark:border-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
											>
												{num}
											</div>
										{/each}
									</div>
								</div>
							</div>

							<!-- Result -->
							<div class="mb-3 flex items-center space-x-4">
								<span
									class="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-400"
								>
									💀 {example.killed} Killed
								</span>
								<span
									class="rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
								>
									🤕 {example.injured} Injured
								</span>
							</div>

							<!-- Explanation -->
							<div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
								<div class="text-sm text-gray-700 dark:text-gray-300">
									<strong class="text-gray-900 dark:text-gray-100">Explanation:</strong>
									{example.explanation}
								</div>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Strategies -->
	<section class="mb-16">
		<h2 class="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
			Winning Strategies
		</h2>

		<div class="grid gap-6 md:grid-cols-2">
			{#each strategies as strategy, i}
				<div
					class="rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-900"
				>
					<div class="mb-3 flex items-start space-x-3">
						<div
							class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 md:text-base dark:bg-indigo-900/30 dark:text-indigo-400"
						>
							{i + 1}
						</div>
						<div>
							<h3 class="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
								{strategy.title}
							</h3>
							<p class="mb-3 text-sm text-gray-600 dark:text-gray-400">
								{strategy.description}
							</p>
							<div
								class="rounded-lg border-l-4 border-indigo-500 bg-indigo-50 p-3 dark:bg-indigo-900/20"
							>
								<!-- <div class="mb-1 text-xs font-semibold text-indigo-900 dark:text-indigo-300">
									💡 Pro Tip
								</div> -->
								<!-- <div class="text-sm text-gray-700 dark:text-gray-400">
									{strategy.tip}
								</div> -->
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Game Rules Summary -->
	<section class="mb-16">
		<div
			class="rounded-2xl border border-indigo-200 bg-linear-to-br from-indigo-50 to-purple-50 p-8 dark:border-indigo-900 dark:from-indigo-950/30 dark:to-purple-950/30"
		>
			<h2 class="mb-6 flex items-center text-2xl font-bold text-gray-900 dark:text-gray-100">
				<span class="mr-3 text-3xl">📋</span>
				Quick Rules Summary
			</h2>
			<ul class="space-y-3">
				<li class="flex items-start">
					<span class="mr-3 font-bold text-indigo-600 dark:text-indigo-400">•</span>
					<span class="text-gray-700 dark:text-gray-300"
						>The computer generates 4 random numbers between 1-9 with no repeats</span
					>
				</li>
				<li class="flex items-start">
					<span class="mr-3 font-bold text-indigo-600 dark:text-indigo-400">•</span>
					<span class="text-gray-700 dark:text-gray-300"
						>You enter your guess of 4 different numbers</span
					>
				</li>
				<li class="flex items-start">
					<span class="mr-3 font-bold text-indigo-600 dark:text-indigo-400">•</span>
					<span class="text-gray-700 dark:text-gray-300"
						>Get feedback: "Killed" (right number, right position) and "Injured" (right number,
						wrong position)</span
					>
				</li>
				<li class="flex items-start">
					<span class="mr-3 font-bold text-indigo-600 dark:text-indigo-400">•</span>
					<span class="text-gray-700 dark:text-gray-300"
						>Use the feedback to make better guesses</span
					>
				</li>
				<li class="flex items-start">
					<span class="mr-3 font-bold text-indigo-600 dark:text-indigo-400">•</span>
					<span class="text-gray-700 dark:text-gray-300"
						>Win when you get 4 killed (all numbers in correct positions)</span
					>
				</li>
				<li class="flex items-start">
					<span class="mr-3 font-bold text-indigo-600 dark:text-indigo-400">•</span>
					<span class="text-gray-700 dark:text-gray-300"
						>There's no limit to the number of guesses you can make</span
					>
				</li>
			</ul>
		</div>
	</section>

	<!-- CTA -->
	<section class="text-center">
		<div
			class="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-800 dark:bg-gray-900"
		>
			<h2 class="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
				Ready to Put Your Skills to the Test?
			</h2>
			<p class="mb-6 text-gray-600 dark:text-gray-400">
				Now that you understand the rules, it's time to play!
			</p>
			<button
				on:click={startPlaying}
				class="transform rounded-lg bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-indigo-700 hover:shadow-xl"
			>
				Start Playing Now
			</button>
		</div>
	</section>
</div>
