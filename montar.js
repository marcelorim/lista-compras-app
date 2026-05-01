let idLista = null;
let itensBase = [];

/* ===============================
   LOAD INICIAL
================================= */
window.onload = async function(){
    showLoading();   
    await new Promise(r=>setTimeout(r,150));   
    await carregarListas();
    await carregarItensBase();   
    hideLoading();
}

/* ===============================
   CARREGAR LISTAS
================================= */
async function carregarListas() {

  const combo = document.getElementById("comboListas");

  combo.innerHTML =
    `<option value="">📂 Carregar lista existente</option>`;

  const r = await api("buscarListas");

  r.data.forEach(x => {
    combo.innerHTML +=
      `<option value="${x.id}">${x.nome}</option>`;
  });
}

/* ===============================
   CARREGAR ITENS BASE
================================= */
async function carregarItensBase() {

  const r = await api("buscarItens");
  itensBase = r.data;

}

/* ===============================
   NOVA LISTA
================================= */
function modoNovaLista() {

  document.getElementById("menuInicial").style.display = "none";
  document.getElementById("areaNova").style.display = "block";

}

function cancelarNovaLista() {

  document.getElementById("areaNova").style.display = "none";
  document.getElementById("menuInicial").style.display = "block";

}

/* ===============================
   CRIAR LISTA
================================= */
async function criarLista() {

  const nome =
    document.getElementById("nomeLista").value.trim();

  if (!nome) {
    aviso("Digite o nome da lista.");
    return;
  }

  const r = await api("criarLista", {
    nomeLista: nome
  });

  idLista = r.data.idLista;

  await carregarListas();

  finalizarLista(nome);

  renderItens([]);

}

/* ===============================
   SELECIONAR LISTA
================================= */
async function selecionarLista() {

  const combo =
    document.getElementById("comboListas");

  idLista = combo.value;

  if (!idLista) return;

  const nome =
    combo.options[combo.selectedIndex].text;

  finalizarLista(nome);

  const r = await api("buscarItensDaLista", {
    idLista: idLista
  });

  renderItens(r.data);

}

/* ===============================
   FINALIZAR ESCOLHA
================================= */
function finalizarLista(nome) {

  document.getElementById("menuInicial").style.display = "none";
  document.getElementById("areaNova").style.display = "none";

  const box =
    document.getElementById("listaAtiva");

  box.style.display = "block";

  box.innerHTML = `
    <div class="lista-box">
      🛒 ${nome.toUpperCase()}
    </div>
  `;

  document.getElementById("areaItens").style.display = "block";

}

/* ===============================
   RENDER ITENS
================================= */
function renderItens(listaAtual) {

  const div =
    document.getElementById("itens");

  div.innerHTML = "";

  itensBase.forEach(item => {

    const atual =
      listaAtual.find(x => x.idItem == item.id);

    const qtd =
      atual ? atual.quantidade : 0;

    const ativo =
      atual ? true : false;

    div.innerHTML += `
      <div class="linha-item">

        <span>${item.nome}</span>

        <div class="acoes-item">

          <button onclick="menos(${item.id})">-</button>

          <span id="qtd_${item.id}">
            ${qtd}
          </span>

          <button onclick="mais(${item.id})">+</button>

          <button onclick="toggle(${item.id})">
            ${ativo ? '🗑️' : '➕'}
          </button>

        </div>

      </div>
    `;
  });
}

/* ===============================
   QUANTIDADE
================================= */
function mais(id) {

  const el =
    document.getElementById("qtd_" + id);

  el.innerText =
    parseInt(el.innerText) + 1;

}

function menos(id) {

  const el =
    document.getElementById("qtd_" + id);

  let v =
    parseInt(el.innerText) - 1;

  if (v < 0) v = 0;

  el.innerText = v;

}

/* ===============================
   ADD / REMOVE
================================= */
async function toggle(id) {

  if (!idLista) {
    aviso("Selecione uma lista.");
    return;
  }

  const qtd = parseInt(
    document.getElementById("qtd_" + id).innerText
  );

  const botao = event.target;

  if (botao.innerText === "🗑️") {

    await api("removerItemDaLista", {
      idLista: idLista,
      idItem: id
    });

  } else {

    if (qtd <= 0) {
      aviso("Quantidade deve ser maior que zero.");
      return;
    }

    await api("incluirItemNaLista", {
      idLista: idLista,
      idItem: id,
      quantidade: qtd
    });

  }

  selecionarLista();

}

/* ===============================
   LIMPAR
================================= */
async function limparLista() {

  if (!idLista) return;

  if (!confirmar("Deseja limpar a lista?"))
    return;

  await api("limparLista", {
    idLista: idLista
  });

  selecionarLista();

}