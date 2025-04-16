<script lang="ts">
    // Recibir mensajes como propiedad
    export let messages: {text: string, type: string}[] = [];
</script>

<div class="bg-white rounded-lg p-4 mb-4 shadow-sm">
  <h2 class="text-xl font-semibold mb-3 flex items-center">Info</h2>
  <div class="bg-black text-green-500 p-4">
    <div class="h-[200px] overflow-y-scroll custom-scrollbar">
      {#if messages.length === 0}
        <p class="text-gray-500 italic">No hay mensajes. Ingresa comandos para iniciar la misión.</p>
      {:else}
        <ul class="list-none p-0 pr-2.5 m-0">
          {#each messages as message}
            <li class="py-2 px-3 mb-2 border-l-4 {message.type === 'info' ? 'border-blue-500' : message.type === 'success' ? 'border-green-600' : 'border-red-600'}">
              {message.text}
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>
</div>

<style>
  /* Clase para personalizar scrollbar que no tiene equivalente en Tailwind */
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(120, 255, 120, 0.5) rgba(0, 0, 0, 0.2);
    border-right: 2px solid rgba(120, 255, 120, 0.2);
  }
  
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(120, 255, 120, 0.5);
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.3);
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(120, 255, 120, 0.8);
  }
</style>
  