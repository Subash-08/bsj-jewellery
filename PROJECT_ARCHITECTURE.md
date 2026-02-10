# PROJECT_ARCHITECTURE.md

## A. Project Overview

This project is a **Headless Shopify** store built with **Next.js (App Router)**.

- **Frontend**: Next.js serves as the frontend application.
- **Backend / Commerce Engine**: Shopify is the single source of truth for products, collections, inventory, and order management.
- **API**: The project exclusively uses the **Shopify Storefront GraphQL API**.
- **Checkout**: Users are redirected to the standard **Shopify Hosted Checkout** to complete purchases.
- **Deployment**: The architecture is designed for deployment on **Vercel** (or compatible Node.js/Edge environments).

## B. Technology Stack

- **Framework**: Next.js 16.1.6 (Turbopack enabled)
- **Routing**: App Router (`src/app`)
- **Language**: TypeScript (Strict Mode)
- **Data Fetching**: Native Web `fetch` API (No Axios, No Apollo Client)
- **API Integration**: Shopify Storefront GraphQL API
- **Caching**: Incremental Static Regeneration (ISR) with tag-based revalidation
- **Image Optimization**: `next/image` configured with Shopify CDN remote patterns
- **State Management**: React Context (`CartProvider`, `SessionProvider`) for client state; Server Components for data state.
- **Environment**: Custom validation layer (`src/lib/env`) using Zod.

## C. Exact Folder Structure

The project follows a standard Next.js App Router structure within the `src/` directory:

```text
src/
├── app/
│   ├── (routes)/               # Route groups (URL paths)
│   │   ├── collections/        # Collection pages
│   │   │   ├── [handle]/       # Dynamic collection detail Route
│   │   │   └── page.tsx        # Collections listing Route
│   │   ├── products/           # Product pages
│   │   │   └── [handle]/       # Dynamic product detail Route
│   │   └── search/             # Search functionality
│   ├── api/                    # API Route Handlers
│   │   ├── revalidate/         # ISR Revalidation endpoint
│   │   └── webhooks/           # Shopify Webhook receivers
│   ├── error.tsx               # Global Error Boundary
│   ├── layout.tsx              # Root Layout (Providers, HTML shell)
│   ├── not-found.tsx           # Global 404 Page
│   └── page.tsx                # Home Page Route
├── components/
│   ├── features/               # Domain-specific components (Hero, ProductGrid)
│   └── layout/                 # Structural components (Navbar, Footer)
├── context/                    # React Context Providers (Global State)
│   ├── CartProvider.tsx        # Cart state management
│   ├── SessionProvider.tsx     # Session management
│   └── ThemeProvider.tsx       # UI Theme management
├── hooks/                      # Custom React Hooks
│   ├── useCart.ts             # Cart logic hook
│   └── usePriceFormatter.ts   # Currency formatting hook
├── lib/                        # Core Utilities & Logic
│   ├── env/                    # Environment Variable Validation
│   ├── seo/                    # Metadata & Structured Data helpers
│   ├── shopify/                # Shopify Integration Layer
│   │   ├── client.ts           # Primary Data Access Object (DAO)
│   │   ├── fetch.ts            # Fetch wrapper with headers/error handling
│   │   ├── fragments.ts        # GraphQL Fragments
│   │   ├── mock.ts             # Mock data utilities
│   │   ├── mutations.ts        # GraphQL Mutations
│   │   └── queries.ts          # GraphQL Queries
│   └── utils.ts                # General helpers (class merging etc.)
└── types/                      # TypeScript Definitions
    └── shopify/                # Shopify Domain Types (Product, Cart, etc.)
```

## D. Data Flow & Workflow

### 1. Product Data Flow
1.  **Request**: Next.js Server Components (e.g., `Page`) initiate a data request using functions in `src/lib/shopify/client.ts`.
2.  **Query**: `client.ts` selects the appropriate GraphQL query from `src/lib/shopify/queries.ts`.
3.  **Fetch**: The request is passed to `src/lib/shopify/fetch.ts`, which:
    -   Adds the `X-Shopify-Storefront-Access-Token` header.
    -   Adds the `Content-Type: application/json` header.
    -    executes a native `fetch` to the Shopify GraphQL endpoint.
4.  **Response**: Shopify returns a JSON GraphQL response.
5.  **Transformation**: The raw response is unwrapped (accessing `data.body`) in `fetch.ts` and returned to the component.
6.  **Rendering**: The Server Component renders the UI using the typed data.

### 2. Caching & ISR Workflow
-   **Static Rendering**: By default, listing pages and detail pages are statically generated at build time.
-   **ISR (Incremental Static Regeneration)**: Data requests include `next: { tags: [...] }`.
-   **Revalidation**:
    -   Shopify sends a webhook (e.g., product update) to `src/app/api/webhooks/shopify`.
    -   The webhook handler processes the event.
    -   If valid, it triggers `src/app/api/revalidate`, which calls `revalidateTag()`.
    -   Next.js clears the cache for the specific tag, ensuring fresh data on the next request.

### 3. Cart Workflow
-   **Storage**: The Cart is maintained on Shopify's server.
-   **Session**: The browser stores only the `cartId` (handled via cookies/local storage in `CartProvider`).
-   **Operations**:
    -   `addToCart`, `removeFromCart` call Shopify Mutations via `client.ts`.
    -   The local `cartId` is sent with every mutation to identify the session.
-   **Checkout**: When the user clicks "Checkout", the application redirects the browser to the `checkoutUrl` provided by the Shopify Cart API.

### 4. Image Handling
-   **Source**: Images are stored on Shopify's CDN (`cdn.shopify.com`).
-   **Optimization**: Next.js `next/image` component optimizes images on-demand.
-   **Configuration**: `next.config.js` contains `remotePatterns` to authorize `cdn.shopify.com`.

## E. Shopify Integration Design

-   **GraphQL Endpoint**:
    ```text
    https://<store>.myshopify.com/api/<API_VERSION>/graphql.json
    ```
-   **Authentication**:
    Authenticated via the HTTP Header:
    ```text
    X-Shopify-Storefront-Access-Token: <SHOPIFY_STOREFRONT_ACCESS_TOKEN>
    ```
-   **Configuration Location**: `src/lib/shopify/fetch.ts` constructs the endpoint and headers using environment variables.

## F. Environment Variables

The system relies on the following mandatory environment variables:

| Variable | Description |
| :--- | :--- |
| `SHOPIFY_STORE_DOMAIN` | The `.myshopify.com` domain of the store (e.g., `brand.myshopify.com`). |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Public token for the Storefront API (Manage > Apps > Headless). |
| `SHOPIFY_API_VERSION` | Target API version (e.g., `2024-01`). |
| `REVALIDATE_TOKEN` | Secret token used to secure the ISR revalidation API route. |

## G. File Responsibilities (Quick Reference Table)

| File | Purpose |
| :--- | :--- |
| `src/lib/shopify/fetch.ts` | Base wrapper around native `fetch`. Handles headers, auth, and error normalization. |
| `src/lib/shopify/client.ts` | Data Access Layer. Exposes domain-specific functions (`getProducts`, `addToCart`). |
| `src/lib/shopify/queries.ts` | Stores raw GraphQL query strings. |
| `src/app/page.tsx` | Home Route. Renders landing page UI. |
| `src/app/(routes)/collections/page.tsx` | Collections Index. Renders grid of all collections. |
| `src/app/(routes)/collections/[handle]/page.tsx` | Single Collection Route. Renders products within a specific collection. |
| `src/app/(routes)/products/[handle]/page.tsx` | Product Detail Route. Renders full product information. |
| `src/context/CartProvider.tsx` | Client-side React Context for managing Cart ID and optimistic UI updates. |
| `src/app/api/revalidate/route.ts` | API endpoint to manually trigger Next.js cache revalidation. |
