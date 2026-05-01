let idLista = null;
let itensBase = [];

/* ===============================
   LOAD INICIAL
================================= */
window.onload = async function(){

  showLoading();

  await carregarListas();
  await carregarItensBase();

  hideLoading();
}

/* ===============================
   CARREGAR LISTAS
================================= */
async function carregarListas(){

  const r = await api("buscarListas");

  const combo = document.getElementById("comboListas");

  combo.innerHTML =
  `<option value="">📂 Carregar lista existente</option>`;

  r.data.forEach(x=>{
    combo.innerHTML +=
    `<option value="${x.id}">${x.nome}</option>`;
  });
}

/* ===============================
   ITENS BASE
================================= */
async function carregarItensBase(){

  const r = await api("buscarItens");
  itensBase = r.data;
}

/* ===============================
   NOVA LISTA
================================= */
function modoNovaLista(){

  document.getElementById("menuInicial").style.display="none";
  document.getElementById("areaNova").style.display="block";
}

function cancelarNovaLista(){

  document.getElementById("areaNova").style.display="none";
  document.getElementById("menuInicial").style.display="block";
}

/* ===============================
   CRIAR LISTA
================================= */
async function criarLista(){

  const nome = document.getElementById("nomeLista").value.trim();

  if(!nome) return;

  showLoading();

  const r = await api("criarLista",{nomeLista:nome});

  idLista = r.data.idLista;

  await carregarListas();

  finalizarLista(nome);

  renderItens([]);

  hideLoading();
}

/* ===============================
   SELECIONAR LISTA
================================= */
async function selecionarLista(){

  idLista = document.getElementById("comboListas").value;

  if(!idLista) return;

  const nome = document.getElementById("comboListas")
  .options[
    document.getElementById("comboListas").selectedIndex
  ].text;

  showLoading();

  const r = await api("buscarItensDaLista", {idLista:idLista});

  finalizarLista(nome);

  renderItens(r.data);

  hideLoading();
}

/* ===============================
   FINALIZAR ESCOLHA
================================= */
function finalizarLista(nome){

  document.getElementById("menuInicial").style.display="none";
  document.getElementById("areaNova").style.display="none";

  const div = document.getElementById("listaAtiva");
  div.style.display="block";
  div.innerHTML =
  `<div class="lista-box">
     🛒 ${nome.toUpperCase()}
   </div>`;

  document.getElementById("areaItens").style.display="block";
}