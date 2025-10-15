// Captura query da URL
const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get('q')?.toLowerCase() || '';

// Carrega o index.json e exibe os resultados
fetch('index.json')
  .then(res => res.json())
  .then(data => {
    const resultados = data.filter(item => {
      // Cada item será exibido somente se a query estiver em titulo, descricao ou categoria
      return item.titulo.toLowerCase().includes(query) ||
             item.descricao.toLowerCase().includes(query) ||
             item.categoria.toLowerCase().includes(query);
    });

    const lista = document.getElementById('lista-resultados');
    if(resultados.length === 0){
      lista.innerHTML = '<p>Nenhum resultado encontrado.</p>';
    } else {
      // Agora cada painel exibe só o que corresponde à pesquisa
      lista.innerHTML = resultados.map(item =>
        `<div class="painel">
          <a href="${item.link}">
            <h3>${item.titulo}</h3>
            <p>${item.descricao}</p>
          </a>
        </div>`
      ).join('');
    }
  })
  .catch(err => {
    console.error('Erro ao carregar o index.json:', err);
  });

// Busca ao clicar no botão
document.getElementById('botaoBusca').addEventListener('click', () => {
  const termo = document.getElementById('campoBusca').value;
  if(termo.trim() !== "") {
    window.location.href = `resultados.html?q=${encodeURIComponent(termo)}`;
  }
});

// Busca ao pressionar Enter
document.getElementById('campoBusca').addEventListener('keypress', (e) => {
  if(e.key === 'Enter') {
    const termo = document.getElementById('campoBusca').value;
    if(termo.trim() !== "") {
      window.location.href = `resultados.html?q=${encodeURIComponent(termo)}`;
    }
  }
});
