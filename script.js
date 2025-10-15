async function carregarDados() {
  const resposta = await fetch('index.json');
  const dados = await resposta.json();
  return dados;
}

function destacarTrecho(texto, termo) {
  const termoLower = termo.toLowerCase();
  const index = texto.toLowerCase().indexOf(termoLower);

  // Se o termo não for encontrado, retorna o texto inteiro
  if (index === -1) return texto;

  // Define o trecho que será mostrado (30 caracteres antes e depois)
  const inicio = Math.max(0, index - 30);
  const fim = Math.min(texto.length, index + termo.length + 30);
  const trecho = texto.substring(inicio, fim);

  // Destaca o termo com a cor roxa da interface
  return "..." + trecho.replace(
    new RegExp(termo, "gi"),
    match => `<mark style="background-color:#7A42F4; color:#fff; border-radius:3px; padding:1px 3px;">${match}</mark>`
  ) + "...";
}

async function buscar(termo) {
  const dados = await carregarDados();
  const resultados = dados.filter(item =>
    item.titulo.toLowerCase().includes(termo.toLowerCase()) ||
    item.descricao.toLowerCase().includes(termo.toLowerCase())
  );
  exibirResultados(resultados, termo);
}

function exibirResultados(resultados, termo) {
  const container = document.getElementById("resultados");
  container.innerHTML = "";

  if (resultados.length === 0) {
    container.innerHTML = `<p style="color:#ccc;">Nenhum resultado encontrado para <strong>${termo}</strong>.</p>`;
    return;
  }

  resultados.forEach(item => {
    const div = document.createElement("div");
    div.className = "resultado-item";
    div.innerHTML = `
      <a href="${item.link}" target="_blank" class="titulo-link">${item.titulo}</a>
      <p style="color:#ccc;">${destacarTrecho(item.descricao, termo)}</p>
      <p style="font-size:13px; color:#7A42F4;">Categoria: ${item.categoria}</p>
    `;
    container.appendChild(div);
  });
}

document.getElementById("search-form").addEventListener("submit", e => {
  e.preventDefault();
  const termo = document.getElementById("search-input").value.trim();
  if (termo) buscar(termo);
});
