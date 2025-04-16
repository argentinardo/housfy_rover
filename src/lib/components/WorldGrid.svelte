<script lang="ts">
	import WorldCell from './WorldCell.svelte';

	export let grid: Grid = [];
	export let direction: Direction;
	export let gridSize: number;
	export let isInDanger = false;

</script>

<div class="w-full bg-white rounded-lg p-4 shadow-sm">
	<h2 class="text-xl font-semibold mb-3 flex items-center">Mapa marciano</h2>
	<div
		class="grid gap-px overflow-hidden rounded-md border border-[#11aefa] bg-[#11aefa]"
		style="grid-template-columns: repeat({gridSize}, minmax(0, 1fr));"
	>
		{#each grid as row}
			{#each row as cell}
				<WorldCell
					hasRover={cell.hasRover}
					hasObstacle={cell.hasObstacle}
					{...(cell.hasRover ? { 
						roverDirection: direction,
						isInDanger
					} : {})}
				/>
			{/each}
		{/each}
	</div>
</div>

<style>
	.grid-container {
		border: #11aefa 1px solid;
		display: grid;
		border-collapse: collapse;
		gap: 1px;
		background-color: #11aefa;
	}

	.panel {
		background-color: var(--panel-bg, white);
		padding: 16px;
		border-radius: 8px;
	}

	.panel-title {
		font-size: 20px;
		font-weight: 600;
		margin-bottom: 12px;
		display: flex;
		align-items: center;
	}
</style>
