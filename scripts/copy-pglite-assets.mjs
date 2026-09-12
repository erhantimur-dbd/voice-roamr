#!/usr/bin/env node
/** Copy PGLite wasm/data next to the Nitro server bundle so `vite preview` can boot. */
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "node_modules/@electric-sql/pglite/dist");
const dst = join(root, ".vercel/output/functions/__server.func/_libs");
if (!existsSync(dst)) process.exit(0);
mkdirSync(dst, { recursive: true });
for (const file of ["pglite.data", "pglite.wasm", "initdb.wasm"]) {
  const from = join(src, file);
  if (!existsSync(from)) continue;
  copyFileSync(from, join(dst, file));
}
