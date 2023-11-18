import { writable } from "svelte/store";
import type { JsonValue } from "./types/json.type";
import type { TypeTodo } from "./types/todo.type";

//Para implementar um armazenamento personalizado que salve seu conteúdo no armazenamento da web, precisaremos de um armazenamento gravável que faça o seguinte:
//Lê inicialmente o valor do armazenamento web e, se não estiver presente, inicializa-o com um valor padrão
//Sempre que o valor é modificado, atualiza o próprio armazenamento e também os dados no armazenamento local
//Além disso, como o armazenamento na web suporta apenas o salvamento de valores de string, teremos que converter de objeto para string ao salvar e vice-versa quando carregarmos o valor do armazenamento local.
//Nossa localStore será uma função que quando executada inicialmente lê seu conteúdo do armazenamento web e retorna um objeto com três métodos: subscribe(), set(), e update().
//Ao criarmos um novo arquivo localStore, teremos que especificar a chave do armazenamento web e um valor inicial. Em seguida, verificamos se o valor existe no armazenamento web e, caso contrário, o criamos.
//Usamos os métodos localStorage.getItem(key)e localStorage.setItem(key, value)para ler e gravar informações no armazenamento da web, e os métodos toString()e toObj()(que usam JSON.parse()) funções auxiliares para converter os valores.
//Usamos os métodos localStorage.getItem(key)e localStorage.setItem(key, value)para ler e gravar informações no armazenamento da web, e os métodos toString()e toObj()(que usam JSON.parse()) funções auxiliares para converter os valores.
//Por fim, toda vez que atualizamos o conteúdo da loja, atualizamos também o armazenamento web, com o valor convertido em string.

export function localStore<T extends JsonValue>(key: string, initial: T) {
  // recebe a chave do armazenamento local e um valor inicial

  const toString = (value: T) => JSON.stringify(value, null, 2); // helper function
  const toObj = JSON.parse; // helper function

  if (localStorage.getItem(key) === null) {
    // item não presente no armazenamento local
    localStorage.setItem(key, toString(initial));  // inicializa o armazenamento local com valor inicial
  }

  const saved = toObj(localStorage.getItem(key) as string); //converte para objeto

  const { subscribe, set, update } = writable<T>(saved); // cria o armazenamento(store) gravável subjacente

  return {
    subscribe,
    set: (value: T) => {
      localStorage.setItem(key, toString(value)); // salva também no armazenamento local como uma string
      return set(value);
    },
    update,
  };
};