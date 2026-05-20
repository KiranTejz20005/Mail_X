# Supabase setup for MailX

## 1. Create a Supabase project

1. Go to [https://supabase.com](https://supabase.com) and create a project.
2. Wait for the database to finish provisioning.

## 2. Run the database migrations

1. Open **SQL Editor** in the Supabase dashboard.
2. Paste and run [`supabase/migrations/001_initial.sql`](supabase/migrations/001_initial.sql).
3. Paste and run [`supabase/migrations/002_rls_hardening.sql`](supabase/migrations/002_rls_hardening.sql) (locks down `gmail_tokens` for client access).

For policy details and verification queries, see [docs/SUPABASE_RLS.md](docs/SUPABASE_RLS.md).

## 3. Configure authentication

1. Go to **Authentication → Providers → Email**.
2. Enable Email provider.
3. For local testing, you may disable **Confirm email** under Email settings.

## 4. Copy API keys

From **Project Settings → API**:

| Key | Where to put it |
|-----|-----------------|
| Project URL | `SUPABASE_URL` in `.env` and `VITE_SUPABASE_URL` in `client/.env.local` |
| `anon` `public` | `VITE_SUPABASE_ANON_KEY` in `client/.env.local` |
| `service_role` `secret` | `SUPABASE_SERVICE_ROLE_KEY` in `.env` (server only, never commit) |

## 4.5 Configure Gmail sync

To enable real inbox syncing:

1. Create OAuth credentials in Google Cloud Console.
2. Add the redirect URI `http://localhost:5000/auth/gmail/callback`.
3. Put `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, and `CLIENT_URL` into `.env`.
4. Make sure Gmail API is enabled for the Google Cloud project.

## 5. Local environment files

Copy examples and fill in values (placeholders are already in `.env` and `client/.env.local` — replace each `your-...` value):

**Server (`Mail_X/.env`):** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NVIDIA_API_KEY`

**Client (`Mail_X/client/.env.local`):** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL`

```bash
cp .env.example .env
cp client/.env.example client/.env.local
```

## 6. Seed sample emails (after first signup)

1. Sign up in the app at `/signup`.
2. In Supabase go to **Authentication → Users** and copy your user **UUID**.
3. Open `supabase/seed.sql`, replace `YOUR_USER_ID_HERE` with that UUID, and run it in the SQL Editor.

## 7. Run the app

```bash
cd server
npm install
npm start

cd ../client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173), sign up, log in, then open **/content**.

If Gmail is connected, MailX will sync real messages into Supabase and show Gmail rows instead of demo seed rows.
