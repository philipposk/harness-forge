# harness-forge

Multi-harness AI coding config generator. Drops the right configs, skills, and MCP servers into your repo for whichever AI coding tool you use — Claude Code, Cursor, Codex, Cline, Windsurf, Aider, Continue, Gemini CLI, Zed, OpenHands.

## Install + run (no install needed)

```bash
npx harness-forge init
```

The wizard asks:
1. Project name
2. One-sentence description
3. Stack profile (React+Node, Next.js+Prisma, FastAPI+Postgres, Rust CLI, Mobile/Expo)
4. Which AI coding tools you use (multi-select)
5. Recommended-only or all-matching skills + MCPs
6. Confirm

It writes AGENTS.md (universal), tool-specific overrides for whichever you picked, `.mcp.json`, `TODO.md`, and `SPEC.md`.

## Other commands

```bash
harness-forge init --dry-run         # See what would be written, don't touch files
harness-forge init --yes             # Non-interactive (uses defaults)
harness-forge init --stack nextjs-prisma --harness claude-code --harness cursor
harness-forge list-harnesses         # Show all supported tools
harness-forge list-stacks            # Show all stack profiles
```

## Develop

```bash
pnpm install
pnpm --filter harness-forge build
node packages/cli/dist/bin.js init --dry-run --yes
```

## License

MIT.
