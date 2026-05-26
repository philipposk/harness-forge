# Awesome AI-Dev Configs [![Awesome](https://awesome.re/badge.svg)](https://github.com/sindresorhus/awesome)

Curated configs, skills, and MCP servers for every popular AI coding tool. Auto-generated from [philipposk/AppBlueprints](https://github.com/philipposk/AppBlueprints) — `data/` is the source of truth.

## Contents

- [Harnesses](#harnesses)
- [Stacks](#stacks)
- [Skills](#skills)
- [MCP servers](#mcp-servers)

## Harnesses

- [**Aider**](https://aider.chat/docs/config.html) — Aider.
- [**Claude Code**](https://docs.claude.com/en/docs/claude-code/overview) — Anthropic. _(skills, mcp, memory, AGENTS.md)_
- [**Cline**](https://docs.cline.bot/features/cline-rules) — Cline Bot Inc.. _(mcp)_
- [**Codex CLI**](https://developers.openai.com/codex/guides/agents-md) — OpenAI. _(mcp, memory, AGENTS.md)_
- [**Continue**](https://docs.continue.dev/reference) — Continue Dev Inc.. _(mcp)_
- [**Cursor**](https://docs.cursor.com/context/rules) — Anysphere. _(mcp, AGENTS.md)_
- [**Gemini CLI**](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/configuration.md) — Google. _(mcp, memory, AGENTS.md)_
- [**OpenHands**](https://docs.all-hands.dev) — All Hands AI. _(mcp)_
- [**Windsurf**](https://docs.windsurf.com/windsurf/cascade/memories) — Codeium. _(mcp, memory, AGENTS.md)_
- [**Zed**](https://zed.dev/docs/ai/rules) — Zed Industries. _(mcp, AGENTS.md)_
## Stacks

- **FastAPI + Postgres** (`fastapi-postgres`) — Python FastAPI backend with SQLAlchemy and Postgres. Suits API-first services and AI/ML backends.
- **Mobile (Expo + React Native)** (`mobile-expo`) — Cross-platform mobile app with Expo and React Native. Suits prototypes and small teams shipping to iOS+Android from one codebase.
- **Next.js + Prisma + Postgres** (`nextjs-prisma`) — Next.js App Router with Prisma ORM and Postgres. Suits production web apps that need auth, DB, and SSR.
- **React + Node** (`react-node`) — Full-stack JavaScript with React frontend and Node.js backend (Express/Fastify). Default for SaaS prototypes and internal tools.
- **Rust CLI** (`rust-cli`) — Rust command-line tool with clap and serde. Suits distributable binaries and systems tools.
## Skills

### Recommended

- [Vitest Test Runner](https://vitest.dev) — Helpers and patterns for writing fast Vitest tests in TypeScript projects. _(stacks: react-node, nextjs-prisma, mobile-expo)_
- [Pytest Patterns](https://docs.pytest.org) — Pytest fixtures, parametrize, factory-boy patterns for Python services. _(stacks: fastapi-postgres)_
- [Cargo Test Patterns](https://doc.rust-lang.org/book/ch11-00-testing.html) — Patterns for unit tests, integration tests, and doc tests in Rust. _(stacks: rust-cli)_
- [ESLint + Prettier Setup](https://typescript-eslint.io) — Opinionated lint and format config for TypeScript projects. _(stacks: react-node, nextjs-prisma, mobile-expo)_
- [Ruff Lint + Format](https://docs.astral.sh/ruff/) — Fast Python linter and formatter (replaces flake8 + black + isort). _(stacks: fastapi-postgres)_
- [Clippy Lints](https://github.com/rust-lang/rust-clippy) — Idiomatic Rust enforcement via Clippy. Treats warnings as errors. _(stacks: rust-cli)_
- [Conventional Commits](https://www.conventionalcommits.org) — Commit message format (feat:, fix:, chore:, …) for automated changelogs. _(stacks: react-node, nextjs-prisma, fastapi-postgres, rust-cli, mobile-expo)_
- [Tailwind CSS Patterns](https://tailwindcss.com) — Utility-first CSS conventions and component composition with Tailwind. _(stacks: react-node, nextjs-prisma, mobile-expo)_
- [NextAuth.js (Auth.js)](https://authjs.dev) — Authentication patterns with Auth.js v5 in Next.js App Router. _(stacks: nextjs-prisma)_
- [Prisma ORM](https://www.prisma.io/docs) — Schema design, migrations, and query patterns with Prisma. _(stacks: nextjs-prisma, react-node)_
- [Alembic Migrations](https://alembic.sqlalchemy.org) — SQLAlchemy migration patterns via Alembic. _(stacks: fastapi-postgres)_
- [Expo Router Patterns](https://docs.expo.dev/router/introduction/) — File-based routing patterns for Expo Router v3+. _(stacks: mobile-expo)_
- [PR Review Checklist](https://github.com/anthropics/skills) — Universal pre-merge checklist — types, tests, error paths, secrets.
- [Secret Scanning Pre-commit](https://github.com/Yelp/detect-secrets) — Scan staged changes for API keys, tokens, .env leaks before commit.

### Firehose

- [TSDoc Comments](https://tsdoc.org) — TSDoc conventions for type-aware JSDoc-like comments. _(stacks: react-node, nextjs-prisma)_
- [MkDocs Material](https://squidfunk.github.io/mkdocs-material/) — Documentation site generator for Python projects. _(stacks: fastapi-postgres)_
- [Rustdoc Conventions](https://doc.rust-lang.org/rustdoc/) — Patterns for writing comprehensive rustdoc comments and examples. _(stacks: rust-cli)_
- [OpenAPI Schema Discipline](https://swagger.io/specification/) — Patterns for keeping OpenAPI spec aligned with FastAPI/Pydantic models. _(stacks: fastapi-postgres)_
- [cargo-dist Releases](https://github.com/axodotdev/cargo-dist) — Multi-platform binary releases for Rust CLIs. _(stacks: rust-cli)_
- [Dead Code Finder](https://github.com/webpro-nl/knip) — Locate unreferenced exports, files, and dependencies. _(stacks: react-node, nextjs-prisma)_
- [Spec-Driven Development](https://github.com/github/spec-kit) — Patterns from github/spec-kit — spec → plan → tasks → code.
- [Systematic Debugging](https://github.com/anthropics/skills) — Reproduce → isolate → diagnose → fix workflow.
- [Onboarding Doc Generator](https://github.com/anthropics/skills) — Produce a teammate-readable ONBOARDING.md from repo scan.
- [ADR (Architecture Decision Record)](https://adr.github.io) — Generate ADRs for design decisions (Kafka vs SQS, REST vs GraphQL, …).
- [Pre-Deploy Checklist](https://github.com/anthropics/skills) — CI green, migrations safe, feature flags ready, rollback plan documented.
- [Incident Response Playbook](https://github.com/anthropics/skills) — Triage → comms → mitigation → postmortem flow.
- [Playwright End-to-End](https://playwright.dev) — Browser end-to-end tests with Playwright. Trace viewer + parallel runs. _(stacks: react-node, nextjs-prisma)_
- [Lighthouse Performance Budgets](https://github.com/GoogleChrome/lighthouse-ci) — Set and enforce Core Web Vitals budgets in CI. _(stacks: nextjs-prisma, react-node)_
- [Accessibility (axe)](https://github.com/dequelabs/axe-core) — Automated a11y checks with axe-core in tests and CI. _(stacks: nextjs-prisma, react-node, mobile-expo)_
- [i18n with ICU MessageFormat](https://formatjs.io) — Internationalization patterns with ICU message format and react-intl. _(stacks: nextjs-prisma, react-node, mobile-expo)_

## MCP servers

### analytics

- [PostHog](https://github.com/posthog/posthog-mcp) — Query PostHog analytics, feature flags, and session replays.

### api

- [OpenAPI](https://github.com/janwilmake/openapi-mcp-server) — Auto-generate MCP tools from any OpenAPI 3.x spec.

### backend

- [Supabase](https://github.com/supabase-community/supabase-mcp) — Manage Supabase databases, auth, storage, and edge functions.

### browser

- [Playwright Browser](https://github.com/microsoft/playwright-mcp) — Cross-browser automation via Microsoft Playwright.
- [Puppeteer Browser](https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer) — Headless Chrome automation — navigate, click, screenshot, scrape. ⭐

### calendar

- [Google Calendar](https://github.com/nspady/google-calendar-mcp) — Read and create events in Google Calendar.

### cloud

- [AWS](https://github.com/awslabs/mcp) — AWS API access — S3, Lambda, EC2, IAM, and more.
- [Azure](https://github.com/Azure/azure-mcp) — Azure resource management via MCP.
- [Google Cloud](https://github.com/GoogleCloudPlatform/mcp-toolbox) — Google Cloud Platform API access via MCP.

### communication

- [Discord](https://github.com/v-3/discordmcp) — Read channels and send messages via Discord bot.
- [Slack](https://github.com/modelcontextprotocol/servers/tree/main/src/slack) — Post messages, search channels, manage threads.

### database

- [Airtable](https://github.com/domdomegg/airtable-mcp-server) — Read and write Airtable bases and records.
- [BigQuery](https://github.com/LucasHild/mcp-server-bigquery) — Query Google BigQuery datasets.
- [ClickHouse](https://github.com/ClickHouse/mcp-clickhouse) — Query ClickHouse analytical databases.
- [MongoDB](https://github.com/mongodb-js/mongodb-mcp-server) — Query and inspect MongoDB collections.
- [Postgres](https://github.com/modelcontextprotocol/servers/tree/main/src/postgres) — Read-only SQL queries against a Postgres database. ⭐
- [Redis](https://github.com/redis/mcp-redis) — Read/write Redis keys, lists, and pubsub.
- [SQLite](https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite) — Query and inspect SQLite databases.

### deploy

- [Vercel](https://vercel.com/docs/mcp) — Deploy status, project config, and env var management. ⭐

### design

- [Figma](https://github.com/GLips/Figma-Context-MCP) — Read Figma files, frames, and components.

### docker

- [Docker](https://github.com/QuantGeekDev/docker-mcp) — Manage Docker containers, images, and compose stacks.

### docs

- [Notion](https://github.com/makenotion/notion-mcp-server) — Read pages, databases, and create entries in Notion.

### email

- [Gmail](https://github.com/GongRzhe/Gmail-MCP-Server) — Read, search, and send Gmail messages.

### files

- [Filesystem](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) — Read, write, and search files within a configured root directory. ⭐
- [Google Drive](https://github.com/modelcontextprotocol/servers/tree/main/src/gdrive) — Read, search, and write files in Google Drive.

### git

- [Git](https://github.com/modelcontextprotocol/servers/tree/main/src/git) — Read git history, diffs, and branches via MCP. ⭐
- [GitHub](https://github.com/github/github-mcp-server) — Repo, issue, PR, and Actions access via the GitHub API. ⭐
- [GitLab](https://github.com/modelcontextprotocol/servers/tree/main/src/gitlab) — Issues, MRs, and pipelines via the GitLab API.

### hosting

- [Cloudflare](https://github.com/cloudflare/mcp-server-cloudflare) — Workers, KV, R2, D1, and DNS access via Cloudflare MCP.

### issues

- [Jira + Confluence](https://www.atlassian.com/blog/announcements/remote-mcp-server) — Atlassian official MCP for Jira issues and Confluence pages.
- [Linear](https://linear.app/docs/mcp) — Read and manage Linear issues, projects, and cycles.

### kubernetes

- [Kubernetes](https://github.com/Flux159/mcp-server-kubernetes) — Read pods, deployments, logs from a configured kube context.

### macos

- [AppleScript](https://github.com/peakmojo/applescript-mcp) — Run AppleScript on macOS to control Notes, Mail, Calendar, etc.

### memory

- [Memory (Knowledge Graph)](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) — Persistent knowledge-graph memory across sessions.

### monitoring

- [Datadog](https://github.com/winor30/mcp-server-datadog) — Query Datadog metrics, logs, and incidents.
- [Grafana](https://github.com/grafana/mcp-grafana) — Read Grafana dashboards, alerts, and Loki/Tempo queries.
- [Prometheus](https://github.com/pab1it0/prometheus-mcp-server) — Query Prometheus metrics.
- [Sentry](https://github.com/getsentry/sentry-mcp) — Query Sentry errors, issues, and releases. ⭐

### notes

- [Obsidian](https://github.com/MarkusPfundstein/mcp-obsidian) — Read and write notes in an Obsidian vault.

### oncall

- [PagerDuty](https://github.com/wpfleger96/pagerduty-mcp-server) — Query incidents, schedules, and on-call rotations.

### payments

- [Stripe](https://docs.stripe.com/agents) — Stripe Agent Toolkit MCP — payments, customers, subscriptions.

### pdf

- [PDF Reader](https://github.com/MeterLong/MCP-Doc) — Read and extract text and tables from PDFs.

### reasoning

- [Sequential Thinking](https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking) — Step-by-step reasoning helper that branches and revises thought chains.

### sandbox

- [E2B Code Interpreter](https://github.com/e2b-dev/mcp-server) — Run untrusted code in an E2B cloud sandbox.

### search

- [Brave Search](https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search) — Web search via Brave Search API.
- [Elasticsearch](https://github.com/elastic/mcp-server-elasticsearch) — Search and query Elasticsearch indices.

### shell

- [Shell](https://github.com/tumf/mcp-shell-server) — Run shell commands in a configured working directory.

### utility

- [Time](https://github.com/modelcontextprotocol/servers/tree/main/src/time) — Timezone conversion and current-time queries.

### video

- [YouTube](https://github.com/anaisbetts/mcp-youtube) — Search YouTube and fetch transcripts.

### web

- [Fetch](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch) — Fetch arbitrary URLs and convert HTML to Markdown for the LLM. ⭐


---

Generated by `scripts/build-awesome.mjs`.
