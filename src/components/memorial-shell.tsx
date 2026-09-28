import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AdinkraDivider } from "@/components/adinkra";
import { useCmsContent } from "@/lib/cms-content";

export const navItems = [
  { to: "/", label: "Home" },
  { to: "/obituary", label: "Obituary" },
  { to: "/service-details", label: "Service Details" },
  { to: "/order-of-service", label: "Order of Service" },
  { to: "/photo-gallery", label: "Gallery" },
] as const;

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.is-visible)");
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("is-visible")); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } }), { threshold: 0.12 });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  });
}

const linkCls = "relative px-1 py-2 font-label text-[13px] tracking-wide text-muted-foreground transition-colors hover:text-primary after:absolute after:inset-x-1 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform";

export function MemorialShell({ children, overlayHeader = false }: { children: ReactNode; overlayHeader?: boolean }) {
  const [open, setOpen] = useState(false);
  const content = useCmsContent("shared");
  useReveal();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-card/75 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 py-3 lg:px-10">
          <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <span className="grid size-11 place-items-center rounded-full border border-gold/50 font-display text-sm font-semibold tracking-widest text-primary">JDN</span>
            <span className="hidden flex-col sm:flex">
              <span className="font-display text-base font-semibold leading-tight text-primary">{content.name}</span>
              <span className="font-label text-[10px] uppercase tracking-[.25em] text-secondary">{content.descriptor}</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-7 md:flex">
            {navItems.map((item, i) => (
              <Link key={item.to} to={item.to} activeOptions={{ exact: item.to === "/" }} className={linkCls} activeProps={{ className: "text-primary after:scale-x-100" }}>{content.navigation[i] ?? item.label}</Link>
            ))}
          </nav>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((v) => !v)}>{open ? <X /> : <Menu />}</Button>
        </div>
        {open && <nav className="border-t border-border bg-card px-5 py-4 md:hidden">{navItems.map((item, i) => <Link key={item.to} to={item.to} activeOptions={{ exact: item.to === "/" }} className="block border-b border-border/60 py-4 font-display text-lg text-muted-foreground last:border-0" activeProps={{ className: "text-primary" }} onClick={() => setOpen(false)}>{content.navigation[i] ?? item.label}</Link>)}</nav>}
      </header>
      <main className={overlayHeader ? "-mt-18" : ""}>{children}</main>
      <footer className="botanical border-t border-border bg-card px-5 py-16 text-center">
        <div className="relative mx-auto max-w-3xl">
          <p className="font-display text-2xl text-primary">{content.footerTitle}</p>
          <p className="mt-2 font-label text-xs uppercase tracking-[.3em] text-secondary">{content.footerYears}</p>
          <AdinkraDivider symbol="sankofa" className="my-8" />
          <p className="font-script text-3xl text-primary">{content.footerMessage}</p>
          <p className="mt-3 font-label text-xs uppercase tracking-[.3em] text-muted-foreground">{content.footerClosing}</p>
          <nav className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 font-label text-xs text-muted-foreground">{navItems.map((item, i) => <Link key={item.to} to={item.to} className="hover:text-primary">{content.navigation[i] ?? item.label}</Link>)}</nav>
        </div>
      </footer>
    </div>
  );
}

export function PageIntro({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return <section className="memorial-intro"><div className="relative mx-auto max-w-4xl px-5 text-center"><p className="eyebrow">{eyebrow}</p><h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-primary md:text-6xl">{title}</h1><p className="mx-auto mt-6 max-w-2xl font-body text-lg font-light text-muted-foreground">{subtitle}</p><AdinkraDivider className="mt-10" /></div></section>;
}
