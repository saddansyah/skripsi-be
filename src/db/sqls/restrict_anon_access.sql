DO $$ 
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', r.tablename);
    EXECUTE format('CREATE POLICY no_anon_access ON public.%I AS PERMISSIVE FOR ALL TO anon, authenticated USING (false);', r.tablename);
  END LOOP;
END $$;



-- Delete all policies
-- DO $$ 
-- DECLARE
--   r RECORD;
-- BEGIN
--   FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
--     EXECUTE format('DROP POLICY IF EXISTS no_anon_access ON public.%I;', r.tablename);
--   END LOOP;
-- END $$;