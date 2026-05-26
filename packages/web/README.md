# @appblueprints/web

Next.js wizard for AppBlueprints. Same `@appblueprints/core` generator as the CLI, browser UI.

Deploys to `appblueprints.6x7.gr` (or `6x7.gr/AppBlueprints` via `APPBLUEPRINTS_BASE_PATH`).

## Develop

```bash
pnpm install
pnpm --filter @appblueprints/web dev
# open http://localhost:3007
```

## Build

```bash
pnpm --filter @appblueprints/web build
pnpm --filter @appblueprints/web start
```

## API

- `GET  /api/data` — Returns the list of harnesses + stacks + counts (cached).
- `POST /api/generate` — Body: `{ projectName, projectDescription, stackId, harnessIds[], tier, asZip }`. Returns JSON file list or a zip download.

## Env

- `APPBLUEPRINTS_DATA_DIR` (optional) — Absolute path to the `data/` directory. Defaults to a checkout-relative lookup.
- `APPBLUEPRINTS_BASE_PATH` (optional) — Next.js basePath for subpath deploys.
