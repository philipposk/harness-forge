import * as vscode from "vscode";

const WEB_URL =
  process.env.APPBLUEPRINTS_WEB_URL ?? "https://appblueprints.6x7.gr";

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand("appblueprints.init", runInit)
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("appblueprints.openWeb", openWeb)
  );
}

async function runInit(): Promise<void> {
  const folder = vscode.workspace.workspaceFolders?.[0];
  if (!folder) {
    void vscode.window.showErrorMessage(
      "AppBlueprints: open a workspace folder first."
    );
    return;
  }

  const cwd = folder.uri.fsPath;
  const terminal =
    vscode.window.terminals.find((t) => t.name === "AppBlueprints") ??
    vscode.window.createTerminal({ name: "AppBlueprints", cwd });
  terminal.show(true);
  terminal.sendText("npx -y appblueprints@latest init");
}

async function openWeb(): Promise<void> {
  await vscode.env.openExternal(vscode.Uri.parse(WEB_URL));
}

export function deactivate(): void {
  // no-op
}
