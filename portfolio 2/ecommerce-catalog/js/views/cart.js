// js/views/cart.js
import { getProductById } from '../data.js';
import { formatPrice } from '../format.js';
import { getCart, setQuantity, removeFromCart } from '../store.js';

export function renderCart(container) {
  const cart = getCart();
  const ids = Object.keys(cart);

  if (ids.length === 0) {
    container.innerHTML = `
      <section class="cart-empty">
        <h1>Your cart is empty</h1>
        <p><a href="#/" class="btn btn-solid">Browse the catalog</a></p>
      </section>
    `;
    return;
  }

  const items = ids.map((id) => ({ product: getProductById(id), qty: cart[id] })).filter((i) => i.product);
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);

  container.innerHTML = `
    <h1>Your cart</h1>
    <ul class="cart-list">
      ${items
        .map(
          ({ product, qty }) => `
        <li class="cart-item" data-id="${product.id}">
          <img src="${product.image}" alt="${product.name}" width="96" height="72" loading="lazy" decoding="async">
          <div class="cart-item-body">
            <h3><a href="#/product/${product.id}">${product.name}</a></h3>
            <p class="cart-item-price">${formatPrice(product.price)} each</p>
          </div>
          <div class="cart-item-qty">
            <label for="qty-${product.id}" class="visually-hidden">Quantity for ${product.name}</label>
            <input type="number" id="qty-${product.id}" min="0" value="${qty}" inputmode="numeric" class="qty-input" data-id="${product.id}">
          </div>
          <p class="cart-item-total">${formatPrice(product.price * qty)}</p>
          <button type="button" class="cart-remove" data-id="${product.id}" aria-label="Remove ${product.name} from cart">&times;</button>
        </li>
      `
        )
        .join('')}
    </ul>

    <div class="cart-summary">
      <p class="cart-subtotal">Subtotal <span>${formatPrice(subtotal)}</span></p>
      <a href="#/checkout" class="btn btn-solid">Checkout</a>
    </div>
  `;

  container.querySelectorAll('.qty-input').forEach((input) => {
    input.addEventListener('change', () => {
      const qty = Math.max(0, parseInt(input.value, 10) || 0);
      setQuantity(input.dataset.id, qty);
      renderCart(container);
    });
  });

  container.querySelectorAll('.cart-remove').forEach((btn) => {
    btn.addEventListener('click', () => {
      removeFromCart(btn.dataset.id);
      renderCart(container);
    });
  });
}
