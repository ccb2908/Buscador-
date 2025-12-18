// -------- Função de busca --------
async function buscarResultados(termo, aba = "todos") {
  termo = termo.toLowerCase().trim();
  if (!termo) return;

  let arquivoJSON = "index.json";
  if (aba !== "todos") arquivoJSON = `${aba}.json`;

  try {
    const res = await fetch(arquivoJSON);
    const dados = await res.json();

    const resultados = dados.filter(item =>
      item.titulo.toLowerCase().includes(termo) ||
      item.descricao.toLowerCase().includes(termo) ||
      item.categoria.toLowerCase().includes(termo)
    );

    const lista = document.getElementById("lista-resultados");
    if (!lista) return;

    lista.innerHTML = "";

    if (resultados.length === 0) {
      lista.innerHTML = "<p>Nenhum resultado encontrado.</p>";
    } else {
      resultados.forEach(item => {
        const div = document.createElement("div");
        div.className = "resultado";
       div.innerHTML = `
  <a href="${item.link}" class="titulo-link">
    <h3>${item.titulo}</h3>
  </a>
  <small>${item.link}</small>
  <p>${item.descricao}</p>

  <div class="acoes-resultados">
    <button class="btn-favorito" title="Favoritar">⭐</button>
    <button class="btn-salvar" title="Salvar">📌</button>
  </div>
`;
        const btnFav = div.querySelector(".btn-favorito");
const btnSalvar = div.querySelector(".btn-salvar");

btnFav.onclick = () => salvarItem("favoritos", item);
btnSalvar.onclick = () => salvarItem("salvos", item);
        lista.appendChild(div);
      }); 
      function salvarItem(tipo, item) {
  let lista = JSON.parse(localStorage.getItem(tipo)) || [];

  if (!lista.some(i => i.link === item.link)) {
    lista.push(item);
    localStorage.setItem(tipo, JSON.stringify(lista));
    alert(tipo === "favoritos" ? "Adicionado aos Favoritos ⭐" : "Salvo 📌");
  }
      }
    }
  } catch (erro) {
    console.error("Erro ao carregar JSON:", erro);
  }
}

// -------- Eventos Pesquisa Inicial --------
const botaoBuscaInicial = document.getElementById("botaoBuscaInicial");
const campoBuscaInicial = document.getElementById("campoBuscaInicial");

if (botaoBuscaInicial && campoBuscaInicial) {
  botaoBuscaInicial.addEventListener("click", () => {
    const termo = campoBuscaInicial.value;
    if (termo.trim() !== "") {
      window.location.href = `resultados.html?q=${encodeURIComponent(termo)}`;
    }
  });

  campoBuscaInicial.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const termo = campoBuscaInicial.value;
      if (termo.trim() !== "") {
        window.location.href = `resultados.html?q=${encodeURIComponent(termo)}`;
      }
    }
  });
}

// -------- Pesquisa em resultados --------
const botaoBusca = document.getElementById("botaoBusca");
const campoBusca = document.getElementById("campoBusca");

if (botaoBusca && campoBusca) {
  botaoBusca.addEventListener("click", () => {
    buscarResultados(campoBusca.value, abaAtiva());
  });

  campoBusca.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      buscarResultados(campoBusca.value, abaAtiva());
    }
  });

  // Carregar resultados da query na URL
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("q");
  if (query) {
    campoBusca.value = query;
    buscarResultados(query, abaAtiva());
  }
}

// -------- Abas --------
function abaAtiva() {
  const aba = document.querySelector(".aba.ativa");
  return aba ? aba.dataset.aba : "todos";
}

document.querySelectorAll(".aba").forEach(aba => {
  aba.addEventListener("click", () => {
    document.querySelectorAll(".aba").forEach(a => a.classList.remove("ativa"));
    aba.classList.add("ativa");
    if (campoBusca) buscarResultados(campoBusca.value, aba.dataset.aba);
  });
});

// -------- Botão de Configurações --------
document.querySelectorAll("#botaoConfiguracoes").forEach(botao => {
  botao.addEventListener("click", () => {
    window.location.href = "configuracoes.html";
  });
});

// -------- Botão Voltar em Configurações --------
const botaoVoltar = document.getElementById("botaoVoltar");
if (botaoVoltar) {
  botaoVoltar.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}
