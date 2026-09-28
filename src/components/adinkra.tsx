type Symbol = "sankofa" | "gye-nyame" | "dwennimmen";

function Glyph({ symbol }: { symbol: Symbol }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (symbol === "sankofa")
    return <svg viewBox="0 0 48 48" className="size-9" aria-hidden><path {...common} d="M24 42 C10 32 6 24 8 16 c2-6 9-8 12-3 c2 3 0 7-4 6 M24 42 C38 32 42 24 40 16 c-2-6-9-8-12-3 c-2 3 0 7 4 6 M24 42 V20 M18 8 c3 3 9 3 12 0" /></svg>;
  if (symbol === "dwennimmen")
    return <svg viewBox="0 0 48 48" className="size-9" aria-hidden><path {...common} d="M24 24 c0-6-6-10-10-6 c-3 3 0 7 3 5 M24 24 c6 0 10-6 6-10 c-3-3-7 0-5 3 M24 24 c0 6 6 10 10 6 c3-3 0-7-3-5 M24 24 c-6 0-10 6-6 10 c3 3 7 0 5-3" /><circle cx="24" cy="24" r="2" fill="currentColor" /></svg>;
  return <svg viewBox="0 0 48 48" className="size-9" aria-hidden><path {...common} d="M24 6 C14 6 10 14 12 22 c1 5 6 7 6 12 c0 4-3 6-3 8 h18 c0-2-3-4-3-8 c0-5 5-7 6-12 C38 14 34 6 24 6 Z M18 18 h-6 M30 18 h6 M18 28 h-5 M30 28 h5 M24 10 v28" /></svg>;
}

export function AdinkraDivider({ symbol = "gye-nyame", tone = "gold", className = "" }: { symbol?: Symbol; tone?: "gold" | "green"; className?: string }) {
  const color = tone === "gold" ? "text-gold" : "text-primary";
  return (
    <div className={`mx-auto flex max-w-xs items-center justify-center gap-4 opacity-50 ${color} ${className}`} role="separator">
      <span className="h-px flex-1 bg-current" /><span className="size-1 rotate-45 bg-current" />
      <Glyph symbol={symbol} />
      <span className="size-1 rotate-45 bg-current" /><span className="h-px flex-1 bg-current" />
    </div>
  );
}
