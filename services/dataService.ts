
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockProducts, mockCategories, mockOrders } from '../data/mockData';
import { Product, Category, Order } from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  ORDERS: 'orders',
  CART: 'cart',
  WISHLIST: 'wishlist',
};

export const dataService = {
  // Products
  async getProducts(): Promise<Product[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return stored ? JSON.parse(stored) : mockProducts;
    } catch (error) {
      console.log('Error getting products:', error);
      return mockProducts;
    }
  },

  async saveProducts(products: Product[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (error) {
      console.log('Error saving products:', error);
    }
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return stored ? JSON.parse(stored) : mockCategories;
    } catch (error) {
      console.log('Error getting categories:', error);
      return mockCategories;
    }
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.ORDERS);
      return stored ? JSON.parse(stored) : mockOrders;
    } catch (error) {
      console.log('Error getting orders:', error);
      return mockOrders;
    }
  },

  async saveOrders(orders: Order[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (error) {
      console.log('Error saving orders:', error);
    }
  },

  // Cart
  async getCart(): Promise<any[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.CART);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.log('Error getting cart:', error);
      return [];
    }
  },

  async saveCart(cart: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (error) {
      console.log('Error saving cart:', error);
    }
  },

  // Wishlist
  async getWishlist(): Promise<Product[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.WISHLIST);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.log('Error getting wishlist:', error);
      return [];
    }
  },

  async saveWishlist(wishlist: Product[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch (error) {
      console.log('Error saving wishlist:', error);
    }
  },
};
