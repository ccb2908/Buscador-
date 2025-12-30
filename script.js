let termoAtual = "";
let abaAtual = "tudo";

function atualizarURL() {
  const url = `resultados.html?q=${encodeURIComponent(termoAtual)}&aba=${abaAtual}`;
  history.replaceState(null, "", url);
}

function fontePorAba(aba) {
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

function acoesGlobais(item) {
  return `
    <div class="acoes">
      <button onclick='salvarItem("salvos", ${JSON.stringify(item)})'>⭐</button>
      <button onclick='salvarItem("favoritos", ${JSON.stringify(item)})'>❤️</button>
    </div>
  `;
}

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

function renderizarResultados(lista, aba) {
  const container = document.getElementById("lista-resultados");
  container.innerHTML = "";

  if (lista.length === 0) {
    container.innerHTML = "<p>Nenhum resultado encontrado.</p>";
    return;
  }

  lista.forEach(item => {
    let html = "";

    if (aba === "imagens") html = renderGrid(item);
    else if (aba === "videos" || aba === "noticias") html = renderCard(item);
    else html = renderTexto(item);

    container.innerHTML += html;
  });
}

async function controlarPainel() {
  const painel = document.getElementById("painel");
  if (abaAtual !== "tudo") {
    painel.style.display = "none";
    return;
  }

  try {
    const dados = await carregarDados("painel.json");
    const item = dados.find(p => p.titulo.toLowerCase() === termoAtual.toLowerCase());
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

async function carregarAba(aba) {
  abaAtual = aba;
  atualizarURL();

  const arquivo = fontePorAba(aba);
  const dados = await carregarDados(arquivo);
  const filtrados = filtrarPorTermo(dados, termoAtual);

  renderizarResultados(filtrados, aba);
  controlarPainel();
}


function salvarItem(tipo, item) {
  let lista = JSON.parse(localStorage.getItem(tipo)) || [];
  if (!lista.some(i => JSON.stringify(i) === JSON.stringify(item))) {
    lista.push(item);
    localStorage.setItem(tipo, JSON.stringify(lista));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  termoAtual = params.get("q") || "";
  abaAtual = params.get("aba") || "tudo";

  const campo = document.getElementById("campoBusca");
  if (campo) campo.value = termoAtual;

  if (termoAtual) carregarAba(abaAtual);
});


