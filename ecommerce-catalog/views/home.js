// js/views/home.js
import { PRODUCTS, getCategories } from '../data.js';
import { formatPrice } from '../format.js';
import { addToCart } from '../store.js';
import { navigate } from '../router.js';

export function renderHome(container) {
  const categories = getCategories();

  let state = { search: '', category: 'all', sort: 'featured' };

  container.innerHTML = `
    <section class="catalog-hero">
      <p class="eyebrow">Capstone project</p>
      <h1>Foundry Goods</h1>
      <p class="lede">A small, well-made catalog — every product here is a
        stand-in for a real storefront's data layer.</p>
    </section>

    <section class="catalog-controls" aria-label="Filter and sort products">
      <div class="field">
        <label for="search">Search</label>
        <input type="search" id="search" placeholder="Search products…" autocomplete="off">
      </div>
      <div class="field">
        <label for="category">Category</label>
        <select id="category">
          <option value="all">All categories</option>
          ${categories.map((c) => `<option value="${c}">${c}</option>`).join('')}
        </select>
      </div>
      <div class="field">
        <label for="sort">Sort by</label>
        <select id="sort">
          <option value="featured">Featured</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="rating">Rating</option>
        </select>
      </div>
    </section>

    <p id="result-count" class="result-count" role="status" aria-live="polite"></p>
    <div id="catalog-grid" class="catalog-grid"></div>
  `;

  const searchInput = container.querySelector('#search');
  const categorySelect = container.querySelector('#category');
  const sortSelect = container.querySelector('#sort');
  const grid = container.querySelector('#catalog-grid');
  const resultCount = container.querySelector('#result-count');

  function getFilteredProducts() {
    let list = PRODUCTS.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(state.search.toLowerCase());
      const matchesCategory = state.category === 'all' || p.category === state.category;
      return matchesSearch && matchesCategory;
    });

    if (state.sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (state.sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (state.sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }

  function renderGrid() {
    const list = getFilteredProducts();
    resultCount.textContent = `${list.length} product${list.length === 1 ? '' : 's'}`;

    if (list.length === 0) {
      grid.innerHTML = `<p class="empty-state">No products match your search.</p>`;
      return;
    }

    grid.innerHTML = list
      .map(
        (p) => `
      <article class="product-card">
        <a href="#/product/${p.id}" class="product-card-media">
          <img src="${p.image}" alt="${p.name}" width="600" height="450" loading="lazy" decoding="async">
        </a>
        <div class="product-card-body">
          <p class="product-card-category">${p.category}</p>
          <h3><a href="#/product/${p.id}">${p.name}</a></h3>
          <p class="product-card-price">${formatPrice(p.price)}</p>
        </div>
        <button type="button" class="btn btn-outline btn-add" data-id="${p.id}">Add to cart</button>
      </article>
    `
      )
      .join('');

    grid.querySelectorAll('.btn-add').forEach((btn) => {
      btn.addEventListener('click', () => {
        addToCart(btn.dataset.id, 1);
        btn.textContent = 'Added ✓';
        setTimeout(() => {
          btn.textContent = 'Add to cart';
        }, 1200);
      });
    });
  }

  searchInput.addEventListener('input', (e) => {
    state.search = e.target.value;
    renderGrid();
  });
  categorySelect.addEventListener('change', (e) => {
    state.category = e.target.value;
    renderGrid();
  });
  sortSelect.addEventListener('change', (e) => {
    state.sort = e.target.value;
    renderGrid();
  });

  renderGrid();
}
