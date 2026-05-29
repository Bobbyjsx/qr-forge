This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Local Setup

### 1. Requirements
- **pnpm** (Package Manager)
- **Docker Desktop** (Running)
- **Supabase CLI** (`pnpm add -g supabase`)

---

### 2. Choose Your Backend Strategy

#### Option A: New Local Supabase (Recommended for Fresh Starts)
Initialize a new Supabase environment specifically for this project:

```bash
# Initialize and start Supabase
pnpm supabase init
pnpm supabase start
```

This will output your `API URL`, `anon key`, and `service_role key`. Copy these into your `.env.local`.

#### Option B: Connect to Existing Stack (e.g., `backend`)
If you already have a Supabase stack running in Docker (like a project named `backend`):

```bash
# Start your existing containers
docker start supabase_db_backend supabase_auth_backend supabase_rest_backend \
             supabase_realtime_backend supabase_storage_backend supabase_kong_backend \
             supabase_studio_backend supabase_inbucket_backend supabase_analytics_backend \
             supabase_vector_backend supabase_pg_meta_backend

# Get the keys for your existing stack
cd path/to/backend/project && pnpm supabase status
```

---

### 3. Environment Configuration
Create a `.env.local` file in the root directory using the keys from Step 2:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Database Migration
Apply the QR Forge schema to your chosen Supabase instance:

**If using Option A (Supabase CLI):**
```bash
pnpm supabase migration up
```

**If using Option B (Manual psql):**
```bash
export PGPASSWORD=postgres
psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -f supabase/migrations/20260529094129_initial_schema.sql
```

### 5. Application Launch
```bash
pnpm install
pnpm dev
```

### 6. Development Access
- **App:** [http://localhost:3000](http://localhost:3000)
- **Supabase Studio:** [http://127.0.0.1:54323](http://127.0.0.1:54323)
- **Mailpit:** [http://127.0.0.1:54324](http://127.0.0.1:54324)
