import { createFileRoute } from "@tanstack/react-router";
import { Printer } from "lucide-react";
import { MemorialShell, PageIntro } from "@/components/memorial-shell";
import { AdinkraDivider } from "@/components/adinkra";
import { Button } from "@/components/ui/button";
import { useCmsContent } from "@/lib/cms-content";

export const Route = createFileRoute("/order-of-service")({ head: () => ({ meta: [{ title: "Order of Service — Joyce Dedo Narh" }, { name: "description", content: "The burial and thanksgiving service programme for Mama Joyce." }, { property: "og:title", content: "Order of Service — Joyce Dedo Narh" }, { property: "og:description", content: "Liturgy, songs of praise, and words of remembrance." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: OrderOfService });

type Item = { title?: string | undefined; type?: string | undefined; text?: string | undefined };

function Timeline({ label, title, items }: { label: string; title: string; items: Item[] }) {
  return <section>
    <div className="reveal text-center"><p className="eyebrow">{label}</p><h2 className="mt-3 font-display text-3xl text-primary md:text-4xl">{title}</h2></div>
    <ol className="relative mt-12 ml-5 border-l border-gold/40">
      {items.map((m, i) => <li key={i} className="reveal relative pb-10 pl-10 last:pb-0">
        <span className="absolute -left-5 top-0 grid size-10 place-items-center rounded-full border border-gold bg-card font-display text-sm text-secondary">{String(i + 1).padStart(2, "0")}</span>
        <p className="eyebrow text-[10px]">{m.type}</p>
        <h3 className="mt-1 font-display text-xl text-primary">{m.title}</h3>
        <p className="mt-2 font-light leading-7 text-muted-foreground">{m.text}</p>
      </li>)}
    </ol>
  </section>;
}

function OrderOfService() {
  const c = useCmsContent("order-of-service");
  return <MemorialShell>
    <PageIntro eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle} />
    <div className="mx-auto max-w-2xl px-5 pb-28">
      <div className="reveal rounded-3xl border border-border bg-card p-8 text-center"><p className="eyebrow">{c.themeLabel}</p><p className="mt-4 font-script text-3xl leading-snug text-primary">{c.theme}</p></div>
      <div className="mt-6 flex justify-center"><Button variant="outline" size="sm" className="rounded-full" onClick={() => window.print()}><Printer />{c.printLabel}</Button></div>
      <div className="mt-16"><Timeline label={c.partLabel} title={c.liturgyTitle} items={c.movements} /></div>
      <AdinkraDivider symbol="gye-nyame" className="my-20" />
      <Timeline label={c.thanksgivingLabel} title={c.thanksgivingTitle} items={c.thanksgivingMovements} />
      <div className="reveal mt-20 rounded-3xl bg-muted p-8 text-center"><p className="eyebrow">{c.bookletLabel}</p><h3 className="mt-3 font-display text-2xl text-primary">{c.bookletTitle}</h3><p className="mt-3 font-light leading-7 text-muted-foreground">{c.bookletText}</p></div>
    </div>
  </MemorialShell>;
}
