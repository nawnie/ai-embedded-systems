import { readFile, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const svgPath = new URL("../src/assets/hero-circuit.svg", import.meta.url);
const outputPath = new URL("../public/og-hero-chip.png", import.meta.url);
const svg = await readFile(svgPath, "utf8");
const match = svg.match(/href="data:image\/webp;base64,([^"]+)"/);

if (!match) {
  throw new Error("The embedded hero image was not found in hero-circuit.svg.");
}

const sourcePath = join(tmpdir(), `ai-embedded-systems-hero-${process.pid}.webp`);
await writeFile(sourcePath, Buffer.from(match[1], "base64"));

try {
  const result = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-hide_banner",
      "-loglevel",
      "error",
      "-i",
      sourcePath,
      "-vf",
      "scale=1200:754:flags=lanczos,crop=1200:630:0:62",
      "-frames:v",
      "1",
      outputPath.pathname.replace(/^\/(?:[A-Za-z]:)/, (value) => value.slice(1)),
    ],
    { encoding: "utf8" },
  );

  if (result.status !== 0) {
    throw new Error(result.stderr || "ffmpeg could not render the social preview.");
  }
} finally {
  await unlink(sourcePath).catch(() => {});
}

console.log("Created public/og-hero-chip.png at 1200 × 630.");
