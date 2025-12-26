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
    function renderizarResultado(item, aba) {
  if (aba === "filosofia") {
    return `
      <div class="resultado filosofia">
        <h3>${item.termo}</h3>

        <p><strong>Contexto filosófico:</strong></p>
        <p>${item.contexto}</p>

        <p><strong>Tradições:</strong> ${item.tradicoes.join(", ")}</p>

        <ul>
          ${item.questoes.map(q => `<li>${q}</li>`).join("")}
        </ul>
      </div>
    `;
  }

  if (aba === "sociologia") {
    return `
      <div class="resultado sociologia">
        <h3>${item.termo}</h3>
        <p>${item.contexto_social}</p>
        <p><strong>Grupos:</strong> ${item.grupos.join(", ")}</p>
      </div>
    `;
  }

  if (aba === "geopolitica") {
    return `
      <div class="resultado geopolitica">
        <h3>${item.termo}</h3>
        <p>${item.contexto}</p>
        <p><strong>Atores:</strong> ${item.atores.join(", ")}</p>
        <p><strong>Regiões:</strong> ${item.regioes.join(", ")}</p>
      </div>
    `;
  }

  // padrão (Tudo)
  return `
    <div class="resultado">
      <h3>${item.titulo}</h3>
      <p>${item.descricao}</p>
    </div>
  `;
    }

    lista.innerHTML += renderizarResultado(item, aba);

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
        <p>${item.nascimento || ""}</p>
        <p>${item.morte || ""}</p>
        <p>${item.altura || ""}</p>
        <p>${item.familia || ""}</p>
        <p>${item.esposa || ""}</p>
        <p>${item.filhos || ""}</p>
        <p>${item.lancamento || ""}</p>
        <p>${item.finalizacao || ""}</p>
        <p>${item.capitulos || ""}</p>
        <p>${item.autor || ""}</p>
        <p>${item.avaliacao || ""}</p>
        <p>${item.genero || ""}</p>
        <p>${item.capital || ""}</p>
        <p>${item.idiomas || ""}</p>
        <p>${item.grupos_etnicos || ""}</p>
        <p>${item.fundacao || ""}</p>
        <p>${item.moeda || ""}</p>
        <p>${item.area || ""}</p>
        painel.innerHTML = `
  
`;

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
