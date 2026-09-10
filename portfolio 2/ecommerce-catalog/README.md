# Foundry Goods — E-commerce Product Catalog (Capstone)

A client-side product catalog: browse, filter, add to cart, and run
through a demo checkout — no backend, no real payments.

**Live demo:** see the portfolio site → Work → Foundry Goods

## Architecture

The app is split into small, single-purpose ES modules so that each
piece can be read, tested, or swapped independently:

| Module | Responsibility |
|---|---|
| `js/data.js` | The product catalog. In a real build this is the seam where a fetch() call to an API would replace the static array — nothing else in the app would need to change. |
| `js/store.js` | Cart state only. A tiny pub/sub store: views call `addToCart`/`setQuantity`/`removeFromCart`, and anything that needs to react (the header badge) subscribes instead of polling. |
| `js/router.js` | A ~40-line hash router. Registers `/`, `/product/:id`, `/cart`, `/checkout` and calls the matching handler on load and on `hashchange`. |
| `js/format.js` | Currency formatting, isolated so views don't repeat `Intl.NumberFormat` setup. |
| `js/views/*.js` | One module per screen (`home`, `product`, `cart`, `checkout`). Each exports a single `render(container, params)` function and owns its own DOM + event listeners. |
| `js/main.js` | The only module that imports everything else. Wires routes to views and keeps the cart badge in sync. |

No view imports another view, and no view talks to the DOM outside
the container it's given — that's what keeps this "modular" rather
than one large script.

## Client-side routing

Routing is hash-based (`#/product/p01`) rather than path-based. That
was a deliberate trade-off: hash fragments never reach the server, so
the app needs **no server-side rewrite rules** to work — it deploys
unmodified to GitHub Pages, Netlify, Vercel, or a plain static file
server. Given the scope of this capstone, that outweighs the slightly
cleaner URLs a history-API router would give.

## Asset optimization

- **Images** are served pre-sized via URL parameters (`?w=600`) so the
  browser never downloads more pixels than it displays, and every
  `<img>` has explicit `width`/`height` to prevent layout shift.
  Below-the-fold images (catalog grid, cart line items) use
  `loading="lazy"`; the above-the-fold product detail image loads
  eagerly.
- **Zero dependencies.** The app ships no framework and no bundler —
  just native ES modules, which the browser loads directly. There's
  nothing to tree-shake because there's nothing extra in the bundle
  to begin with.
- **Minified production build.** Running the JS through `terser`
  (compress + mangle) and the CSS through `clean-css` cuts the
  shipped-code weight by roughly 29% (JS) and 18% (CSS) with no
  behavior change — see `dist/` for the output. The app currently
  serves the readable source directly, since the whole project is
  under 20KB of JS either way; swapping `index.html`'s two asset
  paths to point at `dist/` is the one-line change needed to serve
  the minified build instead.

## Local development

No build step required — open `index.html` through any static file
server (ES modules don't run over `file://`). For example:

```
npx serve .
```
