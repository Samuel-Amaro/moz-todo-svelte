<script lang="ts">
  import { fly } from "svelte/transition";
  import { alert } from "../../stores";
  import { onDestroy } from "svelte";

  export let ms = 3000;
  let visible: boolean;
  let timeout: ReturnType<typeof setTimeout>;

  const onMessageChange = (message: string, ms: number) => {
    clearTimeout(timeout);
    if (!message) {
      //ocultar alerta se a mensagem estiver vazia
      visible = false;
    } else {
      visible = true; //mostra alerta
      if (ms > 0) timeout = setTimeout(() => (visible = false), ms); //e oculta-lo após ms milissegundos
    }
  };

  $: onMessageChange($alert, ms); // sempre que o armazenamento de alertas ou as alterações de props ms são executados onMessageChange

  //onDestroy() função de ciclo de vida, que nos permite executar um retorno de chamada(callback) após a desmontagem do componente.
  onDestroy(() => clearTimeout(timeout)); //certifique-se de limpar o tempo limite

  //abaixo esta uma forma clichê de trabalhar com stores que tem que copiar e colar este codigo toda vez que for trabalhar com stores

  //let alertContent = "";

  //chamamos o método alert.subscribe(), passando-lhe uma função de retorno de chamada(callback) como parâmetro. Sempre que o valor da loja(store) mudar, a função de retorno de chamada será chamada com o novo valor como parâmetro. Na função callback apenas atribuímos o valor que recebemos à variável local, o que irá acionar a atualização do DOM do componente.
  //O subscribe() método também retorna uma função de limpeza, que se encarrega de liberar a assinatura. Portanto, assinamos quando o componente está sendo inicializado e usamos onDestroy para cancelar quando o componente é desmontado.
  //const unsubscribe = alert.subscribe((value) => (alertContent = value));

  //onDestroy(unsubscribe);
</script>

<!--
  - aqui e uma forma mais robusta com mais recursos que o svelte compilador nos fornece para trabalharmos com store
  - o Svelte fornece a $store sintaxe reativa, também conhecida como assinatura automática. Em termos simples, basta prefixar a loja com a $ placa e o Svelte irá gerar o código para torná-la reativa automaticamente
  -  Isso também se aplica às suas próprias lojas personalizadas. Se você implementar os métodos subscribe()e set(), como faremos mais tarde, a $storesintaxe reativa também se aplicará às suas lojas.
  - Nos bastidores, Svelte gerou o código para declarar a variável local $alert, assinar a alert loja, atualizar $alert sempre que o conteúdo da loja for modificado e cancelar a assinatura quando o componente for desmontado. Ele também irá gerar as alert.set() instruções sempre que atribuirmos um valor a $alert.
  - O resultado final desse truque bacana é que você pode acessar armazenamentos globais com a mesma facilidade com que usa variáveis ​​locais reativas.
  - Svelte fornece um módulo completo para definir transições e animações para que possamos tornar nossas interfaces de usuário mais atraentes.
  - Uma transição é aplicada com a diretiva transição:fn e é acionada por um elemento que entra ou sai do DOM como resultado de uma mudança de estado. O svelte/transitionmódulo exporta sete funções: fade, blur, fly, slide, scale, drawe crossfade.
-->
{#if visible}
  <div
    role="alert"
    on:click={() => (visible = false)}
    transition:fly={{ delay: 250, duration: 300, x: 0, y: -100, opacity: 0.5 }}
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
      ><path
        d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"
      /></svg
    >
    <p>{$alert}</p>
  </div>
{/if}

<style>
  div {
    position: fixed;
    cursor: pointer;
    margin-right: 1.5rem;
    margin-left: 1.5rem;
    margin-top: 1rem;
    right: 0;
    display: flex;
    align-items: center;
    border-radius: 0.2rem;
    background-color: #565656;
    color: #fff;
    font-weight: 700;
    padding: 0.5rem 1.4rem;
    font-size: 1.5rem;
    z-index: 100;
    opacity: 95%;
  }
  div p {
    color: #fff;
  }
  div svg {
    height: 1.6rem;
    fill: currentcolor;
    width: 1.4rem;
    margin-right: 0.5rem;
  }
</style>
