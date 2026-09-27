import { Link } from "@tanstack/react-router";
import { Menu, UserRound, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useCmsContent } from "@/lib/cms-content";

export const navItems = [
  { to: "/", label: "Home" },
  { to: "/obituary", label: "Obituary" },
  { to: "/service-details", label: "Service Details" },
  { to: "/order-of-service", label: "Order of Service" },
  { to: "/photo-gallery", label: "Photo Gallery" },
] as const;

export function MemorialShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const content = useCmsContent("shared");
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-12">
          <Link to="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
            <span className="grid size-10 place-items-center rounded-full bg-muted text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">✦</span>
            <span className="flex flex-col">
              <span className="font-display text-lg font-semibold leading-tight text-primary">{content.name}</span>
              <span className="font-label text-[10px] font-semibold uppercase tracking-[.16em] text-secondary">{content.descriptor}</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} activeOptions={{ exact: item.to === "/" }} className="rounded-md px-3 py-2 font-label text-sm font-semibold text-muted-foreground transition-colors hover:text-primary" activeProps={{ className: "bg-primary text-primary-foreground hover:text-primary-foreground" }}>{content.navigation[navItems.indexOf(item)] ?? item.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/admin" aria-label="Open memorial editor" className="hidden size-8 place-items-center rounded-full bg-primary text-primary-foreground md:grid"><UserRound size={16} /></Link>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((value) => !value)}>{open ? <X /> : <Menu />}</Button>
          </div>
        </div>
        {open && <nav className="border-t border-border bg-card px-5 py-3 md:hidden">{navItems.map((item, index) => <Link key={item.to} to={item.to} className="block rounded-md px-3 py-3 font-label text-sm font-semibold text-muted-foreground" activeProps={{ className: "bg-primary text-primary-foreground" }} onClick={() => setOpen(false)}>{content.navigation[index] ?? item.label}</Link>)}</nav>}
      </header>
      <main className="pt-20">{children}</main>
      <footer className="bg-primary px-5 py-12 text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-8 text-center md:grid-cols-[1fr_auto_1fr] md:items-center md:text-left">
          <div><p className="font-display text-xl">{content.footerTitle}</p><p className="mt-1 font-label text-xs uppercase tracking-[.14em] text-primary-soft">{content.footerYears}</p></div>
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 font-label text-xs">{navItems.map((item, index) => <Link key={item.to} to={item.to} className="text-primary-soft hover:text-primary-foreground">{content.navigation[index] ?? item.label}</Link>)}</nav>
          <p className="font-body text-sm italic text-primary-soft md:text-right">{content.footerMessage}<br />{content.footerClosing}</p>
        </div>
      </footer>
    </div>
  );
}

export function PageIntro({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return <section className="memorial-intro"><div className="mx-auto max-w-4xl px-5 text-center"><p className="eyebrow">✦ {eyebrow} ✦</p><h1 className="mt-4 font-display text-4xl font-semibold text-primary md:text-6xl">{title}</h1><p className="mx-auto mt-5 max-w-2xl font-body text-lg italic text-muted-foreground">{subtitle}</p><div className="ornament">◆</div></div></section>;
}
