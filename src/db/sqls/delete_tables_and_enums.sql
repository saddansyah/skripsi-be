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