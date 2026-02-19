async function carregarPainel(termo) {
  const painel = document.getElementById("painel");
  if (!painel) return;

  if (!termo) {
    painel.style.display = "none";
    return;
  }

  try {
    const response = await fetch("painel.json");
    if (!response.ok) throw new Error("Erro ao carregar painel.json");

    const dados = await response.json();

    const registro = dados.find(item =>
      item.titulo?.toLowerCase().includes(termo.toLowerCase())
    );

    if (!registro) {
      painel.style.display = "none";
      return;
    }

    let galeria = "";
    if (Array.isArray(registro.imagens)) {
      galeria = `
        <div class="painel-galeria">
          ${registro.imagens.map(img =>
            `<img src="${img}" alt="${registro.titulo}">`
          ).join("")}
        </div>
      `;
    }

    painel.innerHTML = `
      ${galeria}
      <h2>${registro.titulo}</h2>
      <p>${registro.categoria || ""}</p>
      <p>${registro.descricao || ""}</p>
    `;

    painel.style.display = "block";

  } catch (erro) {
    console.error("Erro no painel:", erro);
    painel.style.display = "none";
  }
}
