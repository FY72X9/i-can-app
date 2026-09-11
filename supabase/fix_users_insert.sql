-- ============================================================
-- SUPERSEDED by schema_final.sql — do not run this file anymore, kept for history.
-- ============================================================
-- FIX: Allow INSERT into public.users for imported students
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Remove foreign key constraint to auth.users
--    This allows inserting users without needing a Supabase Auth account first
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- 2. Add default UUID generator for the id column
--    So we don't need to provide an id manually on every insert
ALTER TABLE public.users ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 3. Add INSERT policy (currently missing - this is why insert fails with error 42501)
CREATE POLICY "Allow insert users" ON public.users 
  FOR INSERT WITH CHECK (true);

-- 4. Add a broader UPDATE policy for sync/upsert operations
--    The existing policy only allows users to update their own profile (auth.uid() = id)
--    which blocks upsert from the admin/anon context
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Allow update users" ON public.users 
  FOR UPDATE USING (true) WITH CHECK (true);

-- 5. Verify the changes
SELECT 
  tablename, 
  policyname, 
  permissive, 
  cmd 
FROM pg_policies 
WHERE tablename = 'users';

