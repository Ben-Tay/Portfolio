-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New query).
-- Enables the portfolio (a static GitHub Pages site) to read content directly
-- with the anon key, and lets signed-in admins write content directly.

-- Public read: anyone (anon) can SELECT content
create policy "content public read" on content
  for select to anon, authenticated
  using (true);

-- Admin write: only authenticated users can insert/update
create policy "content admin write" on content
  for insert to authenticated
  with check (true);

create policy "content admin update" on content
  for update to authenticated
  using (true)
  with check (true);

-- Make sure RLS is enabled (idempotent)
alter table content enable row level security;
