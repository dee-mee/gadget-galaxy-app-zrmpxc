
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  CART: 'cart',
  USER_PREFERENCES: 'user_preferences',
};

export const dataService = {
  // Cart (local storage only)
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

  // User preferences (local storage only)
  async getUserPreferences(): Promise<any> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.log('Error getting user preferences:', error);
      return {};
    }
  },

  async saveUserPreferences(preferences: any): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.log('Error saving user preferences:', error);
    }
  },
};
