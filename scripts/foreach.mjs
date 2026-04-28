#!/usr/bin/env node
// Spustí zadaný příkaz postupně ve všech sub-projektech.
// Použití: node scripts/foreach.mjs <příkaz...>
// Příklad: node scripts/foreach.mjs npm run lint

import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const PROJECTS = [
  "2p-administration",
  "2p-cars",
  "2p-hive-house",
  "2p-moment",
  "2p-pekarna",
  "2p-Stavebni",
];

const cmd = process.argv.slice(2).join(" ");
if (!cmd) {
  console.error("Použití: node scripts/foreach.mjs <příkaz>");
  process.exit(1);
}

let failed = 0;

for (const project of PROJECTS) {
  const dir = resolve(root, project);
  if (!existsSync(resolve(dir, "package.json"))) {
    console.log(`⏭  ${project} — package.json nenalezen, přeskakuji`);
    continue;
  }
  console.log(`\n${"─".repeat(50)}`);
  console.log(`▶  ${project}: ${cmd}`);
  console.log("─".repeat(50));
  try {
    execSync(cmd, { cwd: dir, stdio: "inherit" });
    console.log(`✓  ${project} OK`);
  } catch {
    console.error(`✗  ${project} SELHALO`);
    failed++;
  }
}

console.log(`\n${"═".repeat(50)}`);
if (failed) {
  console.error(`Selhalo ${failed} z ${PROJECTS.length} projektů.`);
  process.exit(1);
} else {
  console.log(`Všech ${PROJECTS.length} projektů v pořádku.`);
}
