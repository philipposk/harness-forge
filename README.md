# AppBlueprints

Multi-harness AI coding config generator. Describe your project, get the right configs, skills, memory, and MCP servers for **whichever AI coding tool you use** — Claude Code, Cursor, Codex, Cline, Windsurf, Aider, Continue, Gemini CLI, Zed, OpenHands.

## Plain-English overview

Think of it as a `create-react-app` for AI coding setups. You answer a few questions ("what are you building?", "which tools do you use?") and it drops the right config files in your repo so your AI assistant immediately knows your project, your conventions, and which extra tools (skills, MCP servers) it should have.

## Status

All five phases of the plan are scaffolded and passing tests. Not yet published to npm / PyPI / VS Code Marketplace — repo is ready to publish when you are.

| Package | What it is | Status |
| --- | --- | --- |
| `@appblueprints/core` | TS lib: schemas, loaders, recommender, generator, discovery | 8 tests pass |
| `appblueprints` (npm CLI) | `npx appblueprints init` wizard | 2 tests pass + smoke-tested |
| `@appblueprints/web` | Next.js wizard for `appblueprints.6x7.gr` | builds clean |
| `@appblueprints/crawler` | Nightly upstream awesome-list crawler | 4 tests pass |
| `@appblueprints/claude-skill` | Claude Code skill that wraps the CLI | ready to install |
| `appblueprints` (PyPI) | Python shim around the npm CLI | 2 tests pass |
| `appblueprints-vscode` | VS Code + Cursor extension | builds clean |
| `AWESOME.md` | Generated awesome-list export | generated |

## Try it locally

```bash
pnpm install
pnpm -r build
pnpm -r test

# Run the CLI from the built dist
node packages/cli/dist/bin.js init --dry-run --yes --stack nextjs-prisma \
     --harness claude-code --harness cursor

# Run the web wizard
pnpm --filter @appblueprints/web dev   # http://localhost:3007

# Run the crawler
pnpm --filter @appblueprints/crawler crawl

# Generate the awesome-list
pnpm build-awesome
```

## Repo layout

```
appblueprints/
├── packages/
│   ├── core/              TS lib — schemas, loaders, recommender, generator, discovery
│   ├── cli/               npm package `appblueprints`
│   ├── cli-py/            PyPI package `appblueprints` (Python wrapper)
│   ├── web/               Next.js wizard
│   ├── claude-skill/      Claude Code skill (SKILL.md + installer)
│   └── vscode-ext/        VS Code / Cursor extension
├── crawler/               Nightly upstream-list crawler
├── data/                  Curated YAML source of truth
│   ├── harnesses/         10 harness specs
│   ├── skills/            30 skill entries
│   ├── mcps/              50 MCP servers
│   ├── stacks/            5 stack profiles
│   └── templates/         (reserved for future template overrides)
├── scripts/
│   └── build-awesome.mjs  Generates AWESOME.md + JSON mirror from data/
├── .github/workflows/     CI + nightly crawler
└── samples/               Reference outputs from earlier prototype
```

## Supported harnesses (v1)

Claude Code, Cursor, Codex CLI, Cline, Windsurf, Aider, Continue, Gemini CLI, Zed, OpenHands. Each has a YAML spec under `data/harnesses/` describing its config-file paths, format, and skill/MCP/memory support.

The generator always emits **AGENTS.md** as a universal base (covers ~5 harnesses by inheritance), then writes harness-specific overrides for whichever tools you selected.

## License

MIT.
