---
title: "Where Decision Models Earn Their Place"
excerpt: "Part 3 of 3 on decision models. Routing, triage, rating, guardrails, many small questions and now images. Six places they fit, and the cases where a general LLM is still the right call."
date: "2026-11-14"
tag: "Tech"
draft: true
---

## A simple test

After [what they are](/blog/decision-models-1-still-a-language-model) and [how to trust them](/blog/decision-models-2-zero-shot-is-a-demo), the practical question: where should you actually use one?

My test has three parts. The answer space is closed. The call repeats at volume. And a wrong answer is either cheap or caught by something downstream. When all three hold, a decision model is probably the right tool. Here are six places they do.

## 1. Routing between models

This is the one that convinced me. If you run a family of models, something has to decide which one handles each request, and that decision has to be much cheaper than the work it is routing.

The research is solid and predates decision models. RouteLLM, published at ICLR 2025, trained routers that choose between a strong and a weak model and [cut costs by more than two times without sacrificing response quality](https://proceedings.iclr.cc/paper_files/paper/2025/hash/5503a7c69d48a2f86fc00b3dc09de686-Abstract-Conference.html). Its routers included BERT-style and causal-LLM classifiers, which is the same job a decision model does.

It also fits inside a single task. When an agent works through a problem in steps, each step can be scored for difficulty and sent to a model that matches.

## 2. Classification and triage

The plain use case, and the most common. Which team gets this ticket, is this security event suspicious, [are these two customer records the same person](https://www.wwt.com/blog/the-rise-of-decision-models).

The pattern that pays is triage: [let the decision model filter and send only the hard cases to the expensive model](https://www.dsebastien.net/decision-models-dms/). You don't need it to be right about everything. You need it to be confidently right about the easy majority.

## 3. Rating

The score type puts something on a scale: quality from 1 to 5, urgency from 1 to 10, how closely an answer follows a rubric.

A caution from part two applies here. Subjective rubrics were [one of the weaker areas in independent testing](https://hamzaboughanim.com/blog/jev-system-one-model-typed-decisions-calibrated-probabilities). A score is only as good as the rubric is concrete. "Is the tone professional" is harder than "does the reply include an order number".

## 4. Guardrails

Before an agent acts, ask a fast model whether it should. The open models name this use themselves: [grounding checks, safety classification and policy classification](https://github.com/strands-labs/strands-decider), and for agents, the [safety and reversibility of a proposed shell, file or API action](https://huggingface.co/lostargon/Tiny-Jev-1.7B).

Speed is the point. A guardrail that takes two seconds gets switched off. One that answers in a fraction of that can run on every step.

## 5. Many small questions at once

This is the pattern I find most interesting, because it changes how you design the system. Because questions are answered in parallel over the same input, you can ask ten narrow yes/no questions instead of one broad one, then [combine the answers in code, or feed them as features to a small classical model trained on your own labels](https://www.dsebastien.net/decision-models-dms/).

Narrow questions are easier to evaluate, easier to explain to an auditor, and easier to fix one at a time. Google's endpoint is reported to answer [up to 1,000 questions in one pass](https://www.eesel.ai/blog/gemini-decisions-api).

## 6. Images, audio and video

When I first sketched this post I had multimodal down as "not here yet". It arrived while I was writing. Google's Gemini Decisions API, launched on 11 November, [takes images, audio, video and PDFs](https://www.eesel.ai/blog/gemini-decisions-api), and an open decider from Perplexity is listed as [accepting text and images](https://www.eesel.ai/blog/decision-models).

This matters because so much of vision work is a closed question. Does this photo show damage. Is this a known visitor or an unknown one. Is the part good or bad. Sending every frame to a general multimodal model to get one word back was always wasteful.

It is also the newest part of a new field, so the caution from part two applies double. Test it on your own images before you trust it.

## Where I wouldn't use one

- **Open-ended answers.** If the right response isn't on a list, a decision model will pick the closest wrong one.
- **Anything that needs a reason.** You get a number. If a customer or a regulator needs the why, you need another component to supply it.
- **High-stakes calls you haven't evaluated.** Fast and unmeasured is the dangerous combination.
- **Label sets that keep changing.** Every change to the options is a change to the thing you validated.

## Matching the tool to the stakes

| Use | Cost of a wrong answer | How I'd start |
| --- | --- | --- |
| Model routing | A slower or pricier response | Zero-shot, then tune the threshold |
| Ticket triage | A ticket lands in the wrong queue | Zero-shot with a fallback queue |
| Rubric scoring | A skewed quality metric | Fit on a labelled sample first |
| Agent guardrails | An unsafe action runs | Fit first, and fail closed |
| Fraud or compliance signals | Money, customers, regulators | Fit, validate, keep a person in the loop |
| Image checks | Depends on the use | Evaluate on your own images first |

## The series in three lines

A decision model is a language model that answers instead of writing. Out of the box it is a strong, cheap first guess. It becomes something you can build on when you have measured it on your own data and decided, in advance, what happens when it isn't sure.

Not everything needs a general-purpose model. That was always true. We now have a sensible tool for the part that doesn't.

### Sources

- Routing and small models: [RouteLLM, ICLR 2025](https://proceedings.iclr.cc/paper_files/paper/2025/hash/5503a7c69d48a2f86fc00b3dc09de686-Abstract-Conference.html) · [Belcak et al., Small Language Models are the Future of Agentic AI](https://arxiv.org/abs/2506.02153)
- Use patterns: [WWT, The Rise of Decision Models](https://www.wwt.com/blog/the-rise-of-decision-models) · [dsebastien, Decision Models](https://www.dsebastien.net/decision-models-dms/)
- Guardrails: [Strands Decider repository](https://github.com/strands-labs/strands-decider) · [Tiny-Jev model card](https://huggingface.co/lostargon/Tiny-Jev-1.7B)
- Multimodal: [eesel, Gemini Decisions API](https://www.eesel.ai/blog/gemini-decisions-api) · [eesel, Decision models explained](https://www.eesel.ai/blog/decision-models)
- Limits: [Hamza Boughanim, Jev and the System One model](https://hamzaboughanim.com/blog/jev-system-one-model-typed-decisions-calibrated-probabilities)
