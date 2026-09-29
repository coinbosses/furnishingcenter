import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { mapAddress, mapNotification, mapProduct, type ProductRow } from "@/lib/server/map";
import { ensureProfile } from "@/lib/server/profile";
import { seedIfNeeded } from "@/lib/server/seed";

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await seedIfNeeded();
    return ensureProfile(context.userId);
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      fullName: z.string().min(1).max(120),
      phone: z.string().max(40),
    }),
  )
  .handler(async ({ context, data }) => {
    await ensureProfile(context.userId);
    const sql = await getSql();
    await sql.query(`update profiles set full_name = $1, phone = $2 where user_id = $3`, [
      data.fullName.trim(),
      data.phone.trim(),
      context.userId,
    ]);
    return ensureProfile(context.userId);
  });

export const listMyAddresses = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<Parameters<typeof mapAddress>[0]>`
      select id, user_id, label, full_name, phone, street, area, city, state, is_default
      from addresses where user_id = ${context.userId} order by is_default desc, label
    `;
    return rows.map(mapAddress);
  });

const addressInput = z.object({
  label: z.string().min(1).max(40),
  fullName: z.string().min(1).max(120),
  phone: z.string().min(7).max(40),
  street: z.string().min(3).max(200),
  area: z.string().max(80),
  city: z.string().min(1).max(80),
  state: z.string().min(1).max(80),
  isDefault: z.boolean().optional(),
});

export const saveAddress = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(addressInput.extend({ id: z.string().optional() }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const id = data.id ?? crypto.randomUUID();
    if (data.isDefault) {
      await sql`update addresses set is_default = false where user_id = ${context.userId}`;
    }
    if (data.id) {
      await sql.query(
        `update addresses set label=$1, full_name=$2, phone=$3, street=$4, area=$5, city=$6, state=$7, is_default=$8
         where id=$9 and user_id=$10`,
        [
          data.label,
          data.fullName,
          data.phone,
          data.street,
          data.area,
          data.city,
          data.state,
          data.isDefault ?? false,
          data.id,
          context.userId,
        ],
      );
    } else {
      await sql.query(
        `insert into addresses (id, user_id, label, full_name, phone, street, area, city, state, is_default)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [
          id,
          context.userId,
          data.label,
          data.fullName,
          data.phone,
          data.street,
          data.area,
          data.city,
          data.state,
          data.isDefault ?? false,
        ],
      );
    }
    const rows = await sql<Parameters<typeof mapAddress>[0]>`
      select id, user_id, label, full_name, phone, street, area, city, state, is_default
      from addresses where user_id = ${context.userId} order by is_default desc, label
    `;
    return rows.map(mapAddress);
  });

export const deleteAddress = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`delete from addresses where id = ${data.id} and user_id = ${context.userId}`;
    return { ok: true };
  });

export const listWishlist = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await seedIfNeeded();
    const sql = await getSql();
    const rows = await sql<ProductRow>`
      select p.id, p.category_id, p.name, p.description, p.price, p.compare_at, p.images, p.specs, p.colors, p.sizes,
             p.dimensions, p.material, p.stock, p.warranty, p.delivery_info, p.featured, p.bestseller,
             p.new_arrival, p.special_offer, p.created_at
      from wishlist w join products p on p.id = w.product_id
      where w.user_id = ${context.userId}
      order by w.created_at desc
    `;
    return rows.map(mapProduct);
  });

export const toggleWishlist = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ productId: z.string() }))
  .handler(async ({ context, data }) => {
    await seedIfNeeded();
    const sql = await getSql();
    const existing = await sql<{ product_id: string }>`
      select product_id from wishlist where user_id = ${context.userId} and product_id = ${data.productId}
    `;
    if (existing.length) {
      await sql`delete from wishlist where user_id = ${context.userId} and product_id = ${data.productId}`;
      return { saved: false };
    }
    await sql.query(`insert into wishlist (user_id, product_id) values ($1,$2) on conflict do nothing`, [
      context.userId,
      data.productId,
    ]);
    return { saved: true };
  });

export const mergeWishlist = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ productIds: z.array(z.string()) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    for (const id of data.productIds) {
      await sql.query(`insert into wishlist (user_id, product_id) values ($1,$2) on conflict do nothing`, [
        context.userId,
        id,
      ]);
    }
    return { ok: true };
  });

export const submitInquiry = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      productId: z.string().optional(),
      kind: z.enum(["ask", "quote"]),
      message: z.string().min(4).max(2000),
      phone: z.string().max(40),
    }),
  )
  .handler(async ({ context, data }) => {
    await ensureProfile(context.userId);
    const sql = await getSql();
    await sql.query(
      `insert into inquiries (user_id, product_id, kind, message, phone) values ($1,$2,$3,$4,$5)`,
      [context.userId, data.productId ?? null, data.kind, data.message.trim(), data.phone.trim()],
    );
    return { ok: true };
  });

export const listMyNotifications = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<Parameters<typeof mapNotification>[0]>`
      select id, title, body, href, read, created_at
      from notifications where user_id = ${context.userId}
      order by created_at desc limit 40
    `;
    return rows.map(mapNotification);
  });

export const markNotificationsRead = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await sql`update notifications set read = true where user_id = ${context.userId}`;
    return { ok: true };
  });
