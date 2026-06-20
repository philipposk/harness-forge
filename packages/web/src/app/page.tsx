"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./page.module.css";
import { CodeBlock } from "./CodeBlock";

interface HarnessLite {
  id: string;
  name: string;
  vendor: string;
  docsUrl: string;
  supports: {
    skills: boolean;
    mcp: boolean;
    memory: boolean;
    customCommands: boolean;
    ignoreFile: boolean;
  };
  agentsMdCompatible: boolean;
  configFiles: string[];
}

interface StackLite {
  id: string;
  name: string;
  description: string;
  tags: string[];
}

interface DataPayload {
  harnesses: HarnessLite[];
  stacks: StackLite[];
  counts: { harnesses: number; skills: number; mcps: number; stacks: number };
}

interface GeneratedFile {
  path: string;
  content: string;
  harnessId?: string;
}

interface GenerateResponse {
  files: GeneratedFile[];
  counts: { skills: number; mcps: number };
}

const DEFAULT_HARNESSES = ["claude-code", "cursor"];
const DEFAULT_NAME = "Atlas";
const DEFAULT_DESC =
  "Map-based field-research tool for ecologists. Offline-first; syncs to Postgres when reachable.";

function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "project"
  );
}

function labelForFile(
  path: string,
  harnesses: HarnessLite[],
  selectedHarnessIds: string[]
): string {
  // Match the file path to the harness that emitted it.
  for (const id of selectedHarnessIds) {
    const h = harnesses.find((x) => x.id === id);
    if (!h) continue;
    if (h.configFiles.some((p) => p.endsWith(path) || path === p || path.endsWith(p))) {
      return h.name.toLowerCase().replace(/\s+/g, "-");
    }
  }
  if (path === "AGENTS.md") return "base";
  if (path === "CLAUDE.md") return "claude-code";
  if (path === ".mcp.json") return "mcp";
  if (path === "TODO.md" || path === "SPEC.md") return "scaffold";
  if (path.startsWith(".claude/skills/")) return "claude-code · skill";
  if (path.startsWith(".cursor/rules/skill-")) return "cursor · skill";
  if (path.startsWith(".cursor/")) return "cursor";
  if (path.startsWith(".clinerules")) return "cline";
  if (path.startsWith(".windsurf")) return "windsurf";
  if (path.startsWith(".continue")) return "continue";
  if (path.startsWith(".openhands")) return "openhands";
  if (path.startsWith(".aider") || path === "CONVENTIONS.md") return "aider";
  if (path === "GEMINI.md") return "gemini-cli";
  if (path === ".rules") return "zed";
  return "file";
}

export default function Page() {
  const [data, setData] = useState<DataPayload | null>(null);
  const [projectName, setProjectName] = useState(DEFAULT_NAME);
  const [projectDescription, setProjectDescription] = useState(DEFAULT_DESC);
  const [stackId, setStackId] = useState("react-node");
  const [harnessIds, setHarnessIds] = useState<string[]>(DEFAULT_HARNESSES);
  const [tier, setTier] = useState<"recommended" | "all">("recommended");
  const [preview, setPreview] = useState<GenerateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<"idle" | "ok" | "err">("idle");
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [fileCopied, setFileCopied] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);
  const [scanText, setScanText] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanMsg, setScanMsg] = useState<{ kind: "ok" | "warn"; text: string } | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const reqIdRef = useRef(0);

  // Load harness + stack catalog
  useEffect(() => {
    fetch("./api/data")
      .then((r) => r.json() as Promise<DataPayload>)
      .then(setData)
      .catch(() => setError("Failed to load data."));
  }, []);

  const refreshPreview = useCallback(async () => {
    if (harnessIds.length === 0) {
      setPreview(null);
      return;
    }
    // Cancel any in-flight request and tag this one, so a slow earlier response
    // can never overwrite the state from a newer one (out-of-order race).
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const reqId = ++reqIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("./api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          projectName: projectName || "My App",
          projectDescription: projectDescription || "A new app.",
          stackId,
          harnessIds,
          tier,
          asZip: false,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `${res.status} ${res.statusText}`);
      }
      const json = (await res.json()) as GenerateResponse;
      if (reqId === reqIdRef.current) setPreview(json);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      if (reqId === reqIdRef.current) {
        setError(err instanceof Error ? err.message : String(err));
      }
    } finally {
      if (reqId === reqIdRef.current) setLoading(false);
    }
  }, [projectName, projectDescription, stackId, harnessIds, tier]);

  // Debounced preview refresh on any state change.
  useEffect(() => {
    if (!data) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(refreshPreview, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [data, refreshPreview]);

  function toggleHarness(id: string) {
    setHarnessIds((curr) =>
      curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id]
    );
  }

  // File currently open in the content viewer (looked up from the live preview).
  const selectedFile = useMemo(
    () => preview?.files.find((f) => f.path === selectedPath) ?? null,
    [preview, selectedPath]
  );

  // Close the viewer on Escape.
  useEffect(() => {
    if (!selectedPath) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPath(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedPath]);

  async function copySelectedFile() {
    if (!selectedFile) return;
    try {
      await navigator.clipboard.writeText(selectedFile.content);
      setFileCopied(true);
      setTimeout(() => setFileCopied(false), 1400);
    } catch {
      /* clipboard blocked — no-op */
    }
  }

  async function scanManifest() {
    if (!scanText.trim()) return;
    setScanning(true);
    setScanMsg(null);
    try {
      const res = await fetch("./api/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ manifest: scanText }),
      });
      const json = (await res.json()) as {
        result?: { stackId: string; confidence: string; evidence: string[] } | null;
        error?: string;
      };
      if (!res.ok || !json.result) {
        setScanMsg({ kind: "warn", text: json.error ?? "Couldn't detect a stack." });
        return;
      }
      const match = stacks.find((s) => s.id === json.result!.stackId);
      if (match) {
        setStackId(match.id);
        setScanMsg({
          kind: "ok",
          text: `Detected ${match.name} (${json.result.confidence}) — selected.`,
        });
        setScanOpen(false);
      } else {
        setScanMsg({
          kind: "warn",
          text: `Detected "${json.result.stackId}" but there's no matching profile yet.`,
        });
      }
    } catch (err) {
      setScanMsg({
        kind: "warn",
        text: err instanceof Error ? err.message : "Scan failed.",
      });
    } finally {
      setScanning(false);
    }
  }

  async function handleDownload() {
    setDownloading(true);
    setError(null);
    try {
      const res = await fetch("./api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName,
          projectDescription,
          stackId,
          harnessIds,
          tier,
          asZip: true,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `${res.status} ${res.statusText}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slugify(projectName)}-harness-forge.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      // Defer revoke a tick so the browser has started the download first.
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setDownloading(false);
    }
  }

  const cliCommand = useMemo(() => {
    const harnessFlags = harnessIds.length
      ? harnessIds.map((h) => `--harness ${h}`).join(" ")
      : `--harness claude-code`;
    return `npx harness-forge init --stack ${stackId} ${harnessFlags}`;
  }, [stackId, harnessIds]);

  async function copyCmd() {
    try {
      await navigator.clipboard.writeText(cliCommand);
      setCopied("ok");
    } catch {
      setCopied("err");
    }
    setTimeout(() => setCopied("idle"), 1400);
  }

  const stacks = data?.stacks ?? [];
  const harnesses = data?.harnesses ?? [];
  const selectedStack = stacks.find((s) => s.id === stackId);

  // Group files into universal / harness-overrides / scaffold sections
  const grouped = useMemo(() => {
    if (!preview) return [] as Array<{ section?: string; path?: string; label?: string }>;
    const out: Array<{ section?: string; path?: string; label?: string }> = [];
    const universalPaths = ["AGENTS.md"];
    const scaffoldPaths = ["TODO.md", "SPEC.md", "README.harness-forge.md"];
    const universal = preview.files.filter((f) => universalPaths.includes(f.path));
    const mcp = preview.files.filter((f) => f.path === ".mcp.json");
    const scaffold = preview.files.filter((f) => scaffoldPaths.includes(f.path));
    const overrides = preview.files.filter(
      (f) => ![...universalPaths, ...scaffoldPaths, ".mcp.json"].includes(f.path)
    );

    if (universal.length) {
      out.push({ section: "Universal" });
      universal.forEach((f) =>
        out.push({ path: f.path, label: labelForFile(f.path, harnesses, harnessIds) })
      );
    }
    if (overrides.length) {
      out.push({ section: "Harness overrides" });
      overrides.forEach((f) =>
        out.push({ path: f.path, label: labelForFile(f.path, harnesses, harnessIds) })
      );
    }
    if (mcp.length) {
      out.push({
        section: `MCP · ${preview.counts.mcps} server${preview.counts.mcps === 1 ? "" : "s"}`,
      });
      mcp.forEach((f) =>
        out.push({ path: f.path, label: labelForFile(f.path, harnesses, harnessIds) })
      );
    }
    if (scaffold.length) {
      out.push({ section: "Scaffold" });
      scaffold.forEach((f) =>
        out.push({ path: f.path, label: labelForFile(f.path, harnesses, harnessIds) })
      );
    }
    return out;
  }, [preview, harnesses, harnessIds]);

  return (
    <>
      <div className={styles.topbar}>
        <div className={styles.topbarInner}>
          <div className={styles.brand}>
            <span className={styles.brandMark}>H</span>
            <span className={styles.brandName}>Harness Forge</span>
            <span className={styles.brandVersion}>v0.1.0</span>
          </div>
          <nav className={styles.nav}>
            <a
              href="https://github.com/philipposk/harness-forge#readme"
              target="_blank"
              rel="noopener noreferrer"
            >
              Docs
            </a>
            <a href="#harnesses">Harnesses</a>
            <a
              href="https://github.com/philipposk/harness-forge/blob/main/AWESOME.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              Awesome list
            </a>
            {data && (
              <span className={styles.pill}>
                <span className={styles.dot} />
                {data.counts.skills + data.counts.mcps} entries indexed
              </span>
            )}
          </nav>
        </div>
      </div>

      <section className={styles.hero}>
        <div>
          <div className={styles.eyebrow}>create-react-app for AI coding setups</div>
          <h1 className={styles.hHero}>
            Generate the right config
            <br />
            for <em>whichever</em> AI tool
            <br />
            you actually use.
          </h1>
          <p className={styles.heroSub}>
            Describe your project, pick your harnesses, get AGENTS.md, CLAUDE.md,{" "}
            <code className={styles.inlineCode}>.cursor/rules</code>, skills, and MCP bundles —
            all wired to the conventions of your stack.
          </p>
        </div>
        <aside className={styles.heroSide}>
          <strong>Or skip the wizard.</strong>
          <br />
          Run it from your terminal in any repo:
          <div style={{ marginTop: 10 }}>
            <code>npx harness-forge init</code>
          </div>
          <div style={{ marginTop: 6, fontSize: 12 }}>
            Supports 10 harnesses · emits a universal <code>AGENTS.md</code> fallback for the
            rest.
          </div>
        </aside>
      </section>

      <section className={styles.counters}>
        <div>
          <div className={styles.counterN}>
            {data?.counts.harnesses ?? "—"} <small>/ 10</small>
          </div>
          <div className={styles.counterL}>harnesses</div>
        </div>
        <div>
          <div className={styles.counterN}>{data?.counts.stacks ?? "—"}</div>
          <div className={styles.counterL}>stack profiles</div>
        </div>
        <div>
          <div className={styles.counterN}>{data?.counts.skills ?? "—"}</div>
          <div className={styles.counterL}>skills</div>
        </div>
        <div>
          <div className={styles.counterN}>{data?.counts.mcps ?? "—"}</div>
          <div className={styles.counterL}>mcp servers</div>
        </div>
      </section>

      <main className={styles.main}>
        <div className={styles.colForm}>
          {/* 01 — project */}
          <section>
            <div className={styles.stepHead}>
              <div className={styles.stepNum}>01</div>
              <div>
                <h2 className={styles.stepTitle}>Tell us about your project</h2>
                <p className={styles.stepHelp}>
                  Used as the body of <code>AGENTS.md</code> and every harness-specific override.
                </p>
              </div>
            </div>
            <div className={styles.stepBody}>
              <div className={styles.field}>
                <label htmlFor="pname">Project name</label>
                <input
                  id="pname"
                  className={styles.input}
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="My App"
                  autoComplete="off"
                  maxLength={200}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="pdesc">One-sentence description</label>
                <textarea
                  id="pdesc"
                  className={styles.textarea}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="A new app scaffolded by Harness Forge."
                  maxLength={2000}
                />
              </div>
            </div>
          </section>

          {/* 02 — stack */}
          <section id="stacks">
            <div className={styles.stepHead}>
              <div className={styles.stepNum}>02</div>
              <div>
                <h2 className={styles.stepTitle}>Pick a stack profile</h2>
                <p className={styles.stepHelp}>
                  Sets your default skills, MCP servers, and conventions. Pick the closest match
                  — you&apos;ll be able to trim.
                </p>
              </div>
            </div>
            <div className={styles.stepBody}>
              <div className={styles.scanBar}>
                <button
                  type="button"
                  className={styles.scanToggle}
                  onClick={() => {
                    setScanOpen((v) => !v);
                    setScanMsg(null);
                  }}
                  aria-expanded={scanOpen}
                >
                  {scanOpen ? "Close scanner" : "Scan my project ↓"}
                </button>
                <span className={styles.scanHint}>
                  Paste a manifest to auto-pick a stack
                </span>
              </div>
              {scanOpen && (
                <div className={styles.scanPanel}>
                  <textarea
                    className={styles.scanArea}
                    value={scanText}
                    onChange={(e) => setScanText(e.target.value)}
                    placeholder="Paste your package.json, pyproject.toml, Cargo.toml, go.mod, or requirements.txt here…"
                    spellCheck={false}
                  />
                  <div className={styles.scanActions}>
                    <button
                      type="button"
                      className={styles.scanRun}
                      onClick={scanManifest}
                      disabled={scanning || !scanText.trim()}
                    >
                      {scanning ? "Detecting…" : "Detect stack"}
                    </button>
                    {scanMsg && (
                      <span
                        className={`${styles.scanMsg} ${
                          scanMsg.kind === "ok" ? styles.scanOk : styles.scanWarn
                        }`}
                      >
                        {scanMsg.text}
                      </span>
                    )}
                  </div>
                </div>
              )}
              {!scanOpen && scanMsg && (
                <div
                  className={`${styles.scanMsg} ${
                    scanMsg.kind === "ok" ? styles.scanOk : styles.scanWarn
                  } ${styles.scanMsgBlock}`}
                >
                  {scanMsg.text}
                </div>
              )}
              <div className={styles.stackGrid}>
                {stacks.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    role="radio"
                    aria-checked={stackId === s.id}
                    className={styles.stackCard}
                    onClick={() => setStackId(s.id)}
                  >
                    <div className={styles.stackRow}>
                      <div className={styles.stackName}>{s.name}</div>
                      <div className={styles.check}>
                        <svg viewBox="0 0 12 12" fill="none">
                          <path
                            d="M2 6.2 4.7 9 10 3"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className={styles.stackId}>{s.id}</div>
                    <div className={styles.stackDesc}>{s.description}</div>
                    <div className={styles.stackTags}>
                      {s.tags.map((t) => (
                        <span key={t} className={styles.tag}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* 03 — harnesses */}
          <section id="harnesses">
            <div className={styles.stepHead}>
              <div className={styles.stepNum}>03</div>
              <div>
                <h2 className={styles.stepTitle}>AI coding tools you use</h2>
                <p className={styles.stepHelp}>
                  Pick all that apply. <code>AGENTS.md</code> is emitted as a universal fallback
                  for the rest.
                </p>
              </div>
            </div>
            <div className={styles.stepBody}>
              <div className={styles.hGrid}>
                {harnesses.map((h) => {
                  const caps: string[] = [];
                  if (h.supports.skills) caps.push("skills");
                  if (h.supports.mcp) caps.push("mcp");
                  if (h.supports.memory) caps.push("memory");
                  if (h.agentsMdCompatible) caps.push("agents.md");
                  return (
                    <button
                      key={h.id}
                      type="button"
                      role="checkbox"
                      aria-checked={harnessIds.includes(h.id)}
                      className={styles.hChip}
                      onClick={() => toggleHarness(h.id)}
                    >
                      <span className={styles.pin} />
                      <div className={styles.hName}>{h.name}</div>
                      <div className={styles.hVendor}>{h.vendor}</div>
                      <div className={styles.hSupports}>
                        {(caps.length ? caps : ["agents.md"]).map((c) => (
                          <span key={c} className={styles.hCap}>
                            {c}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 04 — tier */}
          <section>
            <div className={styles.stepHead}>
              <div className={styles.stepNum}>04</div>
              <div>
                <h2 className={styles.stepTitle}>Skills &amp; MCP servers</h2>
                <p className={styles.stepHelp}>
                  Start with the curated picks. Swap to the full firehose if you&apos;d rather see
                  everything that fits.
                </p>
              </div>
            </div>
            <div className={styles.stepBody}>
              <div className={styles.seg} role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-pressed={tier === "recommended"}
                  onClick={() => setTier("recommended")}
                >
                  Recommended only
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-pressed={tier === "all"}
                  onClick={() => setTier("all")}
                >
                  All matching
                </button>
              </div>
              <p className={styles.tierNote}>
                {tier === "recommended" ? (
                  <>
                    <strong>Recommended only:</strong> the curated first picks for your stack —
                    usually 4–6 skills and 4–6 MCPs.
                  </>
                ) : (
                  <>
                    <strong>All matching:</strong> everything in the catalog that lists your stack
                    — the full firehose.
                  </>
                )}
              </p>
            </div>
          </section>
        </div>

        <aside className={styles.colSide}>
          <div className={styles.pane}>
            <div className={styles.paneHead}>
              <div className={styles.paneTitle}>Generated files</div>
              <div className={styles.paneDots}>
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className={styles.tree} aria-busy={loading}>
              {harnessIds.length === 0 && (
                <div className={`${styles.treeLine} ${styles.empty}`}>
                  Pick at least one harness to see generated files.
                </div>
              )}
              {harnessIds.length > 0 && !preview && loading && (
                <div className={`${styles.treeLine} ${styles.empty}`}>
                  Generating preview…
                </div>
              )}
              {harnessIds.length > 0 && !preview && !loading && error && (
                <div className={`${styles.treeLine} ${styles.empty}`}>
                  Couldn’t generate a preview. See the error below.
                </div>
              )}
              {grouped.map((row, idx) =>
                row.section ? (
                  <div
                    key={`s-${idx}`}
                    className={`${styles.treeLine} ${styles.dir}`}
                  >
                    <span className={styles.treePath}>{row.section}</span>
                  </div>
                ) : (
                  <button
                    key={`f-${idx}`}
                    type="button"
                    className={`${styles.treeFile} ${styles.treeLine}`}
                    onClick={() => row.path && setSelectedPath(row.path)}
                    title={`View ${row.path}`}
                  >
                    <span className={styles.treePath}>{row.path}</span>
                    <span className={styles.treeLabel}>{row.label}</span>
                  </button>
                )
              )}
            </div>
          </div>

          <div className={`${styles.pane} ${styles.summaryPane}`}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryKey}>Stack</span>
              <span className={styles.summaryVal}>
                {selectedStack?.name ?? stackId}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryKey}>Harnesses</span>
              <span className={`${styles.summaryVal} ${styles.num}`}>
                {harnessIds.length}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryKey}>Skills</span>
              <span className={`${styles.summaryVal} ${styles.num}`}>
                {preview?.counts.skills ?? 0}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryKey}>MCP servers</span>
              <span className={`${styles.summaryVal} ${styles.num}`}>
                {preview?.counts.mcps ?? 0}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryKey}>Total files</span>
              <span className={`${styles.summaryVal} ${styles.num}`}>
                {preview?.files.length ?? 0}
              </span>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.btn}
              onClick={handleDownload}
              disabled={
                harnessIds.length === 0 ||
                downloading ||
                !projectName.trim() ||
                !projectDescription.trim()
              }
            >
              {downloading ? (
                <>Building zip…</>
              ) : (
                <>
                  Download <code>{slugify(projectName)}-harness-forge.zip</code>
                  <span className={styles.kbd}>⌘ ↵</span>
                </>
              )}
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.secondary}`}
              onClick={() => refreshPreview()}
              disabled={harnessIds.length === 0}
            >
              Refresh preview
              <span className={styles.kbd}>R</span>
            </button>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.cmd}>
            <span className={styles.prompt}>$</span>
            <span className={styles.cmdTxt}>{cliCommand}</span>
            <button
              type="button"
              className={styles.copy}
              onClick={copyCmd}
              aria-label="Copy CLI command"
            >
              {copied === "ok" ? "copied" : copied === "err" ? "failed" : "copy"}
            </button>
          </div>
        </aside>
      </main>

      <footer className={styles.footer}>
        <div>
          MIT · maintained by{" "}
          <a
            href="https://github.com/philipposk"
            target="_blank"
            rel="noopener noreferrer"
          >
            philipposk
          </a>{" "}
          · data refreshed nightly from upstream awesome-lists.
        </div>
        <div className={styles.footerLinks}>
          <a
            href="https://github.com/philipposk/harness-forge"
            target="_blank"
            rel="noopener noreferrer"
          >
            github
          </a>
          <a
            href="https://www.npmjs.com/package/harness-forge"
            target="_blank"
            rel="noopener noreferrer"
          >
            npm
          </a>
          <a
            href="https://pypi.org/project/harness-forge/"
            target="_blank"
            rel="noopener noreferrer"
          >
            PyPI
          </a>
          <a
            href="https://marketplace.visualstudio.com/items?itemName=philipposk.harness-forge-vscode"
            target="_blank"
            rel="noopener noreferrer"
          >
            VS Code
          </a>
        </div>
      </footer>

      {selectedFile && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-label={`Contents of ${selectedFile.path}`}
          onClick={() => setSelectedPath(null)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHead}>
              <span className={styles.modalTitle}>{selectedFile.path}</span>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.modalBtn}
                  onClick={copySelectedFile}
                >
                  {fileCopied ? "copied" : "copy"}
                </button>
                <button
                  type="button"
                  className={styles.modalBtn}
                  onClick={() => setSelectedPath(null)}
                  aria-label="Close file viewer"
                >
                  close
                </button>
              </div>
            </div>
            <CodeBlock path={selectedFile.path} content={selectedFile.content} />
          </div>
        </div>
      )}
    </>
  );
}
