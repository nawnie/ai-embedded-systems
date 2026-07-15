const CANONICAL_HOST = "aiembeddedsystems.com";
const PAGE_PATHS = new Set([
  "/",
  "/ai-robotics-consulting/",
  "/edge-ai-development/",
  "/embedded-ai-systems/",
  "/local-ai-robotics/",
  "/privacy/",
  "/rnv1-robotics/",
  "/robotics-control/",
  "/ros2-robotics/",
  "/sensor-fusion/",
]);
const PUBLIC_FILES = new Set([
  "/404.html",
  "/AGENTS.md",
  "/brand-logo.png",
  "/humans.txt",
  "/inquiry-assistant.css",
  "/inquiry-assistant.js",
  "/llms.txt",
  "/og-rnv1.png",
  "/og-hero-chip.png",
  "/robots.txt",
  "/sitemap.xml",
  "/topic-page.css",
]);

export function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.hostname !== CANONICAL_HOST || url.protocol !== "https:") {
    url.hostname = CANONICAL_HOST;
    url.protocol = "https:";
    return Response.redirect(url.toString(), 301);
  }

  if (!isPublicPath(url.pathname)) {
    return notFoundResponse();
  }

  return context.next();
}

function isPublicPath(pathname) {
  if (pathname.startsWith("/api/") || pathname.startsWith("/assets/") || pathname.startsWith("/.well-known/")) {
    return true;
  }

  if (PUBLIC_FILES.has(pathname)) {
    return true;
  }

  const pagePath = pathname.endsWith("/index.html")
    ? `${pathname.slice(0, -"index.html".length)}`
    : pathname.endsWith("/") ? pathname : `${pathname}/`;
  return PAGE_PATHS.has(pagePath);
}

function notFoundResponse() {
  const body = `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="noindex, follow"><title>Page not found | AI Embedded Systems</title><link rel="stylesheet" href="/topic-page.css"></head>
<body><main><a class="mark" href="/">AI Embedded Systems</a><h1>Page not found</h1><p>The address may be outdated or mistyped. Return to the main site or continue with one of our technical overviews.</p><nav class="topic-nav" aria-label="Useful pages"><a href="/">Main site</a><a href="/embedded-ai-systems/">Embedded AI systems</a><a href="/rnv1-robotics/">RNV1 robotics</a><a href="/privacy/">Privacy</a></nav></main></body></html>`;

  return new Response(body, {
    status: 404,
    headers: {
      "Cache-Control": "no-store",
      "Content-Security-Policy": "default-src 'self'; style-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
      "Content-Type": "text/html; charset=utf-8",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
    },
  });
}
