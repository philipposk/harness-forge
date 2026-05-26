import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import type { GeneratedFile } from "@appblueprints/core";

export interface WriteFilesOptions {
  cwd: string;
  files: GeneratedFile[];
  overwrite?: boolean;
}

export interface WriteResult {
  written: number;
  skipped: number;
  paths: string[];
}

async function exists(p: string): Promise<boolean> {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

export async function writeFiles(
  opts: WriteFilesOptions
): Promise<WriteResult> {
  const written: string[] = [];
  let skipped = 0;

  for (const file of opts.files) {
    const abs = resolve(opts.cwd, file.path);
    if (!opts.overwrite && (await exists(abs))) {
      skipped += 1;
      continue;
    }
    await mkdir(dirname(abs), { recursive: true });
    await writeFile(abs, file.content, "utf8");
    written.push(join(opts.cwd, file.path));
  }

  return { written: written.length, skipped, paths: written };
}
