import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { CANCELLABLE, type OrderStatus } from "@/lib/constants";
import { getSql } from "@/lib/db";
import { deliveryFeeFor } from "@/lib/money";
import { mapAddress, mapEvent, mapOrder, mapOrderItem, mapProduct, type ProductRow } from "@/lib/server/map";
import { ensureProfile } from "@/lib/server/profile";
import { seedIfNeeded } from "@/lib/server/seed";

const itemInput = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1).max(20),
  color: z.string().optional(),
  size: z.string().optional(),
});

const placeInput = z.object({
  items: z.array(itemInput).min(1),
  fulfillment: z.enum(["delivery", "pickup"]),
  addressId: z.string().optional(),
  paymentMethod: z.enum(["card", "bank_transfer"]),
  notes: z.string().max(500).optional(),
  customerName: z.string().min(1).max(120),
  customerPhone: z.string().min(7).max(40),
});

async function loadOrder(orderId: string, userId?: string) {
  const sql = await getSql();
  const orders = userId
    ? await sql<Parameters<typeof mapOrder>[0]>`
        select id, user_id, status, fulfillment, address_snapshot, payment_method, payment_status,
               subtotal, delivery_fee, total, notes, customer_name, customer_phone, created_at, updated_at
        from orders where id = ${orderId} and user_id = ${userId} limit 1
      `
    : await sql<Parameters<typeof mapOrder>[0]>`
        select id, user_id, status, fulfillment, address_snapshot, payment_method, payment_status,
               subtotal, delivery_fee, total, notes, customer_name, customer_phone, created_at, updated_at
        from orders where id = ${orderId} limit 1
      `;
  const row = orders[0];
  if (!row) return null;
  const items = await sql<Parameters<typeof mapOrderItem>[0]>`
    select id, order_id, product_id, name, image_url, unit_price, quantity, color, size
    from order_items where order_id = ${orderId}
  `;
  const events = await sql<Parameters<typeof mapEvent>[0]>`
    select id, order_id, status, note, created_at from order_events
    where order_id = ${orderId} order by created_at
  `;
  return mapOrder(row, items.map(mapOrderItem), events.map(mapEvent));
}

export const placeOrder = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(placeInput)
  .handler(async ({ context, data }) => {
    await seedIfNeeded();
    await ensureProfile(context.userId);
    const sql = await getSql();

    let addressSnapshot: unknown = null;
    if (data.fulfillment === "delivery") {
      if (!data.addressId) throw new Error("Choose a delivery address");
      const addr = await sql<Parameters<typeof mapAddress>[0]>`
        select id, user_id, label, full_name, phone, street, area, city, state, is_default
        from addresses where id = ${data.addressId} and user_id = ${context.userId} limit 1
      `;
      if (!addr[0]) throw new Error("Address not found");
      addressSnapshot = mapAddress(addr[0]);
    }

    let subtotal = 0;
    const lines: {
      productId: string;
      name: string;
      image: string;
      price: number;
      quantity: number;
      color?: string;
      size?: string;
    }[] = [];

    for (const item of data.items) {
      const rows = await sql<ProductRow>`
        select id, category_id, name, description, price, compare_at, images, specs, colors, sizes,
               dimensions, material, stock, warranty, delivery_info, featured, bestseller,
               new_arrival, special_offer, created_at
        from products where id = ${item.productId} limit 1
      `;
      const product = rows[0] ? mapProduct(rows[0]) : null;
      if (!product) throw new Error("A product in your cart is no longer available");
      if (product.stock < item.quantity) throw new Error(`${product.name} does not have enough stock`);
      subtotal += product.price * item.quantity;
      lines.push({
        productId: product.id,
        name: product.name,
        image: product.images[0] ?? "",
        price: product.price,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
      });
    }

    const deliveryFee = deliveryFeeFor(subtotal, data.fulfillment);
    const total = subtotal + deliveryFee;
    const paymentStatus = data.paymentMethod === "card" ? "paid" : "pending";
    const status: OrderStatus = data.paymentMethod === "card" ? "confirmed" : "pending";
    const id = `FC-${Date.now().toString(36).toUpperCase()}`;

    await sql.query(
      `insert into orders (
        id, user_id, status, fulfillment, address_snapshot, payment_method, payment_status,
        subtotal, delivery_fee, total, notes, customer_name, customer_phone
      ) values ($1,$2,$3,$4,$5::jsonb,$6,$7,$8,$9,$10,$11,$12,$13)`,
      [
        id,
        context.userId,
        status,
        data.fulfillment,
        JSON.stringify(addressSnapshot),
        data.paymentMethod,
        paymentStatus,
        subtotal,
        deliveryFee,
        total,
        data.notes ?? "",
        data.customerName,
        data.customerPhone,
      ],
    );

    for (const line of lines) {
      await sql.query(
        `insert into order_items (order_id, product_id, name, image_url, unit_price, quantity, color, size)
         values ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [id, line.productId, line.name, line.image, line.price, line.quantity, line.color ?? null, line.size ?? null],
      );
      await sql.query(`update products set stock = stock - $1 where id = $2 and stock >= $1`, [
        line.quantity,
        line.productId,
      ]);
    }

    const note =
      data.paymentMethod === "card"
        ? "Payment received by card. Order confirmed."
        : "Order placed. Awaiting bank transfer.";
    await sql.query(`insert into order_events (order_id, status, note) values ($1,$2,$3)`, [id, status, note]);
    await sql.query(`insert into notifications (user_id, title, body, href) values ($1,$2,$3,$4)`, [
      context.userId,
      `Order ${id}`,
      note,
      `/account/orders/${id}`,
    ]);

    const order = await loadOrder(id, context.userId);
    if (!order) throw new Error("Order could not be loaded");
    return order;
  });

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<Parameters<typeof mapOrder>[0]>`
      select id, user_id, status, fulfillment, address_snapshot, payment_method, payment_status,
             subtotal, delivery_fee, total, notes, customer_name, customer_phone, created_at, updated_at
      from orders where user_id = ${context.userId} order by created_at desc
    `;
    const result = [];
    for (const row of rows) {
      const items = await sql<Parameters<typeof mapOrderItem>[0]>`
        select id, order_id, product_id, name, image_url, unit_price, quantity, color, size
        from order_items where order_id = ${row.id}
      `;
      const events = await sql<Parameters<typeof mapEvent>[0]>`
        select id, order_id, status, note, created_at from order_events
        where order_id = ${row.id} order by created_at
      `;
      result.push(mapOrder(row, items.map(mapOrderItem), events.map(mapEvent)));
    }
    return result;
  });

export const getMyOrder = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ context, data }) => {
    return loadOrder(data.id, context.userId);
  });

export const cancelMyOrder = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<{ id: string; status: string }>`
      select id, status from orders where id = ${data.id} and user_id = ${context.userId} limit 1
    `;
    const order = rows[0];
    if (!order) throw new Error("Order not found");
    if (!CANCELLABLE.has(order.status as OrderStatus)) {
      throw new Error("This order can no longer be cancelled");
    }
    await sql`update orders set status = 'cancelled', updated_at = now() where id = ${data.id} and user_id = ${context.userId}`;
    const items = await sql<{ product_id: string; quantity: number }>`
      select product_id, quantity from order_items where order_id = ${data.id}
    `;
    for (const item of items) {
      await sql.query(`update products set stock = stock + $1 where id = $2`, [item.quantity, item.product_id]);
    }
    await sql.query(`insert into order_events (order_id, status, note) values ($1,'cancelled',$2)`, [
      data.id,
      "Cancelled by customer.",
    ]);
    await sql.query(`insert into notifications (user_id, title, body, href) values ($1,$2,$3,$4)`, [
      context.userId,
      `Order ${data.id} cancelled`,
      "Your order was cancelled and stock was returned.",
      `/account/orders/${data.id}`,
    ]);
    return loadOrder(data.id, context.userId);
  });
