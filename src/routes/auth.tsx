import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Memorial Editor Sign In" }, { name: "description", content: "Private administrator sign in for the Joyce Dedo Narh memorial website." }, { property: "og:title", content: "Memorial Editor Sign In" }, { property: "og:description", content: "Private memorial website administration." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent) { event.preventDefault(); setBusy(true); setError(""); const { error: signInError } = await supabase.auth.signInWithPassword({ email, password }); setBusy(false); if (signInError) { setError("The email or password is incorrect."); return; } await navigate({ to: "/admin" }); }
  return <main className="grid min-h-screen place-items-center bg-muted px-5"><form onSubmit={submit} className="w-full max-w-md border border-border bg-card p-8 shadow-xl"><span className="mx-auto grid size-12 place-items-center rounded-full bg-primary text-primary-foreground"><LockKeyhole /></span><p className="mt-5 text-center eyebrow">Private Administration</p><h1 className="mt-2 text-center font-display text-3xl text-primary">Memorial Editor</h1><p className="mt-2 text-center font-body text-sm text-muted-foreground">Sign in to update the memorial website.</p><div className="mt-8 space-y-5"><div><Label htmlFor="email">Email address</Label><Input id="email" type="email" autoComplete="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="mt-2"/></div><div><Label htmlFor="password">Password</Label><Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e)=>setPassword(e.target.value)} required className="mt-2"/></div>{error&&<p className="text-sm text-destructive" role="alert">{error}</p>}<Button className="w-full" type="submit" disabled={busy}>{busy?"Signing in…":"Sign in"}</Button><Button className="w-full" type="button" variant="ghost" onClick={()=>navigate({to:"/"})}>Return to memorial</Button></div></form></main>;
}
