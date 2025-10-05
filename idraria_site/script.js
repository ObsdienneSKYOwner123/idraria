// Data demo - remplace par ton backend quand tu veux
const productsData = [
  {id:1,name:'Pioche en Diamant',category:'Outils',price:120,img:'https://via.placeholder.com/400x300?text=Pioche',description:'Pioche solide pour miner plus vite.'},
  {id:2,name:'Arc Enchanté',category:'Armes',price:85,img:'https://via.placeholder.com/400x300?text=Arc',description:'Arc puissant, idéal pour la survie.'},
  {id:3,name:'Pack Survie Starter',category:'Packs',price:15,img:'https://via.placeholder.com/400x300?text=Pack+Survie',description:'Démarre ta partie avec les essentiels.'},
  {id:4,name:'Armure en Fer',category:'Armures',price:60,img:'https://via.placeholder.com/400x300?text=Armure',description:'Protection basique mais fiable.'},
  {id:5,name:'Bloc de Construction (x64)',category:'Blocs',price:10,img:'https://via.placeholder.com/400x300?text=Blocs',description:'Parfait pour construire des structures.'},
  {id:6,name:'TNT (x16)',category:'Packs',price:30,img:'https://via.placeholder.com/400x300?text=TNT',description:'Explosifs pour tes expérimentations.'},
  {id:7,name:'Boussole',category:'Outils',price:8,img:'https://via.placeholder.com/400x300?text=Boussole',description:'Retrouve ton chemin.'},
  {id:8,name:'Potion de Vie',category:'Consommables',price:25,img:'https://via.placeholder.com/400x300?text=Potion',description:'Restaure tes points de vie.'}
];

// --- Catalog rendering & search ---
const productsEl = document.getElementById && document.getElementById('products');
const countEl = document.getElementById && document.getElementById('count');
const searchInput = document.getElementById && document.getElementById('searchInput');
const searchBtn = document.getElementById && document.getElementById('searchBtn');
const catSelect = document.getElementById && document.getElementById('categoryFilter');
const catList = document.getElementById && document.getElementById('catList');
const suggestList = document.getElementById && document.getElementById('suggestList');
const cartCountEl = document.getElementById && document.getElementById('cartCount');
document.getElementById && (document.getElementById('year').textContent = new Date().getFullYear());

function initCategories(){
  const categories = Array.from(new Set(productsData.map(p=>p.category)));
  categories.forEach(cat=>{
    if(catSelect){
      const opt = document.createElement('option'); opt.value = cat; opt.textContent = cat; catSelect.appendChild(opt);
    }
    if(catList){
      const li = document.createElement('li'); li.textContent = cat; li.onclick = ()=>{ catSelect.value = cat; applyFilters(); }; catList.appendChild(li);
    }
  });
}

function renderProducts(list){
  if(!productsEl) return;
  productsEl.innerHTML = '';
  list.forEach(p=>{
    const card = document.createElement('article'); card.className='card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}"/>
      <div class="title">${p.name}</div>
      <div class="meta"><span>${p.category}</span><span>⭐ 4.7</span></div>
      <div class="price">${p.price} ⛏️</div>
      <div style="display:flex;gap:8px;margin-top:6px">
        <button class="btn" onclick="location.href='produit.html?id=${p.id}'">Voir</button>
        <button class="btn" onclick="addToCart(${p.id})" style="background:#0b8a50">Ajouter</button>
      </div>
    `;
    productsEl.appendChild(card);
  });
  if(countEl) countEl.textContent = list.length;
}

function applyFilters(){
  if(!searchInput || !catSelect) return;
  const q = searchInput.value.trim().toLowerCase();
  const cat = catSelect.value;
  const filtered = productsData.filter(p=>{
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    const matchCat = (cat==='all') || (p.category===cat);
    return matchQ && matchCat;
  });
  renderProducts(filtered);
}

function updateSuggestions(){
  if(!searchInput || !suggestList) return;
  const q = searchInput.value.trim().toLowerCase();
  if(!q){suggestList.style.display='none'; return}
  const suggestions = productsData.filter(p=>p.name.toLowerCase().includes(q)).slice(0,6);
  if(suggestions.length===0){suggestList.style.display='none';return}
  suggestList.style.display='block';
  suggestList.innerHTML = suggestions.map(s=>`<div data-name="${s.name}">${s.name} — ${s.category}</div>`).join('');
  Array.from(suggestList.children).forEach(div=>div.addEventListener('click',e=>{ searchInput.value = div.dataset.name; suggestList.style.display='none'; applyFilters(); }));
}

// --- Cart (localStorage) ---
function getCart(){ return JSON.parse(localStorage.getItem('idraria_cart')||'[]'); }
function saveCart(cart){ localStorage.setItem('idraria_cart', JSON.stringify(cart)); updateCartCount(); }
function addToCart(id){
  const p = productsData.find(x=>x.id===id);
  if(!p) return alert('Produit introuvable');
  const cart = getCart();
  const existing = cart.find(x=>x.id===id);
  if(existing) existing.qty += 1; else cart.push({id:id, qty:1, name:p.name, price:p.price});
  saveCart(cart);
  alert(p.name+' ajouté au panier');
}
function updateCartCount(){
  const c = getCart().reduce((s,i)=>s+i.qty,0);
  const els = document.querySelectorAll('#cartCount, #cartCountHeader');
  els.forEach(e=>e.textContent = c);
  const cartCount = document.getElementById && document.getElementById('cartCount');
  if(cartCount) cartCount.textContent = c;
}
function renderCart(){
  const area = document.getElementById('cartArea');
  if(!area) return;
  const cart = getCart();
  if(cart.length===0){ area.innerHTML = '<p>Ton panier est vide.</p>'; return; }
  let html = '<table style="width:100%;border-collapse:collapse"><tr><th>Produit</th><th>Qté</th><th>Prix</th><th></th></tr>';
  cart.forEach(item=>{
    html += `<tr><td>${item.name}</td><td>${item.qty}</td><td>${item.price} ⛏️</td><td><button onclick="removeFromCart(${item.id})">Supprimer</button></td></tr>`;
  });
  const total = cart.reduce((s,i)=>s + i.qty * i.price,0);
  html += `</table><div style="margin-top:12px;font-weight:800">Total: ${total} ⛏️</div><div style="margin-top:8px"><button onclick="checkout()">Valider la commande</button></div>`;
  area.innerHTML = html;
}

function removeFromCart(id){
  let cart = getCart();
  cart = cart.filter(i=>i.id!==id);
  saveCart(cart);
  renderCart();
}

// --- Simple auth (localStorage) ---
function signup(){
  const user = document.getElementById('newUser').value.trim();
  const pass = document.getElementById('newPass').value.trim();
  if(!user || !pass) return alert('Remplis tous les champs');
  const users = JSON.parse(localStorage.getItem('idraria_users')||'{}');
  if(users[user]) return alert('Ce pseudo existe déjà');
  users[user] = pass;
  localStorage.setItem('idraria_users', JSON.stringify(users));
  alert('Compte créé ✅ Tu peux te connecter');
  document.querySelector('.form-box').style.display='block';
  document.getElementById('signupBox') && (document.getElementById('signupBox').style.display='none');
}

function login(){
  const user = document.getElementById('username').value.trim();
  const pass = document.getElementById('password').value.trim();
  const users = JSON.parse(localStorage.getItem('idraria_users')||'{}');
  if(users[user] === pass){
    localStorage.setItem('idraria_loggedUser', user);
    alert('Connexion réussie 👌');
    location.href = 'index.html';
  } else alert('Identifiants incorrects');
}

function logout(){ localStorage.removeItem('idraria_loggedUser'); location.href='index.html'; }

// --- Init events ---
document.addEventListener('DOMContentLoaded', ()=>{
  initCategories();
  renderProducts(productsData);
  updateCartCount();
  if(searchInput){ searchInput.addEventListener('input', updateSuggestions); searchInput.addEventListener('keydown', e=>{ if(e.key==='Enter'){ applyFilters(); suggestList.style.display='none'; } }); }
  if(searchBtn) searchBtn.addEventListener('click', ()=>{ applyFilters(); suggestList.style.display='none'; });
  document.addEventListener('click', (e)=>{ if(!e.target.closest('.suggestions')) suggestList && (suggestList.style.display='none'); });

  // Update login link
  const logged = localStorage.getItem('idraria_loggedUser');
  const loginLink = document.getElementById && document.getElementById('loginLink');
  if(loginLink){ if(logged){ loginLink.textContent = 'Bonjour, '+logged; loginLink.href='#'; loginLink.addEventListener('click', (e)=>{ e.preventDefault(); if(confirm('Se déconnecter ?')){ logout(); } }); } }
});