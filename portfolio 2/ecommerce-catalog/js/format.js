// js/format.js
// Small formatting helpers, kept separate so views don't repeat
// Intl.NumberFormat boilerplate everywhere they show a price.

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function formatPrice(paise) {
  return currencyFormatter.format(paise);
}
