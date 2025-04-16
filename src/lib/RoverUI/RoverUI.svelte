<script lang="ts">
	import WorldGrid from '../components/WorldGrid.svelte';
	import Info from '../components/Info.svelte';
	import CommandInput from '../components/CommandInput.svelte';
	import { onMount } from 'svelte';

	const PLANET_SIZE = 20;
	const MIN_OBSTACLES = 10;
	const MAX_OBSTACLES = 20;
	
	let grid: Grid = [];
	let direction: Direction = '';
	let x = 0;
	let y = 0;
	let rover: Rover;
	let result = '';
	let isRoverInDanger = false;
	let obstacles: Position[] = [];
	let messages: {text: string, type: string}[] = [];

	function addMessage(text: string, type: string = 'info') {
		messages = [{ text, type }, ...messages.slice(0, 4)];
	}

	// Función para convertir dirección de letra a nombre en castellano
	function direccionEnCastellano(dir: Direction): string {
		switch (dir) {
			case 'N': return 'Norte';
			case 'S': return 'Sur';
			case 'E': return 'Este';
			case 'O': return 'Oeste';
			default: return dir;
		}
	}

	class Rover {
		x: number;
		y: number;
		direction: Direction;

		constructor(x: number, y: number, direction: Direction) {
			this.x = x;
			this.y = y;
			this.direction = direction;
		}

		getPosition(): RoverPosition {
			return {
				x: this.x,
				y: this.y,
				direction: this.direction
			};
		}

		turnRight(): void {
			switch (this.direction) {
				case 'N':
					this.direction = 'E';
					break;
				case 'O':
					this.direction = 'N';
					break;
				case 'S':
					this.direction = 'O';
					break;
				case 'E':
					this.direction = 'S';
					break;
			}
		}

		turnLeft(): void {
			switch (this.direction) {
				case 'N':
					this.direction = 'O';
					break;
				case 'E':
					this.direction = 'N';
					break;
				case 'S':
					this.direction = 'E';
					break;
				case 'O':
					this.direction = 'S';
					break;
			}
		}

		moveForward(): MoveResult {
			let newX = this.x;
			let newY = this.y;

			switch (this.direction) {
				case 'N':
					newY = newY - 1;
					break;
				case 'S':
					newY = newY + 1;
					break;
				case 'E':
					newX = newX + 1;
					break;
				case 'O':
					newX = newX - 1;
					break;
			}

			if (newX < 0 || newX >= PLANET_SIZE || newY < 0 || newY >= PLANET_SIZE) {
				return {
					success: false,
					message: `Límite del terreno, se suspende la ejecución de comandos`
				};
			}

			if (obstacles.some(obs => obs.x === newX && obs.y === newY)) {
				return {
					success: false,
					message: `Obstáculo encontrado, se suspende la ejecución de comandos`
				};
			}

			this.x = newX;
			this.y = newY;
			return {
				success: true,
				message: `Comandos ejecutados correctamente`
			};
		}

		executeCommands(commands: string): MoveResult {
			let executedCommands = 0;

			for (let i = 0; i < commands.length; i++) {
				const command = commands[i].toUpperCase();

				let result: MoveResult = { success: true };

				switch (command) {
					case 'F':
						result = this.moveForward();
						break;
					case 'L':
						this.turnLeft();
						result = {
							success: true,
							message: `Rover giró a la izquierda, ahora mira hacia ${direccionEnCastellano(this.direction)}`
						};
						break;
					case 'R':
						this.turnRight();
						result = {
							success: true,
							message: `Rover giró a la derecha, ahora mira hacia ${direccionEnCastellano(this.direction)}`
						};
						break;
					default:
						return {
							success: false,
							message: `Comando desconocido: ${command}`
						};
				}


				if (!result.success) {
					return {
						...result,
                        
					};
				}
			}

			return {
				success: true,
				message: `Comandos ejecutados con éxito.`
			};
		}
	}

	function generateObstacles(roverX: number, roverY: number): Position[] {
		const obstacleCount = Math.floor(Math.random() * (MAX_OBSTACLES - MIN_OBSTACLES + 1)) + MIN_OBSTACLES;
		const obstaclePositions: Position[] = [];
		
		while (obstaclePositions.length < obstacleCount) {
			const x = Math.floor(Math.random() * PLANET_SIZE);
			const y = Math.floor(Math.random() * PLANET_SIZE);
			
			if (x === roverX && y === roverY) {
				continue;
			}
			
			if (!obstaclePositions.some(pos => pos.x === x && pos.y === y)) {
				obstaclePositions.push({ x, y });
			}
		}
		
		return obstaclePositions;
	}

	function initializeGrid() {
		const size: number = PLANET_SIZE;
		const randomCoord: () => number = () => Math.floor(Math.random() * size);
		const roverX: number = randomCoord();
		const roverY: number = randomCoord();
		
		obstacles = generateObstacles(roverX, roverY);

		grid = Array(size)
			.fill(null)
			.map((_, y) =>
				Array(size)
					.fill(null)
					.map((_, x) => {
						const hasObstacle = obstacles.some(obs => obs.x === x && obs.y === y);
						
						return {
							x,
							y,
							hasRover: x === roverX && y === roverY,
							hasObstacle
						};
					})
			);
	}

	function updateGrid() {
		const roverPos = rover.getPosition();
		grid = [];

		for (let y = 0; y < PLANET_SIZE; y++) {
			const row = [];
			for (let x = 0; x < PLANET_SIZE; x++) {
				const hasObstacle = obstacles.some(obs => obs.x === x && obs.y === y);
				
				row.push({
					x,
					y,
					hasRover: x === roverPos.x && y === roverPos.y,
					hasObstacle
				});
			}
			grid.push(row);
		}

		const position = rover.getPosition();
		x = position.x;
		y = position.y;
		direction = position.direction;
	}

	function getRandomDirection(): Direction {
		const directions: Direction[] = ['N', 'E', 'S', 'O'];
		return directions[Math.floor(Math.random() * 4)];
	}

	function initRover() {
		x = Math.floor(Math.random() * PLANET_SIZE);
		y = Math.floor(Math.random() * PLANET_SIZE);
		direction = getRandomDirection();

		rover = new Rover(x, y, direction);

		updateGrid();
		addMessage(`El rover se encuentra en las coordenadas: x${x}, y${y}, dirección ${direccionEnCastellano(direction)}`, 'info');
	}

    function autofocusInput(): void {
        const input: HTMLInputElement | null = document.querySelector('#input-command');
        if (input) {
            input.focus();
        }
    }

	onMount(() => {
		initializeGrid();
		initRover();
        autofocusInput();
	});

	let commands = '';
	function executeCommands() {
		if (!commands) {
			addMessage('No hay comandos para ejecutar', 'error');
			return;
		}

		const moveResult = rover.executeCommands(commands);
		result = moveResult.message || '';
		
		isRoverInDanger = !moveResult.success;

		updateGrid();

		if (moveResult.success) {
			addMessage(result, 'success');
		} else {
			addMessage(result, 'error');
		}

		commands = '';
		const roverPos = rover.getPosition();
		rover = new Rover(roverPos.x, roverPos.y, roverPos.direction);
		

	}
	function handleExecuteCommandsClick() {
		if (!commands) {
			addMessage('No hay comandos para ejecutar', 'error');
		} else {
			executeCommands();
		}
	}
</script>

<div class="p-5 max-w-7xl mx-auto">
    <h1 class="text-xxl font-semibold mb-3 s-cSJp0KO92mMg text-3xl text-white">Misión Rover - Damián Nardini</h1>
  
  <!-- Layout de escritorio (>1200px): mapa a la izquierda, comandos/info a la derecha -->
  <div class="flex flex-col xl:flex-row gap-5">
    <!-- Primera columna (mapa) - Ahora usa 2/3 en lugar de 3/4 -->
    <div class="w-full xl:w-2/3">
      <!-- Contenedor para mantener el aspecto 1:1 del mapa -->
      <div class="aspect-square w-full">
        <WorldGrid {grid} {direction} gridSize={PLANET_SIZE} isInDanger={isRoverInDanger} />
      </div>
    </div>
    
    <!-- Segunda columna (comandos + info) - Ahora usa 1/3 en lugar de 1/4 -->
    <div class="w-full xl:w-1/3">
      <!-- En pantallas pequeñas, CommandInput e Info van lado a lado -->
      <div class="flex flex-col md:flex-row xl:flex-col gap-4">
        <!-- CommandInput ocupa todo el ancho en XL, la mitad en md y todo en móvil -->
        <div class="w-full md:w-1/2 xl:w-full">
          <CommandInput bind:commands onExecuteCommands={handleExecuteCommandsClick} />
        </div>
        
        <!-- Info ocupa todo el ancho en XL, la mitad en md y todo en móvil -->
        <div class="w-full md:w-1/2 xl:w-full">
          <Info {messages} />
        </div>
      </div>
    </div>
  </div>
</div>

<style>
</style>
