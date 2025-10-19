// ---------- TEMA E IDIOMA ----------
function aplicarTema() {
  const tema = localStorage.getItem('tema') || 'claro';
  if(tema === 'escuro'){
    document.body.style.backgroundColor = '#121212';
    document.body.style.color = '#f0f0f0';
  } else if(tema === 'automatico'){
    const hora = new Date().getHours();
    if(hora >= 18 || hora < 6){
      document.body.style.backgroundColor = '#121212';
      document.body.style.color = '#f0f0f0';
    } else {
      document.body.style.backgroundColor = '#fff';
      document.body.style.color = '#202124';
    }
  } else {
    document.body.style.backgroundColor = '#fff';
    document.body.style.color = '#202124';
  }
}

function aplicarIdioma() {
  const idioma = localStorage.getItem('idioma') || 'pt';
  document.querySelectorAll('[data-text-pt]').forEach(el => {
    if(idioma === 'pt') el.textContent = el.getAttribute('data-text-pt');
    else if(idioma === 'gr') el.textContent = el.getAttribute('data-text-gr') || el.textContent;
    else if(idioma === 'es') el.textContent = el.getAttribute('data-text-es') || el.textContent;
    else if(idioma === 'pl') el.textContent = el.getAttribute('data-text-pl') || el.textContent;
    else if(idioma === 'de') el.textContent = el.getAttribute('data-text-de') || el.textContent;
  });
}

aplicarTema();
aplicarIdioma();

// ---------- BUSCA ----------
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
    if(!lista) return; // evita erro em páginas sem painel de resultados
    lista.innerHTML = '';

    if (resultados.length === 0) {
      lista.innerHTML = '<p>Nenhum resultado encontrado.</p>';
    } else {
      resultados.forEach(item => {
        const div = document.createElement('div');
        div.className = 'resultado';
        div.innerHTML = `
          <a href="${item.link}">
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

// Busca pelos botões e inputs
const btnBusca = document.getElementById('botaoBusca');
if(btnBusca){
  btnBusca.addEventListener('click', () => {
    const termo = document.getElementById('campoBusca').value;
    buscarResultados(termo);
  });
}
const campoBusca = document.getElementById('campoBusca');
if(campoBusca){
  campoBusca.addEventListener('keypress', (e) => {
    if(e.key === 'Enter'){
      buscarResultados(campoBusca.value);
    }
  });
}

// Página de resultados via URL
const urlParams = new URLSearchParams(window.location.search);
const query
