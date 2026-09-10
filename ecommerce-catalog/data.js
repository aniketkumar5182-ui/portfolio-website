// js/data.js
// The product catalog — a static "database" for this demo. In a real
// full-stack build this would come from an API; here it's the seam
// where that swap would happen, kept isolated from rendering logic.

export const PRODUCTS = [
  {
    id: 'p01',
    name: 'Aalto Desk Lamp',
    category: 'Lighting',
    price: 2499,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600&auto=format&fit=crop',
    description:
      'A warm, dimmable LED desk lamp with a weighted cast-iron base and a jointed arm that holds any angle. Built for long work sessions.',
  },
  {
    id: 'p02',
    name: 'Fold Travel Backpack',
    category: 'Bags',
    price: 4199,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop',
    description:
      'A 28L backpack with a padded 15" laptop sleeve, a hidden passport pocket, and water-resistant recycled canvas.',
  },
  {
    id: 'p03',
    name: 'Kiln Ceramic Mug Set',
    category: 'Home',
    price: 1299,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=600&auto=format&fit=crop',
    description:
      'A set of two hand-glazed stoneware mugs, each one slightly different — fired in small batches at a single kiln.',
  },
  {
    id: 'p04',
    name: 'Ridge Trail Runners',
    category: 'Footwear',
    price: 5999,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
    description:
      'Lightweight trail shoes with a grippy lugged outsole and a breathable knit upper, built for mixed terrain.',
  },
  {
    id: 'p05',
    name: 'Wovenwood Chess Set',
    category: 'Home',
    price: 3299,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1528819622765-d6bcf132ac11?q=80&w=600&auto=format&fit=crop',
    description:
      'A travel-sized chess set with magnetic pieces and a walnut-veneer board that folds flat and latches shut.',
  },
  {
    id: 'p06',
    name: 'Halcyon Wireless Earbuds',
    category: 'Audio',
    price: 3799,
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop',
    description:
      'Compact true-wireless earbuds with active noise cancelling and a 28-hour case battery.',
  },
  {
    id: 'p07',
    name: 'Bramble Wool Throw',
    category: 'Home',
    price: 2899,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1616627561950-9f746e330187?q=80&w=600&auto=format&fit=crop',
    description:
      'A lambswool throw blanket, woven in a small mill and finished with a whipstitched edge.',
  },
  {
    id: 'p08',
    name: 'Solstice Sport Watch',
    category: 'Accessories',
    price: 6499,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=600&auto=format&fit=crop',
    description:
      'A GPS sport watch with a 10-day battery, built-in workout tracking, and a scratch-resistant sapphire face.',
  },
];

export function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id) || null;
}

export function getCategories() {
  return [...new Set(PRODUCTS.map((p) => p.category))].sort();
}
