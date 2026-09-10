// js/views/checkout.js
import { getCart, getItemCount, clearCart } from '../store.js';

export function renderCheckout(container) {
  const cart = getCart();

  if (getItemCount() === 0) {
    container.innerHTML = `
      <section class="cart-empty">
        <h1>Nothing to check out</h1>
        <p><a href="#/" class="btn btn-solid">Browse the catalog</a></p>
      </section>
    `;
    return;
  }

  container.innerHTML = `
    <section class="checkout">
      <h1>Confirm your demo order</h1>
      <p class="lede">This is a capstone demo — no payment is collected and no
        order is actually placed. Clicking below just clears the cart and
        shows a confirmation screen.</p>
      <button type="button" class="btn btn-solid" id="place-order">Place demo order</button>
    </section>
  `;

  container.querySelector('#place-order').addEventListener('click', () => {
    const itemCount = getItemCount();
    clearCart();
    container.innerHTML = `
      <section class="checkout-done">
        <h1>Thanks — demo order placed</h1>
        <p>${itemCount} item${itemCount === 1 ? '' : 's'} would have shipped.
          No real order was created and nothing was charged.</p>
        <p><a href="#/" class="btn btn-solid">Back to the catalog</a></p>
      </section>
    `;
  });
}
