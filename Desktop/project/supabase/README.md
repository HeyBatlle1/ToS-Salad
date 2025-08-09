### Supabase configuration and migrations

This project uses Supabase for Postgres, Auth, and RLS. Follow these steps to configure API keys and run migrations.

#### 1) Get your keys and references
- **Project URL**: Dashboard → Settings → General → URL
- **Project Ref**: Dashboard → Settings → General → Project Reference (e.g., `abcd1234`)
- **Anon key**: Dashboard → Project Settings → API → Project API keys → `anon` (public)
- **Service role key**: Dashboard → Project Settings → API → Project API keys → `service_role` (server-only)
- **JWT secret**: Dashboard → Project Settings → API → JWT Settings → `JWT secret`
- **DB URL**: Dashboard → Settings → Database → Connection string → `URI`
- **Access token (CLI)**: Account → Tokens (`https://supabase.com/dashboard/account/tokens`)

#### 2) Configure environment variables
Create a `.env.local` at project root (for development) and add:

```
NEXT_PUBLIC_SUPABASE_URL=YOUR_PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
SUPABASE_JWT_SECRET=YOUR_JWT_SECRET
SUPABASE_DB_URL=YOUR_DB_URL
SUPABASE_ACCESS_TOKEN=YOUR_CLI_ACCESS_TOKEN
```

Do not commit real secrets. Use the provided `env.example` as a template.

#### 3) Configure Supabase CLI
Edit `supabase/config.toml` and set:
```
project_id = "YOUR_PROJECT_REF"
[auth]
jwt_secret = "YOUR_LOCAL_JWT_SECRET"
```

Install CLI (macOS):
```
brew install supabase/tap/supabase
```

#### 4) Link your remote project and push migrations
```
export SUPABASE_ACCESS_TOKEN=YOUR_CLI_ACCESS_TOKEN
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

This will apply `supabase/migrations/001_initial_schema.sql` to your hosted database.

#### 5) (Optional) Run locally
Start local stack:
```
supabase start
```
Apply migrations locally (auto-applied on start; to re-apply from scratch):
```
supabase db reset
```

#### Notes on security
- Only expose `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in browsers.
- Keep `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`, and `SUPABASE_DB_URL` server-only.
- RLS is enabled for all tables; ensure all server writes that bypass client RLS use the service role key from a trusted backend.


