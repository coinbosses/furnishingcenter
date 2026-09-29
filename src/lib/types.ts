export type ColorOption = { name: string; hex: string };

export type Product = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  compareAt: number | null;
  images: string[];
  specs: Record<string, string>;
  colors: ColorOption[];
  sizes: string[];
  dimensions: string;
  material: string;
  stock: number;
  warranty: string;
  deliveryInfo: string;
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  specialOffer: boolean;
  createdAt: string;
};

export type Category = {
  id: string;
  parentId: string | null;
  name: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
};

export type Banner = {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaHref: string;
  sortOrder: number;
  active: boolean;
};

export type Address = {
  id: string;
  userId: string;
  label: string;
  fullName: string;
  phone: string;
  street: string;
  area: string;
  city: string;
  state: string;
  isDefault: boolean;
};

export type Profile = {
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  role: "customer" | "admin";
};

export type CartItem = {
  productId: string;
  quantity: number;
  color?: string;
  size?: string;
};

export type OrderItem = {
  id: number;
  orderId: string;
  productId: string;
  name: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  color: string | null;
  size: string | null;
};

export type OrderEvent = {
  id: number;
  orderId: string;
  status: string;
  note: string;
  createdAt: string;
};

export type Order = {
  id: string;
  userId: string;
  status: string;
  fulfillment: "delivery" | "pickup";
  addressSnapshot: Address | Record<string, string> | null;
  paymentMethod: "card" | "bank_transfer";
  paymentStatus: "pending" | "paid";
  subtotal: number;
  deliveryFee: number;
  total: number;
  notes: string;
  customerName: string;
  customerPhone: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  events: OrderEvent[];
};

export type Notification = {
  id: number;
  title: string;
  body: string;
  href: string;
  read: boolean;
  createdAt: string;
};
