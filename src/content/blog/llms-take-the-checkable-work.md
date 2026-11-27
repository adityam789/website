---
title: "LLMs Will Take the Checkable Work: That Isn't All the Work"
excerpt: "A Riemann hypothesis headline started an argument with friends about whether AI replaces math and coding jobs. My notes from a podcast with Yann LeCun gave me a sharper answer: language you can check is getting automated fast. Intelligence that has to live in the physical world is a different problem."
date: "2026-11-27"
tag: "Tech"
cover: "/blog/llms-take-the-checkable-work/cover.png"
coverAlt: "A glowing amber checkmark stamped on a stack of teal code and proof tiles on the left; on the right, an open translucent 3D room with a small cube and a dotted path that the checkmark's light does not reach."
---

Last week a few friends and I got stuck on one headline. A mathematician said he had proved the Riemann hypothesis with an AI model, and a machine had checked the proof. The conversation went where these conversations always go. If AI can do that, what's left? Math jobs? Coding jobs? All jobs?

We landed somewhere I didn't expect. AI is going to take over **verifiable output in language**: proofs, code, anything where a checker can say yes or no. That's a lot of work, and it's growing. But that's what it is. It isn't human-like intelligence, and it doesn't replace everything a person does.

Around the same time I was filling a notepad while listening to Yann LeCun on [Unsupervised Learning with Jacob Effron](https://www.youtube.com/watch?v=ngBraLDqzdI), with my own thoughts in the margins. This post is those notes, cleaned up. Each section starts with what I wrote, then what I found when I checked it, then where I'm still unsure. The notes are the spine. The research is there to hold them up or push back.

## The week a proof got checked by a machine

The facts first, because they matter for everything after. On November 20, Levent Alpöge, a mathematician at Anthropic, posted a claimed proof of the Riemann hypothesis, [developed with Claude](https://www.science.org/content/article/ai-may-have-solved-math-s-greatest-mystery-can-humans-understand-answer). He didn't release the AI-written explanation, which he says runs past 250,000 pages. He did release about 17 million lines of [Lean](https://lean-lang.org/) code that formally verify the generalized version of the conjecture. The Lean Focused Research Organization and the Mathlib Initiative said they had [full confidence the proof is correct](https://www.sciencenews.org/article/riemann-hypothesis-solved-math-ai). Within hours, a separate group of mathematicians [put out a human-written proof](https://www.nature.com/articles/d41586-026-03835-0) of their own.

What strikes me isn't that a model was clever. It's *why anyone believed it*. Nobody read 250,000 pages. A proof checker read 17 million lines and said yes. The verifier made the result trustworthy, not the model.

> The model wrote the proof. The checker is why we believe it.

That's the pattern this post is about.

## Checkable work is where LLMs win

**From my notes:** *Math and coding are a substrate of reasoning (language itself is), not reasoning itself.*

I still like that line. Code and proofs are reasoning written down in a language strict enough to check. That strictness is exactly what makes them easy to automate. You can generate a thousand attempts and keep the ones that compile, pass the tests, or type-check in Lean.

That's also how the newest models got good at them. Reinforcement learning with verifiable rewards (RLVR) trains on problems where the answer can be [checked automatically](https://arxiv.org/abs/2504.13837): a matching final answer, a passing unit test. No human grader needed, so it scales.

```motion-checkability
```

I wrote about this from the engineering side in [Looks Good to the Model](/blog/looks-good-to-the-model): agents are trustworthy in proportion to how machine-checkable a task is. The Riemann week is the same idea at the top end of mathematics.

**From my notes:** *Augmented LLM with RLVR is a form of planning at the end of the day, but insufficient. It is a lot of work for sure, but it won't be zero-shot or the base model itself.*

The research mostly agrees, and is more specific than I was. A [NeurIPS 2025 oral](https://arxiv.org/abs/2504.13837) tested RLVR-trained models against their own base models across math, code and visual reasoning. With one try, the RL models win. With many tries, the *base* models solve more problems, and the range of problems the model can solve tends to shrink as RL training goes on. Their reading: RLVR makes a model better at finding paths it could already find. It doesn't teach new ones.

**Where I'd go further than my notes:** RLVR is close to useless for creative or truly open-ended work. It needs a checker, and creativity doesn't come with one. The evidence points the same way from the other side. Post-training tends to *narrow* what models produce: RLHF [reduces output diversity](https://arxiv.org/abs/2310.06452), and a NeurIPS 2025 study of 26,000 open-ended prompts found an ["Artificial Hivemind"](https://arxiv.org/abs/2510.22954), where models repeat themselves and different models converge on similar answers. Sharpening toward a reward is the opposite of exploring.

**Where I'm unsure:** the line keeps moving. A year ago, "is this proof of a famous conjecture right?" wasn't machine-checkable in practice. Now it is, because someone formalized enough of the math. The real question isn't "what can LLMs do?" It's "what can we build checkers for?"

## Hinton's brain math, and why I don't fully buy it

**From my notes:** *Geoffrey Hinton did some math on brain connections vs. machine "virtual neurons" for the same degree of learning (backprop or some form of gradient, though nobody knows clearly how neurons learn). The number was 10, and GPT-4 was close to it. But that rests on strong assumptions: the "10" and that backprop is the same style of learning as intelligence.*

Here's the argument as Hinton usually gives it. The biggest chatbots have [about a trillion connections](https://digital-scholarship.org/digitalkoans/?p=50226), the brain about 100 trillion, yet the chatbot knows far more than any one person. In an Oxford lecture he put it this way: even if you only use 10% of your 100 trillion weights, you have [10 trillion weights](https://analyticsindiamag.com/geoffrey-hinton-says-ai-is-very-close-to-being-as-good-as-human-brains/). His conclusion: backprop may be a better learning algorithm than whatever the brain does.

My margin note still stands. That math assumes the 10% figure, that one synapse is worth one parameter, and that the brain learns anything like backprop. We don't know how the brain learns. Biological synapses also keep changing while you think, while LLM weights are frozen when you use them.

What convinced me the arithmetic can't settle this: LeCun runs almost the same numbers and lands somewhere else. A house cat has about [800 million neurons, times roughly 2,000 synapses each](https://languagelog.ldc.upenn.edu/nll/?p=62581), which puts the biggest LLMs at about cat size. His question is the opposite one: if they're the size of a cat, why aren't they as smart as one? A cat can plan, remember and handle the physical world.

Same arithmetic, opposite conclusions. That tells me parameter counts are the wrong unit for intelligence.

## Language is a thin slice of the world

**From my notes:** *High-dimensional, noisy, continuous, messy: that's what the real world is. An LLM is language, which can't play in the physical world.*

**From my notes:** *The doctor example: an LLM can't replace healthcare because it only gets the book language, never the practical experience.*

The cleanest version of this is LeCun's driving comparison. A teenager can learn to drive in [about 20 hours](https://ai.meta.com/blog/yann-lecun-advances-in-ai-research/), while self-driving systems need millions of labeled examples or reinforcement-learning trials and still aren't as reliable. I wrote about that data hunger from the inside in my [diffusion planning post](/blog/left-right-or-straight-into-the-wall). Even the best planners there are copying human driving, not understanding roads.

**From my notes:** *We're running out of open text data, so what's left is commercial data or synthetic data.*

This one is well supported. Epoch AI estimates the usable stock of public human text at [around 300 trillion tokens](https://epoch.ai/blog/will-we-run-out-of-data), and projects it gets used up [sometime between 2026 and 2032](https://fortune.com/2024/06/06/ai-training-bottleneck-google-meta-openai/). We're inside that window now.

**From my notes:** *Most robotics is data-intensive and becomes imitation learning or RL, but data collection is expensive and it's brittle in new scenarios. Synthetic data isn't the end goal either. It works in RL and simulation but stays data-inefficient. Scale vs. data-efficient architecture. Even imitation hasn't produced personal or industrial robots at scale.*

I'd sum my notes up as: text ran out, and the physical world doesn't come pre-written. A kid takes in an enormous amount of sight and touch before ever reading a word. None of it arrives as tokens.

## What would a "world model" even be?

**From my notes:** *Train a deep network on data from a complex system to make a phenomenological model of that process. If it's action-conditioned, it's a world model (optimally).*

I like this definition because it's testable: given the state and an action, predict what happens next. My notes then listed what a world model buys you:

1. An agent can **predict the consequences of its actions**.
2. That enables **planning, reasoning, searching and optimization**, and none of it has to be autoregressive.
3. The hard part is **choosing the level of abstraction** to plan at. You plan a trip in cities, not in footsteps.

**From my notes:** *Objective-driven models are the future: a good cost function and an efficient optimizer. The catch: the cost function has to be accurate, and you also need better auxiliary objectives to aid the final goal.*

This is LeCun's ["objective-driven AI"](https://openreview.net/pdf?id=BZ5a1r-kVsf) proposal: instead of producing the next token, the system searches for actions that minimize a cost according to its world model. My catch is the honest weak spot. A planner is only as good as its cost function, and nobody has a general one for "do what a sensible person would do." In my diffusion post, the planners leaned on a learned scorer for exactly this reason.

**Still open for me:** *What is a hierarchical world model?* LeCun's answer is stacked predictors, each at a coarser timescale, so the top plans in big steps and the bottom fills in motor detail. I want to read that part of his paper properly before I say more.

## Three bets on how to build one

My notes compared a few approaches. The research made them clearer, so here they are side by side. Each deserves its own post.

**Bet 1: Predict in representation space (JEPA).** **From my notes:** *JEPA learns representations of images and video rather than generating pixels like VAEs, autoencoders, denoising autoencoders, or even LLMs.* The idea: don't predict every pixel of the next frame. Encode the scene, then predict the *encoding* of what comes next, so the model can ignore detail that's unpredictable anyway, like leaves moving in the wind. The strongest evidence so far is [V-JEPA 2](https://arxiv.org/abs/2506.09985). It learned from over a million hours of internet video, then got a small action-conditioned predictor trained on 62 hours of unlabeled robot video. It ran zero-shot on robot arms in two different labs, planning pick-and-place toward image goals.

```motion-pixels-vs-latents
```

**Bet 2: Spatial intelligence (Fei-Fei Li).** Fei-Fei Li's [World Labs](https://www.worldlabs.ai/about) argues the missing piece is space: AI that can perceive, reason about and act in 3D. Their first product, Marble, builds [persistent, editable 3D worlds](https://www.deeplearning.ai/the-batch/world-labs-makes-its-marble-generative-world-model-public-adds-chisel-editing-tool) from text, images or video, which you can export and reuse. To be fair, Marble *is* generative. What sets it apart is that it outputs a consistent 3D world rather than a stream of frames. That's a different bet from JEPA, but it shares the instinct that structure matters more than pixels.

**Bet 3: Vision-language-action models and pixel generators, and why I'm skeptical.** VLAs bolt actions onto a vision-language model. Video generators learn by predicting the next frame. Both look impressive in demos. The research is less kind:

- [LIBERO-PRO](https://arxiv.org/abs/2510.03827) took VLA models scoring over 90% on a standard robot benchmark, changed objects, starting positions and instructions in reasonable ways, and watched performance **collapse to 0%**. Models kept grasping even when the target object was replaced with something irrelevant.
- [LIBERO-Plus](https://arxiv.org/abs/2510.13626) found most VLAs are brittle to camera and robot-state changes, and that **almost all of them ignore the language instruction**.
- On the video side, Google DeepMind's [Physics-IQ](https://arxiv.org/abs/2501.09038) tested Sora, Runway, Pika and others on real physics experiments. Physical understanding was severely limited and **unrelated to how realistic the video looked**.
- An [ICML 2025 study](https://arxiv.org/abs/2411.02385) trained video diffusion models on simple physics. They were perfect in-distribution but failed out of distribution, copying the closest training example instead of learning the law. They matched on color before size, velocity or shape. Their conclusion: scaling alone isn't enough.

That's what my note meant by pixel-by-pixel models being "trapped." Looking right and being right are different targets, and these models are trained on the first.

## The collapse problem, in one picture

**From my notes:** *What is representation collapse? Contrastive learning is one approach. Distillation is another: one encoder teaches the other (DINO), backprop on one and feed the other an exponential moving average, like a collection recipe. BYOL paper from DeepMind to read. Fun bit: I don't know how that teacher works or how distillation prevents collapse. Another pivot is a custom regularization to maximize information content and prevent collapse. Problem is measure? Need to see SigReg.*

Collapse is the cheap trick every joint-embedding model is tempted by. If the goal is "make the two views of a scene agree," the easiest way to win is to map *everything* to the same point. Perfect agreement, zero information.

```motion-representation-collapse
```

The fixes in my notes, in order:

- **Contrastive:** pull matching pairs together and push other examples apart. It works, but needs many negatives.
- **Distillation with a slow teacher:** [BYOL](https://arxiv.org/abs/2006.07733) and [DINO](https://arxiv.org/abs/2104.14294) train one network and update the teacher as a moving average of it. No negatives at all. My "I don't know why this works" is in good company: BYOL's authors mostly showed *that* it avoids collapse, and follow-up papers still call it surprising.
- **Regularize the statistics directly:** [VICReg](https://arxiv.org/abs/2105.04906) keeps each embedding dimension's variance up and decorrelates dimensions.
- **SIGReg:** my "problem is measure?" question has an answer now. [LeJEPA](https://arxiv.org/abs/2511.08544) (Balestriero and LeCun, Nov 2025) argues the ideal embedding distribution is an isotropic Gaussian and adds a regularizer that pushes embeddings toward it, replacing the pile of tricks with one term. Its training loss also tracks downstream accuracy, so you can tell a run is healthy without a separate probe.

This deserves a full post with the math. For now, the picture is enough.

## Who owns the platform

**From my notes:** *Anthropic and OpenAI ↔ Sun Microsystems and HP-UX. Eventually an open platform will take over, like Linux.*

**From my notes:** *An open-source, fine-tunable, wide model is the AI assistant: platformable (sovereignty), in a federated learning style, kind of a sum of parameter vectors into a global converged model.*

This is LeCun's argument almost word for word. In the late '90s, running an internet service meant buying [proprietary hardware and operating systems from Sun, Dell and HP](https://techstrong.ai/articles/for-most-of-the-world-open-source-ai-is-the-only-way-forward/), and Linux wiped that model out. He expects AI to become a platform, and platforms [tend to become open-source](https://www.technologyreview.com/2026/01/22/1131661/yann-lecuns-new-venture-ami-labs/amp/). My "sum of parameter vectors" is basically [federated averaging](https://arxiv.org/abs/1602.05629): train locally, average the weights into a shared model. That's how countries could contribute to a common model without handing over their data.

**From my notes:** *LLMs won't be apolitical at all, and they're being sold with commercial intent.* Also: *language, speech and value systems (or political ones) are hard to capture in their diversity, at least in current models, because the data lacks that diversity.*

**The other side, fairly:** LeCun isn't neutral. His startup AMI Labs [raised about $1 billion](https://thenextweb.com/news/yann-lecun-xai-failure-ai-bubble-explosion) on the bet that LLMs are a dead end. Closed labs argue the most capable models shouldn't be released openly for safety reasons, and that frontier training costs mean only a few groups can build them either way. And Linux won on servers but not everywhere: phones and desktops still run plenty of closed software. I lean toward open, but "Linux wins" is a hope, not a law.

## Where I land, for now

My thesis is the one my friends and I reached, sharpened:

- **LLMs will take over verifiable work in language.** Code that has to pass tests, proofs that have to type-check, queries that have to return the right rows. That's a big share of what software engineers and some mathematicians do, and it grows every time someone builds a new checker.
- **That's the boundary, not the whole map.** The physical world, open-ended creativity, and judgment without a checker aren't solved by more RLVR on more text. The evidence on VLAs and video models says scaling the current recipe doesn't get there either.
- **What changes for engineers** is where the value sits: deciding what to build, designing the verifiers, and judging what can't be verified. Which is the same conclusion my agentic-coding posts keep reaching.

I could be wrong about the timeline. I don't think I'm wrong about the shape.

## Questions I'm taking with me

These are the threads I want to pull next, and most will become posts:

- **Representation collapse, visually and with the math:** contrastive vs. BYOL/DINO vs. VICReg vs. SIGReg, and why the moving-average teacher works at all.
- **JEPA vs. generative world models:** a proper side by side, tied back to driving planners.
- **The case against VLAs and pixel generators:** a deeper read of LIBERO-PRO, LIBERO-Plus, Physics-IQ and the physical-law study.
- **Spatial intelligence:** what World Labs means by it, and how it differs from JEPA.
- **What RLVR can and can't teach:** pass@k, verifiers, and why creative tasks don't fit.
- **The brain-math argument:** every assumption hiding in "parameters vs. synapses."
- **Open platforms and AI sovereignty:** the Linux analogy, federated training, and who controls the stack.

## Further reading

The podcast that started the notes: [Yann LeCun on What Comes After LLMs](https://www.youtube.com/watch?v=ngBraLDqzdI), Unsupervised Learning with Jacob Effron (May 2026).

My reading list, roughly in the order I plan to read it:

- LeCun, [A Path Towards Autonomous Machine Intelligence](https://openreview.net/pdf?id=BZ5a1r-kVsf) (2022): objective-driven AI, hierarchical JEPA
- Assran et al., [I-JEPA: Self-Supervised Learning from Images with a Joint-Embedding Predictive Architecture](https://arxiv.org/abs/2301.08243) (CVPR 2023)
- Assran et al., [V-JEPA 2: Self-Supervised Video Models Enable Understanding, Prediction and Planning](https://arxiv.org/abs/2506.09985) (2025)
- Grill et al., [Bootstrap Your Own Latent (BYOL)](https://arxiv.org/abs/2006.07733) (NeurIPS 2020)
- Caron et al., [Emerging Properties in Self-Supervised Vision Transformers (DINO)](https://arxiv.org/abs/2104.14294) (ICCV 2021)
- Bardes, Ponce and LeCun, [VICReg](https://arxiv.org/abs/2105.04906) (ICLR 2022)
- Balestriero and LeCun, [LeJEPA: Provable and Scalable Self-Supervised Learning Without the Heuristics](https://arxiv.org/abs/2511.08544) (2025)
- Yue et al., [Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model?](https://arxiv.org/abs/2504.13837) (NeurIPS 2025)
- Jiang et al., [Artificial Hivemind: The Open-Ended Homogeneity of Language Models](https://arxiv.org/abs/2510.22954) (NeurIPS 2025)
- Zhou et al., [LIBERO-PRO](https://arxiv.org/abs/2510.03827) and Fei et al., [LIBERO-Plus](https://arxiv.org/abs/2510.13626) (2025)
- Motamed et al., [Do Generative Video Models Understand Physical Principles?](https://arxiv.org/abs/2501.09038) (WACV 2026)
- Kang et al., [How Far Is Video Generation from World Model: A Physical Law Perspective](https://arxiv.org/abs/2411.02385) (ICML 2025)
- Villalobos et al., [Will We Run Out of Data?](https://epoch.ai/blog/will-we-run-out-of-data) (Epoch AI, 2024)
- McMahan et al., [Communication-Efficient Learning of Deep Networks from Decentralized Data](https://arxiv.org/abs/1602.05629) (federated averaging, 2017)
