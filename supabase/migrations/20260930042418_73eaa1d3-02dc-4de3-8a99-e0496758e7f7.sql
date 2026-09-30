CREATE TYPE public.tribute_status AS ENUM ('pending','approved','rejected');

CREATE TABLE public.guest_tributes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(btrim(name)) BETWEEN 1 AND 100),
  is_anonymous boolean NOT NULL DEFAULT false,
  message text NOT NULL CHECK (char_length(btrim(message)) BETWEEN 1 AND 200),
  status public.tribute_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  submitted_ip_hash text
);
GRANT INSERT (name, is_anonymous, message, submitted_ip_hash) ON public.guest_tributes TO anon, authenticated;
GRANT SELECT (id, is_anonymous, message, status, created_at) ON public.guest_tributes TO anon;
GRANT SELECT, UPDATE ON public.guest_tributes TO authenticated;
GRANT ALL ON public.guest_tributes TO service_role;
ALTER TABLE public.guest_tributes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a tribute" ON public.guest_tributes FOR INSERT TO anon, authenticated WITH CHECK (status = 'pending');
CREATE POLICY "Approved tributes are public" ON public.guest_tributes FOR SELECT TO anon, authenticated USING (status = 'approved');
CREATE POLICY "Admins view all tributes" ON public.guest_tributes FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins moderate tributes" ON public.guest_tributes FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION private.guest_tribute_guard() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  NEW.status := 'pending';
  NEW.created_at := now();
  IF NEW.submitted_ip_hash IS NOT NULL AND (SELECT count(*) FROM public.guest_tributes WHERE submitted_ip_hash = NEW.submitted_ip_hash AND created_at > now() - interval '10 minutes') >= 3 THEN
    RAISE EXCEPTION 'Too many submissions, please try again later';
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER guest_tribute_guard BEFORE INSERT ON public.guest_tributes FOR EACH ROW EXECUTE FUNCTION private.guest_tribute_guard();

CREATE OR REPLACE FUNCTION public.get_approved_guest_tributes()
RETURNS TABLE (id uuid, display_name text, message text, created_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id, CASE WHEN is_anonymous THEN 'Anonymous' ELSE name END, message, created_at
  FROM public.guest_tributes WHERE status = 'approved' ORDER BY created_at ASC;
$$;
GRANT EXECUTE ON FUNCTION public.get_approved_guest_tributes() TO anon, authenticated;

CREATE TABLE public.family_tributes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  relationship text NOT NULL DEFAULT '',
  message text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.family_tributes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.family_tributes TO authenticated;
GRANT ALL ON public.family_tributes TO service_role;
ALTER TABLE public.family_tributes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Family tributes are public" ON public.family_tributes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins insert family tributes" ON public.family_tributes FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update family tributes" ON public.family_tributes FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete family tributes" ON public.family_tributes FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

INSERT INTO public.family_tributes (author_name, relationship, message, display_order) VALUES
('The Narh Family', 'Family', 'Mama Joyce was the heart of our family—a woman whose prayers, wisdom, and boundless love made every person feel at home. Her legacy will continue in every life she nurtured and every act of kindness she inspired.', 0);