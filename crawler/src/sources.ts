// Upstream curated lists that we mirror. Each source has a parser that turns
// the upstream Markdown/JSON into normalised candidate entries.

export interface SourceRepo {
  id: string;
  name: string;
  kind: "mcp" | "skill";
  rawUrl: string;
  // Lightweight Markdown link extractor; many awesome-lists follow `- [name](url) — description`.
  parseMarkdownLinks: true;
}

export const SOURCES: SourceRepo[] = [
  {
    id: "wong2-awesome-mcp-servers",
    name: "wong2/awesome-mcp-servers",
    kind: "mcp",
    rawUrl:
      "https://raw.githubusercontent.com/wong2/awesome-mcp-servers/main/README.md",
    parseMarkdownLinks: true,
  },
  {
    id: "modelcontextprotocol-servers",
    name: "modelcontextprotocol/servers",
    kind: "mcp",
    rawUrl:
      "https://raw.githubusercontent.com/modelcontextprotocol/servers/main/README.md",
    parseMarkdownLinks: true,
  },
  {
    id: "appcypher-awesome-mcp-servers",
    name: "appcypher/awesome-mcp-servers",
    kind: "mcp",
    rawUrl:
      "https://raw.githubusercontent.com/appcypher/awesome-mcp-servers/main/README.md",
    parseMarkdownLinks: true,
  },
  {
    id: "punkpeye-awesome-mcp-servers",
    name: "punkpeye/awesome-mcp-servers",
    kind: "mcp",
    rawUrl:
      "https://raw.githubusercontent.com/punkpeye/awesome-mcp-servers/main/README.md",
    parseMarkdownLinks: true,
  },
  {
    id: "composiohq-awesome-claude-skills",
    name: "ComposioHQ/awesome-claude-skills",
    kind: "skill",
    rawUrl:
      "https://raw.githubusercontent.com/ComposioHQ/awesome-claude-skills/main/README.md",
    parseMarkdownLinks: true,
  },
  {
    id: "josix-awesome-claude-md",
    name: "josix/awesome-claude-md",
    kind: "skill",
    rawUrl:
      "https://raw.githubusercontent.com/josix/awesome-claude-md/main/README.md",
    parseMarkdownLinks: true,
  },
  {
    id: "rohitg00-awesome-claude-code-toolkit",
    name: "rohitg00/awesome-claude-code-toolkit",
    kind: "skill",
    rawUrl:
      "https://raw.githubusercontent.com/rohitg00/awesome-claude-code-toolkit/main/README.md",
    parseMarkdownLinks: true,
  },
];
