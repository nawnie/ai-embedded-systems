# AGENTS.md

## Purpose

This repository contains the public AI Embedded Systems website and protected workspace infrastructure. This file is the implementation contract for Codex and other coding agents working in the repository.

The current review branch is:

```text
revamp/private-ai-feasibility-sprint
```

The draft pull request is intended to replace the public homepage with a human-designed, conversion-focused site centered on the Private AI Feasibility Sprint.

## Read First

Before editing:

1. Read this file completely.
2. Read `design-qa.md` for the current fidelity ledger and remaining validation work.
3. Read `WEBSITE_HANDOFF.md` for the existing Cloudflare account and deployment notes.
4. Treat `public/AGENTS.md` as public crawler content, not as coding instructions.
5. Inspect the current branch before assuming screenshots or QA notes from the previous white/cyan site are current.

## Hard Safety Boundary

Do not modify the protected workspace or its supporting infrastructure while finishing the public homepage revamp.

This prohibition includes, but is not limited to:

- any route, file, directory, component, function, middleware, asset, schema, migration, binding, or configuration containing `workspace`
- Cloudflare Functions or API handlers unrelated to the public homepage
- authentication, authorization, sessions, access controls, D1 data, database schemas, secrets, environment variables, or Wrangler bindings
- `wrangler.toml`, migration files, or production account configuration
- the existing canonical-domain redirect behavior

If a requested change appears to require touching the workspace or backend, stop and ask the user before editing.

The public homepage work should normally be limited to:

- `src/App.jsx`
- `src/styles.css`
- `index.html`
- public crawler/context files under `public/`
- frontend QA scripts and documentation

## Product Goal

The homepage must help AI Embedded Systems obtain paid commercial work quickly.

The primary offer is:

**Private AI Feasibility Sprint — $3,500 founding-client price**

The page should make the following clear without hype:

- who the company helps
- what business or operational problems it addresses
- why private/local AI and embedded systems matter
- what the sprint includes
- what the client receives
- how to start a conversation

The primary conversion action currently uses a prefilled `mailto:` link because no verified booking URL has been provided. Do not label a mailto action “Book” as though it opens a calendar. Use “Request a consultation” or “Request your sprint” until a real scheduling link is supplied.

## Audience

Prioritize operations-heavy organizations where privacy, reliability, real-world integration, or local compute matter:

- hospitality and resorts
- manufacturing
- property management
- robotics and automation
- local government
- healthcare operations

Do not invent customers, case studies, testimonials, certifications, compliance claims, performance metrics, partnerships, awards, or funded pilots.

## Approved Design Direction

The approved direction is human, editorial, practical, and quietly technical.

Use:

- warm cream and paper surfaces
- charcoal typography
- muted olive accents
- a parchment-toned sticky navigation bar with a visible olive separator
- restrained borders and print-like texture
- clear hierarchy and generous but purposeful spacing
- one strong technical image moment rather than many decorative visuals
- serif display typography for major section headings and a system sans-serif stack for UI/body copy

Current core color intent:

```text
paper         #F6F2E9
paper light   #FBF8F1
header        #ECE7DA
sprint band   #DFD7C9
ink           #1E1E1B
charcoal      #1B1D19
olive         #66652C
olive dark    #4D4D22
```

Avoid:

- neon blue or cyan as the dominant palette
- generic “AI glow” gradients
- glassmorphism
- floating dashboard fragments used only as decoration
- excessive pills, badges, bento grids, nested cards, or fake metrics
- stock-photo collage treatment
- animation that competes with the offer
- changing the warm palette back toward the previous white/cyan technical site

The old `src/assets/approved-reference.png` and existing `qa/prototype-*.png` captures belong to the previous design and are not the source of truth for this revamp.

## Information Architecture

Keep this order unless the user explicitly approves a change:

1. sticky header
2. hero with clear commercial promise and primary CTA
3. Private AI Feasibility Sprint with price, scope, outcomes, and payment structure
4. industries served
5. why-us/about section with founders and direct contact
6. final private-AI CTA band
7. footer with technical topic links

Do not add an investor pitch, donation language, nonprofit messaging, unrelated product dashboards, or a new pricing matrix to this commercial homepage.

## Copy Rules

- Write plainly and specifically.
- Prefer operational language over futurist language.
- Keep “RNV1” visible as evidence of physical-world engineering, not as the only business offering.
- Use “private AI,” “local AI,” and “embedded systems” accurately.
- Do not imply guaranteed security, regulatory compliance, savings, revenue, or ROI.
- Do not claim HIPAA, SOC 2, ISO, FedRAMP, or other compliance unless the user supplies verified evidence.
- Preserve the founders’ roles:
  - Shawn O'Hagan — Co-Founder, Software & AI
  - Robert Delgado — Co-Founder, Robotics
- Preserve the verified emails:
  - `sohagan.dev@aiembeddedsystems.com`
  - `robert@aiembeddedsystems.com`
- Do not add a phone number, address, calendar URL, or social profile unless verified by the user.

## Frontend Engineering Requirements

- Keep the existing React + Vite stack.
- Keep components focused and readable. `App` should remain composition glue.
- Use semantic landmarks: skip link, site header, `main`, sections with labeled headings, and footer.
- Maintain a logical heading hierarchy with one H1.
- Keep keyboard focus visible.
- Keep the mobile navigation operable with keyboard, Escape, and link selection.
- Use `aria-expanded`, `aria-controls`, and `aria-current` correctly.
- Respect `prefers-reduced-motion`.
- Do not add a heavy UI framework for this landing page.
- Avoid remote font requests. The privacy-oriented site should use the system font stack already defined in CSS.
- Keep external dependencies and JavaScript minimal.
- Do not convert real text or controls into a screenshot.

## Responsive Requirements

Verify at minimum:

- 1440 × 1000 desktop
- 768 × 1024 tablet
- 390 × 844 mobile

Required behavior:

- no horizontal overflow
- hero headline remains readable and does not dominate the entire first viewport
- primary CTA remains visible without crowding the header
- navigation becomes an accessible menu below 1240px
- mobile menu opens, closes on Escape, and closes after a navigation selection
- sprint card does not overflow or compress its price and deliverables
- industry cards remain readable at tablet and mobile sizes
- email addresses wrap safely
- footer columns collapse cleanly

## Visual Fidelity Priorities

Review in this order:

1. first-viewport balance
2. headline scale and line breaks
3. header color and separator
4. sprint-band contrast
5. price-card hierarchy
6. industry-card density
7. dark-section readability
8. mobile navigation and CTA layout
9. footer spacing

Do not preserve a screenshot detail when it harms readability or accessibility. Record any intentional deviation in `design-qa.md`.

## Required Validation

Browser plugin is preferred when available. Otherwise use the repository’s Playwright QA script.

```powershell
npm install
npm run build
npm run qa:capture
```

`npm run qa:capture` should:

- start the Vite preview when `QA_URL` is not provided
- capture desktop, tablet, mobile, and mobile-menu screenshots into `.qa/`
- report console warnings/errors and page errors
- detect horizontal overflow
- verify the H1 and primary mailto CTA
- exercise the mobile navigation open/close path

Do not claim visual QA passed based only on a successful build.

Before handoff, inspect the approved concept and latest render side by side. Record at least these comparison points in `design-qa.md`:

- header and navigation
- hero composition and headline
- sprint-band tone and pricing card
- industry grid
- dark why-us section
- mobile behavior

## Deployment

Do not deploy automatically unless the user explicitly asks for production deployment.

The live site is a Cloudflare Pages project named `ai-embedded-systems`. Follow `WEBSITE_HANDOFF.md` for the correct account and Wrangler command. Never deploy to the `Gentle Bridge` account.

A merge to `master` does not by itself prove the production site was published because the documented deployment is manual.

## Definition of Done

The revamp is ready for user review only when:

- `npm run build` passes
- the QA capture script passes
- desktop, tablet, mobile, and mobile-menu screenshots have been inspected
- there are no relevant console errors or warnings
- there is no horizontal overflow
- all CTA labels match their actual behavior
- public metadata and crawler files describe the same commercial offer as the visible homepage
- no protected workspace/backend files changed
- `design-qa.md` accurately states what was and was not verified

Do not merge or deploy merely because the code looks plausible. Logs first. Panic later.
