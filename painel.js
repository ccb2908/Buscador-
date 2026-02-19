async function carregarPainel(termo) {
  const painel = document.getElementById("painel");
  if (!painel) return;

  if (!termo) {
    painel.style.display = "none";
    return;
  }

  try {
    const response = await fetch("painel.json");
    if (!response.ok) throw new Error("Falha ao carregar painel.json");

    const dados = await response.json();
    const idioma = window.LUPA_STATE?.idioma || "pt";

    const registro = dados.find(p => {
      if (!p.dados) return false;

      return Object.values(p.dados).some(d =>
        d?.titulo?.toLowerCase().includes(termo.toLowerCase())
      );
    });

    if (!registro) {
      painel.style.display = "none";
      return;
    }

    const item = registro.dados[idioma] || registro.dados["pt"];
    if (!item) {
      painel.style.display = "none";
      return;
    }

    let galeria = "";
    if (Array.isArray(item.imagens) && item.imagens.length > 0) {
      galeria = `
        <div class="painel-galeria">
          ${item.imagens.map(img =>
            `<img src="${img}" alt="${item.titulo || ""}">`
          ).join("")}
        </div>
      `;
    }

    painel.innerHTML = `
      ${galeria}
      <h2>${item.titulo || ""}</h2>
      <p>${item.categoria || ""}</p>
      <p>${item.descricao || ""}</p>
    `;

    painel.style.display = "block";

  } catch (e) {
    console.error("Erro no painel:", e);
    painel.style.display = "none";
  }
}

function esconderPainel() {
  const painel = document.getElementById("painel");
  if (painel) painel.style.display = "none";
}
