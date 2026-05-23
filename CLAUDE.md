# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

No test runner is configured beyond Jest/Playwright scaffolding — there are no meaningful test files to run.

## What This Is

Headless Shopify storefront built with Next.js App Router. All product, cart, customer, and collection data comes from the Shopify Storefront GraphQL API. Checkout redirects to Shopify's hosted checkout — there is no custom payment processing.

## Architecture

**Data layer** — `src/lib/shopify/`:
- `client.ts` — all data-fetching functions (`getProduct`, `getProducts`, `getCollections`, `getCart`, `getCustomer`, etc.)
- `fetch.ts` — raw fetch wrapper with retry logic (retries on 429, not on 4xx auth errors)
- `queries.ts` / `mutations.ts` / `auth-mutations.ts` / `fragments.ts` — all GraphQL strings
- `mock.ts` — fallback mock data used when Shopify calls fail

**Route structure** — `src/app/`:
- `(auth)/` — login, register, forgot-password (redirect to `/account` when already logged in)
- `(routes)/account/` — protected pages, guarded by middleware
- `(routes)/silver-jewellery/` — collections listing and `[collection]/` subcollections
- `(routes)/products/[handle]/` — redirected from old `/products` path
- `api/auth/` — login, register, logout, profile, recover, reset (all use Shopify customer mutations)
- `api/cart/` — create, update, sync; `cartId` is persisted in localStorage
- `api/revalidate/` and `api/webhooks/` — ISR tag invalidation

**State** — React Context providers in `src/context/`:
- `CartProvider` — stores `cartId` in localStorage, fetches cart from `/api/cart`
- `AuthProvider` — reads customer session from `/api/auth/customer`
- `WishlistProvider` — localStorage only, no server sync

**Components** — `src/components/` are split by domain (home, product, collection, cart, auth, layout, etc.). Server Components handle data fetching; Client Components (`"use client"`) handle interactivity via hooks.

## Key Patterns

**Server Components** call `lib/shopify/client.ts` directly with ISR tags:
```ts
const product = await getProduct(handle); // cache with tags: ['products']
```

**Client Components** call API routes for mutations and use hooks (`useCart`, `useShopifySearch`, `useCustomer`).

**Auth** — Shopify Storefront customer tokens are stored in an HTTP-only cookie (`AUTH_COOKIE_NAME`). Middleware at `src/middleware.ts` protects `/account/*` routes.

**Collections routing** — `/collections/*` and `/products/*` are redirected in `next.config.js` to the `/silver-jewellery/` path pattern. Check `next.config.js` redirects before adding new routes.

**Jewelry filters** — Products support metafields for material, purity, stone type, weight, and gender. Filter logic lives in `src/hooks/useJewelryFilters.ts`; filter UI in `src/components/filters/`.

## Environment Variables

Required in `.env.local`:
```
SHOPIFY_STORE_DOMAIN
SHOPIFY_STOREFRONT_ACCESS_TOKEN
SHOPIFY_API_VERSION
SHOPIFY_ADMIN_TOKEN
ENCRYPTION_KEY               # 32-char string for session encryption
NEXT_PRIVATE_REVALIDATION_SECRET
NEXT_PUBLIC_SITE_URL
JUDGEME_API_TOKEN            # Third-party reviews provider
JUDGEME_SHOP_DOMAIN
```

## Known Caveats

- `next.config.js` sets `typescript: { ignoreBuildErrors: true }` — type errors will not fail the build.
- Import alias `@/*` maps to `src/*`.
- Tailwind CSS v4 is used (PostCSS plugin, not the v3 config file).
- ESLint uses flat config format (`eslint.config.mjs`), not `.eslintrc`.
