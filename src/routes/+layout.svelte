<script lang="ts">
	import '../app.css';
	import NavBar from '../components/NavBar.svelte';
	import Footer from '../components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<meta name="author" content="Lambe Boluwatife" />
	<link rel="canonical" href="https://gkai-svelte-kit.vercel.app/" />
	<meta
		name="description"
		content="Challenge your logic with GKAI, the classic number guessing game. Use deduction to crack the code."
	/>
	<meta
		name="keywords"
		content="GKAI, logic game, number guessing, code breaker, childhood games, deduction game, SvelteKit game, getting killed and injured, getting killed and injured game, getting killed and injured online, getting killed and injured game online"
	/>
	<meta property="og:title" content="GKAI - Logic Number Guessing Game" />
	<meta
		property="og:description"
		content="Challenge your brain with GKAI. The classic pen-and-paper game now available online!"
	/>
	<meta name="google-site-verification" content="ttDOsBdqBJl0H2cX75G3DZBb7ina4fUvzKTF0FA8N70" />
	<meta property="og:url" content="https://gkai-svelte-kit.vercel.app/" />
	<meta property="og:image" content="https://gkai-svelte-kit.vercel.app/og-image.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content="https://gkai-svelte-kit.vercel.app/" />
	<meta name="twitter:title" content="GKAI - Logic Number Guessing Game" />
	<meta
		name="twitter:description"
		content="Challenge your brain with GKAI. The classic pen-and-paper game now available online!"
	/>
	<meta name="twitter:image" content="https://gkai-svelte-kit.vercel.app/og-image.png" />
	<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="shortcut icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<meta name="apple-mobile-web-app-title" content="GKAI" />
	<link rel="manifest" href="/site.webmanifest" />
</svelte:head>

<NavBar />
<main class="min-h-screen bg-gray-50 transition-colors duration-200 dark:bg-gray-950">
	{@render children?.()}
</main>
<Footer />

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>
