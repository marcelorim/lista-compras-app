let idLista = null;
let itensBase = [];

/* LOAD INICIAL */
window.onload = async function () {

  await executarComLoading(async () => {
    await carregarListas();
    await carregarItensBase();
  });

};

/* LOADING PADRÃO */
async function executarComLoading(fn) {
  try {
    showLoading();
    await fn();
  } catch (e) {
    console.error(e);
    alert("Erro ao processar.");
  } finally {
    hideLoading();
  }
}

/* CARREGAR LISTAS */
async function carregarListas() {

  const r = await api("buscarListas");

  const combo = document.getElementById("comboListas");

  combo.innerHTML =
    `<option value="">📂 Carregar lista existente</option>`;

  r.data.forEach(x => {
    combo.innerHTML +=
      `<option value="${x.id}">${x.nome}</option>`;
  });
}

/* ITENS BASE */
async function carregarItensBase() {
  const r = await api("buscarItens");
  itensBase = r.data;
}

/* NOVA LISTA */
function modoNovaLista() {
  document.getElementById("menuInicial").style.display = "none";
  document.getElementById("areaNova").style.display = "block";
}

function cancelarNovaLista() {
  document.getElementById("areaNova").style.display = "none";
  document.getElementById("menuInicial").style.display = "block";
}

/* CRIAR LISTA */
async function criarLista() {

  const nome = document.getElementById("nomeLista").value.trim();

  if (!nome) return;

  await executarComLoading(async () => {

    const r = await api("criarLista", { nomeLista: nome });

    idLista = r.data.idLista;

    await carregarListas();

    finalizarLista(nome);

    renderItens([]);

  });
}

/* SELECIONAR LISTA */
async function selecionarLista() {

  idLista = document.getElementById("comboListas").value;

  if (!idLista) return;

  const combo = document.getElementById("comboListas");

  const nome = combo.options[combo.selectedIndex].text;

  await executarComLoading(async () => {

    const r = await api("buscarItensDaLista", {
      idLista: idLista
    });

    finalizarLista(nome);

    renderItens(r.data);

  });
}

/* FINALIZAR */
function finalizarLista(nome) {

  document.getElementById("menuInicial").style.display = "none";
  document.getElementById("areaNova").style.display = "none";

  const div = document.getElementById("listaAtiva");

  div.style.display = "block";

  div.innerHTML =
    `<div class="lista-box">🛒 ${nome.toUpperCase()}</div>`;

  document.getElementById("areaItens").style.display = "block";
}

/* RENDERIZAR LISTA */
function renderItens(listaAtual){

  const div = document.getElementById("itens");
  div.innerHTML = "";

  itensBase.forEach(item => {
    const atual = listaAtual.find(x => x.idItem == item.id);
    const qtd = atual ? atual.quantidade : 0;
    const ativo = !!atual;

    div.innerHTML += `
      <div class="linha-item ${ativo ? 'ativo' : ''}">
        <span class="nome-item">${item.nome}</span>
        <div class="acoes-item">
          <i class="fa-solid fa-minus icone-qtd" onclick="menos(${item.id})"></i>
          <span class="badge-qtd" id="qtd_${item.id}"> ${qtd}</span>
          <i class="fa-solid fa-plus icone-qtd" onclick="mais(${item.id})"></i>
          <button class="${ativo ? 'btn-remove' : 'btn-add'}" onclick="toggle(${item.id})">
            <i class="fa-solid ${ativo ? 'fa-trash' : 'fa-plus'}"></i>
          </button>
        </div>
      </div>
    `;
  });
}

/* QTD */
function mais(id) {
  let el = document.getElementById("qtd_" + id);
  el.innerText = parseInt(el.innerText) + 1;
}

function menos(id) {
  let el = document.getElementById("qtd_" + id);
  let v = parseInt(el.innerText) - 1;
  if (v < 0) v = 0;
  el.innerText = v;
}

/* ALTERNAR LISTA */
async function toggle(id) {

  if(!idLista){
    aviso("Selecione uma lista");
    return;
  }

  const qtd = parseInt(document.getElementById("qtd_" + id).innerText);
  if(qtd <= 0){
    aviso("Informe a quantidade");
    return;
  }

  showLoading();

  const btn = event.currentTarget;
  const remover = btn.classList.contains("btn-remove");
  if(remover){
    await api("removerItemDaLista",{
      idLista:idLista,
      idItem:id
    });
  }else{
    await api("incluirItemNaLista",{
      idLista:idLista,
      idItem:id,
      quantidade:qtd
    });
  }

  await selecionarLista();

  hideLoading();
}