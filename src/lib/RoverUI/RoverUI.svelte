<script lang="ts">
  import WorldGrid from '../components/WorldGrid.svelte';
  
  let grid: Grid = [];
  let roverDirection: Direction = "N";
  
  function initializeGrid() {
    const size: number = 20;
    let obstacles: number = 0;
    const randomCoord: () => number = () => Math.floor(Math.random() * size);
    const roverX: number = randomCoord();
    const roverY: number = randomCoord();
    
    grid = Array(size).fill(null).map((_, y) => 
      // Para cada fila, creamos una matriz de objetos
      Array(size).fill(null).map((_, x) => {
        const hasObstacle =
        !(x === roverX && y === roverY)
        && Math.random()*100 < 2;
        if (hasObstacle) obstacles++;
        return {
          x,
          y,
          hasRover: x === roverX && y === roverY,
          hasObstacle,
        };
      })
    );
    console.log(roverX, roverY)
  }
  
  import { onMount } from 'svelte';
  onMount(() => {
    initializeGrid();
  });
</script>

<div class="rover-ui">  
  <WorldGrid {grid} {roverDirection} />
</div>

<style>
  .rover-ui {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
  }
</style>
