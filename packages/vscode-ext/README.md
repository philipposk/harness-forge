# Harness Forge (VS Code / Cursor extension)

Run the Harness Forge wizard from inside VS Code, Cursor, or any Code-compatible IDE.

## Commands

- **Harness Forge: Init this workspace** — opens an integrated terminal in the active folder and runs `npx -y harness-forge@latest init`.
- **Harness Forge: Open web wizard** — opens https://harness-forge.6x7.gr in your browser.

## Why so thin?

The generator lives in the canonical `@appblueprints/core` library and ships as the `harness-forge` npm CLI. The extension is a launcher so the install footprint stays tiny and the generator stays in one place. Cursor inherits VS Code's extension API, so the same `.vsix` works in both.

## Build

```bash
pnpm install
pnpm --filter harness-forge-vscode build
pnpm --filter harness-forge-vscode package   # produces harness-forge-vscode-0.0.1.vsix
```
