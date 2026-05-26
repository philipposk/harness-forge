## Instructions

### App Planning & Requirements Gathering
Clarify the core purpose and audience before building.

- **What is your app called?**
  - Example 1: Example: “AppMaker” keeps the name short and future-proof for dashboards or mobile shells.
  - Example 2: Example: “BlueBird” is simple, memorable, and directly reflects the core visual element of the app.
  - Example 3: Example: “VibeScaffolder” combines the emotional tone (vibe) with the technical action (scaffolding).
  - Recommendation 1: Recommendation: Pick a name you can reuse in copy and repo folders; it keeps momentum later.
  - Recommendation 2: Recommendation: Avoid overly technical names unless your audience is developers—simple, evocative names resonate better.
  - Answer: Bird Gallery

- **What core problem does it solve, and for whom?**
  - Example 1: Example: “It helps indie builders turn napkin ideas into scoped projects ready for Cursor.”
  - Example 2: Example: “Shows a calming blue bird image to reduce stress for office workers during breaks.”
  - Example 3: Example: “Eliminates the blank page problem for writers by providing AI-generated story prompts based on mood.”
  - Recommendation 1: Recommendation: Summarize goal in one sentence so it guides every feature decision.
  - Recommendation 2: Recommendation: Be specific about the target user—'for everyone' is too vague; 'for busy designers who need quick inspiration' is actionable.
  - Answer: The app displays bird images for nature enthusiasts and birdwatchers.

- **Can you describe the key workflow or the “main magic” moment for users?**
  - Example 1: Example: “You describe an idea; the assistant fills the Instructions/Rules/TODO template automatically.”
  - Example 2: Example: “User opens the app and immediately sees a beautiful blue bird image that instantly calms them—no clicks, no setup.”
  - Example 3: Example: “Writer selects a mood, and the app generates three story prompts that perfectly match their emotional state.”
  - Recommendation 1: Recommendation: Focus on the moment users feel delight—it keeps UX grounded.
  - Recommendation 2: Recommendation: The magic moment should happen within the first 10 seconds of use; if it takes longer, simplify the flow.
  - Answer: Users can view a gallery of bird images.


### Essential Features
- **List the must-have features the app requires for a useful MVP.**
  - Example 1: Example: “Groq-powered chat, voice capture, mood board upload, template autofill, clarification prompts.”
  - Example 2: Example: “Display blue bird image, full-screen view, simple navigation, no login required.”
  - Example 3: Example: “Mood selection, AI prompt generation, save favorites, export to text file.”
  - Recommendation 1: Recommendation: Limit to three or four pillars so v1 ships quickly.
  - Recommendation 2: Recommendation: If you can't explain why a feature is essential in one sentence, it's probably not MVP-worthy.
  - Answer: Display bird images, simple navigation

- **Which features are nice-to-have or for future versions?**
  - Example 1: Example: “Shareable exports, project history browser, automated Cursor repo commits.”
  - Example 2: Example: “Multiple bird species, custom colors, daily bird facts, sharing to social media.”
  - Example 3: Example: “Advanced mood analytics, collaborative editing, integration with writing tools, mobile app version.”
  - Recommendation 1: Recommendation: Park ideas that don't unblock day-one usage to avoid scope creep.
  - Recommendation 2: Recommendation: Write future features down so you don't forget them, but resist the urge to build them until users ask.
  - Answer: Image filtering, bird information popups


### User Experience
- **What are the main user roles?**
  - Example 1: Example: “Owner (you) now; optional guest observers later.”
  - Example 2: Example: “Single user role—no authentication needed for a simple viewing app.”
  - Example 3: Example: “Viewer (default), Editor (can modify content), Admin (can delete and manage settings).”
  - Recommendation 1: Recommendation: Start with the single role that must exist; layer on more only when workflows demand it.
  - Recommendation 2: Recommendation: Every additional role doubles complexity—only add roles when you have concrete use cases that require different permissions.
  - Answer: General users

- **What should each user be able to do?**
  - Example 1: Example: “Owner can run sessions, tweak vibe meter, export plans; guests can review read-only scopes.”
  - Example 2: Example: “View the bird image, toggle fullscreen, share via link (no account needed).”
  - Example 3: Example: “Viewers can browse and favorite; Editors can add content; Admins can moderate and delete.”
  - Recommendation 1: Recommendation: Tie permissions to concrete flows so nothing ships unused.
  - Recommendation 2: Recommendation: List capabilities as action verbs (view, edit, delete) rather than abstract concepts (access, manage) for clarity.
  - Answer: View bird images

- **Are there any access restrictions?**
  - Example 1: Example: “Guests can't change templates or trigger Cursor exports.”
  - Example 2: Example: “No restrictions—the app is completely open and requires no login.”
  - Example 3: Example: “Only verified editors can publish content; viewers can only comment on published items.”
  - Recommendation 1: Recommendation: Document restrictions now—it simplifies future auth wiring.
  - Recommendation 2: Recommendation: If you're unsure about restrictions, start open and add them later when you see abuse or need.
  - Answer: None


### Integrations & Notifications
- **Should the app integrate with external APIs or services?**
  - Example 1: Example: “Yes: Groq (real) and Cursor account hooks (stub now, real later).”
  - Example 2: Example: “No external integrations—the app is completely self-contained and works offline.”
  - Example 3: Example: “Yes: Unsplash API for bird images, Twitter API for sharing, Google Analytics for usage tracking.”
  - Recommendation 1: Recommendation: Call out whether integrations are real or mocked so testing stays honest.
  - Recommendation 2: Recommendation: Each integration adds a point of failure—only add them if they're essential to the core value proposition.
  - Answer: None for MVP

- **For the MVP, do you want real integrations or simulated flows?**
  - Example 1: Example: “Real Groq endpoints; Cursor export scaffolding with logging until API access is confirmed.”
  - Example 2: Example: “All integrations are real from day one—we need live data to validate the concept.”
  - Example 3: Example: “Mock all integrations for MVP to test UX; add real APIs in v2 after user feedback.”
  - Recommendation 1: Recommendation: Choose realism only where it teaches you something today.
  - Recommendation 2: Recommendation: If an integration costs money per request, mock it first to avoid unexpected bills during development.
  - Answer: Simulated flows

- **Should users receive notifications? If yes, how often and for what?**
  - Example 1: Example: “No emailed alerts yet; in-app reminders when template slots stay empty.”
  - Example 2: Example: “No notifications—the app is passive and doesn't need to interrupt users.”
  - Example 3: Example: “Daily digest email with new content, push notifications for urgent updates, in-app badges for unread items.”
  - Recommendation 1: Recommendation: Skip outbound notifications until a workflow breaks without them.
  - Recommendation 2: Recommendation: Users hate notification spam—only notify when the user explicitly requests it or when action is required.
  - Answer: None


### Data, Security & Privacy
- **What core data or objects are stored?**
  - Example 1: Example: “Conversation transcripts, filled templates, palette summaries, API usage logs.”
  - Example 2: Example: “No data stored—the app is stateless and loads the bird image fresh on each visit.”
  - Example 3: Example: “User preferences (theme, favorites), content submissions, moderation flags, analytics events.”
  - Recommendation 1: Recommendation: Enumerate data assets so you can review retention/privacy later.
  - Recommendation 2: Recommendation: The less data you store, the simpler your app and the fewer privacy concerns you'll have.
  - Answer: Bird images

- **Should users have privacy settings or profiles?**
  - Example 1: Example: “Single-owner profile with option to wipe sessions; no public sharing.”
  - Example 2: Example: “No profiles needed—the app doesn't collect or store any personal information.”
  - Example 3: Example: “Public profiles with customizable privacy levels: public, friends-only, private.”
  - Recommendation 1: Recommendation: Decide how deletion works now—it's harder to retrofit.
  - Recommendation 2: Recommendation: If you're storing user data, give users a clear 'delete my account' option from day one.
  - Answer: None required

- **Any GDPR or compliance needs?**
  - Example 1: Example: “Not required now; note for future if guest accounts become public.”
  - Example 2: Example: “No compliance needed—no user data collection, no cookies, no tracking.”
  - Example 3: Example: “GDPR required: EU users, data export, right to deletion, cookie consent banner.”
  - Recommendation 1: Recommendation: Document “none” explicitly so stakeholders know it was considered.
  - Recommendation 2: Recommendation: If you're collecting any personal data from EU users, GDPR applies—plan for it early.
  - Answer: None


### Special Features
- **Should users be able to upload media?**
  - Example 1: Example: “Yes: upload mood board images to steer vibe extraction.”
  - Example 2: Example: “No uploads—all images are pre-loaded or fetched from external APIs.”
  - Example 3: Example: “Yes: users can upload custom bird photos, max 5MB per image, PNG/JPG only.”
  - Recommendation 1: Recommendation: Mention file types/limits to keep UX expectations clear.
  - Recommendation 2: Recommendation: File uploads require storage, validation, and security—only add if essential to the core experience.
  - Answer: No

- **Any AI or automation features?**
  - Example 1: Example: “Groq Whisper transcription, LLM-driven template filling, vibe-tuned clarifications.”
  - Example 2: Example: “No AI features—the app is purely visual and doesn't need intelligent processing.”
  - Example 3: Example: “AI image generation for custom bird art, smart tagging, automatic mood detection from user text.”
  - Recommendation 1: Recommendation: Highlight the single standout automation that defines the experience.
  - Recommendation 2: Recommendation: AI features add cost and complexity—ensure they're core to the value, not just nice-to-have.
  - Answer: No

- **Any unique requirements?**
  - Example 1: Example: “Vibe meter that nudges prompt tone based on palette and mood slider.”
  - Example 2: Example: “The bird image must be exactly 1920x1080px and load in under 1 second.”
  - Example 3: Example: “Works completely offline, syncs when connection returns, supports keyboard-only navigation for accessibility.”
  - Recommendation 1: Recommendation: Document quirky touches so they don't get cut later.
  - Recommendation 2: Recommendation: Unique requirements often become differentiators—but make sure they serve a real user need, not just novelty.
  - Answer: None


### Design & Branding
- **Any specific design vision, brand values, colors, or style?**
  - Example 1: Example: “Neon gradients + synthwave cues; keep it cinematic yet focused.”
  - Example 2: Example: “Minimalist and calming: soft blues, plenty of white space, gentle animations.”
  - Example 3: Example: “Bold and energetic: high contrast, vibrant colors, dynamic transitions, playful typography.”
  - Recommendation 1: Recommendation: Choose two core colors and one accent for a cohesive palette.
  - Recommendation 2: Recommendation: Your design vision should match your app's purpose—a meditation app needs different colors than a productivity tool.
  - Answer: Simple, nature-inspired design

- **Should the app support dark/light mode?**
  - Example 1: Example: “Dark mode default; optional pastel light mode for daylight working.”
  - Example 2: Example: “Light mode only—the app is designed for daytime use and bright environments.”
  - Example 3: Example: “Both modes with automatic switching based on system preferences, plus manual override.”
  - Recommendation 1: Recommendation: Record desired default so theming work stays decisive.
  - Recommendation 2: Recommendation: Dark mode is expected by most users today—if you only build one, make it dark mode.
  - Answer: Light mode


### About / Personal Touch
- **Would you like a creator's note or story section?**
  - Example 1: Example: “Short note about vibecoding experiments built while looping synthwave.”
  - Example 2: Example: “No about section—the app speaks for itself and doesn't need backstory.”
  - Example 3: Example: “Personal story about why I built this, the problem it solves for me, and how it evolved from a weekend project.”
  - Recommendation 1: Recommendation: Keep it to a paragraph so it feels heartfelt without slowing the flow.
  - Recommendation 2: Recommendation: An about section humanizes your app—but only add it if you have a genuine story to tell.
  - Answer: Creator's note about bird conservation

- **Anything personal you want in an "About" screen?**
  - Example 1: Example: “Timeline of previous vibe projects and a link to inspiration playlists.”
  - Example 2: Example: “Just credits: built by [your name], powered by [technologies used].”
  - Example 3: Example: “Links to GitHub, Twitter, portfolio; changelog; acknowledgments to open-source libraries used.”
  - Recommendation 1: Recommendation: Note any evergreen links so you can keep them updated later.
  - Recommendation 2: Recommendation: Keep personal links minimal—users care more about the app working well than your social media presence.
  - Answer: Links to birding resources