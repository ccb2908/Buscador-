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

    // Exibir imagens
    if (item.imagens && item.imagens.length > 0) {
      html += `<div class="painel-imagens">`;
      for (const img of item.imagens) {
        html += `<img src="${img}" alt="${item.titulo}" class="img-painel">`;
      }
      html += `</div>`;
    }

    // Descrição
    html += `<p class="painel-descricao">${item.descricao}</p>`;

    // Exibir todos os campos adicionais automaticamente
    const camposExtras = Object.entries(item)
      .filter(([chave]) => !['titulo', 'descricao', 'categoria', 'imagens', 'dados'].includes(chave));

    if (camposExtras.length > 0 || item.dados) {
      html += `<ul class="painel-lista">`;

      // Campos diretos (ex: nascimento, esposa, estúdio etc.)
      for (const [chave, valor] of camposExtras) {
        html += `<li><strong>${chave[0].toUpperCase() + chave.slice(1)}:</strong> ${valor}</li>`;
      }

      // Campos dentro de "dados", se houver
      if (item.dados) {
        for (const [chave, valor] of Object.entries(item.dados)) {
          html += `<li><strong>${chave}:</strong> ${valor}</li>`;
        }
      }

      html += `</ul>`;
    }

    html += `</div>`;
    painel.innerHTML = html;

  } catch (erro) {
    console.error("Erro ao carregar painel:", erro);
  }
}
