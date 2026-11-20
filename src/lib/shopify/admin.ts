import 'server-only'

type GraphqlEnvelope<T> = { data?: T; errors?: Array<{ message: string }> | string }
type TokenResponse = { access_token?: string; expires_in?: number; error?: string; error_description?: string }

let cachedToken: { value: string; expiresAt: number } | null = null
let tokenRequest: Promise<string> | null = null

function adminDomain(): string {
  const value = (process.env.SHOPIFY_ADMIN_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN || '')
    .trim().replace(/^https?:\/\//, '').replace(/\/$/, '')
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i.test(value)) {
    throw new Error('Set SHOPIFY_ADMIN_STORE_DOMAIN to the store’s canonical .myshopify.com domain')
  }
  return value
}

async function requestClientCredentialsToken(domain: string): Promise<string> {
  const clientId = process.env.SHOPIFY_ADMIN_CLIENT_ID?.trim()
  const clientSecret = process.env.SHOPIFY_ADMIN_CLIENT_SECRET?.trim()
  if (!clientId || !clientSecret) throw new Error('Shopify Admin client credentials are not configured')
  const response = await fetch(`https://${domain}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret }),
    cache: 'no-store',
  })
  const raw = await response.text()
  let data: TokenResponse = {}
  try { data = JSON.parse(raw) as TokenResponse } catch { /* Shopify may return an HTML error page. */ }
  if (!response.ok || !data.access_token) {
    const knownErrors: Record<string, string> = {
      app_not_installed: 'Install Bakya Website Videos on this Shopify store first. Open the app in Dev Dashboard, select Install app, choose the Bakya store and approve installation.',
      shop_not_permitted: 'The Shopify app and store are not in the same organization. Client credentials require the same organization; otherwise an OAuth installation flow is needed.',
      invalid_client: 'The Shopify client ID or secret is invalid. Copy both from the same installed app’s Settings → Credentials.',
    }
    const errorCode = Object.keys(knownErrors).find((code) => data.error === code || raw.includes(code))
    if (errorCode) throw new Error(`Shopify authentication (${response.status}, ${errorCode}): ${knownErrors[errorCode]}`)
    throw new Error(`Shopify app credentials were rejected (${response.status}). Check the client ID, secret, app installation and store domain.`)
  }
  const lifetime = Math.max(60, Number(data.expires_in) || 3600)
  cachedToken = { value: data.access_token, expiresAt: Date.now() + Math.max(1, lifetime - 120) * 1000 }
  return data.access_token
}

async function accessToken(domain: string): Promise<string> {
  if (process.env.SHOPIFY_ADMIN_CLIENT_ID && process.env.SHOPIFY_ADMIN_CLIENT_SECRET) {
    if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value
    if (!tokenRequest) {
      tokenRequest = requestClientCredentialsToken(domain).finally(() => { tokenRequest = null })
    }
    return tokenRequest
  }
  const token = process.env.SHOPIFY_ADMIN_TOKEN?.trim()
  if (!token) throw new Error('Configure Shopify Admin client credentials or a legacy Admin API token')
  return token
}

export async function shopifyAdmin<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const domain = adminDomain()
  const version = process.env.SHOPIFY_API_VERSION || '2026-10'
  const endpoint = `https://${domain}/admin/api/${version}/graphql.json`
  let response: Response | null = null
  for (let attempt = 0; attempt < 2; attempt++) {
    const token = await accessToken(domain)
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
    })
    if (response.status !== 401) break
    if (!process.env.SHOPIFY_ADMIN_CLIENT_ID || !process.env.SHOPIFY_ADMIN_CLIENT_SECRET || attempt === 1) break
    cachedToken = null
  }
  if (!response) throw new Error('Shopify Admin API did not respond')
  if (response.status === 401) {
    throw new Error('Shopify Admin authentication failed (401). Configure a valid app client ID and secret, or replace the legacy Admin API token.')
  }
  if (!response.ok) throw new Error(`Shopify Admin API returned ${response.status}`)
  const payload = await response.json() as GraphqlEnvelope<T>
  if (payload.errors) {
    const errors = Array.isArray(payload.errors) ? payload.errors.map((error) => error.message).join('; ') : payload.errors
    throw new Error(errors)
  }
  if (!payload.data) throw new Error('Shopify Admin API returned no data')
  return payload.data
}
