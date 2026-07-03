# Ai Embedded Systems Website Handoff

## What This Project Is

This is the live Ai Embedded Systems website prototype for robotics and embedded AI.

Live production URLs:

- https://aiembeddedsystems.com/
- https://www.aiembeddedsystems.com/
- https://ai-embedded-systems.pages.dev/

Cloudflare Pages project:

- Project name: `ai-embedded-systems`
- Correct Cloudflare account email: `shawnohagan2@gmail.com`
- Correct Cloudflare account ID: `a04ca5179be4986e4686e12e6955457c`

Do not deploy this website to the `Gentle Bridge` Cloudflare account.

## Current People And Roles

- Shawn O'Hagan: Co-Founder, Software & AI
- Robert Delgado: Co-Founder, Robotics

These roles appear in:

- `src/App.jsx`
- `index.html` JSON-LD and no-JavaScript fallback
- `public/llms.txt`
- `public/AGENTS.md`

Keep those files consistent when editing role or company details.

## Local Development

From this folder:

```powershell
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:5173/
```

## Build

```powershell
npm run build
```

Build output goes to:

```text
dist/
```

## Deploy

Use the correct Cloudflare account ID:

```powershell
$env:CLOUDFLARE_ACCOUNT_ID = "a04ca5179be4986e4686e12e6955457c"
npx --yes wrangler pages deploy dist --project-name ai-embedded-systems --branch main --commit-dirty=true
```

If Wrangler is not authenticated:

```powershell
npx --yes wrangler login
```

## SEO And Public AI Files

Public files live in:

```text
public/
```

Current files:

- `robots.txt`
- `sitemap.xml`
- `llms.txt`
- `AGENTS.md`
- `_headers`
- `og-rnv1.png`

The canonical SEO URL is:

```text
https://aiembeddedsystems.com/
```

## DNS Notes

Cloudflare DNS should contain proxied CNAME records:

- `aiembeddedsystems.com` -> `ai-embedded-systems.pages.dev`
- `www.aiembeddedsystems.com` -> `ai-embedded-systems.pages.dev`

If the root domain fails only on Shawn's PC but public resolvers work, check local/router DNS first. On 2026-07-01 the local router DNS at `192.168.1.1` returned no IPv4 A record for the apex/root domain while Cloudflare DNS worked.

## Archive Contents

This handoff archive intentionally includes:

- source code
- public SEO and AI context files
- built `dist`
- QA screenshots and design notes
- `node_modules`
- deployment notes

It does not include Cloudflare API tokens. Do not add secrets to this project.
