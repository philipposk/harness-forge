import { readFile, access } from "node:fs/promises";
import { join } from "node:path";

export interface DetectResult {
  stackId: string;
  confidence: "high" | "medium" | "low";
  evidence: string[];
}

/** Parsed project manifests used for stack detection (no filesystem access). */
export interface StackManifests {
  packageJson?: Record<string, unknown> | null;
  pyproject?: string | null;
  cargo?: string | null;
  appJson?: Record<string, unknown> | null;
  requirements?: string | null;
  goMod?: string | null;
  /** Whether an expo.json file exists (only knowable from the filesystem). */
  expoJson?: boolean;
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

/**
 * Pure stack detection from already-loaded manifests. Used both by the CLI
 * (which reads files off disk) and the web "paste your manifest" scan.
 */
export function detectStackFromManifests(m: StackManifests): DetectResult | null {
  const evidence: string[] = [];
  const pkg = m.packageJson ?? null;
  const pyproject = m.pyproject ?? null;
  const cargo = m.cargo ?? null;
  const appJson = m.appJson ?? null;
  const requirements = m.requirements ?? null;
  const goMod = m.goMod ?? null;

  // Mobile / Expo: app.json with "expo" key, package.json "expo" dep, or expo.json.
  if ((appJson && "expo" in appJson) || hasDep(pkg, "expo") || m.expoJson) {
    evidence.push("expo detected in app.json / package.json");
    return { stackId: "mobile-expo", confidence: "high", evidence };
  }

  // Remix.
  if (
    hasDep(pkg, "@remix-run/react") ||
    hasDep(pkg, "@remix-run/node") ||
    hasDep(pkg, "@remix-run/serve")
  ) {
    evidence.push("@remix-run/* in package.json");
    return { stackId: "remix", confidence: "high", evidence };
  }

  // SvelteKit.
  if (hasDep(pkg, "@sveltejs/kit")) {
    evidence.push("@sveltejs/kit in package.json");
    return { stackId: "sveltekit", confidence: "high", evidence };
  }

  // T3 — Next.js + tRPC (often Prisma + Tailwind too).
  if (hasDep(pkg, "next") && hasDep(pkg, "@trpc/server")) {
    evidence.push("next + @trpc/server in package.json");
    return { stackId: "t3-trpc", confidence: "high", evidence };
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
    // Next.js without a detected ORM. nextjs-prisma is the closest profile,
    // but we drop to low confidence so the user knows to confirm the ORM.
    evidence.push("next in package.json (no prisma detected — verify ORM)");
    return { stackId: "nextjs-prisma", confidence: "low", evidence };
  }

  // Vue (Vite SPA). Nuxt also pulls vue in; vue-vite is the nearest profile.
  if (hasDep(pkg, "vue")) {
    evidence.push("vue in package.json");
    return { stackId: "vue-vite", confidence: "medium", evidence };
  }

  // React frontend (with or without a Node backend lib) — medium confidence.
  if (hasDep(pkg, "react")) {
    evidence.push("react in package.json");
    if (hasDep(pkg, "express")) evidence.push("express in package.json");
    if (hasDep(pkg, "fastify")) evidence.push("fastify in package.json");
    return { stackId: "react-node", confidence: "medium", evidence };
  }

  // Backend-only Node (Express/Fastify, no React). No dedicated backend-only
  // profile yet, so react-node is the nearest fit but only at low confidence.
  if (hasDep(pkg, "express") || hasDep(pkg, "fastify")) {
    if (hasDep(pkg, "express")) evidence.push("express in package.json (no react)");
    if (hasDep(pkg, "fastify")) evidence.push("fastify in package.json (no react)");
    return { stackId: "react-node", confidence: "low", evidence };
  }

  // Django: pyproject.toml or requirements.txt mentions django.
  if (
    (pyproject && /(^|[^a-z])django/i.test(pyproject)) ||
    (requirements && /(^|[^a-z])django/i.test(requirements))
  ) {
    evidence.push("django in pyproject.toml or requirements.txt");
    return { stackId: "django-postgres", confidence: "high", evidence };
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

  // Go service.
  if (goMod && /^module\s+\S+/m.test(goMod)) {
    evidence.push("go.mod present");
    return { stackId: "go-service", confidence: "high", evidence };
  }

  // Generic Node fallback.
  if (pkg) {
    evidence.push("package.json present, no specific framework detected");
    return { stackId: "react-node", confidence: "low", evidence };
  }

  return null;
}

/** Detect the stack of a project on disk by reading its manifest files. */
export async function detectStack(cwd: string): Promise<DetectResult | null> {
  const [pkg, pyproject, cargo, appJson, requirements, goMod, expoJson] =
    await Promise.all([
      readJsonSafe(join(cwd, "package.json")),
      readTextSafe(join(cwd, "pyproject.toml")),
      readTextSafe(join(cwd, "Cargo.toml")),
      readJsonSafe(join(cwd, "app.json")),
      readTextSafe(join(cwd, "requirements.txt")),
      readTextSafe(join(cwd, "go.mod")),
      exists(join(cwd, "expo.json")),
    ]);

  return detectStackFromManifests({
    packageJson: pkg,
    pyproject,
    cargo,
    appJson,
    requirements,
    goMod,
    expoJson,
  });
}
