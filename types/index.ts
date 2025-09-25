
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  category: Category;
  brand: string;
  stock: number;
  rating: number;
  reviewCount: number;
  features: string[];
  specifications: { [key: string]: string };
  isWishlisted?: boolean;
  isFeatured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  priceModifier: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  orderDate: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'cash_on_delivery';
  cardLast4?: string;
  cardBrand?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'product' | 'category' | 'brand';
}

export interface FilterOptions {
  categories: string[];
  brands: string[];
  priceRange: {
    min: number;
    max: number;
  };
  rating: number;
  inStock: boolean;
}

export interface SortOption {
  key: string;
  label: string;
  value: 'asc' | 'desc';
}
