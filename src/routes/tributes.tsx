import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Feather, Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { AdinkraDivider } from "@/components/adinkra";
import { MemorialShell, PageIntro } from "@/components/memorial-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCmsContent } from "@/lib/cms-content";
import { listApprovedGuestTributes, submitGuestTribute } from "@/lib/tributes.functions";

export const Route = createFileRoute("/tributes")({
  head: () => ({ meta: [
    { title: "Guest Book & Tributes — Joyce Dedo Narh" },
    { name: "description", content: "Leave a message of love and read tributes honoring Joyce Dedo Narh, affectionately known as Mama Joyce." },
    { property: "og:title", content: "Guest Book & Tributes — Joyce Dedo Narh" },
    { property: "og:description", content: "Share a memory of Mama Joyce and read words of remembrance from friends and loved ones." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: TributesPage,
});

type Approved = { id: string; display_name: string; message: string; created_at: string };
const LIMIT = 200;
const COOLDOWN_KEY = "guest-tribute-last-submit";

function TributesPage() {
  const content = useCmsContent("tributes");
  const list = useServerFn(listApprovedGuestTributes);
  const submit = useServerFn(submitGuestTribute);
  const [items, setItems] = useState<Approved[] | null>(null);
  const [name, setName] = useState("");
  const [anon, setAnon] = useState(false);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { list().then(setItems).catch(() => setItems([])); }, [list]);

  const over = message.length > LIMIT;
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !message.trim()) { setError("Please enter your name and a message."); return; }
    if (over) return;
    const last = Number(localStorage.getItem(COOLDOWN_KEY) ?? 0);
    if (Date.now() - last < 30_000) { setError("Please wait a moment before sending another tribute."); return; }
    setBusy(true);
    try {
      await submit({ data: { name, isAnonymous: anon, message, website } });
      localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
      setDone(true); setName(""); setMessage(""); setAnon(false);
    } catch (err) { setError(err instanceof Error ? err.message : "Your tribute could not be sent."); }
    finally { setBusy(false); }
  }

  return (
    <MemorialShell>
      <PageIntro eyebrow={content.eyebrow} title={content.title} subtitle={content.subtitle} />
      <section className="mx-auto max-w-5xl px-5 pb-24">
        <p className="mx-auto max-w-3xl text-center text-lg font-light leading-9 text-muted-foreground">{content.introduction}</p>

        <div className="mx-auto mt-12 max-w-2xl rounded-3xl border border-border bg-card/95 p-7 shadow-soft md:p-10">
          <p className="eyebrow text-center">Guest Book</p>
          <h2 className="mt-3 text-center font-display text-3xl text-primary">Leave a Tribute</h2>
          {done ? (
            <div className="mt-8 text-center" role="status">
              <Feather className="mx-auto size-8 text-gold" strokeWidth={1.25} />
              <p className="mt-4 font-display text-xl text-primary">Thank you — your tribute will appear once reviewed.</p>
              <Button variant="outline" className="mt-6" onClick={() => setDone(false)}>Write another</Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <div className="space-y-2"><Label htmlFor="t-name">Your name</Label><Input id="t-name" value={name} maxLength={100} onChange={(e) => setName(e.target.value)} required /></div>
              <label className="flex items-center gap-3 text-sm text-muted-foreground"><input type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)} className="size-4 accent-[var(--color-primary)]" />Post anonymously</label>
              <div className="space-y-2">
                <Label htmlFor="t-msg">Your message</Label>
                <Textarea id="t-msg" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} aria-invalid={over} required />
                <p className={`text-right font-label text-xs ${over ? "text-destructive" : "text-muted-foreground"}`}>{message.length} / {LIMIT}</p>
              </div>
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label>Website<input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
              </div>
              {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
              <Button type="submit" className="w-full" disabled={busy || over}>{busy ? "Sending…" : "Submit Tribute"}</Button>
            </form>
          )}
        </div>

        <AdinkraDivider symbol="sankofa" className="my-16" />

        {items && items.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {items.map((t) => (
              <article key={t.id} className="rounded-3xl border border-border bg-card/90 p-7 shadow-soft">
                <Quote className="size-6 text-gold" strokeWidth={1.25} aria-hidden="true" />
                <p className="mt-4 whitespace-pre-line font-display text-lg leading-8 text-primary">{t.message}</p>
                <div className="mt-5 border-t border-border pt-4">
                  <p className="font-display font-semibold text-primary">{t.display_name}</p>
                  <time className="font-label text-xs uppercase tracking-[.18em] text-secondary">{new Date(t.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</time>
                </div>
              </article>
            ))}
          </div>
        ) : items ? (
          <p className="text-center font-display text-xl text-primary">Be the first to leave a tribute.</p>
        ) : null}

        <div className="mx-auto mt-20 max-w-3xl text-center">
          <p className="font-script text-4xl leading-relaxed text-primary md:text-5xl">{content.closingQuote}</p>
          <p className="mt-5 font-label text-xs uppercase tracking-[.3em] text-secondary">{content.closingLine}</p>
        </div>
      </section>
    </MemorialShell>
  );
}
