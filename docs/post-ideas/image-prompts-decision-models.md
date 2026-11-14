You are working in my personal site repo (Next.js 16, branch `redesign`). Read CLAUDE.md,
docs/ARCHITECTURE.md and docs/FEATURE_RECIPES.md (recipe 4) before writing anything.

## Goal
Research, write and publish a three-part blog series on decision models (also called
System One models: Jev, Strands Decider, Clef, Gemini Decisions API and the open Qwen/Gemma
clones), backed by one small experiment I can reproduce, then push to GitHub.

## Starting point
docs/post-ideas/decision-models-series.md holds researched outlines for all three posts, a
list of corrections to my original notes, and a source list split into primary and
secondary. Treat it as the plan. Do not re-derive it. Its "Read first" section overrides my
earlier assumptions (for example: multimodal decision models already exist, hosted Jev
cannot be fine-tuned, and not every decision model is a decoder).

## Step 1: Research (keep it focused, about 15 searches at most)
- Open and read the primary sources in that doc before using any number from them. Where
  the doc cites a secondary write-up for a claim, find the primary source or drop the claim.
- I could not find the exact papers I originally read. Find the closest published work and
  anchor on it: papers that use or evaluate decision models, fine-tuned small models versus
  zero-shot LLMs for classification, teacher-student distillation, LLM routing, confidence
  calibration and abstention, and small vision-language models used as classifiers.
- Also read TypeSafe's launch post and docs, Simon Willison's notes on Jev and on the Gemini
  Decisions API, and the SR 11-7 text itself (and confirm whether SR 26-2 exists before
  mentioning it).
- This category is about two months old and much of the coverage is thin or AI-written.
  Prefer papers, official docs, repos and model cards. If two sources disagree, say so in
  the post.
- Save what you verified to docs/post-ideas/decision-models-research.md: one line per
  claim, with the link and whether you read the primary source.

## Step 2: Experiment (this is what makes post 2 credible)
Build a small, reproducible experiment in experiments/decision-models/ in this repo:
- Task: intent classification on Banking77 (public, payments-flavoured, 77 fine-grained
  labels), plus one binary task of your choice from a public dataset.
- Compare at least: (a) an open decision model or a small open LLM read out as a decision
  model, zero-shot; (b) the same model after a cheap fit on a few hundred labels (a
  calibrated head or LoRA, whichever runs here); (c) a classic fine-tuned small encoder as
  the baseline.
- Report per-class precision and recall, macro-F1, expected calibration error, and
  coverage at a 0.90 confidence bar. Include a reliability plot and a confusion summary.
- This machine is an Apple Silicon MacBook Air. Pick model sizes and sample counts that
  finish in under about an hour in total. Say exactly what you ran.
- Fixed seeds, a README with the commands, a requirements file, results saved as JSON/CSV.
  Do not commit model weights, datasets or virtualenvs (add them to .gitignore).
- Make sure the experiments folder cannot break `npm run build`.
- If something cannot run here, stop and tell me what you tried. Never estimate, simulate
  or invent a result. A smaller real experiment beats a bigger imagined one.

## Step 3: Write the three posts
Files in src/content/blog/, following recipe 4 and the outlines:
1. What a decision model is (still a transformer language model, generation step removed).
2. Zero-shot is a demo, calibrated on your data is a product (my main argument, built
   around the experiment's real numbers).
3. Where decision models earn their place (routing, triage, rating, guardrails, many small
   questions, multimodal, and where not to use them).
- Voice: match my existing posts in that folder. First person, short paragraphs, plain
  words, tables where they help, one pull quote at most, a linked "Sources" section at the
  end. Around 1,200 to 1,800 words each. Posts 2 and 3 link back to the earlier parts.
- Every factual claim links to a source you actually read. State the date of anything
  time-sensitive (pricing, which vendors have shipped), because this field moves weekly.
- Present opposing evidence fairly. Where the research does not support one of my original
  claims, say what the evidence shows instead.
- Diagrams: build them as themed SVG components in src/components/blog/diagrams/ (use the
  Box.tsx helper and Diagram.module.css, as AvailabilityGap.tsx does) and register a code
  fence for each in PostBody.tsx. At least: a side-by-side of a chat model and a decision
  model for post 1, and a chart of the experiment results for post 2 drawn from the saved
  results file.
- Note: table cells that begin with Solid, Maturing, Improving, Early, High, Medium or Low
  are auto-styled as pills. Avoid starting cells with those words unless you want that.
- Covers: I will generate these myself. Leave `cover` and `coverAlt` out of the
  frontmatter, and write one 16:9 cover prompt per post to
  docs/post-ideas/image-prompts-decision-models.md, in the style of
  docs/post-ideas/image-prompts-idempotency.md.

## Hard constraints
- Do not mention PayPal, my employer, my team, or any internal system, incident or number
  in these posts or in the experiment. Talk about payments only as an industry, using
  public information. (The rest of the site already names my employer; leave that alone.)
- Do not change the site's design, other posts, or anything under /dmp.
- No fabricated quotes, numbers, citations or benchmark results.

## Verify before you commit
- `npx tsc --noEmit` passes.
- `npx eslint` passes on every file you touched. (`npm run lint` fails on older /dmp files;
  that is known and not yours to fix.)
- `npm run build` passes and lists all three new /blog/ routes.
- Run `npm run dev`, open each post, and check the diagrams, tables and links in light and
  dark mode.
- Re-open every link in the Sources sections and confirm it resolves.

## Git
- Stay on `redesign`. Conventional commits, one per logical step (research notes,
  experiment, each post).
- Update docs/FEATURE_RECIPES.md with the new diagram fences and mark the outline doc as
  drafted.
- Finish with `git push -u origin redesign`. Do not merge into or push to `main`.

## Report back
A short summary: what you verified, the experiment's headline numbers, anything in my
original notes that the evidence contradicted, anything you could not verify or run, and
the commit list.text, no numbers, no people, no robots. 16:9.
```

## Part 3: decision-models-3-where-they-earn-their-place
```text
Editorial illustration for a software engineering blog post about where decision models fit. A single small glowing amber cube sits at a junction where one translucent teal track splits into six narrower tracks fanning out, seen from a slightly elevated isometric angle. Small teal cubes travel along the tracks; each of the six tracks ends at a different simple glyph on a low platform: a signpost, an envelope, a star, a shield, a grid of dots, a camera. Deep navy background with faint grid lines, calm and minimalist, lots of negative space. No text, no people, no robots. 16:9.
```
