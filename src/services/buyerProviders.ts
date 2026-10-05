import { useState, useEffect, useMemo } from 'react';
import { Product } from '../types';
import { BannerItem, CartItem, Enquiry, BuyerTabIndex } from '../types/buyer';
import {
  CatalogRepository,
  CartRepository,
  FavoritesRepository,
  EnquiryRepository,
  catalogRepositoryProvider,
  cartRepositoryProvider,
  favoritesRepositoryProvider,
  enquiryRepositoryProvider
} from './buyerRepositories';

// Export Repository Providers
export {
  catalogRepositoryProvider,
  cartRepositoryProvider,
  favoritesRepositoryProvider,
  enquiryRepositoryProvider
};

// ==========================================
// DATA STREAM HOOKS (StreamProvider equivalents)
// ==========================================

/**
 * approvedProductsProvider: StreamProvider<List<Product>>
 * Subscribes to live approved products stream from MongoDB
 */
export function useApprovedProducts(): { products: Product[]; loading: boolean; error: string | null } {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = catalogRepositoryProvider.watchApproved((data) => {
      setProducts(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { products, loading, error };
}

/**
 * bannersProvider: StreamProvider<List<BannerItem>>
 * Subscribes to live active promotional banners stream from MongoDB
 */
export function useBanners(): { banners: BannerItem[]; loading: boolean } {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = catalogRepositoryProvider.watchBanners((data) => {
      setBanners(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { banners, loading };
}

/**
 * categoriesProvider: StreamProvider<List<String>>
 * Subscribes to live categories list from MongoDB
 */
export function useCategories(): { categories: string[]; loading: boolean } {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = catalogRepositoryProvider.watchCategories((data) => {
      setCategories(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { categories, loading };
}

/**
 * cartProvider: StreamProvider<List<CartItem>>
 * Subscribes to live shopping cart stream for active user
 */
export function useCart(userId: string = 'default-user'): {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  totalAmount: number;
  totalCount: number;
} {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const unsubscribe = cartRepositoryProvider.watch(userId, (items) => {
      setCart(items);
    });
    return () => unsubscribe();
  }, [userId]);

  const addToCart = async (product: Product, quantity: number = 1) => {
    await cartRepositoryProvider.upsert(userId, {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
      category: product.category
    });
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    await cartRepositoryProvider.setQty(userId, productId, quantity);
  };

  const removeFromCart = async (productId: string) => {
    await cartRepositoryProvider.remove(userId, productId);
  };

  const clearCart = async () => {
    await cartRepositoryProvider.clear(userId);
  };

  const totalAmount = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  );

  const totalCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalAmount,
    totalCount
  };
}

/**
 * favoriteIdsProvider: StreamProvider<Set<String>>
 * Subscribes to live favorite/saved product IDs set
 */
export function useFavoriteIds(userId: string = 'default-user'): {
  favoriteIds: Set<string>;
  toggleFavorite: (productId: string) => Promise<boolean>;
  isFavorite: (productId: string) => boolean;
} {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const unsubscribe = favoritesRepositoryProvider.watchIds(userId, (ids) => {
      setFavoriteIds(ids);
    });
    return () => unsubscribe();
  }, [userId]);

  const toggleFavorite = async (productId: string) => {
    const res = await favoritesRepositoryProvider.toggle(userId, productId);
    setFavoriteIds(res.favoriteIds);
    return res.isFavorite;
  };

  const isFavorite = (productId: string) => favoriteIds.has(productId);

  return { favoriteIds, toggleFavorite, isFavorite };
}

/**
 * myEnquiriesProvider: StreamProvider<List<Enquiry>>
 * Subscribes to live buyer enquiry/counter-offer stream
 */
export function useMyEnquiries(buyerId: string = 'default-user'): {
  enquiries: Enquiry[];
  submitEnquiry: (
    productId: string,
    productName: string,
    message: string,
    buyerName?: string,
    buyerPhone?: string,
    offerPrice?: number
  ) => Promise<Enquiry>;
} {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  useEffect(() => {
    const unsubscribe = enquiryRepositoryProvider.watchEnquiries(buyerId, (data) => {
      setEnquiries(data);
    });
    return () => unsubscribe();
  }, [buyerId]);

  const submitEnquiry = async (
    productId: string,
    productName: string,
    message: string,
    buyerName: string = 'Customer',
    buyerPhone: string = '',
    offerPrice?: number
  ) => {
    return await enquiryRepositoryProvider.create({
      buyerId,
      buyerName,
      buyerPhone,
      productId,
      productName,
      message,
      offerPrice
    });
  };

  return { enquiries, submitEnquiry };
}

// ==========================================
// UI NAVIGATION STATE (StateProvider<int>)
// 0: Home, 1: Saved, 2: Cart, 3: Orders, 4: Profile
// ==========================================

export const TAB_INDEX_NAMES: Record<BuyerTabIndex, string> = {
  0: 'Home',
  1: 'Saved',
  2: 'Cart',
  3: 'Orders',
  4: 'Profile'
};

/**
 * tabIndexProvider: StateProvider<int>
 */
export function useTabIndex(initialTab: BuyerTabIndex = 0): [
  BuyerTabIndex,
  (index: BuyerTabIndex) => void
] {
  const [tabIndex, setTabIndex] = useState<BuyerTabIndex>(initialTab);
  return [tabIndex, setTabIndex];
}

// Export provider dictionary mapping
export const buyerProviders = {
  repositories: {
    catalogRepositoryProvider,
    cartRepositoryProvider,
    favoritesRepositoryProvider,
    enquiryRepositoryProvider
  },
  streams: {
    useApprovedProducts,
    useBanners,
    useCategories,
    useCart,
    useFavoriteIds,
    useMyEnquiries
  },
  navigation: {
    useTabIndex,
    TAB_INDEX_NAMES
  }
};
