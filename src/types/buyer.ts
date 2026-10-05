import { Product, ElectronicCategory } from './index';

export interface BannerItem {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  actionUrl?: string;
  order: number;
  active: boolean;
}

export interface CartItem {
  _id?: string;
  userId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
}

export interface Enquiry {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerPhone?: string;
  buyerEmail?: string;
  productId: string;
  productName: string;
  productImage?: string;
  message: string;
  offerPrice?: number;
  status: 'new' | 'in_progress' | 'responded' | 'closed';
  responseNotes?: string;
  createdAt: string;
}

export type BuyerTabIndex = 0 | 1 | 2 | 3 | 4; // 0: Home, 1: Saved, 2: Cart, 3: Orders, 4: Profile
