import { Fragment, type ReactNode } from "react";
import styles from "./page.module.css";

type Lang = "json" | "md" | "yaml" | "toml" | "text";

function langFor(path: string): Lang {
  const p = path.toLowerCase();
  if (p.endsWith(".json")) return "json";
  if (p.endsWith(".md") || p.endsWith(".mdc")) return "md";
  if (p.endsWith(".yml") || p.endsWith(".yaml")) return "yaml";
  if (p.endsWith(".toml")) return "toml";
  return "text";
}

let keyCounter = 0;
function k(): string {
  keyCounter += 1;
  return `t${keyCounter}`;
}

function span(cls: string, text: string): ReactNode {
  return (
    <span key={k()} className={cls}>
      {text}
    </span>
  );
}

// ---- JSON: a small tokenizer over the whole string ----
function highlightJson(src: string): ReactNode[] {
  const out: ReactNode[] = [];
  // Strings (incl. the following optional colon to mark keys), numbers,
  // literals, and punctuation. Everything else passes through verbatim.
  const re = /("(?:\\.|[^"\\])*")(\s*:)?|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|(\btrue\b|\bfalse\b|\bnull\b)|([{}[\],:])/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    if (m.index > last) out.push(src.slice(last, m.index));
    if (m[1]) {
      out.push(span(m[2] ? styles.tkKey : styles.tkStr, m[1]));
      if (m[2]) out.push(span(styles.tkPunct, m[2]));
    } else if (m[3]) {
      out.push(span(styles.tkNum, m[3]));
    } else if (m[4]) {
      out.push(span(styles.tkBool, m[4]));
    } else if (m[5]) {
      out.push(span(styles.tkPunct, m[5]));
    }
    last = re.lastIndex;
  }
  if (last < src.length) out.push(src.slice(last));
  return out;
}

// ---- Inline markdown: `code` and **bold** ----
function inlineMd(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(span(styles.tkCode, m[1]));
    else if (m[2]) out.push(span(styles.tkBold, m[2]));
    else if (m[3]) out.push(span(styles.tkLink, m[3]));
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function highlightMdLine(line: string, inFence: boolean): ReactNode {
  if (inFence) return span(styles.tkCode, line);
  if (/^\s*```/.test(line)) return span(styles.tkPunct, line);
  if (/^#{1,6}\s/.test(line)) return span(styles.tkHead, line);
  if (/^\s*([-*+]|\d+\.)\s/.test(line)) {
    const m = line.match(/^(\s*(?:[-*+]|\d+\.)\s)(.*)$/);
    if (m) {
      return (
        <Fragment key={k()}>
          {span(styles.tkBullet, m[1])}
          {inlineMd(m[2])}
        </Fragment>
      );
    }
  }
  if (/^\s*>/.test(line)) return span(styles.tkQuote, line);
  if (/^\s*(-{3,}|={3,})\s*$/.test(line)) return span(styles.tkHr, line);
  return <Fragment key={k()}>{inlineMd(line)}</Fragment>;
}

function highlightKeyValLine(line: string, lang: Lang): ReactNode {
  const trimmed = line.trimStart();
  if (trimmed.startsWith("#")) return span(styles.tkComment, line);
  // TOML section header [section]
  if (lang === "toml" && /^\s*\[.+\]\s*$/.test(line)) {
    return span(styles.tkHead, line);
  }
  const m = line.match(/^(\s*[-]?\s*)([A-Za-z0-9_.-]+)(\s*[:=]\s*)(.*)$/);
  if (m) {
    return (
      <Fragment key={k()}>
        {m[1]}
        {span(styles.tkKey, m[2])}
        {span(styles.tkPunct, m[3])}
        {m[4] ? span(styles.tkStr, m[4]) : null}
      </Fragment>
    );
  }
  return line;
}

export function CodeBlock({ path, content }: { path: string; content: string }) {
  const lang = langFor(path);

  if (lang === "json") {
    return <pre className={styles.modalBody}>{highlightJson(content)}</pre>;
  }

  const lines = content.split("\n");
  let inFence = false;
  const rendered: ReactNode[] = [];
  lines.forEach((line, i) => {
    let node: ReactNode;
    if (lang === "md") {
      const isFence = /^\s*```/.test(line);
      node = highlightMdLine(line, inFence && !isFence);
      if (isFence) inFence = !inFence;
    } else if (lang === "yaml" || lang === "toml") {
      node = highlightKeyValLine(line, lang);
    } else {
      node = line;
    }
    rendered.push(
      <Fragment key={`l${i}`}>
        {node}
        {i < lines.length - 1 ? "\n" : null}
      </Fragment>
    );
  });

  return <pre className={styles.modalBody}>{rendered}</pre>;
}
