let paginaAtual = 1;
const POR_PAGINA = 10;
let termoAtual = "";
let abaAtual = "tudo";

function renderPaginacao(total) {
  const paginas = Math.ceil(total / POR_PAGINA);
  const nav = document.getElementById("paginacao") || document.createElement("div");
  nav.id = "paginacao";
  nav.innerHTML = "";

  for (let i = 1; i <= paginas; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = i === paginaAtual ? "ativa" : "";
    btn.onclick = () => {
      paginaAtual = i;
      carregarAba("imagens");
    };
    nav.appendChild(btn);
  }

function removerPaginacao() {
  const nav = document.getElementById("paginacao");
  if (nav) nav.remove();
}
  
  document.getElementById("lista-resultados").after(nav);
}

const ABAS = {
  tudo: { fonte: "index.json", render: "texto", painel: true },
  imagens: { fonte: "imagens.json", render: "grid" },
  videos: { fonte: "videos.json", render: "card" },
  noticias: { fonte: "noticias.json", render: "card" },
  filosofia: { fonte: "filosofia.json", render: "texto" },
  sociologia: { fonte: "sociologia.json", render: "texto" },
  geopolitica: { fonte: "geopolitica.json", render: "texto" }
};

function atualizarURL() {
  history.replaceState(null, "", `resultados.html?q=${encodeURIComponent(termoAtual)}&aba=${abaAtual}`);
}

async function carregarDados(arquivo) {
  const res = await fetch(arquivo);
  return res.json();
}

function filtrar(lista) {
  const t = termoAtual.toLowerCase();
  return lista.filter(item =>
    Object.values(item).some(v => typeof v === "string" && v.toLowerCase().includes(t))
  );
}

function renderTexto(item) {
  return `
    <div class="resultado">
      <a href="${item.link || '#'}" class="resultado-link" target="_blank" rel="noopener noreferrer">
        <h3>${item.titulo}</h3>
      </a>
      <p>${item.descricao || ""}</p>
    </div>
  `;
}

function renderGrid(item) {
  return `<img src="${item.src}" alt="${item.titulo || ''}">`;
}

function renderCard(item) {
  return `
    <div class="resultado card">
      <h3>${item.titulo}</h3>
      <p>${item.descricao || ""}</p>
    </div>
  `;
}

const RENDER = { texto: renderTexto, grid: renderGrid, card: renderCard };

async function carregarAba(aba) {
  abaAtual = ABAS[aba] ? aba : "tudo";
  atualizarURL();

  const config = ABAS[abaAtual];
  const dados = await carregarDados(config.fonte);
  const filtrados = filtrar(dados);

  const container = document.getElementById("lista-resultados");
  container.innerHTML = "";

  let lista = filtrados;

  // ===== PAGINAÇÃO APENAS PARA IMAGENS =====
  if (abaAtual === "imagens") {
    const inicio = (paginaAtual - 1) * POR_PAGINA;
    const fim = inicio + POR_PAGINA;
    lista = filtrados.slice(inicio, fim);
  }

  lista.forEach(item => {
    const html = RENDER[config.render](item);
    const div = document.createElement("div");
    div.innerHTML = html;

    // clique abre painel
    if (abaAtual === "imagens") {
      div.onclick = () => carregarPainel(item.id);
    }

    container.appendChild(div);
  });

  // ===== CRIA BOTÕES DE PÁGINA =====
  if (abaAtual === "imagens") {
    renderPaginacao(filtrados.length);
  } else {
    removerPaginacao();
  }

  if (config.painel && abaAtual === "tudo") {
    carregarPainel(termoAtual);
  } else {
    esconderPainel();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);
  termoAtual = params.get("q") || "";
  abaAtual = params.get("aba") || "tudo";

  const campo = document.getElementById("campoBusca");
  campo.value = termoAtual;

  document.querySelectorAll(".aba").forEach(btn => {
    btn.onclick = () => carregarAba(btn.dataset.aba);
  });

  document.getElementById("botaoBusca").onclick = () => {
    termoAtual = campo.value.trim();
    carregarAba(abaAtual);
  };

  if (termoAtual) carregarAba(abaAtual);

  // Destaque inicial da aba
  document.querySelectorAll(".aba").forEach(a => a.classList.remove("ativa"));
  const abaBtn = document.querySelector(`.aba[data-aba="${abaAtual}"]`);
  if (abaBtn) abaBtn.classList.add("ativa");
});
