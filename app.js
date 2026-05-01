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