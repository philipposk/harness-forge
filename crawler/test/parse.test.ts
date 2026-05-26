import { describe, expect, it } from "vitest";
import {
  extractMarkdownLinks,
  isGitHubRepoUrl,
  repoSlugFromUrl,
} from "../src/parse.js";

describe("extractMarkdownLinks", () => {
  it("parses awesome-list bullet rows", () => {
    const md = [
      "- [Repo One](https://github.com/foo/bar) — A useful thing",
      "* [Repo Two](https://github.com/baz/qux): another",
      "+ [Repo Three](https://example.com/x) - external link",
      "not a bullet line",
      "  - [Indented](https://github.com/x/y) — nested",
    ].join("\n");

    const links = extractMarkdownLinks(md);
    expect(links).toHaveLength(4);
    expect(links[0]).toMatchObject({
      name: "Repo One",
      url: "https://github.com/foo/bar",
      description: "A useful thing",
    });
    expect(links[3]?.name).toBe("Indented");
  });
});

describe("isGitHubRepoUrl + repoSlugFromUrl", () => {
  it("accepts github.com repo URLs only", () => {
    expect(isGitHubRepoUrl("https://github.com/foo/bar")).toBe(true);
    expect(isGitHubRepoUrl("https://github.com/foo")).toBe(false);
    expect(isGitHubRepoUrl("https://example.com/foo/bar")).toBe(false);
    expect(isGitHubRepoUrl("not a url")).toBe(false);
  });

  it("slugifies repo URLs", () => {
    expect(repoSlugFromUrl("https://github.com/Foo/Bar")).toBe("foo-bar");
    expect(repoSlugFromUrl("https://github.com/org/proj-name")).toBe(
      "org-proj-name"
    );
  });
});
