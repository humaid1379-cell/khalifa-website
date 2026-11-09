# خارج النص | Khalifa website

Arabic, right-to-left editorial site for Khalifa Jumaa Al Rumaithi. React 19, TypeScript, Vite, Tailwind, Cloudflare Pages Functions, and D1.

## Development

Use Node 24 and the pinned pnpm 10.4.1. The lockfile is unchanged by this upgrade.

```sh
npx pnpm@10.4.1 install --frozen-lockfile
npx pnpm@10.4.1 check
npx pnpm@10.4.1 test
npx pnpm@10.4.1 build
```

`pnpm dev` is a frontend-only Vite server. To exercise articles and authentication, use Cloudflare's local runtime:

1. Copy `.dev.vars.example` to `.dev.vars`. Set a local-only password of at least 16 characters and a random signing secret of at least 32 characters. These files are ignored by Git.
2. Build the site, then initialize the **local** database and start Pages:

```sh
npx wrangler@4.158.0 d1 execute khalifa-local --local --file schema.sql
npx wrangler@4.158.0 pages dev dist/public
```

Open the localhost URL Wrangler reports. Secure session cookies work on localhost. Do not expose this development server to the public internet. The test suite uses Node's built-in SQLite to exercise the SQL and real request handlers; Cloudflare local-runtime browser checks complement those tests.

## Deployment of the security upgrade

Production is the existing Cloudflare Pages project serving `khaleefa-alromaithi11.ae`. Keep its Git integration, domain, and dashboard-managed `DB` binding. `wrangler.toml` is **local-only**, intentionally without `pages_build_output_dir`. Do not add that key with the local database settings: Cloudflare would use the file as production configuration.

The November 2026 rollout uses `khalifa-articles-production` for production and `khalifa-articles-preview` for preview. The original `khalifa-articles` database was empty and is retained as a legacy backup. This separation prevents historical deployments containing the exposed credential from modifying new production content. Those old deployments still exist and can access their legacy database; do not retry, roll back to, or redeploy their vulnerable source against the new production binding. Deploy only reviewed upgraded revisions.

Before merging the upgrade into the production branch:

1. In Cloudflare, verify the existing Pages project and the D1 database bound as `DB`. Back up that database. Use a separate preview database for preview testing.
2. Apply `migrations/0001_admin_security.sql` to the existing production database and to the preview database. This only adds session/throttle tables and indexes; it does not replace articles. New empty databases may use `schema.sql` instead.
3. Add encrypted Pages secrets in each environment: `ADMIN_PASSWORD` (a new unique password, minimum 16 characters) and `SESSION_SECRET` (random, minimum 32 characters). Never reuse the previously exposed password. Set these privately in the dashboard; do not put them in Git, build variables prefixed `VITE_`, or chat.
4. Build command: `npx pnpm@10.4.1 install --frozen-lockfile && npx pnpm@10.4.1 build`; output: `dist/public`; use Node 24. Preserve any existing equivalent configuration.
5. Deploy the branch preview and verify public pages, empty/error states, admin login, create/edit, logout, and the mobile layout. Confirm preview writes use only its preview database.
6. After review, merge/deploy to production and verify the same behavior. Until deployed, the old public site's exposed password flow remains unchanged.

Missing secrets or auth tables intentionally disable admin login; public reads continue when `DB` and the articles table are available. Do not deploy the new admin flow before the prerequisites are ready.

Cloudflare references: [Pages configuration](https://developers.cloudflare.com/pages/functions/wrangler-configuration/), [D1 bindings and encrypted secrets](https://developers.cloudflare.com/pages/functions/bindings/), [preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/).

## Content and branding

- Add real articles at `/admin`; they receive shareable `/articles/:id` links. No demo articles are automatically published or substituted for outages.
- Configure contact links and portrait in `client/src/config/site.ts`. WhatsApp is intentionally disabled until a verified number is supplied. Instagram remains available.
- Original portrait, logos, calligraphy background and fonts are served from `client/public/media/` on the site's own domain. Keep their existing visual identity.
- Podcast remains an honest coming-soon page until episodes are supplied.
- The static sitemap lists the three public landing pages. Article titles/descriptions update in the browser; route-specific crawler metadata/server rendering is not included in this SPA upgrade.

## Authentication and maintenance

Admin sessions use an opaque `__Host-` cookie with HttpOnly, Secure, SameSite=Strict and an eight-hour server expiry. D1 stores keyed hashes, not cookie tokens. Logout revokes the server session. Mutations require a same-origin request; old bearer tokens are not accepted. Login is limited to ten attempts per IP per aligned 15-minute window. Cleanup runs on attempts and successful logins. Distributed abuse still belongs behind Cloudflare's edge controls.

To revoke every session, rotate `SESSION_SECRET` and redeploy. Change `ADMIN_PASSWORD` at the same time if it was exposed. Historical Git commits still contain the old credential, so rotation is required; deleting it from the latest source does not erase history.

The editor retains a failed draft in the open tab and offers reauthentication when a session expires. It warns before leaving with unsaved changes; drafts are not durably backed up across browser crashes.
