#!/usr/bin/env node
// Scans ./samples and rewrites strudel.json with discovered audio files.
// Usage: node generate-strudel-json.mjs [githubUser/repo] [branch]

import { readdirSync, statSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const AUDIO_EXT = new Set([".wav", ".mp3", ".ogg", ".flac", ".aiff", ".aif", ".m4a"]);
const SAMPLES_DIR = "samples";

const [, , repoArg, branchArg = "main"] = process.argv;

let base;
if (repoArg) {
  base = `https://raw.githubusercontent.com/${repoArg}/${branchArg}/${SAMPLES_DIR}/`;
} else if (existsSync("strudel.json")) {
  try {
    base = JSON.parse(readFileSync("strudel.json", "utf8"))._base;
  } catch {}
}
if (!base) {
  base = "https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/samples/";
}

function listAudio(dir) {
  const out = [];
  for (const name of readdirSync(dir).sort()) {
    const full = join(dir, name);
    if (statSync(full).isFile()) {
      const ext = name.slice(name.lastIndexOf(".")).toLowerCase();
      if (AUDIO_EXT.has(ext)) out.push(name);
    }
  }
  return out;
}

function listSubdirs(dir) {
  return readdirSync(dir)
    .filter((n) => !n.startsWith(".") && statSync(join(dir, n)).isDirectory())
    .sort();
}

const config = { _base: base };

for (const bank of listSubdirs(SAMPLES_DIR)) {
  const bankDir = join(SAMPLES_DIR, bank);
  const files = listAudio(bankDir);
  const subdirs = listSubdirs(bankDir);

  if (subdirs.length === 0) {
    // Flat bank: array of files, relative to _base
    config[bank] = files.map((f) => `${bank}/${f}`);
  } else {
    // Pitched/nested bank: object keyed by subdir name
    const obj = {};
    for (const sub of subdirs) {
      const subFiles = listAudio(join(bankDir, sub)).map((f) => `${bank}/${sub}/${f}`);
      if (subFiles.length) obj[sub] = subFiles;
    }
    // Also include any loose files at the bank root
    if (files.length) obj._loose = files.map((f) => `${bank}/${f}`);
    config[bank] = obj;
  }
}

writeFileSync("strudel.json", JSON.stringify(config, null, 2) + "\n");
console.log(`Wrote strudel.json (${Object.keys(config).length - 1} banks) with _base=${base}`);
