CREATE TABLE public.tribute_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (length(trim(name)) between 1 and 100),
  category_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX tribute_categories_name_lower_idx ON public.tribute_categories (lower(trim(name)));
GRANT SELECT ON public.tribute_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tribute_categories TO authenticated;
GRANT ALL ON public.tribute_categories TO service_role;
ALTER TABLE public.tribute_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tribute categories are public" ON public.tribute_categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins insert categories" ON public.tribute_categories FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update categories" ON public.tribute_categories FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete categories" ON public.tribute_categories FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

INSERT INTO public.tribute_categories (name, category_order) VALUES ('Family', 0);

ALTER TABLE public.family_tributes ADD COLUMN category_id uuid REFERENCES public.tribute_categories(id) ON DELETE RESTRICT;
ALTER TABLE public.family_tributes ADD COLUMN tribute_order integer NOT NULL DEFAULT 0;
UPDATE public.family_tributes SET category_id = (SELECT id FROM public.tribute_categories WHERE name = 'Family'), tribute_order = display_order WHERE category_id IS NULL;
ALTER TABLE public.family_tributes ALTER COLUMN category_id SET NOT NULL;
CREATE INDEX family_tributes_category_idx ON public.family_tributes (category_id, tribute_order);