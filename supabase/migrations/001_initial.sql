-- MailX initial schema for Supabase

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  gmail_connected boolean not null default false,
  gmail_email text,
  gmail_last_synced_at timestamptz,
  created_at timestamptz not null default now()
);

-- Emails (per user)
create table if not exists public.emails (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  source text not null default 'seed',
  email_id text unique,
  "from" text not null,
  subject text not null default 'No Subject',
  content text not null default '',
  category text check (category in ('urgent', 'positive', 'neutral', 'calendar', 'spam')),
  ai_summary text,
  saved_response text,
  created_at timestamptz not null default now()
);

create table if not exists public.gmail_tokens (
  user_id uuid primary key references auth.users (id) on delete cascade,
  access_token text,
  refresh_token text,
  scope text,
  token_type text,
  expiry_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.touch_gmail_tokens_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists gmail_tokens_updated_at on public.gmail_tokens;
create trigger gmail_tokens_updated_at
  before update on public.gmail_tokens
  for each row execute procedure public.touch_gmail_tokens_updated_at();

create index if not exists emails_user_id_idx on public.emails (user_id);
create index if not exists emails_created_at_idx on public.emails (created_at desc);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.emails enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Emails policies
create policy "Users can view own emails"
  on public.emails for select
  using (auth.uid() = user_id);

create policy "Users can insert own emails"
  on public.emails for insert
  with check (auth.uid() = user_id);

create policy "Users can update own emails"
  on public.emails for update
  using (auth.uid() = user_id);

create policy "Users can delete own emails"
  on public.emails for delete
  using (auth.uid() = user_id);

-- Allow future Gmail sync metadata updates via service role only.
