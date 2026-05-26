import {
  cancel,
  confirm,
  intro,
  isCancel,
  multiselect,
  outro,
  select,
  text,
} from "@clack/prompts";
import kleur from "kleur";
import {
  detectStack,
  generate,
  liveTopUp,
  loadAll,
  recommend,
  type DiscoveryEntry,
  type HarnessId,
  type StackProfile,
} from "@appblueprints/core";
import { writeFiles } from "./writer.js";

export interface WizardOptions {
  cwd: string;
  dataDir: string;
  dryRun: boolean;
  yes: boolean;
  defaultStack?: string;
  defaultHarnesses?: HarnessId[];
  detect?: boolean;
  discover?: boolean;
}

function cancelGuard<T>(value: T | symbol): asserts value is T {
  if (isCancel(value)) {
    cancel("Aborted.");
    process.exit(0);
  }
}

export async function runWizard(opts: WizardOptions): Promise<void> {
  intro(kleur.cyan("AppBlueprints — multi-harness AI coding config generator"));

  const { harnesses, skills, mcps, stacks } = await loadAll({
    dataDir: opts.dataDir,
  });

  let detected: Awaited<ReturnType<typeof detectStack>> = null;
  if (opts.detect !== false) {
    detected = await detectStack(opts.cwd);
    if (detected) {
      console.log(
        kleur.dim(
          `Detected ${detected.stackId} (${detected.confidence}): ${detected.evidence.join(", ")}`
        )
      );
    }
  }

  const fallbackStackId =
    opts.defaultStack ?? detected?.stackId ?? "react-node";

  let projectName: string;
  let projectDescription: string;
  let stack: StackProfile;
  let selectedHarnesses: HarnessId[];
  let tier: "recommended" | "all";

  if (opts.yes) {
    projectName = "My App";
    projectDescription = "A new app scaffolded by AppBlueprints.";
    stack = stacks.find((s) => s.id === fallbackStackId)!;
    selectedHarnesses =
      opts.defaultHarnesses && opts.defaultHarnesses.length > 0
        ? opts.defaultHarnesses
        : ["claude-code"];
    tier = "recommended";
  } else {
    const nameAns = await text({
      message: "Project name?",
      placeholder: "My App",
      defaultValue: "My App",
    });
    cancelGuard(nameAns);
    projectName = nameAns as string;

    const descAns = await text({
      message: "One-sentence description?",
      placeholder: "A new app that ...",
      defaultValue: "A new app scaffolded by AppBlueprints.",
    });
    cancelGuard(descAns);
    projectDescription = descAns as string;

    const stackAns = await select({
      message: detected
        ? `Pick a stack profile (detected: ${detected.stackId})`
        : "Pick a stack profile",
      options: stacks.map((s) => ({
        value: s.id,
        label: s.name,
        hint: s.description.slice(0, 60),
      })),
      initialValue: fallbackStackId,
    });
    cancelGuard(stackAns);
    stack = stacks.find((s) => s.id === stackAns)!;

    const harnessAns = await multiselect({
      message: "Which AI coding tools do you use?",
      options: harnesses.map((h) => ({
        value: h.id,
        label: h.name,
        hint: h.vendor,
      })),
      initialValues: opts.defaultHarnesses ?? ["claude-code"],
      required: true,
    });
    cancelGuard(harnessAns);
    selectedHarnesses = harnessAns as HarnessId[];

    const tierAns = await select({
      message: "Skills + MCP picks",
      options: [
        {
          value: "recommended",
          label: "Recommended only",
          hint: "Curated picks for your stack",
        },
        {
          value: "all",
          label: "All matching",
          hint: "Everything that fits your stack",
        },
      ],
      initialValue: "recommended",
    });
    cancelGuard(tierAns);
    tier = tierAns as "recommended" | "all";
  }

  const reco = recommend({
    stack,
    harnesses: selectedHarnesses,
    tier,
    allSkills: skills,
    allMcps: mcps,
  });

  let discovered: DiscoveryEntry[] = [];
  if (opts.discover) {
    try {
      discovered = await liveTopUp({
        stacks: [stack.id],
        harnesses: selectedHarnesses,
        githubToken: process.env.GITHUB_TOKEN,
      });
    } catch {
      // best-effort; ignore
    }
  }

  const selectedHarnessSpecs = harnesses.filter((h) =>
    selectedHarnesses.includes(h.id)
  );

  const files = generate({
    projectName,
    projectDescription,
    stack,
    harnesses: selectedHarnessSpecs,
    skills: reco.skills,
    mcps: reco.mcps,
  });

  console.log("");
  console.log(kleur.bold("Files to write:"));
  for (const f of files) {
    console.log(`  ${kleur.green("•")} ${f.path}`);
  }
  console.log("");
  console.log(
    kleur.dim(
      `Picked ${reco.skills.length} skill(s), ${reco.mcps.length} MCP server(s).`
    )
  );

  if (discovered.length > 0) {
    console.log("");
    console.log(
      kleur.bold(`Recent on GitHub (${discovered.length}):`)
    );
    for (const d of discovered.slice(0, 5)) {
      console.log(
        `  ${kleur.cyan(d.kind === "mcp" ? "[mcp]" : "[skill]")} ${d.name} ${
          d.stars ? kleur.dim(`★${d.stars}`) : ""
        } — ${kleur.dim(d.sourceUrl)}`
      );
    }
  }

  if (opts.dryRun) {
    outro(kleur.yellow("Dry run — no files written."));
    return;
  }

  let proceed: boolean | symbol = true;
  if (!opts.yes) {
    proceed = await confirm({
      message: `Write ${files.length} file(s) to ${opts.cwd}?`,
      initialValue: true,
    });
    cancelGuard(proceed);
  }

  if (!proceed) {
    outro(kleur.yellow("Cancelled."));
    return;
  }

  const result = await writeFiles({ cwd: opts.cwd, files });
  outro(
    kleur.green(
      `Wrote ${result.written} file(s)${
        result.skipped > 0 ? `, skipped ${result.skipped} (already existed)` : ""
      }.`
    )
  );
}
