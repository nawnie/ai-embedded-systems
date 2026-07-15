import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const outputDir = new URL("../.qa/", import.meta.url);
const previewUrl = process.env.QA_URL ?? "http://127.0.0.1:4173/";
const shouldStartPreview = !process.env.QA_URL;

await mkdir(outputDir, { recursive: true });

function startPreview() {
  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
  const child = spawn(npmCommand, ["run", "preview", "--", "--port", "4173"], {
    cwd: projectRoot,
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
  });

  child.stdout.on("data", (chunk) => process.stdout.write(`[preview] ${chunk}`));
  child.stderr.on("data", (chunk) => process.stderr.write(`[preview] ${chunk}`));
  return child;
}

async function waitForUrl(url, timeoutMs = 20_000) {
  const deadline = Date.now() + timeoutMs;
  let lastError;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
      lastError = new Error(`Preview returned HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Preview did not become ready at ${url}: ${lastError?.message ?? "unknown error"}`);
}

async function launchBrowser() {
  try {
    return await chromium.launch({ channel: "chrome" });
  } catch {
    return chromium.launch();
  }
}

function outputPath(filename) {
  return fileURLToPath(new URL(filename, outputDir));
}

const previewProcess = shouldStartPreview ? startPreview() : null;
let browser;

try {
  await waitForUrl(previewUrl);
  browser = await launchBrowser();

  const results = [];
  const viewports = [
    { name: "desktop-1440", width: 1440, height: 1000 },
    { name: "tablet-768", width: 768, height: 1024 },
    { name: "mobile-390", width: 390, height: 844 },
  ];

  for (const viewport of viewports) {
    const page = await browser.newPage({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
    });

    const consoleMessages = [];
    const pageErrors = [];
    page.on("console", (message) => {
      if (["error", "warning"].includes(message.type())) {
        consoleMessages.push({ type: message.type(), text: message.text() });
      }
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto(previewUrl, { waitUntil: "networkidle" });
    await page.locator("h1").waitFor({ state: "visible" });

    const metrics = await page.evaluate(() => ({
      title: document.title,
      h1: document.querySelector("h1")?.textContent?.trim() ?? "",
      viewportWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
      primaryCtaHref: document.querySelector(".hero-actions .button-primary")?.getAttribute("href") ?? "",
    }));

    await page.screenshot({
      path: outputPath(`revamp-${viewport.name}.png`),
      fullPage: true,
    });

    results.push({
      viewport: viewport.name,
      metrics,
      consoleMessages,
      pageErrors,
      horizontalOverflow: metrics.scrollWidth > metrics.viewportWidth + 1,
    });

    await page.close();
  }

  const mobilePage = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
  });
  await mobilePage.goto(previewUrl, { waitUntil: "networkidle" });

  const menuButton = mobilePage.locator('[aria-controls="primary-navigation"]');
  await menuButton.click();
  const menuExpanded = (await menuButton.getAttribute("aria-expanded")) === "true";
  const menuVisible = await mobilePage.locator("#primary-navigation").isVisible();
  await mobilePage.screenshot({
    path: outputPath("revamp-mobile-menu-390.png"),
    fullPage: false,
  });

  await mobilePage.locator('#primary-navigation a[href="#sprint"]').click();
  const menuClosedAfterNavigation = (await menuButton.getAttribute("aria-expanded")) === "false";
  await mobilePage.close();

  const failures = results.flatMap((result) => {
    const issues = [];
    if (!result.metrics.title.includes("AI Embedded Systems")) issues.push("unexpected page title");
    if (!result.metrics.h1) issues.push("missing H1");
    if (!result.metrics.primaryCtaHref.startsWith("mailto:")) issues.push("primary CTA is not a mailto link");
    if (result.horizontalOverflow) issues.push("horizontal overflow");
    if (result.consoleMessages.length) issues.push("console warnings or errors");
    if (result.pageErrors.length) issues.push("page errors");
    return issues.map((issue) => `${result.viewport}: ${issue}`);
  });

  if (!menuExpanded || !menuVisible) failures.push("mobile menu did not open correctly");
  if (!menuClosedAfterNavigation) failures.push("mobile menu did not close after navigation");

  console.log(
    JSON.stringify(
      {
        previewUrl,
        results,
        mobileMenu: { menuExpanded, menuVisible, menuClosedAfterNavigation },
        failures,
      },
      null,
      2,
    ),
  );

  if (failures.length) {
    process.exitCode = 1;
  }
} finally {
  if (browser) {
    await browser.close();
  }
  if (previewProcess) {
    previewProcess.kill();
  }
}
