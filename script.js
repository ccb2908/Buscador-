let noticias = [];
let interessesUsuario = ["Geopolítica","EUA","Rússia","Turquia","Irã","China","Japão","Indonésia"];

async function pesquisar() {
  const termo = document.getElementById("campo").value.toLowerCase().trim();
  const container = document.getElementById("resultados");

  if (!termo) {
    container.innerHTML = "";
    return;
  }

  try {
    const resposta = await fetch("index.json");
    const dados = await resposta.json();

    const resultados = dados.filter(item =>
      item.titulo.toLowerCase().includes(termo) ||
      item.descricao.toLowerCase().includes(termo) ||
      item.categoria.toLowerCase().includes(termo)
    );

    mostrarResultados(resultados);
  } catch (erro) {
    container.innerHTML = "<p>❌ Erro ao carregar o índice.</p>";
  }
}

function mostrarResultados(lista) {
  const container = document.getElementById("resultados");
  container.innerHTML = "";

  if (lista.length === 0) {
    container.innerHTML = "<p>Nenhum resultado encontrado.</p>";
    return;
  }

  lista.forEach(item => {
    container.innerHTML += `
      <div class="resultado">
        <h3><a href="${item.link}" target="_blank">${item.titulo}</a></h3>
        <p>${item.descricao}</p>
        <span>${item.categoria}</span>
      </div>
    `;
  });
}

// Notícias
async function carregarNoticias() {
  const resposta = await fetch("noticias.json");
  noticias = await resposta.json();
  atualizarContador();
}

function atualizarContador() {
  const count = noticias.filter(n => interessesUsuario.includes(n.categoria)).length;
  document.getElementById("contador").textContent = count > 0 ? `(${count})` : "";
}

function mostrarNoticias() {
  const container = document.getElementById("noticias-container");
  container.innerHTML = "";

  const filtradas = noticias.filter(n => interessesUsuario.includes(n.categoria));

  if(filtradas.length === 0){
    container.innerHTML = "<p>Nenhuma notícia nova.</p>";
  } else {
    filtradas.forEach(n => {
      container.innerHTML += `<p><a href="${n.link}" target="_blank">📰 ${n.titulo}</a></p>`;
    });
  }

  container.classList.toggle("oculto"); 
}

// Carregar notícias ao iniciar
window.onload = carregarNoticias;     resultadosDiv.innerHTML += `<div class='card'>${resultadoHTML}</div>`;
    });
  } catch (erro) {
    resultadosDiv.innerHTML = "<p>Erro ao carregar dados.</p>";
    console.error(erro);
  }
