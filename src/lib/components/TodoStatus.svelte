<script lang="ts">
  import type { TypeTodo } from "../../types/todo.type";

  export let todos: TypeTodo[];

  $: totalTodos = todos.length;
  $: completedTodos = todos.filter((todo) => todo.completed).length;

  let headingEl: HTMLHeadingElement;

  //exportar const, class ou function, sera somente leitura fora do componente
  //expressões de functions são props validos
  //aqui iremos exportar essa function como um valor, somente leitura
  // estes são somente leitura
  //exportação somente leitura
  //usamos export function focus() para expor uma função que dá foco ao <h2> título. Como podemos acessar esses valores exportados do pai? Assim como você pode vincular a elementos DOM com a bind:this={dom_node} diretiva, você também pode vincular às próprias instâncias de componentes com bind:this={component}. Então, quando você usa bind:this um elemento HTML, você obtém uma referência ao nó DOM, e quando você faz isso em um componente Svelte, você obtém uma referência à instância desse componente.
  export function focus() {
    headingEl.focus();
  }
</script>

<!--
  - bind:this={dom_node} diretiva. Quando especificado, assim que o componente é montado e o nó DOM é criado, Svelte atribui uma referência ao nó DOM à variável especificada.
  -  o uso da bind:this={headingEl} diretiva nos dá uma referência ao nó DOM na variável headingEl.
-->
<h2 id="list-heading" bind:this={headingEl} tabindex="-1">
  {completedTodos} out of {totalTodos} items completed
</h2>
