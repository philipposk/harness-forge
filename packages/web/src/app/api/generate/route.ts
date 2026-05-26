import { NextResponse, type NextRequest } from "next/server";
import {
  generate,
  loadAll,
  recommend,
  type HarnessId,
} from "@appblueprints/core";
import { getDataDir } from "@/lib/data-dir";
import { z } from "zod";

export const dynamic = "force-dynamic";

const RequestBody = z.object({
  projectName: z.string().min(1).max(200),
  projectDescription: z.string().min(1).max(2000),
  stackId: z.string(),
  harnessIds: z.array(z.string()).min(1),
  tier: z.enum(["recommended", "all"]).default("recommended"),
  asZip: z.boolean().default(false),
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
      { error: "Bad request", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const dataDir = getDataDir();
  const { harnesses, skills, mcps, stacks } = await loadAll({ dataDir });

  const stack = stacks.find((s) => s.id === parsed.data.stackId);
  if (!stack) {
    return NextResponse.json(
      { error: `Unknown stack: ${parsed.data.stackId}` },
      { status: 400 }
    );
  }

  const selectedHarnessIds = parsed.data.harnessIds as HarnessId[];
  const selectedHarnesses = harnesses.filter((h) =>
    selectedHarnessIds.includes(h.id)
  );

  if (selectedHarnesses.length === 0) {
    return NextResponse.json(
      { error: "No matching harnesses selected" },
      { status: 400 }
    );
  }

  const reco = recommend({
    stack,
    harnesses: selectedHarnessIds,
    tier: parsed.data.tier,
    allSkills: skills,
    allMcps: mcps,
  });

  const files = generate({
    projectName: parsed.data.projectName,
    projectDescription: parsed.data.projectDescription,
    stack,
    harnesses: selectedHarnesses,
    skills: reco.skills,
    mcps: reco.mcps,
  });

  if (parsed.data.asZip) {
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    for (const f of files) {
      zip.file(f.path, f.content);
    }
    const buf = await zip.generateAsync({ type: "arraybuffer" });
    const slug = parsed.data.projectName
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "appblueprints";
    const blob = new Blob([buf], { type: "application/zip" });
    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${slug}-appblueprints.zip"`,
        "Cache-Control": "no-store",
      },
    });
  }

  return NextResponse.json({
    files,
    counts: { skills: reco.skills.length, mcps: reco.mcps.length },
  });
}
