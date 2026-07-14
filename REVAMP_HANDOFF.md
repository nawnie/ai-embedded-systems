# Private AI Feasibility Sprint Homepage Revamp

Branch: `revamp/private-ai-feasibility-sprint`

## Scope

This branch changes only the public homepage presentation and homepage metadata:

- `src/App.jsx`
- `src/styles.css`
- `index.html`

The protected `/workspace` surface, Cloudflare functions, API routes, D1 schema, redirects, and workspace assets are intentionally untouched.

## Design Direction

- Warm cream and paper surfaces
- Charcoal typography
- Olive calls to action and rules
- Parchment-toned sticky navigation with a visible olive separator
- Slightly darker Private AI Feasibility Sprint band for section contrast
- Editorial typography and restrained borders instead of neon blue, glassmorphism, or generic AI gradients

## Primary Offer

Private AI Feasibility Sprint: `$3,500`

- Discovery session
- Private AI and hardware assessment
- Data, security, and risk review
- ROI and difficulty ranking
- Prototype or workflow demonstration
- 90-day implementation roadmap
- 50% upfront, 50% at delivery

## Contact Behavior

Consultation and sprint buttons use `mailto:` links to:

- `sohagan.dev@aiembeddedsystems.com`

Robotics contact remains visible:

- `robert@aiembeddedsystems.com`

No unverified phone number or scheduling URL was added.

## Validation Completed

- JSX transpile validation passed with TypeScript.
- CSS parse validation passed with PostCSS.
- JSON-LD parsing passed.
- Branch diff confirms only public homepage files changed before this handoff file was added.

## Deployment Boundary

The repository handoff documents a manual Cloudflare Pages deployment using Wrangler. Merging this branch does not by itself prove that the live site has been deployed. Build locally, review desktop/mobile, then publish the `dist/` directory to the existing `ai-embedded-systems` Cloudflare Pages project.
