// js/store.js
// A tiny state store for the cart. Views never mutate cart state
// directly — they call these methods, and anything that needs to
// react to changes (like the header's cart badge) subscribes.

const STORAGE_KEY = 'catalog-demo-cart';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    return {};
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch (err) {
    /* localStorage unavailable — cart still works for this session */
  }
}

let cart = loadCart(); // { [productId]: quantity }
const listeners = new Set();

function notify() {
  saveCart(cart);
  listeners.forEach((fn) => fn(cart));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getCart() {
  return { ...cart };
}

export function addToCart(productId, quantity = 1) {
  cart[productId] = (cart[productId] || 0) + quantity;
  notify();
}

export function setQuantity(productId, quantity) {
  if (quantity <= 0) {
    delete cart[productId];
  } else {
    cart[productId] = quantity;
  }
  notify();
}

export function removeFromCart(productId) {
  delete cart[productId];
  notify();
}

export function clearCart() {
  cart = {};
  notify();
}

export function getItemCount() {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}
