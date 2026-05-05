let listaOriginal = [];

window.onload = async function () {
    await executarComLoading(async () => {
      await carregarListaCompra();
    });
  };

async function carregarListaCompra(){

  const r = await api("buscarListaParaCompra");

  if(!r.success){
      erro(r.message);
      return;
  }

  // 🔥 guarda lista original
  listaOriginal = r.data;

  // 🔥 restaura estado do toggle
  const estado = localStorage.getItem("mostrarComprados");
  if(estado !== null){
      const toggle = document.getElementById("toggleComprados");
      toggle.checked = (estado === "true");
  }

  // 🔥 usa o novo fluxo (filtro + ordenação)
  filtrarLista();
}

function renderListaCompra(lista){

  const div = document.getElementById("listaCompra");
  div.innerHTML = "";

  if(lista.length === 0){
    div.innerHTML = "<p>Nenhum item para comprar.</p>";
    return;
  }

  lista.forEach(item => {

    div.innerHTML += `
      <div class="linha-item ${item.comprado ? 'comprado' : ''}">
        
        <span class="nome-item">
          ${item.nome}
        </span>

        <div class="acoes-item">
          <span class="badge-qtd">
            ${item.quantidade}
          </span>

          <button class="btn-check"
            onclick="marcar(${item.idListaItem}, ${item.comprado})">
            
            <i class="fa-solid ${item.comprado ? 'fa-check' : 'fa-circle'}"></i>
          
          </button>
        </div>

      </div>
    `;
  });
}

async function marcar(idListaItem, statusAtual){

  const novoStatus = statusAtual ? 0 : 1;

  await executarComLoading(async () => {

    const r = await api("marcarComoComprado",{
      idListaItem: idListaItem,
      status: novoStatus
    });

    if(!r.success){
      erro(r.message);
      return;
    }

    await carregarListaCompra();

  });
}

function filtrarComprados(){

  const toggle = document.getElementById("toggleComprados");
  const mostrar = toggle.checked;

  localStorage.setItem("mostrarComprados", mostrar);

  // 🔥 agora usa o filtro central
  filtrarLista();
}

function filtrarLista(){

  const termo = document.getElementById("buscaItem")?.value.toLowerCase() || "";
  const ordem = ordenacaoAtual;
  const mostrarComprados = document.getElementById("toggleComprados").checked;

  let lista = [...listaOriginal];

  // 🔎 filtro texto
  if(termo){
      lista = lista.filter(item =>
          item.nome.toLowerCase().includes(termo)
      );
  }

  // 🎯 filtro comprados
  if(!mostrarComprados){
      lista = lista.filter(item => !item.comprado);
  }

  // 🔃 ordenação
  switch(ordem){

      case "nome_asc":
          lista.sort((a,b) => a.nome.localeCompare(b.nome));
          break;

      case "nome_desc":
          lista.sort((a,b) => b.nome.localeCompare(a.nome));
          break;

      case "qtd_asc":
          lista.sort((a,b) => a.quantidade - b.quantidade);
          break;

      case "qtd_desc":
          lista.sort((a,b) => b.quantidade - a.quantidade);
          break;
  }

  renderListaCompra(lista);
}

function toggleFiltro(){
  document.getElementById("menuFiltro")
      .classList.toggle("hidden");
}

let ordenacaoAtual = "nome_asc";

function setOrdenacao(tipo){
    ordenacaoAtual = tipo;

    document.getElementById("menuFiltro")
        .classList.add("hidden");

    filtrarLista();
}

document.addEventListener("click", function(e){

  const menu = document.getElementById("menuFiltro");
  const botao = document.querySelector(".btn-filtro");

  if(!menu.contains(e.target) && !botao.contains(e.target)){
      menu.classList.add("hidden");
  }
});