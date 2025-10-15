// Função para buscar resultados no JSON
async function buscarResultados(termo) {
  termo = termo.toLowerCase().trim();
  if (!termo) return;

  try {
    const res = await fetch('index.json');
    const dados = await res.json();

    const resultados = dados.filter(item =>
      item.titulo.toLowerCase().includes(termo) ||
      item.descricao.toLowerCase().includes(termo) ||
      item.categoria.toLowerCase().includes(termo)
    );

    const lista = document.getElementById('lista-resultados');
    lista.innerHTML = ''; // limpa resultados anteriores

    if (resultados.length === 0) {
      lista.innerHTML = '<p>Nenhum resultado encontrado.</p>';
    } else {
      resultados.forEach(item => {
        const painel = document.createElement('div');
        painel.className = 'painel';

        painel.innerHTML = `
          <a href="${item.link}">
            <h3>${item.titulo}</h3>
          </a>
          <p>${item.descricao}</p>
          <small>${item.link}</small>
        `;

        lista.appendChild(painel);
      });
    }
  } catch (erro) {
    console.error('Erro ao carregar index.json:', erro);
  }
}

// Captura evento de clique no botão
document.getElementById('botaoBusca').addEventListener('click', () => {
  const termo = document.getElementById('campoBusca').value;
  buscarResultados(termo);
});

// Captura tecla Enter
document.getElementById('campoBusca').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const termo = document.getElementById('campoBusca').value;
    buscarResultados(termo);
  }
});

// Se estiver em página de resultados com query na URL
const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get('q');
if (query) {
  document.getElementById('campoBusca').value = query;
  buscarResultados(query);
}
