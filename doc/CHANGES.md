# Dal Rotti Online Ordering – Tech Blueprint (React + FastAPI + Supabase + Stripe + Wolt Drive)

**Owner:** Jay (Gajera IT Solutions)
**Version:** v1.0 (Initial)
**Goal:** Add a fully owned "Order Online" experience to **dalrotti.com** with Stripe payments and Wolt Drive delivery, backed by Supabase and a FastAPI service.

---

## 0) High-Level Overview

* **Frontend (existing):** React.js website → add **/menu**, **/cart**, **/checkout**, **/orders**, and **/admin/*** routes.
* **Backend (new):** **FastAPI** service (Python) for business logic, Stripe & Wolt integrations, webhooks, and admin APIs.
* **Data & Auth:** **Supabase Postgres** (tables below) + **Supabase Auth** (email/password).
* **Payments:** **Stripe Payment Element / Checkout** (+ webhooks for success/failure/refund).
* **Delivery:** **Wolt Drive** fee estimates pre‑payment; create delivery after successful payment; update status via webhooks.
* **Hosting:** Frontend on Vercel (or same host as now), Backend on Render/Fly.io/AWS; Supabase managed.

---

## 1) Repos & Environments

### Repos

1. **dalrotti-frontend** (React.js)
2. **dalrotti-backend** (FastAPI)

### Branching & Envs

* **main** → production (dalrotti.com)
* **develop** → staging (staging.dalrotti.com)
* Use `.env` files per env and CI to inject runtime secrets.

---

## 2) Frontend (React.js) – Routes & Components

* **/menu**

  * Category list, product tiles, variant selectors, add-ons, allergens display
  * "Add to cart" with quantity, variant/add‑on choices
* **/cart**

  * Item lines with edit/remove; subtotal; choose **Pickup** or **Delivery**
  * If Delivery: address form + delivery‑fee estimate (via backend)
* **/checkout**

  * Contact details, order notes, time options (ASAP / scheduled basic)
  * **Stripe Payment Element/Checkout** integration (client secret from backend)
* **/order/:id** (Tracking)

  * Shows order status timeline (created → paid → in_prep → ready → dispatched → delivered)
  * If delivery: show courier status & tracking link
* **/account**

  * Sign in/out, saved addresses, order history
* **/admin/***

  * Guarded route (role=admin) – product CRUD, inventory toggles (“sold out”), order board (KDS view), settings

**State:** Basic cart state in client; persist to localStorage; on checkout, server creates provisional order.

---

## 3) Backend (FastAPI) – Structure

```
app/
  main.py                # FastAPI init, routers include
  config.py              # Settings (Stripe, Wolt, Supabase)
  deps.py                # Auth dependencies (Supabase JWT verification)
  models.py              # Pydantic models
  routers/
    menu.py              # Public menu endpoints
    cart.py              # Fee estimate, checkout session
    orders.py            # Order CRUD, tracking, admin updates
    admin.py             # Admin-only: products, categories, inventory
    webhooks_stripe.py   # Stripe webhook endpoint
    webhooks_wolt.py     # Wolt webhook endpoint
  services/
    stripe_svc.py        # create session / verify webhook / refunds
    wolt_svc.py          # fee estimate / create delivery / cancel
    supabase_svc.py      # typed queries to Supabase Postgres
  utils/
    security.py          # signature/JWT checks
    logging.py
```

**Key choices**

* Use **Supabase Python client** for DB (auth via service key on server only).
* Verify **Stripe** webhook signatures; verify **Wolt** webhook JWT token.
* Idempotency keys on all external calls.

---

## 4) Supabase – Database Schema (minimal, production‑ready)

> Use SQL migration files in backend repo; keep Prisma/SQLX‑like discipline if preferred.

```sql
-- categories
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position int default 0,
  is_active boolean default true
);

-- products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  slug text unique not null,
  name text not null,
  description text,
  base_price_cents int not null,
  image_url text,
  tax_rate numeric(5,2) default 7.00, -- e.g., 7% food takeaway
  is_active boolean default true
);

-- variants (optional per product)
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  name text not null,
  price_delta_cents int default 0,
  is_default boolean default false
);

-- add-ons
create table public.add_ons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price_cents int not null,
  is_active boolean default true
);

create table public.product_add_ons (
  product_id uuid references public.products(id) on delete cascade,
  add_on_id uuid references public.add_ons(id) on delete cascade,
  primary key (product_id, add_on_id)
);

-- allergens
create table public.allergens (
  id uuid primary key default gen_random_uuid(),
  code text unique not null, -- e.g., "nuts"
  name text not null
);

create table public.product_allergens (
  product_id uuid references public.products(id) on delete cascade,
  allergen_id uuid references public.allergens(id) on delete cascade,
  primary key (product_id, allergen_id)
);

-- inventory
create table public.inventory (
  product_id uuid primary key references public.products(id) on delete cascade,
  available boolean default true,
  daily_limit int,
  sold_today int default 0
);

-- addresses (user addresses)
create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null, -- supabase auth uid
  label text,
  street text, city text, postcode text,
  lat double precision, lon double precision
);

-- orders
create type order_status as enum (
  'created','payment_pending','paid','in_prep','ready','dispatched','delivered','cancelled','refunding','refunded'
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  status order_status not null default 'created',
  fulfillment_type text check (fulfillment_type in ('pickup','delivery')) not null,
  subtotal_cents int not null default 0,
  discount_cents int not null default 0,
  delivery_fee_cents int not null default 0,
  tax_cents int not null default 0,
  total_cents int not null default 0,
  currency text not null default 'EUR',
  contact_name text, phone text, notes text,
  pickup_time timestamptz,
  delivery_address_id uuid references public.addresses(id),
  stripe_payment_intent_id text, stripe_payment_status text,
  wolt_delivery_id text, wolt_tracking_url text,
  created_at timestamptz default now()
);

-- order items
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  product_name_snapshot text not null,
  unit_price_cents int not null,
  quantity int not null,
  variants_json jsonb,
  add_ons_json jsonb,
  allergens_snapshot_json jsonb
);

-- webhooks log
create table public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  source text check (source in ('stripe','wolt')),
  event_type text,
  raw_payload jsonb,
  processed_at timestamptz,
  status text,
  created_at timestamptz default now()
);
```

**RLS (Row Level Security)**

* Enable RLS on user‑owned tables (addresses, orders) so users can only read their own; admin role (via JWT claim) can read all.
* Products/menu read is public (no RLS) or via anon role.

---

## 5) Integrations – Contracts & Flows

### 5.1 Stripe (Payment)

**Flow**

1. Frontend → `POST /api/checkout/session` with cart + fulfillment type + address (if delivery) + contact.
2. Backend creates provisional **order** (status `created`) and **Stripe PaymentIntent** or Checkout Session; returns client secret / redirect URL.
3. Stripe → Webhook `payment_intent.succeeded` (or Checkout `session.completed`).
4. Backend: mark order `paid`, compute taxes/final totals, then trigger Wolt delivery if delivery.
5. Refunds/cancellations call Stripe and (if needed) cancel Wolt order.

**Endpoints (backend)**

* `POST /api/checkout/session` → { clientSecret or checkoutUrl, orderId }
* `POST /api/webhooks/stripe` → verify signature; update order/payment status

### 5.2 Wolt Drive (Delivery)

**Pre‑payment check**

* `POST /api/cart/fee-estimate` (server) → calls Wolt **delivery-fee** with pickup (venue) & dropoff (user address) to show fee & ETA.

**Post‑payment create**

* `POST /api/dispatch/wolt?orderId=...` → calls Wolt **delivery-order**; store `wolt_delivery_id` & tracking URL.

**Webhooks**

* `POST /api/webhooks/wolt` → payload contains signed JWT (`token`) with event; verify & update order status (courier_assigned, picked_up, delivered, failed).

**Failure handling**

* If Wolt rejects (area/hours): immediately offer pickup or refund; log to `webhook_events`.

---

## 6) Admin Panel – Features

* **Menu Management:** categories, products, variants, add‑ons, allergens, images.
* **Inventory:** “Available/Sold Out” toggle; optional daily limits.
* **Orders Board (KDS):** live columns (new/paid → in_prep → ready → dispatched → delivered). Force state change if needed.
* **Settings:** Wolt credentials (merchantId, secrets), venue address/hours; Stripe keys and webhook secrets; tax rate(s); invoice footer.
* **Webhooks Health:** last 50 events, retry button where safe.

---

## 7) Security & Compliance

* Store all secrets server‑side (FastAPI). Never expose Wolt/Stripe keys in client.
* Verify **Stripe** webhook signatures and **Wolt** JWT token before processing.
* Apply **RLS** in Supabase; admin paths require role claim (`role=admin`) attached to JWT.
* GDPR/DSGVO: clear Privacy Policy; allow account deletion; log data retention policy.
* Prices shown **tax‑inclusive**; VAT shown on invoice/receipt. Allergen list visible per item + global page.

---

## 8) Environment Variables (Backend)

```
# Supabase
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
SUPABASE_JWT_AUD=authenticated

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
CURRENCY=EUR

# Wolt Drive
WOLT_BASE_URL=https://daas-public-api.development.dev.woltapi.com  # or prod
WOLT_MERCHANT_ID=
WOLT_BEARER_TOKEN=
WOLT_WEBHOOK_SHARED_SECRET=
VENUE_NAME="DAL ROTTI"
VENUE_PHONE=+49xxxxxxx
VENUE_ADDRESS_JSON='{"formatted_address":"...","coordinates":{"lat":..,"lon":..}}'

# App
APP_BASE_URL=https://dalrotti.com
ALLOWED_ORIGINS=https://dalrotti.com,https://staging.dalrotti.com
```

---

## 9) Example API Contracts (Backend)

### 9.1 Fee Estimate (Delivery)

```
POST /api/cart/fee-estimate
Body: {
  "address": {
    "formatted": "Some St 10, 60327 Frankfurt",
    "lat": 50.106, "lon": 8.653
  },
  "cart": [
    {"product_id":"...","name":"Paneer Tikka","unit_price_cents":1299,"qty":1},
    {"product_id":"...","name":"Garlic Naan","unit_price_cents":299,"qty":2}
  ]
}
Response: { "fee_cents": 399, "eta_minutes": 32, "currency": "EUR" }
```

### 9.2 Create Checkout Session

```
POST /api/checkout/session
Body: {
  "fulfillment_type": "delivery",  // or "pickup"
  "address_id": "uuid-or-null",
  "contact": {"name":"Jay","phone":"+49..."},
  "notes": "no onion",
  "cart": [ { ... } ]
}
Response: { "order_id":"...", "client_secret":"..." }
```

### 9.3 Stripe Webhook

```
POST /api/webhooks/stripe
# No direct response body; on PI succeeded → mark order paid; trigger Wolt dispatch if delivery.
```

### 9.4 Wolt Webhook

```
POST /api/webhooks/wolt
Body: { "token": "<HS256 JWT>" }
# On verify → update order status and timestamps.
```

---

## 10) Minimal FastAPI Snippets (illustrative)

```python
# main.py
from fastapi import FastAPI
from routers import cart, orders, admin, webhooks_stripe, webhooks_wolt

app = FastAPI()
app.include_router(cart.router, prefix="/api/cart", tags=["cart"])
app.include_router(orders.router, prefix="/api/orders", tags=["orders"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(webhooks_stripe.router, prefix="/api/webhooks/stripe", tags=["stripe"])
app.include_router(webhooks_wolt.router, prefix="/api/webhooks/wolt", tags=["wolt"])
```

```python
# routers/cart.py (fee estimate)
@router.post("/fee-estimate")
async def fee_estimate(payload: FeeEstimateIn, settings=Depends(get_settings)):
    fee = await wolt_svc.estimate_fee(payload.address, payload.cart)
    return fee
```

```python
# routers/webhooks_stripe.py (verify)
import stripe
from fastapi import Request, HTTPException

@router.post("")
async def stripe_webhook(request: Request):
    sig = request.headers.get("stripe-signature")
    payload = await request.body()
    try:
        event = stripe.Webhook.construct_event(payload, sig, settings.STRIPE_WEBHOOK_SECRET)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid signature")
    # handle event.type ...
    return {"received": True}
```

--- 

## 11) Deployment & DevOps

* **Frontend**: Vercel → env vars for NEXT_PUBLIC_API_BASE_URL, Stripe publishable key.
* **Backend**: Render/Fly.io/AWS → expose public HTTPS; set CORS; scale to 1–2 instances.
* **Supabase**: set RLS policies; create roles; upload allergen master; seed menu.
* **Webhooks**: Stripe & Wolt pointing to backend URLs `/api/webhooks/stripe` and `/api/webhooks/wolt`.
* **Observability**: Log drains; alert on 5xx > threshold; dead-letter queue for failed webhooks.

---

## 12) QA Checklist (critical paths)

* [ ] Add to cart (variants/add‑ons, allergens displayed)
* [ ] Delivery area/fee estimate blocks out‑of‑area properly
* [ ] Stripe happy path: pay → order paid → Wolt created → statuses flow to delivered
* [ ] Failures: Wolt rejects → offer pickup/refund; webhook retries
* [ ] Inventory toggle hides add‑to‑cart immediately
* [ ] Admin CRUD & role protection
* [ ] Invoices show VAT; prices displayed tax‑inclusive
* [ ] Accessibility (keyboard/tab), mobile perf, i18n (DE/EN labels)

---

## 13) Phase Plan (2–3 weeks realistic)

**Phase 1 (Menu + Cart + Admin CRUD)**

* Schema migration; seed menu; frontend menu/cart; admin CRUD.

**Phase 2 (Payments)**

* Stripe Payment Element; success/failure webhook; order finalize.

**Phase 3 (Delivery + Tracking)**

* Address capture; Wolt fee estimate & order create; webhook status → tracker page.

**Phase 4 (Hardening)**

* Refunds; scheduled pickup; analytics & alerts; docs & handover.

---

## 14) Next Steps

1. Create both repos (frontend/backend) with templates above.
2. Provision Supabase project; run schema; configure RLS; import allergens.
3. Acquire Stripe + Wolt Drive credentials; set webhooks (staging first).
4. Implement fee‑estimate → checkout → webhooks → dispatch path.
5. Ship staging; run full QA; then flip production.

---

**This document is the living reference.** Update as you finalize payload fields, policy rules, and deployment targets.
