---
title: "Lying With Truths: You Can Gaslight a Reasoning Model Without a Single False Statement"
excerpt: "A new paper shows that agents can be steered into a fabricated story using only true, checkable posts, put in the right order. Reasoning models fell for it more often. Why I think this is a bigger problem than prompt injection, and what you can actually do about it."
date: "2026-11-17"
tag: "Tech"
cover: "/blog/lying-with-truths/cover.png"
coverAlt: "Six glowing film frames, each marked with a check, joined by a dotted amber thread that ends in an arrowhead: true pieces stitched into one direction."
---

## The one-line version

You can make an AI agent believe something false without telling it anything false. You only need to choose which true things it sees, and in what order.

That is the claim of [Lying with Truths](https://arxiv.org/abs/2601.01685), a paper by Jinwei Hu and colleagues at the University of Liverpool and MBZUAI. The authors' [repository](https://github.com/CharlesJW222/Lying_with_Truth) lists it as an ACL 2026 oral. I read it over a weekend, and three things stuck with me:

1. You can gaslight a model that reasons step by step, and the reasoning models in the study were easier to gaslight than their plain counterparts.
2. Prompt injection was the problem we all learned first. I think this one is bigger, because there is nothing false in the input to catch.
3. The way I read the paper turned out to be a small demonstration of the same effect, which I come back to at the end.

## The Kuleshov effect, for machines

About a century ago, the Soviet filmmaker Lev Kuleshov cut the same shot of an actor's neutral face against different images: a bowl of soup, a child in a coffin, a woman on a divan. Audiences praised the actor for showing hunger, grief and desire. The face never changed. [The meaning came from the cut](https://en.wikipedia.org/wiki/Kuleshov_effect).

The paper opens with Kuleshov's own line: "The viewer himself will complete the sequence and see that which is suggested to him by montage." Its argument is that language-model agents do the same thing. Give one a feed of fragments and it builds the bridges between them: in the paper's words, "spurious bridges the evidence suggests but does not state."

![Same four true facts, two orders: spread out, four true posts read as four events; sequenced back to back, a model infers that a departing engineer's deploy took a server down, which no post says.](/blog/lying-with-truths/same-facts-two-orders.png)

That picture is my illustration, not an example from the paper. But it is the whole attack in one frame. Every card is true. The lie lives only in the gaps between them.

## The two rules the attacker plays by

The paper defines the attack with two conditions, and both matter.

- **Local truth.** Every fragment the victim sees must be fully consistent with the real state of the world. No forged documents, no edited screenshots, no made-up posts. Each one, checked on its own, passes.
- **Global lie.** Taken together, the fragments must push the victim to rate a fabricated hypothesis as more likely than the true one.

The fabricated hypothesis differs from the truth in one way: it contains causal links that are not real. The facts are right. The "because" is invented.

## How the attack is built

The authors automate it with what they call Generative Montage: three agents and a gate, borrowed from film production.

![Generative Montage, end to end: a pool of true facts feeds a Writer and an Editor, a Director gates their output, sybil accounts post the accepted sequence, a victim agent reads it, and its summary misleads downstream judges.](/blog/lying-with-truths/montage-pipeline.png)

- **The Writer** takes a pool of verified facts and drafts a story that leans toward the target lie. The paper describes its tool as "contextual obfuscation", using "linguistic ambiguity and generalization without explicit fabrication."
- **The Editor** cuts that story into separate posts and searches for the order that best suggests the false causal links.
- **The Director** plays the victim. It simulates how a reader would update its beliefs, then makes one of three calls:
  - **Accept** if every fragment is true and the simulated belief in the lie clears a threshold. That threshold is 7.0 on a 0 to 10 scale.
  - **Reject** if any fragment fails the truth check.
  - **Revise** otherwise, with a written critique sent back to the Writer or Editor.
- **Sybil accounts** then post the accepted fragments to a public feed, in the chosen order.

Two details are worth noticing. The truth check is a hard gate, so the attacker's own pipeline throws out anything that a fact-checker could catch. And the loop converges fast: in an example the appendix reports, the Writer and Editor reached their first approval in about three rounds each.

Every agent in the pipeline matters. Collapsing it into a single agent dropped attack success on one event from 77.0% to 26.8%, and removing the debate between agents cost 13.5 points on the same event.

## What they found

The benchmark is called CoPHEME, built from PHEME, a public dataset of rumours that spread on Twitter during six breaking-news events, including the Charlie Hebdo attack, the Sydney siege and Ferguson. The victims were 14 models: eight proprietary (GPT-4o, GPT-4.1 and Claude Haiku variants) and six open-weights (three Qwen2.5 instruct models and three DeepSeek-R1 distills).

- **It works most of the time.** Average attack success was 74.4% on the proprietary models and 70.6% on the open-weights ones.
- **The victims were sure of themselves.** Average confidence in the adopted lie was 0.82 and 0.85 for the two groups.
- **There is a sweet spot.** With one to five posts, there isn't enough material to build a story. Past 15, contradictions creep in. Success peaked at 11 to 15 posts, in an experiment on one model and one event.

## Gaslighting a model that thinks harder

This is the finding everyone quotes, so here are the numbers. Among the open-weights models, the reasoning distills were easier to fool than the instruct models of the same size:

| Size | Qwen2.5 instruct | DeepSeek-R1 distill |
| --- | --- | --- |
| 7B | 67.1% | 79.2% |
| 14B | 71.9% | 76.8% |

Asking for step-by-step reasoning also raised success on the Charlie Hebdo event: by 3.1 points for Qwen2.5-7B and 4.7 points for the R1 distill.

The authors' explanation is that a model trained to build long chains of reasoning is also better at building the false chain the attacker set up. It works harder to make the pieces fit, and that is exactly what the attack needs. That is the part that made me laugh: the more a model "thinks", the better it is at gaslighting itself.

Two cautions keep this honest. First, the paper says proprietary models "show the inverse trend", so this is not a universal law about reasoning. Second, "overthinking" is the authors' explanation, not something they measured directly.

## The cascade, or how victims become accomplices

The part that worried me most is what happens after the victim is fooled. A victim agent that has adopted the lie writes a summary of it: confident, well argued, and built only from true sources. The paper calls these victims "implicit colluders who unwittingly advocate fabricated narratives."

The authors then fed those summaries to two kinds of downstream check. One was a majority vote across several victims, the way community notes work. The other was a single AI judge. Both were fooled, at rates the abstract puts above 60%. That makes sense: five independent agents reaching the same conclusion, each with a clean argument, looks exactly like strong evidence.

## Why I think this is bigger than prompt injection

This is my view, not the paper's. It doesn't compare the two.

Prompt injection is bad, but it has a shape. Somewhere in the input there is an instruction that doesn't belong. You can look for it, isolate it, strip it, or refuse to treat data as commands. The defenses are imperfect, but there is a target.

Montage has no target. Every post passes a fact-check. No post contains an instruction. The attack lives in the selection and the order, and that is also what normal, honest information looks like. You cannot filter your way out of it, because there is nothing wrong with any single input.

It also scales with the thing we are building. Agents that read feeds, logs, tickets and search results and then write summaries for other agents are exactly the setup the paper attacks. Every summary step is a place where a story can harden into a "fact" and pick up confidence along the way.

## What the paper suggests for defense

Section 6 proposes defenses at four levels:

| Level | Idea |
| --- | --- |
| Detection | Watch the model's belief as it reads. Organic feeds should move it gradually; a montage should cause sudden jumps. Also track uncertainty along the reasoning, and compare conclusions across different model families. |
| Reasoning | Audit provenance: for every causal claim in the conclusion, ask which single fragment actually states it. If none does, flag it as a bridge the model built. |
| Training | Fine-tune on adversarially ordered fragments, and use unlearning to weaken the habit of filling gaps. |
| System | In high-stakes domains, check causal claims with deterministic rules or symbolic solvers before acting on them. |

Be clear about the status of that table: none of these were tested. They are proposals, and the paper's own limitations section says "we do not propose concrete defense mechanisms," which sits oddly next to Section 6.

## What I would do today

My own take, as someone who builds agents that read evidence and write summaries:

- **Make causal claims cite a source.** Any "because" in an agent's output should point to the one input that says it. If it can't, the claim gets downgraded to a guess. This is the paper's provenance idea, and it is cheap enough to do now.
- **Treat agreement between agents as weak evidence.** Several agents that read the same feed are not independent witnesses. Give them different sources, or count them as one.
- **Watch where the inputs came from, not just what they say.** The attack needs a coordinated set of accounts posting in sequence. Clusters of new or related accounts are visible even when their content is clean.
- **Don't reward confidence built from fragments.** A conclusion assembled from many small pieces deserves less trust than one stated plainly by a single source, not more.
- **Keep a human at the point where a story becomes an action.** That is where a wrong "because" does real damage.

## How I read the paper, which proved the point

I read this paper with NotebookLM, the way I like to read anything new: introduction and conclusion first, then a skim, then the details. It was a good way to learn it. It also showed the effect the paper describes.

At first the notebook only had the abstract, and it said so: the defenses and the prompts weren't in its sources. After I imported more sources, it gave me clean, confident answers. When I checked them against the paper itself, a few had been smoothed into a better story than the text supports:

- "Confidence exceeding 0.80" is close: the paper reports averages of 0.82 and 0.85.
- "14 LLM families" is the paper's own wording, but the table lists 14 models.
- "A 50.2% drop" is a drop of 50.2 percentage points.
- The defenses read as established methods; the paper never evaluated them.

None of that is a lie. Each piece is close to something true. Put together, it reads a little more certain and a little more finished than the evidence. That is a gentle version of exactly what the paper is about, and it is why every number in this post comes from the paper itself.

### Sources

- Paper: [Hu et al., Lying with Truths: Open-Channel Multi-Agent Collusion for Belief Manipulation via Generative Montage, arXiv 2601.01685](https://arxiv.org/abs/2601.01685) · [HTML version (v2)](https://arxiv.org/html/2601.01685v2) · [Code and CoPHEME data](https://github.com/CharlesJW222/Lying_with_Truth)
- Background: [The Kuleshov effect](https://en.wikipedia.org/wiki/Kuleshov_effect) · [Farquhar et al., Detecting hallucinations in large language models using semantic entropy](https://www.nature.com/articles/s41586-024-07421-0)
