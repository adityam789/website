# Post idea: Representation collapse, visually (contrastive vs. BYOL/DINO vs. VICReg vs. SIGReg)

Status: BACKLOG (added 2026-11-27). Spun out of `llms-take-the-checkable-work` (section "The collapse problem, in one picture"), which already ships a 3-phase animation (`motion-representation-collapse`). This post is the full version with the math.

Tags: [A] Aditya's idea or claim. [R] researched, source linked. [+] angle I'm suggesting, not yet Aditya's. [?] verify before publishing. [!] correction.

## Title and thesis

Working title: The cheapest way to agree is to say nothing
Alternates:
- Representation collapse, explained with dots
- Four ways to stop a model from mapping everything to one point

Thesis [+]: every joint-embedding method has the same failure mode (agree by collapsing) and the history of self-supervised learning is a sequence of increasingly principled ways to block it. SIGReg is the first that replaces the bag of tricks with one measurable target.

## Starting point from Aditya's notes [A]

- "What is representation collapse?"
- "Contrastive learning is an approach."
- "Another approach is distillation, where one encoder teaches the other (DINO). Backprop on one encoder, and it teaches the untrained one via an exponential-moving-average-like technique, like a collection recipe."
- "BYOL paper from DeepMind to read."
- "Fun bit: I don't know how that teacher works or how distillation prevents collapse." Keep this honest admission in the post; it's the hook.
- "Another pivot is a custom regularization to maximize information content and prevent collapse. Problem is measure?"
- "Need to see SigReg."

## Outline (talking points, add your voice)

### 1. The trap [+]
- Objective: two views of one image should have matching embeddings.
- Constant output satisfies that perfectly. Complete collapse vs. dimensional collapse (everything squeezed into a low-dimensional subspace). [R] LeJEPA intro names both: https://arxiv.org/abs/2511.08544
- Animation: reuse `RepresentationCollapse`, extend to 4 phases.

### 2. Contrastive: push negatives away [R]
- SimCLR / MoCo idea: pull positives together, push other images apart.
- Cost: needs lots of negatives, so big batches or memory banks. [R] BYOL paper motivates itself with this: https://arxiv.org/abs/2006.07733
- [+] Animation idea: batch-size slider, collapse creeps back as negatives shrink.

### 3. Distillation with a slow teacher (BYOL, DINO) [R]
- Online network + target network; target is a slow-moving average of the online one. BYOL reports that this suffices to avoid collapse without negatives. https://arxiv.org/abs/2006.07733
- BYOL also notes a fixed random target avoids collapse but gives poor representations. Good teaching moment: "not collapsing" ≠ "learning something useful".
- DINO: same family, self-distillation with ViTs. https://arxiv.org/abs/2104.14294
- Aditya's "IDK why": follow-up work still calls it surprising, e.g. RAFT reframes BYOL as "run away from your teacher". https://arxiv.org/abs/2011.10944 [?] read before quoting.
- [+] Explain intuitively: predictor + stop-gradient + slow target = the target moves too slowly to chase the collapse.

### 4. Regularize the statistics (VICReg) [R]
- Variance term keeps each dimension alive; covariance term decorrelates dimensions. https://arxiv.org/abs/2105.04906
- [+] Animation: per-dimension variance bars dropping to zero vs. held up.

### 5. SIGReg / LeJEPA: one target distribution [R]
- Claim: the isotropic Gaussian is the optimal embedding distribution for downstream prediction risk; SIGReg pushes embeddings toward it. https://arxiv.org/abs/2511.08544
- Removes the heuristics (no EMA teacher, no stop-grad tricks), linear time and memory in dimension and sample size.
- Answers "problem is measure?": training loss tracks downstream linear-probe accuracy, so you can tell if a run is healthy without labels. [R] same paper, Fig. 1.
- "Sketched" = it tests many random 1-D projections against a Gaussian instead of the full high-dimensional distribution. [?] confirm the exact test statistic before explaining.
- Code is ~50 lines: https://github.com/rbalestr-lab/lejepa [+] embed a short snippet.

### 6. Takeaway as an engineer [+]
- Same lesson as the diffusion post's mode collapse: if a cheap degenerate solution satisfies your objective, the optimizer will find it. Guardrails belong in the objective, not in hope.

## Visuals plan
- Extend `motion-representation-collapse` to 4 phases (add BYOL/EMA and VICReg).
- New: variance-bars animation for VICReg.
- New: "random projections vs. a Gaussian" animation for SIGReg.

## Reading list for this post
BYOL (2020), DINO (2021), VICReg (2022), I-JEPA (2023), LeJEPA (2025), RAFT (2020).
