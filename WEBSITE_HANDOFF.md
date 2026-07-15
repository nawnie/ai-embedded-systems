# AI Embedded Systems Website Handoff

## What This Project Is

This repository contains the public AI Embedded Systems website and protected workspace infrastructure.

Live production URLs:

- https://aiembeddedsystems.com/
- https://www.aiembeddedsystems.com/
- https://ai-embedded-systems.pages.dev/

Cloudflare Pages project:

- Project name: `ai-embedded-systems`
- Correct Cloudflare account email: `shawnohagan2@gmail.com`
- Correct Cloudflare account ID: `a04ca5179be4986e4686e12e6955457c`

Do not deploy this website to the `Gentle Bridge` Cloudflare account.

## Current Review Work

The public-homepage commercial revamp is on:

```text
revamp/private-ai-feasibility-sprint
```

The previous public homepage is preserved on:

```text
archive/site-before-feasibility-sprint-2026-07-14
```

Coding agents must read the repository-root `AGENTS.md` and `design-qa.md` before editing or deploying. The protected workspace and its supporting backend infrastructure are outside the scope of the public-homepage revamp.

The revamp centers the commercial homepage on the Private AI Feasibility Sprint while retaining RNV1 robotics as evidence of physical-world engineering.

## Current People And Roles

- Shawn O'Hagan: Co-Founder, Software & AI
- Robert Delgado: Co-Founder, Robotics

Keep these roles consistent in:

- `src/App.jsx`
- `index.html` JSON-LD and no-JavaScript fallback
- `public/llms.txt`
- `public/AGENTS.md`
- `public/humans.txt`

## Local Development

From the repository root:

```powershell
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:5173/
```

## Build And QA

```powershell
npm run build
npm run qa:capture
```

Build output goes to:

```text
dist/
```

Local QA screenshots and reports go to:

```text
.qa/
```

The `.qa/` directory is ignored by Git. Do not claim the revamp passed visual QA without inspecting the compiled desktop, tablet, mobile, and mobile-menu renders.

## Deploy

Production deployment is manual. Merging to `master` does not prove the live site was published.

Use the correct Cloudflare account ID:

```powershell
$env:CLOUDFLARE_ACCOUNT_ID = "a04ca5179be4986e4686e12e6955457c"
npx --yes wrangler pages deploy dist --project-name ai-embedded-systems --branch main --commit-dirty=true
```

If Wrangler is not authenticated:

```powershell
npx --yes wrangler login
```

Do not deploy until the user explicitly approves production release and the completion gate in `AGENTS.md` is satisfied.

## SEO And Public AI Files

Public files live in:

```text
public/
```

Current files include:

- `robots.txt`
- `sitemap.xml`
- `llms.txt`
- `AGENTS.md`
- `humans.txt`
- `_headers`
- `og-rnv1.png`

The canonical SEO URL is:

```text
https://aiembeddedsystems.com/
```

`public/AGENTS.md` is public crawler context. It is not the repository coding-agent contract. Coding agents must follow the root `AGENTS.md`.

## DNS Notes

Cloudflare DNS should contain proxied CNAME records:

- `aiembeddedsystems.com` -> `ai-embedded-systems.pages.dev`
- `www.aiembeddedsystems.com` -> `ai-embedded-systems.pages.dev`

If the root domain fails only on Shawn's PC but public resolvers work, check local/router DNS first. On 2026-07-01 the local router DNS at `192.168.1.1` returned no IPv4 A record for the apex/root domain while Cloudflare DNS worked.

## Security And Secrets

Do not add Cloudflare API tokens, credentials, private environment values, or workspace secrets to the repository. Do not alter workspace access controls, D1 data, migrations, bindings, functions, or authentication as part of public-homepage work.
