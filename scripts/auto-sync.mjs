import { spawnSync } from "node:child_process";
import { watch } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();
const WATCH_DIR = resolve(ROOT, "src");
const DEBOUNCE_MS = 2500;

let timer = null;
let running = false;

function run(command, args) {
  return spawnSync(command, args, {
    cwd: ROOT,
    stdio: "pipe",
    encoding: "utf-8"
  });
}

function output(result) {
  const text = `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();
  if (text) console.log(text);
}

function getBranch() {
  const branch = run("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
  if (branch.status !== 0) {
    output(branch);
    return null;
  }
  return branch.stdout.trim();
}

function hasChanges() {
  const status = run("git", ["status", "--porcelain"]);
  if (status.status !== 0) {
    output(status);
    return false;
  }
  return status.stdout.trim().length > 0;
}

function stageAll() {
  const add = run("git", ["add", "-A"]);
  if (add.status !== 0) {
    output(add);
    return false;
  }
  return true;
}

function hasStagedChanges() {
  const diff = run("git", ["diff", "--cached", "--quiet"]);
  return diff.status !== 0;
}

function commitAndPush() {
  if (running) return;
  running = true;

  try {
    if (!hasChanges()) return;
    if (!stageAll()) return;
    if (!hasStagedChanges()) return;

    const branch = getBranch();
    if (!branch || branch === "HEAD") {
      console.log("[auto-sync] No valid branch. Skip.");
      return;
    }

    const ts = new Date().toISOString().replace("T", " ").slice(0, 19);
    const message = `chore(auto): sync ${ts}`;
    const commit = run("git", ["commit", "-m", message]);
    if (commit.status !== 0) {
      output(commit);
      return;
    }
    output(commit);

    const push = run("git", ["push", "origin", branch]);
    if (push.status !== 0) {
      output(push);
      return;
    }
    output(push);
    console.log("[auto-sync] Pushed successfully.");
  } finally {
    running = false;
  }
}

function scheduleSync() {
  if (timer) clearTimeout(timer);
  timer = setTimeout(commitAndPush, DEBOUNCE_MS);
}

console.log(`[auto-sync] Watching ${WATCH_DIR}`);
console.log("[auto-sync] Auto commit+push is enabled for src changes.");
console.log("[auto-sync] Press Ctrl+C to stop.");

watch(
  WATCH_DIR,
  {
    recursive: true
  },
  () => scheduleSync()
);
