import { NextResponse, type NextRequest } from "next/server";
import { detectStackFromManifests, type StackManifests } from "@appblueprints/core";
import { z } from "zod";

export const dynamic = "force-dynamic";

const RequestBody = z.object({
  manifest: z.string().min(1).max(100_000),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = RequestBody.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Paste a package.json, pyproject.toml, Cargo.toml, go.mod, or requirements.txt." },
      { status: 400 }
    );
  }

  const text = parsed.data.manifest;

  // The user pastes a single manifest. We don't know which kind, so try to
  // parse it as JSON (package.json / app.json) and also feed the raw text to
  // the text-based detectors (pyproject / Cargo.toml / go.mod / requirements).
  // Each detector only matches its own keywords, so cross-feeding is safe.
  let json: Record<string, unknown> | null = null;
  try {
    const obj = JSON.parse(text);
    if (obj && typeof obj === "object") json = obj as Record<string, unknown>;
  } catch {
    /* not JSON — a TOML/text manifest */
  }

  // Set both JSON slots to the parsed object: detectStackFromManifests checks
  // app.json via the "expo" key and package.json via its dependencies, so a
  // real package.json won't trip the expo branch and vice versa.
  const manifests: StackManifests = {
    packageJson: json,
    appJson: json,
    pyproject: text,
    cargo: text,
    goMod: text,
    requirements: text,
  };

  const result = detectStackFromManifests(manifests);
  if (!result) {
    return NextResponse.json(
      { result: null, error: "Couldn't detect a stack from that file." },
      { status: 200 }
    );
  }
  return NextResponse.json({ result });
}
