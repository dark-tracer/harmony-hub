import { useServerFn } from "@tanstack/react-start";
import { ChevronDown, ChevronUp, Plus, Save, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminListFamilyTributes, adminListGuestTributes, saveFamilyTributes, setGuestTributeStatus } from "@/lib/tributes.functions";

type Guest = { id: string; name: string; is_anonymous: boolean; message: string; status: "pending" | "approved" | "rejected"; created_at: string };

export function GuestTributesAdmin() {
  const list = useServerFn(adminListGuestTributes);
  const setStatus = useServerFn(setGuestTributeStatus);
  const [rows, setRows] = useState<Guest[]>([]);
  const [tab, setTab] = useState<Guest["status"]>("pending");
  const load = useCallback(() => list().then(setRows).catch(() => toast.error("Could not load tributes")), [list]);
  useEffect(() => { void load(); }, [load]);
  async function change(id: string, status: Guest["status"]) {
    try { await setStatus({ data: { id, status } }); toast.success(status === "approved" ? "Approved — now public" : status === "rejected" ? "Rejected" : "Moved to pending"); await load(); }
    catch { toast.error("Could not update tribute"); }
  }
  const shown = rows.filter((r) => r.status === tab);
  return <div>
    <div className="mb-5 flex gap-2">{(["pending", "approved", "rejected"] as const).map((s) => <Button key={s} size="sm" variant={tab === s ? "default" : "outline"} onClick={() => setTab(s)} className="capitalize">{s} ({rows.filter((r) => r.status === s).length})</Button>)}</div>
    {shown.length === 0 && <p className="text-sm text-muted-foreground">No {tab} tributes.</p>}
    <div className="space-y-4">{shown.map((r) => <div key={r.id} className="border border-border bg-background p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2"><p className="font-semibold">{r.name}{r.is_anonymous && <span className="ml-2 font-label text-xs text-secondary">(posts as Anonymous)</span>}</p><time className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString("en-GB")}</time></div>
      <p className="mt-3 whitespace-pre-line text-sm">{r.message}</p>
      <div className="mt-4 flex gap-2">
        {r.status === "pending" && <><Button size="sm" onClick={() => change(r.id, "approved")}>Approve</Button><Button size="sm" variant="outline" onClick={() => change(r.id, "rejected")}>Reject</Button></>}
        {r.status === "approved" && <Button size="sm" variant="outline" onClick={() => change(r.id, "rejected")}>Reject</Button>}
        {r.status === "rejected" && <><Button size="sm" variant="outline" onClick={() => change(r.id, "pending")}>Restore to pending</Button><Button size="sm" onClick={() => change(r.id, "approved")}>Approve</Button></>}
      </div>
    </div>)}</div>
  </div>;
}

type Family = { id?: string; author_name: string; relationship: string; message: string };

export function FamilyTributesAdmin() {
  const list = useServerFn(adminListFamilyTributes);
  const save = useServerFn(saveFamilyTributes);
  const [rows, setRows] = useState<Family[]>([]);
  const [deleted, setDeleted] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const load = useCallback(() => list().then((d) => { setRows(d); setDeleted([]); }).catch(() => toast.error("Could not load family tributes")), [list]);
  useEffect(() => { void load(); }, [load]);
  const update = (i: number, patch: Partial<Family>) => setRows((r) => r.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const move = (i: number, d: number) => setRows((r) => { const a = [...r]; const t = i + d; if (t < 0 || t >= a.length) return r; [a[i], a[t]] = [a[t]!, a[i]!]; return a; });
  async function onSave() {
    if (rows.some((r) => !r.author_name.trim() || !r.message.trim())) { toast.error("Each tribute needs a name and a message"); return; }
    setBusy(true);
    try { await save({ data: { items: rows, deletedIds: deleted } }); toast.success("Family tributes saved"); await load(); }
    catch { toast.error("Could not save"); } finally { setBusy(false); }
  }
  return <div className="space-y-4">
    <div className="flex justify-end"><Button onClick={onSave} disabled={busy}><Save />{busy ? "Saving…" : "Save"}</Button></div>
    {rows.map((r, i) => <div key={r.id ?? `new-${i}`} className="space-y-3 border border-border bg-background p-4">
      <div className="flex items-center justify-between"><span className="font-label text-xs font-bold text-muted-foreground">Tribute {i + 1}</span><div className="flex gap-1">
        <Button size="icon" variant="ghost" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}><ChevronUp /></Button>
        <Button size="icon" variant="ghost" aria-label="Move down" disabled={i === rows.length - 1} onClick={() => move(i, 1)}><ChevronDown /></Button>
        <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => { if (r.id) setDeleted((d) => [...d, r.id!]); setRows((x) => x.filter((_, j) => j !== i)); }}><Trash2 /></Button>
      </div></div>
      <div className="space-y-2"><Label>Author name</Label><Input value={r.author_name} onChange={(e) => update(i, { author_name: e.target.value })} /></div>
      <div className="space-y-2"><Label>Relationship</Label><Input value={r.relationship} placeholder="e.g. Daughter" onChange={(e) => update(i, { relationship: e.target.value })} /></div>
      <div className="space-y-2"><Label>Message</Label><Textarea rows={6} value={r.message} onChange={(e) => update(i, { message: e.target.value })} /></div>
    </div>)}
    <Button variant="outline" size="sm" onClick={() => setRows((r) => [...r, { author_name: "", relationship: "", message: "" }])}><Plus />Add family tribute</Button>
  </div>;
}
