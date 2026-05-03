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
    erro("Erro ao processar.");
  } finally {
    hideLoading();
  }
}

/* CARREGAR LISTAS */
async function carregarListas() {

  const r = await api("buscarListas");

  if(!r.success){
    erro(r.message);
    return;
  }

  const combo = document.getElementById("comboListas");

  combo.innerHTML =
    `<option value="">📂 Selecione a Lista </option>`;

  r.data.forEach(x => {
    combo.innerHTML +=
      `<option value="${x.id}">${x.nome}</option>`;
  });
}

/* ITENS BASE */
async function carregarItensBase() {
  const r = await api("buscarItens");

  if(!r.success){
    erro(r.message);
    return;
  }

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

  if (!nome) {
    aviso("Digite o nome da lista");
    return;
  }

  await executarComLoading(async () => {

    const r = await api("criarLista", { nomeLista: nome });

    if(!r.success){
      erro(r.message);
      return;
    }

    idLista = r.data.idLista;

    await carregarListas();

    finalizarLista(nome);

    renderItens([]);

    sucesso("Lista criada com sucesso!");

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

    if(!r.success){
      erro(r.message);
      return;
    }

    finalizarLista(nome);
    renderItens(r.data);
  });
}

/* LIMPAR LISTA */
async function limparLista(){

  if(!idLista){
    aviso("Selecione uma lista.");
    return;
  }

  const ok = await confirmar("Deseja limpar todos os itens da lista?");
  if(!ok) return;

  await executarComLoading(async () => {

    const r = await api("limparLista", {
      idLista:idLista
    });

    if(!r.success){
      erro(r.message);
      return;
    }

    await selecionarLista(); // 🔥 RECARREGA DO BACKEND

    sucesso("Lista limpa!");

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
function renderItens(listaAtual) {

  const div = document.getElementById("itens");
  div.innerHTML = "";

  itensBase.forEach(item => {
    const atual = listaAtual.find(x => x.idItem == item.id);
    const qtd = atual ? atual.quantidade : 0;
    const ativo = !!atual;

    div.innerHTML += `
      <div class="linha-item ${ativo ? 'ativo' : ''}">
          <span class="nome-item">
              ${item.nome}
          </span>
          <div class="acoes-item">
              <i class="fa-solid fa-minus icone-qtd" onclick="menos(${item.id})"></i>
              <span class="badge-qtd" id="qtd_${item.id}">
                ${qtd}
              </span>
              <i class="fa-solid fa-plus icone-qtd" onclick="mais(${item.id})"></i>
              <button class="${ativo ? 'btn-remove' : 'btn-add'}" onclick="toggle(${item.id}, this)">
                <i class="fa-solid ${ativo ? 'fa-trash' : 'fa-plus'}"></i>
              </button>
          </div>
      </div>
    `;
  });
}

/* QTD */
async function mais(id){

  let el = document.getElementById("qtd_" + id);
  let valor = parseInt(el.innerText) + 1;
  el.innerText = valor;

  if(!idLista) return;

  await api("alterarQuantidade",{
    idLista:idLista,
    idItem:id,
    quantidade:valor
  });

  //console.log("mais:", r);
}

async function menos(id){

  let el = document.getElementById("qtd_" + id);
  let valor = parseInt(el.innerText) - 1;
  if(valor < 0) valor = 0;
  el.innerText = valor;

  if(!idLista) return;

  await api("alterarQuantidade",{
    idLista:idLista,
    idItem:id,
    quantidade:valor
  });

  //console.log("menos:", r);
}

/* ALTERNAR LISTA */
async function toggle(id, btn) {

  if(!idLista){
    aviso("Selecione uma lista");
    return;
  }

  const qtd = parseInt(document.getElementById("qtd_" + id).innerText);
  if(qtd <= 0){
    aviso("Informe a quantidade");
    return;
  }

  await executarComLoading(async () => {

    const remover = btn.classList.contains("btn-remove");

    let r;

    if(remover){
      r = await api("removerItemDaLista",{
        idLista:idLista,
        idItem:id
      });
    }else{
      r = await api("incluirItemNaLista",{
        idLista:idLista,
        idItem:id,
        quantidade:qtd
      });
    }

    if(!r.success){
      erro(r.message);
      return;
    }

    await selecionarLista();

  });
}