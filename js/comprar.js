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

    renderListaCompra(r.data);

    const estado = localStorage.getItem("mostrarComprados");
    if(estado !== null){
        const toggle = document.getElementById("toggleComprados");
        toggle.checked = (estado === "true");
        filtrarComprados();
    }
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
  
    // restaurar filtro
    const estado = localStorage.getItem("mostrarComprados");
    if(estado !== null){
      const toggle = document.getElementById("toggleComprados");
      toggle.checked = (estado === "true");
      filtrarComprados();
    }
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
  
    const itens = document.querySelectorAll(".linha-item");  
    itens.forEach(el => {
      if(el.classList.contains("comprado")){
        el.style.display = mostrar ? "flex" : "none";
      }
    });
  
    document.getElementById("labelFiltro").innerText = mostrar ? "Mostrar comprados" : "Ocultando comprados";
  }