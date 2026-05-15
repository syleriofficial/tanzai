-- Run this in Supabase SQL Editor

create table if not exists memory_notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  content text not null,
  importance int default 5 check (importance >= 1 and importance <= 10),
  memory_type text default 'general',
  created_at timestamptz default now()
);

alter table memory_notes enable row level security;

drop policy if exists "users can view own memory notes" on memory_notes;
drop policy if exists "users can insert own memory notes" on memory_notes;
drop policy if exists "users can delete own memory notes" on memory_notes;
drop policy if exists "users can update own memory notes" on memory_notes;

create policy "users can view own memory notes"
on memory_notes
for select
using (auth.uid() = user_id);

create policy "users can insert own memory notes"
on memory_notes
for insert
with check (auth.uid() = user_id);

create policy "users can update own memory notes"
on memory_notes
for update
using (auth.uid() = user_id);

create policy "users can delete own memory notes"
on memory_notes
for delete
using (auth.uid() = user_id);
