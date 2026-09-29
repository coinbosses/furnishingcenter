import { asJson } from "@/lib/utils";
import type { Address, Banner, Category, Notification, Order, OrderEvent, OrderItem, Product, Profile } from "@/lib/types";

export type ProductRow = {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  compare_at: number | null;
  images: unknown;
  specs: unknown;
  colors: unknown;
  sizes: unknown;
  dimensions: string;
  material: string;
  stock: number;
  warranty: string;
  delivery_info: string;
  featured: boolean;
  bestseller: boolean;
  new_arrival: boolean;
  special_offer: boolean;
  created_at: string;
};

export function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    compareAt: row.compare_at == null ? null : Number(row.compare_at),
    images: asJson<string[]>(row.images, []),
    specs: asJson<Record<string, string>>(row.specs, {}),
    colors: asJson(row.colors, []),
    sizes: asJson<string[]>(row.sizes, []),
    dimensions: row.dimensions,
    material: row.material,
    stock: Number(row.stock),
    warranty: row.warranty,
    deliveryInfo: row.delivery_info,
    featured: Boolean(row.featured),
    bestseller: Boolean(row.bestseller),
    newArrival: Boolean(row.new_arrival),
    specialOffer: Boolean(row.special_offer),
    createdAt: String(row.created_at),
  };
}

export function mapCategory(row: {
  id: string;
  parent_id: string | null;
  name: string;
  description: string;
  image_url: string;
  sort_order: number;
}): Category {
  return {
    id: row.id,
    parentId: row.parent_id,
    name: row.name,
    description: row.description,
    imageUrl: row.image_url,
    sortOrder: Number(row.sort_order),
  };
}

export function mapBanner(row: {
  id: number;
  title: string;
  subtitle: string;
  image_url: string;
  cta_text: string;
  cta_href: string;
  sort_order: number;
  active: boolean;
}): Banner {
  return {
    id: Number(row.id),
    title: row.title,
    subtitle: row.subtitle,
    imageUrl: row.image_url,
    ctaText: row.cta_text,
    ctaHref: row.cta_href,
    sortOrder: Number(row.sort_order),
    active: Boolean(row.active),
  };
}

export function mapProfile(row: {
  user_id: string;
  full_name: string;
  phone: string;
  email: string;
  role: string;
}): Profile {
  return {
    userId: row.user_id,
    fullName: row.full_name,
    phone: row.phone,
    email: row.email,
    role: row.role === "admin" ? "admin" : "customer",
  };
}

export function mapAddress(row: {
  id: string;
  user_id: string;
  label: string;
  full_name: string;
  phone: string;
  street: string;
  area: string;
  city: string;
  state: string;
  is_default: boolean;
}): Address {
  return {
    id: row.id,
    userId: row.user_id,
    label: row.label,
    fullName: row.full_name,
    phone: row.phone,
    street: row.street,
    area: row.area,
    city: row.city,
    state: row.state,
    isDefault: Boolean(row.is_default),
  };
}

export function mapOrderItem(row: {
  id: number;
  order_id: string;
  product_id: string;
  name: string;
  image_url: string;
  unit_price: number;
  quantity: number;
  color: string | null;
  size: string | null;
}): OrderItem {
  return {
    id: Number(row.id),
    orderId: row.order_id,
    productId: row.product_id,
    name: row.name,
    imageUrl: row.image_url,
    unitPrice: Number(row.unit_price),
    quantity: Number(row.quantity),
    color: row.color,
    size: row.size,
  };
}

export function mapEvent(row: {
  id: number;
  order_id: string;
  status: string;
  note: string;
  created_at: string;
}): OrderEvent {
  return {
    id: Number(row.id),
    orderId: row.order_id,
    status: row.status,
    note: row.note,
    createdAt: String(row.created_at),
  };
}

export function mapOrder(
  row: {
    id: string;
    user_id: string;
    status: string;
    fulfillment: string;
    address_snapshot: unknown;
    payment_method: string;
    payment_status: string;
    subtotal: number;
    delivery_fee: number;
    total: number;
    notes: string;
    customer_name: string;
    customer_phone: string;
    created_at: string;
    updated_at: string;
  },
  items: OrderItem[],
  events: OrderEvent[],
): Order {
  return {
    id: row.id,
    userId: row.user_id,
    status: row.status,
    fulfillment: row.fulfillment === "pickup" ? "pickup" : "delivery",
    addressSnapshot: asJson(row.address_snapshot, null),
    paymentMethod: row.payment_method === "card" ? "card" : "bank_transfer",
    paymentStatus: row.payment_status === "paid" ? "paid" : "pending",
    subtotal: Number(row.subtotal),
    deliveryFee: Number(row.delivery_fee),
    total: Number(row.total),
    notes: row.notes,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    items,
    events,
  };
}

export function mapNotification(row: {
  id: number;
  title: string;
  body: string;
  href: string;
  read: boolean;
  created_at: string;
}): Notification {
  return {
    id: Number(row.id),
    title: row.title,
    body: row.body,
    href: row.href,
    read: Boolean(row.read),
    createdAt: String(row.created_at),
  };
}
