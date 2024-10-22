create policy "Individual User Access"
on storage.objects for all
to authenticated
using ( (select auth.uid()::text) = owner_id::text );

CREATE POLICY "Insert by Owner" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid()::text = owner_id::text);

CREATE POLICY "Update by Owner" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (auth.uid()::text = owner_id::text);

CREATE POLICY "Delete by Owner" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (auth.uid()::text = owner_id::text);
