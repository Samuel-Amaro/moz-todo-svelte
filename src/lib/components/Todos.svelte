<script lang="ts">
  import { Filter } from "../../types/filter.type";
  import type { TypeTodo } from "../../types/todo.type";
  import FilterButton from "./FilterButton.svelte";
  import Todo from "./Todo.svelte";
  import MoreActions from "./MoreActions.svelte";
  import NewTodo from "./NewTodo.svelte";
  import TodoStatus from "./TodoStatus.svelte";
  import type { ComponentType, SvelteComponent } from "svelte";
  import { alert } from "../../stores";

  export let todos: TypeTodo[] = [];
  let todoStatus: TodoStatus; //referencia para a instancia de componente TodoStatus

  $: totalTodos = todos.length;
  let newTodoId: number = 0;

  $: {
    if (totalTodos === 0) newTodoId = 1;
    else newTodoId = Math.max(...todos.map((t) => t.id)) + 1;
  }

  function removeTodo(todo: TypeTodo) {
    todos = todos.filter((t) => t.id !== todo.id);
    todoStatus.focus(); //dá foco ao título de status
    //Escrever para nossa loja(store) é apenas uma questão de importá-lo e executá-lo $store = 'new value'.
    //Então, basicamente, importamos a loja e a atualizamos a cada evento, o que faz com que um novo alerta seja exibido a cada vez.
    //Assim que executarmos $alert = …, o Svelte será executado alert.set(). Nosso Alert componente – como todo assinante do armazenamento de alertas – será notificado quando receber um novo valor e, graças à reatividade do Svelte, sua marcação será atualizada.
    //aqui usamos a sintaxe $
    //Nota: Fora dos componentes do Svelte você não pode usar a $storesintaxe. Isso ocorre porque o compilador Svelte não toca em nada fora dos componentes do Svelte. Nesse caso, você terá que confiar nos métodos store.subscribe()e store.set().
    $alert = `Todo '${todo.name}' foi excluído`;
  }

  //function que lida com o evento emitido pelo componente NewTodo
  function addTodo(name: string) {
    todos = [...todos, { id: newTodoId, name: name, completed: false }];
    $alert = `Todo '${name}' foi adicionado`;
  }

  let filter: Filter = Filter.TODOS;

  $: {
    if (filter === Filter.TODOS) {
      $alert = "Navegando em todas as tarefas";
    } else if (filter === Filter.ATIVO) {
      $alert = "Navegando por tarefas ativas";
    } else if (filter === Filter.CONCLUIDO) {
      $alert = "Navegando por tarefas concluídas";
    }
  }

  //function que lida com o evento emitido pelo componentte Todo
  const filterTodos = (filter: Filter, todos: TypeTodo[]) =>
    filter === Filter.ATIVO
      ? todos.filter((t) => !t.completed)
      : filter === Filter.CONCLUIDO
      ? todos.filter((t) => t.completed)
      : todos;

  //function que lida com o evento emitido pelo componentte Todo
  function updateTodo(todo: TypeTodo) {
    const i = todos.findIndex((t) => t.id === todo.id);
    if (todos[i].name !== todo.name)
      $alert = `todo '${todos[i].name}' foi renomeado para '${todo.name}'`;
    if (todos[i].completed !== todo.completed)
      $alert = `todo '${todos[i].name}' marcado como ${
        todo.completed ? "concluído(a)" : "ativo"
      }`;
    todos[i] = { ...todos[i], ...todo };
  }

  //essa function ira lidar com o eventos emitidos pelo MoreActions componente
  const checkAllTodos = (completed: boolean) => {
    todos.forEach((t) => (t.completed = completed));
    todos = todos;
    $alert = `${completed ? "Verificado(a)" : "Desmarcado(a)"} ${
      todos.length
    } to-dos`;
  };

  //essa function ira lidar com o eventos emitidos pelo MoreActions componente
  const removeCompletedTodos = () => {
    $alert = `Removido(a) ${todos.filter((t) => t.completed).length} to-dos`;
    todos = todos.filter((t) => !t.completed);
  };
</script>

<div class="todoapp stack-large">
  <!--
    - uma forma de compartilhar dados entre componentes pai e filho
    - Uma abordagem diferente é o padrão de comunicação “props-down, events-up”.
  -->
  <NewTodo autofocus on:addTodo={(e) => addTodo(e.detail)} />

  <!--
    - uma forma de compartilhar dados entre componentes pai e filho
    - Os dados normalmente fluem de pai para filho usando adereços. Se quisermos que também flua no sentido contrário, do filho para o pai, podemos usar a bind:diretiva
    - Usando bind, diremos ao Svelte que quaisquer alterações feitas na filter propriedade do FilterButton componente devem ser propagadas de volta para o componente pai Todos,. Ou seja, vincularemos o filter valor da variável no pai ao seu valor no filho.
  -->
  <FilterButton bind:filter />

  <!--
    - Portanto, para vincular à instância de TodosStatus
    -  Assim como você pode vincular a elementos DOM com a bind:this={dom_node}diretiva, você também pode vincular às próprias instâncias de componentes com bind:this={component}. Então, quando você usa bind:thisum elemento HTML, você obtém uma referência ao nó DOM, e quando você faz isso em um componente Svelte, você obtém uma referência à instância desse componente.
    - armazenamos uma referencia a essa instancia desse componente na varaivel todoStatus
  -->
  <TodoStatus bind:this={todoStatus} {todos} />

  <ul role="list" class="todo-list stack-large" aria-labelledby="list-heading">
    {#each filterTodos(filter, todos) as todo (todo.id)}
      <li class="todo">
        <!--
          - uma forma de compartilhar dados entre componentes pai e filho
          - Uma abordagem diferente é o padrão de comunicação “props-down, events-up”.
          - Basicamente, esse padrão depende de componentes filhos que recebem dados de seus pais por meio de adereços(props) e componentes pais atualizando seu estado manipulando eventos emitidos por componentes filhos. Assim, os adereços fluem de pai para filho e os eventos borbulham de filho para pai. Esse padrão estabelece um fluxo bidirecional de informações, que é previsível e mais fácil de raciocinar.
          - aqui vamos ouvir o evento de dentro do componente pai de Todo e agir de acordo, adicionando um manipulador que ira atualizar o state interno aqui do componente pai
          - todo={todo} === {todo}
        -->
        <Todo
          {todo}
          on:remove={(e) => {
            //Nosso manipulador recebe o eparâmetro (o objeto de evento), que conforme descrito anteriormente contém a tarefa que está sendo excluída da detail propriedade.
            //evento personalizado
            //adicionamos um manipulador de evento para o evento personalizado remove emitido pelo componente Todo
            removeTodo(e.detail);
          }}
          on:update={(e) => {
            //adicionamos um manipulador de evento para o evento personalizado update emitido pelo componente Todo
            updateTodo(e.detail);
          }}
        />
      </li>
    {:else}
      <li>Nada para fazer aqui!</li>
    {/each}
  </ul>

  <hr />

  <!--
    - uma forma de compartilhar dados entre componentes pai e filho
    - Uma abordagem diferente é o padrão de comunicação “props-down, events-up”.
  -->
  <MoreActions
    {todos}
    on:checkAll={(e) => checkAllTodos(e.detail)}
    on:removeCompleted={removeCompletedTodos}
  />
</div>
