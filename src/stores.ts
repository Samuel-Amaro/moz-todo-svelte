import { writable } from "svelte/store";
import type { TypeTodo } from "./types/todo.type";
import { localStore } from "./localStore";

//Mas nem todo estado do aplicativo pertence à hierarquia de componentes do seu aplicativo. Por exemplo, informações sobre o usuário logado ou se o tema escuro está selecionado ou não.
//Às vezes, o estado do seu aplicativo precisará ser acessado por vários componentes que não estão hierarquicamente relacionados ou por um módulo JavaScript normal.
//Uma loja é um objeto com um subscribe()método que permite que os interessados ​​sejam notificados sempre que o valor da loja for alterado e um set()método opcional que permite definir novos valores para a loja.
//As lojas são repositórios de dados globais que contêm valores.
//é um armazenamento de dados global, que pode ser acessado por qualquer componente no app
//outra forma de lidar com gerenciamento de estado e usando stores do svelte
//Svelte fornece funções para criar armazenamentos  readable, writable, and derived no svelte/storemódulo.
//aqui estamos criando um store writable(gravavel), Qualquer componente poderá gravar neste armazenamento(Store), estta store possui um valor incicial uma mensagem de string
//Nota: As lojas podem ser definidas e usadas fora dos componentes do Svelte, para que você possa organizá-las da maneira que desejar.
export const alert = writable<string>("Bem-vindo ao aplicativo de lista de tarefas!")

const initialTodos: TypeTodo[] = [
  { id: 1, name: "Crie um aplicativo inicial Svelte", completed: true },
  { id: 2, name: "Crie seu primeiro componente", completed: true }
];

//Usando localStore('mdn-svelte-todo', initialTodos), estamos configurando a loja para salvar os dados no armazenamento web sob a chave mdn-svelte-todo. Também definimos alguns todos como valores iniciais.
export const todos = localStore("mdn-svelte-todo", initialTodos);