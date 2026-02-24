-- Create profiles table
create table if not exists profiles (
  id uuid references auth.users not null primary key,
  name text,
  financial_score integer,
  risk_tolerance text,
  wealth_grid jsonb,
  answers jsonb,
  is_onboarded boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create ledger_entries table
create table if not exists ledger_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  type text not null, -- 'income' or 'expense'
  amount numeric not null,
  bucket text, -- 'daily', 'emergency', 'investment', 'growth'
  category text,
  note text,
  date timestamptz default now(),
  created_at timestamptz default now()
);

-- Enable RLS
alter table profiles enable row level security;
alter table ledger_entries enable row level security;

-- Policies for profiles
create policy "Users can view own profile" on profiles 
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles 
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on profiles 
  for insert with check (auth.uid() = id);

-- Policies for ledger_entries
create policy "Users can view own ledger" on ledger_entries 
  for select using (auth.uid() = user_id);

create policy "Users can insert own ledger" on ledger_entries 
  for insert with check (auth.uid() = user_id);

create policy "Users can update own ledger" on ledger_entries 
  for update using (auth.uid() = user_id);

create policy "Users can delete own ledger" on ledger_entries 
  for delete using (auth.uid() = user_id);

-- Grant permissions
grant select, insert, update, delete on profiles to authenticated;
grant select, insert, update, delete on ledger_entries to authenticated;
