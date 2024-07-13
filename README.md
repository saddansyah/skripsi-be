# \<Project-Name\>
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

4. Execute the seeder using `bun run db:seed`
