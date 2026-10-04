import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/lib/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"] || import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
  const url = process.env["SUPABASE_URL"] || import.meta.env["VITE_SUPABASE_URL"];
  if (!url || !key) throw new Error("Site settings are missing on the server");
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const listApprovedGuestTributes = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient().rpc("get_approved_guest_tributes");
  if (error) throw new Error("Could not load tributes");
  return data ?? [];
});

export const listFamilyTributes = createServerFn({ method: "GET" }).handler(async () => {
  const c = publicClient();
  const [cats, trs] = await Promise.all([
    c.from("tribute_categories").select("id, name, category_order").order("category_order").order("created_at"),
    c.from("family_tributes").select("id, author_name, relationship, message, category_id, tribute_order").order("tribute_order").order("created_at"),
  ]);
  if (cats.error || trs.error) throw new Error("Could not load family tributes");
  return (cats.data ?? []).map((cat) => ({ id: cat.id, name: cat.name, tributes: (trs.data ?? []).filter((t) => t.category_id === cat.id) })).filter((g) => g.tributes.length > 0);
});

const submitSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  isAnonymous: z.boolean(),
  message: z.string().trim().min(1, "Please write a message").max(200, "Messages are limited to 200 characters"),
  website: z.string().max(500).optional(),
});

export const submitGuestTribute = createServerFn({ method: "POST" })
  .inputValidator((input) => submitSchema.parse(input))
  .handler(async ({ data }) => {
    if (data.website) return { ok: true }; // honeypot: silently ignore
    const ip = getRequestHeader("cf-connecting-ip") ?? getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const hash = await sha256(`${ip}:joyce-memorial`);
    const { error } = await publicClient().from("guest_tributes").insert({ name: data.name, is_anonymous: data.isAnonymous, message: data.message, submitted_ip_hash: hash });
    if (error) throw new Error(error.message.includes("Too many") ? "You've submitted several tributes recently. Please try again later." : "Your tribute could not be sent. Please try again.");
    return { ok: true };
  });

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
  if (!data) throw new Error("Administrator access required");
}

export const adminListGuestTributes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase.from("guest_tributes").select("id, name, is_anonymous, message, status, created_at").order("created_at");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const setGuestTributeStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid(), status: z.enum(["pending", "approved", "rejected"]) }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("guest_tributes").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListFamilyData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const [cats, trs] = await Promise.all([
      context.supabase.from("tribute_categories").select("id, name, category_order").order("category_order").order("created_at"),
      context.supabase.from("family_tributes").select("id, author_name, relationship, message, category_id, tribute_order").order("tribute_order").order("created_at"),
    ]);
    if (cats.error) throw new Error(cats.error.message);
    if (trs.error) throw new Error(trs.error.message);
    return { categories: cats.data ?? [], tributes: trs.data ?? [] };
  });

const uuid = z.string().uuid();
const check = (r: { error: { message: string; code?: string } | null }) => {
  if (r.error) throw new Error(r.error.code === "23505" ? "A category with that name already exists" : r.error.message);
};

export const renameTributeCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: uuid, name: z.string().trim().min(1).max(100) }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    check(await context.supabase.from("tribute_categories").update({ name: data.name }).eq("id", data.id));
    return { ok: true };
  });

export const deleteTributeCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: uuid }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { count } = await context.supabase.from("family_tributes").select("id", { count: "exact", head: true }).eq("category_id", data.id);
    if (count) throw new Error(`Reassign or delete these ${count} tributes first`);
    check(await context.supabase.from("tribute_categories").delete().eq("id", data.id));
    return { ok: true };
  });

export const reorderTributeCategories = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ ids: z.array(uuid).max(200) }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    for (const [i, id] of data.ids.entries()) check(await context.supabase.from("tribute_categories").update({ category_order: i }).eq("id", id));
    return { ok: true };
  });

export const reorderFamilyTributes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ ids: z.array(uuid).max(500) }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    for (const [i, id] of data.ids.entries()) check(await context.supabase.from("family_tributes").update({ tribute_order: i }).eq("id", id));
    return { ok: true };
  });

export const saveFamilyTribute = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: uuid.optional(), category_id: uuid, author_name: z.string().trim().min(1).max(150), relationship: z.string().trim().max(100), message: z.string().trim().min(1).max(10000) }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const sb = context.supabase;
    const row = { category_id: data.category_id, author_name: data.author_name, relationship: data.relationship, message: data.message };
    if (data.id) { check(await sb.from("family_tributes").update(row).eq("id", data.id)); return { ok: true }; }
    const { data: last } = await sb.from("family_tributes").select("tribute_order").eq("category_id", data.category_id).order("tribute_order", { ascending: false }).limit(1).maybeSingle();
    check(await sb.from("family_tributes").insert({ ...row, tribute_order: (last?.tribute_order ?? -1) + 1 }));
    return { ok: true };
  });

export const deleteFamilyTribute = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: uuid }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    check(await context.supabase.from("family_tributes").delete().eq("id", data.id));
    return { ok: true };
  });

