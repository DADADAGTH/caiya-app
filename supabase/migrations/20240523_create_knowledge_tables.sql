-- Create AI Cards table
create table if not exists public.ai_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  concept text,
  content text not null,
  action text,
  tags text[] default '{}',
  is_ai_generated boolean default true,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.ai_cards enable row level security;

-- Policies
create policy "Users can view their own AI cards"
  on public.ai_cards for select
  using (auth.uid() = user_id);

create policy "Users can insert their own AI cards"
  on public.ai_cards for insert
  with check (auth.uid() = user_id);

-- Create Read History table
create table if not exists public.read_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  card_id text not null, -- Can be UUID (for AI cards) or string ID (for static cards)
  read_at timestamp with time zone default now(),
  unique(user_id, card_id) -- Prevent duplicate reads
);

-- Enable RLS
alter table public.read_history enable row level security;

-- Policies
create policy "Users can view their own read history"
  on public.read_history for select
  using (auth.uid() = user_id);

create policy "Users can insert/update their own read history"
  on public.read_history for insert
  with check (auth.uid() = user_id);
