# Capsule Fintech Template

A production-ready fintech starter built with Next.js 15, Supabase, and Paystack.

## Features

- ✅ Supabase authentication (login, signup, session management)
- ✅ User profiles with balance tracking
- ✅ Send money via Paystack transfer API
- ✅ Full transaction history
- ✅ Row-level security on all tables
- ✅ Auto-create user profile on signup

## Stack

- **Framework**: Next.js 15 (App Router)
- **Auth & DB**: Supabase
- **Payments**: Paystack
- **UI**: Tailwind CSS + shadcn/ui
- **Language**: TypeScript

## Setup

1. Clone and install:
```bash
npm install
```

2. Copy env file:
```bash
cp .env.local.example .env.local
```

3. Fill in your `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
PAYSTACK_SECRET_KEY=sk_live_...
```

4. Run the SQL in `supabase/migrations/001_fintech_schema.sql` in your Supabase SQL editor.

5. Start:
```bash
npm run dev
```

## Pages

| Route | Description |
|---|---|
| `/login` | Sign in |
| `/signup` | Create account |
| `/dashboard` | Balance + recent transactions |
| `/send` | Send money |
| `/transactions` | Full transaction history |
| `/profile` | Account details |
