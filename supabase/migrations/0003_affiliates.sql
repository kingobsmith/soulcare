create table if not exists public.affiliates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  legal_name text not null,
  organization_name text,
  website_or_social_url text,
  city text,
  state_region text,
  country text,
  audience_type text,
  audience_size_range text,
  promotion_plan text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'suspended')),
  referral_code text unique,
  referral_url text,
  terms_accepted_at timestamptz,
  applied_at timestamptz not null default now(),
  approved_at timestamptz,
  rejected_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.affiliate_clicks (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.affiliates(id) on delete cascade,
  referral_code text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.affiliate_attributions (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid references auth.users(id) on delete cascade,
  referred_user_id uuid references auth.users(id) on delete set null,
  source text,
  referral_code text,
  converted_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.affiliate_attributions
  add column if not exists referral_code text,
  add column if not exists converted_at timestamptz;

alter table public.affiliates enable row level security;
alter table public.affiliate_clicks enable row level security;
alter table public.affiliate_attributions enable row level security;

drop policy if exists "affiliates_select_own_or_admin" on public.affiliates;
create policy "affiliates_select_own_or_admin" on public.affiliates
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "affiliates_insert_own_pending" on public.affiliates;
create policy "affiliates_insert_own_pending" on public.affiliates
  for insert with check (
    auth.uid() = user_id
    and status = 'pending'
    and referral_code is null
  );

drop policy if exists "affiliate_clicks_select_admin_or_owner" on public.affiliate_clicks;
create policy "affiliate_clicks_select_admin_or_owner" on public.affiliate_clicks
  for select using (
    public.is_admin()
    or affiliate_id in (select id from public.affiliates where user_id = auth.uid())
  );

drop policy if exists "affiliate_attributions_owner_or_admin" on public.affiliate_attributions;
create policy "affiliate_attributions_owner_or_admin" on public.affiliate_attributions
  for select using (auth.uid() = affiliate_id or public.is_admin());
