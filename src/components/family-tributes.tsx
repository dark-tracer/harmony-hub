import { useServerFn } from "@tanstack/react-start";
import { Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { AdinkraDivider } from "@/components/adinkra";
import { listFamilyTributes } from "@/lib/tributes.functions";

type Group = { id: string; name: string; tributes: { id: string; author_name: string; relationship: string; message: string }[] };
const symbols = ["gye-nyame", "sankofa", "dwennimmen"] as const;

export function FamilyTributes({ heading = true }: { heading?: boolean }) {
  const list = useServerFn(listFamilyTributes);
  const [groups, setGroups] = useState<Group[]>([]);
  useEffect(() => { list().then(setGroups).catch(() => setGroups([])); }, [list]);
  if (!groups.length) return null;
  return (
    <section className="mt-4">
      {heading && <>
        <AdinkraDivider symbol="gye-nyame" className="my-16" />
        <p className="eyebrow text-center">From Those Who Loved Her</p>
        <h2 className="mt-3 text-center font-display text-3xl text-primary md:text-4xl">Family Tributes</h2>
      </>}
      {groups.map((g, gi) => (
        <div key={g.id}>
          {gi > 0 && <AdinkraDivider symbol={symbols[gi % 3]!} className="my-14" />}
          <h3 className="mt-10 text-center font-display text-2xl text-primary">{g.name}</h3>
          <div className="mt-8 space-y-6">
            {g.tributes.map((r) => (
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
        </div>
      ))}
    </section>
  );
}
