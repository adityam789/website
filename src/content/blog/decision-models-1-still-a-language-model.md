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

The shape was set by Jev, which [TypeSafe AI launched on 15 September 2026](https://typesafe.ai/blog/introducing-system-one-models-and-jev) under the name "System One model". The name is usually read as a nod to [Daniel Kahneman's fast, intuitive System 1](https://www.dsebastien.net/decision-models-dms/), which would make a general LLM the slow, deliberate System 2. Simon Willison argues that ["decision models" is a better name](https://simonwillison.net/2026/Sep/21/jev/), and that is the one I use here.

The API launched with three question types:

| Type | You ask | You get back |
| --- | --- | --- |
| Choice | Pick one of these options | A probability for each option |
| Noul | Is this statement true? | One number: the probability of yes |
| Score | Rate this on a scale | A position on the scale, with confidence |

Jev has since added a fourth, box, which returns a bounding box. [TypeSafe's docs](https://docs.typesafe.ai/) list all four.

A choice can have [up to 255 options](https://docs.typesafe.ai/primitives/choice) on Jev, and Google's API has the same limit. And because the questions don't depend on each other, [any mix of them can go in a single request](https://docs.typesafe.ai/) over the same input.

## Two months, start to finish

The speed of this is worth seeing in one place.

| When (2026) | What happened |
| --- | --- |
| 15 September | [TypeSafe AI launches Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev) and names the category |
| 1 October | Cloudflare releases [Clef](https://blog.cloudflare.com/clef-decision-models/), two open-weight decision models built on Qwen |
| By 6 October | OpenAI has a [Decisions API](https://developers.openai.com/api/docs/guides/decisions), announced at its DevDay. Simon Willison ships [a plugin for it on 6 October](https://simonwillison.net/2026/Oct/6/llm-openai-decisions/) |
| October | More open models follow on Qwen and Gemma bodies, among them [Strands Decider 2B](https://github.com/strands-labs/strands-decider), with open weights and training code, and the models from the paper [Releasing the Inner Jev](https://arxiv.org/abs/2610.17205) |
| 10 November | Hugging Face publishes [a shared decision-model interface](https://huggingface.co/blog/decision) for its libraries |
| 11 November | Google launches the [Gemini Decisions API](https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/), which takes images, audio, video and PDFs as well as text |

One startup's idea became a product line at OpenAI, Google and Cloudflare in about eight weeks.

## What's inside

Here is the part the "not an LLM" claim misses.

```diagram-decision-head
```

A chat model runs your prompt through a stack of transformer layers, then a final layer scores every token in its vocabulary. It picks one, appends it, and goes round again. That loop is where the text comes from, and where most of the time and cost goes.

A decision model keeps the stack and changes the last step. From what has been published, there are at least three ways to do it:

| Approach | Example | What changes |
| --- | --- | --- |
| Use an ordinary LLM as it is | An untuned Gemma, which one paper reports [within half a point of Jev on its benchmark](https://arxiv.org/abs/2610.17205) | Nothing in the weights. Only how the output is read |
| Skip the loop | Cloudflare's Clef, which [uses Qwen for a prefill-only pass, then scores the valid schema choices in parallel](https://blog.cloudflare.com/clef-decision-models/) | No token-by-token decoding |
| Replace the head | Strands Decider 2B: a Qwen body with the [language head discarded and a pointer head of about a million parameters](https://github.com/strands-labs/strands-decider) in its place | The model can no longer generate text at all |

So "is it a decoder?" has a more careful answer than I first gave people. Several of these are decoder LLMs underneath. Strands starts from one and removes its ability to write. At least one open model, Laya, is not a decoder at all: its model card describes [a bidirectional encoder, ModernBERT, with a decision head on top](https://huggingface.co/convaiinnovations/laya). And TypeSafe has not said what Jev is. Its launch post mentions only [a new model architecture with a parallel sampler](https://typesafe.ai/blog/introducing-system-one-models-and-jev). The most detailed outside reconstruction I found calls itself [quite speculative](https://archerhume.com/posts/jevs-architecture-unmasked/), so anyone telling you exactly what is inside it is guessing.

What they share is the body: attention, the same kind of layers, the same pretraining on text. That is why they understand a messy support ticket without being trained on your tickets.

> The knowledge is in the body. Only the mouth was changed.

## Why this is fast and cheap

No loop means no output tokens to generate, and the pricing shows it. OpenAI's Decisions API costs [$0.10 per million input tokens with no charge for output](https://developers.openai.com/api/docs/guides/decisions), and Google's is [priced the same way](https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/). TypeSafe lists Jev at [$0.042 per million input tokens](https://docs.typesafe.ai/models), output free.

The other saving is that there is nothing to parse. You don't ask for JSON and hope. The answer space is fixed before the model runs.

## What you give up

- **No explanation.** You get a number, not a reason.
- **No way out.** The model must answer inside the options you gave it. If the right answer isn't on the list, it will still pick one.
- **A probability you have to earn the right to trust.** That is the whole of the next post.

## Is it just a small language model, then?

Not quite. A small language model still writes text. A decision model returns a typed answer in one pass, which is why it is faster for yes/no and routing work and why it can't hold a conversation.

It also isn't a classic classifier. A fine-tuned BERT is excellent at the one task you trained it for and useless at the next. A decision model takes a new question in plain English with no training. That zero-shot ability is the real novelty here. It is also the thing people lean on too hard, which is where part two picks up.

### Sources

- The category: [TypeSafe, Introducing System One Models and Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev) · [TypeSafe docs](https://docs.typesafe.ai/) · [Simon Willison on Jev](https://simonwillison.net/2026/Sep/21/jev/) · [dsebastien, Decision Models](https://www.dsebastien.net/decision-models-dms/)
- The timeline: [OpenAI Decisions API guide](https://developers.openai.com/api/docs/guides/decisions) · [Simon Willison, llm-openai-decisions](https://simonwillison.net/2026/Oct/6/llm-openai-decisions/) · [Cloudflare, Introducing Clef](https://blog.cloudflare.com/clef-decision-models/) · [Hugging Face, Decision Models in Hugging Face](https://huggingface.co/blog/decision) · [Google, Gemini Decisions API](https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/)
- Architecture: [Strands Decider repository](https://github.com/strands-labs/strands-decider) · [Releasing the Inner Jev, arXiv 2610.17205](https://arxiv.org/abs/2610.17205) · [Laya model card](https://huggingface.co/convaiinnovations/laya) · [Archer Hume, Jev's architecture unmasked](https://archerhume.com/posts/jevs-architecture-unmasked/)
- Pricing: [TypeSafe models and pricing](https://docs.typesafe.ai/models)
