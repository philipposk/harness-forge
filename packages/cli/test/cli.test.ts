import { describe, expect, it, beforeEach } from "vitest";
import { mkdtemp, rm, readFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { loadAll, generate, recommend } from "@appblueprints/core";
import { writeFiles } from "../src/writer.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(__dirname, "../../../data");

describe("CLI write pipeline (no prompts)", () => {
  let tmp: string;

  beforeEach(async () => {
    tmp = await mkdtemp(join(tmpdir(), "appblueprints-test-"));
  });

  it("writes expected files for claude+cursor+nextjs-prisma", async () => {
    const { harnesses, skills, mcps, stacks } = await loadAll({ dataDir });
    const stack = stacks.find((s) => s.id === "nextjs-prisma")!;
    const selected = harnesses.filter(
      (h) => h.id === "claude-code" || h.id === "cursor"
    );
    const reco = recommend({
      stack,
      harnesses: selected.map((h) => h.id),
      tier: "recommended",
      allSkills: skills,
      allMcps: mcps,
    });
    const files = generate({
      projectName: "Smoke Test",
      projectDescription: "End-to-end CLI smoke.",
      stack,
      harnesses: selected,
      skills: reco.skills,
      mcps: reco.mcps,
    });

    await writeFiles({ cwd: tmp, files });

    const root = await readdir(tmp);
    expect(root).toContain("AGENTS.md");
    expect(root).toContain("CLAUDE.md");
    expect(root).toContain("TODO.md");
    expect(root).toContain(".mcp.json");

    const cursorDir = await readdir(join(tmp, ".cursor", "rules"));
    expect(cursorDir).toContain("main.mdc");

    const mcp = JSON.parse(await readFile(join(tmp, ".mcp.json"), "utf8"));
    expect(mcp).toHaveProperty("mcpServers");

    await rm(tmp, { recursive: true, force: true });
  });

  it("skips existing files unless overwrite=true", async () => {
    const files = [
      { path: "AGENTS.md", content: "first" },
      { path: "TODO.md", content: "todo" },
    ];

    const first = await writeFiles({ cwd: tmp, files });
    expect(first.written).toBe(2);

    const second = await writeFiles({ cwd: tmp, files });
    expect(second.written).toBe(0);
    expect(second.skipped).toBe(2);

    const third = await writeFiles({
      cwd: tmp,
      files: [{ path: "AGENTS.md", content: "overwritten" }],
      overwrite: true,
    });
    expect(third.written).toBe(1);
    const result = await readFile(join(tmp, "AGENTS.md"), "utf8");
    expect(result).toBe("overwritten");

    await rm(tmp, { recursive: true, force: true });
  });
});
