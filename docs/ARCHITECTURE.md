# Architecture Map — aditya_maheshwari_portfolio/website

Personal portfolio (mahicodes.com) + a hidden joke/proposal page at `/dmp`.
Next.js **16.2.4** App Router, React 19.2, TypeScript strict. **Read `node_modules/next/dist/docs/` before using
Next APIs** (see AGENTS.md). Known v16 changes: `middleware.ts` → `proxy.ts`; `params`/`searchParams` are async.
Guides worth knowing: `01-app/02-guides/{mdx,forms,environment-variables,analytics,json-ld}.md`.

Only `website/` is a git repo. Sibling files in the parent dir are the *original spec*, not code:
`../design.md` (design system v1), `../content.md` (all copy/data), `../personal_website_mockup.html`,
`../aditya_maheshwari_cv_2_page.tex` (CV source), PDFs. Treat them as source-of-truth for intent; the code has drifted (see "Known drift").

> **Updated 2026-11-14 (redesign).** Where this file disagrees with the list below, the list wins:
> - Content lives in `src/data/` (`site.ts` identity/links/nav/proof, `work.ts` case studies/experience/teaching/projects, `about.ts` skills/education/awards). Pages only render it. Nothing is duplicated.
> - All main pages are server components. Client pieces: `Nav`, `Footer`, `ThemeProvider` (useSyncExternalStore over `html.dark`), `CommandPalette` (⌘K, opened via the `cmdk:open` window event), `blog/BlogList` (tag filters), `ContactForm` (mailto compose, no backend), `Reveal`.
> - `app/layout.tsx` has a `<head>` boot script (sets `html.dark` and `html.js` before paint; reveals are only hidden under `.js`). `app/template.tsx` gives each navigation one 280ms fade. All motion is disabled under `prefers-reduced-motion`.
> - SEO files: `app/sitemap.ts`, `robots.ts`, `feed.xml/route.ts` (RSS), `icon.tsx`, `opengraph-image.tsx`, JSON-LD Person in layout.
> - Fonts load only through `next/font` (`--font-serif-next`, `--font-mono-next`, mapped to `--font-display` / `--font-mono` in globals.css).
> - Use `--accent-text` (not `--accent`) for small accent-colored text; it passes contrast. New code uses 2-space indentation.
> - Home lists posts from `getAllPosts()`; "coming soon" placeholders were removed. `/work` case studies are cards (`CaseCard`); add detail pages when trade-offs are written up.
> - `npm run lint` still fails on pre-existing `/dmp` files only.

## Commands
`npm run dev` · `npm run build` · `npm run lint` (no test suite exists). Deploy target: Vercel.

## Two separate styling worlds (most important thing to know)
| Area | Routes | Styling | Theme tokens |
|---|---|---|---|
| Main site | `/`, `/work`, `/about`, `/blog`, `/contact` | Plain CSS: `src/app/globals.css` (global utility classes) + per-page `*.module.css` | `--bg --surface --text-* --border* --accent* --green*` etc. in `:root` / `html.dark` |
| DMP | `/dmp` | `styled-components` v6 (SSR registry in `app/dmp/layout.tsx`) | `--dmp-*` vars injected by `GlobalDmpStyles`, read via `src/lib/dmp/tokens.ts` |

Never mix them: no styled-components on main pages, no `--dmp-*` outside `/dmp`. `next.config.ts` enables `compiler.styledComponents`.

## Directory map
```
src/app/
  layout.tsx          Root: fonts (Instrument Serif=--font-display, Geist=--font-geist-sans, JetBrains Mono=--font-mono),
                      site metadata/OG, wraps ThemeProvider > ScrollProgress, Nav, <main>, Footer
  globals.css         Tokens + ALL shared classes (see catalog below). 893 lines.
  page.tsx            Home (client component): Typewriter, hero+terminal, about strip, selected work, life grid, blog list
  work|about|blog|contact/page.tsx (+ page.module.css)   Server components, except contact ('use client')
  dmp/layout.tsx      Metadata + StyledComponentsRegistry + GlobalDmpStyles
  dmp/page.tsx        4-act flow state machine
src/components/       Nav, Footer, Reveal, ScrollProgress, ThemeProvider (+ Nav/Footer .module.css)
src/components/dmp/   ActOneRFC, ActTwoAppStore, ActThreeJira, ActFourPR, ProceedPrompt, TerminalTransition,
                      ConfettiButton, StyledComponentsRegistry
src/content/blog/     *.md posts (frontmatter: title, excerpt, date, tag, cover, coverAlt, draft)
src/components/blog/  PostBody (markdown renderer + custom elements), Ladder, TableOfContents
src/lib/blog.ts       getAllPosts/getPost/formatDate
public/blog/<slug>/   post images (add known sizes to IMAGE_SIZES in PostBody.tsx)
src/lib/dmp/          config.ts (navigationMode), tokens.ts
src/styles/dmp/       GlobalDmpStyles.ts
public/               resume.pdf, cv.pdf (hybrid, the default), resumes/ (AI and backend versions; see RESUME_TRACKS), default create-next-app svgs (unused)
.env.local            NEXT_PUBLIC_PHONE_NUMBER, NEXT_PUBLIC_INSTAGRAM_URL (gitignored; used by DMP Act 2 / ConfettiButton)
```
Imports use **relative paths** throughout, although `@/*` → `src/*` alias is configured.
Indentation is inconsistent: main-site pages use 4 spaces, home/layout/dmp use 2. Match the file you edit.

## Cross-cutting components
- **ThemeProvider** (`useTheme() → {theme, toggle}`): toggles `html.dark`, persists `localStorage.theme`, falls back to
  `prefers-color-scheme`. Defaults to `light` until mounted (possible flash; `suppressHydrationWarning` on html/body).
- **Nav**: `NAV_LINKS` array (work/about/blog/contact). On `/dmp` it renders only logo + theme toggle (checks `pathname === '/dmp'` after mount).
- **Footer**: hard-coded links; returns `null` on `/dmp`. Email/GitHub/LinkedIn are duplicated across Footer, contact page, content.md.
- **Reveal** `<Reveal delay={ms}>`: IntersectionObserver fade-up wrapper; adds `.visible` once. Use for every block on main pages.
- **ScrollProgress**: 2px accent bar driven by `#scroll-progress`.
- Both Nav and Footer are rendered from root layout, so any route-specific hiding must be done by pathname checks there.

## globals.css class catalog (reuse before writing new CSS)
Layout: `.container` `.container-wide` `.section` `.section-header` `.section-more` `.section-divider`
Type: `.display` (serif hero) `.label-caps` `.mono`
Atoms: `.tag` `.btn-primary` `.btn-secondary` `.available-badge` `.pulse-dot` `.cursor` `.badge-soon` `.stat-card/.stat-num/.stat-label`
Rows: `.project-row/.project-name/.project-desc/.project-tags/.project-arrow` · `.blog-row/.blog-num/.blog-title/.blog-meta/.blog-date`
      · `.exp-list/.exp-row/.exp-header/.exp-company/.exp-role/.exp-period/.exp-bullets/.exp-bullet`
Terminal: `.terminal/.terminal-bar/.terminal-body/.dot*/.t-prompt/.t-cmd/.t-out/.t-key/.t-accent`
Life: `.life-grid/.life-card(+ .lc-hike|bball|cook|cars|travel)/.life-card-bg/-label/-sub`
Skills: `.skills-grid/.skill-group/.skill-group-title/.skill-pills/.cert-badge`
Forms: `.contact-form/.form-field/.form-label/.form-input/.form-textarea`
Animation: `.reveal(.visible)`; keyframes `pulse`, `blink`.
Tokens: spacing `--space-1..10`, `--radius-sm/md/lg/full`, `--max-width` 1150px, `--side-pad`, `--section-gap`, `--nav-h` 64px.
Note: `globals.css` also `@import`s Google Fonts at the top (duplicate of `next/font` loading in layout).

## Content lives in code (no CMS / no data layer)
Content is hard-coded as `const` arrays at the top of each page and **duplicated across pages**:
| Data | Where |
|---|---|
| Typewriter LINES, PROJECTS(short), LIFE, TECH_POSTS, LIFE_POSTS, stats, terminal text | `app/page.tsx` |
| EXPERIENCE, PROJECTS(full, with year) | `app/work/page.tsx` |
| SKILLS, CERTS, AWARDS, bio/quick facts | `app/about/page.tsx` |
| POSTS (title, tag) | `app/blog/page.tsx` (and TECH/LIFE_POSTS on home — same titles, duplicated) |
| Contact links | `app/contact/page.tsx` + Footer |
When changing a fact (job title, link, metric), grep for it — it likely appears in 2–4 places, and also in `../content.md`
and the CV `.tex`.

## Routes
| Route | Type | Notes |
|---|---|---|
| `/` | client | Hero (typewriter, terminal), About strip, Selected work (3), Life cards (emoji, no photos), Blog list (all "coming soon") |
| `/work` | server | Projects + Experience (always expanded, no collapse) |
| `/about` | server | Bio, quick facts, skills, certs, awards |
| `/blog` | server | Lists published posts (from `src/content/blog/*.md`, linked) then "coming soon" placeholders (`UPCOMING`). Filter pills are **visual only** |
| `/blog/[slug]` | server (SSG) | Markdown post: `lib/blog.ts` (gray-matter frontmatter, TOC, read time) → `components/blog/PostBody` (react-markdown + remark-gfm + rehype-slug), sticky `TableOfContents`, cover image, OG/Twitter metadata |
| `/contact` | client | Form `onSubmit` just `alert('Form submission coming soon!')` — not wired to anything |
| `/dmp` | client | Not linked from nav/footer (hidden). Alt domain `mahi.run/dmp` in its OG metadata |

## /dmp deep dive
`app/dmp/page.tsx` renders 4 "acts" in sequence. `lib/dmp/config.ts: navigationMode`:
- `'locked'` (current): `visibleCount` starts at 1; each Act's `onProceed` (from `ProceedPrompt`) reveals the next (max 4).
- `'scroll'`: all 4 visible.
Acts: **1 RFC** (boot lines, progress) → **2 AppStore** (listing; uses `NEXT_PUBLIC_INSTAGRAM_URL`) → **3 Jira** (status workflow)
→ **4 PR** (final; `ConfettiButton` w/ `canvas-confetti`, hard-coded Instagram link).
Acts 2–4 begin with `<TerminalTransition lines onComplete>` which types lines then sets `revealed` to show content.
`ProceedPrompt({nextActId, onProceed})` is the Yes/No prompt; the "No" button evades (modes `escape`/`shrink`).
Animations use `framer-motion` and respect `useReducedMotion`. Each Act file defines its own `styled.*` components inline (~250–440 lines each).
Colors only via `tokens.*` (CSS-var strings). Uses `.dark` class from the shared ThemeProvider, so dark mode works there too.
Personal data (phone, Instagram) comes from `NEXT_PUBLIC_*` env, meaning it is **embedded in the client bundle**.

## Known drift / gaps vs. spec (candidates for future work)
- Blog: posts are plain `.md` (not MDX); filter pills not functional; home page lists published posts via a hard-coded `PUBLISHED_POSTS` array (home is a client component) — keep in sync.
- Contact form not functional; spec said "one-line form".
- No SEO extras: no `sitemap`, `robots` file, OG image, per-page OG, favicon is the default Next one (spec: AM monogram).
- Life section uses emoji instead of photos; `/about` has no portrait.
- Work page: spec wanted collapsible timeline + Teaching/Education sections (data exists in `../content.md`).
- Home hero stats/“01 / 05” counter static; active-section nav highlighting only by route.
- No analytics. No tests. Default `public/*.svg` unused. README is stock create-next-app.
- `Aditya_s_Resume.pdf`/`Aditya_CV.pdf` in parent vs `public/resume.pdf`, `public/cv.pdf` — keep in sync manually.
- Home typewriter line 5 differs slightly from content.md ("debug production" vs "debug production code").
