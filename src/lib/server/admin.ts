import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { ORDER_FLOW, ORDER_LABELS, type OrderStatus } from "@/lib/constants";
import { getSql } from "@/lib/db";
import { slugify } from "@/lib/utils";
import {
  mapAddress,
  mapBanner,
  mapCategory,
  mapEvent,
  mapOrder,
  mapOrderItem,
  mapProduct,
  mapProfile,
  type ProductRow,
} from "@/lib/server/map";
import { requireAdmin } from "@/lib/server/profile";
import { seedIfNeeded } from "@/lib/server/seed";

const productInput = z.object({
  id: z.string().optional(),
  categoryId: z.string(),
  name: z.string().min(2).max(160),
  description: z.string().min(8).max(4000),
  price: z.number().int().min(0),
  compareAt: z.number().int().min(0).nullable().optional(),
  images: z.array(z.string()).min(1),
  specs: z.record(z.string(), z.string()),
  colors: z.array(z.object({ name: z.string(), hex: z.string() })),
  sizes: z.array(z.string()),
  dimensions: z.string(),
  material: z.string(),
  stock: z.number().int().min(0),
  warranty: z.string(),
  deliveryInfo: z.string(),
  featured: z.boolean(),
  bestseller: z.boolean(),
  newArrival: z.boolean(),
  specialOffer: z.boolean(),
});

export const adminOverview = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await seedIfNeeded();
    await requireAdmin(context.userId);
    const sql = await getSql();
    const [orders, products, customers, low] = await Promise.all([
      sql<{
        n: number;
        revenue: number;
        pending: number;
      }>`select count(*)::int as n,
                coalesce(sum(total) filter (where payment_status = 'paid'),0)::int as revenue,
                count(*) filter (where status in ('pending','confirmed','processing','ready','out_for_delivery'))::int as pending
         from orders`,
      sql<{ n: number }>`select count(*)::int as n from products`,
      sql<{ n: number }>`select count(*)::int as n from profiles`,
      sql<{ n: number }>`select count(*)::int as n from products where stock <= 3`,
    ]);
    const recent = await sql<Parameters<typeof mapOrder>[0]>`
      select id, user_id, status, fulfillment, address_snapshot, payment_method, payment_status,
             subtotal, delivery_fee, total, notes, customer_name, customer_phone, created_at, updated_at
      from orders order by created_at desc limit 8
    `;
    return {
      orderCount: orders[0]?.n ?? 0,
      revenue: orders[0]?.revenue ?? 0,
      openOrders: orders[0]?.pending ?? 0,
      productCount: products[0]?.n ?? 0,
      customerCount: customers[0]?.n ?? 0,
      lowStock: low[0]?.n ?? 0,
      recent: recent.map((row) => mapOrder(row, [], [])),
    };
  });

export const adminListProducts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await seedIfNeeded();
    await requireAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql<ProductRow>`
      select id, category_id, name, description, price, compare_at, images, specs, colors, sizes,
             dimensions, material, stock, warranty, delivery_info, featured, bestseller,
             new_arrival, special_offer, created_at
      from products order by name
    `;
    return rows.map(mapProduct);
  });

export const adminSaveProduct = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(productInput)
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const id = data.id?.trim() || `${slugify(data.name)}-${Date.now().toString(36)}`;
    await sql.query(
      `insert into products (
        id, category_id, name, description, price, compare_at, images, specs, colors, sizes,
        dimensions, material, stock, warranty, delivery_info, featured, bestseller, new_arrival, special_offer
      ) values (
        $1,$2,$3,$4,$5,$6,$7::jsonb,$8::jsonb,$9::jsonb,$10::jsonb,
        $11,$12,$13,$14,$15,$16,$17,$18,$19
      )
      on conflict (id) do update set
        category_id = excluded.category_id,
        name = excluded.name,
        description = excluded.description,
        price = excluded.price,
        compare_at = excluded.compare_at,
        images = excluded.images,
        specs = excluded.specs,
        colors = excluded.colors,
        sizes = excluded.sizes,
        dimensions = excluded.dimensions,
        material = excluded.material,
        stock = excluded.stock,
        warranty = excluded.warranty,
        delivery_info = excluded.delivery_info,
        featured = excluded.featured,
        bestseller = excluded.bestseller,
        new_arrival = excluded.new_arrival,
        special_offer = excluded.special_offer
      `,
      [
        id,
        data.categoryId,
        data.name,
        data.description,
        data.price,
        data.compareAt ?? null,
        JSON.stringify(data.images),
        JSON.stringify(data.specs),
        JSON.stringify(data.colors),
        JSON.stringify(data.sizes),
        data.dimensions,
        data.material,
        data.stock,
        data.warranty,
        data.deliveryInfo,
        data.featured,
        data.bestseller,
        data.newArrival,
        data.specialOffer,
      ],
    );
    return { id };
  });

export const adminDeleteProduct = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    await sql`delete from products where id = ${data.id}`;
    return { ok: true };
  });

export const adminListOrders = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql<Parameters<typeof mapOrder>[0]>`
      select id, user_id, status, fulfillment, address_snapshot, payment_method, payment_status,
             subtotal, delivery_fee, total, notes, customer_name, customer_phone, created_at, updated_at
      from orders order by created_at desc
    `;
    const result = [];
    for (const row of rows) {
      const items = await sql<Parameters<typeof mapOrderItem>[0]>`
        select id, order_id, product_id, name, image_url, unit_price, quantity, color, size
        from order_items where order_id = ${row.id}
      `;
      result.push(mapOrder(row, items.map(mapOrderItem), []));
    }
    return result;
  });

export const adminGetOrder = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql<Parameters<typeof mapOrder>[0]>`
      select id, user_id, status, fulfillment, address_snapshot, payment_method, payment_status,
             subtotal, delivery_fee, total, notes, customer_name, customer_phone, created_at, updated_at
      from orders where id = ${data.id} limit 1
    `;
    const row = rows[0];
    if (!row) return null;
    const items = await sql<Parameters<typeof mapOrderItem>[0]>`
      select id, order_id, product_id, name, image_url, unit_price, quantity, color, size
      from order_items where order_id = ${data.id}
    `;
    const events = await sql<Parameters<typeof mapEvent>[0]>`
      select id, order_id, status, note, created_at from order_events
      where order_id = ${data.id} order by created_at
    `;
    return mapOrder(row, items.map(mapOrderItem), events.map(mapEvent));
  });

export const adminUpdateOrder = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      id: z.string(),
      status: z.string().optional(),
      paymentStatus: z.enum(["pending", "paid"]).optional(),
      note: z.string().max(400).optional(),
    }),
  )
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql<{ id: string; user_id: string; status: string }>`
      select id, user_id, status from orders where id = ${data.id} limit 1
    `;
    const order = rows[0];
    if (!order) throw new Error("Order not found");
    if (data.status) {
      await sql.query(`update orders set status = $1, updated_at = now() where id = $2`, [data.status, data.id]);
      const label = ORDER_LABELS[data.status as OrderStatus] ?? data.status;
      const note = data.note?.trim() || `Status updated to ${label}.`;
      await sql.query(`insert into order_events (order_id, status, note) values ($1,$2,$3)`, [
        data.id,
        data.status,
        note,
      ]);
      await sql.query(`insert into notifications (user_id, title, body, href) values ($1,$2,$3,$4)`, [
        order.user_id,
        `Order ${data.id}`,
        note,
        `/account/orders/${data.id}`,
      ]);
    }
    if (data.paymentStatus) {
      await sql.query(`update orders set payment_status = $1, updated_at = now() where id = $2`, [
        data.paymentStatus,
        data.id,
      ]);
    }
    return { ok: true };
  });

export const adminListCustomers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql<Parameters<typeof mapProfile>[0]>`
      select user_id, full_name, phone, email, role from profiles order by created_at desc
    `;
    const withCounts = [];
    for (const row of rows) {
      const counts = await sql<{ n: number; spent: number }>`
        select count(*)::int as n, coalesce(sum(total),0)::int as spent from orders where user_id = ${row.user_id}
      `;
      withCounts.push({
        ...mapProfile(row),
        orderCount: counts[0]?.n ?? 0,
        spent: counts[0]?.spent ?? 0,
      });
    }
    return withCounts;
  });

export const adminSetRole = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ userId: z.string(), role: z.enum(["admin", "customer"]) }))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    await sql.query(`update profiles set role = $1 where user_id = $2`, [data.role, data.userId]);
    return { ok: true };
  });

export const adminListBanners = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await seedIfNeeded();
    await requireAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql<Parameters<typeof mapBanner>[0]>`
      select id, title, subtitle, image_url, cta_text, cta_href, sort_order, active
      from banners order by sort_order, id
    `;
    return rows.map(mapBanner);
  });

export const adminSaveBanner = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      id: z.number().optional(),
      title: z.string().min(2),
      subtitle: z.string(),
      imageUrl: z.string().min(1),
      ctaText: z.string(),
      ctaHref: z.string(),
      sortOrder: z.number().int(),
      active: z.boolean(),
    }),
  )
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    if (data.id) {
      await sql.query(
        `update banners set title=$1, subtitle=$2, image_url=$3, cta_text=$4, cta_href=$5, sort_order=$6, active=$7
         where id=$8`,
        [data.title, data.subtitle, data.imageUrl, data.ctaText, data.ctaHref, data.sortOrder, data.active, data.id],
      );
    } else {
      await sql.query(
        `insert into banners (title, subtitle, image_url, cta_text, cta_href, sort_order, active)
         values ($1,$2,$3,$4,$5,$6,$7)`,
        [data.title, data.subtitle, data.imageUrl, data.ctaText, data.ctaHref, data.sortOrder, data.active],
      );
    }
    return { ok: true };
  });

export const adminDeleteBanner = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.number() }))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    await sql`delete from banners where id = ${data.id}`;
    return { ok: true };
  });

export const adminSaveCategory = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      id: z.string().optional(),
      parentId: z.string().nullable(),
      name: z.string().min(2),
      description: z.string(),
      imageUrl: z.string(),
      sortOrder: z.number().int(),
    }),
  )
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const id = data.id?.trim() || slugify(data.name);
    await sql.query(
      `insert into categories (id, parent_id, name, description, image_url, sort_order)
       values ($1,$2,$3,$4,$5,$6)
       on conflict (id) do update set
         parent_id = excluded.parent_id,
         name = excluded.name,
         description = excluded.description,
         image_url = excluded.image_url,
         sort_order = excluded.sort_order`,
      [id, data.parentId, data.name, data.description, data.imageUrl, data.sortOrder],
    );
    return { id };
  });

export const adminDeleteCategory = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    await sql`delete from categories where id = ${data.id}`;
    return { ok: true };
  });

export const adminUpdateStock = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string(), stock: z.number().int().min(0) }))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    await sql.query(`update products set stock = $1 where id = $2`, [data.stock, data.id]);
    return { ok: true };
  });

export const adminUpdatePrice = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      id: z.string(),
      price: z.number().int().min(0),
      compareAt: z.number().int().min(0).nullable(),
      specialOffer: z.boolean().optional(),
    }),
  )
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    await sql.query(
      `update products set price = $1, compare_at = $2, special_offer = coalesce($3, special_offer) where id = $4`,
      [data.price, data.compareAt, data.specialOffer ?? null, data.id],
    );
    return { ok: true };
  });

export { ORDER_FLOW, mapCategory };
