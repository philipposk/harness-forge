import { describe, expect, it } from "vitest";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { crawl } from "../src/run.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(__dirname, "../../data");

const STUB_MD = `# Awesome List Stub

- [github-mcp-server](https://github.com/github/github-mcp-server) — Official GitHub MCP
- [appblueprints-new-thing](https://github.com/example-org/appblueprints-new-thing) — Hot new repo
- [non-github](https://example.com/foo/bar) — Should be skipped
`;

function makeFetchStub() {
  return async () =>
    new Response(STUB_MD, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
}

describe("crawl()", () => {
  it("writes candidate yaml + summary for new repos", async () => {
    const outDir = await mkdtemp(join(tmpdir(), "appblueprints-crawl-"));
    try {
      const result = await crawl({
        dataDir,
        outDir,
        fetchImpl: makeFetchStub() as unknown as typeof fetch,
      });

      const summary = JSON.parse(
        await readFile(join(outDir, "summary.json"), "utf8")
      );
      expect(summary.totalCandidates).toBeGreaterThan(0);
      // At least one new entry across all sources.
      expect(result.newSkills + result.newMcps).toBeGreaterThan(0);
    } finally {
      await rm(outDir, { recursive: true, force: true });
    }
  });
});
