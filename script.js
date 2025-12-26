async function buscarResultados(termo, aba = "todos") {
  termo = termo.toLowerCase().trim();
  if (!termo) return;

  let arquivo = "index.json";
  if (aba !== "todos") arquivo = `${aba}.json`;

  try {
    const res = await fetch(arquivo);
    const dados = await res.json();

    const resultados = dados.filter(item =>
      (item.titulo || "").toLowerCase().includes(termo) ||
      (item.descricao || "").toLowerCase().includes(termo) ||
      (item.categoria || "").toLowerCase().includes(termo)
    );
    
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

    let extras = "";
if (item.nascimento) extras += `<li><strong>Nascimento:</strong> ${item.nascimento}</li>`;
if (item.morte) extras += `<li><strong>Morte:</strong> ${item.morte}</li>`;
if (item.altura) extras += `<li><strong>Altura:</strong> ${item.altura}</li>`;
if (item.familia) extras += `<li><strong>Família:</strong> ${item.familia}</li>`;
if (item.filhos) extras += `<li><strong>Filhos:</strong> ${item.filhos}</li>`;
    const lista = document.getElementById("lista-resultados");
    lista.innerHTML = "";

    if (resultados.length === 0) {
      lista.innerHTML = "<p>Nenhum resultado encontrado.</p>";
      return;
    }

    resultados.forEach(item => {
      const div = document.createElement("div");
      div.className = "resultado";

      div.innerHTML = `
        <a href="${item.link || "#"}" class="titulo-link" target="_blank">
          <h3>${item.titulo}</h3>
        </a>
        <small>${item.link || ""}</small>
        <p>${item.descricao || ""}</p>

        <div class="acoes-resultados">
          <button class="btn-favorito">⭐</button>
          <button class="btn-salvar">📌</button>
        </div>
      `;

      div.querySelector(".btn-favorito").onclick =
        () => salvarItem("favoritos", item);

      div.querySelector(".btn-salvar").onclick =
        () => salvarItem("salvos", item);

      lista.appendChild(div);
    });

  } catch (e) {
    console.error("Erro ao carregar", arquivo, e);
  }
}
