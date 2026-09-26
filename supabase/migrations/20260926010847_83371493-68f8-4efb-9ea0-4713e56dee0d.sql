CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

DROP POLICY "Administrators can create memorial content" ON public.site_content;
DROP POLICY "Administrators can update memorial content" ON public.site_content;
DROP POLICY "Administrators can delete memorial content" ON public.site_content;

CREATE POLICY "Administrators can create memorial content"
ON public.site_content FOR INSERT TO authenticated
WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Administrators can update memorial content"
ON public.site_content FOR UPDATE TO authenticated
USING (private.has_role(auth.uid(), 'admin'))
WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Administrators can delete memorial content"
ON public.site_content FOR DELETE TO authenticated
USING (private.has_role(auth.uid(), 'admin'));

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated, service_role;
DROP FUNCTION public.has_role(uuid, public.app_role);