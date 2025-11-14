<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let isMobileMenuOpen = $state(false);
	let isDarkMode = $state(false);

	const navItems = [
		{ label: 'Home', href: '/' },
		{ label: 'Play', href: '/game' },
		{ label: 'How to Play', href: '/how-to-play' },
		{ label: 'Stats', href: '/stats' }
	];

	onMount(() => {
		// Check for saved theme preference or default to light mode
		const savedTheme = localStorage.getItem('theme');
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

		if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
			isDarkMode = true;
			document.documentElement.classList.add('dark');
		}

		// Close mobile menu on escape key
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isMobileMenuOpen) {
				closeMobileMenu();
			}
		};
		window.addEventListener('keydown', handleEscape);
		return () => window.removeEventListener('keydown', handleEscape);
	});

	function toggleDarkMode() {
		isDarkMode = !isDarkMode;
		if (isDarkMode) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	}

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
		// Prevent body scroll when menu is open
		if (isMobileMenuOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
	}

	function closeMobileMenu() {
		isMobileMenuOpen = false;
		document.body.style.overflow = 'unset';
	}

	function handleNavClick(href: string) {
		closeMobileMenu();
		goto(href);
	}

	// Derived function to check if link is active
	const isActive = $derived((href: string) => $page.url.pathname === href);
</script>

<!-- Navigation Bar -->
<nav
	class="bg-opacity-95 dark:bg-opacity-95 fixed top-0 right-0 left-0 z-50 bg-white shadow-md backdrop-blur-sm dark:bg-gray-900"
>
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo/Brand with Custom Icon -->
			<div class="shrink-0">
				<a
					href="/"
					onclick={(e) => {
						e.preventDefault();
						handleNavClick('/');
					}}
					class="flex items-center space-x-2 text-indigo-600 transition-colors duration-200 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
				>
					<!-- Custom GKAI Icon -->
					<svg class="h-8 w-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
						<!-- Target/Bullseye icon representing the guessing game -->
						<circle cx="20" cy="20" r="18" stroke="currentColor" stroke-width="2" fill="none" />
						<circle cx="20" cy="20" r="13" stroke="currentColor" stroke-width="2" fill="none" />
						<circle cx="20" cy="20" r="8" stroke="currentColor" stroke-width="2" fill="none" />
						<circle cx="20" cy="20" r="3" fill="currentColor" />
						<!-- Four dots representing the 4 numbers -->
						<circle cx="20" cy="6" r="1.5" fill="currentColor" />
						<circle cx="34" cy="20" r="1.5" fill="currentColor" />
						<circle cx="20" cy="34" r="1.5" fill="currentColor" />
						<circle cx="6" cy="20" r="1.5" fill="currentColor" />
					</svg>
					<span class="text-2xl font-bold">GKAI</span>
				</a>
			</div>

			<!-- Desktop Navigation -->
			<div class="hidden items-center space-x-8 md:flex">
				{#each navItems as item}
					<a
						href={item.href}
						onclick={(e) => {
							e.preventDefault();
							handleNavClick(item.href);
						}}
						class="relative py-2 text-base font-medium transition-colors duration-200 {isActive(
							item.href
						)
							? 'text-indigo-600 dark:text-indigo-400'
							: 'text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400'}"
					>
						{item.label}
						{#if isActive(item.href)}
							<span class="absolute right-0 bottom-0 left-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
							></span>
						{/if}
					</a>
				{/each}
			</div>

			<!-- Right side: Dark mode toggle + Mobile menu button -->
			<div class="flex items-center space-x-2">
				<!-- Dark Mode Toggle -->
				<button
					onclick={toggleDarkMode}
					aria-label="Toggle dark mode"
					class="rounded-lg p-2 text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
				>
					{#if isDarkMode}
						<!-- Sun Icon -->
						<svg
							class="h-5 w-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
							></path>
						</svg>
					{:else}
						<!-- Moon Icon -->
						<svg
							class="h-5 w-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
							></path>
						</svg>
					{/if}
				</button>

				<!-- Mobile Menu Button -->
				<button
					onclick={toggleMobileMenu}
					aria-label="Toggle menu"
					aria-expanded={isMobileMenuOpen}
					class="rounded-lg p-2 text-gray-700 transition-colors duration-200 hover:bg-gray-100 md:hidden dark:text-gray-300 dark:hover:bg-gray-800"
				>
					{#if isMobileMenuOpen}
						<!-- X Icon -->
						<svg
							class="h-6 w-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							></path>
						</svg>
					{:else}
						<!-- Menu Icon -->
						<svg
							class="h-6 w-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							></path>
						</svg>
					{/if}
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile Menu Dropdown -->
	<div
		class="transition-all duration-300 ease-in-out md:hidden {isMobileMenuOpen
			? 'max-h-screen opacity-100'
			: 'max-h-0 overflow-hidden opacity-0'}"
	>
		<div
			class="space-y-1 border-t border-gray-200 bg-white px-4 pt-2 pb-4 dark:border-gray-800 dark:bg-gray-900"
		>
			{#each navItems as item}
				<a
					href={item.href}
					onclick={(e) => {
						e.preventDefault();
						handleNavClick(item.href);
					}}
					class="block rounded-lg px-4 py-3 text-base font-medium transition-colors duration-200 {isActive(
						item.href
					)
						? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
						: 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}"
				>
					{item.label}
				</a>
			{/each}
		</div>
	</div>
</nav>

<!-- Mobile Menu Backdrop -->
{#if isMobileMenuOpen}
	<div
		class="bg-opacity-50 fixed inset-0 z-40 bg-black md:hidden"
		onclick={closeMobileMenu}
		onkeydown={(e) => e.key === 'Enter' && closeMobileMenu()}
		role="button"
		tabindex="0"
	></div>
{/if}

<!-- Spacer to prevent content from hiding under fixed navbar -->
<div class="h-16"></div>
