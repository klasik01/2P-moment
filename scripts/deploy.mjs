#!/usr/bin/env node
/**
 * Deploy orchestrator — 2P Moment monorepo
 *
 * Jednou komandou nasadí všechny Firebase rules pro daný environment:
 *   1. Deploy Firestore rules   (firebase deploy --only firestore:rules)
 *   2. Deploy Realtime DB rules (firebase deploy --only database)
 *   3. Deploy Storage rules     (firebase deploy --only storage)
 *
 * Frontend je mimo scope — nasazuje se přes CI/CD pipeline
 * (ci-cd.yml → Netlify, deploy-pages.yml → GitHub Pages).
 *
 * Usage:
 *   node deploy.mjs <dev|ope> [--dry-run]
 *
 *   --dry-run   — jen vypíše co by se dělalo, nic nezmění
 */

import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { spawn } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(__dirname, "..");

const args = process.argv.slice(2);
const env = args.find((a) => !a.startsWith("--"));
const DRY_RUN = args.includes("--dry-run");
const VALID_ENVS = new Set(["dev", "ope"]);

if (!env || !VALID_ENVS.has(env)) {
  console.error("Usage: node deploy.mjs <dev|ope> [--dry-run]");
  process.exit(1);
}

// ---------- Helpers ----------

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    console.log(`\n▶ ${cmd} ${args.join(" ")}`);
    if (DRY_RUN) {
      console.log(`  (DRY RUN — skipping)`);
      resolve(0);
      return;
    }
    const child = spawn(cmd, args, {
      stdio: "inherit",
      cwd: opts.cwd ?? process.cwd(),
      env: { ...process.env, ...(opts.env ?? {}) },
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve(0);
      else reject(new Error(`${cmd} ${args.join(" ")} exited with code ${code}`));
    });
  });
}

async function resolveProjectId(env) {
  const path = join(__dirname, `${env}.json`);
  if (!existsSync(path)) {
    throw new Error(`Service account JSON nenalezen: ${path}`);
  }
  const raw = await readFile(path, "utf-8");
  const json = JSON.parse(raw);
  if (!json.project_id) {
    throw new Error(`project_id chybí v ${path}`);
  }
  return json.project_id;
}

// ---------- Flow ----------

async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Deploy orchestrator — prostředí: ${env.toUpperCase()}`);
  if (DRY_RUN) console.log("  DRY RUN — nic se nezmění");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const projectId = await resolveProjectId(env);
  console.log(`Firebase project: ${projectId}`);

  const firebaseEnv = {
    GOOGLE_APPLICATION_CREDENTIALS: join(__dirname, `${env}.json`),
  };

  // --- 1. Deploy Firestore rules ---
  console.log("\n[1/3] Deploy Firestore rules");
  await run(
    "npx",
    ["firebase", "deploy", "--only", "firestore:rules", "--project", projectId, "--non-interactive"],
    { cwd: APP_ROOT, env: firebaseEnv },
  );

  // --- 2. Deploy Realtime Database rules ---
  console.log("\n[2/3] Deploy Realtime Database rules");
  await run(
    "npx",
    ["firebase", "deploy", "--only", "database", "--project", projectId, "--non-interactive"],
    { cwd: APP_ROOT, env: firebaseEnv },
  );

  // --- 3. Deploy Storage rules ---
  console.log("\n[3/3] Deploy Storage rules");
  await run(
    "npx",
    ["firebase", "deploy", "--only", "storage", "--project", projectId, "--non-interactive"],
    { cwd: APP_ROOT, env: firebaseEnv },
  );

  // --- Report ---
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`✓ Deploy na ${env.toUpperCase()} hotovo`);
  console.log("");
  console.log("  Nasazeno:");
  console.log("    • Firestore rules   (firestore.rules)");
  console.log("    • Realtime DB rules (database.rules.json)");
  console.log("    • Storage rules     (storage.rules)");
  console.log("");
  console.log("Frontend: CI/CD pipeline (ci-cd.yml → Netlify, deploy-pages.yml → GitHub Pages).");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main().catch((err) => {
  console.error("\n✗ Deploy selhal:", err.message);
  process.exit(1);
});
