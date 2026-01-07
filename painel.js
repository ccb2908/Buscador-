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
      if (["titulo", "descricao", "imagens", "links"].includes(chave) || !valor) continue;
      extras += `<p><strong>${formatar(chave)}:</strong> ${valor}</p>`;
    }

    function formatar(chave) {
      return chave.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    }

    // Monta links externos (YouTube, Instagram, etc.)
    let linksHTML = "";
    if (Array.isArray(item.links)) {
      linksHTML = item.links.map(link =>
        `<p><a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.titulo}</a></p>`
      ).join("");
    }

    painel.innerHTML = `
      ${galeria}
      <h2>${item.titulo}</h2>
      <p>${item.descricao || ""}</p>
      ${extras}
      ${linksHTML}
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
async function carregarPainel(termoOuId) {
  const painel = document.getElementById("painel");
  if (!termoOuId) {
    painel.style.display = "none";
    return;
  }

  try {
    // junta fontes possíveis
    const fontes = ["painel.json", "imagens.json"];
    let item = null;

    for (const f of fontes) {
      const dados = await fetch(f).then(r => r.json());
      item = dados.find(p =>
        p.id === termoOuId ||
        p.titulo?.toLowerCase() === termoOuId.toLowerCase()
      );
      if (item) break;
    }

    if (!item) {
      painel.style.display = "none";
      return;
    }

    // ====== RENDERIZAÇÃO POR TIPO ======
    if (item.tipo === "imagem") {
      renderPainelImagem(item);
    } else {
      renderPainelTexto(item);
    }

    painel.style.display = "block";

  } catch (err) {
    console.error(err);
    painel.style.display = "none";
  }
}

function renderPainelTexto(item) {
  let extras = "";
  for (const [k, v] of Object.entries(item)) {
    if (["titulo", "descricao", "imagens", "tipo"].includes(k)) continue;
    extras += `<p><strong>${formatar(k)}:</strong> ${v}</p>`;
  }

  document.getElementById("painel").innerHTML = `
    <h2>${item.titulo}</h2>
    <p>${item.descricao || ""}</p>
    ${extras}
  `;
}

function renderPainelImagem(item) {
  const relacionadas = (item.relacionadas || []).map(id =>
    `<img src="" data-id="${id}" class="thumb-relacionada">`
  ).join("");

  document.getElementById("painel").innerHTML = `
    <div class="painel-imagem">
      <img src="${item.src}" class="imagem-principal">
    </div>

    <h2>${item.titulo}</h2>
    <p>${item.descricao || ""}</p>

    <p><strong>Site:</strong> ${item.origem?.site || "-"}</p>
    <p><strong>Autor:</strong> ${item.origem?.autor || "-"}</p>
    <p><strong>Licença:</strong> ${item.origem?.licenca || "-"}</p>

    <div class="relacionadas">
      ${relacionadas}
    </div>
  `;

  ativarRelacionadas();
}

function ativarRelacionadas() {
  document.querySelectorAll(".thumb-relacionada").forEach(img => {
    img.onclick = () => carregarPainel(img.dataset.id);
  });
}

function formatar(chave) {
  return chave.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}
