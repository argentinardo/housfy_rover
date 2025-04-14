<script lang="ts">
	import WorldGrid from '../components/WorldGrid.svelte';
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
					message: `Has alcanzado el límite de la grilla, se suspende la ejecución de comandos`
				};
			}

			if (obstacles.some(obs => obs.x === newX && obs.y === newY)) {
				return {
					success: false,
					message: `Has encontrado un obstáculo en (${newX}, ${newY}), se suspende la ejecución de comandos`
				};
			}

			this.x = newX;
			this.y = newY;
			return {
				success: true,
				message: `Rover se movió a la posición (${this.x}, ${this.y})`
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
							message: `Rover giró a la izquierda, ahora mira hacia ${this.direction}`
						};
						break;
					case 'R':
						this.turnRight();
						result = {
							success: true,
							message: `Rover giró a la derecha, ahora mira hacia ${this.direction}`
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
		console.log(`Rover inicializado en posición (${x}, ${y}), dirección ${direction}`);
	}

    function autofocusInput(): void {
        const input: HTMLInputElement | null = document.querySelector('.input-command');
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
			console.log('No hay comandos para ejecutar');
			return;
		}

		const moveResult = rover.executeCommands(commands);
		result = moveResult.message || '';
		
		isRoverInDanger = !moveResult.success;

		updateGrid();

		if (moveResult.success) {
			console.log(result);
		} else {
			console.log(result);
		}

		commands = '';
		const roverPos = rover.getPosition();
		rover = new Rover(roverPos.x, roverPos.y, roverPos.direction);
		

	}
	function handleExecuteCommandsClick() {
		if (!commands) {
			console.log('No hay comandos para ejecutar');
		} else {
			executeCommands();
		}
	}
</script>

<div class="rover-ui">
	<WorldGrid {grid} {direction} gridSize={PLANET_SIZE} isInDanger={isRoverInDanger} />
	<CommandInput bind:commands onExecuteCommands={handleExecuteCommandsClick} />
</div>

<style>
	.rover-ui {
		padding: 20px;
		max-width: 800px;
		margin: 0 auto;
	}
</style>
