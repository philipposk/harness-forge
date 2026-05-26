import { NextResponse, type NextRequest } from "next/server";
import { liveTopUp, type HarnessId } from "@appblueprints/core";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const cache = new Map<
  string,
  { value: Awaited<ReturnType<typeof liveTopUp>>; expiresAt: number }
>();

export async function GET(req: NextRequest) {
  const stack = req.nextUrl.searchParams.get("stack") ?? "";
  const harnessesParam = req.nextUrl.searchParams.get("harnesses") ?? "";
  const harnesses = harnessesParam
    .split(",")
    .map((h) => h.trim())
    .filter(Boolean) as HarnessId[];

  try {
    const entries = await liveTopUp({
      stacks: stack ? [stack] : [],
      harnesses,
      githubToken: process.env.GITHUB_TOKEN,
      cache,
    });
    return NextResponse.json({ entries: entries.slice(0, 20) });
  } catch (err) {
    return NextResponse.json(
      { entries: [], error: err instanceof Error ? err.message : "discover failed" },
      { status: 200 }
    );
  }
}
