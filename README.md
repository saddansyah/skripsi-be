# \<Project-Name\>
Back-end Repository

## Run migration with name argument
```js
NAME=init bun run db-migrate
```

## How to Safely Resetting Database
1. Delete the entire tables in `public` schema via Supabase GUI
```sql
do $$ declare
    r record;
begin
    for r in (select tablename from pg_tables where schemaname = 'public') loop
        execute 'drop table if exists ' || quote_ident(r.tablename) || ' cascade';
    end loop;
end $$;

```
2. Baseline the existing migration history `(0_init_prisma_db_pull)` using `APPLIED=0_init_prisma_db_pull bun run db:migrate:resolve` (to prevent existing schemas which we strongly related on like `auth.users` to be broken)

3. Apply the rest of migrations (except the applied one) using `bun run db:migrate`

4. Execute the seeder using `bun run db:seed`
