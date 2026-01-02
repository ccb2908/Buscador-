/* =========================
   ESTADO CENTRAL
========================= */
let termoAtual = "";
let abaAtual = "tudo";

/* =========================
   CONFIGURAÇÃO DAS ABAS
========================= */
const ABAS = {
  tudo: {
    fonte: "index.json",
    render: "texto",
    painel: true
  },
  imagens: {
    fonte: "imagens.json",
    render: "grid"
  },
  videos: {
    fonte: "videos.json",
    render: "card"
  },
  noticias: {
    fonte: "noticias.json",
    render: "card"
  },
  filosofia: {
    fonte: "filosofia.json",
    render: "texto"
  },
  sociologia: {
    fonte: "sociologia.json",
    render: "texto"
  },
  geopolitica: {
    fonte: "geopolitica.json",
    render: "texto"
  }
};

/* =========================
   URL
========================= */
function atualizarURL() {
  const url = `resultados.html?q=${encodeURIComponent(termoAtual)}&aba=${abaAtual}`;
  history.replaceState(null, "", url);
}

/* =========================
   DADOS
========================= */
async function carregarDados(arquivo) {
  const res = await fetch(arquivo);
  return await res.json();
}

function filtrarPorTermo(lista, termo) {
  termo = termo.toLowerCase();
  return lista.filter(item =>
    Object.values(item).some(valor =>
      typeof valor === "string" && valor.toLowerCase().includes(termo)
    )
  );
}

/* =========================
   AÇÕES GLOBAIS ⭐ ❤️
========================= */
function salvarItem(tipo, item) {
  const chave = `lupa_${tipo}`;
  let lista = JSON.parse(localStorage.getItem(chave)) || [];

  if (!lista.some(i => JSON.stringify(i) === JSON.stringify(item))) {
    lista.push(item);
    localStorage.setItem(chave, JSON.stringify(lista));
  }
}

function acoesGlobais(item) {
  return `
    <div class="acoes">
      <button onclick='salvarItem("salvos", ${JSON.stringify(item)})'>⭐</button>
      <button onclick='salvarItem("favoritos", ${JSON.stringify(item)})'>❤️</button>
    </div>
  `;
}

/* =========================
   RENDERIZADORES
========================= */
function renderTexto(item) {
  return `
    <div class="resultado texto">
      <h3>${item.titulo || item.termo}</h3>
      <p>${item.descricao || item.contexto || ""}</p>
      ${acoesGlobais(item)}
    </div>
  `;
}

function renderGrid(item) {
  return `
    <div class="grid-item">
      <img src="${item.src}" alt="${item.titulo || ""}">
      <div class="overlay">
        <span>${item.titulo || ""}</span>
        ${acoesGlobais(item)}
      </div>
    </div>
  `;
}

function renderCard(item) {
  return `
    <div class="resultado card">
      <img src="${item.thumbnail || ""}">
      <h3>${item.titulo}</h3>
      <p>${item.descricao || ""}</p>
      ${acoesGlobais(item)}
    </div>
  `;
}

const RENDERERS = {
  texto: renderTexto,
  grid: renderGrid,
  card: renderCard
};

/* =========================
   RESULTADOS
========================= */
function renderizarResultados(lista, tipoRender) {
  const container = document.getElementById("lista-resultados");
  container.innerHTML = "";

  if (!lista.length) {
    container.innerHTML = "<p>Nenhum resultado encontrado.</p>";
    return;
  }

  lista.forEach(item => {
    container.innerHTML += RENDERERS[tipoRender](item);
  });
}

/* =========================
   PAINEL (ABA TUDO)
========================= */
async function controlarPainel() {
  const painel = document.getElementById("painel");

  if (!ABAS[abaAtual]?.painel) {
    painel.style.display = "none";
    return;
  }

  try {
    const dados = await carregarDados("painel.json");
    const item = dados.find(p =>
      p.titulo.toLowerCase() === termoAtual.toLowerCase()
    );

    if (!item) {
      painel.style.display = "none";
      return;
    }

    document.getElementById("tituloPainel").textContent = item.titulo;
    document.getElementById("categoriaPainel").textContent = item.categoria || "";
    document.getElementById("descricaoPainel").textContent = item.descricao || "";

    const imgs = document.getElementById("imagensPainel");
    imgs.innerHTML = "";
    (item.imagens || []).forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      imgs.appendChild(img);
    });

    painel.style.display = "block";
  } catch {
    painel.style.display = "none";
  }
}

/* =========================
   CONTROLE CENTRAL
========================= */
async function carregarAba(aba) {
  abaAtual = ABAS[aba] ? aba : "tudo";
  atualizarURL();

  const config = ABAS[abaAtual];
  const dados = await carregarDados(config.fonte);
  const filtrados = filtrarPorTermo(dados, termoAtual);

  renderizarResultados(filtrados, config.render);
  controlarPainel();
}

/* =========================
   INICIALIZAÇÃO
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  termoAtual = params.get("q") || "";
  abaAtual = params.get("aba") || "tudo";

  const campo = document.getElementById("campoBusca");
  if (campo) campo.value = termoAtual;

  if (termoAtual) carregarAba(abaAtual);
});
