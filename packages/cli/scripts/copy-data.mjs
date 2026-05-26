// Copies the monorepo data/ folder into packages/cli/data so the published
// npm package is self-contained.
import { cp, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(__dirname, "../../../data");
const dstDir = resolve(__dirname, "../data");

await rm(dstDir, { recursive: true, force: true });
await cp(srcDir, dstDir, { recursive: true });
console.log(`Copied ${srcDir} -> ${dstDir}`);
