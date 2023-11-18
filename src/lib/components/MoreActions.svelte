<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { TypeTodo } from "../../types/todo.type";

  export let todos: TypeTodo[];

  //Para criar eventos personalizados, usaremos o createEventDispatcher utilitário. Isso retornará uma dispatch() função que nos permitirá emitir eventos personalizados. Ao despachar um evento, você deve passar o nome do evento e, opcionalmente, um objeto com informações adicionais que deseja passar para cada ouvinte. Esses dados adicionais estarão disponíveis na detail propriedade do objeto de evento.
  //o MoreActions componente ira emitir um checkAll, removeCompleted evento, personalizados
  const dispatch = createEventDispatcher<{
    checkAll: boolean;
    removeCompleted: null;
  }>();

  let completed = true;

  // emitiremos um checkAllevento para sinalizar que todas as tarefas devem ser marcadas/desmarcadas.
  const checkAll = () => {
    //Com dispatch("checkAll", completed) estamos emitindo um checkAll evento, um evento personalizado, e passando como dados adicionais o completed. O manipulador será chamado com um objeto de evento disponível, com os dados adicionais disponíveis na event.detail propriedade do objeto de evento
    dispatch("checkAll", completed);
    completed = !completed;
  };

  // emitiremos um removeCompleted evento para sinalizar que todas as tarefas concluídas devem ser removidas.
  const removeCompleted = () => {
    //despacha o removeCompleted evento
    dispatch("removeCompleted");
  };

  $: completedTodos = todos.filter((t) => t.completed).length;
</script>

<div class="btn-group">
  <button
    type="button"
    class="btn btn__primary"
    disabled={todos.length === 0}
    on:click={checkAll}>{completed ? "Marcar" : "Desmarcar"} Tudo</button
  >
  <button
    type="button"
    class="btn btn__primary"
    disabled={todos.length === 0}
    on:click={removeCompleted}>Remover concluídos</button
  >
</div>
