-- profiles table
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  phone text,
  balance numeric(12, 2) not null default 0.00,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- transactions table
create table if not exists public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text check (type in ('credit', 'debit')) not null,
  amount numeric(12, 2) not null,
  description text,
  recipient_account text,
  recipient_bank text,
  status text default 'pending',
  paystack_reference text,
  created_at timestamptz default now()
);

alter table public.transactions enable row level security;

create policy "Users can view own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- deduct_balance RPC
create or replace function public.deduct_balance(user_id uuid, amount numeric)
returns void as $$
begin
  perform id from public.profiles
  where id = user_id
  for update;

  update public.profiles
  set balance = balance - amount
  where id = user_id and balance >= amount;
  if not found then
    raise exception 'Insufficient balance';
  end if;
end;
$$ language plpgsql security definer;
