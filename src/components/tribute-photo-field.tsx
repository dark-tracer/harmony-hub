import { useId, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export function TributePhotoField({ value, onChange, onBusyChange }: { value: string; onChange: (value: string) => void; onBusyChange: (busy: boolean) => void }) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  async function upload(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please choose an image file"); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error("Please choose a photo smaller than 10 MB"); return; }
    setBusy(true); onBusyChange(true);
    try {
      const path = `tributes/${crypto.randomUUID()}.${file.name.split(".").pop() ?? "jpg"}`;
      const bucket = supabase.storage.from("memorial-photos");
      const { error } = await bucket.upload(path, file, { contentType: file.type });
      if (error) throw error;
      const { data, error: signError } = await bucket.createSignedUrl(path, 60 * 60 * 24 * 365 * 50);
      if (signError || !data) throw new Error("Photo could not be opened");
      onChange(data.signedUrl);
      toast.success("Photo uploaded — save the tribute to publish it");
    } catch { toast.error("Photo could not be uploaded"); }
    finally { setBusy(false); onBusyChange(false); }
  }
  return <div className="space-y-2">
    <Label htmlFor={id}>Author photo</Label>
    {value && <img src={value} alt="Author photo preview" className="size-24 rounded-lg border border-border object-cover" />}
    <input id={id} ref={input} type="file" accept="image/*" className="sr-only" disabled={busy} onChange={(e) => { void upload(e.target.files?.[0]); e.target.value = ""; }} />
    <div className="flex gap-2">
      <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => input.current?.click()}><Upload />{busy ? "Uploading…" : value ? "Replace photo" : "Upload photo"}</Button>
      {value && <Button type="button" variant="ghost" size="icon" aria-label="Remove author photo" disabled={busy} onClick={() => onChange("")}><X /></Button>}
    </div>
  </div>;
}