import { z } from "zod";

export const HarnessId = z.enum([
  "claude-code",
  "cursor",
  "codex",
  "cline",
  "windsurf",
  "aider",
  "continue",
  "gemini-cli",
  "zed",
  "openhands",
]);
export type HarnessId = z.infer<typeof HarnessId>;

const ConfigFile = z.object({
  path: z.string(),
  scope: z.enum(["project", "global"]),
  format: z.enum(["markdown", "yaml", "toml", "json", "mdc", "plaintext"]),
  required: z.boolean().default(false),
});

export const HarnessSpec = z.object({
  id: HarnessId,
  name: z.string(),
  vendor: z.string(),
  homepage: z.string().url(),
  docsUrl: z.string().url(),
  configFiles: z.array(ConfigFile).min(1),
  supports: z.object({
    skills: z.boolean(),
    mcp: z.boolean(),
    memory: z.boolean(),
    customCommands: z.boolean(),
    ignoreFile: z.boolean(),
  }),
  agentsMdCompatible: z.boolean().describe("Reads the universal AGENTS.md file"),
  exampleSnippet: z.string(),
  notes: z.string().optional(),
});
export type HarnessSpec = z.infer<typeof HarnessSpec>;

export const SkillEntry = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  description: z.string(),
  sourceUrl: z.string().url(),
  author: z.string().optional(),
  tags: z.array(z.string()).default([]),
  stacks: z.array(z.string()).default([]).describe("Stack IDs this skill suits"),
  harnesses: z.array(HarnessId).default([]).describe("Harnesses that can use this skill; empty = universal"),
  recommended: z.boolean().default(false),
  installSnippet: z.string().optional(),
});
export type SkillEntry = z.infer<typeof SkillEntry>;

export const McpEntry = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  description: z.string(),
  sourceUrl: z.string().url(),
  transport: z.enum(["stdio", "sse", "http", "websocket"]),
  auth: z.enum(["none", "api-key", "oauth", "basic"]).default("none"),
  tags: z.array(z.string()).default([]),
  stacks: z.array(z.string()).default([]),
  recommended: z.boolean().default(false),
  configSnippet: z.string().describe("JSON snippet for mcpServers entry"),
});
export type McpEntry = z.infer<typeof McpEntry>;

export const StackProfile = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  description: z.string(),
  tags: z.array(z.string()).default([]),
  recommendedSkills: z.array(z.string()).default([]),
  recommendedMcps: z.array(z.string()).default([]),
  conventions: z.array(z.string()).default([]).describe("Bullet points for AGENTS.md/CLAUDE.md body"),
});
export type StackProfile = z.infer<typeof StackProfile>;

export const TemplateMeta = z.object({
  id: z.string(),
  harness: HarnessId.or(z.literal("universal")),
  outputPath: z.string().describe("Relative path in user repo where rendered output is written"),
  engine: z.enum(["eta", "handlebars", "plain"]).default("eta"),
  description: z.string().optional(),
});
export type TemplateMeta = z.infer<typeof TemplateMeta>;
