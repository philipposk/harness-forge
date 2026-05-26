import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";

export async function loadExistingIds(
  dataDir: string,
  kind: "skills" | "mcps"
): Promise<Set<string>> {
  const path = join(dataDir, kind, "seed.yml");
  const ids = new Set<string>();
  try {
    const raw = await readFile(path, "utf8");
    const data = parseYaml(raw);
    if (Array.isArray(data)) {
      for (const entry of data) {
        if (entry?.id) ids.add(String(entry.id));
        if (entry?.sourceUrl) ids.add(String(entry.sourceUrl).toLowerCase());
      }
    }
  } catch {
    // Missing or invalid file — treat as empty.
  }
  return ids;
}
