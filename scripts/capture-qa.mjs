import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const qaDir = new URL("../qa/", import.meta.url);
await mkdir(qaDir, { recursive: true });

async function launchBrowser() {
  try {
    return await chromium.launch({ channel: "chrome" });
  } catch {
    return await chromium.launch();
  }
}

const browser = await launchBrowser();

async function capture(name, viewport) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
  await page.screenshot({ path: fileURLToPath(new URL(name, qaDir)), fullPage: true });
  const metrics = await page.evaluate(() => ({
    width: innerWidth,
    height: innerHeight,
    scrollHeight: document.documentElement.scrollHeight,
    title: document.title,
    text: document.body.innerText.slice(0, 400),
  }));
  await page.close();
  return metrics;
}

const desktop = await capture("prototype-desktop-1536.png", { width: 1536, height: 1024 });
const tablet = await capture("prototype-tablet-768.png", { width: 768, height: 1024 });
const fold = await capture("prototype-fold-wide-1368.png", { width: 1368, height: 912 });
const mobile = await capture("prototype-mobile-390.png", { width: 390, height: 844 });

await browser.close();

console.log(JSON.stringify({ desktop, tablet, fold, mobile }, null, 2));
