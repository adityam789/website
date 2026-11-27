# Post idea: World models, three bets (JEPA vs. spatial 3D vs. VLAs and pixel generators)

Status: BACKLOG (added 2026-11-27). Spun out of `llms-take-the-checkable-work` (section "Three bets on how to build one"), where each bet got one paragraph. Aditya wants the deep dive here, including the research showing VLAs and pixel-by-pixel generators fall short. Connect back to `left-right-or-straight-into-the-wall` (diffusion driving planners imitate; world models predict consequences).

Tags: [A] Aditya's idea or claim. [R] researched, source linked. [+] angle I'm suggesting, not yet Aditya's. [?] verify before publishing. [!] correction.

## Title and thesis

Working title: Looking right vs. being right: three bets on world models
Alternates:
- Predict pixels, predict embeddings, or build the room?
- What a world model has to do, and which approaches actually do it

Thesis [A]: language can't play in the physical world, and pixel-by-pixel generation is "slightly trapped": it optimizes for looking right. World models that predict consequences in a structured space (embeddings or 3D) are the more promising path. [+] Frame it as a scorecard against one definition, not a fan post.

## Starting point from Aditya's notes [A]

- World model definition: train a deep network on data from a complex system to build a phenomenological model of the process; if it's action-conditioned, it's a world model (optimally).
- What it buys: (1) an agent predicts the consequences of its actions, (2) that allows planning, reasoning, searching, optimization (need not be autoregressive), (3) the hard part is what level of abstraction to plan at.
- "JEPA is a bet for world-model degree of intelligence (thinking, at least)."
- "JEPA learns representations of image and video rather than pixel generation via VAE, AE, denoising AE, or even LLMs."
- "Generative models for the most part will fall short in image and video."
- "JEPA & world model vs. (3D spatial, VLA, generative): supposedly not working." [!] 3D spatial (Fei-Fei Li) shouldn't be lumped with "not working". Aditya wants to name-drop it as a promising alternative to VLAs. Treat it as its own bet.
- Open question: "What are hierarchical world models? On image and video for action-conditioned use cases."

## Outline (talking points, add your voice)

### 1. One definition, one test [A]
- Use Aditya's definition. Test each approach on: does it predict consequences of actions? Can you plan with it? Does it generalize out of distribution?

### 2. Bet 1: JEPA, predict in representation space [R]
- Predict the encoding of the future, not the pixels; ignore what's unpredictable.
- V-JEPA 2: 1M+ hours of internet video, then an action-conditioned predictor (V-JEPA 2-AC) trained on <62 hours of unlabeled robot video; zero-shot pick-and-place on Franka arms in two labs, planning toward image goals. https://arxiv.org/abs/2506.09985
- [?] Follow-ups to check: RoboJEPA (scaling action-conditioned predictors on multi-embodiment data) https://arxiv.org/abs/2610.10515
- Hierarchical JEPA: LeCun's position paper, stacked predictors at coarser timescales. https://openreview.net/pdf?id=BZ5a1r-kVsf [?] read section before writing.
- Animation: reuse `motion-pixels-vs-latents`; add a planning step (try 3 actions, compare predicted embeddings to goal).

### 3. Bet 2: spatial intelligence (Fei-Fei Li / World Labs) [A] + [R]
- World Labs: perceive, generate, reason and interact with 3D worlds. https://www.worldlabs.ai/about
- Marble (Nov 2025): persistent, editable, exportable 3D worlds from text, images, video; Chisel editor separates structure from style. https://www.deeplearning.ai/the-batch/world-labs-makes-its-marble-generative-world-model-public-adds-chisel-editing-tool
- RTFM: their real-time model that generates as you navigate. [?] get primary source.
- [!] Honest nuance: Marble is generative. The bet is structure (explicit 3D) over frame streams, not "non-generative". Compare with JEPA on that axis.
- [?] Is there published evidence of Marble-style worlds used for robot or agent planning? Find before claiming.

### 4. Bet 3: VLAs and pixel generators, and the evidence against [A] + [R]
- LIBERO-PRO: VLAs at >90% on LIBERO collapse to 0% under reasonable perturbations (objects, initial states, instructions, environments); keep grasping when the target is replaced. https://arxiv.org/abs/2510.03827
- LIBERO-Plus: brittle to camera and robot-state changes; almost all models ignore language instructions; some just replay memorized trajectories. https://arxiv.org/abs/2510.13626
- Physics-IQ (Google DeepMind): Sora, Runway, Pika, Lumiere, SVD, VideoPoet; physical understanding severely limited and unrelated to visual realism. https://arxiv.org/abs/2501.09038 ; note the audit "Physics-IQ Verified" https://arxiv.org/abs/2606.18943 [?] read what it changes.
- Kang et al. (ICML 2025): video diffusion trained on simple physics, perfect in-distribution, fails OOD, "case-based" generalization, prioritizes color > size > velocity > shape; scaling alone insufficient. https://arxiv.org/abs/2411.02385
- [+] Steelman: VLAs are improving fast and are the most deployed approach; say what would change your mind.

### 5. Tie back to driving [+]
- DiffusionDrive and friends imitate trajectories; they don't predict consequences. A world-model planner would roll candidate actions forward and score outcomes. Ties to the "objective-driven" section of the checkable-work post.

### 6. Scorecard + where I land [A]
- Table: approach × predicts consequences × plannable × OOD evidence × data cost.

## Visuals plan
- Scorecard table with pills (PostBody already pills Solid/Early/Low cells).
- Extend `PixelsVsLatents` with a planning phase.
- New: "perturb the scene" animation (object swapped, robot keeps reaching for the old spot) to illustrate LIBERO-PRO.

## Reading list for this post
LeCun 2022 position paper, I-JEPA, V-JEPA 2, World Labs Marble announcement, LIBERO-PRO, LIBERO-Plus, Physics-IQ (+ Verified), Kang et al. 2025.
