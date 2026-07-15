import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const topics = [
  "rnv1-robotics",
  "embedded-ai-systems",
  "sensor-fusion",
  "local-ai-robotics",
  "robotics-control",
  "edge-ai-development",
  "ros2-robotics",
  "ai-robotics-consulting",
];

const read = (path) => readFile(join(root, path), "utf8");
const app = await read("src/App.jsx");
const index = await read("index.html");
const headers = await read("public/_headers");
const sitemap = await read("public/sitemap.xml");
const assistant = await read("public/inquiry-assistant.js");

for (const topic of topics) {
  const html = await read(`public/${topic}/index.html`);
  assert(app.includes(`/${topic}/`), `Homepage does not link to /${topic}/`);
  assert(html.includes('href="/privacy/"'), `/${topic}/ does not link to privacy`);
  assert(html.includes("topic-section"), `/${topic}/ is missing its detailed content section`);
  assert(!html.includes("Ai Embedded Systems"), `/${topic}/ has inconsistent brand capitalization`);
}

await read("public/privacy/index.html");
await read("public/404.html");
assert(index.includes('"logo": "https://aiembeddedsystems.com/brand-logo.png"'), "Organization schema does not use the brand logo");
assert(sitemap.includes("https://aiembeddedsystems.com/privacy/"), "Sitemap is missing privacy page");
assert(headers.includes("frame-ancestors 'none'"), "CSP frame protection is missing");
assert(headers.includes("max-age=31536000, immutable"), "Immutable asset caching is missing");
assert(assistant.includes("aes-guide-consent"), "Project guide consent is missing");
assert(assistant.includes('aria-busy'), "Project guide busy state is not exposed");
assert(assistant.includes('href="/privacy/"'), "Project guide does not link to privacy");

console.log(`Site integrity checks passed for ${topics.length} technical pages, privacy, 404, headers, schema, and project guide.`);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
