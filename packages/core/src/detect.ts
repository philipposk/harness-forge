import { readFile, access } from "node:fs/promises";
import { join } from "node:path";

export interface DetectResult {
  stackId: string;
  confidence: "high" | "medium" | "low";
  evidence: string[];
}

async function exists(p: string): Promise<boolean> {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function readJsonSafe(p: string): Promise<Record<string, unknown> | null> {
  try {
    const raw = await readFile(p, "utf8");
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function readTextSafe(p: string): Promise<string | null> {
  try {
    return await readFile(p, "utf8");
  } catch {
    return null;
  }
}

function hasDep(pkg: Record<string, unknown> | null, name: string): boolean {
  if (!pkg) return false;
  const deps = (pkg.dependencies ?? {}) as Record<string, unknown>;
  const dev = (pkg.devDependencies ?? {}) as Record<string, unknown>;
  return name in deps || name in dev;
}

export async function detectStack(cwd: string): Promise<DetectResult | null> {
  const evidence: string[] = [];

  const pkgJsonPath = join(cwd, "package.json");
  const pyprojectPath = join(cwd, "pyproject.toml");
  const cargoPath = join(cwd, "Cargo.toml");
  const appJsonPath = join(cwd, "app.json");
  const requirementsPath = join(cwd, "requirements.txt");

  const [pkg, pyproject, cargo, appJson, requirements] = await Promise.all([
    readJsonSafe(pkgJsonPath),
    readTextSafe(pyprojectPath),
    readTextSafe(cargoPath),
    readJsonSafe(appJsonPath),
    readTextSafe(requirementsPath),
  ]);

  // Mobile / Expo: app.json with "expo" key, or package.json with "expo" dep.
  if (
    (appJson && "expo" in appJson) ||
    hasDep(pkg, "expo") ||
    (await exists(join(cwd, "expo.json")))
  ) {
    evidence.push("expo detected in app.json / package.json");
    return { stackId: "mobile-expo", confidence: "high", evidence };
  }

  // Next.js + Prisma.
  if (hasDep(pkg, "next") && hasDep(pkg, "prisma")) {
    evidence.push("next + prisma in package.json");
    return { stackId: "nextjs-prisma", confidence: "high", evidence };
  }
  if (hasDep(pkg, "next") && hasDep(pkg, "@prisma/client")) {
    evidence.push("next + @prisma/client in package.json");
    return { stackId: "nextjs-prisma", confidence: "high", evidence };
  }
  if (hasDep(pkg, "next")) {
    evidence.push("next in package.json");
    return { stackId: "nextjs-prisma", confidence: "medium", evidence };
  }

  // React + Node — react in package.json without next.
  if (hasDep(pkg, "react") || hasDep(pkg, "express") || hasDep(pkg, "fastify")) {
    if (hasDep(pkg, "react")) evidence.push("react in package.json");
    if (hasDep(pkg, "express")) evidence.push("express in package.json");
    if (hasDep(pkg, "fastify")) evidence.push("fastify in package.json");
    return { stackId: "react-node", confidence: "medium", evidence };
  }

  // FastAPI: pyproject.toml or requirements.txt mentions fastapi.
  if (
    (pyproject && /fastapi/i.test(pyproject)) ||
    (requirements && /fastapi/i.test(requirements))
  ) {
    evidence.push("fastapi in pyproject.toml or requirements.txt");
    return { stackId: "fastapi-postgres", confidence: "high", evidence };
  }

  // Rust CLI.
  if (cargo && /\[\[bin\]\]|\[package\]/.test(cargo)) {
    evidence.push("Cargo.toml present");
    return { stackId: "rust-cli", confidence: "high", evidence };
  }

  // Generic Node fallback.
  if (pkg) {
    evidence.push("package.json present, no specific framework detected");
    return { stackId: "react-node", confidence: "low", evidence };
  }

  return null;
}
