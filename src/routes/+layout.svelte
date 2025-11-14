<script lang="ts">
	import '../app.css';
	import NavBar from '../components/NavBar.svelte';
	import Footer from '../components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<meta name="author" content="Lambe Boluwatife" />
	<link rel="canonical" href="https://yourdomain.com" />
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
