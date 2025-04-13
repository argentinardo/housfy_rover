// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	export type Direction = 'N' | 'S' | 'E' | 'O';

	export interface Position {
		x: number;
		y: number;
	}

	export interface WorldCell {
		x: number;
		y: number;
		hasRover: boolean;
		hasObstacle: boolean;
	}

	export type Grid = WorldCell[][];
}

export {};
