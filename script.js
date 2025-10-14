async function carregarDados() {
  const resposta = await fetch('index.json');
  const dados = await resposta.json();
  return dados;
}

async function buscar() {
  const termo = document.getElementById('campoBusca').value.toLowerCase();
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

    const titulo = document.createElement('h3');
    titulo.textContent = item.titulo;

    const descricao = document.createElement('p');
    descricao.textContent = item.descricao;

    const botao = document.createElement('button');
    botao.textContent = 'Ver mais';
    botao.onclick = () => mostrarDetalhes(item);

    card.appendChild(titulo);
    card.appendChild(descricao);
    card.appendChild(botao);

    resultadosDiv.appendChild(card);
  });
}

function mostrarDetalhes(item) {
  const painel = document.getElementById('painelDetalhes');
  painel.innerHTML = `
    <h2>${item.titulo}</h2>
    <p>${item.conteudo}</p>
    <button onclick="fecharPainel()">Fechar</button>
  `;
  painel.style.display = 'block';
}

function fecharPainel() {
  document.getElementById('painelDetalhes').style.display = 'none';
}
