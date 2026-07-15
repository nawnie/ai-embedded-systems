# Design QA — Private AI Homepage Revamp

## Status

**Implementation review complete. Actual Vite build and browser verification still required before merge or deployment.**

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
- one strong technical image moment
- no dominant neon blue, cyan glow, glassmorphism, or fake AI-dashboard decoration

The originating visual concept is in the ChatGPT design thread. The old repository asset `src/assets/approved-reference.png` is from the previous site and must not be used as the revamp reference.

## Senior Review Findings And Fixes

| Finding | User-visible risk | Fix applied |
|---|---|---|
| Navigation disappeared below desktop width | Tablet/mobile users lost section navigation | Added accessible menu button, open/close state, Escape handling, link-close behavior, and mobile CTA |
| Header active state was permanently attached to one link | Navigation state became misleading while scrolling | Added section-aware active navigation with `IntersectionObserver` and `aria-current="location"` |
| “Book” actions opened email rather than a calendar | CTA promised behavior it did not perform | Renamed actions to “Request a consultation” and “Request your sprint”; added prefilled mailto context |
| Remote Google fonts conflicted with the privacy message and added a third-party request | Privacy/performance inconsistency | Removed remote font import and moved to system sans/serif stacks |
| `content-visibility: auto` caused blank sections in full-page tablet/mobile captures | QA screenshots could falsely show missing content | Removed `content-visibility` from primary marketing sections |
| Hero headline overwhelmed the first viewport | Commercial promise became harder to scan | Locked intentional two-line desktop composition and reduced type scale |
| Homepage landmarks were not ideal | Keyboard and assistive-technology navigation was weaker | Added skip link, separated header/main/footer landmarks, labeled sections, and one-H1 hierarchy |
| Focus and reduced-motion behavior were incomplete | Accessibility and keyboard usability risk | Added global focus-visible treatment and `prefers-reduced-motion` handling |
| Long email addresses could overflow narrow screens | Mobile layout breakage | Added safe wrapping in contact and founder blocks |
| Public crawler files still described a robotics-only homepage | Visible page, metadata, and agent context disagreed | Updated `index.html`, `public/AGENTS.md`, `public/llms.txt`, `public/humans.txt`, README, and sitemap |
| No root agent contract existed | Codex could accidentally revive the old design or touch protected workspace files | Added root `AGENTS.md` with scope, design, validation, and deployment rules |

## Static Layout Review

A local static layout harness using the current CSS and representative page markup was reviewed at:

- 1440 × 1000 desktop
- 768 × 1024 tablet
- 390 × 844 mobile
- 390 × 844 mobile menu open

Observed in that harness:

- no horizontal overflow at the tested widths
- desktop headline resolves to two intentional lines
- header separator remains visible
- feasibility-sprint band is darker than the surrounding paper sections
- pricing card remains readable
- industry grid collapses from six columns to three and then one
- dark about/contact section renders at tablet and mobile widths
- mobile menu fits the viewport and contains the primary CTA

This was **not** the compiled React/Vite application and does not replace the required repository QA run.

## Required Runtime Validation

Run from the repository root:

```powershell
npm install
npm run build
npm run qa:capture
```

The QA script writes temporary screenshots to `.qa/` and checks:

- desktop, tablet, and mobile rendering
- mobile menu open/close behavior
- H1 presence
- primary mailto CTA
- console warnings/errors
- page errors
- horizontal overflow

Browser plugin review is preferred when available. If the Browser plugin is absent, use Playwright and record the fallback.

## Fidelity Ledger For Codex

| Area | Reference intent | Current implementation requirement |
|---|---|---|
| Header | Warm parchment bar, clear structure, olive separator | Preserve `#ECE7DA` family, visible 2px separator, restrained active underline, accessible mobile menu |
| Hero | Human editorial layout with one technical image | Keep two-line desktop headline, readable body copy, two CTAs, and balanced 50/50 composition |
| Hero asset | Macro technical image in approved concept | Current branch retains RNV1 imagery as a grounded brand asset; replace only with a high-quality approved asset, never generic blue AI art |
| Sprint band | Slightly darker than surrounding paper | Preserve `#DFD7C9` family and strong white/cream pricing card contrast |
| Pricing card | $3,500 is the visual anchor | Keep price, deliverables, founding-client label, and 50/50 payment note legible at all breakpoints |
| Industries | Six simple editorial cards | Do not turn into glossy image cards or a bento grid; preserve readable copy and equal rhythm |
| Why-us section | Dark, calm, human, credible | Preserve charcoal surface, founder names/roles, direct email contact, and restrained olive accents |
| Mobile | Clean stack, no clipped controls | Verify menu, CTA width, price card, email wrapping, and footer collapse |

## Intentional Deviations

- The site uses verified email-based consultation requests because no verified calendar URL has been provided.
- No phone number, address, case study, testimonial, certification, or compliance badge is shown because none was verified for this revamp.
- RNV1 remains visible as proof of physical-world engineering, but the homepage is no longer positioned solely as a robotics roadmap.
- System fonts replace externally hosted typography to support privacy, speed, and reliability.

## Protected Scope

No workspace route, workspace component, Cloudflare workspace function, authentication path, D1 schema, migration, secret, binding, or deployment account setting should change as part of this revamp. See root `AGENTS.md` for the complete boundary.

## Completion Gate

Do not mark this revamp “passed,” merge it, or deploy it until:

- `npm run build` passes
- `npm run qa:capture` passes
- latest desktop, tablet, mobile, and mobile-menu screenshots are inspected
- actual rendered output is compared against the approved concept
- there are no relevant console errors or warnings
- no workspace/backend files appear in the PR diff
