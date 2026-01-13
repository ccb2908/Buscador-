async function carregarPainel(termo) {
  const painel = document.getElementById("painel");
  if (!termo) {
    painel.style.display = "none";
    return;
  }

  try {
    const dados = await fetch("painel.json").then(r => r.json());
    const idioma = LUPA_STATE.idioma || "pt";

    const registro = dados.find(p =>
      Object.values(p.dados).some(d =>
        d.titulo.toLowerCase() === termo.toLowerCase()
      )
    );

    if (!registro) {
      painel.style.display = "none";
      return;
    }

    const item = registro.dados[idioma] || registro.dados["pt"];

    let galeria = "";
    if (item.imagens?.length) {
      galeria = `<div class="painel-galeria">
        ${item.imagens.map(img => `<img src="${img}">`).join("")}
      </div>`;
    }

    painel.innerHTML = `
      ${galeria}
      <h2>${item.titulo}</h2>
      <p>${item.categoria || ""}</p>
      <p>${item.descricao || ""}</p>
    `;

    painel.style.display = "block";

  } catch (e) {
    console.error(e);
    painel.style.display = "none";
  }
}

    // Monta galeria de imagens
    let galeria = "";
    if (Array.isArray(item.imagens) && item.imagens.length > 0) {
      galeria = `<div class="painel-galeria">
        ${item.imagens.map(img => `<img src="${img}" alt="${item.titulo}">`).join("")}
      </div>`;
    }

    // Monta campos extras
    let extras = "";
    for (const [chave, valor] of Object.entries(item)) {
      if (["titulo", "descricao", "imagens"].includes(chave) || !valor) continue;
      extras += `<p><strong>${formatar(chave)}:</strong> ${valor}</p>`;
    }

    function formatar(chave) {
      return chave.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    }

function esconderPainel() {
  const painel = document.getElementById("painel");
  painel.style.display = "none";
}



