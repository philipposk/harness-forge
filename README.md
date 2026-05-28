# AppBlueprints — Setup Files for AI Coding Assistants

A tool that sets up the right "instruction files" for whichever AI coding assistant you use. You answer a few simple questions — what you're building and which AI tool you work with — and it drops the matching setup files into your project so your AI assistant instantly understands your project, your habits, and what extra abilities it should have. It works across many popular AI coding tools, not just one.

## What it does
- Asks a few short questions about your project and your tools
- Creates the correct setup files for assistants like Claude Code, Cursor, Codex, Cline, Windsurf, and others
- Picks helpful add-ons (extra skills and connections to outside tools) that suit your project
- Can also run on a website wizard, as a command-line tool, or inside your code editor
- Keeps an auto-updated list of useful AI tools that it refreshes overnight

## Status
Work in progress, fully built and passing its tests. It is not yet published to the public download stores (npm, PyPI, the VS Code Marketplace), but the project is ready to publish when desired.

---
### For developers
A pnpm monorepo. The generator writes a universal `AGENTS.md` base plus harness-specific overrides for the tools you select. Supported harnesses (v1): Claude Code, Cursor, Codex CLI, Cline, Windsurf, Aider, Continue, Gemini CLI, Zed, OpenHands — each described by a YAML spec under `data/harnesses/`.

Packages:
- `@appblueprints/core` — TS lib: schemas, loaders, recommender, generator, discovery
- `appblueprints` (npm CLI) — `npx appblueprints init` wizard
- `@appblueprints/web` — Next.js wizard for appblueprints.6x7.gr
- `@appblueprints/crawler` — nightly upstream awesome-list crawler
- `@appblueprints/claude-skill` — Claude Code skill wrapping the CLI
- `appblueprints` (PyPI) — Python shim around the npm CLI
- `appblueprints-vscode` — VS Code / Cursor extension

Run locally:

```bash
pnpm install
pnpm -r build
pnpm -r test

node packages/cli/dist/bin.js init --dry-run --yes --stack nextjs-prisma \
     --harness claude-code --harness cursor

pnpm --filter @appblueprints/web dev     # http://localhost:3007
pnpm --filter @appblueprints/crawler crawl
pnpm build-awesome                        # regenerates AWESOME.md
```

Curated source of truth lives in `data/` (harnesses, skills, MCP servers, stacks). Node >=20. MIT licensed.
