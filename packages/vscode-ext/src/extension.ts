import * as vscode from "vscode";

const WEB_URL =
  process.env.HARNESS_FORGE_WEB_URL ?? "https://harness-forge.6x7.gr";

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand("harness-forge.init", runInit)
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("harness-forge.openWeb", openWeb)
  );
}

async function runInit(): Promise<void> {
  const folder = vscode.workspace.workspaceFolders?.[0];
  if (!folder) {
    void vscode.window.showErrorMessage(
      "Harness Forge: open a workspace folder first."
    );
    return;
  }

  const cwd = folder.uri.fsPath;
  const terminal =
    vscode.window.terminals.find((t) => t.name === "Harness Forge") ??
    vscode.window.createTerminal({ name: "Harness Forge", cwd });
  terminal.show(true);
  terminal.sendText("npx -y harness-forge@latest init");
}

async function openWeb(): Promise<void> {
  await vscode.env.openExternal(vscode.Uri.parse(WEB_URL));
}

export function deactivate(): void {
  // no-op
}
