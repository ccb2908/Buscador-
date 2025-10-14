async function pesquisar() {
  const termo = document.getElementById("campo").value.toLowerCase().trim();
  const resultadosDiv = document.getElementById("resultados");
  resultadosDiv.innerHTML = "";

  if (termo === "") return;

  try {
    const response = await fetch("index.json");
    const dados = await response.json();

    const campos = ["altura", "peso", "nascimento", "raça", "parentesco", "transformacoes"];

    const resultados = dados.filter(item =>
      item.nome.toLowerCase().includes(termo) ||
      campos.some(campo => (item[campo] && item[campo].toLowerCase().includes(termo))) ||
      item.descricao.toLowerCase().includes(termo)
    );

    if (resultados.length === 0) {
      resultadosDiv.innerHTML = "<p>Nenhum resultado encontrado.</p>";
      return;
    }

    resultados.forEach(item => {
      let resultadoHTML = `<h3>${item.nome}</h3>`;

      // Busca específica
      if (termo.includes("altura")) resultadoHTML += `<p><strong>Altura:</strong> ${item.altura}</p>`;
      else if (termo.includes("peso")) resultadoHTML += `<p><strong>Peso:</strong> ${item.peso}</p>`;
      else if (termo.includes("nascimento")) resultadoHTML += `<p><strong>Nascimento:</strong> ${item.nascimento}</p>`;
      else if (termo.includes("raça")) resultadoHTML += `<p><strong>Raça:</strong> ${item.raça}</p>`;
      else if (termo.includes("parentesco")) resultadoHTML += `<p><strong>Parentesco:</strong> ${item.parentesco}</p>`;
      else if (termo.includes("transforma")) resultadoHTML += `<p><strong>Transformações:</strong> ${item.transformacoes.join(", ")}</p>`;
      else resultadoHTML += `<p>${item.descricao}</p>`;

      resultadosDiv.innerHTML += `<div class='card'>${resultadoHTML}</div>`;
    });
  } catch (erro) {
    resultadosDiv.innerHTML = "<p>Erro ao carregar dados.</p>";
    console.error(erro);
  }
     <div class="resultado">
        <h3><a href="${item.link}" target="_blank">${item.titulo}</a></h3>
        <p>${item.descricao}</p>
        <span>${item.categoria}</span>
      </div>
    `;
  });
}
{ resultados.forEach(item => {
  const card = document.createElement('div');
  card.className = 'resultado';
  card.innerHTML = `
    <h3>${item.titulo}</h3>
    <p>${item.descricao}</p>
  `;
  card.addEventListener('click', () => {
    painel.innerHTML = `
      <h2>${item.titulo}</h2>
      <p>${item.detalhes || "Em breve mais informações..."}</p>
    `;
  });
  painel.appendChild(card);
});
