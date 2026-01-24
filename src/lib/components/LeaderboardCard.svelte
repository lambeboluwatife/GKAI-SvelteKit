<script lang="ts">
	let { entry } = $props<{
		entry: {
			rank: number;
			username: string;
			value: string | number;
			level: number;
			tier?: string;
		};
	}>();

	const rankStyles = {
		1: {
			border: 'border-yellow-400',
			bg: 'bg-yellow-50 dark:bg-yellow-900/10',
			icon: '🥇',
			text: 'text-yellow-700 dark:text-yellow-400',
			accent: 'bg-yellow-400'
		},
		2: {
			border: 'border-gray-300',
			bg: 'bg-gray-50 dark:bg-gray-800/50',
			icon: '🥈',
			text: 'text-gray-700 dark:text-gray-300',
			accent: 'bg-gray-400'
		},
		3: {
			border: 'border-amber-600',
			bg: 'bg-amber-50 dark:bg-amber-900/10',
			icon: '🥉',
			text: 'text-amber-700 dark:text-amber-500',
			accent: 'bg-amber-600'
		}
	} as any;

	const style = $derived(rankStyles[entry.rank]);
</script>

<div
	class="relative flex flex-col items-center rounded-2xl border-2 p-6 transition-all hover:scale-105 {style.border} {style.bg}"
>
	<div
		class="absolute -top-4 flex h-10 w-10 items-center justify-center rounded-full text-2xl shadow-md {style.accent}"
	>
		{style.icon}
	</div>

	<div class="relative mb-3">
		<div
			class="flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl font-bold shadow-inner dark:bg-gray-800"
		>
			{entry.username.charAt(0).toUpperCase()}
		</div>
		{#if entry.tier}
			<div class="absolute -right-2 -bottom-2 text-2xl drop-shadow-sm">
				{entry.tier}
			</div>
		{/if}
	</div>

	<div class="flex items-center gap-2">
		<h3 class="mb-1 text-lg font-bold text-gray-900 dark:text-white">
			{entry.username}
		</h3>
		<span
			class="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-black text-indigo-700 uppercase"
			>LVL {entry.level}</span
		>
	</div>

	<div class="text-3xl font-black {style.text}">
		{entry.value}
	</div>
</div>
