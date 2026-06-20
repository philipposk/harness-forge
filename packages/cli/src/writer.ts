import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join, resolve, relative, isAbsolute } from "node:path";
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

  const root = resolve(opts.cwd);
  for (const file of opts.files) {
    const abs = resolve(root, file.path);
    // Defense in depth: never write outside the target directory, even if a
    // generated file.path were ever to contain "../" or an absolute path.
    const rel = relative(root, abs);
    if (rel === "" || rel.startsWith("..") || isAbsolute(rel)) {
      throw new Error(`Refusing to write outside target dir: ${file.path}`);
    }
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
