# Storefront gap analysis

Compared against patterns common to handmade and small-brand shops (Etsy, Shopify craft stores, Indian D2C gifting and decor brands). This is from general knowledge of those patterns, not a live crawl of specific sites. Re-check before using it as a spec.

## Added in this pass

| Area | Change |
|---|---|
| Shop | Search, sort (price, name), "hide sold out", live result count, clear-filters, empty state |
| Product page | Breadcrumbs, `Product` JSON-LD, availability-aware reassurance list, delivery / returns / variation accordions, "more from this collection" |
| Footer | Four-column footer: collections, help (FAQ, track order, policies), studio, contact email |
| Help | New `/faq` page with `FAQPage` JSON-LD; FAQ added to the header nav |
| SEO | `sitemap.xml` (static pages + every product), `robots.txt` (blocks admin, api, account, checkout, order) |
| Resilience | Global `error.tsx` (uses `retry`, the Next 16 prop), `/shop` loading skeleton |

## Still missing (ranked by impact for this shop)

1. **Real product photos.** Everything else matters less. Shop pages show drawings; Product JSON-LD has no `image`, so Google shows no rich result. Add photos, then render `product.images` and add `image` to the schema.
2. **Phone numbers** on the Contact page are still `[Phone Number 1]` / `[Phone Number 2]`. A WhatsApp click-to-chat link is the single most common contact channel for Indian craft shops.
3. **Shipping cost and delivery estimate before checkout.** Policy says "confirmed at checkout". Shoppers expect a free-shipping threshold or flat rate, and a pincode check on the product page. Needs a business decision first.
4. **Guest checkout.** Checkout requires an account; forced sign-up is a top cause of abandoned carts.
5. **Customer order confirmation email.** Only the business is emailed. Add a customer receipt and a "shipped" email with tracking.
6. **Order tracking.** Account shows status only; no courier name, tracking number or link.
7. **Reviews / testimonials.** Social proof is absent. Start with a few curated testimonials, add verified-buyer reviews later.
8. **Product detail depth.** Every product shares one generic description. Add size, materials, care, colour options and a gallery.
9. **Custom / bulk order form.** "Ask the studio" currently means email. A short form (piece, colour, size, date needed) would capture festival and gifting demand.
10. **Wishlist, gift wrap / gift message, discount codes, back-in-stock notify.**
11. **Admin gaps.** No product editor (catalog changes need `seed:products`), no inventory edit, no refunds from the dashboard, no admin creation UI.
12. **Marketing basics.** Newsletter signup, Instagram feed, analytics (no tracking installed), Google Merchant feed.
13. **Quality.** No tests, no CI, no `.env` validation at boot, no rate limiting on auth endpoints.
14. **Mobile polish.** Sticky add-to-cart bar on product pages; the basket drawer exists only on `/shop`, while the header links to `/cart`.

## Notes for whoever picks this up

- Don't invent shipping fees, return windows or delivery times in copy. The policies deliberately avoid numbers until the business sets them.
- `error.tsx` takes `retry`, not `reset`, in this Next version (see `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md`).
- Set `NEXT_PUBLIC_SITE_URL` in production or the sitemap, robots and OG URLs point at localhost.
