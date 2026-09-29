import { getSql } from "@/lib/db";
import { mapProfile } from "@/lib/server/map";
import type { Profile } from "@/lib/types";

export async function ensureProfile(userId: string): Promise<Profile> {
  const sql = await getSql();
  const existing = await sql<{
    user_id: string;
    full_name: string;
    phone: string;
    email: string;
    role: string;
  }>`select user_id, full_name, phone, email, role from profiles where user_id = ${userId}`;
  if (existing[0]) return mapProfile(existing[0]);

  let fullName = "";
  let email = "";
  try {
    const users = await sql<{ name: string | null; email: string | null }>`
      select name, email from "user" where id = ${userId} limit 1
    `;
    fullName = users[0]?.name ?? "";
    email = users[0]?.email ?? "";
  } catch {
    /* user table may not be queryable in some edge paths */
  }

  const admins = await sql<{ n: number }>`select count(*)::int as n from profiles where role = 'admin'`;
  const role = (admins[0]?.n ?? 0) === 0 ? "admin" : "customer";
  await sql.query(
    `insert into profiles (user_id, full_name, phone, email, role) values ($1,$2,'',$3,$4)
     on conflict (user_id) do nothing`,
    [userId, fullName, email, role],
  );
  const created = await sql<{
    user_id: string;
    full_name: string;
    phone: string;
    email: string;
    role: string;
  }>`select user_id, full_name, phone, email, role from profiles where user_id = ${userId}`;
  return mapProfile(created[0]!);
}

export async function requireAdmin(userId: string): Promise<Profile> {
  const profile = await ensureProfile(userId);
  if (profile.role !== "admin") {
    const err = new Error("Forbidden");
    (err as { status?: number }).status = 403;
    throw err;
  }
  return profile;
}
