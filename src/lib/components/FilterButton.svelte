<script lang="ts">
  import { Filter } from "../../types/filter.type";

  export let filter: Filter = Filter.TODOS;
</script>

<!-- Filter -->
<div class="filters btn-group stack-exception">
  <button
    class="btn toggle-btn"
    class:btn__primary={filter === "todos"}
    aria-pressed={filter === "todos"}
    on:click={() => (filter = Filter.TODOS)}
  >
    <span class="visually-hidden">Mostrar</span>
    <span>Todos</span>
    <span class="visually-hidden">Tarefas</span>
  </button>
  <button
    class="btn toggle-btn"
    class:btn__primary={filter === "ativo"}
    aria-pressed={filter === "ativo"}
    on:click={() => (filter = Filter.ATIVO)}
  >
    <span class="visually-hidden">Mostrar</span>
    <span>Ativo(a)</span>
    <span class="visually-hidden">Tarefas</span>
  </button>
  <button
    class="btn toggle-btn"
    class:btn__primary={filter === "concluido"}
    aria-pressed={filter === "concluido"}
    on:click={() => (filter = Filter.CONCLUIDO)}
  >
    <span class="visually-hidden">Mostrar</span>
    <span>Conclúido(a)</span>
    <span class="visually-hidden">Tarefas</span>
  </button>
</div>
