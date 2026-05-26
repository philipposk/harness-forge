import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { detectStack } from "../src/detect.js";

describe("detectStack", () => {
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), "appblueprints-detect-"));
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("detects nextjs-prisma when next + prisma present", async () => {
    await writeFile(
      join(dir, "package.json"),
      JSON.stringify({
        dependencies: { next: "14.0.0", prisma: "5.0.0" },
      })
    );
    const r = await detectStack(dir);
    expect(r?.stackId).toBe("nextjs-prisma");
    expect(r?.confidence).toBe("high");
  });

  it("detects react-node when only react", async () => {
    await writeFile(
      join(dir, "package.json"),
      JSON.stringify({ dependencies: { react: "18.0.0" } })
    );
    const r = await detectStack(dir);
    expect(r?.stackId).toBe("react-node");
  });

  it("detects fastapi-postgres from pyproject.toml", async () => {
    await writeFile(
      join(dir, "pyproject.toml"),
      `[project]\nname="x"\ndependencies=["fastapi", "sqlalchemy"]\n`
    );
    const r = await detectStack(dir);
    expect(r?.stackId).toBe("fastapi-postgres");
  });

  it("detects rust-cli from Cargo.toml", async () => {
    await writeFile(
      join(dir, "Cargo.toml"),
      `[package]\nname="x"\nversion="0.1.0"\n[[bin]]\nname="x"\n`
    );
    const r = await detectStack(dir);
    expect(r?.stackId).toBe("rust-cli");
  });

  it("detects mobile-expo from app.json", async () => {
    await writeFile(
      join(dir, "app.json"),
      JSON.stringify({ expo: { name: "MyApp" } })
    );
    const r = await detectStack(dir);
    expect(r?.stackId).toBe("mobile-expo");
  });

  it("returns null when no signals", async () => {
    const r = await detectStack(dir);
    expect(r).toBeNull();
  });
});
