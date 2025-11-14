<script lang="ts">
	import { goto } from '$app/navigation';

	function handleNavClick(href: string) {
		goto(href);
	}
</script>

<footer class="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
	<div class="mx-auto max-w-7xl px-4 py-8">
		<div class="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
			<div class="text-sm text-gray-600 dark:text-gray-400">
				© {new Date().getFullYear()} GKAI. A childhood game brought to life.
			</div>
			<div class="flex items-center space-x-6">
				<a
					href="https://github.com/lambeboluwatife/GKAI"
					target="_blank"
					rel="noopener noreferrer"
					class="text-sm text-gray-600 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
				>
					GitHub
				</a>
				<a
					href="/how-to-play"
					onclick={(e) => {
						e.preventDefault();
						handleNavClick('/how-to-play');
					}}
					class="text-sm text-gray-600 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
				>
					How to Play
				</a>
			</div>
		</div>
	</div>
</footer>
