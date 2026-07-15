# AGENTS.md

## Purpose

This repository contains the public AI Embedded Systems website and protected workspace infrastructure. This file is the authoritative implementation contract for Codex and other coding agents.

Current review branch:

```text
revamp/private-ai-feasibility-sprint
```

Draft pull request: `#1`

Previous public homepage archive:

```text
archive/site-before-feasibility-sprint-2026-07-14
```

## Required Reading

Before changing code:

1. Read this file completely.
2. Read `design-qa.md` for the senior-review findings, fidelity ledger, validation already completed, and remaining release gate.
3. Read `WEBSITE_HANDOFF.md` for Cloudflare Pages deployment details.
4. Treat `public/AGENTS.md` as public crawler context, not as repository instructions.
5. Inspect the current branch and PR diff before editing.

## Hard Safety Boundary

Do not modify the protected workspace or its supporting infrastructure while finishing the public homepage revamp.

This prohibition includes any route, file, component, function, middleware, asset, schema, migration, binding, configuration, or data path involving:

- `workspace`
- authentication or authorization
- sessions or access controls
- Cloudflare Functions unrelated to the public homepage
- D1 data, schemas, or migrations
- secrets or environment variables
- Wrangler bindings or account configuration
- canonical-domain redirect behavior

If a requested change appears to require touching the workspace or backend, stop and ask the user before editing.

Ordinary revamp work should remain limited to:

- `src/App.jsx`
- `src/styles.css`
- `src/assets/hero-circuit.svg`
- `src/assets/studio-workbench.svg`
- `index.html`
- public crawler/context files under `public/`
- frontend QA scripts and documentation

Do not remove, rename, restyle, or rewire workspace files as collateral cleanup.

## Product Goal

The public homepage should help AI Embedded Systems obtain paid commercial work quickly.

Primary offer:

**Private AI Feasibility Sprint — $3,500 founding-client price**

The page must clearly communicate:

- who the company helps
- the operational problems it addresses
- why private/local AI and embedded systems matter
- what the sprint includes
- what the client receives
- how to start a conversation

The current conversion action is a prefilled `mailto:` link because no verified scheduling URL has been supplied. Do not label this action “Book” as though it opens a calendar. Use “Request a consultation” or “Request your sprint” until the user provides a real booking link.

## Audience

Prioritize operations-heavy organizations where privacy, reliability, real-world integration, or local compute matter:

- hospitality and resorts
- manufacturing
- property management
- robotics and automation
- local government
- healthcare operations

Do not invent customers, case studies, testimonials, certifications, compliance status, performance metrics, partnerships, awards, funded pilots, savings, or ROI.

## Approved Design Direction

The approved direction is human, editorial, practical, and quietly technical.

Use:

- warm cream and paper surfaces
- charcoal typography
- muted olive accents
- a parchment sticky navigation bar with a visible olive separator
- restrained borders and print-like texture
- clear hierarchy and purposeful spacing
- the warm processor image in `src/assets/hero-circuit.svg`
- the human engineering-workbench image in `src/assets/studio-workbench.svg`
- serif display typography for major section headings
- system sans-serif typography for body copy and controls

Core color intent:

```text
paper         #F5F0E6
paper light   #FBF8F1
header        #ECE7DA
sprint band   #DDD4C4
ink           #1E1E1B
charcoal      #1B1D19
olive         #66652C
olive dark    #4D4D22
```

Avoid:

- neon blue or cyan as the dominant palette
- generic AI glows or stock circuit imagery
- glassmorphism
- floating dashboard fragments used only as decoration
- excessive pills, badges, bento grids, nested cards, or fake metrics
- glossy image-card grids
- animation that competes with the offer
- reverting toward the previous white/cyan robotics homepage

The old `src/assets/approved-reference.png` and existing `qa/prototype-*.png` captures belong to the previous site. They are not the source of truth for this revamp.

## Information Architecture

Keep this order unless the user explicitly approves a change:

1. sticky header
2. hero with commercial promise and honest primary CTA
3. Private AI Feasibility Sprint with price, scope, outcomes, and payment structure
4. industries served
5. why-us section with workbench visual, founders, and direct contact
6. final private-AI CTA band
7. footer with technical-topic links

Do not add nonprofit messaging, donation language, an investor pitch, unrelated dashboards, or a new pricing matrix to this commercial homepage.

## Copy Rules

- Write plainly and specifically.
- Prefer operational language over futurist language.
- Keep RNV1 visible as evidence of physical-world engineering, not as the only business offer.
- Use “private AI,” “local AI,” and “embedded systems” accurately.
- Do not imply guaranteed security, compliance, savings, revenue, or ROI.
- Do not claim HIPAA, SOC 2, ISO, FedRAMP, or other compliance without verified evidence from the user.
- Preserve founder roles:
  - Shawn O'Hagan — Co-Founder, Software & AI
  - Robert Delgado — Co-Founder, Robotics
- Preserve verified emails:
  - `sohagan.dev@aiembeddedsystems.com`
  - `robert@aiembeddedsystems.com`
- Do not add a phone number, address, calendar URL, customer logo, or social profile unless verified by the user.

## Frontend Engineering Requirements

- Keep the existing React + Vite stack.
- Keep components focused and readable. `App` should remain composition glue.
- Preserve the skip link, site header, one `main`, labeled sections, one H1, and footer landmark.
- Keep keyboard focus visible.
- Keep mobile navigation operable with keyboard, Escape, and link selection.
- Return focus to the menu control after Escape closes the menu.
- Use `aria-expanded`, `aria-controls`, and `aria-current` correctly.
- Respect `prefers-reduced-motion`.
- Do not add a heavy UI framework.
- Do not add remote font requests. The privacy-oriented site uses system font stacks.
- Keep external dependencies and JavaScript minimal.
- Keep real text and controls code-native.
- Do not replace production images with CSS placeholders, generic blue AI art, or screenshots containing UI text.

## Responsive Requirements

Verify at minimum:

- 1440 × 1000 desktop
- 768 × 1024 tablet
- 390 × 844 mobile
- 390 × 844 mobile menu open

Required behavior:

- no horizontal overflow
- hero headline remains readable and balanced
- primary CTA remains visible without crowding the header
- navigation becomes an accessible menu below 1240px
- menu opens, closes on Escape, and closes after navigation
- sprint price and deliverables remain legible
- industry cards collapse from six columns to three and then one
- email addresses wrap safely
- processor and workbench images render at every breakpoint
- footer columns collapse cleanly

## Visual Fidelity Priorities

Review in this order:

1. first-viewport balance
2. headline scale and line breaks
3. header color and 2px olive separator
4. warm processor image crop
5. sprint-band contrast
6. pricing-card hierarchy
7. industry-card density
8. dark-section readability and workbench crop
9. mobile navigation and CTA layout
10. footer spacing

Do not preserve a screenshot detail when it harms readability or accessibility. Record intentional deviations in `design-qa.md`.

## Required Validation

Browser plugin is preferred when available. Otherwise use the repository Playwright QA script.

```powershell
npm install
npm run build
npm run qa:capture
```

The QA script should:

- choose an available local preview port
- start Vite preview when `QA_URL` is not supplied
- try Chrome, Playwright Chromium, and an installed system Chromium
- capture desktop, tablet, mobile, and mobile-menu screenshots into `.qa/`
- report console warnings/errors and page errors
- detect horizontal overflow
- verify one header, main, footer, and H1
- verify the primary mailto CTA
- exercise menu open, navigation close, and Escape close

A branch-equivalent production build and compiled-bundle responsive harness passed during senior review. Details are in `design-qa.md`. Codex must still run the repository-native commands above and inspect the generated screenshots before marking the PR ready.

Do not claim visual QA passed based only on a successful build.

## Deployment

Do not deploy automatically unless the user explicitly asks for production deployment.

The live site is a Cloudflare Pages project named `ai-embedded-systems`. Follow `WEBSITE_HANDOFF.md` for the correct account and Wrangler command. Never deploy to the `Gentle Bridge` account.

Merging to `master` does not prove the production site was published because the documented deployment is manual.

## Definition Of Done

The revamp is ready for user approval only when:

- repository-native `npm run build` passes
- repository-native `npm run qa:capture` passes
- desktop, tablet, mobile, and mobile-menu screenshots are inspected
- there are no relevant console errors or warnings
- there is no horizontal overflow
- CTA labels match their actual behavior
- public metadata and crawler files describe the same offer as the visible homepage
- the PR diff contains no protected workspace/backend changes
- `design-qa.md` accurately records validation and intentional deviations

Do not mark the PR ready, merge it, or deploy it without explicit user approval. Logs first. Panic later.
