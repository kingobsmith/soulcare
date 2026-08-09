-- SoulCares.co — Initial schema
-- Run this in Supabase SQL editor, or via `supabase db push` after linking
-- your project. Safe to run once on a fresh project.

-- ---------- Extensions ----------
create extension if not exists "uuid-ossp";

-- ---------- Enums ----------
create type user_role as enum ('member', 'provider', 'affiliate', 'admin');
create type verification_status as enum (
  'submitted', 'under_review', 'needs_information', 'verified', 'rejected', 'suspended'
);
create type care_match_status as enum ('draft', 'submitted', 'reviewing', 'matched', 'closed');
create type referral_status as enum ('offered', 'accepted', 'declined', 'booked', 'completed', 'cancelled');
create type payment_kind as enum ('membership', 'session', 'provider_network');

-- ---------- profiles ----------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'member',
  full_name text,
  email text,
  phone text,
  created_at timestamptz not null default now()
);

-- Automatically create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- member_profiles ----------
create table member_profiles (
  user_id uuid primary key references profiles(id) on delete cascade,
  state_or_region text,
  preferences jsonb default '{}'::jsonb,
  consent_version text,
  crisis_notice_acknowledged_at timestamptz
);

-- ---------- provider_profiles ----------
create table provider_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique references profiles(id) on delete set null,
  legal_name text,
  public_name text,
  credential_type text,
  license_number_encrypted text,
  license_state text,
  specialties text[] default '{}',
  languages text[] default '{}',
  faith_preferences text[] default '{}',
  modalities text[] default '{}',
  availability jsonb default '{}'::jsonb,
  verification_status verification_status not null default 'submitted',
  stripe_connect_account_id text,
  public_bio text,
  created_at timestamptz not null default now()
);

-- ---------- provider_documents ----------
create table provider_documents (
  id uuid primary key default uuid_generate_v4(),
  provider_id uuid references provider_profiles(id) on delete cascade,
  document_type text not null,
  storage_path text not null,
  review_status text not null default 'pending',
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------- care_match_requests ----------
create table care_match_requests (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid references profiles(id) on delete cascade,
  preference_summary jsonb default '{}'::jsonb,
  status care_match_status not null default 'draft',
  created_at timestamptz not null default now()
);

-- ---------- referrals ----------
create table referrals (
  id uuid primary key default uuid_generate_v4(),
  care_match_request_id uuid references care_match_requests(id) on delete cascade,
  provider_id uuid references provider_profiles(id) on delete set null,
  status referral_status not null default 'offered',
  assigned_at timestamptz default now(),
  accepted_at timestamptz
);

-- ---------- appointments ----------
create table appointments (
  id uuid primary key default uuid_generate_v4(),
  referral_id uuid references referrals(id) on delete cascade,
  scheduled_at timestamptz,
  duration_minutes int default 50,
  status text default 'scheduled',
  session_price_cents int,
  provider_payout_cents int
);

-- ---------- subscriptions ----------
create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  plan_key text,
  status text,
  created_at timestamptz not null default now()
);

-- ---------- payments ----------
create table payments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete set null,
  stripe_payment_intent_id text,
  kind payment_kind not null,
  amount_cents int,
  currency text default 'usd',
  status text,
  created_at timestamptz not null default now()
);

-- ---------- affiliate_profiles ----------
create table affiliate_profiles (
  user_id uuid primary key references profiles(id) on delete cascade,
  referral_code text unique not null,
  status text not null default 'pending'
);

-- ---------- affiliate_attributions ----------
create table affiliate_attributions (
  id uuid primary key default uuid_generate_v4(),
  affiliate_id uuid references affiliate_profiles(user_id) on delete cascade,
  referred_user_id uuid references profiles(id) on delete set null,
  source text,
  created_at timestamptz not null default now()
);

-- ---------- audit_logs ----------
create table audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references profiles(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ======================================================================
-- Row Level Security
-- ======================================================================

alter table profiles enable row level security;
alter table member_profiles enable row level security;
alter table provider_profiles enable row level security;
alter table provider_documents enable row level security;
alter table care_match_requests enable row level security;
alter table referrals enable row level security;
alter table appointments enable row level security;
alter table subscriptions enable row level security;
alter table payments enable row level security;
alter table affiliate_profiles enable row level security;
alter table affiliate_attributions enable row level security;
alter table audit_logs enable row level security;

-- Helper: is the current user an admin? Checked server-side against profiles.role,
-- which is never writable by the anon/authenticated role directly (see policy below).
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql stable security definer;

-- profiles: users read/update their own row; role column changes are blocked
-- from the client (only the service-role key, used server-side, can change role).
create policy "profiles_select_own_or_admin" on profiles
  for select using (auth.uid() = id or public.is_admin());

create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id);

-- member_profiles: owner only
create policy "member_profiles_owner" on member_profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- provider_profiles: public can view verified profiles; owner can view/edit their
-- own regardless of status; admins can view/edit all.
create policy "provider_profiles_public_verified" on provider_profiles
  for select using (verification_status = 'verified' or auth.uid() = user_id or public.is_admin());

create policy "provider_profiles_owner_write" on provider_profiles
  for insert with check (auth.uid() = user_id);

create policy "provider_profiles_owner_update" on provider_profiles
  for update using (auth.uid() = user_id or public.is_admin());

-- provider_documents: owner and admin only — never public
create policy "provider_documents_owner_or_admin" on provider_documents
  for all using (
    public.is_admin() or
    provider_id in (select id from provider_profiles where user_id = auth.uid())
  );

-- care_match_requests: member owns their own requests; admin sees all
create policy "care_match_owner_or_admin" on care_match_requests
  for all using (auth.uid() = member_id or public.is_admin())
  with check (auth.uid() = member_id or public.is_admin());

-- referrals: visible to the assigned provider, the requesting member (via join), or admin
create policy "referrals_provider_or_admin" on referrals
  for select using (
    public.is_admin() or
    provider_id in (select id from provider_profiles where user_id = auth.uid()) or
    care_match_request_id in (select id from care_match_requests where member_id = auth.uid())
  );

create policy "referrals_admin_write" on referrals
  for insert with check (public.is_admin());

create policy "referrals_provider_update_status" on referrals
  for update using (
    public.is_admin() or
    provider_id in (select id from provider_profiles where user_id = auth.uid())
  );

-- appointments: same access as the parent referral
create policy "appointments_via_referral" on appointments
  for select using (
    public.is_admin() or
    referral_id in (
      select id from referrals where
        provider_id in (select id from provider_profiles where user_id = auth.uid())
        or care_match_request_id in (select id from care_match_requests where member_id = auth.uid())
    )
  );

-- subscriptions & payments: owner read-only; writes happen via service-role in webhooks
create policy "subscriptions_owner_read" on subscriptions
  for select using (auth.uid() = user_id or public.is_admin());

create policy "payments_owner_read" on payments
  for select using (auth.uid() = user_id or public.is_admin());

-- affiliate_profiles: owner only
create policy "affiliate_profiles_owner" on affiliate_profiles
  for all using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id);

create policy "affiliate_attributions_owner_or_admin" on affiliate_attributions
  for select using (auth.uid() = affiliate_id or public.is_admin());

-- audit_logs: admin only
create policy "audit_logs_admin_only" on audit_logs
  for select using (public.is_admin());

-- ======================================================================
-- Storage buckets (run once — private by default)
-- ======================================================================
insert into storage.buckets (id, name, public)
values ('provider-documents', 'provider-documents', false)
on conflict (id) do nothing;

create policy "provider_documents_bucket_owner" on storage.objects
  for all using (
    bucket_id = 'provider-documents' and
    (owner = auth.uid() or public.is_admin())
  );
