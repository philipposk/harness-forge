import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// Resolve the runtime data dir for the CLI.
// - When installed from npm: data/ sits alongside dist/.
// - When run via tsx in the monorepo: data/ is two levels up (packages/cli/src -> AppBlueprints/data).
export function resolveDataDir(): string {
  const here = dirname(fileURLToPath(import.meta.url));

  const candidates = [
    resolve(here, "..", "data"),
    resolve(here, "..", "..", "data"),
    resolve(here, "..", "..", "..", "..", "data"),
  ];

  for (const c of candidates) {
    if (existsSync(c)) return c;
  }
  throw new Error(
    `Could not locate AppBlueprints data/ dir. Searched:\n${candidates.map((c) => `  - ${c}`).join("\n")}`
  );
}
