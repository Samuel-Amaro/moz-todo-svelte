<script lang="ts">
  import { createEventDispatcher, tick } from "svelte";
  import type { TypeTodo } from "../../types/todo.type";
  import { selectOnFocus } from "../../action";

  export let todo: TypeTodo;

  //Para criar eventos personalizados, usaremos o createEventDispatcher utilitário. Isso retornará uma dispatch() função que nos permitirá emitir eventos personalizados. Ao despachar um evento, você deve passar o nome do evento e, opcionalmente, um objeto com informações adicionais que deseja passar para cada ouvinte. Esses dados adicionais estarão disponíveis na detail propriedade do objeto de evento.
  //o ttodo componente ira emitir um remove evento, passando a tarefa que esta sendo removida como uma informação adicional.
  const dispatch = createEventDispatcher<{
    remove: TypeTodo; //event remove ira receber um detail paramenter de tipo TypeTodo
    update: TypeTodo; //event update ira receber um detail parameter de tipo TypeTodo
  }>();

  let editing = false;
  let name = todo.name;
  let nameEl: HTMLInputElement; //referncia o input name no dom
  let editButtonPressed = false; // rastreia se o botão de edição foi pressionado, para dar foco a ele após cancelar ou salvar

  function update(updatedTodo: Partial<TypeTodo>) {
    todo = { ...todo, ...updatedTodo };
    //Com dispatch("update", todo) estamos emitindo um update evento, um evento personalizado, e passando como dados adicionais o  todo que está sendo atualizado. O manipulador será chamado com um objeto de evento disponível, com os dados adicionais disponíveis na event.detail propriedade do objeto de evento
    dispatch("update", todo);
  }

  function onCancel() {
    name = todo.name;
    editing = false;
  }

  function onSave() {
    //atualiza o todo name
    update({ id: todo.id, name: name, completed: todo.completed });
    //e sai do modo de edição
    editing = false;
  }

  function onRemove() {
    //emite o remove evento personalizado
    //Com dispatch('remove', todo) estamos emitindo um remove evento,um evento personalizado, e passando como dados adicionais o que todo que está sendo deletado. O manipulador será chamado com um objeto de evento disponível, com os dados adicionais disponíveis na event.detail propriedade do objeto de evento
    dispatch("remove", todo);
  }

  async function onEdit() {
    //entra no modo de edição
    //aqui atualiza um state interno do componente, ao atribuir um valor
    //Quando você atualiza o estado de um componente no Svelte, ele não atualiza o DOM imediatamente. Em vez disso, ele espera até a próxima microtarefa para ver se há alguma outra alteração que precise ser aplicada, inclusive em outros componentes. Isso evita trabalho desnecessário e permite que o navegador agrupe as coisas de maneira mais eficaz.
    //Neste caso, quando editing is false, a edição <input> não fica visível porque não existe no DOM. Dentro da onEdit() função configuramos editing = true e logo em seguida tentamos acessar a nameEl variável e executar nameEl.focus(). O problema aqui é que o Svelte ainda não atualizou o DOM.
    //uma maneira de resolver isso é atrasar até o próximo ciclo de eventos e dar ao Svelte a oportunidade de atualizar o DOM.
    // Svelte oferece uma maneira melhor de lidar com esses casos. A tick() função retorna uma promessa que é resolvida assim que quaisquer alterações de estado pendentes forem aplicadas ao DOM (ou imediatamente, se não houver alterações de estado pendentes).
    editing = true;
    editButtonPressed = true; // usuário pressionou o botão Editar, o foco voltará para o botão Editar
    await tick();
    //define o foco para o input name
    nameEl.focus();
  }

  function onToggle() {
    // atualiza o todo status
    update({
      completed: !todo.completed,
      id: todo.id,
      name: name,
    });
  }

  const focusEditButton = (node: HTMLElement) => {
    if (editButtonPressed) node.focus();
  };
</script>

<div class="stack-small">
  {#if editing}
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <form
      on:submit|preventDefault={onSave}
      class="stack-small"
      on:keydown={(e) => e.key === "Escape" && onCancel()}
    >
      <div class="form-group">
        <label for="todo-{todo.id}" class="todo-label">
          Novo nome para '{todo.name}'
        </label>
        <!--
          - bind:this={dom_node} diretiva. Quando especificado, assim que o componente é montado e o nó DOM é criado, Svelte atribui uma referência ao nó DOM à variável especificada.
        -->
        <input
          bind:value={name}
          bind:this={nameEl}
          type="text"
          id="todo-{todo.id}"
          autocomplete="off"
          class="todo-text"
        />
      </div>
      <div class="btn-group">
        <button class="btn todo-cancel" type="button" on:click={onCancel}>
          Cancelar
          <span class="visually-hidden">renomeando {todo.name}</span>
        </button>
        <button
          class="btn btn__primary todo-edit"
          type="submit"
          disabled={!name}
        >
          Salvar
          <span class="visually-hidden">novo nome para {todo.name} </span>
        </button>
      </div>
    </form>
  {:else}
    <div class="c-cb">
      <input
        type="checkbox"
        id="todo-{todo.id}"
        on:click={onToggle}
        checked={todo.completed}
      />
      <label for="todo-{todo.id}" class="todo-label">
        {todo.name}
      </label>
    </div>
    <div class="btn-group">
      <!--
        - É aí que as ações do Svelte entram em jogo. Basicamente, eles nos permitem executar uma função sempre que um elemento for adicionado ao DOM e após a remoção do DOM.
        - Com esta diretiva estamos dizendo ao Svelte para executar esta função, passando o nó DOM do <input> como parâmetro, assim que o componente for montado no DOM. Também será responsável por executar a destroy função quando o componente for removido do DOM. Assim, com a use diretiva, Svelte cuida do ciclo de vida do componente para nós.
        - usamos a diretiva use:focusEditButton para adicionar focus ao elemento button editar 
      -->
      <button type="button" class="btn" on:click={onEdit} use:focusEditButton>
        Editar
        <span class="visually-hidden">{todo.name}</span>
      </button>
      <button type="button" class="btn btn__danger" on:click={onRemove}>
        Excluir
        <span class="visually-hidden">{todo.name}</span>
      </button>
    </div>
  {/if}
</div>
