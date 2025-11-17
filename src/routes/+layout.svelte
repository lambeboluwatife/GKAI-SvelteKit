<script lang="ts">
	import '../app.css';
	import NavBar from '../components/NavBar.svelte';
	import Footer from '../components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<meta name="author" content="Lambe Boluwatife" />
	<link rel="canonical" href="https://yourdomain.com" />
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
