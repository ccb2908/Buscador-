// ------------------------------
// Script.js do Mini Buscador ¡Lupa!
// Versão moderna com async/await e arrow functions
// ------------------------------

const campoBusca = document.getElementById('campoBusca');
const botaoBusca = document.getElementById('botaoBusca');
const listaResultados = document.getElementById('lista-resultados');

// Redireciona para a página de resultados
const pesquisar = () => {
  const termo = campoBusca.value.trim();
  if (termo !== "") {
    window.location.href = `resultados.html?q=${encodeURIComponent(termo)}`;
  }
};

// Eventos de pesquisa
botaoBusca.addEventListener('click', pesquisar);
campoBusca.addEventListener('keypress', e => {
  if (e.key === 'Enter') pesquisar();
});

// Função para carregar e exibir resultados
const carregarResultados = async () => {
  if (!listaResultados) return; // Se não estiver na página de resultados, sai

  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('q')?.toLowerCase() || '';
  campoBusca.value = query;

  try {
    const res = await fetch('index.json');
    const data = await res.json();

    // Filtra resultados por título, descrição ou categoria
    const resultados = data.filter(item =>
      item.titulo.toLowerCase().includes(query) ||
      item.descricao.toLowerCase().includes(query) ||
      item.categoria.toLowerCase().includes(query)
    );

    if (resultados.length === 0) {
      listaResultados.innerHTML = '<p>Nenhum resultado encontrado.</p>';
      return;
    }

    // Agrupa resultados por categoria
    const categorias = resultados.reduce((acc, item) => {
      if (!acc[item.categoria]) acc[item.categoria] = [];
      acc[item.categoria].push(item);
      return acc;
    }, {});

    // Gera HTML dos resultados
    let html = '';
    Object.keys(categorias).forEach(cat => {
      html += `<h2 class="categoria">${cat}</h2>`;
      categorias[cat].forEach(item => {
        html += `
          <div class="painel">
            <a href="${item.link}" class="titulo-link">${item.titulo}</a>
            <div class="url-link">${item.link}</div>
            <p class="descricao">${item.descricao}</p>
          </div>
        `;
      });
    });

    listaResultados.innerHTML = html;

  } catch (err) {
    console.error(err);
    listaResultados.innerHTML = '<p>Erro ao carregar resultados.</p>';
  }
};

// Executa carregamento se estiver na página resultados.html
carregarResultados();
