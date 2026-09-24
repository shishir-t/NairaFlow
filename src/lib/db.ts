import fs from "node:fs";
import path from "node:path";
import type { DB } from "./types";
import { SEED_AGENTS } from "./agents-seed";

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "db.json");

function emptyDb(): DB {
  return { users: [], wallets: [], transactions: [], agents: SEED_AGENTS };
}

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(emptyDb(), null, 2));
  }
}

export function readDb(): DB {
  ensureFile();
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  const db = JSON.parse(raw) as DB;
  if (!db.agents || db.agents.length === 0) db.agents = SEED_AGENTS;
  return db;
}

export function writeDb(db: DB) {
  ensureFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

export function genId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
