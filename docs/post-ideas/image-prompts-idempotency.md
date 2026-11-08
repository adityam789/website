# Image prompts: "Idempotency Keys Are a Consensus Problem"

Only the cover needs an image generator. The three diagrams (write path, fan-out race, owner region) are built in code and follow dark mode.

Style line (keep it so the set matches the other posts):
flat vector or clean isometric, deep navy #0F1B3D with teal #2BB5A0 and one amber #F5A623 accent, calm and minimalist, lots of negative space, no robots, brains, people or logos, no text.

Output: 16:9, ideally 1672 x 941 px (the site reserves that size). Save as `cover.png`, then drop it in `public/blog/idempotency-keys-are-a-consensus-problem/` or send it to me and I'll place it.

---

## A. Cover (recommended)

```text
Editorial illustration for a software engineering blog post titled "Idempotency Keys Are a Consensus Problem". Two identical tall translucent teal server towers stand on separate small floating platforms, one on the left and one on the right, seen from a slightly elevated isometric angle. Between them floats a single glowing amber key. Thin dashed lines run from the key to a keyhole on each tower; on the right-hand line a small clock sits at the midpoint, and just above the right tower hovers a faint, semi-transparent copy of the same key, as if arriving a moment late. Deep navy background with faint grid lines, calm and minimalist, lots of negative space. No text, no people, no robots. 16:9.
```

## B. Cover (alternative, more abstract)

```text
Editorial illustration for a software engineering blog post titled "Idempotency Keys Are a Consensus Problem". Two identical tall doors stand side by side in a deep navy space, seen from a slightly elevated isometric angle, each with a single keyhole. One large glowing amber key hovers in the gap between them, close to the left door. The right door is slightly ajar with a thin line of teal light, and a faint ghost outline of the same key hovers in front of it. A small clock glyph floats above the gap. Faint grid lines, calm and minimalist, lots of negative space. No text, no people, no robots. 16:9.
```

Meaning, if you want to sanity-check the image: two regions, one key, and a second copy of the claim that arrives a moment late.

---

## When the cover lands (checklist for me)
1. Place `cover.png` in `public/blog/idempotency-keys-are-a-consensus-problem/`.
2. Set `draft: false` in the post and add it to `PUBLISHED_POSTS` in `src/app/page.tsx`.
3. Fix the hard-coded cover alt text in `src/app/blog/[slug]/page.tsx` first (it currently describes the previous post's cover for every post).
