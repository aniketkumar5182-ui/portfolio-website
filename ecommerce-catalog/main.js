// js/main.js
// Entry point. This is the only file that knows about every module —
// each view, the router, and the store are otherwise independent of
// each other, which is what keeps the app modular.

import { route, startRouter } from './router.js';
import { renderHome } from './views/home.js';
import { renderProduct } from './views/product.js';
import { renderCart } from './views/cart.js';
import { renderCheckout } from './views/checkout.js';
import { subscribe, getItemCount } from './store.js';

const app = document.getElementById('app');
const cartBadge = document.getElementById('cart-badge');
const navLinks = document.querySelectorAll('[data-nav-link]');

function setActiveNav(path) {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${path}`;
    link.classList.toggle('is-active', isActive);
  });
}

function updateCartBadge() {
  const count = getItemCount();
  cartBadge.textContent = count > 0 ? String(count) : '';
  cartBadge.hidden = count === 0;
}

route('/', () => {
  renderHome(app);
  setActiveNav('/');
  document.title = 'Foundry Goods — Catalog';
  window.scrollTo(0, 0);
});

route('/product/:id', (params) => {
  renderProduct(app, params);
  setActiveNav('/');
  document.title = 'Foundry Goods — Product';
  window.scrollTo(0, 0);
});

route('/cart', () => {
  renderCart(app);
  setActiveNav('/cart');
  document.title = 'Foundry Goods — Cart';
  window.scrollTo(0, 0);
});

route('/checkout', () => {
  renderCheckout(app);
  setActiveNav('/cart');
  document.title = 'Foundry Goods — Checkout';
  window.scrollTo(0, 0);
});

subscribe(updateCartBadge);
updateCartBadge();
startRouter();
