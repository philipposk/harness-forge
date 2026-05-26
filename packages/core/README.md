# @appblueprints/core

Core schemas, loaders, and recommender for AppBlueprints. Pure functions, no I/O outside loaders.

## What it does

Reads the curated YAML data in `/data` (one source of truth across the whole monorepo) and turns it into typed objects. Other packages (CLI, web wizard, Claude skill, VS Code extension) consume this lib instead of touching YAML directly.

## Exports

- `loadAll({ dataDir })` — load every harness, skill, MCP and stack profile from `data/`. Throws with a clear path-and-issue error if any file fails schema validation.
- `loadHarnessSpec(id, opts)` — fetch a single harness spec.
- `recommend({ stack, harnesses, tier, allSkills, allMcps })` — pick the skills + MCP servers that fit a given stack and tier (`recommended` vs `all`).
- Schemas (zod): `HarnessSpec`, `SkillEntry`, `McpEntry`, `StackProfile`, `TemplateMeta`.

## Develop

```bash
pnpm install
pnpm test     # validates every file under data/
pnpm build
```
