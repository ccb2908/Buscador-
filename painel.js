async function carregarPainel(idOuTermo) {
  const painel = document.getElementById("painel");
  if (!idOuTermo) {
    painel.style.display = "none";
    return;
  }

  try {
    const fontes = ["painel.json", "imagens.json"];
    let item = null;

    for (const f of fontes) {
      const dados = await fetch(f).then(r => r.json());
      item = dados.find(p =>
        p.id === idOuTermo ||
        p.titulo?.toLowerCase() === idOuTermo.toLowerCase()
      );
      if (item) break;
    }

    if (!item) {
      painel.style.display = "none";
      return;
    }

    if (item.tipo === "imagem") {
      renderPainelImagem(item);
    } else {
      renderPainelTexto(item);
    }

    painel.style.display = "block";
  } catch (e) {
    console.error("Erro no painel:", e);
    painel.style.display = "none";
  }
}

function esconderPainel() {
  const painel = document.getElementById("painel");
  painel.style.display = "none";
}

function renderPainelTexto(item) {
  let extras = "";
  for (const [k, v] of Object.entries(item)) {
    if (["id","titulo","descricao","tipo","imagens"].includes(k)) continue;
    extras += `<p><strong>${formatar(k)}:</strong> ${v}</p>`;
  }

  document.getElementById("painel").innerHTML = `
    <h2>${item.titulo}</h2>
    <p>${item.descricao || ""}</p>
    ${extras}
  `;
}

function renderPainelImagem(item) {
  document.getElementById("painel").innerHTML = `
    <img src="${item.src}" class="imagem-principal">
    <h2>${item.titulo}</h2>
    <p>${item.descricao || ""}</p>
    <p><strong>Site:</strong> ${item.origem?.site || "-"}</p>
    <p><strong>Autor:</strong> ${item.origem?.autor || "-"}</p>
    <p><strong>Licença:</strong> ${item.origem?.licenca || "-"}</p>
  `;
}

function formatar(chave) {
  return chave.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}
