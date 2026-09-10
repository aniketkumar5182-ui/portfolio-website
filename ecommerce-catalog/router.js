// js/router.js
// A small hash-based router. Hash routing (#/product/p01) needs no
// server-side rewrite rules, so it works unmodified on any static
// host — GitHub Pages, Netlify, Vercel, or a plain file server.

const routes = [];

/**
 * Register a route.
 * @param {string} pattern  e.g. '/', '/product/:id', '/cart'
 * @param {(params: Record<string,string>) => void} handler
 */
export function route(pattern, handler) {
  const paramNames = [];
  const regex = new RegExp(
    '^' +
      pattern.replace(/:[^/]+/g, (match) => {
        paramNames.push(match.slice(1));
        return '([^/]+)';
      }) +
      '$'
  );
  routes.push({ regex, paramNames, handler });
}

function currentPath() {
  const hash = window.location.hash.replace(/^#/, '');
  return hash || '/';
}

function resolve() {
  const path = currentPath();
  for (const { regex, paramNames, handler } of routes) {
    const match = path.match(regex);
    if (match) {
      const params = {};
      paramNames.forEach((name, i) => {
        params[name] = decodeURIComponent(match[i + 1]);
      });
      handler(params);
      return;
    }
  }
  // No match — fall back to the first registered route (home).
  if (routes.length) routes[0].handler({});
}

export function startRouter() {
  window.addEventListener('hashchange', resolve);
  resolve();
}

export function navigate(path) {
  window.location.hash = path;
}
