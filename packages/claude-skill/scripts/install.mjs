#!/usr/bin/env node
// Copies SKILL.md (and any sibling assets) into ~/.claude/skills/appblueprints/.
import { cp, mkdir } from "node:fs/promises";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const src = resolve(here, "..");
const dst = resolve(homedir(), ".claude", "skills", "appblueprints");

await mkdir(dst, { recursive: true });
await cp(resolve(src, "SKILL.md"), resolve(dst, "SKILL.md"));
console.log(`Installed AppBlueprints skill at ${dst}`);
console.log(`Open Claude Code in any project and ask it to "run appblueprints init".`);
