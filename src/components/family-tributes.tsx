import { useServerFn } from "@tanstack/react-start";
import { Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { AdinkraDivider } from "@/components/adinkra";
import { listFamilyTributes } from "@/lib/tributes.functions";

type Row = { id: string; author_name: string; relationship: string; message: string };

export function FamilyTributes() {
  const list = useServerFn(listFamilyTributes);
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => { list().then(setRows).catch(() => setRows([])); }, [list]);
  if (!rows.length) return null;
  return (
    <section className="mt-4">
      <AdinkraDivider symbol="gye-nyame" className="my-16" />
      <p className="eyebrow text-center">From Those Who Loved Her</p>
      <h2 className="mt-3 text-center font-display text-3xl text-primary md:text-4xl">Family Tributes</h2>
      <div className="mt-10 space-y-6">
        {rows.map((r) => (
          <article key={r.id} className="rounded-3xl border border-border bg-card/90 p-7 shadow-soft md:p-9">
            <Quote className="size-6 text-gold" strokeWidth={1.25} aria-hidden="true" />
            <p className="mt-4 whitespace-pre-line text-lg font-light leading-9 text-muted-foreground">{r.message}</p>
            <div className="mt-6 border-t border-border pt-4">
              <p className="font-display text-lg font-semibold text-primary">{r.author_name}</p>
              {r.relationship && <p className="font-label text-xs uppercase tracking-[.18em] text-secondary">{r.relationship}</p>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
