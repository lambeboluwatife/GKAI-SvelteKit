<script>
	import { goto } from '$app/navigation';

	const features = [
		{
			icon: '🎯',
			title: 'Challenge Your Logic',
			description:
				'Use deductive reasoning and strategic thinking to crack the code. Every guess brings you closer to victory.'
		},
		{
			icon: '📊',
			title: 'Track Your Progress',
			description:
				'See how many attempts it takes to win. Challenge yourself to improve with each game.'
		},
		{
			icon: '🎮',
			title: 'Childhood Nostalgia',
			description:
				'A classic pen-and-paper game from playgrounds and family gatherings, now playable anytime, anywhere.'
		}
	];

	const howItWorks = [
		{
			step: '1',
			title: 'Computer Picks 4 Secret Numbers',
			description: 'Random numbers from 1-9, no repeats'
		},
		{
			step: '2',
			title: 'You Make Your Guess',
			description: 'Enter 4 different numbers in any order'
		},
		{
			step: '3',
			title: 'Get Feedback',
			description:
				'"Killed" = right number, right position. "Injured" = right number, wrong position'
		},
		{
			step: '4',
			title: 'Keep Guessing',
			description: 'Use logic and previous results to crack the code!'
		}
	];

	function startGame() {
		goto('/game');
	}

	function learnHow() {
		goto('/how-to-play');
	}
</script>

<svelte:head>
	<title>GKAI - Getting Killed And Injured | Classic Logic Game</title>
	<meta
		name="description"
		content="Challenge your logic with GKAI, a childhood classic number guessing game. Can you crack the 4-digit code?"
	/>
	<meta property="og:title" content="GKAI - Logic Number Guessing Game" />
	<meta property="og:url" content="https://yourdomain.com/" />
	<meta property="og:description" content="Can you crack the code?" />
	<meta property="og:image" content="/opengraph.png" />

	<!-- Facebook Meta Tags -->
	<meta property="og:url" content="https://gkai-svelte-kit.vercel.app/" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="GKAI - Logic Number Guessing Game" />
	<meta property="og:description" content="Can you crack the code?" />
	<meta property="og:image" content="https://gkai-svelte-kit.vercel.app/opengraph.png" />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="gkai-svelte-kit.vercel.app" />
	<meta property="twitter:url" content="https://gkai-svelte-kit.vercel.app/" />
	<meta name="twitter:title" content="GKAI - Logic Number Guessing Game" />
	<meta name="twitter:description" content="Can you crack the code?" />
	<meta name="twitter:image" content="https://gkai-svelte-kit.vercel.app/opengraph.png" />
</svelte:head>

<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
	<!-- Hero Section -->
	<section class="pt-12 pb-16 md:pt-20 md:pb-24">
		<div class="text-center">
			<!-- Badge -->
			<div
				class="mb-6 inline-flex items-center rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
			>
				<span class="mr-2">🎲</span>
				Classic Logic Game Reimagined
			</div>

			<!-- Main Headline -->
			<h1
				class="mb-6 text-5xl leading-tight font-bold text-gray-900 md:text-6xl lg:text-7xl dark:text-gray-100"
			>
				Getting Killed<br />And Injured
			</h1>

			<!-- Subheadline -->
			<p class="mx-auto mb-8 max-w-3xl text-xl text-gray-600 md:text-2xl dark:text-gray-400">
				Can you crack the code? A childhood classic that challenges your logic and deduction skills.
			</p>

			<!-- CTA Buttons -->
			<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
				<button
					on:click={startGame}
					class="w-full transform rounded-lg bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-indigo-700 hover:shadow-xl sm:w-auto"
				>
					Start Playing Now
				</button>
				<button
					on:click={learnHow}
					class="w-full rounded-lg bg-gray-200 px-8 py-4 text-lg font-semibold text-gray-800 transition-all duration-200 hover:bg-gray-300 sm:w-auto dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
				>
					How to Play
				</button>
			</div>

			<!-- Visual Demo Preview -->
			<div class="mx-auto mt-12 max-w-2xl">
				<div
					class="rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl dark:border-gray-800 dark:bg-gray-900"
				>
					<div class="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">Example Game</div>

					<!-- Sample guess display -->
					<div class="space-y-4">
						<div
							class="flex flex-col items-center rounded-lg bg-gray-50 p-4 md:flex-row md:justify-between dark:bg-gray-800"
						>
							<div class="flex flex-col items-center space-y-2 space-x-3 md:flex-row">
								<span class="font-medium text-gray-500 dark:text-gray-400">Guess #1:</span>
								<div class="flex space-x-2">
									<div
										class="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-xl font-bold dark:border-gray-600 dark:bg-gray-700"
									>
										1
									</div>
									<div
										class="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-xl font-bold dark:border-gray-600 dark:bg-gray-700"
									>
										2
									</div>
									<div
										class="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-xl font-bold dark:border-gray-600 dark:bg-gray-700"
									>
										3
									</div>
									<div
										class="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-xl font-bold dark:border-gray-600 dark:bg-gray-700"
									>
										4
									</div>
								</div>
							</div>
							<div class="mt-4 flex space-x-4 md:mt-0">
								<span
									class="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400"
									>💀 0 Killed</span
								>
								<span
									class="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
									>🤕 2 Injured</span
								>
							</div>
						</div>

						<div
							class="flex flex-col items-center rounded-lg bg-gray-50 p-4 md:flex-row md:justify-between dark:bg-gray-800"
						>
							<div class="flex flex-col items-center space-y-2 space-x-3 md:flex-row">
								<span class="font-medium text-gray-500 dark:text-gray-400">Guess #2:</span>
								<div class="flex space-x-2">
									<div
										class="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-xl font-bold dark:border-gray-600 dark:bg-gray-700"
									>
										2
									</div>
									<div
										class="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-xl font-bold dark:border-gray-600 dark:bg-gray-700"
									>
										4
									</div>
									<div
										class="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-xl font-bold dark:border-gray-600 dark:bg-gray-700"
									>
										6
									</div>
									<div
										class="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-xl font-bold dark:border-gray-600 dark:bg-gray-700"
									>
										8
									</div>
								</div>
							</div>
							<div class="mt-4 flex space-x-4 md:mt-0">
								<span
									class="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400"
									>💀 1 Killed</span
								>
								<span
									class="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
									>🤕 1 Injured</span
								>
							</div>
						</div>
					</div>

					<div class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
						Use clues from each guess to deduce the secret numbers!
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section class="border-t border-gray-200 py-16 dark:border-gray-800">
		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			{#each features as feature}
				<div class="p-6 text-center">
					<div class="mb-4 text-5xl">{feature.icon}</div>
					<h3 class="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
						{feature.title}
					</h3>
					<p class="leading-relaxed text-gray-600 dark:text-gray-400">
						{feature.description}
					</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- How It Works Section -->
	<section class="border-t border-gray-200 py-16 dark:border-gray-800">
		<div class="mb-12 text-center">
			<h2 class="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-gray-100">
				How It Works
			</h2>
			<p class="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
				Simple rules, endless challenge. Here's how to play GKAI.
			</p>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
			{#each howItWorks as item}
				<div class="relative">
					<div
						class="h-full rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
					>
						<div
							class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
						>
							{item.step}
						</div>
						<h3 class="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
							{item.title}
						</h3>
						<p class="text-sm text-gray-600 dark:text-gray-400">
							{item.description}
						</p>
					</div>
					{#if item.step !== '4'}
						<div class="absolute top-1/2 -right-3 hidden -translate-y-1/2 transform lg:block">
							<svg
								class="h-6 w-6 text-indigo-300 dark:text-indigo-700"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fill-rule="evenodd"
									d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</section>

	<!-- Story Section -->
	<section class="border-t border-gray-200 py-16 dark:border-gray-800">
		<div class="mx-auto max-w-4xl">
			<div
				class="rounded-2xl border border-indigo-100 bg-linear-to-br from-indigo-50 to-purple-50 p-8 md:p-12 dark:border-indigo-900/50 dark:from-indigo-950/30 dark:to-purple-950/30"
			>
				<div class="mb-6 flex items-start space-x-2 md:space-x-4">
					<div class="text-4xl">📔</div>
					<div>
						<h2 class="mb-4 text-2xl font-bold text-gray-900 md:text-3xl dark:text-gray-100">
							A Game From My Childhood
						</h2>
						<div class="prose prose-lg text-gray-600 dark:text-gray-300 dark:prose-invert">
							<p class="mb-4">
								GKAI is a logical game I played very well with pen and paper during my childhood
								among friends, family, and adults alike. Everybody loved the game because it's
								challenging and it involves critical use of logic.
							</p>
							<p class="mb-4">
								I recently came across the game in an old diary which I used to play the game back
								then and I thought about making it available online for everyone to play.
							</p>
							<p class="mb-0">
								Now, you can experience the same excitement and challenge that entertained us for
								hours. No pen and paper needed—just your brain and determination to crack the code!
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Final CTA Section -->
	<section class="border-t border-gray-200 py-16 dark:border-gray-800">
		<div class="text-center">
			<h2 class="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-gray-100">
				Ready to Test Your Logic?
			</h2>
			<p class="mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
				Join the challenge and see how many guesses it takes you to crack the code.
			</p>
			<button
				on:click={startGame}
				class="transform rounded-lg bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-indigo-700 hover:shadow-xl"
			>
				Play GKAI Now
			</button>
		</div>
	</section>
</div>

<style>
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	section {
		animation: fadeInUp 0.6s ease-out;
	}
</style>
