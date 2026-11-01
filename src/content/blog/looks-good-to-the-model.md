---
title: "Looks Good to the Model: The Discernment Gap in Agentic Coding"
excerpt: "The typing got cheap. The judging did not. On prompts, harnesses, loops and why the scarce skill in agentic coding is knowing when 'looks good' actually is good."
date: "2026-11-01"
tag: "Tech"
cover: "/blog/looks-good-to-the-model/cover.png"
---

## From typing code to approving it

I joined PayPal straight out of college in 2023. My first two years were manual software engineering: I read the code, wrote the code and broke the code. Today I mostly describe an outcome, supervise agents, and review what comes back.

> The typing got cheap. The judging did not.

Recently I was reviewing a colleague's pull request and stopped on a config value they had added. I asked them to walk me through it. There was a long pause, and then: "Let me ask Claude and get back to you."

Sure, I said. They came back with an answer. I asked why that particular number. Same reply: they'd have to ask Claude. When I asked whether they were convinced the setting would actually work, they told me the AI's summary at the end looked good.

This isn't a knock on my colleague. It is exactly what these tools make easy: a fluent summary, a feeling of having been through a review, and no one in the room who can defend the number. I told them that if we couldn't defend it ourselves, it was bound to break, and my sign-off wouldn't change that. So I sat down with them and walked through how to work out the right value analytically, so the decision would be one we made with our eyes open.

That exchange is what this post is about. Prompting didn't die. It turned into direction, and the real job became building a software lifecycle around the model that is resilient and verifiable. The scarce skill is no longer generating code. It is discernment: knowing when "looks good" means it is good, and not just that it looks good to the model.

## Three eras of telling a computer what to do

I think of my own career as three eras, and each one moved the human a step further from the keyboard.

| Era | What I write | Who verifies |
| --- | --- | --- |
| Manual | Code, line by line | Me, as I type |
| Assisted (vibe) | Prompts, then accept or reject | Me, if I bother |
| Harnessed (agentic) | Specs, constraints, checks and loops | The system first, me on the judgment calls |

A quick note on labels. Andrej Karpathy's "Software 1.0, 2.0, 3.0" numbers something different: handwritten code, learned neural-net weights, and then prompts as programs (his [Software 3.0 keynote](https://ikyle.me/blog/2025/andrej-karpathy-software-is-changing-again), June 2025). I'm borrowing the spirit, that English became a programming interface, but using my own names so the numbers don't collide.

The third row is the interesting one. In the first two eras the person who wrote the code was also its first reviewer. In the third, the author is a model, and the reviewer has to be designed.

## Vibe coding raised the floor

Karpathy coined "vibe coding" in February 2025. A year later, at Sequoia's AI Ascent in late April 2026, he put the contrast plainly: [vibe coding raises the floor, and agentic engineering raises the ceiling](https://aibuilderclub.com/blog/karpathy-agentic-engineering). Vibe coding means almost anyone can build software by describing it. That is a real, good thing.

It also has a limit. Simon Willison's rule of thumb is that vibe coding is fine [when the only person a bug can hurt is you](https://ai-news-site-1ih.pages.dev/news/vibe-coding-agentic-engineering-blurring-en). Once other people depend on the software, nobody is checking underneath the floor.

Two vendor studies show what that looks like. Both come from companies that sell related products, so treat the exact numbers as directional:

- [Veracode](https://www.veracode.com/press-release/ai-generated-code-poses-major-security-risks-in-nearly-half-of-all-development-tasks-veracode-research-reveals/) tested 100+ models on 80 coding tasks. In 45% of cases the code carried vulnerabilities, and security did not improve as the models got better at syntax.
- [CodeRabbit](https://coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report) compared 470 open-source pull requests. AI-co-authored PRs averaged 10.83 issues versus 6.45 for human-only PRs, about 1.7x more.

The floor went up. The question is what stops code from falling through it.

## Agentic engineering raises the ceiling

Karpathy's reason for the name, from his February 2026 retrospective: it is "agentic" because you orchestrate agents and provide oversight instead of writing the code yourself, and "engineering" because there is real craft in doing it well ([summary](https://noqta.tn/en/news/karpathy-hasnt-coded-since-december-ai-agents-psychosis-2026)).

Under that name sits a ladder. Each layer wraps the one below it, and each moves the human a step further from typing the next instruction.

| Layer | The question it answers | Where it shows up |
| --- | --- | --- |
| Prompt | How do I word this request? | Everyday chat and autocomplete |
| Context | What should the agent see? | [OpenAI's harness post](https://www.infoq.com/news/2026/02/openai-harness-engineering-codex) (Feb 2026) |
| Harness | What should the system prevent, measure and correct? | Same post: linters, structural tests, feedback loops |
| Loop | How do I stop being the one who prompts? | [Addy Osmani, "Loop Engineering"](https://oreilly.com/radar/loop-engineering) (Jun 2026): "one floor above the harness" |
| Graph | Which steps, gates and handoffs are explicit? | [LangChain](https://www.langchain.com/blog/3-years-of-graph-engineering-with-langgraph) (Jul 2026) |

```ladder
```

Three examples made this concrete for me:

- **OpenAI's Codex team** [shipped an internal product of over a million lines in five months](https://zby.github.io/commonplace/sources/harness-engineering-leveraging-codex-agent-first-world) with no manually written code. Their stated takeaway: the engineer's job becomes designing environments, specifying intent and building feedback loops.
- **Anthropic's long-running harness** [uses an initializer agent plus a coding agent that leaves clear artifacts for the next session](https://fooqux.com/article/878). A later post added a separate evaluator, because agents tend to grade their own work too generously ([summary](https://aicoding.csdn.net/6a238c6e10ee7a33f2786b54.html)).
- **The Ralph loop**, from Geoffrey Huntley, is [a bash loop that keeps re-running an agent on one task](https://leanware.co/insights/ralph-wiggum-ai-coding) until the work passes meaningful checks. The loop is trivial. The engineering is in the check.

A caution: don't memorize the names. LangChain itself notes that graph engineering is [the latest term in a run that includes prompt, context, harness and loop engineering](https://www.langchain.com/blog/3-years-of-graph-engineering-with-langgraph?from=bd_signal). What matters is the direction. A prompt is no longer a command I type. It is one input into a system that verifies its own output.

## The stack I want around the model

A harness isn't one tool. It is a multi-stage system covering the whole lifecycle, with a check at each stage. My working hypothesis is that an agent is trustworthy at a stage in proportion to how machine-checkable that stage is. That follows Karpathy's point that models are strongest in [verifiable domains](https://letsdatascience.com/news/karpathy-explains-vibe-coding-to-agentic-engineering-2d34b5c2), which is also why their skill is jagged.

![Trust follows verifiability: SDLC stages arranged from highly machine-checkable (prototyping, coding) to judgment-heavy (design and architecture review).](/blog/looks-good-to-the-model/verifiability.png)

| Stage | What can check it | Machine-checkable? | Where I am today |
| --- | --- | --- | --- |
| Prototyping | Does it run, does it show the idea | High | Solid |
| Coding | Compiler, type checker, unit tests | High | Solid |
| Linting and static analysis | Rules and structural tests | High | Solid |
| Testing | Test suite, coverage, mutation checks | High, if the tests are good | Improving |
| Debugging | Reproduce, fix, re-run the repro | Medium | Solid |
| Refactoring | Behavior-preserving tests | Medium | Solid |
| End-to-end integration | Full-flow tests and telemetry | Medium | Improving |
| Security | Scanners, plus threat-model judgment | Medium to low | Early |
| Code review | A second agent, then a human | Low | Improving (building a better review harness) |
| Design and architecture review | Human judgment and taste | Low | Maturing |

*Solid: I let the loop run and spot-check. Maturing: nearly there, with the checks holding up and only occasional human overrides. Improving: the checks exist and are getting stronger, but I still review closely. Early: I still do most of the thinking myself.*

The line isn't clean, and that's the interesting part. Where the machine can say "pass" or "fail," agents are already good. But design and architecture review is judgment-heavy and still maturing for me, while security is only partly checkable and still early. Checkability predicts where a row starts. Effort decides where it ends up: a row moves up when someone builds the harness for it, which is what I'm doing now for code review.

Testing is the telling row. Agents write plenty of tests, but a green suite is only as good as what it asserts, and no test can tell you whether a tuned number is the right one.

The interesting engineering is converting low rows into higher ones. OpenAI's team [enforced architectural boundaries with mechanical rules and structural tests](https://www.infoq.com/news/2026/02/openai-harness-engineering-codex), which turns a judgment call into a failing build. Every judgment you can turn into a check is one the model can iterate against without you.

The judgments I can't turn into checks are where my attention belongs. That is the next section.

## The discernment gap: "looks good to the model"

We used to say LGTM, looks good to me. Now it is drifting into looks good to the model: the agent's summary reads well, the checks are green, and I approve without being able to explain the change. The discernment gap is the distance between code that looks right and code I actually understand and can defend.

The evidence says the gap is real and widening:

- **Review became the bottleneck.** Faros AI's telemetry on 10,000+ developers found teams with high AI adoption completed 21% more tasks and merged 98% more PRs, but [PR review time rose 91% with no improvement at company level](https://faros.ai/research). That is vendor data, but the shape is the point: generation sped up, judgment didn't.
- **Reviewers tire.** CodeRabbit notes that [review pipelines were not built for this volume, and reviewer fatigue lets bugs through](https://coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report), and AI PRs had [a much heavier tail of issues](https://infoworld.com/article/4109129/ai-assisted-coding-creates-more-problems-report.html).
- **Feelings are a bad instrument.** In METR's 2025 randomized trial, experienced open-source developers [forecast a 24% speedup, were measured 19% slower, and still believed they'd been about 20% faster](https://kbss.felk.cvut.cz/web/investigating-ai-productivity-insights-from-the-early-2025-open-source-developer-study-open-mic-announcement). Those were early-2025 tools, and METR's own 2026 follow-up [called its new data an unreliable signal](https://conffab.com/?p=10163), so this is no verdict on today's agents. The durable lesson is that perceived speed and measured speed come apart.
- **Understanding erodes unless you work at it.** In an [Anthropic randomized trial of 52 mostly junior engineers](https://www.anthropic.com/research/AI-assistance-coding-skills), the AI-assisted group scored [17% lower on a comprehension quiz](https://infoq.com/news/2026/02/ai-coding-skill-formation/). Developers who used AI to ask conceptual questions scored [around 86%, while those who fully delegated scored under 40%](https://academy.dair.ai/papers/how-ai-impacts-skill-formation). Caveats: it is Anthropic's own study, small, and tested right after the task.
- **Even experts drift.** Willison, who draws a firm line between vibe coding and engineering, wrote in May 2026 that the two are [converging in his own work](https://ai-news-site-1ih.pages.dev/news/vibe-coding-agentic-engineering-blurring-en): he has started trusting coding agents the way he trusts a mature library, without reading every line.
- **There are names for the debt.** Osmani warns about [intent debt, comprehension debt and "cognitive surrender"](https://futureagi.com/blog/loop-engineering/what-is-loop-engineering/), the risk of losing track of what your own system does.

DORA's 2025 report frames the whole pattern: AI is an [amplifier of an organization's strengths and its dysfunctions](https://research.google/pubs/dora-2025-state-of-ai-assisted-software-development-report/). If your review culture is shaky, agents scale the shakiness.

Ilya Sutskever's relevance here is narrow but useful. In his November 2025 interview he described a [gap between how well models score on evaluations and their real-world impact](https://www.pulse.bot/ai/video/ilya-sutskever-were-moving-from-the-age-of-scaling-to-the-age-of-research-dfc70f80-4879-4278-8e91-2022a4a5eda2/), and argued they [generalize worse than people](https://app.daily.dev/posts/ilya-sutskever-we-re-moving-from-the-age-of-scaling-to-the-age-of-research-wrp8lesoc). A green dashboard is not understanding, and the model is strongest exactly where it's easiest to measure.

### How I try to close the gap

1. **Separate the writer from the checker.** A second agent with different instructions, or a different model, reviews the first. Anthropic's planner, generator and evaluator split exists because the author is a lenient grader.
2. **Turn judgment into checks.** Write the test, the lint rule or the structural constraint first, so "correct" is something the system can fail.
3. **Explain it back before merging.** If I can't say in my own words what changed and why, it doesn't merge. This is the conceptual-inquiry pattern from the Anthropic study, applied to review.
4. **Keep changes reviewable.** Faros saw PRs grow 154% with heavy AI use. I cap what an agent can ship in one change to what a human can really read.
5. **Own the spec.** If the intent is vague, the agent's output can be perfect and still wrong. That is intent debt.

![The discernment loop: own the spec, writer agent builds, machine checks, checker agent reviews, then a human gate: can I explain it back in my own words?](/blog/looks-good-to-the-model/discernment-loop.png)

The one I lean on hardest is the explain-back rule, and the config review above is why. "Can you walk me through why that number?" is the cheapest discernment test I know. It costs a minute, and it tells you right away whether a human is behind the change or only a summary.

## Why studying matters more now, not less

If discernment is the scarce skill, it has to come from somewhere. Willison's observation is that [AI tools amplify existing expertise](https://simonwillison.net/2025/Oct/07/vibe-engineering/): the more experience you bring, the better the results you get from agents. Reviewing a pull request well is a skill you build by understanding systems, not by prompting more.

The Anthropic study points the same direction. The tool wasn't the deciding factor. How people used it was: asking why, probing concepts and reading explanations preserved learning, while handing everything over did not. Using an agent to avoid learning is borrowing against the future version of you who has to review its output.

So here is the reading list I'd hand to anyone making this transition. Start with the agent-specific material, then pair it with a fundamentals book, because the second is what lets you judge the first:

- **Simon Willison, [Agentic Engineering Patterns](https://simonwillison.net/guides/agentic-engineering-patterns/).** A living guide of practical chapters, including red/green TDD, testing agents' work and the anti-patterns to avoid.
- **Birgitta Böckeler, [Harness Engineering for Coding Agent Users](https://martinfowler.com/articles/harness-engineering.html).** The clearest mental model I've seen for wrapping an agent in guides (before it acts) and sensors (after).
- **Ryan Lopopolo, [Harness Engineering: Leveraging Codex in an Agent-First World](https://openai.com/index/harness-engineering/).** The OpenAI experiment behind the million-line claim, with the details on context, constraints and cleanup.
- **Anthropic, [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents).** When to use a fixed workflow and when to let an agent decide, with a bias toward the simplest thing that works.
- **Addy Osmani, [Loop Engineering](https://oreilly.com/radar/loop-engineering).** What changes when you stop being the one who prompts, plus the debts that come with it.
- **DORA, [State of AI-assisted Software Development 2025](https://research.google/pubs/dora-2025-state-of-ai-assisted-software-development-report/), and Anthropic's [skill-formation study](https://www.anthropic.com/research/AI-assistance-coding-skills).** The two research reports I'd read in full rather than through summaries.
- **Martin Kleppmann and Chris Riccomini, [Designing Data-Intensive Applications, 2nd edition](https://www.oreilly.com/library/view/designing-data-intensive/9781098119058/).** The fundamentals on reliability, scalability and distributed systems that tell you whether an agent's design is sound.

The skill that matters most is an old one: deriving a decision from first principles. When I sat down with my colleague, there was no trick. We worked out the number from the system's actual constraints and checked it against what we'd expect to see. Once you can do that, an agent's suggestion stops being an answer you must trust and becomes a hypothesis you can test.

## So, is software engineering dead?

No. The data says the job is changing and the entry ramp is thinning, which is a different story from "dead."

| Signal | Figure | Source |
| --- | --- | --- |
| Software developer employment outlook | About 10% growth, 2025 to 2035 | [BLS projection, as reported](https://dev.to/stackchief/will-ai-replace-software-engineers-what-the-2026-data-says-3l9a) |
| Computer programmer outlook | About 7% decline over the same period | [BLS projection, as reported](https://www.secondtalent.com/resources/the-future-of-software-engineering-jobs-in-2026-what-hiring-managers-need-to-know/) |
| Software job postings vs. Feb 2020 | About 27.5% below | [Indeed Hiring Lab, as reported](https://www.tekrevol.com/blogs/software-development-statistics/) |
| Senior share of posting growth, May 2025 to May 2026 | 71% | [Indeed Hiring Lab, as reported](https://rockstardeveloperuniversity.com/entry-level-software-engineer-job-market-statistics/) |
| Entry-level share of Q1 2026 software postings | 4.5% | [Indeed Hiring Lab, as reported](https://dev.to/stackchief/will-ai-replace-software-engineers-what-the-2026-data-says-3l9a) |
| Employment of 22 to 25 year-olds in AI-exposed jobs | 13% relative decline since late 2022 | [Stanford "Canaries in the Coal Mine?"](https://www.theregister.com/2025/08/26/ai_hurts_recent_college_grads_jobs/) |

Two things are true at once. Overall demand for software engineers is still projected to grow, while the narrow work of translating a spec into code, the classic programmer role, is the part projected to shrink. And the people feeling it first are early-career. The Stanford authors are careful that [other factors may influence their estimates](https://dev.to/prpatel05/the-entry-level-job-is-the-canary-2m3b), but the direction is hard to ignore.

Geoffrey Huntley has the cleanest frame I've seen: software development as a profession is [effectively dead, while software engineering is more alive than ever](https://devinterrupted.substack.com/p/inventing-the-ralph-wiggum-loop-creator?open=false). Typing is the part that died. Deciding what to build, how to constrain it, and whether it is right did not.

That thinning ramp worries me most, because of everything above. Discernment comes from reps. If juniors lose the reps that taught the seniors, who becomes the next generation of people able to say no to a model?

My answer is the same as the one I'd give a junior: lean into the new job. Learn to build the harness, not just run the agent.

## Where this goes next

Vibe coding raised the floor. Agentic engineering raises the ceiling, but only if someone is still doing the discerning. The real upgrade isn't a better prompt. It is a system where checks are cheap, review is protected, and approval means understanding.

In the next post I'll get practical about becoming a directional, discerning orchestrator: workflows, sub-agent patterns, graphs and loops, and how to design each so the products you ship are fast, scalable and secure.

### Sources

- Karpathy: [Software 3.0 keynote summary](https://ikyle.me/blog/2025/andrej-karpathy-software-is-changing-again) · [Sequoia AI Ascent 2026 framing](https://aibuilderclub.com/blog/karpathy-agentic-engineering) · [Agentic engineering retrospective](https://noqta.tn/en/news/karpathy-hasnt-coded-since-december-ai-agents-psychosis-2026)
- Harnesses and loops: [OpenAI harness engineering](https://www.infoq.com/news/2026/02/openai-harness-engineering-codex) · [Anthropic long-running agents](https://fooqux.com/article/878) · [Osmani, Loop Engineering](https://oreilly.com/radar/loop-engineering) · [LangChain, graph engineering](https://www.langchain.com/blog/3-years-of-graph-engineering-with-langgraph) · [Huntley's Ralph loop](https://leanware.co/insights/ralph-wiggum-ai-coding)
- Evidence: [METR 2025 trial](https://kbss.felk.cvut.cz/web/investigating-ai-productivity-insights-from-the-early-2025-open-source-developer-study-open-mic-announcement) · [METR 2026 update](https://conffab.com/?p=10163) · [DORA 2025](https://research.google/pubs/dora-2025-state-of-ai-assisted-software-development-report/) · [Anthropic skill-formation study](https://www.anthropic.com/research/AI-assistance-coding-skills) · [Faros AI](https://faros.ai/research) · [CodeRabbit](https://coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report) · [Veracode](https://www.veracode.com/press-release/ai-generated-code-poses-major-security-risks-in-nearly-half-of-all-development-tasks-veracode-research-reveals/)
- People and jobs: [Willison on vibe coding vs. agentic engineering](https://ai-news-site-1ih.pages.dev/news/vibe-coding-agentic-engineering-blurring-en) · [Sutskever interview](https://www.pulse.bot/ai/video/ilya-sutskever-were-moving-from-the-age-of-scaling-to-the-age-of-research-dfc70f80-4879-4278-8e91-2022a4a5eda2/) · [Stanford "Canaries"](https://www.theregister.com/2025/08/26/ai_hurts_recent_college_grads_jobs/) · [2026 job-market data](https://dev.to/stackchief/will-ai-replace-software-engineers-what-the-2026-data-says-3l9a)
