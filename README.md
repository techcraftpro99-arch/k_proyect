# Digital Design Store

Premium e-commerce platform for selling digital design assets (mockups, presets, templates, vectors). Built with Next.js, Supabase, and a modular payment system.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), Tailwind CSS v4, Shadcn UI, Lucide Icons
- **Backend:** Supabase (PostgreSQL + Storage)
- **Payments:** PayPal (Phase 1) + WhatsApp/TikTok manual flow
- **Email:** Resend (signed download links)
- **Deploy:** Vercel

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in all variables. The store works with **mock product data** when Supabase is not configured, but checkout and admin require Supabase.

### 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the migration in SQL Editor:
   - [`supabase/migrations/20250819000000_initial_schema.sql`](supabase/migrations/20250819000000_initial_schema.sql)
3. Run the seed:
   - [`supabase/seed.sql`](supabase/seed.sql)
4. Create storage buckets (if not created by migration):
   - `product-previews` (public)
   - `digital-assets` (private)
5. Upload preview images to `product-previews` and digital files to `digital-assets`

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/                  # Pages and API routes
components/           # UI components (shop, checkout, admin)
lib/                  # Supabase, payments, delivery, validations
types/                # TypeScript interfaces
supabase/             # SQL migrations and seed
public/images/        # Static assets and SVG placeholders
```

## Payment Flows

### PayPal (automatic)

1. Customer completes checkout with PayPal Smart Buttons
2. Server captures payment via PayPal API
3. Signed download URLs (24h) are emailed automatically

### WhatsApp / TikTok (manual)

1. Customer creates order and is redirected to contact channel
2. Admin approves order at `/admin/orders` (login with `ADMIN_SECRET`)
3. Download links are emailed after approval

## Admin Panel

1. Visit `/admin/login`
2. Enter your `ADMIN_SECRET`
3. Manage orders at `/admin/orders`

## Deploy to Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.example`
4. Deploy

### PayPal Webhook (production)

Set webhook URL to: `https://your-domain.com/api/webhooks/paypal`

Events: `CHECKOUT.ORDER.APPROVED`, `PAYMENT.CAPTURE.COMPLETED`

## Adding Payment Providers (Phase 2)

1. Create a new provider in `lib/payments/` implementing `PaymentProvider`
2. Register it in `lib/payments/registry.ts`
3. Add UI tab in `CheckoutForm`

Example for Stripe: implement `StripeProvider`, add to registry, add env vars.

## License

Private — all rights reserved.
