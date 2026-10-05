import { Product, CustomerOrder, OrderStatus, PaymentStatus } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from '../data/initialData';

const BASE_URL = '/api';

export interface DbStatus {
  connected: boolean;
  dbName?: string;
  host?: string;
  error?: string;
}

export const api = {
  // Check health & MongoDB status
  async checkHealth(): Promise<DbStatus> {
    try {
      const res = await fetch(`${BASE_URL}/health`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return {
        connected: data.database === 'connected',
        dbName: data.dbName,
        host: data.host,
      };
    } catch (err: any) {
      return {
        connected: false,
        error: err.message,
      };
    }
  },

  // Fetch all products
  async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${BASE_URL}/products`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      }
      return [];
    } catch (err) {
      console.warn('API fetch error for products:', err);
      return [];
    }
  },

  // Create new product in MongoDB
  async createProduct(product: Product): Promise<Product> {
    try {
      const res = await fetch(`${BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Error saving product to MongoDB:', err);
      return product;
    }
  },

  // Update product in MongoDB
  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    try {
      const res = await fetch(`${BASE_URL}/products/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Error updating product in MongoDB:', err);
      return null;
    }
  },

  // Delete product from MongoDB
  async deleteProduct(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${BASE_URL}/products/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch (err) {
      console.warn('Error deleting product from MongoDB:', err);
      return false;
    }
  },

  // Fetch all customer orders
  async getOrders(): Promise<CustomerOrder[]> {
    try {
      const res = await fetch(`${BASE_URL}/orders`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      }
      return [];
    } catch (err) {
      console.warn('API fetch error for orders:', err);
      return [];
    }
  },

  // Create order in MongoDB
  async createOrder(order: CustomerOrder): Promise<CustomerOrder> {
    try {
      const res = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Error saving order to MongoDB, saving locally:', err);
      return order;
    }
  },

  // Update order status in MongoDB
  async updateOrderStatus(id: string, status: OrderStatus, paymentStatus?: PaymentStatus): Promise<CustomerOrder | null> {
    try {
      const res = await fetch(`${BASE_URL}/orders/${encodeURIComponent(id)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, paymentStatus }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Error updating order status in MongoDB:', err);
      return null;
    }
  },

  // Seed / Reset Database
  async seedDatabase(): Promise<boolean> {
    try {
      const res = await fetch(`${BASE_URL}/seed`, { method: 'POST' });
      return res.ok;
    } catch (err) {
      console.error('Error seeding database:', err);
      return false;
    }
  }
};
