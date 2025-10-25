async function carregarPainel(titulo) {
  try {
    const resposta = await fetch('painel.json');
    const dados = await resposta.json();
    const item = dados.find(e => e.titulo.toLowerCase() === titulo.toLowerCase());

    const painel = document.getElementById('painel');
    if (!item) {
      painel.innerHTML = '';
      return;
    }

    let html = `
      <div class="painel-conteudo">
        <h2 class="painel-titulo">${item.titulo}</h2>
        <p class="painel-categoria">${item.categoria || ''}</p>
    `;

    if (item.imagens && item.imagens.length > 0) {
      html += `<div class="painel-imagens">`;
      for (const img of item.imagens) {
        html += `<img src="${img}" alt="${item.titulo}" class="img-painel">`;
      }
      html += `</div>`;
    }

    html += `<p class="painel-descricao">${item.descricao}</p>`;

    if (item.dados) {
      html += `<ul class="painel-lista">`;
      for (const [chave, valor] of Object.entries(item.dados)) {
        html += `<li><strong>${chave}:</strong> ${valor}</li>`;
      }
      html += `</ul>`;
    }

    html += `</div>`;
    painel.innerHTML = html;
  } catch (erro) {
    console.error("Erro ao carregar painel:", erro);
  }
}
