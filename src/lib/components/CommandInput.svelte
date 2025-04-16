<script lang="ts">
	export let commands: string = '';

	export let onExecuteCommands: () => void;

	function validateCommands(input: string): string {
		const upperInput = input.toUpperCase();

		const validChars = ['F', 'L', 'R'];
		const invalidChars = upperInput.split('').filter((char) => !validChars.includes(char));

		if (invalidChars.length > 0) {
			console.error('tecla invalida');
		}

		return upperInput
			.split('')
			.filter((char) => validChars.includes(char))
			.join('');
	}

	function handleCommandInput(event: Event) {
		const input = (event.target as HTMLInputElement).value;
		commands = validateCommands(input);

		if (commands !== input.toUpperCase()) {
			(event.target as HTMLInputElement).value = commands;
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			onExecuteCommands();
		}
	}
</script>

<div class="mb-4 rounded-lg bg-white p-4 shadow-sm">
	<h2 class="mb-3 text-xl font-semibold">Comandos</h2>
	<p class="mb-2 text-sm">F: Avanzar, L: Girar izquierda, R: Girar derecha</p>
	<div class="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
		<input
			id="input-command"
			type="text"
			bind:value={commands}
			on:input={handleCommandInput}
			on:keydown={handleKeyDown}
			placeholder="Ej: FFRLF"
			class="flex-1 rounded border border-gray-200 p-2 font-mono text-xl font-bold tracking-widest uppercase"
			maxlength="50"
		/>
		<button
			on:click={onExecuteCommands}
			class="flex items-center justify-center rounded px-4 py-2 font-medium transition-colors duration-200 {commands
				? 'bg-green-600 text-white hover:bg-green-700'
				: 'bg-gray-300 text-gray-400'}"
			aria-label="Ejecutar comandos"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-6 w-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
				/>
			</svg>
		</button>
	</div>
</div>

<style>
</style>
