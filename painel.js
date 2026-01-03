async function carregarPainel(termo) {
  const painel = document.getElementById("painel");

  if (!termo) {
    painel.style.display = "none";
    return;
  }

  const dados = await fetch("painel.json").then(r => r.json());
  const item = dados.find(p =>
    p.titulo.toLowerCase() === termo.toLowerCase()
  );

  if (!item) {
    painel.style.display = "none";
    return;
  }

  painel.innerHTML = `
    <div class="painel-box">
      <h2>${item.titulo}</h2>
      <p>${item.descricao}</p>
    </div>
  `;
  painel.style.display = "block";
}

function esconderPainel() {
  const painel = document.getElementById("painel");
  painel.style.display = "none";
}
