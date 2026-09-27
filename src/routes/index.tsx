import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Camera, Church, Download, ListOrdered } from "lucide-react";
import { MemorialShell } from "@/components/memorial-shell";
import { portrait } from "@/lib/memorial-data";
import { useCmsContent } from "@/lib/cms-content";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Joyce Dedo Narh — Mama Joyce Memorial" },
    { name: "description", content: "Celebrate the cherished life, faith, and legacy of Joyce Dedo Narh, Mama Joyce (1967–2026)." },
    { property: "og:title", content: "Joyce Dedo Narh — Mama Joyce Memorial" },
    { property: "og:description", content: "A celebration of a cherished life of grace, faith, and generosity." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    { property: "og:image", content: portrait }, { name: "twitter:image", content: portrait },
  ]}), component: Home,
});

const icons = [BookOpen, Church, ListOrdered, Camera];

function Home() {
  const content = useCmsContent("home");
  return <MemorialShell>
    <section className="relative overflow-hidden bg-muted px-5 py-14 md:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1fr_.8fr]">
        <div className="animate-rise text-center md:text-left"><p className="eyebrow">✦ {content.eyebrow}</p><h1 className="mt-5 font-display text-5xl font-semibold leading-tight text-primary md:text-7xl">{content.name}</h1><p className="mt-3 font-display text-2xl italic text-secondary">{content.nickname}</p><p className="mt-5 font-label text-sm font-semibold uppercase tracking-[.2em] text-muted-foreground">{content.years}</p><p className="mt-8 max-w-xl font-body text-lg leading-8 text-muted-foreground">{content.introduction}</p></div>
        <div className="relative mx-auto w-full max-w-sm"><div className="absolute -inset-3 rotate-3 border border-secondary/40" /><img src={content.portraitUrl} alt={content.portraitAlt} className="relative aspect-[4/5] w-full object-cover shadow-2xl" /><div className="absolute -bottom-6 -right-4 grid size-28 place-items-center rounded-full border-4 border-background bg-primary text-center text-primary-foreground shadow-xl"><span className="font-display text-3xl font-semibold">{content.age}<small className="block font-label text-[9px] uppercase tracking-widest">{content.ageLabel}</small></span></div></div>
      </div>
    </section>
    <section className="bg-primary px-5 py-8 text-center text-primary-foreground"><p className="font-display text-xl italic md:text-2xl">{content.verse}</p><p className="mt-2 font-label text-xs uppercase tracking-widest text-primary-soft">{content.verseReference}</p></section>
    <section className="section-wrap"><div className="text-center"><p className="eyebrow">{content.sectionEyebrow}</p><h2 className="mt-3 font-display text-4xl text-primary">{content.sectionTitle}</h2><p className="mx-auto mt-4 max-w-2xl prose-memorial">{content.sectionText}</p></div><div className="mt-12 grid gap-5 md:grid-cols-2">{content.cards.map(({ path, kicker, title, text, action },index) => { const Icon=icons[index]??BookOpen; return <Link key={`${path}-${index}`} to={path as "/obituary"} className="group border border-border bg-card p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><Icon className="size-8 text-secondary" /><p className="mt-6 font-label text-xs font-bold uppercase tracking-widest text-secondary">{kicker}</p><h3 className="mt-2 font-display text-2xl text-primary">{title}</h3><p className="mt-3 prose-memorial text-sm">{text}</p><span className="mt-6 inline-flex items-center gap-2 font-label text-sm font-bold text-primary">{action} <span aria-hidden>→</span></span></Link>})}</div></section>
    <section className="bg-muted px-5 py-16 text-center"><p className="eyebrow">{content.farewellEyebrow}</p><h2 className="mt-4 font-display text-4xl italic text-primary">{content.farewellTitle}</h2><p className="mx-auto mt-5 max-w-2xl prose-memorial">{content.farewellText}</p><Link to="/order-of-service" className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 font-label text-sm font-semibold text-primary-foreground"><Download size={17}/> {content.farewellAction}</Link></section>
  </MemorialShell>;
}