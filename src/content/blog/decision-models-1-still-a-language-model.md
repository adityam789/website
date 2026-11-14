---
title: "A Decision Model Is Still a Language Model: It Just Stopped Talking"
excerpt: "Part 1 of 3 on decision models. What they are, where they came from in the space of two months, and why 'it doesn't write text, so it isn't an LLM' gets the architecture wrong."
date: "2026-11-14"
tag: "Tech"
cover: "/blog/decision-models-1-still-a-language-model/cover.png"
coverAlt: "Two identical towers of stacked glass layers. A dashed amber ribbon streams out of the left one; the right one is capped with a small panel of three bars."
---

## "It doesn't write anything, so it isn't an LLM"

I've heard this a few times now about decision models, and I understand where it comes from. You send one a support ticket and a list of teams, and you get back numbers. No sentence, no explanation, no wall of text.

But the conclusion is wrong, and it matters, because what a model is tells you what it can and can't do. A decision model is a transformer language model with the writing step taken off.

I'm late to this topic. The category is about two months old and it moves weekly, so treat every product detail here as true on the date at the top and check it before you rely on it.

## What a decision model is

A decision model takes two things: some input, usually called the state, and one or more typed questions about it. It answers each question with a probability.

The shape was set by Jev, which [TypeSafe AI launched on 15 September 2026](https://hackernoon.com/20-best-open-source-ai-decision-models-you-can-run-locally-in-2026) under the name "System One model". The name borrows from Daniel Kahneman: [System 1 is the fast, intuitive judgment](https://www.dsebastien.net/decision-models-dms/), and a general LLM is the slow, deliberate System 2.

The API has three question types:

| Type | You ask | You get back |
| --- | --- | --- |
| Choice | Pick one of these options | A probability for each option |
| Noul | Is this statement true? | One number: the probability of yes |
| Score | Rate this on a scale | A position on the scale, with confidence |

A choice can have [up to 255 options on most models](https://hackernoon.com/20-best-open-source-ai-decision-models-you-can-run-locally-in-2026). And because the questions don't depend on each other, a model can answer many of them [in a single pass over the same input](https://vizuara.substack.com/p/jev-what-a-model-built-for-decisions).

## Two months, start to finish

The speed of this is worth seeing in one place.

| When (2026) | What happened |
| --- | --- |
| 15 September | TypeSafe AI launches Jev and names the category |
| Within weeks | Open models appear, mostly built on Qwen and Gemma, some serving a Jev-compatible API |
| 1 October | Amazon's Strands team publishes [Strands Decider 2B](https://github.com/strands-labs/strands-decider), with open weights, data and training scripts |
| Mid-October | [OpenAI, Microsoft, Perplexity, Cloudflare and Liquid](https://admix.software/blog/decision-model-apis-go-commercial) ship commercial decision APIs on the same day |
| 10 and 11 November | Hugging Face adds a decision-model interface, and Google launches the [Gemini Decisions API](https://www.eesel.ai/blog/gemini-decisions-api), which takes images, audio, video and PDFs as well as text |

One startup's idea became a product line at every major vendor in about eight weeks.

## What's inside

Here is the part the "not an LLM" claim misses.

```diagram-decision-head
```

A chat model runs your prompt through a stack of transformer layers, then a final layer scores every token in its vocabulary. It picks one, appends it, and goes round again. That loop is where the text comes from, and where most of the time and cost goes.

A decision model keeps the stack and changes the last step. From what has been published, there are at least three ways to do it:

| Approach | Example | What changes |
| --- | --- | --- |
| Read the answer off a normal LLM | Open reproductions that [sum the log-probabilities of each option's tokens](https://pub.towardsai.net/jev-explained-calibrated-decision-models-a89d88c845ab) | Nothing in the weights. Only how the output is read |
| Skip the loop | Cloudflare's Clef, described as [a prefill-only pass that scores the valid choices in parallel](https://www.eesel.ai/blog/decision-models) | No token-by-token decoding |
| Replace the head | Strands Decider 2B: a Qwen body with the [language head removed and a pointer head of about a million parameters](https://github.com/strands-labs/strands-decider) added | The model can no longer generate text at all |

So "is it a decoder?" has a more careful answer than I first gave people. Several of these are decoder LLMs underneath. Strands starts from one and removes its ability to write. At least one open model, Laya, is [described as encoder-based](https://vizuara.substack.com/p/jev-what-a-model-built-for-decisions). And TypeSafe [has not disclosed Jev's architecture](https://pub.towardsai.net/jev-explained-calibrated-decision-models-a89d88c845ab), so anyone telling you exactly what is inside it is guessing.

What they share is the body: attention, the same kind of layers, the same pretraining on text. That is why they understand a messy support ticket without being trained on your tickets.

> The knowledge is in the body. Only the mouth was changed.

## Why this is fast and cheap

No loop means no output tokens to generate, and the pricing shows it. As reported at launch, OpenAI's decision API costs [$0.10 per million input tokens with no charge for output](https://admix.software/blog/decision-model-apis-go-commercial), and Google's is [priced the same way](https://www.eesel.ai/blog/gemini-decisions-api). A September research paper recorded Jev at [$0.042 per million input tokens](https://arxiv.org/pdf/2609.24052), output free.

The other saving is that there is nothing to parse. You don't ask for JSON and hope. The answer space is fixed before the model runs.

## What you give up

- **No explanation.** You get a number, not a reason.
- **No way out.** The model must answer inside the options you gave it. If the right answer isn't on the list, it will still pick one.
- **A probability you have to earn the right to trust.** That is the whole of the next post.

## Is it just a small language model, then?

Not quite. A small language model still writes text. A decision model returns a typed answer in one pass, which is [why it is faster for yes/no and routing work and why it can't hold a conversation](https://admix.software/blog/decision-model-apis-go-commercial).

It also isn't a classic classifier. A fine-tuned BERT is excellent at the one task you trained it for and useless at the next. A decision model takes a new question in plain English with no training. That zero-shot ability is the real novelty here. It is also the thing people lean on too hard, which is where part two picks up.

### Sources

- The category: [dsebastien, Decision Models](https://www.dsebastien.net/decision-models-dms/) · [HackerNoon, open decision models](https://hackernoon.com/20-best-open-source-ai-decision-models-you-can-run-locally-in-2026) · [Admix, five vendors in one day](https://admix.software/blog/decision-model-apis-go-commercial) · [eesel, Gemini Decisions API](https://www.eesel.ai/blog/gemini-decisions-api)
- Architecture: [Strands Decider repository](https://github.com/strands-labs/strands-decider) · [eesel, Decision models explained](https://www.eesel.ai/blog/decision-models) · [Towards AI, Jev explained](https://pub.towardsai.net/jev-explained-calibrated-decision-models-a89d88c845ab) · [Vizuara, Jev explainer](https://vizuara.substack.com/p/jev-what-a-model-built-for-decisions)
- Pricing reference: [arXiv 2609.24052](https://arxiv.org/pdf/2609.24052)
