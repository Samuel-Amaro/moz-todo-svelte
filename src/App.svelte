<script lang="ts">
  import Alert from "./lib/components/Alert.svelte";
  import Todos from "./lib/components/Todos.svelte";
  import { todos } from "./stores";
</script>

<Alert />
<!--
  -  precisamos de alguma maneira para que nosso Todos componente devolva as tarefas atualizadas ao seu pai. Poderíamos emitir um evento atualizado com a lista de tarefas, mas é mais fácil apenas vincular a todos variável.
  - Nota: <Todos bind:todos /> é apenas um atalho para <Todos bind:todos={todos} />
-->
<Todos bind:todos={$todos} />
