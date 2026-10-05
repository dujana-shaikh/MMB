export type ElectronicCategory =
  | 'ALL'
  | 'HEADPHONES'
  | 'PHOTOGRAPHY'
  | 'CELL PHONES'
  | 'HOME AUDIO'
  | 'ACCESSORIES'
  | 'VIDEO GAMES'
  | 'WEARABLE TECH'
  | 'OFFICE SUPPLIES'
  | 'SECURITY'
  | 'TABLETS'
  | 'LAPTOPS';

export interface ProductVariantItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  stock?: number;
}

export interface CustomerContactInfo {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  lastInquiry?: string;
}

export interface Product {
  id: string;
  name: string;
  category: ElectronicCategory;
  price: number;
  originalPrice?: number;
  stock: number;
  reorderLevel: number;
  sku: string;
  rating: number;
  reviewsCount: number;
  image?: string;
  description: string;
  isFeatured?: boolean;
  brand: string;
  specifications?: Record<string, string>;
  createdAt: string;
  variants?: ProductVariantItem[];
  subVariants?: string[];
  customerContact?: CustomerContactInfo;
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Paid' | 'Pending' | 'Refunded';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  category: ElectronicCategory;
  image?: string;
}

export interface CustomerOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  shippingAddress: string;
  paymentMethod: string;
  trackingNumber?: string;
}

export type SortOption =
  | 'price_asc'
  | 'price_desc'
  | 'featured'
  | 'name_asc'
  | 'stock_desc'
  | 'rating_desc';

export interface StoreMetrics {
  totalRevenue: number;
  todayRevenue: number;
  totalOrders: number;
  todayOrders: number;
  averageOrderValue: number;
  lowStockItemsCount: number;
  activeVisitors: number;
  conversionRate: number;
}
