async function buscar(termo) {
  const resposta = await fetch("index.json");
  const dados = await resposta.json();
  termo = termo.toLowerCase().trim();

  // Se o usuário não digitou nada, limpa os resultados
  if (!termo) {
    exibirResultados([]);
    return;
  }

  // Sistema de relevância inteligente
  const resultados = dados
    .map(item => {
      let relevancia = 0;
      const titulo = item.titulo.toLowerCase();
      const descricao = item.descricao.toLowerCase();

      // Pontuação base
      if (titulo.includes(termo)) relevancia += 3;
      if (descricao.includes(termo)) relevancia += 2;

      // Bônus se todas as palavras estiverem presentes
      const palavras = termo.split(" ");
      const todasPresentes = palavras.every(p => descricao.includes(p) || titulo.includes(p));
      if (todasPresentes) relevancia += 2;

      // Bônus por múltiplas ocorrências
      const ocorrencias = (descricao.match(new RegExp(termo, "g")) || []).length;
      relevancia += ocorrencias;

      return { ...item, relevancia };
    })
    .filter(item => item.relevancia > 0)
    .sort((a, b) => b.relevancia - a.relevancia);

  exibirResultados(resultados);
}

// Função para exibir resultados na página
function exibirResultados(resultados) {
  const container = document.getElementById("resultados");
  container.innerHTML = "";

  if (resultados.length === 0) {
    // Mensagem quando não há resultados
    const msg = document.createElement("div");
    msg.textContent = "⚠️ Nenhum resultado encontrado.";
    msg.style.color = "#a080ff";
    msg.style.textAlign = "center";
    msg.style.marginTop = "20px";
    container.appendChild(msg);
    return;
  }

  // Cria cada painel de resultado
  resultados.forEach(item => {
    const painel = document.createElement("div");
    painel.classList.add("resultado-item");
    painel.innerHTML = `
      <h3><a href="${item.link}" style="color: #00cc66;">${item.titulo}</a></h3>
      <p style="color: #ccc;">${item.descricao}</p>
      <small style="color: #a080ff;">Categoria: ${item.categoria}</small>
      <hr style="border-color: rgba(255,255,255,0.1); margin: 10px 0;">
    `;
    container.appendChild(painel);
  });
}
