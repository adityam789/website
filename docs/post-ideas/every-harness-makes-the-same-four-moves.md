# Post idea: Every serious agent harness makes the same four moves

Status: outline plus two research passes (latest 2026-11-04). Not published. Follow-up to "Looks Good to the Model", which promised a practical post on workflows, sub-agents, graphs and loops.

Source tags: [P] primary, read. [P2] primary, re-read in pass 2. [S] secondary only. [!] conflict or caveat.

## Title and thesis

Working title: Every serious agent harness makes the same four moves
Alternates:
- Design with an elephant, review with a goldfish
- Stop adding agents. Start adding walls.

Google EGM, Factory Missions, Cursor, Stripe, Spotify and Ramp look different. They make the same four decisions:
1. Isolate context. Fresh sessions beat one long one. Pass work through files.
2. Separate the writer from the judge.
3. Wrap the model in deterministic code.
4. Spend model money by role, and re-test the split every model release.

"Campaign-style coding" here means long-running, multi-session work with state in files (feature list, progress log, git). That is my reading, not a standard term.

One tension to resolve in the post: Cognition's principle is that writers should share full context, which sounds like the opposite of move 1. The resolution is that isolation applies to reviewers and to fresh sessions that resume from files. Writes stay single-threaded and share context.

## Outline

### 1. Hook
- Anthropic, same prompt: $9 and 20 minutes solo, versus $200 and 6 hours with planner, generator and evaluator. The solo app's core feature did not work. [P, not re-checked]
- A later, simplified run on Opus 4.6 cost about $125 and took 3h50m. [P, not re-checked]
- Promise: why the gap exists, and what harness builders keep rediscovering.

### 2. The four patterns
- Campaign: long work across sessions, state in files.
- Graph or workflow: fixed steps in code, the agent is free only inside a step.
- Big agent, small agent: strong and cheap models split by role.
- Elephant-Goldfish: design in a long context, review in fresh ones.
- One line each, then the claim that all four share the same four moves.
- Asset: image 2 (patterns map).

### 3. Move 1: isolate context
- EGM is a design-review workflow, not a model. The Elephant is one long session that holds project context, drafts the spec and writes no code. Goldfish are fresh subagents that see only the doc and the files it references. [P2: Google Open Source Blog, Oct 22, 2026]
- The goldfish protocol has three steps: a comprehension check (explain the design back), an antagonistic review by several goldfish, and a final go/no-go on file paths, data structures and signatures. The README mentions five review stages. No reviewer count is stated anywhere. [P2]
- A human approves the spec before code. [P2]
- Usage is Google's own claim: "Thousands of Googlers use this plugin every day" (blog) and "Thousands of Google engineers" (README). No measured results. Apache 2.0, not an officially supported Google product. [P2]
- Google's stated limits: skip it for a small, clear bug fix. The review stops if the agent can't create fresh subagents. "A review does not replace tests or human judgment." [P2]
- Cognition: its reviewer works best with no shared context. Devin Review finds about 2 bugs per PR, roughly 58% severe. Reasons: context rot, and reasoning backward from the diff without the spec. [P]
- Anthropic's long-running harness: an initializer writes a 200+ item feature list (all failing), a progress file and a git commit. JSON beat Markdown because the model edited it less. [P]
- Factory: each feature gets a fresh worker. Shared state lives in files: validation-contract.md, features.json, services.yaml, AGENTS.md. [P2: factory.com, Apr 10, 2026]
- Ralph loop (Huntley): the same prompt in a bash loop, fresh context each pass. Anthropic cites it. [!] Secondary sources disagree on its origin date (May or July 2025). Huntley's own post not reached. [S]
- Compaction versus reset: Sonnet 4.5 showed "context anxiety" and needed resets. Opus 4.5 mostly did not. [P]
- Limit: a fresh context removes conversation carry-over, not model blind spots, because reviewers usually share the Elephant's model. This is my point, not Google's.
- Counterpoint: Cognition's "share full context" principle covers parallel writers. Its 2026 follow-up says the original still holds for parallel-writer swarms. [S for the 2025 essay]

### 4. Move 2: separate the writer from the judge
- Anthropic: agents praise their own work. A standalone evaluator is easier to tune skeptical than a generator is to make self-critical. Out of the box Claude was a poor QA agent. The evaluator uses Playwright, a sprint contract is agreed first, and Sprint 3 alone had 27 criteria. [P]
- Factory writes a validation contract before any features, so it is "not influenced by the implementation". Fresh validators then run at each milestone: scrutiny validators review the code, user-testing validators exercise the app as a black box. Findings become fix features, and the loop repeats until the milestone passes. [P2]
- Factory's worked example (one vendor run, a Slack clone): 16.5 hours; orchestration 2.3%, implementation 60.5%, validation 37.2%; 21 of 61 implementation features were fix features; every milestone converged in 2 to 4 validation rounds. [P2] Asset: image 6.
- Spotify Honk: verifiers (build, test, format) are hidden from the agent, then an LLM judge sees the diff and the original prompt. The judge vetoes about a quarter of sessions, and the agent course-corrects half the time. The most common trigger is the agent going outside its prompt. Spotify wrote: "We have yet to invest in evals for our judge." [P2: Dec 9, 2025]
- [!] InfoQ (Mar 18, 2026) reports from the QCon London talk that the judge was found too rigid and eventually removed once prompt-level verification proved enough. That is secondhand and conflicts with Spotify's Dec 2025 post. Attribute it to InfoQ and use it only as "judges may be temporary scaffolding". [P2]
- Cursor: a judge agent decides at the end of each cycle whether to continue. An "integrator" role was removed because it became a bottleneck. [P]
- Counter-example: Ramp Inspect verifies its own work with tests, telemetry, feature flags and screenshots. Its post describes no separate verifier. Its one review safeguard: the PR is opened with the user's GitHub token, so nobody can approve their own change. [P2]
- Cost: Anthropic says the evaluator pays off only when the task is beyond what the model does reliably alone. It became overhead on tasks Opus 4.6 handled itself. [P] Asset: image 5.

### 5. Move 3: determinism around the model
- Anthropic: workflows run LLMs along predefined code paths, agents direct their own process. Use the simplest thing that works. [P]
- Stripe Minions (Feb 19, 2026): 1,300+ PRs merged per week with no human-written code, still human-reviewed. A "blueprint" is a workflow in code. Agent nodes: "Implement task", "Fix CI failures". Plain-code nodes: "Run configured linters", "Push changes". CI policy: one retry, then a human. Devbox ready in about 10 seconds, forked Block goose, Toolshed with nearly 500 tools and a small subset per agent. [P, not re-checked] Asset: blueprint diagram (built).
- Spotify: the agent has "very limited access". It sees the codebase, edits files and runs verifiers as tools. Pushing code, Slack and prompt authoring happen in surrounding infrastructure. It runs in a container with limited permissions. [P2] Do not write "can only edit files". The source does not say "only".
- Ramp: one sandboxed VM per session on Modal. Images are rebuilt every 30 minutes, so a repo is at most 30 minutes stale. OpenCode is the agent. Follow-up prompts are queued instead of injected mid-run, and file edits are blocked until sync finishes. [P2]
- LangGraph is the common framework for this style. Secondary only. [S]

### 6. Move 4: spend model money by role
Strong plans, cheap executes:
- Anthropic's research system: Opus 4 lead plus Sonnet 4 subagents beat single-agent Opus 4 by 90.2% on an internal eval. Token use explained 80% of BrowseComp variance. About 15x the tokens of a chat. [P]
- Factory Missions: orchestrator Opus 4.6, implementation Sonnet 4.6 or Opus 4.6, validation GPT-5.3-Codex, research Kimi K2.5. [P2]
- Cursor chose the best model per role. GPT-5.2 was a better planner than a coding-tuned model. [P]

Cheap leads, strong consults:
- Cognition's "smart friend" failed with SWE-1.5 as the primary and worked across two frontier models. [P]
- RouteLLM: the abstract claims over 2x cost savings. LMSYS's launch post says its routers matched a commercial router while over 40% cheaper (GPT-4 Turbo against Mixtral 8x7B). FrugalGPT: matches the best single LLM with up to 98% less cost, or gains 4% accuracy at equal cost. 98% is a best case on its datasets at 2023 prices. Read from abstracts and summaries only; open the papers (arXiv 2406.18665, 2305.05176) before quoting. [P-abstract]
- Block: BuilderBot runs agent fleets from Slack on Goose, but an interview says Block prefers single-agent patterns and single-model context summarization. The two sources don't reconcile. [S, !]

### 7. Spotlight: Factory and the long-horizon case
- Design: an orchestrator splits the project into milestones, writes the validation contract first, gives each feature a fresh worker, and treats git as the source of truth. [P2]
- Factory's numbers: the median mission runs about 2 hours against about 8 minutes for a normal session; 65% run over 1 hour, 37% over 4 hours, 14% over 24 hours; median 12x the tokens; about 3 messages a minute at about 19K tokens, against 6 at 11K. [P2]
- [!] Page problems: the Missions page is dated Feb 26, 2025 but names Opus 4.6 and GPT-5.3-Codex. The longest mission is 16 days in the text and 14 in a chart caption. "~45K tokens/min" does not match its own per-message numbers. The command is /enter-mission on one page and /missions on the other. Cite the architecture page (Apr 10, 2026) for anything dated, and skip the burn rate. [P2]
- Context compression study (Dec 16, 2025): structured, anchored summaries scored 3.70 against Anthropic's 3.44 and OpenAI's 3.35. Every method was weak on artifact trail (2.19 to 2.45 out of 5): agents forget which files they touched. Factory's advice: optimize tokens per task, not per request. Vendor result on Factory's data, scored by an LLM judge. [P, not re-checked]
- Close on Factory's four open questions: how much parallelization helps, correctness over long horizons, worker scope, and recursive management depth ("Three starts to feel like a bureaucracy"). [P2]

### 8. Counterweight: why not run a swarm
- Cursor (Jan 14, 2026): equal agents sharing a lock file cut 20 agents down to the throughput of 2 or 3. Without hierarchy they became risk-averse. Planners, workers and a judge fixed it, producing over a million lines of a browser in about a week. Many gains came from removing structure. [P] Asset: image 8.
- Cognition (Apr 22, 2026) reversed its 2025 "Don't Build Multi-Agents" stance. Extra agents that add intelligence work while writes stay single-threaded. Unstructured swarms are "mostly a distraction". [P]

### 9. Smaller teams
- Ramp Inspect: about 30% of merged frontend and backend PRs are written by Inspect, with no date on the page. Skip the 40%, 50% and 75% figures from other outlets; they conflict and are undated. Quotable: "Owning the tooling lets you build something significantly more powerful than an off-the-shelf tool will ever be. After all, it only has to work on your code." [P2]
- Block: BuilderBot on Goose, about 5,000 weekly Goose users per an interview. [S]
- Sourcegraph Amp: only secondary descriptions (Oracle as an on-demand second-opinion subagent, subagents for context isolation). Read ampcode.com before using. [S]
- Vercel: course material on explorer and executor subagents. Not a production post. [S]
- Shopify: nothing found.

### 10. Close: a checklist to steal
- Can a fresh session resume from files alone?
- Does anything other than the writer decide "done"?
- Which steps could be plain code instead of a prompt?
- Which role gets the expensive model, and when did you last re-test that?
- Is the human gate still there? EGM (spec approval), Stripe (human review) and Ramp (no self-approval) show one. Spotify's post does not describe one.
- End on Anthropic's line: the space of useful harness combinations does not shrink as models improve, it moves. Strip what no longer carries weight. Spotify's possible judge removal is a live example.
- Asset: image 9 (checklist card), image 3 (convergence).

## Assets

| # | Asset | How | Status |
|---|---|---|---|
| 1 | Cover | Image generator | Prompt below |
| 2 | Four patterns map | Image generator | Done: `public/blog/every-harness-makes-the-same-four-moves/patterns-map.png` |
| 3 | Convergence diagram | Code (`diagram-convergence`) | Built. The generated version had two wrong lines, so the prompt is retired |
| 4 | Elephant-Goldfish flow | Code (`diagram-egm`) | Built |
| 5 | Cost of the judge | Chart in code | Not built |
| 6 | Where a 16.5 h mission's time goes | Chart in code | Not built |
| 7 | Stripe blueprint | Code (`diagram-blueprint`) | Built |
| 8 | Swarm versus hierarchy | Illustration or code | Not built |
| 9 | Checklist card | Illustration or code | Not built |

Use in a post with a code fence: three backticks followed by `diagram-egm`, `diagram-blueprint` or `diagram-convergence`, then a closing fence.

Published as `src/content/blog/every-serious-agent-harness-makes-the-same-four-moves.md`. The cover prompt is also here (16:9):
```text
Editorial illustration for a software engineering blog post titled "Every serious agent harness makes the same four moves". A small glowing amber cube floats in the center of four tall translucent teal walls arranged as a square courtyard, seen from a slightly elevated isometric angle. Each wall carries one minimal glyph: a blank page, a balance scale, a gear, a stack of coins. Deep navy background with faint grid lines, calm and minimalist, lots of negative space. No text, no people, no robots. 16:9.
```

## Research log

Pass 2 (2026-11-04) re-read as primary: Google's EGM blog, README and egm.dev; Ramp's post; Factory's Missions and Missions architecture pages; Spotify Part 3; InfoQ's QCon write-up.
Not re-checked: Anthropic's four posts, Cursor, Stripe, Cognition's 2026 post, Factory's compression study.
Still secondary: Huntley's Ralph posts, Cognition's 2025 essay, LangGraph, Block, Sourcegraph Amp, Vercel's course.
Open: read the two arXiv papers before quoting; ask Factory which date is right for Missions; find Spotify Part 2 and 4 or the talk recording to settle the judge question.

## References

Google EGM
- [P2] Introducing the Elephant-Goldfish Model plugin: https://opensource.googleblog.com/2026/10/introducing-elephant-goldfish-model-plugin.html
- [P2] README: https://github.com/google/elephant-goldfish-model · https://egm.dev
- [S] Dave Rensin's essay: https://medium.com/@drensin/elephants-goldfish-and-the-new-golden-age-of-software-engineering-c33641a48874

Anthropic [P]
- Multi-agent research system (Jun 13, 2025): https://www.anthropic.com/research/multi-agent-research-system
- Effective harnesses for long-running agents (Nov 26, 2025): https://www.anthropic.com/research/effective-harnesses-for-long-running-agents
- Harness design for long-running application development (Mar 24, 2026): https://www.anthropic.com/research/harness-design-long-running-apps
- Building effective agents (Dec 19, 2024): https://www.anthropic.com/research/building-effective-agents

Factory
- [P2] Introducing Missions: https://factory.com/news/missions
- [P2] How Missions Work (Apr 10, 2026): https://factory.com/news/missions-architecture
- [P] Evaluating Context Compression (Dec 16, 2025): https://factory.com/news/evaluating-compression

Cursor [P]: https://cursor.com/blog/scaling-agents
Cognition: [P] https://cognition.com/blog/multi-agents-working · [S] https://cognition.ai/blog/dont-build-multi-agents
Stripe [P]: https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2

Spotify
- [P2] Part 3 (Dec 9, 2025): https://engineering.atspotify.com/2025/12/feedback-loops-background-coding-agents-part-3
- [P2, secondhand] InfoQ on the QCon London 2026 talk (Mar 18, 2026): https://infoq.com/news/2026/03/spotify-honk-rewrite

Ramp
- [P2] Why we built our own background agent: https://builders.ramp.com/post/why-we-built-our-background-agent
- [S] https://www.zenml.io/llmops-database/building-a-custom-background-coding-agent-for-production-software-development · https://wavect.io/blog/ramp-inspect-background-coding-agent-infrastructure-2026/ · https://modal.com/blog/how-ramp-built-a-full-context-background-coding-agent-on-modal

Other
- [S] Ralph loop: https://codecentric.de/en/knowledge-hub/blog/the-ralph-wiggum-loop-autonomous-code-generation-with-a-fresh-context
- [P-abstract] RouteLLM https://arxiv.org/abs/2406.18665 · https://lmsys.org/blog/2024-07-01-routellm/ · FrugalGPT https://arxiv.org/abs/2305.05176
- [S] Block: https://thenewstack.io/how-block-manages-its-fleet-of-ai-coding-agents-from-slack/ · https://gradientflow.com/can-a-single-agent-automate-90-of-your-code-fixes-block-thinks-so/
- [S] LangGraph 1.0: https://medium.com/@romerorico.hugo/langgraph-1-0-released-no-breaking-changes-all-the-hard-won-lessons-8939d500ca7c
- [S] Vercel course: https://vercel.com/academy/build-ai-agent-harness
