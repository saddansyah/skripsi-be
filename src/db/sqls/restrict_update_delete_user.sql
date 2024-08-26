CREATE POLICY "restrict_update" 
ON auth.users 
AS PERMISSIVE
FOR UPDATE 
TO anon, authenticated
USING (false);

CREATE POLICY "restrict_delete" 
ON auth.users 
AS PERMISSIVE
FOR DELETE 
TO anon, authenticated
USING (false);

-- DROP POLICY IF EXISTS restrict_update ON auth.users;

-- DROP POLICY IF EXISTS restrict_delete ON auth.users;

