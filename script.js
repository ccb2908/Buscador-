async function carregarDados() {
  const resposta = await fetch('index.json');
  const dados = await resposta.json();
  return dados;
}

async function buscar(termoURL) {
  const campo = document.getElementById('campoBusca');
  const termo = termoURL || campo.value.toLowerCase();
  if (!termo) return;

  const resultadosDiv = document.getElementById('resultados');
  resultadosDiv.innerHTML = '';

  const dados = await carregarDados();
  const filtrados = dados.filter(item =>
    item.titulo.toLowerCase().includes(termo) ||
    item.descricao.toLowerCase().includes(termo)
  );

  if (filtrados.length === 0) {
    resultadosDiv.innerHTML = '<p>Nenhum resultado encontrado.</p>';
    return;
  }

  filtrados.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('resultado');

    card.innerHTML = `
      <h3>${item.titulo}</h3>
      <p>${item.descricao}</p>
      <button onclick='mostrarPainel(${JSON.stringify(item)})'>Ver mais</button>
    `;

    resultadosDiv.appendChild(card);
  });
}

function mostrarPainel(item) {
  const painel = document.getElementById('painelInfo');
  painel.innerHTML = `
    <div class="painel">
      <h2>${item.titulo}</h2>
      <p>${item.conteudo}</p>
      <button onclick="fecharPainel()">Fechar</button>
    </div>
  `;
  painel.style.display = 'block';
}

function fecharPainel() {
  document.getElementById('painelInfo').style.display = 'none';
}

window.onload = () => {
  const params = new URLSearchParams(window.location.search);
  const termo = params.get('q');
  if (termo) {
    document.getElementById('campoBusca').value = termo;
    buscar(termo);
  }
};
