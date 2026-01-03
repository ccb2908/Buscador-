/* =========================
   CORE — ESTADO GLOBAL ¡LUPA!
========================= */

const LUPA_STATE = {
  tema: localStorage.getItem("lupa_tema") || "google",
  modo: localStorage.getItem("lupa_modo") || "claro",
  idioma: localStorage.getItem("lupa_idioma") || "pt-BR",
  filtroBusca: localStorage.getItem("lupa_filtro_busca") || "moderado",
  palavrasBloqueadas: JSON.parse(localStorage.getItem("lupa_palavras")) || []
};

/* =========================
   APLICAR TEMA E MODO
========================= */
function aplicarTema() {
  document.body.dataset.tema = LUPA_STATE.tema;
  document.body.dataset.modo = LUPA_STATE.modo;
}

/* =========================
   SALVAR ESTADO
========================= */
function salvarEstado() {
  localStorage.setItem("lupa_tema", LUPA_STATE.tema);
  localStorage.setItem("lupa_modo", LUPA_STATE.modo);
  localStorage.setItem("lupa_idioma", LUPA_STATE.idioma);
  localStorage.setItem("lupa_filtro_busca", LUPA_STATE.filtroBusca);
  localStorage.setItem("lupa_palavras", JSON.stringify(LUPA_STATE.palavrasBloqueadas));
}

/* =========================
   FILTRO DE PALAVRAS
========================= */
function textoPermitido(texto) {
  if (LUPA_STATE.filtroBusca === "desativado") return true;

  const t = texto.toLowerCase();
  return !LUPA_STATE.palavrasBloqueadas.some(p =>
    t.includes(p.toLowerCase())
  );
}

/* =========================
   INICIALIZAÇÃO GLOBAL
========================= */
document.addEventListener("DOMContentLoaded", aplicarTema);
