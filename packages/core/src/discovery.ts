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
const REQUEST_TIMEOUT_MS = 8000;
const MAX_CACHE_ENTRIES = 200;

const SKILL_TOPICS = ["claude-skill", "anthropic-skill", "claude-code-skill"];
const MCP_TOPICS = ["mcp-server", "model-context-protocol", "mcp"];

// Combine the caller's abort signal (if any) with a per-request timeout so a
// hung GitHub request can never stall the wizard indefinitely.
function withTimeout(signal: AbortSignal | undefined): AbortSignal {
  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  if (!signal) return timeout;
  if (typeof AbortSignal.any === "function") {
    return AbortSignal.any([signal, timeout]);
  }
  return signal;
}

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

  const res = await fetch(url, { headers, signal: withTimeout(signal) });
  if (!res.ok) {
    // Surface rate-limit details so the caller can decide to back off. GitHub
    // returns 403/429 with a Retry-After (seconds) or x-ratelimit-reset (epoch).
    if (res.status === 429 || res.status === 403) {
      const retryAfter = res.headers.get("retry-after");
      const reset = res.headers.get("x-ratelimit-reset");
      const hint = retryAfter
        ? `retry after ${retryAfter}s`
        : reset
          ? `resets at ${new Date(Number(reset) * 1000).toISOString()}`
          : "rate limited";
      throw new Error(`GitHub search rate limited (${res.status}): ${hint}`);
    }
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

  // Fetch all topics concurrently. Each is best-effort: a failed/rate-limited
  // topic is skipped without aborting the others, so the wizard still works
  // (and runs ~6x faster than the previous sequential loop).
  const settled = await Promise.allSettled(
    topics.map(async (topic) => {
      const data = await searchGitHub(
        topic,
        recentDays,
        opts.githubToken,
        opts.signal
      );
      const kind: DiscoveryEntry["kind"] = SKILL_TOPICS.includes(topic)
        ? "skill"
        : "mcp";
      return (data.items ?? []).map((item) => toEntry(item, kind));
    })
  );
  for (const outcome of settled) {
    if (outcome.status === "fulfilled") results.push(...outcome.value);
  }

  const seen = new Set<string>();
  const deduped: DiscoveryEntry[] = [];
  for (const r of results) {
    if (seen.has(r.id)) continue;
    seen.add(r.id);
    deduped.push(r);
  }

  if (cache) {
    // Drop expired entries, then evict oldest if still over the cap, so a
    // long-running server can't grow the cache without bound.
    for (const [key, entry] of cache) {
      if (entry.expiresAt <= now) cache.delete(key);
    }
    while (cache.size >= MAX_CACHE_ENTRIES) {
      const oldest = cache.keys().next().value;
      if (oldest === undefined) break;
      cache.delete(oldest);
    }
    cache.set(cacheKey, {
      value: deduped,
      expiresAt: now + DEFAULT_TTL_MS,
    });
  }

  return deduped;
}
