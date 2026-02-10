# PROJECT_SNAPSHOT.md

1️⃣ DOCUMENT PURPOSE

The document must:
Capture the current real state of the project (not ideal state, not future state).
Be detailed enough that another senior developer could:
Understand the architecture
Recreate the project
Debug issues
Continue development without asking questions
Do not use vague phrases like:
“best practice”
“recommended”
“standard”
“commonly used”
“usually”
Be concrete, explicit, and factual.

2️⃣ STRUCTURE OF PROJECT_SNAPSHOT.md

## A. Project Overview

- **Project type**: Headless Shopify + Next.js (App Router)
- **Frontend only**: Shopify as backend
- **Storefront GraphQL API used**
- **Hosted checkout approach** (Shopify checkout redirect)
- **Target deployment**: Vercel

## B. Tech Stack (Current)

- **Next.js version**: 16.1.6 (Turbopack)
- **Router**: App Router only
- **Language**: TypeScript (strict)
- **Data layer**: Native fetch (no Apollo, no Axios)
- **Shopify API**: Storefront GraphQL
- **Caching strategy**: ISR + tag-based revalidation (partial implementation)
- **Image handling**: Next/Image with Shopify CDN patterns
- **Environment handling**: .env.local + custom env.ts validator

## C. Current Folder Structure

src/
  app/
    (routes)/
      collections/
        [handle]/
          page.tsx - Collection detail page with dynamic routing
        page.tsx - Collections listing page (Responsive Grid)
      products/
        [handle]/
          page.tsx - Product detail page (with mock fallback)
      search/
        [query]/
          page.tsx - Search results page
        page.tsx - Search input page
      page.tsx - (deleted duplicate, now only root page.tsx exists)
    api/
      revalidate/
        route.ts - On-demand ISR revalidation endpoint
      webhooks/
        shopify/
          route.ts - Shopify webhook handler
    layout.tsx - Root layout with Context Providers (Cart, Theme, etc.)
    page.tsx - Home Page (Canvas for Hero, Grid, etc.)
    not-found.tsx - Global 404 page
    error.tsx - Global error boundary
    globals.css - Tailwind base styles
  lib/
    env/
      index.ts - Environment variable loader
      schema.ts - Zod schema for env vars
      validator.ts - Logic to validate env vars
    seo/
      metadata.ts - Helper for generating Next.js metadata
      structured-data.tsx - JSON-LD component
    shopify/
      client.ts - Main entry point for fetching data (getProducts, getCollection)
      fetch.ts - Core fetch wrapper with specific error handling
      queries.ts - GraphQL query strings
      mutations.ts - GraphQL mutation strings
      fragments.ts - Shared GraphQL fragments (SEO, Product, Cart)
      mock.ts - Mock data fallback for products
    utils/
      metafield-parser.ts - Utility for parsing Shopify Metafields
    utils.ts - General helper functions (cn, etc.)
  components/
    features/
      CollectionWithFilters.tsx - Client Component for browsing collections with filters
      Hero.tsx - Landing page hero section
      ProductGrid.tsx - Grid of Product Cards
      ProductDetails.tsx - (Assuming existence based on plan/user mention, verification pending if file exists)
    layout/
      Navbar.tsx - Top navigation with Cart/Search integration
      Footer.tsx - Site footer
  hooks/
    useCart.ts - Hook for cart operations
    usePriceFormatter.ts - Hook for currency formatting
    useJewelryFilters.ts - Hook for filtering jewelry products
    useMetafieldParser.ts - Hook for accessing parsed metafields
  context/
    CartProvider.tsx - Global cart state management
    ThemeProvider.tsx - Theme context (if implemented)
    SessionProvider.tsx - Auth placeholder
    WishlistProvider.tsx - Wishlist placeholder
  types/
    shopify/
      product.ts - Product & connection types
      collection.ts - Collection types
      cart.ts - Cart types
      image.ts - Image types
    metafield.ts - Jewelry Metafield definitions

*(Note: `middleware.ts` is not currently present in `src/` or root)*

## D. Shopify Integration Details

- **Endpoint format used**: `https://<store>.myshopify.com/api/<API_VERSION>/graphql.json`
- **Authentication header**: `X-Shopify-Storefront-Access-Token`
- **Why 401 errors were occurring**:
  - Wrong domain or token (likely Scope issues for Product reading).
  - Retry logic was incorrectly retrying on 401 (fixed).

## E. shopifyFetch Implementation (Current State)

- **Retry behavior**:
  - Retries only on 429 (rate limit).
  - Does NOT retry on 401 anymore.
- **Error types used**:
  - `ShopifyError`
  - `ShopifyNetworkError`
  - `ShopifyRateLimitError`
- **Cache behavior**:
  - Uses `next: { tags }` when tags are passed.
- **JSON handling**:
  - Throws when `body.errors` exists.
  - Returns `body.data` (unwrapped).

## F. Known Bugs / Issues Encountered

- **Shopify 401 error due to invalid token/domain**: Persistent interaction failure with Products API.
- **Retry logic previously retried on 401 (now fixed)**: Caused slow feedback loops.
- **eslint key in next.config.js was invalid in Next 16**: Removed/Adjusted.
- **ECONNRESET errors appeared due to unnecessary retries**: Solved by fixing retry logic.
- **Placeholder images returning 500 through _next/image**: Caused by missing upstream image access or host config (addressed by `sharp` install and `remotePatterns`).

## G. Changes Made So Far

- Removed retry on 401.
- Kept retry only for 429.
- Clarified correct Shopify endpoint format.
- Identified invalid eslint key in next.config.js.
- Identified that .env.local must use .myshopify.com.
- Implemented **Mock Data Fallback** in `page.tsx`, `products/[handle]`, `collections`, etc. to enable UI work efficiently.
- Fixed Next.js 15 breaking change (awaiting `params`).
- Fixed "Object Object" error logs by JSON-stringifying errors.
- Fixed Collections Link `undefined` href error by using `handle` instead of `path`.
- Implemented **Jewelry Metafields** (Types, Parsing, Hooks, UI Filtering).

## H. Environment Variables (Required)

- `SHOPIFY_STORE_DOMAIN`: Your Myshopify domain (e.g. `store.myshopify.com`).
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN`: Public access token for the Storefront API.
- `SHOPIFY_API_VERSION`: API version string (e.g. `2024-01`).
- `REVALIDATE_TOKEN`: Secret token for ISR revalidation route.

## I. Open Questions / Risks

- **Whether token is correct**: Still receiving 401s for Products (Collections working).
- **Whether API version matches Shopify store**: Potential mismatch if deprecated fields are used.
- **Whether image remotePatterns are fully correct**: Need to ensure all CDN domains are covered.
- **Whether webhook ISR is implemented yet (not done)**: Logic exists but untested with real webhooks.
- **Whether cart expiration handling is complete (not done)**.

3️⃣ OUTPUT REQUIREMENTS

Produce only ONE file: PROJECT_SNAPSHOT.md
