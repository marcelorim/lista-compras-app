const API = "https://script.google.com/macros/s/AKfycbzH0ay9LafVDoF4CFC2b7GCOZbBtjv3JnDI8WV8d2LI5ElbjVD6OmW_B8IZ1Z-NB1zt/exec";

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

/* ===============================
   VOLTAR PARA INDEX
================================= */
function voltarHome(){
  window.location.href = "index.html";
}