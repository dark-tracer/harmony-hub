import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, MapPin } from "lucide-react";
import { Fragment } from "react";
import { MemorialShell, PageIntro } from "@/components/memorial-shell";
import { AdinkraDivider } from "@/components/adinkra";
import { portrait } from "@/lib/memorial-data";
import { useCmsContent } from "@/lib/cms-content";
import { FamilyTributes } from "@/components/family-tributes";

export const Route = createFileRoute("/obituary")({ head: () => ({ meta: [
  { title: "Obituary — Joyce Dedo Narh" }, { name: "description", content: "The life story and enduring legacy of Joyce Dedo Narh, Mama Joyce." },
  { property: "og:title", content: "Obituary — Joyce Dedo Narh" }, { property: "og:description", content: "A life well lived, grounded in faith, family, and grace." }, { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" }, { property: "og:image", content: portrait }, { name: "twitter:image", content: portrait },
]}), component: Obituary });

const symbols = ["sankofa", "gye-nyame", "dwennimmen"] as const;

function Obituary() {
  const c = useCmsContent("obituary");
  return <MemorialShell>
    <PageIntro eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle} />
    <article className="mx-auto max-w-[680px] px-5 pb-28">
      <div className="reveal text-center">
        <img src={c.portraitUrl} alt={c.portraitAlt} className="mx-auto aspect-[4/5] w-64 rounded-3xl object-cover shadow-soft" />
        <h2 className="mt-10 font-display text-4xl text-primary">{c.name}</h2>
        <p className="mt-2 font-script text-3xl text-secondary">{c.nickname}</p>
        <div className="mt-6 flex flex-col items-center gap-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-2"><CalendarDays size={16} className="text-gold" />{c.sunrise} — {c.sunset}</p>
          <p className="flex items-center gap-2"><MapPin size={16} className="text-gold" />{c.locations}</p>
        </div>
      </div>
      {c.chapters.map((ch, idx) => <Fragment key={idx}>
        <AdinkraDivider symbol={symbols[idx % 3]!} className="my-16" />
        <section className="reveal">
          <p className="eyebrow">Chapter {ch.number}</p>
          <h2 className="mt-3 font-display text-3xl text-primary md:text-4xl">{ch.title}</h2>
          <div className="mt-8 space-y-6 text-lg font-light leading-9 text-muted-foreground">
            {ch.paragraphs.map((p, i) => <p key={i} className={idx === 0 && i === 0 ? "first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-7xl first-letter:leading-[.8] first-letter:text-primary" : ""}>{p}</p>)}
          </div>
        </section>
        {idx === 0 && <blockquote className="reveal my-16 text-center"><p className="font-script text-4xl leading-snug text-primary md:text-5xl">{c.quote}</p><footer className="mt-5 font-label text-xs uppercase tracking-[.3em] text-secondary">{c.quoteSource}</footer></blockquote>}
      </Fragment>)}
      <p className="reveal mt-16 text-center font-display text-xl italic text-primary">{c.devotion}</p>
      <FamilyTributes />
    </article>
  </MemorialShell>;
}
