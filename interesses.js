const temasSelecionados = new Set();

function mostrarTemas() {
  document.getElementById('boasVindas').classList.add('oculto');
  document.getElementById('selecaoTemas').classList.remove('oculto');

  document.querySelectorAll('.tema').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('ativo');
      const tema = btn.textContent;

      if (temasSelecionados.has(tema)) {
        temasSelecionados.delete(tema);
      } else {
        temasSelecionados.add(tema);
      }
    });
  });
}

function salvarInteresses() {
  localStorage.setItem('interesses', JSON.stringify([...temasSelecionados]));
  document.getElementById('selecaoTemas').classList.add('oculto');
  document.getElementById('painelInteresses').classList.remove('oculto');

  carregarConteudos();
}

function carregarConteudos() {
  // por enquanto exemplo fixo
  const painel = document.getElementById('painelInteresses');

  painel.innerHTML = `
    <div class="card-interesse">
      <img src="exemplo.jpg">
      <div class="conteudo">
        <h3>Exemplo de Artigo</h3>
        <p>Resumo curto e consciente do conteúdo.</p>
        <a href="#" target="_blank">Ler fonte</a>
      </div>
      <div class="acoes">
        <button>⭐</button>
        <button>📤</button>
      </div>
    </div>
  `;
}
