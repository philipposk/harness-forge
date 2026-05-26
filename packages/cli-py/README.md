# appblueprints (Python)

Multi-harness AI coding config generator. Python wrapper around the official [`appblueprints` npm CLI](https://www.npmjs.com/package/appblueprints).

## Install

```bash
pip install appblueprints
```

## Use

```bash
appblueprints init
appblueprints init --yes --stack fastapi-postgres --harness claude-code
appblueprints list-harnesses
```

## Requirements

- Python ≥3.9
- Node.js ≥20 (the wrapper shells out to `npx`)

> A pure-Python reimplementation is on the roadmap. For now this package keeps Python users on one tool while the canonical generator stays in TypeScript.
