function buscar() {
  const termo = document.getElementById('campoBusca').value.toLowerCase();
  fetch('index.json')
    .then(res => res.json())
    .then(dados => {
      let html = '';
      for (let chave in dados) {
        if (chave.includes(termo)) {
          html += `<h2>${dados[chave].titulo}</h2>
                   <p>${dados[chave].descricao}</p>
                   <a href="${dados[chave].link}">Ver mais</a><hr>`;
        }
      }
      document.getElementById('resultados').innerHTML = html || '<p>Nenhum resultado encontrado.</p>';
    });
}
