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
2. Choose an MP4 or MOV file (up to 100 MB), enter a title and upload.
3. The browser sends the file directly to the temporary upload URL issued by Shopify. The Next.js server then calls `fileCreate`; Shopify processes the file asynchronously and saves it under **Settings → Files**.
4. Refresh status until Shopify reports `READY`. Set the section heading and description, enable it, then save.
5. The home page reads the shop metafield and resolves each video ID to its Shopify CDN URL and preview image. It shows only READY videos. Removing a video from the showcase does not delete it from Shopify Files.

The checkout domain, Hostinger DNS and Vercel domain routing do not host these files and need no video-specific DNS change.

Shopify references: [client credentials](https://shopify.dev/docs/apps/build/authentication-authorization/client-credentials-grant), [fileCreate](https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/fileCreate), [stagedUploadsCreate](https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/stagedUploadsCreate), [metafieldsSet](https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/metafieldsSet).
