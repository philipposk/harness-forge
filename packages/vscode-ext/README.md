# AppBlueprints (VS Code / Cursor extension)

Run the AppBlueprints wizard from inside VS Code, Cursor, or any Code-compatible IDE.

## Commands

- **AppBlueprints: Init this workspace** — opens an integrated terminal in the active folder and runs `npx -y appblueprints@latest init`.
- **AppBlueprints: Open web wizard** — opens https://appblueprints.6x7.gr in your browser.

## Why so thin?

The generator lives in the canonical `@appblueprints/core` library and ships as the `appblueprints` npm CLI. The extension is a launcher so the install footprint stays tiny and the generator stays in one place. Cursor inherits VS Code's extension API, so the same `.vsix` works in both.

## Build

```bash
pnpm install
pnpm --filter appblueprints-vscode build
pnpm --filter appblueprints-vscode package   # produces appblueprints-vscode-0.0.1.vsix
```
