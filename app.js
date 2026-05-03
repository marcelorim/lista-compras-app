const API = "https://script.google.com/macros/s/AKfycbzH0ay9LafVDoF4CFC2b7GCOZbBtjv3JnDI8WV8d2LI5ElbjVD6OmW_B8IZ1Z-NB1zt/exec";

/* ===============================
   CHAMADA API GLOBAL
================================= */
async function api(action, params = {}) {
  try {
    const formData = new URLSearchParams();
    formData.append("action", action);

    Object.keys(params).forEach(k => {
      formData.append(k, params[k]);
    });

    const resposta = await fetch(API, {
      method: "POST",
      body: formData
    });

    return await resposta.json();

  } catch (err) {
    console.error(err);
    throw new Error("Erro de comunicação com API");
  }
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