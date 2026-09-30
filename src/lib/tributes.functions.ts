import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
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
  const { data, error } = await publicClient().from("family_tributes").select("id, author_name, relationship, message, display_order").order("display_order").order("created_at");
  if (error) throw new Error("Could not load family tributes");
  return data ?? [];
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

export const adminListFamilyTributes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase.from("family_tributes").select("id, author_name, relationship, message, display_order").order("display_order").order("created_at");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const familySchema = z.object({
  items: z.array(z.object({ id: z.string().uuid().optional(), author_name: z.string().trim().min(1).max(150), relationship: z.string().trim().max(100), message: z.string().trim().min(1).max(10000) })).max(200),
  deletedIds: z.array(z.string().uuid()),
});

export const saveFamilyTributes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => familySchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    if (data.deletedIds.length) {
      const { error } = await context.supabase.from("family_tributes").delete().in("id", data.deletedIds);
      if (error) throw new Error(error.message);
    }
    for (const [index, item] of data.items.entries()) {
      const row = { author_name: item.author_name, relationship: item.relationship, message: item.message, display_order: index };
      const { error } = item.id
        ? await context.supabase.from("family_tributes").update(row).eq("id", item.id)
        : await context.supabase.from("family_tributes").insert(row);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });
