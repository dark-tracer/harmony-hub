import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const inputSchema = z.object({ key: z.enum(["shared", "home", "obituary", "service-details", "order-of-service", "photo-gallery"]), content: z.record(z.unknown()) });

export const saveCmsContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => inputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: role } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
    if (!role) throw new Error("Administrator access required");
    const { error } = await context.supabase.from("site_content").upsert({ content_key: data.key, content: data.content });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
