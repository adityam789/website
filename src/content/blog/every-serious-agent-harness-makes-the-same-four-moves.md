---
title: "Every serious agent harness makes the same four moves"
excerpt: "Google, Factory, Cursor, Stripe, Spotify and Ramp built very different harnesses. They made the same four decisions: isolate context, separate the writer from the judge, wrap the model in code, and spend model money by role."
date: "2026-11-04"
tag: "Tech"
cover: "/blog/every-harness-makes-the-same-four-moves/cover.png"
coverAlt: "A glowing amber cube in the center of four translucent teal walls, each marked with an icon: a document, a balance scale, a gear and a database."
---

## The $9 app that did not work

Anthropic's engineering team ran one prompt twice: build a 2D retro game maker with a level editor, a sprite editor, entity behaviors and a playable test mode. The first run was a single agent. It took 20 minutes and cost $9. The second used a harness with a planner, a generator and an evaluator. It took 6 hours and cost $200.

The solo version looked like a game maker. Entities showed up on screen, but nothing responded to input. [The central feature simply did not work](https://www.anthropic.com/research/harness-design-long-running-apps). The harness version was playable, rough in places but working.

```chart-judge-cost
```

The harness cost more than 20 times as much, and the author's verdict was that the difference in quality was immediately apparent. Later, after Opus 4.6 shipped, Anthropic simplified the harness and ran it on a different task, a browser-based digital audio workstation. That run still took about four hours and cost about $125.

This post draws on engineering write-ups from Google, Anthropic, Factory, Cursor, Cognition, Stripe, Spotify and Ramp. Their harnesses look nothing alike. They keep making the same four decisions. It is the practical follow-up to [Looks Good to the Model](/blog/looks-good-to-the-model), which argued that the scarce skill is judging, not typing. Here is what the judging machinery looks like when teams build it.

## Four patterns, one map

Teams describe their systems with four different names.

![Four patterns: Campaign, Graph / workflow, Big agent / small agent and Elephant-Goldfish, all feeding into four shared moves.](/blog/every-harness-makes-the-same-four-moves/patterns-map.png)

- **Campaign style** is long-running work across many sessions, with state kept in files. That label is mine, not a standard term. The state is a feature list, a progress log and git.
- **Graph or workflow style** puts fixed steps in code and lets the agent act freely only inside a step.
- **Big agent, small agent** splits strong and cheap models by role.
- **Elephant-Goldfish** designs in one long context and reviews in fresh ones.

These are different shapes. Underneath, every one of them makes the same four moves.

## Move 1: Isolate context

Google's Elephant-Goldfish Model (EGM) is a design-review workflow, [open-sourced on October 22, 2026](https://opensource.googleblog.com/2026/10/introducing-elephant-goldfish-model-plugin.html) under Apache 2.0. The Elephant is one long session that holds the project context and drafts the spec. It writes no code. The Goldfish are fresh subagents that see only the design doc and the files it references.

```diagram-egm
```

The Goldfish run in three steps. First a comprehension check, where a Goldfish explains the design back. Then an antagonistic review by several Goldfish hunting for edge cases and hidden dependencies. Last, a go/no-go on file paths, data structures and function signatures. A human approves the spec before any code is written.

Google says thousands of its engineers use it. That is Google's claim, and the announcement gives no measured result. It also says what the tool is not for. Skip it for a small, clear bug fix, and a review [does not replace tests or human judgment](https://github.com/google/elephant-goldfish-model).

Cognition reached the same idea from the review side. Its Devin Review catches [an average of 2 bugs per PR, roughly 58% of them severe](https://cognition.com/blog/multi-agents-working), even on PRs Devin wrote itself. Cognition says this works best when the coding and review agents share no context beforehand. Its reasons: a clean context avoids context rot, and the reviewer is forced to reason backward from the implementation without the spec.

The same move works across time. Anthropic's [long-running harness](https://www.anthropic.com/research/effective-harnesses-for-long-running-agents) assumes every session starts with no memory. An initializer agent sets up the environment first: a script, a progress file, an initial git commit, and a feature list of over 200 items, all marked failing. The list is JSON because the model was less likely to overwrite it by accident than Markdown. Factory does it per feature. Each feature gets a fresh worker, and the shared state lives in files: a validation contract, a feature list, a services file and an AGENTS.md.

The crudest version is Geoffrey Huntley's [Ralph loop](https://codecentric.de/en/knowledge-hub/blog/the-ralph-wiggum-loop-autonomous-code-generation-with-a-fresh-context): the same prompt in a bash loop, a fresh context on every pass, until the checks pass.

Whether you need resets depends on the model. Anthropic found that Sonnet 4.5 showed "context anxiety", wrapping up early as it approached what it believed was its context limit, strongly enough that compaction alone was not sufficient. Opus 4.5 largely removed that behavior, and the harness dropped context resets entirely.

Isolation has limits. A fresh context removes conversation carry-over. It does not remove the model's blind spots, because the Goldfish usually run on the same model as the Elephant. That is my point, not Google's.

It also does not mean never share context. Cognition's 2025 argument was that parallel writers should share full context, and its April 2026 follow-up says that still holds for parallel-writer swarms. Isolate the reviewers and the fresh sessions. Keep the writes single-threaded.

## Move 2: Separate the writer from the judge

Anthropic's explanation is blunt. Asked to grade their own work, agents [tend to respond by confidently praising it, even when the quality is obviously mediocre](https://www.anthropic.com/research/harness-design-long-running-apps). Tuning a standalone evaluator to be skeptical turned out to be far more tractable than making a generator critical of its own work. Its evaluator used the Playwright MCP to click through the running app the way a user would, and the generator and evaluator agreed on a sprint contract before each sprint. Sprint 3 alone had 27 criteria. Anthropic is careful to add that the evaluator is still an LLM, inclined to be generous toward LLM-generated output.

Factory moves the judge's standard ahead of the code. Its orchestrator writes a [validation contract](https://factory.com/news/missions-architecture), a checklist of testable behaviors, before any features exist, so it is not influenced by the implementation. Fresh validators then run at each milestone: some review the code, others exercise the running system as a black box. Findings become fix features, and the loop repeats until the milestone passes.

Spotify's background coding agent, Honk, hides its verifiers (build, test, format) from the agent. After they pass, an LLM judge sees the diff and the original prompt. In [Spotify's December 2025 post](https://engineering.atspotify.com/2025/12/feedback-loops-background-coding-agents-part-3), the judge vetoes about a quarter of sessions, and the agent course-corrects about half the time. The most common trigger is the agent going outside its prompt, like refactoring code or disabling a flaky test. Spotify also wrote that it had yet to invest in evals for the judge.

There is a wrinkle. [InfoQ's report on a March 2026 QCon talk](https://infoq.com/news/2026/03/spotify-honk-rewrite) says the judge was later found too rigid, blocking valid changes, and was eventually removed once prompt-level verification proved enough. That is secondhand, and it conflicts with Spotify's own post from three months earlier. I would not call it settled. It does fit a theme in this post: some scaffolding is temporary.

Cursor's design has a [judge agent that decides at the end of each cycle](https://cursor.com/blog/scaling-agents) whether to continue, and the next cycle starts fresh. It also tried an "integrator" role for quality control and conflict resolution and removed it, because it created more bottlenecks than it solved.

Ramp is the counter-example. Its Inspect agent verifies its own work: for backend changes it can run tests, review telemetry and query feature flags, and for frontend changes it uses screenshots and live previews. [Ramp's post](https://builders.ramp.com/post/why-we-built-our-background-agent) describes no separate verifier agent. Its one stated safeguard is about people, not models. The PR is opened with the user's GitHub token, so nobody can approve their own change.

The judge is not free. Anthropic's rule of thumb is that [the evaluator is worth the cost when the task sits beyond what the current model does reliably solo](https://www.anthropic.com/research/harness-design-long-running-apps). On Opus 4.6, tasks inside that boundary made the evaluator unnecessary overhead.

## Move 3: Wrap the model in code

Anthropic's [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) separates workflows, where code defines the path the LLM follows, from agents, where the LLM directs its own process. Its advice is to use the simplest thing that works. Stripe's coding agents, which it calls Minions, show what that looks like at scale. [More than 1,300 Stripe pull requests merge each week](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2) that are completely minion-produced: human-reviewed, but with no human-written code.

The core idea is the blueprint, a workflow defined in code in which each node runs either deterministic code or an agent loop.

```diagram-blueprint
```

Implement task and Fix CI failures are agent nodes. Run configured linters and Push changes are plain code that never invoke an LLM. The retry policy is also code. After a push, CI runs and autofixes are applied. Failures with no autofix go back to an agent node for one more attempt, and after the second push and CI run the branch goes back to a human. Stripe's reason is cost: CI runs cost tokens, compute and time, with diminishing returns if an LLM keeps looping against a full CI run.

The environment is part of the wall. Minions run on the same standard devbox engineers use, an AWS EC2 instance with the code and running services. Stripe aims for one to be ready within 10 seconds, with no access to real user data, production services or arbitrary network egress. A central tool server called Toolshed holds nearly 500 MCP tools, and each agent gets only an intentionally small subset. Stripe's summary: "putting LLMs into contained boxes" compounds into system-wide reliability.

Spotify draws the same boundary. Its agent has very limited access: it can see the codebase, edit files and run verifiers as tools. Pushing code, talking to people on Slack and even writing prompts are handled by the surrounding infrastructure, and the agent runs in a container with limited permissions. Ramp gives each session its own sandboxed VM on Modal with a full dev environment, rebuilt from the repo every 30 minutes so it is never more than 30 minutes stale.

## Move 4: Spend model money by role

The cheapest model is not the right default, and neither is the most expensive one. Anthropic's research system paired an Opus 4 lead with Sonnet 4 subagents and [beat single-agent Opus 4 by 90.2% on an internal eval](https://www.anthropic.com/research/multi-agent-research-system). It also found that token usage alone explained about 80% of the variance on BrowseComp, and that the system used roughly 15 times the tokens of a chat.

Factory's Missions assign a different model to each role. The [Missions page](https://factory.com/news/missions) lists Opus 4.6 for orchestration, Sonnet 4.6 or Opus 4.6 for implementation, GPT-5.3-Codex for validation and Kimi K2.5 for research. Cursor says it now uses [the model best suited for each role](https://cursor.com/blog/scaling-agents) and found GPT-5.2 a better planner than GPT-5.1-Codex, even though the latter is trained specifically for coding.

The split can also run the other way. Cognition tried a cheap, fast primary model, SWE-1.5, that could consult a stronger one. [The cost and speed wins were real, but the quality ceiling was set by the primary](https://cognition.com/blog/multi-agents-working). It worked when both models were frontier models, which Cognition runs in production as Claude and GPT together. Routing research points the same direction. [RouteLLM](https://arxiv.org/abs/2406.18665) reports over 2x cost savings on widely used benchmarks, and [FrugalGPT](https://arxiv.org/abs/2305.05176) reports matching the best single model with up to 98% lower cost on some datasets, at 2023 prices. Those are best cases, so read the papers before leaning on the numbers.

The assignment has a shelf life. Anthropic dropped context resets when Opus 4.5 arrived and found the evaluator turned into overhead on Opus 4.6. Re-test the split on every model release, and delete the part that no longer carries weight.

## Putting it together

Here is the same map from the other side. Each line below is a move the team's own write-up describes. It is not a claim about what else they do.

```diagram-convergence
```

No team uses all four in the same way, and Ramp leans almost entirely on the third. But the moves recur, and each exists for the same reason: a model's output is cheap, and trusting it is not.

## The long-horizon case: Factory

Factory's Missions show the four moves at their most extreme. An orchestrator splits a project into milestones, writes the validation contract first, hands each feature to a fresh worker and treats git as the source of truth. Factory publishes numbers on how long that runs. By its own figures, [the median mission runs about 2 hours against about 8 minutes for a normal session](https://factory.com/news/missions), 37% run longer than 4 hours, and 14% run longer than 24 hours. The median mission uses 12 times the tokens of a normal session.

One example run from Factory's later architecture post shows where the time goes.

```chart-mission-time
```

Validation took 37.2% of the clock in that run, and orchestration took 2.3%. Of 61 implementation features, 21 were fix features, and every milestone converged in 2 to 4 validation rounds. It is one vendor example, but it makes a point: in a long run the checking is a large share of the work.

Factory lists its own open questions, and they are the right ones. How much parallelization actually helps. Correctness over long horizons, since errors accumulate. How broad a worker's scope should be. And how many layers of orchestrators are too many: one works for most projects, two might help for larger ones, and three starts to feel like a bureaucracy.

## Why not just run a swarm

Cursor started with the obvious design: equal agents coordinating through a shared file with locks. [Twenty agents slowed to the effective throughput of two or three](https://cursor.com/blog/scaling-agents), with most of their time spent waiting. Without hierarchy they also became risk-averse, avoiding hard tasks and making small, safe changes. What worked was planners that explore and create tasks, workers that grind on one task until it is done, and a judge that decides whether to continue. Cursor says that run produced over a million lines of code across 1,000 files in close to a week, building a browser from scratch.

![Flat swarm versus planner, workers and judge: twenty agents contending for one lock file next to a hierarchy of one planner, five workers and one judge.](/blog/every-harness-makes-the-same-four-moves/swarm-vs-hierarchy.png)

Cognition reversed its own 2025 position here. Its original post said most people should not build multi-agent systems. Its April 2026 post says those observations [still hold for parallel-writer swarms](https://cognition.com/blog/multi-agents-working) and that extra agents work when they contribute intelligence while writes stay single-threaded. Arbitrary networks of agents negotiating with each other, it says, are mostly a distraction. It also points out that the headline demos, a browser, a C compiler, a training-script optimizer, share a property most software does not: a simple, verifiable success criterion. The two companies also describe the browser's size differently, over a million lines at Cursor and 200 thousand in Cognition's post, so treat the demos as demos.

## A checklist you can steal

Strip the four moves down to questions you can ask of any harness.

![The harness checklist: can a fresh session resume from files alone, does anything other than the writer decide done, which steps could be plain code, which role gets the expensive model and when did you last re-test it, is the human gate still there.](/blog/every-harness-makes-the-same-four-moves/checklist.png)

On the last question, the human gate is not universal. EGM requires a human to approve the spec. Stripe's pull requests are human-reviewed. Ramp's only stated safeguard is that nobody approves their own change. Spotify's post does not describe one. If your harness has no human gate, make that a decision, not a default.

Anthropic ends its harness-design post with a line worth keeping: the space of interesting harness combinations [doesn't shrink as models improve. Instead, it moves](https://www.anthropic.com/research/harness-design-long-running-apps). The work is to keep finding the next combination, and to strip what no longer carries weight.

## What to take with salt

- Most numbers here come from the companies that built the systems. Google's announcement gives no measured result, and Factory's figures are its own telemetry.
- Factory's Missions page is dated February 2025 but names Opus 4.6 and GPT-5.3-Codex, and it gives the longest mission as 16 days in the text and 14 in a chart caption. I used its figures where they were internally consistent and its architecture post (April 2026) for the example run.
- Spotify's judge: Spotify's own post says it vetoes about a quarter of sessions. InfoQ's account of the later talk says it was removed. I could not reconcile the two.
- Ramp says about 30% of merged frontend and backend PRs are written by Inspect, with no date on the page. Other outlets quote higher figures, which I left out.
- The order of nodes in the Stripe diagram is simplified. Stripe names the nodes and describes the CI loop, but I did not find an ordered list.

### Sources

- Anthropic: [Harness design for long-running application development](https://www.anthropic.com/research/harness-design-long-running-apps) · [Effective harnesses for long-running agents](https://www.anthropic.com/research/effective-harnesses-for-long-running-agents) · [How we built our multi-agent research system](https://www.anthropic.com/research/multi-agent-research-system) · [Building effective agents](https://www.anthropic.com/research/building-effective-agents)
- Google: [Introducing the Elephant-Goldfish Model plugin](https://opensource.googleblog.com/2026/10/introducing-elephant-goldfish-model-plugin.html) · [EGM on GitHub](https://github.com/google/elephant-goldfish-model)
- Factory: [Introducing Missions](https://factory.com/news/missions) · [How Missions Work](https://factory.com/news/missions-architecture)
- Cursor: [Scaling long-running autonomous coding](https://cursor.com/blog/scaling-agents) · Cognition: [Multi-Agents: What's Actually Working](https://cognition.com/blog/multi-agents-working)
- Stripe: [Minions, Part 2](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2)
- Spotify: [Background Coding Agents, Part 3](https://engineering.atspotify.com/2025/12/feedback-loops-background-coding-agents-part-3) · [InfoQ on the QCon London 2026 talk](https://infoq.com/news/2026/03/spotify-honk-rewrite)
- Ramp: [Why we built our own background agent](https://builders.ramp.com/post/why-we-built-our-background-agent)
- Other: [Ralph loop write-up (codecentric)](https://codecentric.de/en/knowledge-hub/blog/the-ralph-wiggum-loop-autonomous-code-generation-with-a-fresh-context) · [RouteLLM](https://arxiv.org/abs/2406.18665) · [FrugalGPT](https://arxiv.org/abs/2305.05176)
