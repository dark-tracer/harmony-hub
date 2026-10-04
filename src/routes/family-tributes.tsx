import { createFileRoute } from "@tanstack/react-router";
import { FamilyTributes } from "@/components/family-tributes";
import { MemorialShell, PageIntro } from "@/components/memorial-shell";
import { useCmsContent } from "@/lib/cms-content";
import { portrait } from "@/lib/memorial-data";

export const Route = createFileRoute("/family-tributes")({
  head: () => ({ meta: [
    { title: "Family Tributes — Joyce Dedo Narh" },
    { name: "description", content: "Tributes from the family of Joyce Dedo Narh, affectionately known as Mama Joyce." },
    { property: "og:title", content: "Family Tributes — Joyce Dedo Narh" },
    { property: "og:description", content: "Words of love and remembrance from those who knew Mama Joyce best." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { property: "og:image", content: portrait },
    { name: "twitter:image", content: portrait },
  ] }),
  component: FamilyTributesPage,
});

function FamilyTributesPage() {
  const c = useCmsContent("family-tributes");
  return (
    <MemorialShell>
      <PageIntro eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle} />
      <article className="mx-auto max-w-[680px] px-5 pb-28">
        <FamilyTributes heading={false} />
      </article>
    </MemorialShell>
  );
}
