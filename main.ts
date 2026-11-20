// Leonida Legend — a GTA VI trophy guide and tracker (Node 22, standard
// library only). The guide itself is app/: plain static files a browser opens
// at app/index.html, offline, with the 55 trophies and their guides in
// app/data/trophies.json. This program hands it in: it copies app/ and
// screenshots/ from beside this file into the output directory and writes
// output/dossier.json, the summary the judge reads (the screenshots, the
// first load's files and bytes, and the source), with the vendored make.fun
// library. Leave vendor/makefun-frontend.ts alone: the scorer requires the
// dossier to be byte for byte what its own copy of the library writes.
//
// Serve the guide locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const appDir = join(repoRoot, 'app');
const shotsDir = join(repoRoot, 'screenshots');

function copyTree(from, to) {
  mkdirSync(to, { recursive: true });
  cpSync(from, to, { recursive: true });
}

mkdirSync(outDir, { recursive: true });
copyTree(appDir, join(outDir, 'app'));
if (existsSync(shotsDir)) copyTree(shotsDir, join(outDir, 'screenshots'));

// The scorer's own caps: only text_max_bytes shapes the bytes; the rest
// refuse an entry the scorer would refuse (more than 4 screenshots or one
// over 256 KiB; more than 993 files and directories in app/ or 48 MiB of
// app files, counted beside /output's own 1000-entry cap with its
// screenshots/ and dossier.json).
writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
