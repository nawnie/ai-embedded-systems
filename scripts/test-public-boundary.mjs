import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

const SELF = "scripts/test-public-boundary.mjs";
const trackedFiles = execFileSync("git", ["ls-files", "-z"], {
  encoding: "utf8",
})
  .split("\0")
  .filter(Boolean)
  .map((file) => file.replaceAll("\\", "/"));

const forbiddenPaths = [
  { label: "private workspace source", pattern: /^(?:public\/)?workspace\//iu },
  { label: "internal QA evidence", pattern: /^(?:build|qa)\//iu },
  { label: "private workspace handoff", pattern: /(?:^|\/)WORKSPACE_HANDOFF\.md$/iu },
  { label: "internal design QA notes", pattern: /(?:^|\/)design-qa(?:-[^/]+)?\.md$/iu },
];

const forbiddenText = [
  {
    label: "private workspace credential contract",
    pattern:
      /\b(?:WORKSPACE_USERNAME|WORKSPACE_PASSWORD|WORKSPACE_DEV_ALLOW_LOCAL|DEMO_LINK_SECRET|TRAINING_BRIDGE_SECRET|TRAINING_BRIDGE_URL)\b/u,
  },
  {
    label: "private demo or training route",
    pattern: /\/(?:api\/demos|api\/training-control|demo-access|demosites)(?:\/|\b)/u,
  },
  {
    label: "private local bridge hostname",
    pattern: /\bjarvis\.aiembeddedsystems\.com\b/iu,
  },
];

const textExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".sql",
  ".svg",
  ".txt",
  ".ts",
  ".tsx",
  ".yml",
  ".yaml",
]);

const violations = [];

for (const file of trackedFiles) {
  for (const rule of forbiddenPaths) {
    if (rule.pattern.test(file)) violations.push(`${file}: ${rule.label}`);
  }

  if (file === SELF || !textExtensions.has(path.extname(file).toLowerCase())) continue;

  const contents = readFileSync(file, "utf8");
  for (const rule of forbiddenText) {
    if (rule.pattern.test(contents)) violations.push(`${file}: ${rule.label}`);
  }
}

if (violations.length) {
  console.error("Public repository boundary check failed:");
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log(`Public repository boundary: ${trackedFiles.length} tracked files checked; no private workspace material found.`);
