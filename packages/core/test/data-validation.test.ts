import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { loadAll } from "../src/loader.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(__dirname, "../../../data");

describe("data/ validates against schemas", () => {
  it("loads every YAML file without errors", async () => {
    const { harnesses, skills, mcps, stacks } = await loadAll({ dataDir });
    expect(harnesses.length).toBeGreaterThanOrEqual(10);
    expect(stacks.length).toBeGreaterThanOrEqual(5);
    expect(skills.length).toBeGreaterThanOrEqual(20);
    expect(mcps.length).toBeGreaterThanOrEqual(20);
  });

  it("harness IDs are unique", async () => {
    const { harnesses } = await loadAll({ dataDir });
    const ids = harnesses.map((h) => h.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("skill IDs are unique", async () => {
    const { skills } = await loadAll({ dataDir });
    const ids = skills.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("mcp IDs are unique", async () => {
    const { mcps } = await loadAll({ dataDir });
    const ids = mcps.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("stack recommendedSkills reference real skills", async () => {
    const { skills, stacks } = await loadAll({ dataDir });
    const skillIds = new Set(skills.map((s) => s.id));
    for (const stack of stacks) {
      for (const skillId of stack.recommendedSkills) {
        expect(skillIds, `stack ${stack.id} -> skill ${skillId}`).toContain(skillId);
      }
    }
  });

  it("stack recommendedMcps reference real mcps", async () => {
    const { mcps, stacks } = await loadAll({ dataDir });
    const mcpIds = new Set(mcps.map((m) => m.id));
    for (const stack of stacks) {
      for (const mcpId of stack.recommendedMcps) {
        expect(mcpIds, `stack ${stack.id} -> mcp ${mcpId}`).toContain(mcpId);
      }
    }
  });
});
