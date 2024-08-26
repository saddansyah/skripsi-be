create policy "Individual user Access"
on storage.objects for all
to authenticated
using ( (select auth.uid()::text) = owner_id::text );
