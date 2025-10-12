async function pesquisar() {
  const termo = document.getElementById("campo").value.toLowerCase().trim();
  const container = document.getElementById("resultados");

  if (!termo) {
    container.innerHTML = "";
    return;
  }

  try {
    const resposta = await fetch("index.json");
    const dados = await resposta.json();

    const resultados = dados.filter(item =>
      item.titulo.toLowerCase().includes(termo) ||
      item.descricao.toLowerCase().includes(termo) ||
      item.categoria.toLowerCase().includes(termo)
    );

    mostrarResultados(resultados);
  } catch (erro) {
    container.innerHTML = "<p>❌ Erro ao carregar o índice.</p>";
  }
}

function mostrarResultados(lista) {
  const container = document.getElementById("resultados");
  container.innerHTML = "";

  if (lista.length === 0) {
    container.innerHTML = "<p>Nenhum resultado encontrado.</p>";
    return;
  }

  lista.forEach(item => {
    container.innerHTML += `
      <div class="resultado">
        <h3><a href="${item.link}" target="_blank">${item.titulo}</a></h3>
        <p>${item.descricao}</p>
        <span>${item.categoria}</span>
      </div>
    `;
  });
}
