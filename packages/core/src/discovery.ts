import type { HarnessId } from "./schemas.js";

export interface DiscoveryEntry {
  id: string;
  name: string;
  description: string;
  sourceUrl: string;
  kind: "skill" | "mcp";
  stars?: number;
  pushedAt?: string;
}

export interface LiveTopUpOptions {
  stacks: string[];
  harnesses?: HarnessId[];
  githubToken?: string;
  recentDays?: number;
  signal?: AbortSignal;
  cache?: Map<string, { value: DiscoveryEntry[]; expiresAt: number }>;
}

const DEFAULT_TTL_MS = 60 * 60 * 1000;

const SKILL_TOPICS = ["claude-skill", "anthropic-skill", "claude-code-skill"];
const MCP_TOPICS = ["mcp-server", "model-context-protocol", "mcp"];

interface GitHubSearchResponse {
  items?: Array<{
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    pushed_at: string;
    topics?: string[];
  }>;
}

async function searchGitHub(
  topic: string,
  recentDays: number,
  token: string | undefined,
  signal: AbortSignal | undefined
): Promise<GitHubSearchResponse> {
  const since = new Date(Date.now() - recentDays * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const q = encodeURIComponent(`topic:${topic} pushed:>${since}`);
  const url = `https://api.github.com/search/repositories?q=${q}&sort=stars&order=desc&per_page=20`;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { headers, signal });
  if (!res.ok) {
    throw new Error(`GitHub search failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as GitHubSearchResponse;
}

function toEntry(
  repo: NonNullable<GitHubSearchResponse["items"]>[number],
  kind: DiscoveryEntry["kind"]
): DiscoveryEntry {
  const slug = repo.full_name.toLowerCase().replace(/[^a-z0-9-]/g, "-");
  return {
    id: slug,
    name: repo.name,
    description: repo.description ?? `${kind} repo`,
    sourceUrl: repo.html_url,
    kind,
    stars: repo.stargazers_count,
    pushedAt: repo.pushed_at,
  };
}

export async function liveTopUp(
  opts: LiveTopUpOptions
): Promise<DiscoveryEntry[]> {
  const recentDays = opts.recentDays ?? 30;
  const cache = opts.cache;
  const cacheKey = `${recentDays}|${opts.stacks.join(",")}`;
  const now = Date.now();

  if (cache) {
    const hit = cache.get(cacheKey);
    if (hit && hit.expiresAt > now) return hit.value;
  }

  const topics = [...SKILL_TOPICS, ...MCP_TOPICS];
  const results: DiscoveryEntry[] = [];

  for (const topic of topics) {
    try {
      const data = await searchGitHub(
        topic,
        recentDays,
        opts.githubToken,
        opts.signal
      );
      const kind: DiscoveryEntry["kind"] = SKILL_TOPICS.includes(topic)
        ? "skill"
        : "mcp";
      for (const item of data.items ?? []) {
        results.push(toEntry(item, kind));
      }
    } catch {
      // Swallow — discovery is best-effort. Wizard still works offline.
    }
  }

  const seen = new Set<string>();
  const deduped: DiscoveryEntry[] = [];
  for (const r of results) {
    if (seen.has(r.id)) continue;
    seen.add(r.id);
    deduped.push(r);
  }

  if (cache) {
    cache.set(cacheKey, {
      value: deduped,
      expiresAt: now + DEFAULT_TTL_MS,
    });
  }

  return deduped;
}
