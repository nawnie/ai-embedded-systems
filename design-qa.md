# Design QA — Private AI Homepage Revamp

## Status

**Senior product-design and frontend review complete. Branch-equivalent production build and compiled-bundle responsive QA passed. The draft PR remains intentionally unmerged and undeployed until Codex runs the repository-native QA command in a normal local environment and the user approves release.**

This document replaces the previous QA result for the white/cyan robotics homepage. Existing `qa/prototype-*.png` files belong to that older design and are not evidence for this revamp.

## Current Branch

```text
revamp/private-ai-feasibility-sprint
```

Draft pull request: `#1`

## Approved Direction

The approved concept uses a warm, human-designed editorial system:

- cream and paper surfaces
- charcoal typography
- muted olive accents
- parchment navigation with a visible olive separator
- darker feasibility-sprint band for contrast
- restrained borders and print-like texture
- warm processor imagery in the hero
- a human engineering-workbench image in the why-us section
- no dominant neon blue, cyan glow, glassmorphism, or fake AI-dashboard decoration

Production visual assets for the revamp:

- `src/assets/hero-circuit.svg`
- `src/assets/studio-workbench.svg`

The old repository asset `src/assets/approved-reference.png` and existing `qa/prototype-*.png` captures are from the previous site and must not be used as the revamp reference.

## Senior Review Findings And Fixes

| Finding | User-visible risk | Fix applied |
|---|---|---|
| Navigation disappeared below desktop width | Tablet/mobile users lost section navigation | Added accessible menu button, open/close state, Escape handling with focus return, link-close behavior, and mobile CTA |
| Header active state was permanently attached to one link | Navigation state became misleading while scrolling | Added section-aware active navigation with `IntersectionObserver` and `aria-current="location"` |
| “Book” actions opened email rather than a calendar | CTA promised behavior it did not perform | Renamed actions to “Request a consultation” and “Request your sprint”; added prefilled mailto context and explanatory microcopy |
| Remote Google fonts conflicted with the privacy message | Privacy/performance inconsistency | Removed remote font requests and moved to system sans/serif stacks |
| Hero headline overwhelmed the first viewport | Commercial promise became harder to scan | Locked an intentional two-line desktop composition and reduced type scale |
| Homepage landmarks were not ideal | Keyboard and assistive-technology navigation was weaker | Added skip link, separated header/main/footer landmarks, labeled sections, and one-H1 hierarchy |
| Focus and reduced-motion behavior were incomplete | Accessibility and keyboard usability risk | Added global focus-visible treatment and `prefers-reduced-motion` handling |
| Long email addresses could overflow narrow screens | Mobile layout breakage | Added safe wrapping in contact and founder blocks |
| Generic or robotics-only imagery weakened the approved human direction | Page risked returning to “generic AI site” territory | Added warm processor macro imagery and a real-workbench visual with restrained treatment |
| Sprint value was visually clear but verbally soft | The paid offer lacked a decisive takeaway | Added “what to build first, what not to build, and what it will take” outcome language and fixed-price framing |
| Public crawler files still described a robotics-only homepage | Visible page, metadata, and agent context disagreed | Updated `index.html`, `public/AGENTS.md`, `public/llms.txt`, `public/humans.txt`, README, and sitemap |
| QA runner could collide with an occupied port or missing bundled browser | Local verification could fail for environmental reasons | Added dynamic free-port selection, strict preview port, Chrome/Playwright/system-Chromium fallback, landmark checks, and Escape-menu test |
| No root agent contract existed | Codex could revive the old design or touch protected workspace files | Added root `AGENTS.md` with scope, design, validation, and deployment rules |

## Compiled Frontend Validation

A clean Vite production build was run against the final `App.jsx`, `styles.css`, and compressed production SVG assets.

Result:

- 4,567 modules transformed
- build completed successfully
- CSS: approximately 16.5 kB before gzip
- JavaScript: approximately 254.9 kB before gzip, 76.2 kB gzip
- hero asset: approximately 14.6 kB
- workbench asset: approximately 7.7 kB

Because this ChatGPT execution environment blocks ordinary browser navigation to local preview URLs and does not expose the preferred Browser plugin, Playwright used the installed system Chromium against the actual compiled Vite bundle through an inline local harness. This is an environment-specific fallback, not the normal repository workflow.

The compiled bundle was exercised at:

- 1440 × 1000 desktop
- 768 × 1024 tablet
- 390 × 844 mobile
- 390 × 844 mobile menu open

Observed:

- no horizontal overflow
- no console warnings or errors
- no page errors
- exactly one header, main, footer, and H1
- primary CTA resolves to the verified mailto flow
- mobile menu opens correctly
- mobile menu closes after navigation
- mobile menu closes on Escape
- warm header separator remains visible
- feasibility-sprint band has the requested darker contrast
- price card remains readable
- industry grid collapses cleanly
- workbench image renders at tablet and mobile sizes

## Required Repository-Native Validation

Codex must still run from the actual repository checkout:

```powershell
npm install
npm run build
npm run qa:capture
```

The QA script writes temporary screenshots to `.qa/` and checks desktop, tablet, mobile, mobile-menu behavior, console output, page errors, landmarks, CTA behavior, and horizontal overflow.

Do not merge or deploy merely because the branch-equivalent harness passed. Inspect the repository-native captures against the approved concept first.

## Fidelity Ledger For Codex

| Area | Reference intent | Current implementation requirement |
|---|---|---|
| Header | Warm parchment bar, clear structure, olive separator | Preserve the `#ECE7DA` family, visible 2px separator, restrained active underline, and accessible mobile menu |
| Hero | Human editorial layout with one strong technical image | Preserve the two-line desktop headline, warm processor image, readable body copy, and honest mailto CTA labels |
| Sprint band | Slightly darker than surrounding paper | Preserve the `#DDD4C4` family and strong cream pricing-card contrast |
| Pricing card | $3,500 is the visual anchor | Keep price, deliverables, founding-client label, payment note, and scope language legible at all breakpoints |
| Industries | Six simple editorial cards | Do not turn this into glossy image cards or a bento grid; preserve readable copy and equal rhythm |
| Why-us section | Dark, calm, human, credible | Preserve charcoal surface, workbench visual, founders, direct email contact, and restrained olive accents |
| Mobile | Clean stack, no clipped controls | Verify menu, CTA width, price card, email wrapping, imagery, and footer collapse |

## Intentional Deviations

- The site uses verified email-based consultation requests because no verified calendar URL has been provided.
- No phone number, address, case study, testimonial, certification, or compliance badge is shown because none was verified for this revamp.
- RNV1 remains visible as proof of physical-world engineering, but the homepage is no longer positioned solely as a robotics roadmap.
- System fonts replace externally hosted typography to support privacy, speed, and reliability.
- The generated visual assets are compressed SVG wrappers containing WebP imagery to keep repository and transfer weight modest.

## Protected Scope

No workspace route, workspace component, Cloudflare workspace function, authentication path, D1 schema, migration, secret, binding, or deployment account setting changed as part of this revamp. See root `AGENTS.md` for the complete boundary.

## Completion Gate

Do not mark the PR ready, merge it, or deploy it until:

- the repository-native `npm run build` passes
- the repository-native `npm run qa:capture` passes
- latest desktop, tablet, mobile, and mobile-menu screenshots are inspected
- actual rendered output is compared against the approved concept
- there are no relevant console errors or warnings
- no workspace/backend files appear in the PR diff
- the user explicitly approves release
