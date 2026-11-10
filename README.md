# خارج النص | Khalifa website

Arabic, right-to-left editorial site for Khalifa Jumaa Al Rumaithi. React 19, TypeScript, Vite, Tailwind, Cloudflare Pages Functions, and D1.

## Development

Use Node 24 and the pinned pnpm 10.34.9. Commit dependency changes together with pnpm-lock.yaml.

```sh
npx pnpm@10.34.9 install --frozen-lockfile
npx pnpm@10.34.9 check
npx pnpm@10.34.9 test
npx pnpm@10.34.9 build
```

`pnpm dev` is a frontend-only Vite server. To exercise articles and authentication, use Cloudflare's local runtime:

1. Copy `.dev.vars.example` to `.dev.vars`. Set a local-only password of at least 16 characters and a random signing secret of at least 32 characters. These files are ignored by Git.
2. Build the site, then initialize the **local** database and start Pages:

```sh
pnpm exec wrangler d1 execute khalifa-local --local --file schema.sql
pnpm exec wrangler pages dev dist/public
```

Open the localhost URL Wrangler reports. Secure session cookies work on localhost. Do not expose this development server to the public internet. The test suite uses Node's built-in SQLite to exercise the SQL and real request handlers; Cloudflare local-runtime browser checks complement those tests.

## Deployment of the security upgrade

Production is the existing Cloudflare Pages project serving `khaleefa-alromaithi11.ae`. Keep its Git integration, domain, and dashboard-managed `DB` binding. `wrangler.toml` is **local-only**, intentionally without `pages_build_output_dir`. Do not add that key with the local database settings: Cloudflare would use the file as production configuration.

The November 2026 rollout uses `khalifa-articles-production` for production and `khalifa-articles-preview` for preview. The original `khalifa-articles` database was empty and is retained as a legacy backup. This separation prevents historical deployments containing the exposed credential from modifying new production content. Historical deployments must remain behind Cloudflare Access at `*.khalifa-website.pages.dev`; the custom domain remains public. Do not retry, roll back to, or redeploy vulnerable source against the current production binding. Older revision-unaware handlers must also remain restricted, even if they use the current database. Deploy only reviewed upgraded revisions.

Before merging changes into the production branch:

1. In Cloudflare, verify the existing Pages project and the D1 database bound as `DB`. Back up that database. Use a separate preview database for preview testing.
2. Apply `migrations/0001_admin_security.sql` to the existing production database and to the preview database. This only adds session/throttle tables and indexes; it does not replace articles. For existing databases, inspect `PRAGMA table_info(articles)` and apply `migrations/0002_article_revision.sql` once if the `revision` column is absent. This preserves existing articles and initializes their revision to 1. New empty databases use the current `schema.sql` instead. Never reapply the revision ALTER statement blindly.
3. Add encrypted Pages secrets in each environment: `ADMIN_PASSWORD` (a new unique password, minimum 16 characters) and `SESSION_SECRET` (random, minimum 32 characters). Never reuse the previously exposed password. Set these privately in the dashboard; do not put them in Git, build variables prefixed `VITE_`, or chat.
4. Build command: `npx pnpm@10.34.9 install --frozen-lockfile && npx pnpm@10.34.9 build`; output: `dist/public`; use Node 24. Preserve any existing equivalent configuration.
5. Deploy the branch preview and verify public pages, empty/error states, admin login, create/edit, logout, and the mobile layout. Confirm preview writes use only its preview database.
6. After review, merge/deploy to production and verify the same behavior. Use only the tested commit as the production source. Keep preview and production data isolated.

Missing secrets or auth tables intentionally disable admin login; public reads continue when `DB` and the articles table are available. Do not deploy the new admin flow before the prerequisites are ready.

Cloudflare references: [Pages configuration](https://developers.cloudflare.com/pages/functions/wrangler-configuration/), [D1 bindings and encrypted secrets](https://developers.cloudflare.com/pages/functions/bindings/), [preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/).

## Content and branding

- Add real articles at `/admin`; they receive shareable `/articles/:id` links. No demo articles are automatically published or substituted for outages.
- Configure contact links and portrait in `client/src/config/site.ts`. WhatsApp is intentionally disabled until a verified number is supplied. Instagram remains available.
- Original portrait, logos, calligraphy background and fonts are served from `client/public/media/` on the site's own domain. Keep their existing visual identity.
- Podcast remains an honest coming-soon page until episodes are supplied.
- Cloudflare middleware emits route-specific titles, descriptions, canonical and Open Graph tags, plus Article JSON-LD for published articles. Unknown routes and missing article documents return 404; database outages return 503 rather than a misleading 404. `/sitemap.xml` is generated from current article IDs and splits into bounded sitemap pages when needed. Browser navigation keeps metadata in sync. Public article data is allowed in robots.txt; admin/auth routes remain excluded.
- Archive search, category, year and page are encoded in URL parameters. Pagination uses real links; filtered searches are noindex with a canonical unfiltered page URL. Route variants redirect to the canonical spelling without changing opaque article IDs.
- Responsive lossless WebP logo variants retain the original artwork. Original asset files remain available. Unused template components and packages are removed from the production dependency tree.

## Authentication and maintenance

Admin sessions use an opaque `__Host-` cookie with HttpOnly, Secure, SameSite=Strict and an eight-hour server expiry. D1 stores keyed hashes, not cookie tokens. Logout revokes the server session. Mutations require a same-origin request; old bearer tokens are not accepted. Login is limited to ten attempts per IP per aligned 15-minute window. Cleanup runs on attempts and successful logins. Distributed abuse still belongs behind Cloudflare's edge controls.

To revoke every session, rotate `SESSION_SECRET` and redeploy. Change `ADMIN_PASSWORD` at the same time if it was exposed. Historical Git commits still contain the old credential, so rotation is required; deleting it from the latest source does not erase history.

The editor retains a failed draft in the open tab and offers reauthentication when a session expires. Inputs are disabled while a save is pending, so later typing cannot be silently discarded. Every update/delete requires the fetched integer revision as a strong `If-Match` tag. Stale writes return 409 and preserve the draft; missing preconditions return 428. Loading the newest version is explicit and warns before replacing the draft. It warns before leaving with unsaved changes; drafts are not durably backed up across browser crashes.

The existing lightweight Express server is a static-only convenience. Production metadata, HTTP statuses, authentication and articles must be verified using the Pages local runtime or a Pages preview, not `pnpm start`. Cloudflare `_routes.json` keeps fingerprinted JS, CSS, media, favicon and robots on the static asset path. Dynamic HTML strips shell validators so a stale conditional request cannot become an empty 200 response.
