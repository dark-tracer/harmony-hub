import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Camera, Church, Download, ListOrdered } from "lucide-react";
import { MemorialShell } from "@/components/memorial-shell";
import { portrait } from "@/lib/memorial-data";

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

const cards = [
  { to: "/obituary", icon: BookOpen, kicker: "Biography", title: "Obituary & Life Story", text: "Read her inspiring journey of faith, maternal devotion, entrepreneurship, and generous communal service.", action: "Read Biography" },
  { to: "/service-details", icon: Church, kicker: "Ceremonies", title: "Service Details", text: "Locations, timings, protocol, and reception details for the Burial Service and Thanksgiving.", action: "View Venues & Times" },
  { to: "/order-of-service", icon: ListOrdered, kicker: "Liturgy", title: "Order of Service", text: "Follow the formal sequence of worship, selected scripture readings, choir hymns, and memorial readings.", action: "Follow Liturgy" },
  { to: "/photo-gallery", icon: Camera, kicker: "Memories", title: "Photo Gallery", text: "Curated archival albums capturing Mama Joyce’s radiant smile, family milestones, and cherished memories.", action: "Browse Photographs" },
] as const;

function Home() {
  return <MemorialShell>
    <section className="relative overflow-hidden bg-muted px-5 py-14 md:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1fr_.8fr]">
        <div className="animate-rise text-center md:text-left"><p className="eyebrow">✦ Celebration of a Cherished Life</p><h1 className="mt-5 font-display text-5xl font-semibold leading-tight text-primary md:text-7xl">Joyce Dedo Narh</h1><p className="mt-3 font-display text-2xl italic text-secondary">Affectionately known as Mama Joyce</p><p className="mt-5 font-label text-sm font-semibold uppercase tracking-[.2em] text-muted-foreground">1967 — 2026</p><p className="mt-8 max-w-xl font-body text-lg leading-8 text-muted-foreground">A beacon of warmth, timeless dignity, and unwavering faith whose love continues to shelter and guide generations.</p></div>
        <div className="relative mx-auto w-full max-w-sm"><div className="absolute -inset-3 rotate-3 border border-secondary/40" /><img src={portrait} alt="Joyce Dedo Narh, Mama Joyce" className="relative aspect-[4/5] w-full object-cover shadow-2xl" /><div className="absolute -bottom-6 -right-4 grid size-28 place-items-center rounded-full border-4 border-background bg-primary text-center text-primary-foreground shadow-xl"><span className="font-display text-3xl font-semibold">59<small className="block font-label text-[9px] uppercase tracking-widest">Years of Grace</small></span></div></div>
      </div>
    </section>
    <section className="bg-primary px-5 py-8 text-center text-primary-foreground"><p className="font-display text-xl italic md:text-2xl">“The Lord gave, and the Lord hath taken away; blessed be the name of the Lord.”</p><p className="mt-2 font-label text-xs uppercase tracking-widest text-primary-soft">Job 1:21</p></section>
    <section className="section-wrap"><div className="text-center"><p className="eyebrow">Memorial Keep-Sake</p><h2 className="mt-3 font-display text-4xl text-primary">Commemoration & Service</h2><p className="mx-auto mt-4 max-w-2xl prose-memorial">Explore the chapters of Mama Joyce’s earthly pilgrimage, liturgical proceedings, and shared moments of joy.</p></div><div className="mt-12 grid gap-5 md:grid-cols-2">{cards.map(({ to, icon: Icon, kicker, title, text, action }) => <Link key={to} to={to} className="group border border-border bg-card p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><Icon className="size-8 text-secondary" /><p className="mt-6 font-label text-xs font-bold uppercase tracking-widest text-secondary">{kicker}</p><h3 className="mt-2 font-display text-2xl text-primary">{title}</h3><p className="mt-3 prose-memorial text-sm">{text}</p><span className="mt-6 inline-flex items-center gap-2 font-label text-sm font-bold text-primary">{action} <span aria-hidden>→</span></span></Link>)}</div></section>
    <section className="bg-muted px-5 py-16 text-center"><p className="eyebrow">Traditional Farewell</p><h2 className="mt-4 font-display text-4xl italic text-primary">Damirifa Due, Mama Joyce.</h2><p className="mx-auto mt-5 max-w-2xl prose-memorial">May the angels escort you peacefully to your eternal home of rest in the bosom of Abraham.</p><Link to="/order-of-service" className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 font-label text-sm font-semibold text-primary-foreground"><Download size={17}/> Order of Service</Link></section>
  </MemorialShell>;
}