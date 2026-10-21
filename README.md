# Twistify Arts

Storefront for Twistify Arts — handmade crochet and woolen crafts by Shraddha Doshi.
Built with Next.js, MongoDB (Mongoose), Auth.js, and Razorpay.

## Quick start

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000. No configuration is needed to browse: without a database the
shop shows the bundled catalog from `app/data/products.ts`, and accounts and checkout show
a "not available yet" notice instead of failing.

## Full setup (accounts, orders, payments)

1. Copy `.env.example` to `.env.local` and fill in the values:
   - `MONGODB_URI` — MongoDB connection string (enables accounts, orders, and the product database).
   - `AUTH_SECRET` — a long random string; generate one with
     `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`. **Required in production.**
   - `RAZORPAY_*` — enables online payment; leave `RAZORPAY_ENABLED=false` to turn it off.
   - `RESEND_API_KEY`, `ORDER_NOTIFICATION_EMAIL` — optional order emails.
2. Load the catalog into the database: `npm run seed:products`
3. Create an admin (uses `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`): `npm run seed:admin`
4. Restart `npm run dev`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` | ESLint |
| `npm run seed:products` | Upsert `app/data/products.ts` into MongoDB |
| `npm run seed:admin` | Create the admin account |
| `npm run reset:admin` | Reset the admin password |

Never commit `.env.local` — it holds your secrets and is ignored by git.

## Roadmap

See [docs/STOREFRONT_GAP_ANALYSIS.md](docs/STOREFRONT_GAP_ANALYSIS.md) for what the storefront still lacks compared with leading handmade shops.
