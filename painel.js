async function carregarPainel(termo) {
  const painel = document.getElementById("painel");

  if (!termo) {
    painel.style.display = "none";
    return;
  }

  try {
    const dados = await fetch("painel.json").then(r => r.json());

    // Procura o item correspondente ao termo
    const item = dados.find(p =>
      p.titulo.toLowerCase() === termo.toLowerCase()
    );

    if (!item) {
      painel.style.display = "none";
      return;
    }

    // Monta o conteúdo do painel incluindo a imagem
    painel.innerHTML = `
      <div class="painel-box">
        ${item.imagem ? `<img src="${item.imagem}" alt="${item.titulo}">` : ''}
        <h2>${item.titulo}</h2>
        <p>${item.descricao}</p>
      </div>
    `;
    painel.style.display = "block";

  } catch (err) {
    console.error("Erro ao carregar painel:", err);
    painel.style.display = "none";
  }
}

// Esconde o painel manualmente
function esconderPainel() {
  const painel = document.getElementById("painel");
  painel.style.display = "none";
}
