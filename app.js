const API = "https://script.google.com/macros/s/AKfycbxMATa0sIVTH4ZPJ2KApfw6pmQC_o9YN2lAkH4vmsP2z86tguWiu41qkil4cAKbKD_n/exec";

async function api(action, params = {}) {

  let url = API + "?action=" + action;

  Object.keys(params).forEach(k => {
    url += "&" + k + "=" + encodeURIComponent(params[k]);
  });

  const resposta = await fetch(url);
  const json = await resposta.json();

  return json;
}

function modoNovaLista(){
    document.getElementById("menuInicial").style.display = "none";
    document.getElementById("areaNova").style.display = "block";
  }
  
  function cancelarNovaLista(){  
    document.getElementById("areaNova").style.display = "none";
    document.getElementById("menuInicial").style.display = "block";  
  }
  
  async function criarLista(){  
    const nome = document.getElementById("nomeLista").value.trim();  
    if(!nome){
      alert("Digite o nome da lista");
      return;
    }
  
    const r = await api("criarLista",{nomeLista:nome});  
    idLista = r.data.idLista;  
    finalizarLista(nome);  
    renderItens([]);  
  }
  
  async function selecionarLista(){  
    idLista = document.getElementById("comboListas").value;  
    if(!idLista) return;
  
    const nome =
    document.getElementById("comboListas")
    .options[
      document.getElementById("comboListas").selectedIndex
    ].text;
  
    finalizarLista(nome);  
    const r = await api("buscarItensDaLista",{idLista:idLista});  
    renderItens(r.data);
  }
  
  function finalizarLista(nome){  
    document.getElementById("menuInicial").style.display = "none";
    document.getElementById("areaNova").style.display = "none";
  
    const div = document.getElementById("listaAtiva");  
    div.style.display = "block";  
    div.innerHTML = `
      <div class="lista-box">
        🛒 <strong>${nome.toUpperCase()}</strong>
      </div>
    `;
      
    document.getElementById("areaItens").style.display = "block";
  }