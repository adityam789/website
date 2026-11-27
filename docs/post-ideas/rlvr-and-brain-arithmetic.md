# Post idea: What scale can't buy (RLVR limits + the brain-vs-parameters arithmetic)

Status: BACKLOG (added 2026-11-27). Merges two spin-offs from `llms-take-the-checkable-work`: "What RLVR can and can't teach" and "The cat-brain arithmetic". Both are versions of the same argument: "more is enough" (more parameters, more RL on checkable rewards), and both hide assumptions.

Tags: [A] Aditya's idea or claim. [R] researched, source linked. [+] angle I'm suggesting, not yet Aditya's. [?] verify before publishing. [!] correction.

## Title and thesis

Working title: More isn't the same as smarter
Alternates:
- Two "just scale it" arguments and the assumptions inside them
- Parameters, synapses and verifiable rewards: what the numbers don't say

Thesis [A]: RLVR is great where there's a checker and close to useless for creative or truly intelligent (animal/human) tasks; and brain-vs-parameter comparisons rest on strong assumptions (the "10%", and that backprop is the same style of learning). [+] Unifying frame: both arguments measure the wrong unit. Params aren't intelligence; pass@1 isn't capability.

## Starting point from Aditya's notes [A]

- "Hinton did some math on brain neuron count to machine 'virtual' neuron proportion for the same degree of learning (backprop-like or some form of gradient, but not exactly, because it's not clear how neurons learn in the brain). It was 10. [Bracketed: 1.6 billion neurons became that math, which GPT-4 was close to.] But again, a few strong assumptions: '10' and that backprop is the same style of learning intelligence."
- [?] "1.6 billion neurons" doesn't match any public Hinton figure found so far. Re-listen to the podcast segment and pin the exact numbers before using them. https://www.youtube.com/watch?v=ngBraLDqzdI
- "Math and coding is a substrate of reasoning (language itself is), not reasoning itself."
- "Augmented LLM with RLVR is a form of planning at the end of the day, but insufficient. It is a lot of work for sure, but won't be zero-shot or the base model itself."
- From chat: "I personally agree with RLVR being trash when used for creative tasks or truly intelligent animal/human tasks." [!] Keep the conviction, soften "trash" in the post to something defensible.

## Outline (talking points, add your voice)

### Part 1: the brain arithmetic

#### 1. Hinton's version [R]
- ~1T connections in big chatbots vs ~100T in the brain, yet the chatbot knows far more; suggests backprop is a better way to get knowledge into connections. https://digital-scholarship.org/digitalkoans/?p=50226
- Oxford lecture: "even if you use 10% of that, you have 10 trillion weights". https://analyticsindiamag.com/geoffrey-hinton-says-ai-is-very-close-to-being-as-good-as-human-brains/
- He no longer believes making AI more brain-like makes it better. https://cbmm.mit.edu/video/cbmm10-panel-research-intelligence-age-ai [?] get timestamp.

#### 2. LeCun's version, same arithmetic, opposite conclusion [R]
- House cat: ~800M neurons × ~2,000 synapses ≈ size of the biggest LLMs; so why aren't they as smart as a cat? https://languagelog.ldc.upenn.edu/nll/?p=62581

#### 3. The hidden assumptions [A] + [+]
- 1 synapse = 1 parameter? Synapses keep changing during use; LLM weights are frozen at inference.
- "10% used" is a guess.
- Backprop isn't biologically plausible as-is; we don't know the brain's learning rule.
- Knowledge ≠ intelligence: knowing more facts vs. planning in the physical world (the cat).
- [+] Animation: a slider for each assumption, watch the "brain/LLM ratio" swing by orders of magnitude.

### Part 2: what RLVR can and can't teach

#### 4. Why math and code moved first [A] + [R]
- Verifiable rewards (answer match, unit tests) need no human grader, so they scale. https://arxiv.org/abs/2504.13837
- Riemann hypothesis (Nov 2026) as the extreme case: trust came from 17M lines of Lean, not from reading the proof. Science: https://www.science.org/content/article/ai-may-have-solved-math-s-greatest-mystery-can-humans-understand-answer ; Nature: https://www.nature.com/articles/d41586-026-03835-0 [?] check status of verification and the rival human proof before publishing; it's a fast-moving story.

#### 5. The ceiling [R]
- Yue et al. (NeurIPS 2025 oral): RLVR wins at pass@1, base models win at large-k pass@k; reasoning paths of RLVR models already exist in the base model; coverage narrows as RL training goes on; distillation can add new patterns. https://arxiv.org/abs/2504.13837
- [+] Animation: search tree of base vs. RLVR model; RLVR prunes to the rewarded branches, loses rare correct ones.

#### 6. Why creative work doesn't fit [A] + [R]
- No checker → no verifiable reward.
- Post-training narrows outputs: RLHF reduces diversity vs SFT (Kirk et al., ICLR 2024) https://arxiv.org/abs/2310.06452 ; Artificial Hivemind, 26K open-ended prompts, intra- and inter-model homogeneity (NeurIPS 2025) https://arxiv.org/abs/2510.22954
- Diversity collapse persists even with diversity-preserving post-training (ICML 2026). https://icml.cc/virtual/2026/68538 [?] read full paper.
- [+] Steelman: diversity-aware RL objectives can improve both quality and variety. https://arxiv.org/html/2509.02534v1 [?] read.

### 7. Where I land [A]
- Scale and RLVR are real progress inside checkable language. Neither argument says anything about the cat, the 17-year-old driver, or the novel.

## Visuals plan
- Assumption-slider animation for the brain ratio.
- Base vs. RLVR search-tree animation (pass@1 vs. pass@k).
- Reuse `motion-checkability` as a callback.

## Reading list for this post
Yue et al. 2025; Kirk et al. 2024; Jiang et al. 2025 (Hivemind); Hinton Oxford lecture + 60 Minutes interview; LeCun cat-brain remarks (World Government Summit 2024); the LeCun podcast.
