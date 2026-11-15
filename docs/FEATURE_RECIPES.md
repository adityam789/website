# Feature Recipes

Step-by-step playbooks for common changes. Read `ARCHITECTURE.md` first. Always check `node_modules/next/dist/docs/`
for the current Next 16 API before using routing/data/metadata features, and run `npm run lint && npm run build` afterward.

## Conventions checklist (apply to every change)
- Main site: reuse `globals.css` classes + tokens; page-specific styles go in that page's `page.module.css`. No Tailwind, no styled-components.
- Wrap each visible block in `<Reveal delay={i*60-80}>`.
- Page header pattern (copy from `app/work/page.tsx`): `<Link className={styles.back}>← home</Link>`, `<h1 className={`display ${styles.pageTitle}`}>`, `styles.pageDesc`.
- Pages are server components unless they need state/effects; add `export const metadata` with title `"X — Aditya Maheshwari"`.
- Support dark mode via tokens only (never hard-code colors; if you must, add a `html.dark` override).
- Mobile: breakpoints used are 768px and 480px (see end of `globals.css`).
- Match file's indentation (4 spaces in work/about/blog/contact/Nav/Footer; 2 in home/layout/dmp).
- Commit style (git log): conventional commits, e.g. `feat: ...`, `refactor: ...`.

## 1. Add a nav page (e.g. /projects)
1. `src/app/projects/page.tsx` + `page.module.css` (copy header block from `work`).
2. Add `{ label: 'projects', href: '/projects' }` to `NAV_LINKS` in `components/Nav.tsx` (desktop + mobile menus both read it).
3. Add `export const metadata`.

## 2. Update resume/CV content
Edit `EXPERIENCE` in `app/work/page.tsx` (bullets, tags, period); if headline stats change update `app/page.tsx` stat cards and terminal,
`app/about/page.tsx` quick-facts/bio, and `../content.md`. Replace `public/resume.pdf` / `public/cv.pdf` (source `../aditya_maheshwari_cv_2_page.tex`).

## 3. Add a project
Add to `PROJECTS` in `src/data/work.ts` (name, year, short, desc, tags, href). Both `/work` and the home page render the whole list, newest first.
`href` omitted means private/no link. An optional `image` ({ src, alt, width, height, caption }) shows a figure under the tags on `/work` only: put the file in `public/projects/`, write real alt text, and caption anything that is not a screenshot (for example "Illustration" or "offline demo"). Never use photos of real people.

## 4. Add a blog post (blog system already built)
1. Create `src/content/blog/<slug>.md` with frontmatter `title` (use `Main: Subtitle` to get the split headline), `excerpt`, `date` (YYYY-MM-DD), `tag` (Tech|Life), `cover`, `coverAlt` (alt text for the cover; falls back to the title), optional `draft: true`.
2. Put images in `public/blog/<slug>/`; reference with `![Caption: alt text](/blog/<slug>/file.png)` and register pixel size in `IMAGE_SIZES` (PostBody.tsx). Text before the first `:` in the alt becomes the visible caption.
3. Special elements: `> quote` = pull quote; a ```` ```ladder ```` fence renders the Ladder diagram; other custom fences map to components in `PostBody.tsx` (`diagram-egm`, `diagram-blueprint`, `diagram-convergence`, `diagram-write-path`, `diagram-fanout-race`, `diagram-owner-region`, `diagram-availability-gap`, `diagram-decision-head`, `chart-judge-cost`, `chart-mission-time`, `chart-decision-fit` (reads `src/data/decision-models-results.json`, a copy of `results/site.json` from the separate `decision-models-experiment` repo; re-copy it if the experiment is re-run); `diagrams/Box.tsx` is a shared node helper for new SVG diagrams); table cells starting with Solid/Improving/Early/Maturing/High/Medium/Low become colored pills; h2s are auto-numbered and feed the TOC.
4. Add the post to `PUBLISHED_POSTS` in `src/app/page.tsx` (home). Remove the matching placeholder from `UPCOMING` in `src/app/blog/page.tsx`.
Still TODO: real tag filtering, RSS, per-post OG image generation.

## 5. Make the contact form work
Options: Server Action (see `docs/01-app/02-guides/forms.md`) or a Route Handler `src/app/api/contact/route.ts`, sending via Resend/Formspree/mailto.
Page is currently `'use client'` with an `alert` stub: replace `onSubmit`, add pending/success/error states, honeypot field, and rate limit.
Secrets go in `.env.local` **without** `NEXT_PUBLIC_` prefix. Don't expose personal data in client bundles.

## 6. Add a Life card with real photo
Put images in `public/life/` and use `next/image` inside `.life-card` (replace `.life-card-bg` emoji, add a gradient overlay per design.md).
Add an entry in `LIFE` in `app/page.tsx` (`cls` maps to `.lc-*` backgrounds in `globals.css`; new card needs a new `.lc-x` + `html.dark .lc-x`).
Grid assumes 5 cards (nth-child(4/5) rules) — adjust CSS if the count changes.

## 7. SEO / metadata polish
- Per-page `metadata` already exists on work/about/blog; contact (client) needs a sibling `layout.tsx` to hold metadata, or split into server page + client form component.
- Add `src/app/sitemap.ts`, `src/app/robots.ts`, `opengraph-image.tsx` (see docs `03-api-reference/03-file-conventions/metadata/`), replace `favicon.ico` with AM monogram (`icon.tsx` or file).
- JSON-LD `Person` schema: see `02-guides/json-ld.md`.

## 8. Analytics
Vercel Analytics or Plausible per design.md. See `02-guides/analytics.md`; add the component/script in `app/layout.tsx` body.

## 9. Add a global dark-mode-safe component
Create `src/components/X.tsx` + `X.module.css`; use only `var(--…)` tokens. If it renders on every page (like Nav), mount from `layout.tsx` and
hide on `/dmp` using the `usePathname` + `mounted` pattern from `Footer.tsx`.

## 10. Add/modify a DMP act or copy
- Copy changes: edit strings inside the relevant `components/dmp/Act*.tsx`.
- New act: create `ActFiveX.tsx` mirroring `ActThreeJira` (`TerminalTransition` → `revealed` content → `<ProceedPrompt nextActId onProceed>`),
  then in `app/dmp/page.tsx` import it, bump the `4` in `useState(isLocked ? 1 : 4)` / `Math.min(prev + 1, 4)` / effect, and add `visibleCount >= 5 && ...`.
  Make the formerly-last act accept `onProceed` and render `ProceedPrompt` (Act 4 currently has none).
- Unlock everything while developing: set `navigationMode: 'scroll'` in `lib/dmp/config.ts` (revert before commit).
- New env-driven value: add `NEXT_PUBLIC_*` to `.env.local` (gitignored) — and mention it in README so deploys set it in Vercel.
- Use `tokens.*` for colors, `useReducedMotion` for motion, and keep styled components inside the act file.

## 11. Collapsible experience timeline (spec feature)
In `app/work/page.tsx`, extract the `.exp-row` map to a `'use client'` `ExperienceList` component with `openIdx` state; show first bullets collapsed,
toggle on click (`.exp-row` already has `cursor: pointer`). Keep the page itself a server component for `metadata`.

## 12. Active-section nav / smooth in-page anchors
Home sections already have ids (`home, about, work, life, blog`). Add an IntersectionObserver hook in Nav for hash highlighting; `html { scroll-behavior: smooth }` is already set.

## Gotchas
- `Nav`/`Footer` are `'use client'` and only learn about `/dmp` after mount → brief flash on first paint.
- `Reveal` hides content (`opacity:0`) until intersecting; if content is above the fold and not revealing, check the observer threshold (0.12).
- Hero stat "3+ years" and `© 2026` are hard-coded and will go stale.
- `.env.local` holds phone/Instagram; never print or commit them.
- Dev server writes to `.next/`; ignore it. There is no `next-env.d.ts` in git (gitignored).
