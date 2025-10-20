// Busca de resultados
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
    if (!lista) return;

    lista.innerHTML = '';

    if (resultados.length === 0) {
      lista.innerHTML = '<p>Nenhum resultado encontrado.</p>';
    } else {
      resultados.forEach(item => {
        const div = document.createElement('div');
        div.className = 'resultado';
        div.innerHTML = `
          <a href="${item.link}" target="_blank">
            <h3>${item.titulo}</h3>
          </a>
          <small>${item.link}</small>
          <p>${item.descricao}</p>
        `;
        lista.appendChild(div);
      });
    }
  } catch (erro) {
    console.error('Erro ao carregar index.json:', erro);
  }
}

// Eventos de pesquisa
const campo = document.getElementById('campoBusca');
const btn = document.getElementById('botaoBusca');
const btnConfig = document.getElementById('btnConfig');

if (btn && campo) {
  btn.addEventListener('click', () => {
    const termo = campo.value.trim();
    if (!termo) return;

    if (window.location.pathname.endsWith('index.html')) {
      window.location.href = `resultados.html?q=${encodeURIComponent(termo)}`;
    } else {
      buscarResultados(termo);
    }
  });

  campo.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const termo = campo.value.trim();
      if (!termo) return;

      if (window.location.pathname.endsWith('index.html')) {
        window.location.href = `resultados.html?q=${encodeURIComponent(termo)}`;
      } else {
        buscarResultados(termo);
      }
    }
  });
}

// Configurações
if (btnConfig) {
  btnConfig.addEventListener('click', () => {
    window.location.href = 'configuracoes.html';
  });
}

// Página de resultados
const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get('q');
if (query && campo) {
  campo.value = query;
  buscarResultados(query);
}

// Limpar Cache na Configurações
const btnLimparCache = document.getElementById('limparCache');
if (btnLimparCache) {
  btnLimparCache.addEventListener('click', () => {
    localStorage.clear();
    alert('Cache limpo com sucesso!');
  });
}
document.getElementById('botaoBusca').addEventListener('click', () => {
  const termo = document.getElementById('campoBusca').value;
  buscarResultados(termo);
});
                                                       }
