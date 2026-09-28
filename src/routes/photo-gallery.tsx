import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { MemorialShell, PageIntro } from "@/components/memorial-shell";
import { AdinkraDivider } from "@/components/adinkra";
import { gallery } from "@/lib/memorial-data";
import { useCmsContent } from "@/lib/cms-content";

export const Route = createFileRoute("/photo-gallery")({ head: () => ({ meta: [
  { title: "Gallery — Joyce Dedo Narh" }, { name: "description", content: "Treasured photographs across 59 beautiful years of Mama Joyce's life." },
  { property: "og:title", content: "Gallery — Joyce Dedo Narh" }, { property: "og:description", content: "The visual archive of Mama Joyce's radiant life." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }, { property: "og:image", content: gallery[0][0] }, { name: "twitter:image", content: gallery[0][0] },
]}), component: PhotoGallery });

function PhotoGallery() {
  const c = useCmsContent("photo-gallery");
  const [filter, setFilter] = useState(c.allLabel);
  const [index, setIndex] = useState<number | null>(null);
  const touch = useRef<number | null>(null);
  const filters = useMemo(() => [c.allLabel, ...Array.from(new Set(c.photos.map((p) => p.category).filter(Boolean)))], [c]);
  const visible = useMemo(() => (filter === c.allLabel ? c.photos : c.photos.filter((p) => p.category === filter)), [filter, c]);
  const n = visible.length;
  const step = (d: number) => setIndex((i) => (i === null ? i : (i + d + n) % n));
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIndex(null); if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); };
    window.addEventListener("keydown", onKey); document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  });
  const current = index === null ? null : visible[index];
  return <MemorialShell>
    <PageIntro eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle} />
    <section className="mx-auto max-w-7xl px-4 pb-24">
      <p className="mx-auto max-w-2xl text-center font-light leading-8 text-muted-foreground">{c.intro}</p>
      <div className="mt-10 flex flex-wrap justify-center gap-2">{filters.map((f) => <button key={f} onClick={() => setFilter(f)} className={`rounded-full border px-4 py-2 font-label text-xs tracking-wide transition ${filter === f ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-gold"}`}>{f}</button>)}</div>
      <div className="mt-12 columns-2 gap-3 md:columns-3 lg:columns-4 md:gap-4">
        {visible.map((p, i) => <button key={`${p.url}-${i}`} onClick={() => setIndex(i)} className="group mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-transparent transition duration-500 hover:border-gold md:mb-4">
          <img src={p.url} alt={p.caption} loading="lazy" className="w-full transition duration-700 group-hover:scale-[1.03]" />
        </button>)}
      </div>
      <AdinkraDivider symbol="sankofa" className="mt-20" />
      <div className="mt-12 text-center"><p className="font-script text-4xl text-primary">{c.closingQuote}</p><p className="mx-auto mt-5 max-w-2xl font-light leading-8 text-muted-foreground">{c.closingText}</p><p className="mt-5 font-label text-xs uppercase tracking-[.3em] text-secondary">{c.closingLine}</p></div>
    </section>
    {current && <div role="dialog" aria-modal className="fixed inset-0 z-[70] flex items-center justify-center bg-primary/95 p-4 backdrop-blur-sm animate-fade-in" onClick={() => setIndex(null)}
      onTouchStart={(e) => (touch.current = e.touches[0]!.clientX)} onTouchEnd={(e) => { if (touch.current === null) return; const dx = e.changedTouches[0]!.clientX - touch.current; if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1); touch.current = null; }}>
      <button aria-label="Close" className="absolute right-4 top-4 grid size-11 place-items-center rounded-full border border-primary-foreground/30 text-primary-foreground" onClick={() => setIndex(null)}><X /></button>
      <button aria-label="Previous" className="absolute left-3 hidden size-11 place-items-center rounded-full border border-primary-foreground/30 text-primary-foreground md:grid" onClick={(e) => { e.stopPropagation(); step(-1); }}><ChevronLeft /></button>
      <figure className="max-h-full max-w-5xl text-center" onClick={(e) => e.stopPropagation()}>
        <img src={current.url} alt={current.caption} className="max-h-[80vh] w-auto rounded-2xl object-contain" />
        <figcaption className="mt-4 font-display text-lg text-primary-foreground">{current.caption}<span className="ml-3 font-label text-xs text-gold-soft">{index! + 1} / {n}</span></figcaption>
      </figure>
      <button aria-label="Next" className="absolute right-3 hidden size-11 place-items-center rounded-full border border-primary-foreground/30 text-primary-foreground md:grid" onClick={(e) => { e.stopPropagation(); step(1); }}><ChevronRight /></button>
    </div>}
  </MemorialShell>;
}
