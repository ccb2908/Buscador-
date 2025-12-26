async function buscarResultados(termo, aba = "todos") {
  termo = termo.toLowerCase().trim();
  if (!termo) return;

  const arquivo = arquivoPorAba(aba);

  try {
    const res = await fetch(arquivo);
    const dados = await res.json();

    const resultados = dados.filter(item =>
      Object.values(item).some(valor =>
        String(valor).toLowerCase().includes(termo)
      )
    );

    const lista = document.getElementById("lista-resultados");
    lista.innerHTML = "";

    if (resultados.length === 0) {
      lista.innerHTML = "<p>Nenhum resultado encontrado.</p>";
      return;
    }

    resultados.forEach(item => {
      lista.innerHTML += renderizarResultado(item, aba);
    });

  } catch (e) {
    console.error("Erro ao carregar dados:", e);
  }
}

function arquivoPorAba(aba) {
  switch (aba) {
    case "imagens": return "imagens.json";
    case "videos": return "videos.json";
    case "noticias": return "noticias.json";
    case "filosofia": return "filosofia.json";
    case "sociologia": return "sociologia.json";
    case "geopolitica": return "geopolitica.json";
    default: return "index.json";
  }
}

function renderizarResultado(item, aba) {

  let extras = "";

  if (item.nascimento) extras += `<li><strong>Nascimento:</strong> ${item.nascimento}</li>`;
  if (item.morte) extras += `<li><strong>Morte:</strong> ${item.morte}</li>`;
  if (item.capital) extras += `<li><strong>Capital:</strong> ${item.capital}</li>`;
  if (item.governo) extras += `<li><strong>Governo:</strong> ${item.governo}</li>`;
  if (item.presidente) extras += `<li><strong>Presidente:</strong> ${item.presidente}</li>`;
  if (item.populacao) extras += `<li><strong>População:</strong> ${item.populacao}</li>`;
  if (item.moeda) extras += `<li><strong>Moeda:</strong> ${item.moeda}</li>`;
  if (item.area) extras += `<li><strong>Área:</strong> ${item.area}</li>`;

  return `
    <div class="resultado">
      <h3>${item.titulo}</h3>
      <p>${item.categoria || ""}</p>
      <p>${item.descricao || ""}</p>

      ${extras ? `<ul class="detalhes">${extras}</ul>` : ""}

      <div class="acoes-resultados">
        <button onclick='salvarItem("favoritos", ${JSON.stringify(item)})'>⭐</button>
        <button onclick='salvarItem("salvos", ${JSON.stringify(item)})'>📌</button>
      </div>
    </div>
  `;
}
