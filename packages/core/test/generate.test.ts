import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { loadAll } from "../src/loader.js";
import { recommend } from "../src/recommender.js";
import { generate } from "../src/generate.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(__dirname, "../../../data");

describe("generate produces expected file set", () => {
  it("emits AGENTS.md, CLAUDE.md, .mcp.json for Claude Code + Cursor + nextjs-prisma", async () => {
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
      projectName: "Demo App",
      projectDescription: "A demo Next.js app to validate the generator.",
      stack,
      harnesses: selected,
      skills: reco.skills,
      mcps: reco.mcps,
    });

    const paths = files.map((f) => f.path);
    expect(paths).toContain("AGENTS.md");
    expect(paths).toContain("CLAUDE.md");
    expect(paths).toContain(".cursor/rules/main.mdc");
    expect(paths).toContain(".mcp.json");
    expect(paths).toContain("TODO.md");
    expect(paths).toContain("SPEC.md");
    expect(paths).not.toContain(".windsurfrules");

    const agents = files.find((f) => f.path === "AGENTS.md")!;
    expect(agents.content).toContain("Demo App");
    expect(agents.content).toContain("Next.js + Prisma + Postgres");

    const mcpJson = files.find((f) => f.path === ".mcp.json")!;
    const parsed = JSON.parse(mcpJson.content);
    expect(parsed).toHaveProperty("mcpServers");
    expect(Object.keys(parsed.mcpServers).length).toBeGreaterThan(0);
  });

  it("respects 'recommended' tier vs 'all'", async () => {
    const { skills, mcps, stacks } = await loadAll({ dataDir });
    const stack = stacks.find((s) => s.id === "react-node")!;

    const recoSmall = recommend({
      stack,
      harnesses: ["claude-code"],
      tier: "recommended",
      allSkills: skills,
      allMcps: mcps,
    });

    const recoBig = recommend({
      stack,
      harnesses: ["claude-code"],
      tier: "all",
      allSkills: skills,
      allMcps: mcps,
    });

    expect(recoBig.skills.length).toBeGreaterThanOrEqual(recoSmall.skills.length);
    expect(recoBig.mcps.length).toBeGreaterThanOrEqual(recoSmall.mcps.length);
  });
});
