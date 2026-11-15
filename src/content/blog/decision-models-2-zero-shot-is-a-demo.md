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

Decision models are sold on calibration: when the model says 0.8, it should be right about 80% of the time. The early evidence on Jev is encouraging. An independent benchmark across 37 datasets concluded that [its choice probabilities are well calibrated](https://arxiv.org/abs/2609.37647), and one explainer cites a third-party measurement of expected calibration error at [about 0.06 on 662 prompt-injection messages](https://victordibia.com/explainers/jev/).

The catch is where that was measured. Calibration is a property of the model *and* the data it runs on. As one early critique put it, [the same model can be calibrated on one dataset and not on another](https://www.alexmolas.com/2026/09/23/jev-cant-be-calibrated.html). Jev's weights are [the same for every account](https://docs.typesafe.ai/models), so nothing in them knows your data. Policies change, customers change, fraud patterns change, and [probabilities that were reliable last month quietly stop being reliable](https://anthonymaio.substack.com/p/jev-the-language-model-that-wont).

Independent testing points the same way. That same 37-dataset benchmark ran Jev beside two open LLMs and found that all three [degrade on low-resource languages, fine-grained or noisy labels, and rubric-based judgments, and that binary probabilities need tuned thresholds](https://arxiv.org/abs/2609.37647). On one dataset, tuning the threshold alone moved the score from 0.50 to 0.75. A second study, on [18 social-science annotation tasks](https://arxiv.org/abs/2609.24574), found Jev behind the best LLM on 14 of 15 evaluation tasks, by a median of 11.6 macro-F1 points, at a median 44 times lower cost. Its confidence was better calibrated than the stated confidence of most of the LLMs. It also found one task where Jev was highly confident and close to chance.

Fine-grained labels and rubric-based judgments are a fair description of most real business decisions.

## Calibrated and useless is possible

There is a second trap. A model can be perfectly calibrated and still not help you.

Suppose you only act automatically when confidence is 0.90 or higher. One worked example, a calculation and not a measurement, shows how much traffic clears that bar for perfectly calibrated models of different accuracy:

| Model accuracy | Share of cases that clear a 0.90 bar |
| --- | --- |
| 60% | [0.2%](https://victordibia.com/explainers/jev/) |
| 75% | 20% |
| 90% | 67% |

Calibration tells you the confidence is honest. It doesn't tell you how often the model is confident. That is why F1 on its own is the wrong headline for a decision system. You need precision and recall per class, calibration, and coverage at the bar you will actually use.

## Fitting works, and the evidence is older than the hype

The good news is that closing the gap is not exotic.

**Fine-tuned small models beat zero-shot giants at classification.** A 2024 study compared fine-tuned BERT-style models with zero-shot GPT-4 and Claude 3 Opus across sentiment, stance, emotion and party-position tasks, and found that [fine-tuning with application-specific data won in every case](https://arxiv.org/abs/2406.08660).

**It holds for decision models specifically.** An October 2026 paper took open LLMs, added a decision head and fine-tuned with LoRA. It reports [accuracy comparable to Jev with lower calibration error](https://arxiv.org/abs/2610.17205). The numbers are the authors' own, and I have read the abstract, not the full paper, so treat that as a pointer.

**You may not need to touch the weights.** Hosted Jev can't be fine-tuned; [the same weights serve every account](https://docs.typesafe.ai/models). What you can do is fit something small on top of its answers. A study that used Jev to code police crash reports found that [recalibrating against human labels cut calibration error by a factor of 3.3](https://arxiv.org/abs/2609.24052), measured on those same labels. One practitioner went further on a synthetic sentiment set and reports [calibration error falling from 0.151 to 0.030 after fitting a small layer on 87 labels](https://anth.us/articles/fine-tuning-jev/). The layer did not move accuracy. That went from 77% to 87% only when a new question was added to the request. Calibration and accuracy are separate problems, and a cheap fit mostly fixes the first.

**No labels? Borrow a teacher.** In Google's "Distilling Step-by-Step", a 770M-parameter model [beat a few-shot 540B model on one benchmark using 80% of the data](https://arxiv.org/abs/2305.02301), by learning from the large model's reasoning as well as its labels. A general LLM can label your backlog, and the small model learns from it.

A note on reinforcement learning, since it comes up. TypeSafe says Jev itself is trained with a method it calls [Reinforcement Learning for Calibrated Decisions](https://typesafe.ai/blog/introducing-system-one-models-and-jev), without publishing the details. That is the vendor's training recipe. For a team adopting these models, the published evidence I found supports supervised fitting and distillation. I'd reach for those first.

## The ladder I'd climb

1. **Start with a general LLM.** It is slower and costs more, and it gives you a working system and a log of every decision and outcome.
2. **Shadow the decision model.** Run it on the same traffic without acting on it. Compare against the LLM and against what actually happened.
3. **Set thresholds on your data, with a third answer.** Yes, no, and *send to a person*. There is research on exactly this: a decision space of [YES, NO and TBD](https://arxiv.org/abs/2605.27768), on the argument that a model forced to choose hides the uncertainty an operator would want to see. That paper's model is a small encoder from before Jev existed, but the argument carries over.
4. **Fit it.** A calibrated layer or a fine-tune, on human labels or teacher labels.
5. **Promote it, and keep the LLM as the escalation path.** Then watch for drift.

This is close to the migration NVIDIA's researchers propose for agents in general: most calls are [repetitive, scoped and non-conversational](https://arxiv.org/abs/2506.02153), so collect them, cluster them, and fine-tune small models on the clusters.

> Earn each rung with numbers from your own traffic.

## Why regulated settings raise the bar

US banks have worked under model risk guidance since 2011, when the Federal Reserve issued a letter known as SR 11-7. In April 2026 the Federal Reserve, the OCC and the FDIC [replaced it with SR 26-2](https://www.federalreserve.gov/supervisionreg/srletters/sr2602.htm), aimed mainly at banks with more than $30 billion in assets. The components of validation will be familiar to anyone who worked under the old letter: [conceptual soundness, outcomes analysis and ongoing monitoring](https://www.federalreserve.gov/supervisionreg/srletters/SR2602a1.pdf). Outcomes analysis means comparing what the model said with what actually happened.

Buying the model doesn't remove the duty. The guidance accepts that a bank "may not receive from the vendor the underlying code, data, or methodology", and then says "the principles of model risk management remain applicable".

There is a wrinkle here. SR 26-2 puts generative and agentic AI outside its scope, calling them "novel and rapidly evolving", and covers "non-generative, non-agentic AI models". A decision model has a generative model's body and generates nothing. The guidance doesn't say which side of that line it falls on, and I won't guess. The same footnote says a bank's own risk management should decide the controls for anything the guidance doesn't cover, so the work lands on you either way.

Read that list against a zero-shot hosted model whose architecture is undisclosed and whose weights you cannot inspect. Conceptual soundness is hard to argue. Outcomes analysis requires labelled outcomes, which is the very data the pitch says you don't need. None of this rules decision models out. It means the evaluation work is not optional, and it is yours to do.

## What I'd measure before shipping

- Precision and recall for every class, not one blended F1.
- Calibration error on your own labelled sample.
- Coverage at the confidence bar you plan to automate on.
- How many cases land in the "send to a person" band, and whether people can absorb them.
- A drift alarm, and a date to re-check.
- A documented fallback when the model or the vendor is unavailable.

## I tested it

I ran a small experiment on my own laptop to see how much of this holds. It compares an open decision model, [Strands Decider 2B](https://huggingface.co/StrandsAgents/strands-decider-2B-qwen3.5-v1-2610), three ways: as shipped with no labels, after a cheap fit on a few hundred labels with the model itself frozen, and against the classic alternative, a small encoder (DistilRoBERTa) fine-tuned on those same labels and then on a few thousand.

The cheap fit is a small layer on the probabilities the model returns. For the yes-or-no tasks it is two numbers, a slope and an intercept. For the intent tasks it is a linear layer that starts as "change nothing" and is penalised for moving away from that.

I have to report a mistake first. I started with Banking77, a public set of 77 banking intents, and a public SMS spam set. After running both I read the model's training list and found both datasets on it. A model answering questions about data it was trained on is not zero-shot. So I added two datasets that are absent from that list: Bitext's retail-banking intents (26 classes) and Enron email spam. Those two are the real test.

```chart-decision-fit
```

On the two unseen tasks:

| Task | System | Labels | Accuracy | Calibration error | Coverage at 0.90 |
| --- | --- | --- | --- | --- | --- |
| Bitext intents | Decision model, as shipped | 0 | 94.0% | 0.038 | 79.4% |
| | Decision model + cheap fit | 260 | 97.1% | 0.026 | 87.5% |
| | Fine-tuned encoder | 260 | 98.1% | 0.008 | 98.1% |
| | Fine-tuned encoder | 5,000 | 100.0% | 0.003 | 99.8% |
| Enron spam | Decision model, as shipped | 0 | 79.3% | 0.035 | 0.8% |
| | Decision model + cheap fit | 200 | 85.3% | 0.033 | 60.3% |
| | Fine-tuned encoder | 200 | 96.0% | 0.038 | 98.8% |
| | Fine-tuned encoder | 5,000 | 98.5% | 0.015 | 98.8% |

Three things stand out.

**Zero-shot was honest and of little use on the harder task.** On Enron the model as shipped was right 79% of the time and its confidence matched that: a calibration error of 0.035 is good. But it was almost never sure. Five emails out of 600 cleared a 0.90 confidence bar. A well-calibrated model that is rarely confident automates nothing. It caught 62% of the spam.

**A few hundred labels helped.** With 200 labels and two fitted numbers, accuracy on Enron went from 79% to 85% and coverage from under 1% to 60%, with 94% accuracy inside the covered share. On Bitext, 260 labels took accuracy from 94.0% to 97.1% and cut the errors that got past the confidence bar from 12 to 2.

**The old baseline did better.** This is the result I did not expect. A small encoder fine-tuned on the same 200 Enron labels reached 96%, well ahead of the fitted decision model at 85%. On Bitext it was ahead too, 98.1% against 97.1%, though that gap is inside the noise for 520 test messages.

The two tasks the model had trained on tell a different story, and I report them as an upper bound and not as zero-shot results. On Banking77 the model as shipped scored 86.1% with a calibration error of 0.030, and the fit on 385 labels changed nothing (86.0%). An encoder on those 385 labels, five per intent, managed only 74.8%. An encoder on all 10,003 training messages reached 92.5%. On SMS spam, accuracy was 98.8% before and after the fit, but coverage at 0.90 went from 38% to 98%: the model was right and under-confident, and two numbers fixed that.

What I take from it:

- The fit is cheap and it helped on both unseen tasks, so skipping it is hard to defend.
- A decision model is one candidate. With a few hundred labels in hand, a fine-tuned encoder is another, and here it won on both unseen tasks. It fell well behind only where labels were thinnest, at five per class across 77 classes.
- Calibration error alone is not enough. Enron zero-shot had a good one and a coverage of under 1%. Measure coverage at your bar.

The limits are real. This is one open model, one encoder, one seed and 520 to 770 test items per task. Bitext is template-generated and easy; the encoder got every test message right. I used one plain sentence as the instruction and did not tune it. I did not test any hosted model. Enron emails were cut to their first 1,000 characters. The whole run also took over two hours of compute on a MacBook Air, more than twice what I had planned. The README in the experiment's repository lists the exact commands, splits and timings.

[Part three](/blog/decision-models-3-where-they-earn-their-place) covers where these models are worth using.

### Sources

- Evaluations: [Deußer et al., arXiv 2609.37647](https://arxiv.org/abs/2609.37647) · [Evaluating Decision Models for Text Annotation, arXiv 2609.24574](https://arxiv.org/abs/2609.24574) · [arXiv 2609.24052](https://arxiv.org/abs/2609.24052) · [Releasing the Inner Jev, arXiv 2610.17205](https://arxiv.org/abs/2610.17205) · [Fine-Tuning Jev: You Can't](https://anth.us/articles/fine-tuning-jev/)
- Vendor material: [TypeSafe, Introducing System One models and Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev) · [TypeSafe model documentation](https://docs.typesafe.ai/models)
- Older foundations: [Guo et al., On Calibration of Modern Neural Networks](https://arxiv.org/abs/1706.04599) · [Bucher and Martini, arXiv 2406.08660](https://arxiv.org/abs/2406.08660) · [Hsieh et al., Distilling Step-by-Step](https://arxiv.org/abs/2305.02301) · [Belcak et al., Small Language Models are the Future of Agentic AI](https://arxiv.org/abs/2506.02153)
- Abstention and governance: [Auditable Decision Models with Learned Abstention, arXiv 2605.27768](https://arxiv.org/abs/2605.27768) · [Federal Reserve, SR 26-2](https://www.federalreserve.gov/supervisionreg/srletters/sr2602.htm)
- Experiment: [Strands Decider 2B model card](https://huggingface.co/StrandsAgents/strands-decider-2B-qwen3.5-v1-2610) · [Banking77, Casanueva et al.](https://arxiv.org/abs/2003.04807) · [Bitext retail-banking dataset](https://huggingface.co/datasets/bitext/Bitext-retail-banking-llm-chatbot-training-dataset) · [SMS Spam Collection](https://huggingface.co/datasets/ucirvine/sms_spam) · [Enron spam dataset](https://huggingface.co/datasets/SetFit/enron_spam)
