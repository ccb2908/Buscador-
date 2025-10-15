// ------------------------------
// Script.js do Mini Buscador ¡Lupa!
// Funciona na página inicial e resultados
// ------------------------------

const campoBusca = document.getElementById('campoBusca');
const botaoBusca = document.getElementById('botaoBusca');
const listaResultados = document.getElementById('lista-resultados');

// Função para redirecionar para resultados.html
const pesquisar = () => {
  const termo = campoBusca.value.trim();
  if (termo !== "") {
    window.location.href = `resultados.html?q=${encodeURIComponent(termo)}`;
  }
};

// Eventos de pesquisa
if (botaoBusca) botaoBusca.addEventListener('click', pesquisar);
if (campoBusca) campoBusca.addEventListener('keypress', e => {
  if (e.key === 'Enter') pesquisar();
});

// Função para carregar resultados na página de resultados
const carregarResultados = async () => {
  if (!listaResultados) return; // Sai se não estiver na página de resultados

  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('q')?.toLowerCase() || '';
  if (campoBusca) campoBusca.value = query;

  try {
    const res = await fetch('index.json');
    const data = await res.json();

    // Filtra resultados
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

// Executa apenas na página de resultados
document.addEventListener('DOMContentLoaded', carregarResultados);
