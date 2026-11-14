# Post idea: decision models (a three-part series)

Status: researched outlines from Aditya's voice dump, 2026-11-14. Not drafted. Recommendation: three posts, not one. The dump holds three separate arguments (what it is, how to use it responsibly, where it fits), each with its own evidence.

Tags: [A] Aditya's claim. [R] researched, source below. [+] angle I'm suggesting. [?] verify before publishing. [!] correction to the dump.

## Read first: what the research changed

- [!] Names. "Jeff" is **Jev**, from **TypeSafe AI**, launched 15 Sep 2026. TypeSafe calls the category **System One models** (after Kahneman's fast System 1). "Gwen" is **Qwen**. [R1][R2][R3]
- [!] The three primitives are **choice** (pick one, up to 255 options on most models), **noul** (yes/no as a probability of yes) and **score**. That is where "255" and "NOUL" come from. [R3][R4]
- [!] **Multimodal has already landed.** Google's Gemini Decisions API (11 Nov 2026) takes text, image, audio, video and PDF; Perplexity's open decider takes text and images. Your "not here yet" section should become "it just arrived, here is what it unlocks". [R5][R6]
- [!] **"It's still a decoder" is only partly right.** Strands Decider keeps a Qwen decoder torso but removes the language-model head and adds a ~1M-parameter pointer head, so it cannot generate text at all. Cloudflare's Clef runs a prefill-only pass and scores the allowed choices. Laya is reported as encoder-based. Jev's architecture is undisclosed. Safer claim: "it is a transformer language model with the generation step taken off". [R6][R7][R8][R9]
- [!] **"Not general purpose" needs sharpening.** These models are sold as general zero-shot classifiers, and that is their real advantage over a fine-tuned BERT (no data needed). Your point survives in a stronger form: general across tasks is not the same as reliable on *your* data. Calibration depends on your distribution. [R10][R11]
- [!] **Hosted Jev cannot be fine-tuned** (same weights for every account). Fine-tuning applies to the open models. For hosted ones the equivalent is fitting a small calibrated layer on your own labels. [R12]
- [+] Your RL instinct has a hook: TypeSafe says Jev is trained with "Reinforcement Learning for Calibrated Decisions" (RLCD). But for a team adopting these models, the evidence favours supervised fine-tuning and teacher-student distillation over RL. Frame RL as what the vendor does, distillation as what you do. [R13][R14][R15]
- [?] This category is two months old and much of what ranks for it is thin or AI-written. I've marked which sources are primary. Re-read the primary ones before quoting numbers.
- [!] Regulated-environment claims touch your employer's domain. Keep examples generic.

---

## Post 1: A decision model is still a language model. It just stopped talking.

Thesis [A][+]: decision models are transformers with the writing step removed. Understanding what was removed tells you what they can and can't do.

1. Hook [A]: "it's not an LLM, it doesn't write anything." It is. Here is what's inside.
2. What it is [R]: state plus typed questions in, probabilities out. Choice, noul, score. One pass, many questions answered in parallel. [R3][R4][R9]
3. The lineage [R]: Jev (Sep 2026) → open clones on Qwen and Gemma within weeks → five commercial APIs in one day (OpenAI, Microsoft, Perplexity, Cloudflare, Liquid) → Hugging Face and Google in November. [R2][R5][R16][R17]
4. Under the hood [R], three designs, one table:
   | Design | Example | What changed vs. a chat model |
   |---|---|---|
   | Read the option probabilities from a normal LLM | open reproductions, SemIf | Nothing in the weights; only how you read the output |
   | Prefill-only pass, score allowed choices | Cloudflare Clef | No decode loop |
   | Remove the LM head, add a small decision head | Strands Decider 2B (Qwen torso + ~1M-param head) | Cannot generate text |
   [R6][R7][R8][R18]
5. Why this is fast and cheap [R]: no output tokens to generate; pricing reflects it (about $0.10 per million input tokens with output free at OpenAI and Google; Jev listed at $0.042). [R5][R17][R19]
6. What you give up [+]: no explanation, no free-form fallback, a fixed answer space.
7. Diagram [+]: a chat model and a decision model side by side, same torso, different last step.

## Post 2: Zero-shot is a demo. Calibrated on your data is a product.

Thesis [A]: in payments, compliance or any regulated setting, a decision model is only usable once you have measured precision, recall and calibration on your own labelled data. Usually that means fitting or fine-tuning it.

1. Hook [A]: the hype says "drop it in". The question is what happens when it is wrong and software acts on it.
2. What the independent evidence says [R]:
   - Calibration is good on the vendor's data and not guaranteed on yours. [R10][R11]
   - An independent benchmark found weaker results on fine-grained labels, noisy labels, subjective rubrics and low-resource languages, and that yes/no outputs sometimes needed threshold tuning. [R11] [?] find the benchmark paper itself (likely arXiv 2609.24574) and cite it directly. [R20]
   - Calibration alone is not enough: a perfectly calibrated model at 60% accuracy lets almost nothing through a 0.90 confidence bar. [R9]
3. Fine-tuning works, and the research predates this hype [R]:
   - Fine-tuned small models beat zero-shot GPT-4 and Claude Opus on classification across sentiment, stance, emotion and party position. Bucher & Martini, 2024. [R21]
   - "Releasing the Inner Jev" (Oct 2026): open LLMs with LoRA plus a decision head match Jev's accuracy with lower calibration error. [R13] [?] read the paper, not the summary.
   - On a hosted model, a fitted layer on 140 labels moved accuracy from 77% to 87% and cut calibration error from 0.151 to 0.030. One practitioner write-up, small sample. [R12]
4. No labels? Teacher-student [R]: "Distilling Step-by-Step" trained a 770M T5 that beat a few-shot 540B PaLM using 80% of the data, by distilling the LLM's rationales as well as its labels. Hsieh et al., ACL Findings 2023. [R15]
5. The hot take as a ladder [A][+]:
   1. Start with a general LLM. Log every decision and outcome.
   2. Shadow-run a decision model on the same traffic. Compare.
   3. Set thresholds on your data. Add an abstain band: a third answer that sends the case to a human. [R22]
   4. Fine-tune or fit a calibrated layer once you have labels (human or LLM-teacher).
   5. Promote it. Keep the LLM as the escalation path. Monitor drift.
   This is the same migration NVIDIA's position paper proposes for agents (log, cluster, fine-tune, route). [R14]
6. Why regulated settings raise the bar [R]: US bank model-risk guidance (SR 11-7) expects conceptual soundness, ongoing monitoring and outcomes analysis, and applies to vendor models too. [R23][R24] [?] A 2026 update (SR 26-2) is reported; verify from the regulator before citing. [R25]
7. Checklist [+]: precision and recall per class, not F1 alone; calibration error on your data; coverage at your confidence bar; an abstain path; drift alarms; a documented fallback.

## Post 3: Where decision models earn their place

Thesis [A]: use them where the answer space is closed, the call repeats at volume, and a wrong answer is cheap or caught.

1. Routing [A][R]: choose which model handles a request. RouteLLM (ICLR 2025) trained routers, including BERT and causal-LLM classifiers, that cut cost by over 2x without sacrificing quality. NVIDIA argues most agent calls are repetitive and scoped, and belong on small models. [R26][R14]
2. Classification and triage [A][R]: tickets, intents, similarity, categories. Filter with the decision model, send only hard cases to the LLM. [R1][R3]
3. Rating [A][R]: rubric scores on a scale. [+] Note the known weakness on subjective rubrics from Post 2. [R11]
4. Guardrails [R][+]: grounding, policy and safety checks on an agent's proposed action. Named use in the open models' own docs. [R7][R27]
5. Many small questions [R][+]: ask ten narrow yes/no questions in one pass and combine them in code, or feed them as features to a small classical model. [R3]
6. Multimodal [A][!]: now real. "Does this photo show damage" is a listed use for Google's endpoint. Your camera examples (object good/bad, known/unknown visitor) fit here. [R5]
7. Where not to use them [+]: open-ended answers, anything needing an explanation, high-stakes calls without your own evaluation, tasks where the label set keeps changing.
8. Decision table [+]: use case, cost of a wrong answer, zero-shot OK or fit first.

---

## Sources

Primary (papers, official repos, regulators):
- [R7] Strands Decider repo: https://github.com/strands-labs/strands-decider
- [R13] Releasing the Inner Jev (arXiv 2610.17205), via https://www.emergentmind.com/papers/2610.17205
- [R14] Belcak et al., Small Language Models are the Future of Agentic AI (NVIDIA, arXiv 2506.02153): https://arxiv.org/abs/2506.02153
- [R15] Hsieh et al., Distilling Step-by-Step (arXiv 2305.02301): https://arxiv.org/abs/2305.02301
- [R19] Crash-narratives paper using Jev, with pricing in its references (arXiv 2609.24052): https://arxiv.org/pdf/2609.24052
- [R20] Evaluating Decision Models for Text Annotation in Computational Social Science (arXiv 2609.24574): https://arxiv.org/pdf/2609.24574
- [R21] Bucher & Martini, Fine-Tuned 'Small' LLMs (Still) Significantly Outperform Zero-Shot Generative AI Models in Text Classification (arXiv 2406.08660): https://arxiv.org/abs/2406.08660
- [R22] Auditable Decision Models with Learned Abstention and Real-Time Steering (arXiv 2605.27768): https://arxiv.org/pdf/2605.27768
- [R26] Ong et al., RouteLLM (ICLR 2025): https://arxiv.org/abs/2406.18665
- [R27] Tiny-Jev model card: https://huggingface.co/lostargon/Tiny-Jev-1.7B

Secondary (explainers and practitioner write-ups; use for orientation, verify before quoting):
- [R1] eesel, Decision models explained: https://www.eesel.ai/blog/decision-models
- [R2] WWT, The Rise of Decision Models: https://www.wwt.com/blog/the-rise-of-decision-models
- [R3] dsebastien, Decision Models: https://www.dsebastien.net/decision-models-dms/
- [R4] HackerNoon, 20 best open-source decision models: https://hackernoon.com/20-best-open-source-ai-decision-models-you-can-run-locally-in-2026
- [R5] eesel, Gemini Decisions API: https://www.eesel.ai/blog/gemini-decisions-api
- [R6] same as R1 (model table, Clef and Strands details)
- [R8] Vizuara, Jev explainer (Laya as encoder): https://vizuara.substack.com/p/jev-what-a-model-built-for-decisions
- [R9] Victor Dibia, How Jev works: https://victordibia.com/explainers/jev/
- [R10] Alex Molas, Jev can't be calibrated: https://www.alexmolas.com/2026/09/23/jev-cant-be-calibrated.html
- [R11] Hamza Boughanim, Jev and the System One Model: https://hamzaboughanim.com/blog/jev-system-one-model-typed-decisions-calibrated-probabilities
- [R12] anth.us, Fine-Tuning Jev: You Can't: https://anth.us/articles/fine-tuning-jev/
- [R16] Runware, Jev, Laya and decision models: https://runware.ai/blog/jev-laya-and-the-emerging-role-of-decision-models
- [R17] Admix, Five vendors shipped decision-model APIs in one day: https://admix.software/blog/decision-model-apis-go-commercial
- [R18] Towards AI, Jev explained: https://pub.towardsai.net/jev-explained-calibrated-decision-models-a89d88c845ab
- [R23] Protiviti, Validation of ML models (SR 11-7): https://www.protiviti.com/ca-en/blogs/validation-machine-learning-models-challenges-and-alternatives
- [R24] arXiv 2605.04076, governance framework for AI fraud detection: https://arxiv.org/pdf/2605.04076
- [R25] IBM Promontory on SR 26-2: https://www.ibm.com/downloads/documents/us-en/15db806050424f33

Not yet read, worth finding: TypeSafe's own launch post and docs; Simon Willison's notes on Jev and on the Gemini Decisions API; the SR 11-7 text itself.

## Gaps only Aditya can fill
1. Which papers you actually read. Name them and I'll anchor the series on those.
2. Whether you have tried any of these models yourself. Even one small experiment (zero-shot vs. fitted, on a public dataset) would make Post 2 far stronger than any citation.
3. How much you want to say about payments specifically, given the employer policy.
