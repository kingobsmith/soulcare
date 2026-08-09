create table companion_messages (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  role text not null check (role in ('user', 'angel')),
  content text not null,
  created_at timestamptz not null default now()
);

create table care_team_members (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  role text not null check (role in ('therapist', 'doctor', 'pastor')),
  name text not null,
  email text not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create table progress_reports (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  summary text not null,
  recipients jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table companion_messages enable row level security;
alter table care_team_members enable row level security;
alter table progress_reports enable row level security;

create policy "companion_messages_owner" on companion_messages
  for all using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id);

create policy "care_team_owner" on care_team_members
  for all using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id);

create policy "progress_reports_owner_read" on progress_reports
  for select using (auth.uid() = user_id or public.is_admin());

create policy "referrals_admin_update" on referrals
  for update using (public.is_admin());

create policy "care_match_admin_update" on care_match_requests
  for update using (public.is_admin());
