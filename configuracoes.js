/* =========================
   CONFIGURAÇÕES ¡LUPA!
========================= */

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("configuracoes")) return;

  /* ===== ELEMENTOS ===== */
  const modo = document.getElementById("modo");
  const tema = document.getElementById("tema");
  const filtroBusca = document.getElementById("filtroBusca");
  const idioma = document.getElementById("idioma");
  const palavraInput = document.getElementById("novaPalavra");
  const listaPalavras = document.getElementById("listaPalavras");

  /* ===== CARREGAR ESTADO ===== */
  idioma.value = LUPA_STATE.idioma;
  modo.value = LUPA_STATE.modo;
  tema.value = LUPA_STATE.tema;
  filtroBusca.value = LUPA_STATE.filtroBusca;

  renderPalavras();

  /* ===== EVENTOS ===== */
  idioma.onchange = () => {
  LUPA_STATE.idioma = idioma.value;
  salvarEstado();
};
   
  modo.onchange = () => {
    LUPA_STATE.modo = modo.value;
    salvarEstado();
    aplicarTema();
  };

  tema.onchange = () => {
    LUPA_STATE.tema = tema.value;
    salvarEstado();
    aplicarTema();
  };

  filtroBusca.onchange = () => {
    LUPA_STATE.filtroBusca = filtroBusca.value;
    salvarEstado();
  };

  document.getElementById("addPalavra").onclick = () => {
    const p = palavraInput.value.trim();
    if (!p) return;

    LUPA_STATE.palavrasBloqueadas.push(p);
    palavraInput.value = "";
    salvarEstado();
    renderPalavras();
  };

  function renderPalavras() {
    listaPalavras.innerHTML = "";
    LUPA_STATE.palavrasBloqueadas.forEach((p, i) => {
      const li = document.createElement("li");
      li.innerHTML = `${p} <button>✖</button>`;
      li.querySelector("button").onclick = () => {
        LUPA_STATE.palavrasBloqueadas.splice(i, 1);
        salvarEstado();
        renderPalavras();
      };
      listaPalavras.appendChild(li);
    });
  }
});
