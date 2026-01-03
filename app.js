/* app.js — controle unificado para páginas multi-page

Usa query param q (ex: resultados.html?q=termo)

Cada página carrega o JSON correspondente

Abas redirecionam para as páginas corretas mantendo a query

Paginação simples

Marca links clicados como "visited" via localStorage
*/


/* util: pega q da URL */
function getQuery() {
return new URLSearchParams(window.location.search).get('q') || '';
}

/* util: constrói url com q */
function pageUrl(page, q) {
return ${page}${q ? ?q=${encodeURIComponent(q)} : ''};
}

/* marca link como visited (adiciona classe) */
function markVisitedLink(el) {
el.classList.add('visited');
// guarda em localStorage para persistir entre páginas
try {
const key = 'lupa_visited';
const visited = JSON.parse(localStorage.getItem(key) || '[]');
const href = el.getAttribute('href');
if (!visited.includes(href)) {
visited.push(href);
localStorage.setItem(key, JSON.stringify(visited));
}
} catch(e){}
}

/* aplica visited guardado */
function applyVisitedFromStorage() {
try {
const key = 'lupa_visited';
const visited = JSON.parse(localStorage.getItem(key) || '[]');
visited.forEach(href => {
const a = document.querySelector(a[href="${href}"]);
if (a) a.classList.add('visited');
});
} catch(e){}
}

/* ---------- comportamento das abas (faz redirecionamento mantendo q) ---------- */
function wireAbas() {
const q = getQuery();
document.querySelectorAll('.aba, .abas button').forEach(btn=>{
btn.addEventListener('click', (e)=>{
const data = btn.dataset.aba;
if (data) {
// map data->page
const map = { todos: 'resultados.html', imagens: 'imagens.html', videos: 'videos.html', noticias: 'noticias.html' };
const page = map[data] || 'resultados.html';
window.location.href = pageUrl(page, q);
} else {
// buttons that are plain <button onclick..> still work via existing onclick
}
});
});
}

/* ---------- função genérica para carregar JSON, paginar e renderizar ---------- */
async function loadAndRender({ arquivo, renderItem, containerId = 'lista-resultados', perPage = 10 }) {
const q = getQuery().toLowerCase().trim();
const cont = document.getElementById(containerId);
const pagNode = document.getElementById('paginacao');

if (!cont) return;

cont.innerHTML = '<p>Carregando...</p>';
try {
const res = await fetch(arquivo);
if (!res.ok) throw new Error('fetch error');
const dados = await res.json();

// filtra por q (se houver) — considera título, descricao, categoria  
const filt = q ? dados.filter(item =>  
  (item.titulo && item.titulo.toLowerCase().includes(q)) ||  
  (item.descricao && item.descricao.toLowerCase().includes(q)) ||  
  (item.categoria && item.categoria.toLowerCase().includes(q))  
) : dados.slice();  

// paginação  
const total = Math.max(1, Math.ceil(filt.length / perPage));  
let page = parseInt(new URLSearchParams(window.location.search).get('page')) || 1;  
if (page < 1) page = 1; if (page > total) page = total;  

const start = (page - 1) * perPage;  
const slice = filt.slice(start, start + perPage);  

// render  
cont.innerHTML = '';  
if (slice.length === 0) cont.innerHTML = '<p>Nenhum resultado encontrado.</p>';  
else slice.forEach(item => cont.appendChild(renderItem(item)));  

// render paginacao  
if (pagNode) {  
  pagNode.innerHTML = '';  
  // botão anterior  
  const prev = document.createElement('button');  
  prev.textContent = '‹';  
  prev.disabled = page === 1;  
  prev.addEventListener('click', ()=> {  
    const params = new URLSearchParams(window.location.search);  
    params.set('page', Math.max(1, page-1));  
    if (q) params.set('q', q); else params.delete('q');  
    window.location.search = params.toString();  
  });  
  pagNode.appendChild(prev);  

  for (let i=1;i<=total;i++){  
    const b = document.createElement('button');  
    b.textContent = i;  
    if (i===page) b.classList.add('current');  
    b.addEventListener('click', ()=> {  
      const params = new URLSearchParams(window.location.search);  
      params.set('page', i);  
      if (q) params.set('q', q); else params.delete('q');  
      window.location.search = params.toString();  
    });  
    pagNode.appendChild(b);  
  }  

  const next = document.createElement('button');  
  next.textContent = '›';  
  next.disabled = page === total;  
  next.addEventListener('click', ()=> {  
    const params = new URLSearchParams(window.location.search);  
    params.set('page', Math.min(total, page+1));  
    if (q) params.set('q', q); else params.delete('q');  
    window.location.search = params.toString();  
  });  
  pagNode.appendChild(next);  
}  

// apply visited marks  
applyVisitedFromStorage();

} catch (err) {
cont.innerHTML = '<p>Erro ao carregar dados.</p>';
console.error(err);
}
}

/* ---------- helpers para cada tipo ---------- */
function renderResultadoTexto(item) {
const div = document.createElement('div');
div.className = 'resultado';
const a = document.createElement('a');
a.href = item.link || '#';
a.target = '_blank';
a.className = 'titulo-link';
a.innerHTML = <h3>${item.titulo || 'Sem título'}</h3>;
a.addEventListener('click', ()=> markVisitedLink(a));
const url = document.createElement('small');
url.className = 'url';
url.textContent = item.link || '';
const p = document.createElement('p');
p.className = 'snippet';
p.textContent = item.descricao || '';
div.appendChild(a);
div.appendChild(url);
div.appendChild(p);
return div;
}

function renderImagemCard(item) {
const div = document.createElement('div');
div.className = 'card';
const a = document.createElement('a');
a.href = item.link || item.src || '#';
a.target = '_blank';
a.addEventListener('click', ()=> markVisitedLink(a));
const img = document.createElement('img');
img.src = item.src || item.imagem || '';
img.alt = item.alt || item.titulo || '';
a.appendChild(img);
div.appendChild(a);
return div;
}

function renderVideoCard(item) {
const div = document.createElement('div');
div.className = 'video-card';
const a = document.createElement('a');
a.href = item.link || '#';
a.target = '_blank';
a.addEventListener('click', ()=> markVisitedLink(a));
const img = document.createElement('img');
img.className = 'thumb';
img.src = item.thumb || item.imagem || '';
img.alt = item.titulo || '';
const info = document.createElement('div');
info.style.padding = '10px';
info.innerHTML = <h3 style="font-size:16px;margin:0 0 6px">${item.titulo || ''}</h3><small style="color:#666">${item.fonte || ''}</small>;
a.appendChild(img);
div.appendChild(a);
div.appendChild(info);
return div;
}

function renderNoticia(item) {
const div = document.createElement('div');
div.className = 'noticia';
const a = document.createElement('a');
a.href = item.link || '#';
a.target = '_blank';
a.addEventListener('click', ()=> markVisitedLink(a));
a.innerHTML = <h3 style="margin:0 0 6px">${item.titulo || ''}</h3>;
const meta = document.createElement('small');
meta.textContent = ${item.fonte || ''} — ${item.data || ''};
const p = document.createElement('p');
p.textContent = item.descricao || '';
div.appendChild(a);
div.appendChild(meta);
div.appendChild(p);
const wrap = document.createElement('div');
wrap.className = 'lista-noticias';
wrap.appendChild(div);
return div;
}

/* ---------- page-specific loaders ---------- */
function initResultPage() {
// wire search form
const input = document.getElementById('campoBusca');
const btn = document.getElementById('botaoBusca');
const q = getQuery();
if (input) input.value = q;
btn?.addEventListener('click', ()=> window.location.href = resultados.html?q=${encodeURIComponent(input.value.trim())});
input?.addEventListener('keypress', (e)=> { if (e.key==='Enter') window.location.href = resultados.html?q=${encodeURIComponent(input.value.trim())}; });

// wire abas (links)
document.querySelectorAll('.aba').forEach(el=>{
el.addEventListener('click', ()=>{
const data = el.dataset.aba;
const map = { todos:'resultados.html', imagens:'imagens.html', videos:'videos.html', noticias:'noticias.html' };
const page = map[data] || 'resultados.html';
const q = getQuery();
window.location.href = pageUrl(page, q);
});
});

// load JSON
const qval = getQuery();
loadAndRender({
arquivo: './index.json',
renderItem: renderResultadoTexto,
containerId: 'lista-resultados',
perPage: 10
});
}

function initImagensPage() {
// common top search behave: go to imagens.html?q=...
const input = document.getElementById('campoBusca');
const btn = document.getElementById('botaoBusca');
const q = getQuery();
if (input) input.value = q;
btn?.addEventListener('click', ()=> window.location.href = imagens.html?q=${encodeURIComponent(input.value.trim())});
input?.addEventListener('keypress', (e)=> { if (e.key==='Enter') window.location.href = imagens.html?q=${encodeURIComponent(input.value.trim())}; });

// load imagens.json and render grid
loadAndRender({
arquivo: './imagens.json',
renderItem: renderImagemCard,
containerId: 'lista-resultados',
perPage: 10
});
// adjust container style to grid
const cont = document.getElementById('lista-resultados');
if (cont) cont.classList.add('grid-imagens');
}

function initVideosPage() {
const input = document.getElementById('campoBusca');
const btn = document.getElementById('botaoBusca');
const q = getQuery();
if (input) input.value = q;
btn?.addEventListener('click', ()=> window.location.href = videos.html?q=${encodeURIComponent(input.value.trim())});
input?.addEventListener('keypress', (e)=> { if (e.key==='Enter') window.location.href = videos.html?q=${encodeURIComponent(input.value.trim())}; });

loadAndRender({
arquivo: './videos.json',
renderItem: renderVideoCard,
containerId: 'lista-resultados',
perPage: 10
});
const cont = document.getElementById('lista-resultados');
if (cont) cont.classList.add('grid-videos');
}

function initNoticiasPage() {
const input = document.getElementById('campoBusca');
const btn = document.getElementById('botaoBusca');
const q = getQuery();
if (input) input.value = q;
btn?.addEventListener('click', ()=> window.location.href = noticias.html?q=${encodeURIComponent(input.value.trim())});
input?.addEventListener('keypress', (e)=> { if (e.key==='Enter') window.location.href = noticias.html?q=${encodeURIComponent(input.value.trim())}; });

loadAndRender({
arquivo: './noticias.json',
renderItem: renderNoticia,
containerId: 'lista-resultados',
perPage: 10
});
const cont = document.getElementById('lista-resultados');
if (cont) cont.classList.add('lista-noticias');
}

/* ---------- init logic by pathname ---------- */
document.addEventListener('DOMContentLoaded', ()=>{
applyVisitedFromStorage();
wireAbas();

const path = window.location.pathname.split('/').pop();
if (path === '' || path === 'index.html') {
// index page: minimal wiring search->resultados
const input = document.getElementById('campoBuscaInicial');
const btn = document.getElementById('botaoBuscaInicial');
btn?.addEventListener('click', ()=>{
const v = input.value.trim();
if (v) window.location.href = resultados.html?q=${encodeURIComponent(v)};
});
input?.addEventListener('keypress', (e)=> { if (e.key==='Enter') { const v=input.value.trim(); if(v) window.location.href=resultados.html?q=${encodeURIComponent(v)}; }});
// footer config link
document.getElementById('configLinkFooter')?.addEventListener('click', ()=> window.location.href='configuracoes.html');
} else if (path === 'resultados.html') {
initResultPage();
} else if (path === 'imagens.html') {
initImagensPage();
} else if (path === 'videos.html') {
initVideosPage();
} else if (path === 'noticias.html') {
initNoticiasPage();
} else if (path === 'configuracoes.html') {
// config page wiring
document.getElementById('botaoVoltar')?.addEventListener('click', ()=> window.location.href='index.html');
// load saved settings
try {
const tema = localStorage.getItem('lupa_tema') || 'claro';
document.getElementById('tema')?.value = tema;
} catch(e){}
document.getElementById('tema')?.addEventListener('change', (e)=> {
localStorage.setItem('lupa_tema', e.target.value);
alert('Tema salvo (aplicação futura).');
});
}

});
