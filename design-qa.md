# Design QA

final result: passed

## Reference

- Source visual: `C:\Users\Shawn\Downloads\Generated image 1.png`
- Current rover asset: `C:\Users\Shawn\Desktop\2dac72db-94e5-4699-b524-a4592a290001.png`
- Prototype URL: `http://127.0.0.1:5173/`
- Production URL: `https://www.aiembeddedsystems.com/`
- Apex/root URL: `https://aiembeddedsystems.com/`
- Cloudflare Pages URL: `https://ai-embedded-systems.pages.dev/`
- Latest captures:
  - `qa/prototype-desktop-1536.png`
  - `qa/prototype-fold-wide-1368.png`
  - `qa/prototype-tablet-768.png`
  - `qa/prototype-mobile-390.png`
  - `qa/published-fold-wide-1368.png`
  - `qa/live-custom-domain-1368.png`
  - `qa/live-cofounders-1368.png`

## Checks

- Desktop 1536 x 1024: passed. Hero, rover, telemetry, mission, layers, roadmap, and contact sections render in the approved technical white/cyan style.
- Wide fold 1368 x 912: passed. Layout keeps the desktop-style hero with the transparent rover integrated into the technical canvas.
- Vertical tablet 768 x 1024: passed. Hero stacks cleanly with the rover scaled as a responsive product asset.
- Mobile 390 x 844: passed. Content stacks cleanly, no blocking overlap, and the roadmap/contact sections remain readable.
- Rover asset: passed. Replaced the pasted dark image with Shawn's transparent RNV1 rover asset and restored the clean white/grid hero treatment.
- Telemetry asset: passed. Removed the old rover wheel baked into the left edge of `telemetry-panel.png` and verified the cleaned asset in the published build.
- Current roadmap: passed. Timeline starts at Q3 2026 and continues through 2027.
- Contact details: passed. Shawn O'Hagan as Co-Founder, Software & AI; Robert Delgado as Co-Founder, Robotics; email; and `github.com/nawnie` render in the Work With Us section.
- Build: passed with `npm run build`.
- Capture: passed with `node scripts\capture-qa.mjs`.
- Production publish: passed with Cloudflare Pages project `ai-embedded-systems` in the `shawnohagan2@gmail.com` account.
- Custom domain: passed for `www.aiembeddedsystems.com` with HTTP 200 and current built `index.html`.
- Apex/root domain: passed. Added to Cloudflare Pages, marked Active with SSL enabled, resolved through Cloudflare DNS, and returned HTTP 200 through the Cloudflare edge.
- Website DNS setup: passed. Both apex and `www` are proxied CNAME records to `ai-embedded-systems.pages.dev`.
- Remaining Cloudflare recommendation: email only. MX/SPF/DKIM/DMARC was not configured because no email provider/routing decision has been made for `@aiembeddedsystems.com`.
- Free SEO setup: passed. Added canonical metadata, Open Graph/Twitter cards, JSON-LD organization/website/webpage data, no-JavaScript summary fallback, `robots.txt`, `sitemap.xml`, `llms.txt`, public `AGENTS.md`, `_headers`, and `og-rnv1.png`.
- SEO deployment: passed with Cloudflare Pages deployment `https://6c02976f.ai-embedded-systems.pages.dev`; live checks returned HTTP 200 for `/robots.txt`, `/llms.txt`, `/sitemap.xml`, `/AGENTS.md`, and `/og-rnv1.png`.
- Co-founder role update: passed with Cloudflare Pages deployment `https://a30c5547.ai-embedded-systems.pages.dev`. Live rendered page shows Shawn O'Hagan as `Co-Founder, Software & AI` and Robert Delgado as `Co-Founder, Robotics`. Public `llms.txt`, public `AGENTS.md`, JSON-LD, and no-JavaScript fallback were updated to match.

## Notes

- In-app browser was reset to the normal viewport after responsive testing. Normal preview reports no horizontal overflow and no console warnings/errors.
- Published URL verification returned HTTP 200 and the live custom-domain screenshot matched the cleaned build.
- `Gentle Bridge` is not the production Cloudflare account for this website; it was only used for an earlier temporary preview.
- P3 follow-up only: the coded page is slightly taller than the original static mockup, but the user-approved visual direction and requested content updates are intact.
