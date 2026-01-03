let termoAtual = "";
let abaAtual = "tudo";

const ABAS = {
  tudo: { arquivo: "index.json", painel: true },
  imagens: { arquivo: "imagens.json" },
  videos: { arquivo: "videos.json" },
  noticias: { arquivo: "noticias.json" },
  filosofia: { arquivo: "filosofia.json" },
  sociologia: { arquivo: "sociologia.json" },
  geopolitica: { arquivo: "geopolitica.json" }
};

function atualizarURL() {
  const params = new URLSearchParams();
  if (termoAtual) params.set("q", termoAtual);
  params.set("aba", abaAtual);
  history.replaceState(null, "", `?${params.toString()}`);
}

async function carregarJSON(arquivo) {
  const res = await fetch(arquivo);
  return await res.json();
}

function renderResultados(lista) {
  const container = document.getElementById("lista-resultados");
  container.innerHTML = "";

  if (!lista.length) {
    container.innerHTML = "<p>Nenhum resultado encontrado.</p>";
    return;
  }

  lista.forEach(item => {
    const div = document.createElement("div");
    div.className = "resultado";

    div.innerHTML = `
      <h3>${item.titulo || ""}</h3>
      <p>${item.descricao || ""}</p>
    `;

    container.appendChild(div);
  });
}

async function controlarPainel() {
  const painel = document.getElementById("painel");

  if (!ABAS[abaAtual]?.painel || !termoAtual) {
    painel.classList.add("oculto");
    return;
  }

  const dados = await carregarJSON("painel.json");
  const item = dados.find(i =>
    i.titulo?.toLowerCase() === termoAtual.toLowerCase()
  );

  if (!item) {
    painel.classList.add("oculto");
    return;
  }

  document.getElementById("painelTitulo").textContent = item.titulo || "";
  document.getElementById("painelCategoria").textContent = item.categoria || "";
  document.getElementById("painelDescricao").textContent = item.descricao || "";

  // imagens
  const imgBox = document.getElementById("painelImagens");
  imgBox.innerHTML = "";
  (item.imagens || []).forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    imgBox.appendChild(img);
  });

  // dados extras (Nascimento, Estúdio, etc.)
  const dadosBox = document.getElementById("painelDados");
  dadosBox.innerHTML = "";

  const ignorar = ["titulo", "categoria", "descricao", "imagens"];
  Object.entries(item).forEach(([chave, valor]) => {
    if (ignorar.includes(chave) || !valor) return;

    const p = document.createElement("p");
    p.innerHTML = `<strong>${formatarChave(chave)}:</strong> ${valor}`;
    dadosBox.appendChild(p);
  });

  painel.classList.remove("oculto");
}

function formatarChave(chave) {
  return chave.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

async function carregarAba() {
  atualizarURL();

  const config = ABAS[abaAtual];
  const dados = await carregarJSON(config.arquivo);

  const filtrados = termoAtual
    ? dados.filter(item =>
        JSON.stringify(item).toLowerCase().includes(termoAtual.toLowerCase())
      )
    : dados;

  renderResultados(filtrados);
  controlarPainel();
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  termoAtual = params.get("q") || "";
  abaAtual = params.get("aba") || "tudo";

  document.getElementById("campoBusca").value = termoAtual;

  document.getElementById("botaoBusca").onclick = () => {
    termoAtual = document.getElementById("campoBusca").value.trim();
    carregarAba();
  };

  document.getElementById("campoBusca").addEventListener("keypress", e => {
    if (e.key === "Enter") {
      termoAtual = e.target.value.trim();
      carregarAba();
    }
  });

  document.querySelectorAll(".aba").forEach(btn => {
    btn.onclick = () => {
      abaAtual = btn.dataset.aba;
      carregarAba();
    };
  });

  carregarAba();
});
