import { spawn } from "node:child_process";
import { access, mkdir } from "node:fs/promises";
import { createServer } from "node:net";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const outputDir = new URL("../.qa/", import.meta.url);
const externalQaUrl = process.env.QA_URL;
const shouldStartPreview = !externalQaUrl;

await mkdir(outputDir, { recursive: true });

async function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.unref();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : null;
      server.close((error) => {
        if (error) reject(error);
        else if (port) resolve(port);
        else reject(new Error("Could not determine a free preview port"));
      });
    });
  });
}

function startPreview(port) {
  const viteCli = fileURLToPath(new URL("../node_modules/vite/bin/vite.js", import.meta.url));
  const child = spawn(
    process.execPath,
    [viteCli, "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
    {
      cwd: projectRoot,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  child.stdout.on("data", (chunk) => process.stdout.write(`[preview] ${chunk}`));
  child.stderr.on("data", (chunk) => process.stderr.write(`[preview] ${chunk}`));
  return child;
}

async function waitForUrl(url, previewProcess, timeoutMs = 20_000) {
  const deadline = Date.now() + timeoutMs;
  let lastError;

  while (Date.now() < deadline) {
    if (previewProcess?.exitCode !== null) {
      throw new Error(`Preview process exited early with code ${previewProcess.exitCode}`);
    }

    try {
      const response = await fetch(url);
      if (response.ok) return;
      lastError = new Error(`Preview returned HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Preview did not become ready at ${url}: ${lastError?.message ?? "unknown error"}`);
}

async function executableExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function launchBrowser() {
  const attempts = [
    { label: "installed Chrome channel", launch: () => chromium.launch({ channel: "chrome" }) },
    { label: "Playwright Chromium", launch: () => chromium.launch() },
  ];

  const candidatePaths = [
    process.env.CHROMIUM_PATH,
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/google-chrome",
  ].filter(Boolean);

  for (const executablePath of candidatePaths) {
    if (await executableExists(executablePath)) {
      attempts.push({
        label: `system browser at ${executablePath}`,
        launch: () => chromium.launch({ executablePath }),
      });
    }
  }

  const failures = [];
  for (const attempt of attempts) {
    try {
      const browser = await attempt.launch();
      return { browser, browserSource: attempt.label };
    } catch (error) {
      failures.push(`${attempt.label}: ${error.message}`);
    }
  }

  throw new Error(`Could not launch a browser:\n${failures.join("\n")}`);
}

function outputPath(filename) {
  return fileURLToPath(new URL(filename, outputDir));
}

const previewPort = shouldStartPreview ? await findFreePort() : null;
const previewUrl = externalQaUrl ?? `http://127.0.0.1:${previewPort}/`;
const previewProcess = shouldStartPreview ? startPreview(previewPort) : null;
let browser;

try {
  await waitForUrl(previewUrl, previewProcess);
  const launchResult = await launchBrowser();
  browser = launchResult.browser;

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
    const failedResponses = [];
    page.on("console", (message) => {
      if (["error", "warning"].includes(message.type())) {
        consoleMessages.push({
          type: message.type(),
          text: message.text(),
          location: message.location(),
        });
      }
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("response", (response) => {
      if (response.status() >= 400) {
        failedResponses.push({ status: response.status(), url: response.url() });
      }
    });

    await page.goto(previewUrl, { waitUntil: "networkidle" });
    await page.locator("h1").waitFor({ state: "visible" });

    const metrics = await page.evaluate(() => ({
      title: document.title,
      h1: document.querySelector("h1")?.textContent?.trim() ?? "",
      landmarks: {
        header: document.querySelectorAll("header").length,
        main: document.querySelectorAll("main").length,
        footer: document.querySelectorAll("footer").length,
      },
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
      failedResponses,
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

  await menuButton.click();
  await mobilePage.keyboard.press("Escape");
  const menuClosedAfterEscape = (await menuButton.getAttribute("aria-expanded")) === "false";
  await mobilePage.close();

  const failures = results.flatMap((result) => {
    const issues = [];
    if (!result.metrics.title.includes("AI Embedded Systems")) issues.push("unexpected page title");
    if (!result.metrics.h1) issues.push("missing H1");
    if (result.metrics.landmarks.header !== 1) issues.push("expected one header landmark");
    if (result.metrics.landmarks.main !== 1) issues.push("expected one main landmark");
    if (result.metrics.landmarks.footer !== 1) issues.push("expected one footer landmark");
    if (!result.metrics.primaryCtaHref.startsWith("mailto:")) issues.push("primary CTA is not a mailto link");
    if (result.horizontalOverflow) issues.push("horizontal overflow");
    if (result.consoleMessages.length) issues.push("console warnings or errors");
    if (result.pageErrors.length) issues.push("page errors");
    if (result.failedResponses.length) issues.push("failed network responses");
    return issues.map((issue) => `${result.viewport}: ${issue}`);
  });

  if (!menuExpanded || !menuVisible) failures.push("mobile menu did not open correctly");
  if (!menuClosedAfterNavigation) failures.push("mobile menu did not close after navigation");
  if (!menuClosedAfterEscape) failures.push("mobile menu did not close after Escape");

  console.log(
    JSON.stringify(
      {
        previewUrl,
        browserSource: launchResult.browserSource,
        results,
        mobileMenu: {
          menuExpanded,
          menuVisible,
          menuClosedAfterNavigation,
          menuClosedAfterEscape,
        },
        failures,
      },
      null,
      2,
    ),
  );

  if (failures.length) process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  if (previewProcess && previewProcess.exitCode === null) previewProcess.kill();
}
