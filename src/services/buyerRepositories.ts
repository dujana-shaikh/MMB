import { Product } from '../types';
import { BannerItem, CartItem, Enquiry } from '../types/buyer';

const BASE_URL = '/api';

// --- JWT TOKEN MANAGEMENT ---
let currentAuthToken: string | null = null;

export function setAuthToken(token: string | null) {
  currentAuthToken = token;
  if (token) {
    try {
      localStorage.setItem('mmb_jwt_token', token);
    } catch {}
  } else {
    try {
      localStorage.removeItem('mmb_jwt_token');
    } catch {}
  }
}

export function getAuthToken(): string | null {
  if (!currentAuthToken) {
    try {
      currentAuthToken = localStorage.getItem('mmb_jwt_token');
    } catch {}
  }
  return currentAuthToken;
}

export function authHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = { ...extra };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// Helper for SSE subscriptions with fallback polling
function createStreamSubscription<T>(
  url: string,
  fetchUrl: string,
  onData: (data: T) => void,
  intervalMs: number = 8000
): () => void {
  let isClosed = false;
  let eventSource: EventSource | null = null;
  let pollTimer: any = null;

  try {
    eventSource = new EventSource(url);
    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        onData(parsed);
      } catch (err) {
        console.error('SSE parse error:', err);
      }
    };
    eventSource.onerror = () => {
      if (!isClosed && !pollTimer) {
        pollTimer = setInterval(async () => {
          try {
            const res = await fetch(fetchUrl, { headers: authHeaders() });
            if (res.ok) {
              const data = await res.json();
              onData(data);
            }
          } catch {}
        }, intervalMs);
      }
    };
  } catch (e) {
    pollTimer = setInterval(async () => {
      try {
        const res = await fetch(fetchUrl, { headers: authHeaders() });
        if (res.ok) {
          const data = await res.json();
          onData(data);
        }
      } catch {}
    }, intervalMs);
  }

  // Initial fetch with Authorization header
  fetch(fetchUrl, { headers: authHeaders() })
    .then((r) => r.json())
    .then((d) => {
      if (!isClosed) onData(d);
    })
    .catch(() => {});

  return () => {
    isClosed = true;
    if (eventSource) eventSource.close();
    if (pollTimer) clearInterval(pollTimer);
  };
}

// 0. AuthRepository
export class AuthRepository {
  async login(emailOrPhone: string, password: string): Promise<{ token: string; user: any }> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrPhone, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    const data = await res.json();
    setAuthToken(data.token);
    return data;
  }

  async register(userData: any): Promise<{ token: string; user: any }> {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    const data = await res.json();
    setAuthToken(data.token);
    return data;
  }

  async getProfile(): Promise<any> {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: authHeaders()
    });
    if (!res.ok) throw new Error('Unauthorized or failed to load profile');
    return res.json();
  }

  logout() {
    setAuthToken(null);
  }
}

// 1. CatalogRepository
export class CatalogRepository {
  async getApprovedProducts(): Promise<Product[]> {
    const res = await fetch(`${BASE_URL}/catalog/products`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch approved products');
    return res.json();
  }

  watchApproved(onData: (products: Product[]) => void): () => void {
    return createStreamSubscription<Product[]>(
      `${BASE_URL}/catalog/products/stream`,
      `${BASE_URL}/catalog/products`,
      onData
    );
  }

  async getBanners(): Promise<BannerItem[]> {
    const res = await fetch(`${BASE_URL}/catalog/banners`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch banners');
    return res.json();
  }

  watchBanners(onData: (banners: BannerItem[]) => void): () => void {
    return createStreamSubscription<BannerItem[]>(
      `${BASE_URL}/catalog/banners/stream`,
      `${BASE_URL}/catalog/banners`,
      onData
    );
  }

  async getCategories(): Promise<string[]> {
    const res = await fetch(`${BASE_URL}/catalog/categories`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  }

  watchCategories(onData: (categories: string[]) => void): () => void {
    return createStreamSubscription<string[]>(
      `${BASE_URL}/catalog/categories/stream`,
      `${BASE_URL}/catalog/categories`,
      onData
    );
  }
}

// 2. CartRepository
export class CartRepository {
  async getCart(userId: string = 'default-user'): Promise<CartItem[]> {
    const res = await fetch(`${BASE_URL}/cart?userId=${encodeURIComponent(userId)}`, {
      headers: authHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch cart');
    return res.json();
  }

  watch(userId: string = 'default-user', onData: (items: CartItem[]) => void): () => void {
    return createStreamSubscription<CartItem[]>(
      `${BASE_URL}/cart/stream?userId=${encodeURIComponent(userId)}`,
      `${BASE_URL}/cart?userId=${encodeURIComponent(userId)}`,
      onData
    );
  }

  async upsert(userId: string, item: Partial<CartItem> & { productId: string; name: string; price: number }): Promise<CartItem> {
    const res = await fetch(`${BASE_URL}/cart`, {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ userId, ...item })
    });
    if (!res.ok) throw new Error('Failed to upsert cart item');
    return res.json();
  }

  async setQty(userId: string, productId: string, quantity: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/cart/qty`, {
      method: 'PUT',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ userId, productId, quantity })
    });
    if (!res.ok) throw new Error('Failed to update cart quantity');
  }

  async remove(userId: string, productId: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/cart/${encodeURIComponent(productId)}?userId=${encodeURIComponent(userId)}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    if (!res.ok) throw new Error('Failed to remove cart item');
  }

  async clear(userId: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/cart?userId=${encodeURIComponent(userId)}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    if (!res.ok) throw new Error('Failed to clear cart');
  }
}

// 3. FavoritesRepository
export class FavoritesRepository {
  async getFavoriteIds(userId: string = 'default-user'): Promise<Set<string>> {
    const res = await fetch(`${BASE_URL}/favorites?userId=${encodeURIComponent(userId)}`, {
      headers: authHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch favorites');
    const data = await res.json();
    return new Set(data.favoriteIds || []);
  }

  watchIds(userId: string = 'default-user', onData: (ids: Set<string>) => void): () => void {
    return createStreamSubscription<string[]>(
      `${BASE_URL}/favorites/stream?userId=${encodeURIComponent(userId)}`,
      `${BASE_URL}/favorites?userId=${encodeURIComponent(userId)}`,
      (data: any) => {
        const ids = Array.isArray(data) ? data : data?.favoriteIds || [];
        onData(new Set(ids));
      }
    );
  }

  async toggle(userId: string, productId: string): Promise<{ isFavorite: boolean; favoriteIds: Set<string> }> {
    const res = await fetch(`${BASE_URL}/favorites/toggle`, {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ userId, productId })
    });
    if (!res.ok) throw new Error('Failed to toggle favorite');
    const data = await res.json();
    return {
      isFavorite: data.isFavorite,
      favoriteIds: new Set(data.favoriteIds || [])
    };
  }
}

// 4. EnquiryRepository
export class EnquiryRepository {
  async getMyEnquiries(buyerId: string = 'default-user'): Promise<Enquiry[]> {
    const res = await fetch(`${BASE_URL}/enquiries?buyerId=${encodeURIComponent(buyerId)}`, {
      headers: authHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch enquiries');
    return res.json();
  }

  watchEnquiries(buyerId: string = 'default-user', onData: (enquiries: Enquiry[]) => void): () => void {
    return createStreamSubscription<Enquiry[]>(
      `${BASE_URL}/enquiries/stream?buyerId=${encodeURIComponent(buyerId)}`,
      `${BASE_URL}/enquiries?buyerId=${encodeURIComponent(buyerId)}`,
      onData
    );
  }

  async create(data: Partial<Enquiry> & { productId: string; productName: string; message: string }): Promise<Enquiry> {
    const res = await fetch(`${BASE_URL}/enquiries`, {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to submit enquiry');
    return res.json();
  }

  async update(id: string, updates: Partial<Enquiry>): Promise<Enquiry> {
    const res = await fetch(`${BASE_URL}/enquiries/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update enquiry');
    return res.json();
  }
}

// Singleton instances
export const authRepositoryProvider = new AuthRepository();
export const catalogRepositoryProvider = new CatalogRepository();
export const cartRepositoryProvider = new CartRepository();
export const favoritesRepositoryProvider = new FavoritesRepository();
export const enquiryRepositoryProvider = new EnquiryRepository();
