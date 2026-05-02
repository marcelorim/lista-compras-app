const API = "https://script.google.com/macros/s/AKfycbxX61m0qfD1jPO-eYhP3DO5SmJc7W5ySh5A42u9hQ6Zaqa2cfbGLurYqw1bPnm66Dpa/exec";

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
   ALERTA SUCESSO
================================= */
function sucesso(msg){
  return Swal.fire({
    icon:'success',
    title:'Sucesso',
    text:msg,
    confirmButtonColor:'#198754'
  });
}

/* ===============================
   ALERTA ERRO
================================= */
function erro(msg){
  return Swal.fire({
    icon:'error',
    title:'Oops...',
    text:msg,
    confirmButtonColor:'#dc3545'
  });
}

/* ===============================
   ALERTA INFO
================================= */
function aviso(msg){
  return Swal.fire({
    icon:'info',
    title:'Aviso',
    text:msg,
    confirmButtonColor:'#0d6efd'
  });
}

/* ===============================
   CONFIRMAÇÃO
================================= */
async function confirmar(msg){

  const r = await Swal.fire({
    icon:'question',
    title:'Confirmação',
    text:msg,
    showCancelButton:true,
    confirmButtonText:'Sim',
    cancelButtonText:'Cancelar',
    confirmButtonColor:'#198754',
    cancelButtonColor:'#dc3545'
  });

  return r.isConfirmed;
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