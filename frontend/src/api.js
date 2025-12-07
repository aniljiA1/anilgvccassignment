const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export async function fetchProducts({ search='', category='', page=1, limit=6 }) {
  const url = new URL(`${BASE}/api/products`);
  url.searchParams.set('search', search);
  url.searchParams.set('category', category);
  url.searchParams.set('page', page);
  url.searchParams.set('limit', limit);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchProduct(id) {
  const res = await fetch(`${BASE}/api/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

export async function postEnquiry(payload) {
  const res = await fetch(`${BASE}/api/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to submit enquiry');
  return data;
}

export async function fetchEnquiries(adminToken) {
  const res = await fetch(`${BASE}/api/enquiries`, {
    headers: { 'x-admin-token': adminToken || '' }
  });
  if (!res.ok) throw new Error('Auth or fetch error');
  return res.json();
}
