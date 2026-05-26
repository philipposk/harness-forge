## Cursor Rules

### Development Rules
Define the delivery stack and guardrails for implementation.

- **Languages to use?**
  - Example 1: Example: “TypeScript everywhere (Next.js app + API).”
  - Example 2: Example: “JavaScript only—keep it simple, no type checking overhead for a small project.”
  - Example 3: Example: “TypeScript for frontend, Python for backend API, SQL for database queries.”
  - Recommendation 1: Recommendation: Align on one primary language to reduce tooling overhead.
  - Recommendation 2: Recommendation: TypeScript catches bugs early but adds setup complexity—use it if you're building something that will grow.
  - Answer: JavaScript

- **Frontend framework preference?**
  - Example 1: Example: “Next.js App Router with React Server Components.”
  - Example 2: Example: “Plain HTML/CSS/JavaScript—no framework needed for a simple static site.”
  - Example 3: Example: “Vue 3 with Composition API, Vite for build tooling, Pinia for state management.”
  - Recommendation 1: Recommendation: Choose the framework you're most productive in for fast iteration.
  - Recommendation 2: Recommendation: If you're learning, pick one framework and stick with it—switching mid-project slows you down.
  - Answer: React

- **Styling approach?**
  - Example 1: Example: “Tailwind CSS 4 + custom theme tokens; utility-first with a sprinkle of CSS vars.”
  - Example 2: Example: “Plain CSS with BEM naming convention for maintainability.”
  - Example 3: Example: “CSS Modules for component-scoped styles, SASS for variables and mixins.”
  - Recommendation 1: Recommendation: Document styling rules so collaborators stay consistent.
  - Recommendation 2: Recommendation: Utility-first CSS (Tailwind) speeds up development but can make HTML verbose—choose based on team preference.
  - Answer: CSS

- **State management plan?**
  - Example 1: Example: “Zustand for session state, React hooks for local UI.”
  - Example 2: Example: “React useState and useContext only—no external state library needed.”
  - Example 3: Example: “Redux Toolkit for complex app state, React Query for server state, local state for UI toggles.”
  - Recommendation 1: Recommendation: Keep state libraries light unless multiple actors require syncing.
  - Recommendation 2: Recommendation: Start with built-in state management (useState, props) and only add libraries when you feel the pain.
  - Answer: Simple state management

- **Backend or data layer?**
  - Example 1: Example: “Next.js Route Handlers; optional Supabase later if persistence needed.”
  - Example 2: Example: “No backend—static site generation, all data is pre-rendered or client-side only.”
  - Example 3: Example: “Express.js API server, PostgreSQL database, Redis for caching, Docker for deployment.”
  - Recommendation 1: Recommendation: Choose the minimal backend that supports today's features.
  - Recommendation 2: Recommendation: Serverless functions (Vercel, Netlify) are great for MVP—you can always migrate to a full server later.
  - Answer: Static image hosting

- **APIs to connect and which to mock?**
  - Example 1: Example: “Connect to Groq (real) and scaffold Cursor export (stub).”
  - Example 2: Example: “No external APIs—all functionality is self-contained.”
  - Example 3: Example: “Stripe for payments (real), SendGrid for emails (real), analytics (mocked in dev, real in prod).”
  - Recommendation 1: Recommendation: List env variables so deployment is straightforward.
  - Recommendation 2: Recommendation: Mock expensive APIs during development to avoid surprise bills—only use real APIs when testing the full flow.
  - Answer: None

- **Testing expectations?**
  - Example 1: Example: “Playwright path for chat/voice/upload; lint + type checks in CI.”
  - Example 2: Example: “Manual testing only—automated tests will come in v2 after we validate the concept.”
  - Example 3: Example: “Jest for unit tests, React Testing Library for components, Playwright for E2E, 80% coverage target.”
  - Recommendation 1: Recommendation: Specify the critical journeys to regress so tests stay focused.
  - Recommendation 2: Recommendation: Test the happy path first, then edge cases—don't try to test everything from day one.
  - Answer: Basic testing

- **Security guidelines?**
  - Example 1: Example: “Never expose API keys client-side; rate-limit Groq endpoints; sanitize file uploads.”
  - Example 2: Example: “No security concerns—the app is read-only and doesn't handle sensitive data.”
  - Example 3: Example: “HTTPS only, input validation on all forms, CSRF protection, rate limiting, authentication required for admin actions.”
  - Recommendation 1: Recommendation: Write expectations even if simple—future you will thank you.
  - Recommendation 2: Recommendation: If you're handling any user input or data, assume it's malicious—validate and sanitize everything.
  - Answer: Standard security practices

- **Performance considerations?**
  - Example 1: Example: “Lazy-load heavy panels, compress audio uploads, test mobile/desktop flows.”
  - Example 2: Example: “Performance not critical—the app is simple and loads instantly on modern devices.”
  - Example 3: Example: “Target <2s initial load, lazy-load images, code splitting, CDN for assets, Lighthouse score >90.”
  - Recommendation 1: Recommendation: Mention the most likely bottlenecks so optimizations stay targeted.
  - Recommendation 2: Recommendation: Measure first, optimize second—use browser DevTools to find actual performance issues before guessing.
  - Answer: Optimize images

- **File organization conventions?**
  - Example 1: Example: “`src/components`, `src/lib`, `src/state`, `src/app/(routes)`; hyphenated filenames.”
  - Example 2: Example: “Flat structure: all files in root, organized by feature prefixes (auth-, user-, admin-).”
  - Example 3: Example: “Feature-based folders: `features/auth/`, `features/dashboard/`, shared code in `shared/`.”
  - Recommendation 1: Recommendation: Define structure early to keep contributions orderly.
  - Recommendation 2: Recommendation: Start simple (flat or by type) and refactor to feature-based when you have 10+ components.
  - Answer: Standard React structure

- **Commit conventions?**
  - Example 1: Example: “Conventional commits (feat/chore/fix/docs/test).”
  - Example 2: Example: “No strict convention—just write clear commit messages that explain what changed and why.”
  - Example 3: Example: “Conventional commits with scope: `feat(auth): add login form`, `fix(api): handle rate limit errors`.”
  - Recommendation 1: Recommendation: Pick a convention that tooling can lint or auto-generate changelogs from.
  - Recommendation 2: Recommendation: Consistent commit messages make it easier to understand project history—even simple prefixes (feat/fix) help.
  - Answer: Conventional commits