import { useServerFn } from "@tanstack/react-start";
import { Check, ChevronDown, ChevronUp, Plus, Save, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TributePhotoField } from "@/components/tribute-photo-field";
import { adminListFamilyData, adminListGuestTributes, createTributeCategory, deleteFamilyTribute, deleteTributeCategory, renameTributeCategory, reorderFamilyTributes, reorderTributeCategories, saveFamilyTribute, setGuestTributeStatus } from "@/lib/tributes.functions";

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

type Category = { id: string; name: string; category_order: number };
type Tribute = { id?: string; author_name: string; relationship: string; message: string; photo_url: string; category_id: string; tribute_order?: number };
const errMsg = (e: unknown, f: string) => (e instanceof Error && e.message ? e.message : f);
function swap<T>(a: T[], i: number, d: number) { const b = [...a]; const t = i + d; if (t < 0 || t >= b.length) return a; [b[i], b[t]] = [b[t]!, b[i]!]; return b; }

function CategoryCombobox({ categories, value, onChange, onCreate }: { categories: Category[]; value: string; onChange: (id: string) => void; onCreate: (name: string) => Promise<Category | null> }) {
  const current = categories.find((c) => c.id === value);
  const [text, setText] = useState(current?.name ?? "");
  const [open, setOpen] = useState(false);
  useEffect(() => { setText(current?.name ?? ""); }, [current?.name]);
  const q = text.trim().toLowerCase();
  const matches = categories.filter((c) => c.name.toLowerCase().includes(q));
  const exact = categories.some((c) => c.name.trim().toLowerCase() === q);
  return <div className="relative">
    <Input value={text} placeholder="Type to find a category" onFocus={() => setOpen(true)} onChange={(e) => { setText(e.target.value); setOpen(true); }}
      onBlur={() => setTimeout(() => { setOpen(false); setText(current?.name ?? ""); }, 150)} />
    {open && <div className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto border border-border bg-popover shadow-lg">
      {matches.map((c) => <button type="button" key={c.id} className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted" onMouseDown={(e) => e.preventDefault()} onClick={() => { onChange(c.id); setText(c.name); setOpen(false); }}>{c.name}{c.id === value && <Check className="size-4" />}</button>)}
      {q && !exact && <button type="button" className="w-full border-t border-border px-3 py-2 text-left text-sm font-semibold text-primary hover:bg-muted" onMouseDown={(e) => e.preventDefault()} onClick={async () => { const c = await onCreate(text.trim()); if (c) { onChange(c.id); setText(c.name); } setOpen(false); }}>Create new category: "{text.trim()}"</button>}
      {!matches.length && !q && <p className="px-3 py-2 text-sm text-muted-foreground">No categories yet — type a name.</p>}
    </div>}
  </div>;
}

function AddCategoryRow({ onCreate }: { onCreate: (name: string) => Promise<Category | null> }) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  async function add() {
    const n = name.trim();
    if (!n) return;
    setBusy(true);
    try { const c = await onCreate(n); if (c) setName(""); }
    finally { setBusy(false); }
  }
  return <div className="flex flex-wrap items-center gap-2 border border-dashed border-border bg-background p-3">
    <Input className="min-w-40 flex-1" placeholder="New category name" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") void add(); }} />
    <Button size="sm" variant="outline" disabled={!name.trim() || busy} onClick={() => void add()}><Plus />{busy ? "Adding…" : "Add category"}</Button>
  </div>;
}

export function FamilyTributesAdmin() {
  const list = useServerFn(adminListFamilyData);
  const createCat = useServerFn(createTributeCategory);
  const renameCat = useServerFn(renameTributeCategory);
  const deleteCat = useServerFn(deleteTributeCategory);
  const reorderCats = useServerFn(reorderTributeCategories);
  const reorderTrs = useServerFn(reorderFamilyTributes);
  const saveTr = useServerFn(saveFamilyTribute);
  const deleteTr = useServerFn(deleteFamilyTribute);
  const [view, setView] = useState<"tributes" | "categories">("tributes");
  const [cats, setCats] = useState<Category[]>([]);
  const [trs, setTrs] = useState<Tribute[]>([]);
  const [filter, setFilter] = useState("all");
  const [draft, setDraft] = useState<Tribute | null>(null);
  const [names, setNames] = useState<Record<string, string>>({});
  const load = useCallback(() => list().then((d) => { setCats(d.categories); setTrs(d.tributes); setNames(Object.fromEntries(d.categories.map((c) => [c.id, c.name]))); }).catch(() => toast.error("Could not load family tributes")), [list]);
  useEffect(() => { void load(); }, [load]);
  async function create(name: string) {
    try { const c = await createCat({ data: { name } }); toast.success(`Category "${c.name}" created`); setCats((x) => [...x, c]); setNames((n) => ({ ...n, [c.id]: c.name })); return c; }
    catch (e) { toast.error(errMsg(e, "Could not create category")); return null; }
  }
  async function act(fn: () => Promise<unknown>, ok: string, fail: string) { try { await fn(); toast.success(ok); await load(); } catch (e) { toast.error(errMsg(e, fail)); } }
  const count = (id: string) => trs.filter((t) => t.category_id === id).length;
  const shown = filter === "all" ? [...trs].sort((a, b) => cats.findIndex((c) => c.id === a.category_id) - cats.findIndex((c) => c.id === b.category_id) || (a.tribute_order ?? 0) - (b.tribute_order ?? 0)) : trs.filter((t) => t.category_id === filter);

  return <div className="space-y-5">
    <div className="flex gap-2"><Button size="sm" variant={view === "tributes" ? "default" : "outline"} onClick={() => setView("tributes")}>Tributes</Button><Button size="sm" variant={view === "categories" ? "default" : "outline"} onClick={() => setView("categories")}>Manage Categories</Button></div>

    {view === "categories" ? <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Order here sets the order on the Obituary page. Empty categories are hidden from visitors.</p>
      <AddCategoryRow onCreate={create} />
      {cats.length === 0 && <p className="text-sm text-muted-foreground">No categories yet.</p>}
      {cats.map((c, i) => <div key={c.id} className="flex flex-wrap items-center gap-2 border border-border bg-background p-3">
        <div className="flex flex-col"><Button size="icon" variant="ghost" aria-label="Move up" disabled={i === 0} onClick={() => act(() => reorderCats({ data: { ids: swap(cats, i, -1).map((x) => x.id) } }), "Order saved", "Could not reorder")}><ChevronUp /></Button><Button size="icon" variant="ghost" aria-label="Move down" disabled={i === cats.length - 1} onClick={() => act(() => reorderCats({ data: { ids: swap(cats, i, 1).map((x) => x.id) } }), "Order saved", "Could not reorder")}><ChevronDown /></Button></div>
        <Input className="min-w-40 flex-1" value={names[c.id] ?? ""} onChange={(e) => setNames((n) => ({ ...n, [c.id]: e.target.value }))} />
        <span className="font-label text-xs text-muted-foreground">{count(c.id)} tribute{count(c.id) === 1 ? "" : "s"}</span>
        <Button size="sm" variant="outline" disabled={!names[c.id]?.trim() || names[c.id]?.trim() === c.name} onClick={() => act(() => renameCat({ data: { id: c.id, name: names[c.id]!.trim() } }), "Category renamed", "Could not rename")}>Rename</Button>
        <Button size="icon" variant="ghost" aria-label="Delete category" onClick={() => { const n = count(c.id); if (n) { toast.error(`Reassign or delete these ${n} tribute${n === 1 ? "" : "s"} first`); return; } if (confirm(`Delete category "${c.name}"?`)) void act(() => deleteCat({ data: { id: c.id } }), "Category deleted", "Could not delete"); }}><Trash2 /></Button>
      </div>)}
    </div> : <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1"><Label>Show</Label><select className="h-9 border border-input bg-background px-2 text-sm" value={filter} onChange={(e) => setFilter(e.target.value)}><option value="all">All categories</option>{cats.map((c) => <option key={c.id} value={c.id}>{c.name} ({count(c.id)})</option>)}</select></div>
        <Button size="sm" variant="outline" onClick={() => setDraft({ author_name: "", relationship: "", message: "", photo_url: "", category_id: filter === "all" ? "" : filter })}><Plus />Add family tribute</Button>
      </div>
      {filter === "all" && trs.length > 1 && <p className="text-xs text-muted-foreground">Choose a single category above to reorder its tributes.</p>}
      {draft && <TributeEditor key="new" initial={draft} cats={cats} onCreate={create} onCancel={() => setDraft(null)} onSave={async (t) => { await act(() => saveTr({ data: t }), "Tribute added", "Could not save"); setDraft(null); }} />}
      {shown.length === 0 && !draft && <p className="text-sm text-muted-foreground">No tributes here yet.</p>}
      {shown.map((t, i) => <TributeEditor key={t.id} initial={t} cats={cats} onCreate={create}
        reorder={filter === "all" ? undefined : { up: i > 0, down: i < shown.length - 1, move: (d) => act(() => reorderTrs({ data: { ids: swap(shown, i, d).map((x) => x.id!) } }), "Order saved", "Could not reorder") }}
        onDelete={() => { if (confirm("Delete this tribute?")) void act(() => deleteTr({ data: { id: t.id! } }), "Tribute deleted", "Could not delete"); }}
        onSave={(x) => act(() => saveTr({ data: x }), "Tribute saved", "Could not save")} />)}
    </div>}
  </div>;
}

function TributeEditor({ initial, cats, onCreate, onSave, onDelete, onCancel, reorder }: { initial: Tribute; cats: Category[]; onCreate: (n: string) => Promise<Category | null>; onSave: (t: Tribute) => Promise<void>; onDelete?: (() => void) | undefined; onCancel?: (() => void) | undefined; reorder?: { up: boolean; down: boolean; move: (d: number) => void } | undefined }) {
  const [t, setT] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  useEffect(() => setT(initial), [initial]);
  const catName = cats.find((c) => c.id === t.category_id)?.name;
  async function save() {
    if (!t.category_id) { toast.error("Choose or create a category"); return; }
    if (!t.author_name.trim() || !t.message.trim()) { toast.error("Each tribute needs a name and a message"); return; }
    setBusy(true); try { await onSave({ ...(t.id ? { id: t.id } : {}), category_id: t.category_id, author_name: t.author_name, relationship: t.relationship, message: t.message, photo_url: t.photo_url }); } finally { setBusy(false); }
  }
  return <div className="space-y-3 border border-border bg-background p-4">
    <div className="flex items-center justify-between"><span className="font-label text-xs font-bold text-muted-foreground">{t.id ? (catName ?? "Uncategorised") : "New tribute"}</span><div className="flex gap-1">
      {reorder && <><Button size="icon" variant="ghost" aria-label="Move up" disabled={!reorder.up} onClick={() => reorder.move(-1)}><ChevronUp /></Button><Button size="icon" variant="ghost" aria-label="Move down" disabled={!reorder.down} onClick={() => reorder.move(1)}><ChevronDown /></Button></>}
      {onDelete && <Button size="icon" variant="ghost" aria-label="Delete" onClick={onDelete}><Trash2 /></Button>}
    </div></div>
    <div className="space-y-2"><Label>Category</Label><CategoryCombobox categories={cats} value={t.category_id} onChange={(id) => setT({ ...t, category_id: id })} onCreate={onCreate} /></div>
    <div className="space-y-2"><Label>Author name</Label><Input value={t.author_name} onChange={(e) => setT({ ...t, author_name: e.target.value })} /></div>
    <div className="space-y-2"><Label>Relationship</Label><Input value={t.relationship} placeholder="e.g. Daughter" onChange={(e) => setT({ ...t, relationship: e.target.value })} /></div>
    <TributePhotoField value={t.photo_url ?? ""} onChange={(photo_url) => setT((current) => ({ ...current, photo_url }))} onBusyChange={setUploading} />
    <div className="space-y-2"><Label>Message</Label><Textarea rows={6} value={t.message} onChange={(e) => setT({ ...t, message: e.target.value })} /></div>
    <div className="flex justify-end gap-2">{onCancel && <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>}<Button size="sm" onClick={save} disabled={busy || uploading}><Save />{busy ? "Saving…" : "Save"}</Button></div>
  </div>;
}
