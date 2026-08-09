# Soul Care — Production Starter

**Stack:** Next.js 14 · TypeScript · Tailwind CSS · Supabase · Stripe · Resend  
**Launch posture:** Option A (no PHI) — marketing, provider recruiting, paid memberships, safe contact form. AI Companion and clinical matching are marked "Coming Soon" until HIPAA posture is decided.

---

## STEP 1 — Supabase setup

### 1a. Create the project
1. Go to https://supabase.com → click **New project**
2. Name it `soulcares-production`
3. Choose a strong database password — **save it somewhere safe**
4. Choose region closest to your users (e.g. US East)
5. Click **Create new project** and wait ~2 minutes

### 1b. Copy your API keys
1. In your new project go to **Settings → API** (left sidebar)
2. Copy these three values into your Vercel env vars (Step 3) and your local `.env.local`:

| What you see in Supabase | Env var name |
|---|---|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| anon public | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| service_role (secret) | `SUPABASE_SERVICE_ROLE_KEY` |

> ⚠️ The `service_role` key is never exposed to the browser. It's only used in server-side webhook and admin code.

### 1c. Run the database migration
1. In your Supabase project go to **SQL Editor** (left sidebar)
2. Click **New query**
3. Open the file `supabase/migrations/0001_init.sql` from this project
4. Copy the entire contents and paste into the SQL editor
5. Click **Run** (green button, top right)
6. You should see "Success. No rows returned" — this means all tables, RLS policies, and the storage bucket were created

### 1d. Configure Auth redirect URLs
1. Go to **Authentication → URL Configuration** (left sidebar)
2. Set **Site URL** to `https://soulcares.co` (use your Vercel preview URL until your domain is connected, e.g. `https://soulcares-abc123.vercel.app`)
3. Under **Redirect URLs** add:
   - `https://soulcares.co/app`
   - `https://soulcares.co/provider/dashboard`
   - Your Vercel preview equivalents, e.g. `https://soulcares-abc123.vercel.app/app`
4. Click **Save**

### 1e. Make yourself an admin
1. Sign up for an account through the app at `/signup`
2. Go back to Supabase → **Table Editor → profiles**
3. Find your row (match by email)
4. Click the row → edit the `role` field from `member` to `admin`
5. Click **Save** — now `/admin` will work for your account

---

## STEP 2 — Stripe setup

Do everything in **Test mode first** (toggle in top-right of Stripe Dashboard). Repeat in Live mode before real launch.

### 2a. Create the three products

Go to https://dashboard.stripe.com/test/products → click **+ Add product** three times:

**Product 1 — Companion Plus**
- Name: `Soul Care Companion Plus`
- Pricing model: **Recurring**
- Price: `$9.00`
- Billing period: **Monthly**
- Click **Save product**
- Copy the **Price ID** (starts with `price_...`) → paste into `STRIPE_PRICE_COMPANION_PLUS`

**Product 2 — Therapy Session**
- Name: `Soul Care Therapy Session`
- Pricing model: **One time**
- Price: `$50.00`
- Click **Save product**
- Copy the **Price ID** → paste into `STRIPE_PRICE_THERAPY_SESSION`

**Product 3 — Provider Network**
- Name: `Soul Care Provider Network`
- Pricing model: **Recurring**
- Price: `$49.99`
- Billing period: **Monthly**
- Click **Save product**
- Copy the **Price ID** → paste into `STRIPE_PRICE_PROVIDER_NETWORK`

### 2b. Copy your API keys

Go to https://dashboard.stripe.com/test/apikeys

| Stripe label | Env var name |
|---|---|
| Publishable key (starts with `pk_test_`) | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` |
| Secret key (starts with `sk_test_`) | `STRIPE_SECRET_KEY` |

### 2c. Set up the webhook (do this AFTER first Vercel deploy)

1. Go to https://dashboard.stripe.com/test/webhooks → **Add endpoint**
2. **Endpoint URL:** `https://YOUR-VERCEL-URL.vercel.app/api/stripe/webhook`  
   (replace with `https://soulcares.co/api/stripe/webhook` after domain is connected)
3. Click **Select events** and add exactly these 12 events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `account.updated`
   - `transfer.created`
   - `payout.paid`
   - `payout.failed`
4. Click **Add endpoint**
5. On the endpoint page click **Signing secret → Reveal**
6. Copy the value (starts with `whsec_...`) → paste into `STRIPE_WEBHOOK_SECRET`
7. Add `STRIPE_WEBHOOK_SECRET` to Vercel env vars → **redeploy**

### 2d. Enable Stripe Connect (for provider payouts)

1. Go to https://dashboard.stripe.com/connect/accounts/overview
2. Click **Get started with Connect**
3. Choose **Express** accounts
4. Go to **Connect → Settings → Branding** — add Soul Care name/colors so providers see your brand during onboarding
5. No extra keys needed — Connect uses your existing secret key automatically

### 2e. Enable the Customer Billing Portal

1. Go to https://dashboard.stripe.com/settings/billing/portal
2. Toggle it **on**
3. Enable: **Cancel subscriptions** and **Update payment method**
4. Click **Save**

### 2f. Test a payment end to end

Use Stripe test card `4242 4242 4242 4242` with any future expiry and any CVC.
After checkout, verify a row appears in:
- Supabase → `payments` table
- Supabase → `subscriptions` table (for recurring plans)

If rows don't appear, check Vercel function logs — the webhook is likely missing or the `STRIPE_WEBHOOK_SECRET` is wrong.

### 2g. Go live (when ready for real payments)

1. Toggle Stripe Dashboard to **Live mode** (top right)
2. Repeat steps 2a–2e in live mode
3. Update all Stripe env vars in Vercel with live values (`pk_live_`, `sk_live_`, live price IDs, live `whsec_`)
4. Redeploy

---

## STEP 3 — Resend setup (email)

Resend handles the contact form. Without this, the contact form returns a 502 error — everything else on the site works fine without it.

### 3a. Create a Resend account
1. Go to https://resend.com → sign up
2. Go to **API Keys → Create API Key**
3. Name it `soulcares-production`
4. Copy the key (starts with `re_...`) → paste into `RESEND_API_KEY`

### 3b. Verify your sending domain
1. In Resend go to **Domains → Add Domain**
2. Enter `soulcares.co`
3. Resend gives you DNS records to add — log into wherever your domain's DNS is managed (GoDaddy, Namecheap, Cloudflare, etc.)
4. Add the records Resend gives you (usually a few TXT and MX records)
5. Click **Verify** in Resend — it may take a few minutes for DNS to propagate
6. Once verified, emails from `hello@soulcares.co` will send successfully

### 3c. Set contact env vars

```
RESEND_API_KEY=re_your_key_here
CONTACT_TO_EMAIL=hello@soulcares.co
CONTACT_FROM_EMAIL=Soul Care <hello@soulcares.co>
```

> `CONTACT_TO_EMAIL` is where contact form submissions arrive in your inbox.  
> `CONTACT_FROM_EMAIL` is what shows as the sender — must be from your verified domain.

### 3d. Test the contact form
1. Go to `/contact` on your live site
2. Fill in all fields, check the consent box, submit
3. You should receive an email at `CONTACT_TO_EMAIL` within seconds
4. If not, check Vercel function logs for errors

---

## STEP 4 — Deploy to Vercel

### 4a. Push to GitHub
Run these commands in your terminal inside the `soulcares` folder:

```bash
git init
git add .
git commit -m "Initial Soul Care production build"
git branch -M main
```

Then create a **new private repository** on GitHub named `soulcares-production`, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/soulcares-production.git
git push -u origin main
```

### 4b. Create Vercel project
1. Go to https://vercel.com/new
2. Click **Import Git Repository** → connect your GitHub if needed → select `soulcares-production`
3. Framework preset: **Next.js** (auto-detected — leave it)
4. **Root directory:** leave blank (the project root is the app)
5. **Do not click Deploy yet** — add env vars first

### 4c. Add environment variables
In Vercel → **Environment Variables**, add every variable from `.env.example`:

```
NEXT_PUBLIC_SUPABASE_URL          → from Supabase Step 1b
NEXT_PUBLIC_SUPABASE_ANON_KEY     → from Supabase Step 1b
SUPABASE_SERVICE_ROLE_KEY         → from Supabase Step 1b

STRIPE_SECRET_KEY                 → from Stripe Step 2b
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY → from Stripe Step 2b
STRIPE_WEBHOOK_SECRET             → from Stripe Step 2c (add after first deploy)
STRIPE_PRICE_COMPANION_PLUS       → from Stripe Step 2a
STRIPE_PRICE_THERAPY_SESSION      → from Stripe Step 2a
STRIPE_PRICE_PROVIDER_NETWORK     → from Stripe Step 2a

RESEND_API_KEY                    → from Resend Step 3a
CONTACT_TO_EMAIL                  → hello@soulcares.co
CONTACT_FROM_EMAIL                → Soul Care <hello@soulcares.co>

NEXT_PUBLIC_APP_URL               → https://soulcares.co
                                    (use your Vercel preview URL until domain is connected)
```

Set each variable for **Production**, **Preview**, and **Development** environments (there's a checkbox — select all three).

### 4d. Deploy
1. Click **Deploy**
2. Wait ~2 minutes for the build
3. Vercel gives you a preview URL like `https://soulcares-abc123.vercel.app`
4. Visit it — the site should load fully
5. Now go back and complete Stripe Step 2c (webhook) using this URL

### 4e. Connect your domain
1. In Vercel → **Project → Settings → Domains**
2. Click **Add Domain** → type `soulcares.co` → click **Add**
3. Also add `www.soulcares.co`
4. Vercel shows you DNS records — go to your domain registrar and add them:
   - For the apex domain (`soulcares.co`): add an **A record** pointing to `76.76.21.21`
   - For www: add a **CNAME** pointing to `cname.vercel-dns.com`
5. DNS can take 10 minutes to 48 hours to propagate
6. Once connected, update `NEXT_PUBLIC_APP_URL` to `https://soulcares.co` in Vercel env vars and redeploy
7. Also update the Stripe webhook URL (Step 2c) and Supabase redirect URLs (Step 1d) to use your real domain

---

## STEP 5 — Go-live checklist

Before telling anyone the site is live:

**Supabase**
- [ ] Migration ran successfully (all tables visible in Table Editor)
- [ ] Your account has `role = admin` in the profiles table
- [ ] Auth redirect URLs include your real domain

**Stripe**
- [ ] All 3 products created with correct prices
- [ ] Test checkout works (card `4242 4242 4242 4242`)
- [ ] Payment shows up in Supabase `payments` table after checkout
- [ ] Webhook endpoint added with all 12 events
- [ ] `STRIPE_WEBHOOK_SECRET` set in Vercel and redeployed
- [ ] Billing portal enabled in Stripe settings
- [ ] Connect enabled for provider payouts

**Resend**
- [ ] Domain `soulcares.co` verified in Resend
- [ ] Contact form submits and email arrives in your inbox

**Site**
- [ ] All pages load without errors
- [ ] `/crisis` page is reachable from the footer
- [ ] `/privacy` and `/terms` show the correct content
- [ ] Crisis notice visible on home, care-match, and dashboard
- [ ] AI Companion shows "Coming soon" — not clickable
- [ ] Provider apply form submits and row appears in `provider_profiles` table
- [ ] Admin page `/admin` shows pending applications (after you make yourself admin)

**Before expanding to PHI / AI Companion (Phase 2)**
- [ ] Choose Option A or Option B (see guidance doc)
- [ ] If Option B: sign Supabase BAA + enable HIPAA add-on before storing any PHI
- [ ] Have attorney review and finalize `/privacy` and `/terms`
- [ ] Implement AI Companion system prompt and safety rules from guidance doc
- [ ] Add `companion_sessions`, `companion_messages`, `safety_events` tables (schema in guidance doc)

---

## Project structure

```
soulcares/
  app/
    page.tsx                    Homepage
    how-it-works/page.tsx
    providers/
      page.tsx                  Provider landing
      apply/page.tsx            Application form
    membership/page.tsx
    care-match/page.tsx         Non-clinical interest form (Option A)
    resources/page.tsx
    affiliates/page.tsx         Policy shown, dashboard locked
    about/page.tsx
    faq/page.tsx
    privacy/page.tsx            Interim legal copy
    terms/page.tsx              Interim legal copy
    crisis/page.tsx
    contact/page.tsx            Safe form with consent checkbox
    login/page.tsx
    signup/page.tsx
    app/page.tsx                Member dashboard (auth-gated)
    provider/dashboard/page.tsx Provider dashboard (auth-gated)
    admin/page.tsx              Admin review queue (role-gated)
    affiliate/dashboard/page.tsx Phase 2 placeholder (auth-gated)
    api/
      contact/route.ts          Resend email handler
      care-match/route.ts       Non-clinical interest submission
      provider/apply/route.ts   Provider application
      stripe/
        checkout/route.ts       Create Stripe Checkout session
        portal/route.ts         Open billing portal
        connect/route.ts        Provider payout onboarding
        webhook/route.ts        Handle all 12 Stripe events
  components/
    NavBar.tsx
    Footer.tsx
    Section.tsx
    CrisisNote.tsx
    PricingCard.tsx
    ManageBillingButton.tsx
    ConnectOnboardButton.tsx
  lib/
    supabase/client.ts          Browser Supabase client
    supabase/server.ts          Server + service-role clients
    stripe.ts                   Stripe client + plan/price config
  supabase/
    migrations/0001_init.sql    Full schema + RLS policies
  middleware.ts                 Session refresh on every request
  .env.example                  All required env vars
```
# soulcare
