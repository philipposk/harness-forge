# @appblueprints/crawler

Nightly discovery crawler. Fetches upstream awesome-lists and the GitHub Search API, dedupes against `data/`, writes candidate YAML to `crawler/out/` for human review.

## Run locally

```bash
pnpm --filter @appblueprints/crawler crawl
ls crawler/out/
```

## Sources

See `src/sources.ts`. Currently mirrors:

- modelcontextprotocol/servers
- wong2/awesome-mcp-servers
- appcypher/awesome-mcp-servers
- punkpeye/awesome-mcp-servers
- ComposioHQ/awesome-claude-skills
- josix/awesome-claude-md
- rohitg00/awesome-claude-code-toolkit

## CI

`.github/workflows/crawler.yml` runs daily at 03:17 UTC, opens a PR with the diff.

## Live top-up

In addition to the nightly crawl, the wizard uses `liveTopUp()` from `@appblueprints/core/discovery` to hit the GitHub Search API on demand (cached 1h, falls back silently if rate-limited).
