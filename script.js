// Função para buscar resultados apenas se existir painelResultados
async function buscarResultados(termo) {
  const painel = document.getElementById('lista-resultados');
  if (!painel) return; // não faz nada se não estiver na página de resultados

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

    painel.innerHTML = '';

    if (resultados.length === 0) {
      painel.innerHTML = '<p>Nenhum resultado encontrado.</p>';
    } else {
      resultados.forEach(item => {
        const div = document.createElement('div');
        div.className = 'resultado';
        div.innerHTML = `
          <a href="${item.link}" class="link-titulo">
            <h3>${item.titulo}</h3>
          </a>
          <small>${item.link}</small>
          <p>${item.descricao}</p>
        `;
        painel.appendChild(div);
      });
    }
  } catch (erro) {
    console.error('Erro ao carregar index.json:', erro);
  }
}

// Captura evento de clique no botão
const btn = document.getElementById('botaoBusca');
const campo = document.getElementById('campoBusca');

if (btn && campo) {
  btn.addEventListener('click', () => {
    const termo = campo.value;
    if (termo.trim() !== "") {
      if (window.location.pathname.endsWith('index.html')) {
        window.location.href = `resultados.html?q=${encodeURIComponent(termo)}`;
      } else {
        buscarResultados(termo);
      }
    }
  });

  campo.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const termo = campo.value;
      if (termo.trim() !== "") {
        if (window.location.pathname.endsWith('index.html')) {
          window.location.href = `resultados.html?q=${encodeURIComponent(termo)}`;
        } else {
          buscarResultados(termo);
        }
      }
    }
  });
}

// Se estiver em página de resultados com query na URL
const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get('q');
if (query) {
  campo.value = query;
  buscarResultados(query);
}
