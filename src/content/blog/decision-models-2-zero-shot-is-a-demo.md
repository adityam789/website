---
title: "Zero-Shot Is a Demo: Calibrated on Your Data Is a Product"
excerpt: "Part 2 of 3 on decision models. They are fast, cheap and good out of the box. In payments or any regulated setting, that isn't the bar. On calibration, fitting, and a ladder for adopting them without betting the business."
date: "2026-11-14"
tag: "Tech"
cover: "/blog/decision-models-2-zero-shot-is-a-demo/cover.png"
coverAlt: "A glass balance scale with a glowing amber sphere in one pan and a stack of checked tiles in the other, in front of a dial whose needle sits just off centre."
draft: true
---

## The pitch, and the question it skips

The pitch for decision models is that you drop one in. No training data, no prompt wrangling, a probability for every answer. [Part one](/blog/decision-models-1-still-a-language-model) covered why that works: the body is a pretrained language model, so it understands your input without seeing your data.

Here is the question the pitch skips. What happens when it is wrong and software acts on the answer?

In a chat window, a wrong answer is a bad paragraph. In payments, as in lending, healthcare or anything else that is regulated, a wrong decision is a blocked customer, a missed fraud case or a finding from an auditor. So my view is simple, and a little unfashionable: zero-shot is how you evaluate a decision model. It is not how you ship one.

## A good probability is not a portable one

Decision models are sold on calibration: when the model says 0.8, it should be right about 80% of the time. The early evidence on Jev is encouraging. One explainer reports an expected calibration error of [about 6 points on a prompt-injection benchmark](https://victordibia.com/explainers/jev/).

The catch is where that was measured. Calibration is a property of the model *and* the data it runs on. As one early critique put it, [the same model can be calibrated on one dataset and not on another](https://www.alexmolas.com/2026/09/23/jev-cant-be-calibrated.html), and the vendor never sees yours. Policies change, customers change, fraud patterns change, and [probabilities that were reliable last month quietly stop being reliable](https://anthonymaio.substack.com/p/jev-the-language-model-that-wont).

Independent testing points the same way. One summary of an outside benchmark found weaker results on [fine-grained label sets, noisy labels, subjective rubrics and low-resource languages](https://hamzaboughanim.com/blog/jev-system-one-model-typed-decisions-calibrated-probabilities), and noted that yes/no outputs sometimes needed threshold tuning. There is also a full academic evaluation on [18 social-science annotation tasks](https://arxiv.org/pdf/2609.24574), set against fine-tuned and frontier baselines, which is worth reading in the original before trusting anyone's summary, mine included.

Fine-grained labels and subjective rubrics are a fair description of most real business decisions.

## Calibrated and useless is possible

There is a second trap. A model can be perfectly calibrated and still not help you.

Suppose you only act automatically when confidence is 0.90 or higher. One worked example shows how much traffic clears that bar for perfectly calibrated models of different accuracy:

| Model accuracy | Share of cases that clear a 0.90 bar |
| --- | --- |
| 60% | [0.2%](https://victordibia.com/explainers/jev/) |
| 75% | 20% |
| 90% | 67% |

Calibration tells you the confidence is honest. It doesn't tell you how often the model is confident. That is why F1 on its own is the wrong headline for a decision system. You need precision and recall per class, calibration, and coverage at the bar you will actually use.

## Fitting works, and the evidence is older than the hype

The good news is that closing the gap is not exotic.

**Fine-tuned small models beat zero-shot giants at classification.** A 2024 study compared fine-tuned BERT-style models with zero-shot GPT-4 and Claude Opus across sentiment, stance, emotion and party-position tasks, and found that [fine-tuning with application-specific data won in every case](https://arxiv.org/abs/2406.08660).

**It holds for decision models specifically.** An October 2026 paper took open LLMs, added a decision head and fine-tuned with LoRA. It reports [accuracy comparable to Jev with lower calibration error](https://www.emergentmind.com/papers/2610.17205). I have read the abstract, not the full paper, so treat that as a pointer.

**You may not need to touch the weights.** Hosted Jev can't be fine-tuned; the same weights serve every account. One practitioner fitted a small calibrated layer on top using 140 labelled examples and reports [accuracy moving from 77% to 87% and calibration error falling from 0.151 to 0.030](https://anth.us/articles/fine-tuning-jev/). That is one write-up on a small sample, but the direction matches everything else.

**No labels? Borrow a teacher.** In Google's "Distilling Step-by-Step", a 770M-parameter model [beat a few-shot 540B model using 80% of the data](https://arxiv.org/abs/2305.02301), by learning from the large model's reasoning as well as its labels. A general LLM can label your backlog, and the small model learns from it.

A note on reinforcement learning, since it comes up. TypeSafe says Jev itself is trained with a method it calls [Reinforcement Learning for Calibrated Decisions](https://anthonymaio.substack.com/p/jev-the-language-model-that-wont). That is the vendor's training recipe. For a team adopting these models, the published evidence I found supports supervised fitting and distillation. I'd reach for those first.

## The ladder I'd climb

1. **Start with a general LLM.** It is slower and costs more, and it gives you a working system and a log of every decision and outcome.
2. **Shadow the decision model.** Run it on the same traffic without acting on it. Compare against the LLM and against what actually happened.
3. **Set thresholds on your data, with a third answer.** Yes, no, and *send to a person*. There is research on exactly this: a decision space of [YES, NO and TBD](https://arxiv.org/pdf/2605.27768), on the argument that a model forced to choose hides the uncertainty an operator would want to see.
4. **Fit it.** A calibrated layer or a fine-tune, on human labels or teacher labels.
5. **Promote it, and keep the LLM as the escalation path.** Then watch for drift.

This is close to the migration NVIDIA's researchers propose for agents in general: most calls are [repetitive, scoped and non-conversational](https://arxiv.org/abs/2506.02153), so log them, specialise small models on them, and keep the large model for the rest.

> Earn each rung with numbers from your own traffic.

## Why regulated settings raise the bar

In US banking, model risk guidance known as SR 11-7 has applied since 2011, and regulators expect machine-learning models to meet it. Validators look at [conceptual soundness, process verification, ongoing monitoring and outcomes analysis](https://www.protiviti.com/bg-bg/blogs/validation-machine-learning-models-challenges-and-alternatives), and performance has to be monitored on a schedule that matches how often the model is used.

Read that list against a zero-shot hosted model whose architecture is undisclosed and whose weights you cannot inspect. Conceptual soundness is hard to argue. Outcomes analysis requires labelled outcomes, which is the very data the pitch says you don't need. None of this rules decision models out. It means the evaluation work is not optional, and it is yours to do.

## What I'd measure before shipping

- Precision and recall for every class, not one blended F1.
- Calibration error on your own labelled sample.
- Coverage at the confidence bar you plan to automate on.
- How many cases land in the "send to a person" band, and whether people can absorb them.
- A drift alarm, and a date to re-check.
- A documented fallback when the model or the vendor is unavailable.

I'm running a small experiment of my own on a public banking-intent dataset, zero-shot against fitted, and I'll add the numbers here when it's done. [Part three](/blog/decision-models-3-where-they-earn-their-place) covers where these models are worth using.

### Sources

- Calibration and its limits: [Victor Dibia, How Jev works](https://victordibia.com/explainers/jev/) · [Alex Molas, Jev can't be calibrated](https://www.alexmolas.com/2026/09/23/jev-cant-be-calibrated.html) · [Anthony Maio, The language model that won't talk](https://anthonymaio.substack.com/p/jev-the-language-model-that-wont) · [Hamza Boughanim, Jev and the System One model](https://hamzaboughanim.com/blog/jev-system-one-model-typed-decisions-calibrated-probabilities)
- Evaluations and fitting: [Evaluating Decision Models for Text Annotation, arXiv 2609.24574](https://arxiv.org/pdf/2609.24574) · [Releasing the Inner Jev, arXiv 2610.17205](https://www.emergentmind.com/papers/2610.17205) · [Fine-Tuning Jev: You Can't](https://anth.us/articles/fine-tuning-jev/)
- Older foundations: [Bucher and Martini, arXiv 2406.08660](https://arxiv.org/abs/2406.08660) · [Hsieh et al., Distilling Step-by-Step](https://arxiv.org/abs/2305.02301) · [Belcak et al., Small Language Models are the Future of Agentic AI](https://arxiv.org/abs/2506.02153)
- Abstention and governance: [Auditable Decision Models with Learned Abstention, arXiv 2605.27768](https://arxiv.org/pdf/2605.27768) · [Protiviti on validating ML models under SR 11-7](https://www.protiviti.com/bg-bg/blogs/validation-machine-learning-models-challenges-and-alternatives)
