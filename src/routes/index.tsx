import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Leaf, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MemorialShell } from "@/components/memorial-shell";
import { AdinkraDivider } from "@/components/adinkra";
import { portrait } from "@/lib/memorial-data";
import { useCmsContent, useCmsContentStatus } from "@/lib/cms-content";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Joyce Dedo Narh — Celebration of Life" },
    { name: "description", content: "Celebrate the cherished life, faith, and legacy of Joyce Dedo Narh, Mama Joyce (1967–2026)." },
    { property: "og:title", content: "Joyce Dedo Narh — Celebration of Life" },
    { property: "og:description", content: "A celebration of a cherished life of grace, faith, and generosity." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    { property: "og:image", content: portrait }, { name: "twitter:image", content: portrait },
  ]}), component: Home,
});

function Slideshow({ slides }: { slides: { url: string; caption: string }[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const touch = useRef<number | null>(null);
  const n = slides.length;
  const go = (d: number) => setI((v) => (v + d + n) % n);
  useEffect(() => {
    if (paused || n < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % n), 6000);
    return () => clearInterval(t);
  }, [paused, n]);
  return (
    <div className="absolute inset-0" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => (touch.current = e.touches[0]!.clientX)}
      onTouchEnd={(e) => { if (touch.current === null) return; const dx = e.changedTouches[0]!.clientX - touch.current; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); touch.current = null; }}>
      {slides.map((s, idx) => <img key={idx} src={s.url} alt={s.caption} className={`absolute inset-0 size-full object-cover object-top transition-opacity duration-[2000ms] ease-in-out ${idx === i ? "opacity-100" : "opacity-0"}`} />)}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/45 to-primary/85" />
      {n > 1 && <>
        <button aria-label="Previous photo" onClick={() => go(-1)} className="absolute left-4 top-1/2 z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-primary-foreground/30 text-primary-foreground backdrop-blur-sm transition hover:bg-primary-foreground/10 md:grid"><ChevronLeft size={20} /></button>
        <button aria-label="Next photo" onClick={() => go(1)} className="absolute right-4 top-1/2 z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-primary-foreground/30 text-primary-foreground backdrop-blur-sm transition hover:bg-primary-foreground/10 md:grid"><ChevronRight size={20} /></button>
        <div className="absolute inset-x-0 bottom-8 z-10 flex justify-center gap-2">{slides.map((_, idx) => <button key={idx} aria-label={`Show photo ${idx + 1}`} onClick={() => setI(idx)} className={`h-1.5 rounded-full transition-all duration-500 ${idx === i ? "w-8 bg-gold" : "w-1.5 bg-primary-foreground/50"}`} />)}</div>
      </>}
    </div>
  );
}

function Home() {
  const [content, homeLoaded] = useCmsContentStatus("home");
  const services = useCmsContent("service-details");
  const [gallery, galleryLoaded] = useCmsContentStatus("photo-gallery");
  const [slideshow, slidesLoaded] = useCmsContentStatus("slideshow");
  const slides = (slideshow.slides ?? []).filter((s) => s.url && s.show?.toLowerCase() !== "no");
  const heroSlides = slides.length ? slides : content.portraitUrl ? [{ url: content.portraitUrl, caption: content.portraitAlt }] : [];
  return <MemorialShell overlayHeader>
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-primary px-5 pt-18 text-center text-primary-foreground">
      {slidesLoaded && (slides.length > 0 || homeLoaded) && <Slideshow slides={heroSlides} />}
      <div className="relative z-10 animate-rise">
        <p className="font-label text-xs uppercase tracking-[.45em] text-gold-soft">Celebration of Life</p>
        <h1 className="mt-6 font-display text-5xl font-bold uppercase leading-none tracking-wide sm:text-7xl md:text-8xl">{content.name}</h1>
        <p className="mt-4 font-script text-5xl text-gold-soft md:text-6xl">Mama Joyce</p>
        <p className="mt-6 font-label text-sm uppercase tracking-[.4em]">{content.years}</p>
      </div>
      <div className="absolute bottom-20 right-5 z-10 grid size-28 place-items-center rounded-full bg-primary text-center shadow-soft ring-1 ring-gold ring-offset-4 ring-offset-transparent md:right-16 md:bottom-24 md:size-36">
        <span><Leaf className="mx-auto size-4 text-gold" /><span className="block font-display text-3xl font-semibold md:text-4xl">{content.age}</span><span className="block font-label text-[9px] uppercase tracking-[.3em] text-gold-soft">Years</span></span>
      </div>
    </section>

    <section className="botanical px-5 py-24 text-center md:py-32">
      <div className="reveal relative mx-auto max-w-2xl">
        <p className="eyebrow">{content.eyebrow}</p>
        <h2 className="mt-5 font-display text-4xl text-primary md:text-5xl">{content.welcomeTitle}</h2>
        <p className="mt-8 text-lg font-light leading-9 text-muted-foreground">{content.introduction}</p>
        <p className="mt-10 font-script text-3xl text-primary">{content.verse}</p>
        <p className="mt-3 font-label text-xs uppercase tracking-[.3em] text-secondary">{content.verseReference}</p>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-5 pb-24">
      <p className="reveal eyebrow text-center">{content.servicesEyebrow}</p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {services.services.map((s, idx) => <Link key={idx} to="/service-details" className="reveal group rounded-3xl border border-border bg-card p-8 shadow-soft transition duration-500 hover:-translate-y-1 hover:border-gold/60 md:p-10">
          <p className="eyebrow">{s.label}</p>
          <h3 className="mt-3 font-display text-3xl text-primary">{s.title}</h3>
          <div className="mt-6 space-y-3 text-sm text-muted-foreground">
            <p className="flex gap-3"><CalendarDays size={17} className="mt-0.5 shrink-0 text-gold" /><span className="whitespace-pre-line">{s.details[0]?.value}</span></p>
            <p className="flex gap-3"><MapPin size={17} className="mt-0.5 shrink-0 text-gold" /><span className="whitespace-pre-line">{s.details[1]?.value}</span></p>
          </div>
          <span className="mt-8 inline-flex items-center gap-2 font-label text-sm text-primary">View details <ArrowRight size={15} className="transition group-hover:translate-x-1" /></span>
        </Link>)}
      </div>
    </section>

    <AdinkraDivider symbol="dwennimmen" tone="green" />

    <section className="mx-auto max-w-6xl px-5 py-24 text-center">
      <p className="reveal eyebrow">{content.galleryEyebrow}</p>
      <h2 className="reveal mt-4 font-display text-4xl text-primary md:text-5xl">{content.galleryTitle}</h2>
      <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">{galleryLoaded && gallery.photos.slice(0, 4).map((p, idx) => <img key={idx} src={p.url} alt={p.caption} className={`reveal w-full rounded-2xl object-cover ${idx % 2 ? "aspect-[3/4] md:mt-10" : "aspect-[3/4]"}`} />)}</div>
      <Link to="/photo-gallery" className="mt-12 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-label text-sm text-primary-foreground transition hover:bg-moss">{content.galleryAction} <ArrowRight size={15} /></Link>
    </section>

    <section className="botanical bg-muted px-5 py-24 text-center">
      <div className="reveal relative mx-auto max-w-2xl">
        <p className="eyebrow">{content.farewellEyebrow}</p>
        <h2 className="mt-5 font-script text-5xl text-primary md:text-6xl">{content.farewellTitle}</h2>
        <p className="mt-6 text-lg font-light leading-8 text-muted-foreground">{content.farewellText}</p>
        <div className="mt-10 grid gap-3 text-left sm:grid-cols-2">{content.cards.map((c, idx) => <Link key={idx} to={c.path as "/obituary"} className="rounded-2xl border border-border bg-card px-5 py-4 transition hover:border-gold/60"><p className="eyebrow text-[10px]">{c.kicker}</p><p className="mt-1 font-display text-lg text-primary">{c.title}</p></Link>)}</div>
      </div>
    </section>
  </MemorialShell>;
}
