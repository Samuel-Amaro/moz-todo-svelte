<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { selectOnFocus } from "../../action";

  //Quando um componente é instanciado, Svelte executa o código de inicialização (ou seja, a <script> seção do componente). Mas nesse momento, todos os nós que compõem o componente não estão anexados ao DOM, na verdade, eles nem existem.
  //Então, como saber quando o componente já foi criado e montado no DOM? A resposta é que cada componente tem um ciclo de vida que começa quando é criado e termina quando é destruído.
  //Existem várias funções que permitem executar código em momentos importantes durante esse ciclo de vida.
  //O que você usará com mais frequência é o onMount(), que nos permite executar um callback assim que o componente for montado no DOM.
  onMount(() => {
    //se o foco automático for verdadeiro, executamos nameEl.focus()
    if (autofocus) nameEl.focus();
  });

  //Para criar eventos personalizados, usaremos o createEventDispatcher utilitário. Isso retornará uma dispatch() função que nos permitirá emitir eventos personalizados. Ao despachar um evento, você deve passar o nome do evento e, opcionalmente, um objeto com informações adicionais que deseja passar para cada ouvinte. Esses dados adicionais estarão disponíveis na detail propriedade do objeto de evento.
  //o NewTodo componente ira emitir um addTodo, evento, personalizados
  const dispatch = createEventDispatcher<{
    addTodo: string;
  }>();

  export let autofocus = false;

  let name = "";
  let nameEl: HTMLInputElement; //referencia o input name nó DOM

  //ira emitir um addTodo evento passando o nome da nova tarefa
  const addTodo = () => {
    //Com dispatch() estamos emitindo um addTTodo evento, um evento personalizado, e passando como dados adicionais o name na nova tarefa. O manipulador será chamado com um objeto de evento disponível, com os dados adicionais disponíveis na event.detail propriedade do objeto de evento
    dispatch("addTodo", name);
    name = "";
    nameEl.focus(); //dá foco à entrada do nome
  };

  const onCancel = () => {
    name = "";
    nameEl.focus(); //dá foco à entrada do nome
  };
</script>

<form
  on:submit|preventDefault={addTodo}
  on:keydown={(e) => e.key === "Escape" && onCancel()}
>
  <h2 class="label-wrapper">
    <label for="todo-0" class="label__lg"> O que precisa ser feito? </label>
  </h2>
  <!--
    - bind:this={dom_node} diretiva. Quando especificado, assim que o componente é montado e o nó DOM é criado, Svelte atribui uma referência ao nó DOM à variável especificada.
    - É aí que as ações do Svelte entram em jogo. Basicamente, eles nos permitem executar uma função sempre que um elemento for adicionado ao DOM e após a remoção do DOM.
    - Com esta diretiva estamos dizendo ao Svelte para executar esta função, passando o nó DOM do <input> como parâmetro, assim que o componente for montado no DOM. Também será responsável por executar a destroy função quando o componente for removido do DOM. Assim, com a use diretiva, Svelte cuida do ciclo de vida do componente para nós.
  -->
  <input
    type="text"
    id="todo-0"
    autocomplete="off"
    class="input input__lg"
    bind:value={name}
    bind:this={nameEl}
    use:selectOnFocus
  />
  <button type="submit" disabled={!name} class="btn btn__primary btn__lg">
    Adicionar
  </button>
</form>
