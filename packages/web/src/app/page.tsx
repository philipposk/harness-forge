"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

interface HarnessLite {
  id: string;
  name: string;
  vendor: string;
  docsUrl: string;
  supports: { mcp: boolean; skills: boolean; memory: boolean };
  agentsMdCompatible: boolean;
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

interface DiscoveryEntry {
  id: string;
  name: string;
  description: string;
  sourceUrl: string;
  kind: "skill" | "mcp";
  stars?: number;
}

const DEFAULT_HARNESSES = ["claude-code", "cursor"];

export default function Page() {
  const [data, setData] = useState<DataPayload | null>(null);
  const [projectName, setProjectName] = useState("My App");
  const [projectDescription, setProjectDescription] = useState(
    "A new app scaffolded by AppBlueprints."
  );
  const [stackId, setStackId] = useState("react-node");
  const [harnessIds, setHarnessIds] = useState<string[]>(DEFAULT_HARNESSES);
  const [tier, setTier] = useState<"recommended" | "all">("recommended");
  const [preview, setPreview] = useState<GenerateResponse | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [discovered, setDiscovered] = useState<DiscoveryEntry[] | null>(null);
  const [discovering, setDiscovering] = useState(false);

  useEffect(() => {
    fetch("./api/data")
      .then((r) => r.json() as Promise<DataPayload>)
      .then(setData)
      .catch(() => setError("Failed to load data. Is the dev server running?"));
  }, []);

  const canSubmit = useMemo(
    () =>
      Boolean(
        projectName.trim() &&
          projectDescription.trim() &&
          stackId &&
          harnessIds.length > 0
      ),
    [projectName, projectDescription, stackId, harnessIds]
  );

  function toggleHarness(id: string) {
    setHarnessIds((curr) =>
      curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id]
    );
  }

  async function handlePreview() {
    setPreviewing(true);
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
          asZip: false,
        }),
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const json = (await res.json()) as GenerateResponse;
      setPreview(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setPreviewing(false);
    }
  }

  async function handleDiscover() {
    setDiscovering(true);
    setError(null);
    try {
      const url = `./api/discover?stack=${encodeURIComponent(
        stackId
      )}&harnesses=${encodeURIComponent(harnessIds.join(","))}`;
      const res = await fetch(url);
      const json = (await res.json()) as { entries: DiscoveryEntry[] };
      setDiscovered(json.entries ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setDiscovering(false);
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
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const slug = projectName.toLowerCase().replace(/[^a-z0-9-]+/g, "-");
      a.download = `${slug}-appblueprints.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setDownloading(false);
    }
  }

  return (
    <main className={styles.shell}>
      <header>
        <h1 className={styles.title}>AppBlueprints</h1>
        <p className={styles.subtitle}>
          Multi-harness AI coding config generator. Describe your project, pick
          your tools, get the right files.
        </p>
      </header>

      <section className={styles.section}>
        <div className={styles.row}>
          <label className={styles.label} htmlFor="name">
            Project name
          </label>
          <input
            id="name"
            className={styles.input}
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>

        <div className={styles.row}>
          <label className={styles.label} htmlFor="desc">
            One-sentence description
          </label>
          <textarea
            id="desc"
            className={styles.textarea}
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
          />
          <span className={styles.hint}>
            Plain English. Used as the body of AGENTS.md and other config files.
          </span>
        </div>

        <div className={styles.row}>
          <label className={styles.label} htmlFor="stack">
            Stack profile
          </label>
          <select
            id="stack"
            className={styles.select}
            value={stackId}
            onChange={(e) => setStackId(e.target.value)}
          >
            {data?.stacks.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.description.slice(0, 60)}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.row}>
          <span className={styles.label}>AI coding tools you use</span>
          <span className={styles.hint}>
            Pick all that apply. AGENTS.md is generated as a universal fallback.
          </span>
        </div>
        <div className={styles.harnessGrid}>
          {data?.harnesses.map((h) => (
            <div
              key={h.id}
              className={`${styles.harnessCard} ${
                harnessIds.includes(h.id) ? styles.selected : ""
              }`}
              onClick={() => toggleHarness(h.id)}
              role="checkbox"
              aria-checked={harnessIds.includes(h.id)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  toggleHarness(h.id);
                }
              }}
            >
              <span className={styles.harnessName}>{h.name}</span>
              <span className={styles.harnessVendor}>{h.vendor}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.row}>
          <span className={styles.label}>Skills + MCP servers</span>
          <span className={styles.hint}>
            <strong>Recommended only</strong> is curated for your stack.{" "}
            <strong>All matching</strong> includes every entry that fits.
          </span>
        </div>
        <div className={styles.tierToggle}>
          <button
            type="button"
            className={`${styles.tierBtn} ${
              tier === "recommended" ? styles.active : ""
            }`}
            onClick={() => setTier("recommended")}
          >
            Recommended only
          </button>
          <button
            type="button"
            className={`${styles.tierBtn} ${tier === "all" ? styles.active : ""}`}
            onClick={() => setTier("all")}
          >
            All matching
          </button>
        </div>
      </section>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={handleDownload}
          disabled={!canSubmit || downloading}
        >
          {downloading ? "Building zip..." : "Download zip"}
        </button>
        <button
          type="button"
          className={styles.secondaryBtn}
          onClick={handlePreview}
          disabled={!canSubmit || previewing}
        >
          {previewing ? "Generating..." : "Preview files"}
        </button>
        <button
          type="button"
          className={styles.secondaryBtn}
          onClick={handleDiscover}
          disabled={discovering}
        >
          {discovering ? "Searching..." : "Discover new on GitHub"}
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {preview && (
        <section className={styles.section}>
          <h2 className={styles.label}>
            {preview.files.length} files · {preview.counts.skills} skills ·{" "}
            {preview.counts.mcps} MCP servers
          </h2>
          <ul className={styles.fileList}>
            {preview.files.map((f) => (
              <li key={f.path} className={styles.included}>
                {f.path}
              </li>
            ))}
          </ul>
        </section>
      )}

      {discovered && (
        <section className={styles.section}>
          <h2 className={styles.label}>
            Recently active on GitHub ({discovered.length})
          </h2>
          {discovered.length === 0 ? (
            <p className={styles.hint}>
              No recent results. GitHub may be rate-limiting; try again later or
              set $GITHUB_TOKEN on the server.
            </p>
          ) : (
            <ul className={styles.fileList}>
              {discovered.slice(0, 10).map((d) => (
                <li key={d.id} className={styles.included}>
                  <strong>[{d.kind}]</strong>{" "}
                  <a href={d.sourceUrl} target="_blank" rel="noreferrer">
                    {d.name}
                  </a>
                  {d.stars !== undefined ? ` · ★${d.stars}` : ""} —{" "}
                  {d.description}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <footer className={styles.footer}>
        {data ? (
          <>
            {data.counts.harnesses} harnesses · {data.counts.stacks} stacks ·{" "}
            {data.counts.skills} skills · {data.counts.mcps} MCP servers loaded.
          </>
        ) : (
          "Loading data..."
        )}
        <br />
        <a href="https://github.com/philipposk/AppBlueprints">
          philipposk/AppBlueprints
        </a>
      </footer>
    </main>
  );
}
