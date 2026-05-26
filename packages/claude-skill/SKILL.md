---
name: appblueprints
description: Generate AGENTS.md, CLAUDE.md, .cursor/rules, skills bundle and MCP config for the current project using AppBlueprints. Use when the user says "set up this repo for Claude", "generate AGENTS.md", "scaffold my AI configs", "init claude code", or "make this work with cursor/codex/cline/windsurf".
---

# AppBlueprints — Multi-Harness Config Generator

This skill drops the right config files into the current project for whichever AI coding tool the user has — Claude Code, Cursor, Codex, Cline, Windsurf, Aider, Continue, Gemini CLI, Zed, OpenHands.

## When to invoke

- User asks to "set up Claude Code for this repo"
- User asks for AGENTS.md, CLAUDE.md, or `.cursor/rules`
- User asks for a stack-aware skill or MCP server bundle
- User wants to migrate from one AI coding tool to several (e.g. Cursor → Claude Code + Cursor)

## How to invoke

Run the bundled CLI via `npx`:

```bash
# Interactive wizard (recommended)
npx appblueprints init

# Non-interactive with explicit choices
npx appblueprints init --yes --stack <stack-id> --harness <harness-id> [--harness <harness-id>...]

# Discover available choices
npx appblueprints list-stacks
npx appblueprints list-harnesses

# Preview without writing
npx appblueprints init --dry-run --yes
```

Stack IDs: `react-node`, `nextjs-prisma`, `fastapi-postgres`, `rust-cli`, `mobile-expo`.

Harness IDs: `claude-code`, `cursor`, `codex`, `cline`, `windsurf`, `aider`, `continue`, `gemini-cli`, `zed`, `openhands`.

## Decision flow

1. Confirm the project directory with the user (`pwd`).
2. Ask which AI coding tools they want to support if you do not already know.
3. Detect the stack from `package.json` / `pyproject.toml` / `Cargo.toml` / `app.json` if not specified.
4. Run `npx appblueprints init --yes --stack <inferred> --harness claude-code [...]`.
5. Show the user the files that were written.
6. If `.mcp.json` was generated, remind the user to fill in real API keys (e.g. `$SENTRY_AUTH_TOKEN`, `$GITHUB_TOKEN`) before connecting.

## Safety

- The CLI never overwrites existing files unless explicitly told to.
- Generated `.mcp.json` includes placeholder env vars; the user must populate them.
- Encourage `--dry-run` first if the user is unsure.

## Links

- Repo: https://github.com/philipposk/AppBlueprints
- Web wizard: https://appblueprints.6x7.gr
- npm: https://www.npmjs.com/package/appblueprints
