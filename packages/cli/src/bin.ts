#!/usr/bin/env node
import parser from "yargs-parser";
import kleur from "kleur";
import { runWizard } from "./wizard.js";
import { resolveDataDir } from "./data-dir.js";
import type { HarnessId } from "@appblueprints/core";

const HELP = `${kleur.bold("appblueprints")} — multi-harness AI coding config generator

Usage:
  appblueprints init [options]
  appblueprints list-harnesses
  appblueprints list-stacks
  appblueprints --help

Options:
  --dry-run                 Show files that would be written but write nothing
  --yes, -y                 Non-interactive mode (uses defaults)
  --stack <id>              Pre-pick a stack profile (e.g. react-node, nextjs-prisma)
  --harness <id>            Pre-pick a harness (repeat for multiple). e.g. --harness claude-code --harness cursor
  --cwd <path>              Run in a directory other than the current one
  --no-detect               Skip auto-detecting the stack from the cwd
  --discover                Fetch recent skills/MCPs from GitHub (uses $GITHUB_TOKEN)
  --help, -h                Show this help
  --version, -v             Show the CLI version
`;

const PKG_VERSION = "0.0.1";

async function main(): Promise<void> {
  const argv = parser(process.argv.slice(2), {
    alias: { yes: ["y"], help: ["h"], version: ["v"] },
    boolean: ["yes", "help", "version", "dry-run", "detect", "discover"],
    string: ["stack", "harness", "cwd"],
    array: ["harness"],
    default: { detect: true },
  });

  if (argv.help) {
    console.log(HELP);
    return;
  }
  if (argv.version) {
    console.log(PKG_VERSION);
    return;
  }

  const command = (argv._[0] as string) ?? "init";
  const dataDir = resolveDataDir();
  const cwd = (argv.cwd as string | undefined) ?? process.cwd();

  if (command === "list-harnesses") {
    const { loadHarnesses } = await import("@appblueprints/core");
    const all = await loadHarnesses({ dataDir });
    for (const h of all) {
      console.log(`${kleur.cyan(h.id.padEnd(14))} ${h.name} ${kleur.dim(`— ${h.vendor}`)}`);
    }
    return;
  }

  if (command === "list-stacks") {
    const { loadStacks } = await import("@appblueprints/core");
    const all = await loadStacks({ dataDir });
    for (const s of all) {
      console.log(`${kleur.cyan(s.id.padEnd(20))} ${s.name}`);
      console.log(`  ${kleur.dim(s.description)}`);
    }
    return;
  }

  if (command !== "init") {
    console.error(kleur.red(`Unknown command: ${command}`));
    console.error(HELP);
    process.exit(2);
  }

  const harnessFlag = argv.harness;
  const defaultHarnesses: HarnessId[] | undefined = harnessFlag
    ? (Array.isArray(harnessFlag) ? harnessFlag : [harnessFlag]).map(
        (h) => h as HarnessId
      )
    : undefined;

  await runWizard({
    cwd,
    dataDir,
    dryRun: Boolean(argv["dry-run"]),
    yes: Boolean(argv.yes),
    defaultStack: argv.stack as string | undefined,
    defaultHarnesses,
    detect: argv.detect !== false,
    discover: Boolean(argv.discover),
  });
}

main().catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(kleur.red(`Error: ${msg}`));
  process.exit(1);
});
