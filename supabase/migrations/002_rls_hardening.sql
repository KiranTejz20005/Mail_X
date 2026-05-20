-- MailX RLS hardening (run after 001_initial.sql)
-- Secures gmail_tokens and documents service-role vs client access patterns.

-- ---------------------------------------------------------------------------
-- gmail_tokens: server-only (service role bypasses RLS; clients get no access)
-- ---------------------------------------------------------------------------
alter table public.gmail_tokens enable row level security;

-- No policies for authenticated/anon roles => clients cannot read or write tokens.
-- The Node server uses SUPABASE_SERVICE_ROLE_KEY and bypasses RLS for Gmail sync.

-- ---------------------------------------------------------------------------
-- profiles: allow insert for own row (signup trigger uses security definer)
-- ---------------------------------------------------------------------------
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- emails: optional service inserts use service role; users keep existing policies
-- ---------------------------------------------------------------------------
-- Gmail sync and classification run server-side with service role.
-- Client reads/writes own rows via existing select/insert/update/delete policies.

-- ---------------------------------------------------------------------------
-- Verification queries (run manually in SQL Editor after migration)
-- ---------------------------------------------------------------------------
-- select tablename, rowsecurity from pg_tables where schemaname = 'public';
-- select * from pg_policies where schemaname = 'public' order by tablename, policyname;
