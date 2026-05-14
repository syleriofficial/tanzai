-- Tanzai AI Supabase Schema V1
-- Run this in Supabase SQL Editor.

create table if not exists public.tanzai_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  preferred_language text default 'Hinglish / Hindi',
  tone text default 'clear, helpful, founder-style',
  goals text default 'Build Tanzai AI with Syleri Engine',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.tanzai_chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text default 'New Chat',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.tanzai_messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references public.tanzai_chats(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  image_url text,
  created_at timestamptz default now()
);

create table if not exists public.tanzai_memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  memory_type text default 'general',
  content text not null,
  importance int default 5 check (importance >= 1 and importance <= 10),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.tanzai_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  message_id uuid references public.tanzai_messages(id) on delete cascade,
  rating text not null check (rating in ('good', 'bad')),
  note text,
  created_at timestamptz default now()
);

alter table public.tanzai_profiles enable row level security;
alter table public.tanzai_chats enable row level security;
alter table public.tanzai_messages enable row level security;
alter table public.tanzai_memories enable row level security;
alter table public.tanzai_feedback enable row level security;

create policy "profiles_select_own" on public.tanzai_profiles
for select using (auth.uid() = id);

create policy "profiles_insert_own" on public.tanzai_profiles
for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.tanzai_profiles
for update using (auth.uid() = id);

create policy "chats_own_all" on public.tanzai_chats
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "messages_own_all" on public.tanzai_messages
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "memories_own_all" on public.tanzai_memories
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "feedback_own_all" on public.tanzai_feedback
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace function public.handle_new_tanzai_user()
returns trigger as $$
begin
  insert into public.tanzai_profiles (id, email, display_name)
  values (new.id, new.email, split_part(new.email, '@', 1))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created_tanzai on auth.users;

create trigger on_auth_user_created_tanzai
after insert on auth.users
for each row execute procedure public.handle_new_tanzai_user();
