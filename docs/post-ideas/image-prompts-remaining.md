# Remaining image prompts: "Every serious agent harness makes the same four moves"

Already done: patterns map (image), Elephant-Goldfish flow, Stripe blueprint, convergence diagram (all in the project).
Still needed: the cover, the swarm illustration, the checklist card. The two charts are optional here because I can build them in code.

Style line (keep it in every prompt so the set matches the other posts):
flat vector, navy #0F1B3D and teal #2BB5A0 with one amber #F5A623 accent, sans-serif type, generous spacing, readable at 1200 px wide, no robots, brains, people or logos.

Generators garble small text. Check every label against the exact wording below.

---

## A. Cover (16:9)
Save as `cover.png`. Goes at the top of the post.

```text
Editorial illustration for a software engineering blog post titled "Every serious agent harness makes the same four moves". A small glowing amber cube floats in the center of four tall translucent teal walls arranged as a square courtyard, seen from a slightly elevated isometric angle. Each wall carries one minimal glyph: a blank page, a balance scale, a gear, a stack of coins. Deep navy background with faint grid lines, calm and minimalist, lots of negative space. No text, no people, no robots. 16:9.
```

## B. Swarm versus hierarchy (16:9)
Save as `swarm-vs-hierarchy.png`. Goes in section 8.

```text
A clean side-by-side before-and-after diagram on a white background, split by a thin vertical line.

Left half, title "Flat swarm": about twenty small identical circles arranged in a ring, all with thin lines pointing at one square in the middle labeled "lock file" in amber #F5A623. Most circles are faded light gray, to show they are waiting.

Right half, title "Planner, workers, judge": one navy #0F1B3D circle at the top labeled "Planner", a row of five teal #2BB5A0 circles below it labeled "Workers", and one navy circle at the bottom labeled "Judge", with thin arrows flowing top to bottom. Every circle is fully colored.

A small caption centered under both halves: "20 agents ran at the speed of 2 to 3 (Cursor, Jan 2026)".

Flat vector, sans-serif type, generous spacing, readable at 1200 px wide. No robots, brains, people or logos.
```

## C. Checklist card (1:1)
Save as `checklist.png`. Goes at the end of the post and is made to be shared on its own.

```text
A square card on a white background with a thin navy #0F1B3D border and rounded corners. Title at the top in bold navy: "The harness checklist". Below it, five rows, each with an empty rounded checkbox outlined in amber #F5A623 on the left and one line of navy text:

1. "Can a fresh session resume from files alone?"
2. "Does anything other than the writer decide done?"
3. "Which steps could be plain code instead of a prompt?"
4. "Which role gets the expensive model, and when did you last re-test it?"
5. "Is the human gate still there?"

A thin teal #2BB5A0 line above a small footer in gray: "The space of useful harnesses doesn't shrink. It moves."

Flat vector, sans-serif type, generous spacing, readable at 1200 px wide. No robots, brains, people or logos.
```

---

## Optional: the two charts (only if you want a generator version; I can build them in code)

### D. Cost of the judge, for section 1 (16:9)
These figures are from your outline and are not re-checked against Anthropic's post.

```text
A clean horizontal bar chart on a white background with two side-by-side panels sharing three rows. Row labels: "Solo agent", "Planner + generator + evaluator", "Simplified harness, Opus 4.6".
Left panel titled "Cost": $9, $200, about $125.
Right panel titled "Time": 20 minutes, 6 hours, 3 hours 50 minutes.
Bars are navy #0F1B3D, drawn to scale, with the values printed at the end of each bar. A small amber #F5A623 note beside the first row: "core feature did not work". Chart title: "Same prompt, very different bill". No legend, thin gridlines, sans-serif type, readable at 1200 px wide.
```

### E. Where a 16.5-hour mission's time goes, for sections 4 and 7 (16:9)
Source: Factory, one vendor example run (a Slack clone), April 2026.

```text
One wide horizontal stacked bar on a white background, with three segments drawn to scale: "Orchestration 2.3% (0.38 h)" in navy #0F1B3D, "Implementation 60.5% (9.98 h)" in teal #2BB5A0, "Validation 37.2% (6.14 h)" in amber #F5A623. Labels printed directly on or above each segment, no legend. Chart title: "Validation took over a third of the clock". Small caption underneath: "One vendor example run: Slack clone, 185 runs, 6 milestones. Source: Factory, Apr 2026". Sans-serif type, generous spacing, readable at 1200 px wide.
```
