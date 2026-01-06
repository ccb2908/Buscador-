let termoAtual = "";
let abaAtual = "tudo";

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
  history.replaceState(
    null,
    "",
    `resultados.html?q=${encodeURIComponent(termoAtual)}&aba=${abaAtual}`
  );
}

async function carregarDados(arquivo) {
  const res = await fetch(arquivo);
  return res.json();
}

function filtrar(lista) {
  const t = termoAtual.toLowerCase();
  return lista.filter(item =>
    Object.values(item).some(v =>
      typeof v === "string" && v.toLowerCase().includes(t)
    )
  );
}

function renderTexto(item) {
  return `
    <div class="resultado">
      <a href="${item.link || '#'}" class="resultado-link">
        <h3>${item.titulo}</h3>
      </a>
      <p>${item.descricao || ""}</p>
    </div>
  `;
}

function renderGrid(item) {
  return `<img src="${item.src}" alt="">`;
}

function renderCard(item) {
  return `
    <div class="resultado card">
      <h3>${item.titulo}</h3>
      <p>${item.descricao || ""}</p>
    </div>
  `;
}

function renderImagens(resultados) {
  const lista = document.getElementById("lista-resultados");
  lista.innerHTML = "";

  resultados.forEach(img => {
    lista.innerHTML += `
      <div class="imagem-card">
        <img src="${img.src}" alt="${img.titulo}">
      </div>
    `;
  });
}

const RENDER = {
  texto: renderTexto,
  grid: renderGrid,
  card: renderCard
};

async function carregarAba(aba) {
  abaAtual = ABAS[aba] ? aba : "tudo";
  atualizarURL();

  const config = ABAS[abaAtual];
  const dados = await carregarDados(config.fonte);
  const filtrados = filtrar(dados);

  const container = document.getElementById("lista-resultados");
  container.innerHTML = "";

  filtrados.forEach(item => {
    container.innerHTML += RENDER[config.render](item);
  });

  if (config.painel) {
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
});

if (aba === "imagens") {
  renderImagens(dadosImagens);
  esconderPainel();
}

document.querySelectorAll(".aba").forEach(aba => {
  aba.addEventListener("click", () => {
    document.querySelectorAll(".aba").forEach(a =>
      a.classList.remove("ativa")
    );
    aba.classList.add("ativa");
  });
});
