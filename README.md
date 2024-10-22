# Skripsi-BE
Back-end Repository

## Run migration with name argument
```js
NAME=init bun run db-migrate
```

## How to Safely Resetting Database
First of all, dont use `bunx prisma migrate reset` to reset database, since it would bring catasthrope out of your supabase db. Instead, you can follow these steps below.

1. Delete the entire tables and enums in `public` schema via Supabase GUI
    ```sql
    -- Delete Tables in Public Schema

    do $$ declare
        r record;
    begin
        for r in (select tablename from pg_tables where schemaname = 'public') loop
            execute 'drop table if exists ' || quote_ident(r.tablename) || ' cascade';
        end loop;
    end $$;

    -- Delete Enums in Public Schema

    DO $$
    declare
        r RECORD;
    begin
        for r in (select t.typname as type_name
                from pg_catalog.pg_type t
                join pg_catalog.pg_namespace n ON n.oid = t.typnamespace
                where t.typtype = 'e' and n.nspname = 'public'
                order by t.typname)
        loop
            execute 'DROP TYPE IF EXISTS public.' || quote_ident(r.type_name) || ' CASCADE';
        end loop;
    end $$;
    ```
2. Baseline the existing migration history `(0_init_prisma_db_pull)` using `APPLIED=0_init_prisma_db_pull bun run db:migrate:resolve` (to prevent existing schemas which we strongly related on like `auth.users` to be broken)

3. Apply the rest of migrations (except the applied one) using `bun run db:migrate:apply` 
   1. (Optional) You can also build a new one (dont forget to delete the remaining migrations first) using `NAME=<migration-name> bun run db:migrate`

4. Execute the seeder using `bun run db:seed`
   
5. (Recommended) Restrict all supabase client access without `service_role` key using RLS Policy
   ```sql

    -- Add Policy
    
    DO $$ 
    DECLARE
        r RECORD;
    BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
            EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', r.tablename);
            EXECUTE format('CREATE POLICY no_anon_access ON public.%I AS PERMISSIVE FOR ALL TO anon, authenticated USING (false);', r.tablename);
        END LOOP;
    END $$;

    -- Delete Policy

    DO $$ 
    DECLARE
        r RECORD;
    BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
            EXECUTE format('DROP POLICY IF EXISTS no_anon_access ON public.%I;', r.tablename);
        END LOOP;
    END $$;

   ```
