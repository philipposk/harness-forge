// Very small Markdown link extractor for awesome-list bullets like:
//   - [Repo Name](https://github.com/foo/bar) — Description text
// We do not parse Markdown structurally; awesome-lists are too varied for that.

export interface MarkdownLink {
  name: string;
  url: string;
  description: string;
}

const LINK_BULLET = /^[\s>]*[-*+]\s+\[([^\]]+)\]\(([^)]+)\)\s*[—\-:]*\s*(.*)$/;

export function extractMarkdownLinks(markdown: string): MarkdownLink[] {
  const out: MarkdownLink[] = [];
  const lines = markdown.split(/\r?\n/);
  for (const line of lines) {
    const m = LINK_BULLET.exec(line);
    if (!m) continue;
    const [, name, url, descRaw] = m;
    if (!name || !url) continue;
    const description = (descRaw ?? "").replace(/\s+/g, " ").trim();
    out.push({ name: name.trim(), url: url.trim(), description });
  }
  return out;
}

export function isGitHubRepoUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.hostname !== "github.com") return false;
    const parts = u.pathname.split("/").filter(Boolean);
    return parts.length >= 2;
  } catch {
    return false;
  }
}

export function repoSlugFromUrl(url: string): string {
  try {
    const u = new URL(url);
    const [owner, repo] = u.pathname.split("/").filter(Boolean);
    return `${owner}-${repo}`.toLowerCase().replace(/[^a-z0-9-]/g, "-");
  } catch {
    return url.toLowerCase().replace(/[^a-z0-9-]/g, "-");
  }
}
