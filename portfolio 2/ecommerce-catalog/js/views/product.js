// js/views/product.js
import { getProductById } from '../data.js';
import { formatPrice } from '../format.js';
import { addToCart } from '../store.js';

export function renderProduct(container, params) {
  const product = getProductById(params.id);

  if (!product) {
    container.innerHTML = `
      <section class="not-found">
        <h1>Product not found</h1>
        <p><a href="#/">Back to the catalog</a></p>
      </section>
    `;
    return;
  }

  container.innerHTML = `
    <a class="back-link" href="#/">&larr; Back to catalog</a>
    <section class="product-detail">
      <div class="product-detail-media">
        <img src="${product.image}" alt="${product.name}" width="600" height="450" decoding="async">
      </div>
      <div class="product-detail-body">
        <p class="eyebrow">${product.category}</p>
        <h1>${product.name}</h1>
        <p class="product-detail-price">${formatPrice(product.price)}</p>
        <p class="product-detail-rating">★ ${product.rating.toFixed(1)} / 5</p>
        <p class="product-detail-desc">${product.description}</p>

        <div class="qty-row">
          <label for="qty">Quantity</label>
          <input type="number" id="qty" min="1" value="1" inputmode="numeric">
        </div>

        <button type="button" class="btn btn-solid" id="add-btn">Add to cart</button>
        <p id="add-status" class="add-status" role="status" aria-live="polite"></p>
      </div>
    </section>
  `;

  const qtyInput = container.querySelector('#qty');
  const addBtn = container.querySelector('#add-btn');
  const status = container.querySelector('#add-status');

  addBtn.addEventListener('click', () => {
    const qty = Math.max(1, parseInt(qtyInput.value, 10) || 1);
    addToCart(product.id, qty);
    status.textContent = `Added ${qty} to cart.`;
  });
}
