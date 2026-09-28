import { createFileRoute } from "@tanstack/react-router";
import { Accessibility, CalendarDays, Camera, MapPin, Navigation, ParkingCircle, Shirt } from "lucide-react";
import { MemorialShell, PageIntro } from "@/components/memorial-shell";
import { AdinkraDivider } from "@/components/adinkra";
import { useCmsContent } from "@/lib/cms-content";

export const Route = createFileRoute("/service-details")({ head: () => ({ meta: [{ title: "Service Details — Joyce Dedo Narh" }, { name: "description", content: "Burial and thanksgiving service times, venues, attire, and directions." }, { property: "og:title", content: "Service Details — Joyce Dedo Narh" }, { property: "og:description", content: "Gathering in faith and thanksgiving to honor Mama Joyce." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: ServiceDetails });

const detailIcons = [CalendarDays, MapPin, Shirt];
const guidanceIcons = [ParkingCircle, Accessibility, Camera];

function ServiceDetails() {
  const c = useCmsContent("service-details");
  return <MemorialShell>
    <PageIntro eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle} />
    <div className="mx-auto max-w-3xl space-y-10 px-5 pb-20">
      {c.services.map((s, idx) => <section key={idx} className="reveal overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
        <header className="bg-gradient-to-br from-primary to-moss px-8 py-8 text-primary-foreground md:px-10">
          <p className="font-label text-xs uppercase tracking-[.3em] text-gold-soft">{s.order} · {s.label}</p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl">{s.title}</h2>
        </header>
        <div className="space-y-6 px-8 py-8 md:px-10">
          {s.details.map((d, i) => { const Icon = detailIcons[i] ?? CalendarDays; return <div key={i} className="flex gap-4"><Icon size={20} className="mt-1 shrink-0 text-gold" /><div><p className="eyebrow text-[10px]">{d.label}</p><p className="mt-1 whitespace-pre-line text-foreground">{d.value}</p></div></div>; })}
          {s.mapUrl && <a href={s.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-label text-sm text-primary-foreground transition hover:bg-moss"><Navigation size={15} /> Open in Google Maps</a>}
        </div>
      </section>)}
    </div>
    <AdinkraDivider symbol="sankofa" />
    <section className="mx-auto max-w-5xl px-5 py-20">
      <div className="reveal text-center"><p className="eyebrow">{c.guidanceEyebrow}</p><h2 className="mt-4 font-display text-3xl text-primary md:text-4xl">{c.guidanceTitle}</h2><p className="mx-auto mt-4 max-w-xl font-light text-muted-foreground">{c.guidanceIntro}</p></div>
      <div className="mt-12 grid gap-5 md:grid-cols-3">{c.guidance.map((g, i) => { const Icon = guidanceIcons[i] ?? ParkingCircle; return <div key={i} className="reveal rounded-3xl border border-border bg-card p-7"><Icon className="text-gold" size={22} /><h3 className="mt-5 font-display text-xl text-primary">{g.title}</h3><p className="mt-3 text-sm font-light leading-7 text-muted-foreground">{g.text}</p></div>; })}</div>
      <div className="reveal mt-20 text-center"><p className="font-script text-4xl text-primary">{c.closingQuote}</p><p className="mt-4 font-label text-xs uppercase tracking-[.3em] text-secondary">{c.closingLine}</p></div>
    </section>
  </MemorialShell>;
}
