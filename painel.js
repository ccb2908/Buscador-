async function carregarPainel(termo) {
  const painel = document.getElementById("painel");

  if (!termo) {
    painel.style.display = "none";
    return;
  }

  try {
    const dados = await fetch("painel.json").then(r => r.json());
    const item = dados.find(p => p.titulo.toLowerCase() === termo.toLowerCase());

    if (!item) {
      painel.style.display = "none";
      return;
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

    painel.innerHTML = `
      ${galeria}
      <h2>${item.titulo}</h2>
      <p>${item.descricao || ""}</p>
      ${extras}
    `;

    painel.style.display = "block";

  } catch (err) {
    console.error("Erro ao carregar painel:", err);
    painel.style.display = "none";
  }
}

function esconderPainel() {
  const painel = document.getElementById("painel");
  painel.style.display = "none";
}
