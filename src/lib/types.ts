export interface Product {
  id: number;
  title: string;
  name?: string;
  brand?: string;
  slug?: string;
  category: string;
  price: number;
  original_price: number | null;
  discount_percent?: number;
  rating: number;
  review_count?: number;
  reviews_count?: number;
  description: string;
  details?: string | null;
  image: string;
  images?: string[];
  gallery?: string[];
  stock: number;
  badge?: string | null;
  specs?: Record<string, string>;
  featured?: boolean;
  created_at?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  image: string;
}

export interface CartLine {
  product: Product;
  qty: number;
  cartId?: number;
}

export interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  payment: string;
}

export interface OrderItemSnapshot {
  product_id: number;
  name?: string;
  title?: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  order_number?: string;
  user_id: string | number;
  email?: string;
  status?: string;
  order_status?: string;
  subtotal: number;
  shipping?: number;
  shipping_fee?: number;
  discount: number;
  total?: number;
  total_amount?: number;
  shipping_info?: ShippingInfo;
  shipping_address?: ShippingInfo | string;
  items: OrderItemSnapshot[];
  created_at: string;
}
