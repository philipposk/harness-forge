# @appblueprints/claude-skill

Claude Code skill packaging for AppBlueprints. The skill teaches Claude Code when and how to invoke the `appblueprints` CLI.

## Install

```bash
node packages/claude-skill/scripts/install.mjs
# Drops SKILL.md into ~/.claude/skills/appblueprints/
```

Then open Claude Code in any project and ask:

> "set up this repo for Claude Code and Cursor"

Claude will detect the AppBlueprints skill and run `npx appblueprints init` for you.

## How it works

The skill is a single `SKILL.md` with YAML frontmatter. Claude Code reads the `description:` field to decide when to invoke. The body tells Claude how to call the CLI, what flags to pass, and what to do after.

Requires `npx` (Node.js ≥20) on the user's machine.
