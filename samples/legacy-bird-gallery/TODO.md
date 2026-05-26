## TODO

### Development Checklist
Track AppMaker delivery steps from scaffold to polish.

- **Project initialization (framework, typings, style)**
  - Example 1: Example: “Next.js + TypeScript + Tailwind + Zustand scaffold in /appmaker.”
  - Example 2: Example: “Create-react-app with JavaScript, plain CSS, no state management library.”
  - Example 3: Example: “Vite + React + TypeScript, styled-components, Redux Toolkit for state.”
  - Recommendation 1: Recommendation: Confirm tooling works locally before moving on.
  - Recommendation 2: Recommendation: Use a template or generator (create-next-app, Vite templates) to skip boilerplate setup.
  - Answer: Initialize React project with Create React App

- **Set up environment variables and API/DB connection**
  - Example 1: Example: “.env template with GROQ_API_KEY, CURSOR_API_TOKEN, CURSOR_WORKSPACE_ID.”
  - Example 2: Example: “No env vars needed—the app is completely static with no external services.”
  - Example 3: Example: “.env.local with DATABASE_URL, STRIPE_SECRET_KEY, SENDGRID_API_KEY, JWT_SECRET.”
  - Recommendation 1: Recommendation: Document env requirements in README so onboarding stays fast.
  - Recommendation 2: Recommendation: Use .env.example as a template and never commit .env.local to git—add it to .gitignore.
  - Answer: Set up image hosting

- **Design database schema (list main models)**
  - Example 1: Example: “Session, Message, TemplateSnapshot (note: client-only for v1).”
  - Example 2: Example: “No database—the app is stateless and doesn't persist any data.”
  - Example 3: Example: “User, Post, Comment, Like tables with relationships; use Prisma ORM for type-safe queries.”
  - Recommendation 1: Recommendation: Even if using client state, sketch schema for future persistence.
  - Recommendation 2: Recommendation: Start with the simplest schema that works—you can always normalize and add indexes later.
  - Answer: Design simple database schema for image metadata

- **Implement authentication & user roles**
  - Example 1: Example: “Owner-only access with optional passcode; plan for guest read-only later.”
  - Example 2: Example: “No authentication—the app is public and accessible to everyone.”
  - Example 3: Example: “NextAuth.js with Google OAuth, email/password fallback, role-based access control (admin, user, guest).”
  - Recommendation 1: Recommendation: Keep auth lightweight until multi-user becomes real.
  - Recommendation 2: Recommendation: If you need auth, use a library (NextAuth, Clerk, Supabase Auth) rather than building from scratch.
  - Answer: Not required for this app

- **Build admin/config panel (if applicable)**
  - Example 1: Example: “Settings drawer to manage API keys, default vibe, export options.”
  - Example 2: Example: “No admin panel needed—the app has no configurable settings.”
  - Example 3: Example: “Admin dashboard with user management, content moderation, analytics, system health monitoring.”
  - Recommendation 1: Recommendation: Centralize settings so they don't scatter across the UI.
  - Recommendation 2: Recommendation: Only build an admin panel if you have 5+ settings—otherwise, a simple settings page is enough.
  - Answer: Not required

- **Implement theming (dark/light)**
  - Example 1: Example: “Dark default with toggle to pastel light variant.”
  - Example 2: Example: “Single theme only—dark mode optimized for the app's aesthetic.”
  - Example 3: Example: “System preference detection, manual toggle, custom color schemes, theme persistence in localStorage.”
  - Recommendation 1: Recommendation: Wire theme tokens early so components stay consistent.
  - Recommendation 2: Recommendation: Use CSS variables for theme colors—they're easy to swap and work with any styling approach.
  - Answer: Implement light mode design

- **Build main feature flows (summarize each required flow)**
  - Example 1: Example: “Idea capture → Groq plan generation → Clarification loop → Template export.”
  - Example 2: Example: “User visits page → sees bird image → can share link → that's it.”
  - Example 3: Example: “Sign up → create project → invite team → collaborate → export results → archive project.”
  - Recommendation 1: Recommendation: Outline flows to align development and testing focus.
  - Recommendation 2: Recommendation: Draw user flows on paper first—it's faster than coding and helps you spot edge cases early.
  - Answer: Build image gallery feature

- **Create notification system (channels, behavior)**
  - Example 1: Example: “In-app nudges when TODO fields remain empty after two clarifications.”
  - Example 2: Example: “No notifications—the app is passive and doesn't need to alert users.”
  - Example 3: Example: “In-app toast notifications, email digests (weekly), push notifications (opt-in), SMS for critical alerts.”
  - Recommendation 1: Recommendation: Keep notifications in-app until a real need for outbound arises.
  - Recommendation 2: Recommendation: Let users control notification frequency—default to 'less' and let them opt into more.
  - Answer: Not required

- **User profiles and privacy (settings, permissions, sharing)**
  - Example 1: Example: “Single profile with data wipe button; no sharing by default.”
  - Example 2: Example: “No profiles—the app doesn't track users or require accounts.”
  - Example 3: Example: “Public profiles, privacy controls (public/private/friends), data export, account deletion, activity logs.”
  - Recommendation 1: Recommendation: Codify privacy posture so every feature respects it.
  - Recommendation 2: Recommendation: Make privacy settings opt-in for sharing, not opt-out—default to private and let users choose to share.
  - Answer: Not required

- **Any integrations (external API connections, scheduling integration, etc.)**
  - Example 1: Example: “Groq chat + transcription; Cursor export stub with configurable endpoint.”
  - Example 2: Example: “No external integrations—everything is self-contained.”
  - Example 3: Example: “Stripe for payments, Twilio for SMS, Google Calendar API, Slack webhooks, Zapier for automation.”
  - Recommendation 1: Recommendation: Track each integration separately to manage tokens safely.
  - Recommendation 2: Recommendation: Wrap external API calls in try-catch blocks and have fallback behavior—APIs can fail.
  - Answer: None

- **Implement additional features (describe)**
  - Example 1: Example: “Vibe meter slider, palette-driven prompt hints, mood board gallery.”
  - Example 2: Example: “No additional features—the core functionality is complete and sufficient.”
  - Example 3: Example: “Keyboard shortcuts, drag-and-drop reordering, bulk actions, export to multiple formats, keyboard navigation.”
  - Recommendation 1: Recommendation: Call out signature touches so they don't get cut late in the cycle.
  - Recommendation 2: Recommendation: Additional features should enhance the core experience, not distract from it—if it doesn't make the app better, skip it.
  - Answer: Implement simple navigation between images

- **Build statistics/dashboard (if needed)**
  - Example 1: Example: “Session recap showing answered vs. pending template slots.”
  - Example 2: Example: “No analytics needed—the app is simple and doesn't require usage tracking.”
  - Example 3: Example: “User dashboard with activity graphs, content stats, engagement metrics, exportable reports.”
  - Recommendation 1: Recommendation: Only build analytics if they inform decisions right now.
  - Recommendation 2: Recommendation: Start with basic metrics (page views, user actions) and add complex analytics only when you have questions to answer.
  - Answer: Not required

- **Create About page/personal story**
  - Example 1: Example: “Short 'why AppMaker exists' note with synthwave playlist link.”
  - Example 2: Example: “No about page—the app is self-explanatory and doesn't need backstory.”
  - Example 3: Example: “Full about page with creator story, mission statement, tech stack credits, changelog, contact info.”
  - Recommendation 1: Recommendation: Keep copy modular so you can refresh it as your story evolves.
  - Recommendation 2: Recommendation: An about page adds personality, but only include it if you have something genuine to say—empty corporate speak turns users off.
  - Answer: Create About page with creator's note

- **Add support for unregistered recipients/guests**
  - Example 1: Example: “Guest link mode that shows read-only templates.”
  - Example 2: Example: “No guest support—the app requires registration to use any features.”
  - Example 3: Example: “Public sharing links, guest view mode, temporary access tokens, read-only permissions for shared content.”
  - Recommendation 1: Recommendation: Flag access boundaries clearly to avoid accidental edits.
  - Recommendation 2: Recommendation: Guest access lowers friction but adds complexity—only add it if sharing is core to your app's value.
  - Answer: Not required

- **Testing & polish (responsive design, UX, etc.)**
  - Example 1: Example: “Playwright happy path, manual mobile sweeps, ensure contrast meets AA.”
  - Example 2: Example: “Manual testing on desktop Chrome—mobile and accessibility can come in v2.”
  - Example 3: Example: “Automated E2E tests, responsive breakpoints (mobile/tablet/desktop), accessibility audit, performance profiling, cross-browser testing.”
  - Recommendation 1: Recommendation: Finish with QA to ensure the vibe feels intentional on every device.
  - Recommendation 2: Recommendation: Test on real devices, not just browser DevTools—mobile Safari behaves differently than Chrome's mobile emulator.
  - Answer: Test and polish the app for responsiveness and UX