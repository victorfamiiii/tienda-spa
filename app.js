const app = document.getElementById('app');
const cartCountEl = document.getElementById('cart-count');

const ROUTES = ['home','map','shipping','contact','cart'];

function setRoute(route){
  history.pushState({route}, '', '#'+route);
  renderRoute(route);
}

function initNav(){
  document.querySelectorAll('.nav [data-route]').forEach(btn=>{
    btn.addEventListener('click', ()=> setRoute(btn.dataset.route));
  });
  window.addEventListener('popstate', e=>{
    const r = (e.state && e.state.route) || location.hash.replace('#','') || 'home';
    renderRoute(r);
  });
}

/* CART */
function getCart(){
  try{ return JSON.parse(localStorage.getItem('tienda_cart')||'{}'); }catch(e){return{}}}
function saveCart(cart){ localStorage.setItem('tienda_cart', JSON.stringify(cart)); updateCartCount(); }
function updateCartCount(){
  const cart = getCart();
  const qty = Object.values(cart).reduce((s,n)=>s+n,0);
  cartCountEl.textContent = qty;
}

/* RENDERERS */
async function renderRoute(route){
  if(!ROUTES.includes(route)) route='home';
  if(route==='home') return renderHome();
  if(route==='map') return renderMap();
  if(route==='shipping') return renderShipping();
  if(route==='contact') return renderContact();
  if(route==='cart') return renderCart();
}

async function fetchProducts(){
  const res = await fetch('products.json');
  const json = await res.json();
  return json.products || [];
}

async function renderHome(){
  const products = await fetchProducts();
  app.innerHTML = `
    <section class="hero page">
      <div class="lead"><strong>Bienvenido a MiTienda</strong><div class="small">Productos seleccionados generados con prompts IA (ver prompts.txt)</div></div>
      <div class="center"><button class="btn" onclick="setRoute('cart')">Ir al carrito</button></div>
    </section>
    <section style="margin-top:16px">
      <div class="grid" id="products-grid"></div>
    </section>
  `;

  const grid = document.getElementById('products-grid');
  products.forEach(p=>{
    const el = document.createElement('article'); el.className='card';
    el.innerHTML = `
      <img src="${p.image}" alt="${p.prompt || p.name}" />
      <h3>${p.name}</h3>
      <div class="muted small">${p.description}</div>
      <div class="meta" style="margin-top:8px">
        <div class="price">€ ${p.price.toFixed(2)}</div>
        <div>
          <button class="btn" data-add="${p.id}">Añadir</button>
          <button class="btn" data-view="${p.id}" style="background:#6c757d;margin-left:6px">Ver</button>
        </div>
      </div>
    `;
    grid.appendChild(el);
  });

  // handlers
  document.querySelectorAll('[data-add]').forEach(b=>b.addEventListener('click', e=>{
    const id = e.currentTarget.dataset.add; const cart = getCart(); cart[id] = (cart[id]||0)+1; saveCart(cart);
  }));
  document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click', async e=>{
    const id = e.currentTarget.dataset.view; const prod = (await fetchProducts()).find(x=>x.id===id); showModal(prod);
  }));
}

function showModal(prod){
  const modal = document.createElement('div'); modal.style.position='fixed';modal.style.inset=0;modal.style.background='rgba(0,0,0,.5)';modal.style.display='flex';modal.style.alignItems='center';modal.style.justifyContent='center';
  modal.innerHTML = `
    <div style="max-width:760px;background:#fff;padding:16px;border-radius:8px">
      <h2>${prod.name}</h2>
      <img src="${prod.image}" alt="${prod.prompt||prod.name}" style="width:100%;height:320px;object-fit:cover;border-radius:6px"/>
      <p class="small">${prod.description}</p>
      <div class="meta"><div class="price">€ ${prod.price.toFixed(2)}</div><div><button class="btn" id="modal-add">Añadir al carrito</button> <button class="btn" id="modal-close" style="background:#6c757d">Cerrar</button></div></div>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('modal-close').onclick = ()=> modal.remove();
  document.getElementById('modal-add').onclick = ()=>{ const cart=getCart(); cart[prod.id]=(cart[prod.id]||0)+1; saveCart(cart); modal.remove(); };
}

function renderMap(){
  app.innerHTML = `
    <section class="page">
      <h2>Mapa</h2>
      <p class="small">Nuestra tienda física (ejemplo). Mapa incrustado con OpenStreetMap.</p>
      <iframe src="https://www.openstreetmap.org/export/embed.html?bbox=-0.128%2C51.507%2C-0.127%2C51.508&layer=mapnik" style="width:100%;height:400px;border:0;margin-top:12px" title="Mapa"></iframe>
    </section>
  `;
}

function renderShipping(){
  app.innerHTML = `
    <section class="page">
      <h2>Métodos de pago y envío</h2>
      <ul>
        <li>Pago con tarjeta, PayPal y transferencia.</li>
        <li>Envíos en 2-5 días laborables. Opciones de recogida local.</li>
      </ul>
    </section>
  `;
}

function renderContact(){
  app.innerHTML = `
    <section class="page">
      <h2>Contacto</h2>
      <p class="small">Dirección: Calle Ficticia 123, Ciudad · Teléfono: +34 600 000 000 · Email: info@mitienda.local</p>
    </section>
  `;
}

async function renderCart(){
  const products = await fetchProducts();
  const cart = getCart();
  app.innerHTML = `
    <section class="page">
      <h2>Carrito</h2>
      <div class="cart-list" id="cart-list"></div>
      <div style="margin-top:12px" id="cart-summary"></div>
    </section>
  `;
  const list = document.getElementById('cart-list');
  let total=0;
  for(const id of Object.keys(cart)){
    const qty = cart[id];
    const prod = products.find(p=>p.id===id);
    if(!prod) continue;
    total += prod.price * qty;
    const node = document.createElement('div'); node.className='cart-item';
    node.innerHTML = `<img src="${prod.image}" alt="${prod.prompt||prod.name}" style="width:80px;height:60px;object-fit:cover;border-radius:6px"/><div style="flex:1"><div>${prod.name}</div><div class="small">€ ${prod.price.toFixed(2)} x ${qty}</div></div><div><button class="btn" data-plus="${id}">+</button> <button class="btn" data-minus="${id}" style="background:#6c757d">-</button></div>`;
    list.appendChild(node);
  }
  const summary = document.getElementById('cart-summary');
  summary.innerHTML = `<div class="meta"><div class="price">Total: € ${total.toFixed(2)}</div><div><button class="btn" id="checkout">Pagar</button></div></div>`;
  document.querySelectorAll('[data-plus]').forEach(b=>b.addEventListener('click', e=>{ const id=e.currentTarget.dataset.plus; const c=getCart(); c[id]=(c[id]||0)+1; saveCart(c); renderCart(); }));
  document.querySelectorAll('[data-minus]').forEach(b=>b.addEventListener('click', e=>{ const id=e.currentTarget.dataset.minus; const c=getCart(); c[id]=(c[id]||0)-1; if(c[id]<=0) delete c[id]; saveCart(c); renderCart(); }));
  document.getElementById('checkout').onclick = ()=> alert('Simulación de pago — integrar pasarela real para producción');
}

/* init */
initNav();
updateCartCount();
const initial = location.hash.replace('#','')||'home'; renderRoute(initial);

// make setRoute available from HTML buttons
window.setRoute = setRoute;
