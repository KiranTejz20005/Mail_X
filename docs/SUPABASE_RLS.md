# Supabase Row Level Security (RLS) — MailX

MailX uses **two Supabase clients**:

| Client | Key | RLS |
|--------|-----|-----|
| React app | `VITE_SUPABASE_ANON_KEY` | Enforced — users only see their own data |
| Node server | `SUPABASE_SERVICE_ROLE_KEY` | Bypasses RLS — Gmail sync, AI updates, admin tasks |

Never put the service role key in the frontend.

## Tables and policies

### `profiles`
| Operation | Who | Policy |
|-----------|-----|--------|
| SELECT | Authenticated user | Own row (`auth.uid() = id`) |
| UPDATE | Authenticated user | Own row |
| INSERT | Authenticated user | Own row (migration `002`) |
| INSERT (signup) | Trigger | `handle_new_user()` security definer |

### `emails`
| Operation | Who | Policy |
|-----------|-----|--------|
| SELECT / INSERT / UPDATE / DELETE | Authenticated user | Own rows (`auth.uid() = user_id`) |
| All operations | Server (service role) | Bypasses RLS for sync and classification |

### `gmail_tokens`
| Operation | Who | Policy |
|-----------|-----|--------|
| Any | Browser / anon client | **Denied** (RLS on, no policies) |
| All | Server (service role) | Bypasses RLS for OAuth token storage |

## Apply migrations

1. Run [`supabase/migrations/001_initial.sql`](../supabase/migrations/001_initial.sql) if not already applied.
2. Run [`supabase/migrations/002_rls_hardening.sql`](../supabase/migrations/002_rls_hardening.sql) in the Supabase SQL Editor.

## Verify RLS is enabled

```sql
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in ('profiles', 'emails', 'gmail_tokens');
```

Expected: `rowsecurity = true` for all three.

## Verify policies

```sql
select tablename, policyname, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
```

## Test as authenticated user (SQL Editor)

Use the **anon** key in a test client, or impersonate:

```sql
-- Should return only your emails when using JWT for user A
select count(*) from public.emails;
```

From the app: sign in, open `/content`, confirm you only see your inbox.

## Test gmail_tokens isolation

Authenticated client must **not** read tokens:

```javascript
// In browser console (should fail or return empty — not used in app)
const { data, error } = await supabase.from('gmail_tokens').select('*');
// expect error or no access under RLS
```

Gmail connect/sync must continue to work via the **server** only.

## Production checklist

- [ ] `002_rls_hardening.sql` applied on production project
- [ ] Service role key only in server env (Render/Vercel backend)
- [ ] Anon key only in client env
- [ ] Email confirmation enabled if required for your launch
- [ ] Rotate keys if any were ever committed to git
