const API = "https://script.google.com/macros/s/AKfycbxMATa0sIVTH4ZPJ2KApfw6pmQC_o9YN2lAkH4vmsP2z86tguWiu41qkil4cAKbKD_n/exec";

/* ===============================
   CHAMADA API GLOBAL
================================= */
async function api(action, params = {}) {

  let url = API + "?action=" + action;

  Object.keys(params).forEach(k => {
    url += "&" + k + "=" + encodeURIComponent(params[k]);
  });

  const resposta = await fetch(url);
  return await resposta.json();
}

/* ===============================
   ALERTA GLOBAL
================================= */
function aviso(msg){
  alert(msg);
}

/* ===============================
   CONFIRMAÇÃO GLOBAL
================================= */
function confirmar(msg){
  return confirm(msg);
}

/* ===============================
   SPINNER GLOBAL
================================= */
function showLoading(){
    document.getElementById("loading")
    ?.classList.add("show");
}
   
function hideLoading(){
    document.getElementById("loading")
    ?.classList.remove("show");
}