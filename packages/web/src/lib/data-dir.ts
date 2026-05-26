import { existsSync } from "node:fs";
import { resolve } from "node:path";

// Resolve the runtime data dir. In dev, this is the monorepo data/ folder.
// In production, the standalone build will copy data/ alongside the app.
export function getDataDir(): string {
  const fromEnv = process.env.APPBLUEPRINTS_DATA_DIR;
  if (fromEnv && existsSync(fromEnv)) return fromEnv;

  const candidates = [
    resolve(process.cwd(), "data"),
    resolve(process.cwd(), "../../data"),
    resolve(process.cwd(), "../data"),
  ];
  for (const c of candidates) {
    if (existsSync(c)) return c;
  }
  throw new Error(
    `Could not locate data/ directory. Set APPBLUEPRINTS_DATA_DIR or run from a checkout.`
  );
}
