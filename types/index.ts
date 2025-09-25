
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin';
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

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  discount?: number;
  images: string[];
  category_id?: string;
  category?: Category;
  brand?: string;
  stock: number;
  rating?: number;
  review_count?: number;
  features?: string[];
  specifications?: Record<string, any>;
  is_featured: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  order_date: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address?: any;
  payment_method?: any;
  tracking_number?: string;
  estimated_delivery?: string;
  created_at?: string;
  updated_at?: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  products?: Product;
  quantity: number;
  price: number;
  created_at?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'mobile_money' | 'cash_on_delivery';
  cardLast4?: string;
  cardBrand?: string;
  cardExpiry?: string;
  mobileNumber?: string;
  provider?: string;
  isDefault?: boolean;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  discount: string;
  brand: string;
  stock: string;
  categoryId: string;
  images: string[];
  features: string[];
  specifications: Record<string, string>;
  isFeatured: boolean;
  isActive: boolean;
}

export interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  recentOrders: Order[];
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  product?: Product;
  created_at: string;
}
