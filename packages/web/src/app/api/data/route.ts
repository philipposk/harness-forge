import { NextResponse } from "next/server";
import { loadAll } from "@appblueprints/core";
import { getDataDir } from "@/lib/data-dir";

export const dynamic = "force-static";

export async function GET() {
  const dataDir = getDataDir();
  const { harnesses, skills, mcps, stacks } = await loadAll({ dataDir });

  return NextResponse.json({
    harnesses: harnesses.map((h) => ({
      id: h.id,
      name: h.name,
      vendor: h.vendor,
      docsUrl: h.docsUrl,
      supports: h.supports,
      agentsMdCompatible: h.agentsMdCompatible,
    })),
    stacks: stacks.map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      tags: s.tags,
    })),
    counts: {
      harnesses: harnesses.length,
      skills: skills.length,
      mcps: mcps.length,
      stacks: stacks.length,
    },
  });
}
