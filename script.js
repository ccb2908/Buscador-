async function carregarDados() {
  const resposta = await fetch('index.json');
  const dados = await resposta.json();
  return dados;
}

async function buscar() {
document.getElementById("botaoBuscar").addEventListener("click", function() {
  const termo = document.getElementById("busca").value.toLowerCase();
  const resultadosDiv = document.getElementById("resultados");
  resultadosDiv.innerHTML = "Buscando...";

  fetch("Index.json")
    .then(res => res.json())
    .then(dados => {
      const encontrados = dados.filter(item =>
        item.titulo.toLowerCase().includes(termo) ||
        item.texto.toLowerCase().includes(termo)
      );

      resultadosDiv.innerHTML = "";

      if (encontrados.length === 0) {
        resultadosDiv.innerHTML = "<p>Nenhum resultado encontrado.</p>";
      } else {
        encontrados.forEach(item => {
          resultadosDiv.innerHTML += `
            <div class="resultado">
              <a href="${item.link}" target="_blank">${item.titulo}</a>
              <p>${item.texto}</p>
            </div>
          `;
        });
      }
    })
    .catch(err => {
      resultadosDiv.innerHTML = "<p>Erro ao carregar os dados.</p>";
      console.error(err);
    });
});
s(item) {
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
