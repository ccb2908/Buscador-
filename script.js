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
