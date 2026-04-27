#!/usr/bin/env node
/**
 * Tenký wrapper nad `firebase deploy` — vezme env + target a spustí CLI
 * s project ID vyčteným ze service account JSON.
 *
 * Pro full pipeline (všechny rules najednou) raději orchestrátor:
 *   npm run deploy:dev     # nebo deploy:ope
 *
 * Tenhle wrapper je pro ad-hoc deploy jen jednoho kusu:
 *   node firebase-deploy.mjs dev firestore:rules
 *   node firebase-deploy.mjs ope database
 *   node firebase-deploy.mjs dev storage
 */

import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const [env, target] = process.argv.slice(2);
const VALID_ENVS = new Set(["dev", "ope"]);
const VALID_TARGETS = new Set(["firestore:rules", "database", "storage"]);

if (!env || !VALID_ENVS.has(env) || !target || !VALID_TARGETS.has(target)) {
  console.error("Usage: node firebase-deploy.mjs <dev|ope> <firestore:rules|database|storage>");
  process.exit(1);
}

const saPath = join(__dirname, `${env}.json`);
const sa = JSON.parse(await readFile(saPath, "utf-8"));
const projectId = sa.project_id;

const appRoot = join(__dirname, "..");
console.log(`→ firebase deploy --only ${target} --project ${projectId}`);

const child = spawn(
  "npx",
  ["firebase", "deploy", "--only", target, "--project", projectId, "--non-interactive"],
  {
    stdio: "inherit",
    cwd: appRoot,
    env: { ...process.env, GOOGLE_APPLICATION_CREDENTIALS: saPath },
  },
);
child.on("exit", (code) => process.exit(code ?? 0));
