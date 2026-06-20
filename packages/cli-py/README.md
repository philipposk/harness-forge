# harness-forge (Python)

Multi-harness AI coding config generator. Python wrapper around the official [`harness-forge` npm CLI](https://www.npmjs.com/package/harness-forge).

## Install

```bash
pip install harness-forge
```

## Use

```bash
harness-forge init
harness-forge init --yes --stack fastapi-postgres --harness claude-code
harness-forge list-harnesses
```

## Requirements

- Python ≥3.9
- Node.js ≥20 (the wrapper shells out to `npx`)

> A pure-Python reimplementation is on the roadmap. For now this package keeps Python users on one tool while the canonical generator stays in TypeScript.
