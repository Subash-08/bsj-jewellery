# Bakya home video showcase

The Next.js admin page at `/admin/video-showcase` stores video files in **Shopify Settings → Files**. It stores the home page's heading, enabled flag, video titles, order and Shopify video IDs in a Shopify **Shop metafield** named `bakya.home_video_showcase` (JSON). No video bytes are saved in this repository or in Vercel.

## Shopify app access

The canonical store domain for the connected shop is `pp36ft-1f.myshopify.com`. The storefront may continue using its existing `SHOPIFY_STORE_DOMAIN`; the video feature uses `SHOPIFY_ADMIN_STORE_DOMAIN`.

For a Dev Dashboard custom app installed on a store in your Shopify organization:

1. Create or update the app in Shopify's Dev Dashboard, grant `write_files`, release its version, and install or approve that version on the Bakya store.
2. Set `SHOPIFY_ADMIN_STORE_DOMAIN=pp36ft-1f.myshopify.com`, `SHOPIFY_ADMIN_CLIENT_ID`, and `SHOPIFY_ADMIN_CLIENT_SECRET` in local `.env.local` and Vercel project environment variables. Keep the ID and secret on the server only; never use a `NEXT_PUBLIC_` prefix.
3. Restart the local Next.js server after changing `.env.local`, and redeploy after changing Vercel variables.

The server exchanges the client ID and secret for a short-lived Admin API access token and renews it when needed. If this is an existing legacy admin-created custom app, a valid `SHOPIFY_ADMIN_TOKEN` can be used instead of client credentials. The currently configured local token was rejected with HTTP 401 against both the old domain and the canonical store domain, so it must be replaced or superseded by client credentials.

The app also needs permission to read and write the shop metafield. Shopify applies the access level of the owner resource to `metafieldsSet`. If the admin page reports an access-scope error after authentication, review the app's granted scopes and installation.

## Upload and publishing

1. Open `/admin/video-showcase` while signed in to the Next.js admin.
2. Open the Video Library tab. Choose an MP4, MOV or WebM file (up to 25 MB), enter a title, description and display orientation, and optionally upload a JPEG/PNG/WebP thumbnail (up to 2 MB).
3. The browser sends the file directly to the temporary upload URL issued by Shopify. The Next.js server then calls `fileCreate`; Shopify processes the file asynchronously and saves it under **Settings → Files**.
4. Refresh status until Shopify reports `READY`. Open Video Sections, add or edit a section, choose its heading, subtitle, margins and layout, then attach library videos. Click Add more than once to repeat a video. Save the section.
5. The home page reads the shop metafield and resolves each video ID to its Shopify CDN URL and preview image. It shows only READY videos. Removing a video from the showcase does not delete it from Shopify Files.

The checkout domain, Hostinger DNS and Vercel domain routing do not host these files and need no video-specific DNS change.

The version 2 configuration separates the reusable library from up to 20 ordered sections. Each section supports up to 24 placements, including repeated references to the same video. Existing single-section settings are migrated in memory on read, and saved in the new format on the next edit. Removing a library entry removes its placements but retains the Shopify file. Removing a section retains its library videos. Concurrent edits are checked using Shopify's metafield digest; refresh before retrying a conflicting save.

Layouts: Hero Highlight, Equal Grid, Horizontal Slider, Vertical Reels and Spotlight Split. Section order is controlled by the up/down buttons. Public players show Shopify's duration and load media metadata without autoplay; titles are available as accessible labels rather than visible captions.

Shopify references: [client credentials](https://shopify.dev/docs/apps/build/authentication-authorization/client-credentials-grant), [fileCreate](https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/fileCreate), [stagedUploadsCreate](https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/stagedUploadsCreate), [metafieldsSet](https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/metafieldsSet).
