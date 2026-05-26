import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import { z } from "zod";
import {
  HarnessSpec,
  SkillEntry,
  McpEntry,
  StackProfile,
  type HarnessId,
} from "./schemas.js";

export interface LoadOptions {
  dataDir: string;
}

async function loadDir<S extends z.ZodTypeAny>(
  dir: string,
  schema: S
): Promise<Array<z.infer<S>>> {
  let entries: string[];
  try {
    entries = await readdir(dir);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }

  const files = entries.filter((f) => f.endsWith(".yml") || f.endsWith(".yaml"));
  const results: Array<z.infer<S>> = [];

  const entrySchema = schema;
  const arraySchema = z.array(schema);

  for (const file of files) {
    const fullPath = join(dir, file);
    const raw = await readFile(fullPath, "utf8");
    const parsed = parseYaml(raw);

    const items = Array.isArray(parsed) ? parsed : [parsed];

    const arrResult = arraySchema.safeParse(items);
    if (!arrResult.success) {
      const issues = arrResult.error.issues
        .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
        .join("\n");
      const hint = !Array.isArray(parsed)
        ? entrySchema.safeParse(parsed).success
          ? ""
          : "\n(File parsed as single entry; tried as array too.)"
        : "";
      throw new Error(`Validation failed for ${fullPath}:\n${issues}${hint}`);
    }
    for (const item of arrResult.data) results.push(item);
  }

  return results;
}

export async function loadHarnesses(opts: LoadOptions): Promise<HarnessSpec[]> {
  return loadDir(join(opts.dataDir, "harnesses"), HarnessSpec);
}

export async function loadSkills(opts: LoadOptions): Promise<SkillEntry[]> {
  return loadDir(join(opts.dataDir, "skills"), SkillEntry);
}

export async function loadMcps(opts: LoadOptions): Promise<McpEntry[]> {
  return loadDir(join(opts.dataDir, "mcps"), McpEntry);
}

export async function loadStacks(opts: LoadOptions): Promise<StackProfile[]> {
  return loadDir(join(opts.dataDir, "stacks"), StackProfile);
}

export async function loadAll(opts: LoadOptions) {
  const [harnesses, skills, mcps, stacks] = await Promise.all([
    loadHarnesses(opts),
    loadSkills(opts),
    loadMcps(opts),
    loadStacks(opts),
  ]);
  return { harnesses, skills, mcps, stacks };
}

export async function loadHarnessSpec(
  id: HarnessId,
  opts: LoadOptions
): Promise<HarnessSpec | null> {
  const all = await loadHarnesses(opts);
  return all.find((h) => h.id === id) ?? null;
}
