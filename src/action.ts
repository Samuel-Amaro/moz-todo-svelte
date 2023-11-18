// definiremos uma função chamada selectOnFocus() que receberá um nó como parâmetro. A função adicionará um ouvinte de evento a esse nó para que, sempre que ele for focado, selecione o texto.
export function selectOnFocus(node: HTMLInputElement) {
  if (node && typeof node.select === "function") {
    // certifique-se de que o nó esteja definido e tenha um método select()
    const onFocus = (event: FocusEvent) => node.select(); // event handler
    // quando o nó recebe foco chama onFocus()
    node.addEventListener("focus", onFocus);
    //Então ele retornará um objeto com uma destroypropriedade. A destroypropriedade é o que o Svelte executará após remover o nó do DOM. Aqui removeremos o ouvinte para garantir que não deixaremos nenhum vazamento de memória para trás.
    return {
      // isso será executado quando o nó for removido do DOM
      destroy: () => node.removeEventListener("focus", onFocus),
    };
  }
}