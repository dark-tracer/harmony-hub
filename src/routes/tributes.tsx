import { createFileRoute } from "@tanstack/react-router";
import { Feather, Quote } from "lucide-react";
import { AdinkraDivider } from "@/components/adinkra";
import { MemorialShell, PageIntro } from "@/components/memorial-shell";
import { useCmsContentStatus } from "@/lib/cms-content";

export const Route = createFileRoute("/tributes")({
  head: () => ({ meta: [
    { title: "Tributes — Joyce Dedo Narh" },
    { name: "description", content: "Messages of love and treasured memories honoring Joyce Dedo Narh, affectionately known as Mama Joyce." },
    { property: "og:title", content: "Tributes — Joyce Dedo Narh" },
    { property: "og:description", content: "Words of remembrance celebrating Mama Joyce's life, love, faith, and enduring legacy." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: TributesPage,
});

function TributesPage() {
  const [content, loaded] = useCmsContentStatus("tributes");

  return (
    <MemorialShell>
      <PageIntro eyebrow={content.eyebrow} title={content.title} subtitle={content.subtitle} />
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <p className="mx-auto max-w-3xl text-center text-lg font-light leading-9 text-muted-foreground">{content.introduction}</p>

        {loaded && content.tributes.length > 0 ? (
          <div className="mt-14 columns-1 gap-6 md:columns-2">
            {content.tributes.map((tribute, index) => (
              <article key={`${tribute.author}-${index}`} className="reveal mb-6 break-inside-avoid rounded-3xl border border-border bg-card/90 p-7 shadow-soft backdrop-blur-sm md:p-9">
                <Quote className="size-7 text-gold" strokeWidth={1.25} aria-hidden="true" />
                <blockquote className="mt-5 whitespace-pre-line font-display text-xl leading-9 text-primary">{tribute.message}</blockquote>
                <div className="mt-7 border-t border-border pt-5">
                  <p className="font-display text-lg font-semibold text-primary">{tribute.author}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-label text-xs uppercase tracking-[.18em] text-secondary">
                    {tribute.relationship && <span>{tribute.relationship}</span>}
                    {tribute.date && <><span aria-hidden="true">•</span><time>{tribute.date}</time></>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : loaded ? (
          <div className="mx-auto mt-14 max-w-xl rounded-3xl border border-border bg-card/90 p-10 text-center shadow-soft">
            <Feather className="mx-auto size-8 text-gold" strokeWidth={1.25} />
            <p className="mt-5 font-display text-2xl text-primary">Tributes will be shared here.</p>
          </div>
        ) : null}

        <AdinkraDivider symbol="dwennimmen" className="mt-20" />
        <div className="mx-auto mt-10 max-w-3xl text-center">
          <p className="font-script text-4xl leading-relaxed text-primary md:text-5xl">{content.closingQuote}</p>
          <p className="mt-5 font-label text-xs uppercase tracking-[.3em] text-secondary">{content.closingLine}</p>
        </div>
      </section>
    </MemorialShell>
  );
}