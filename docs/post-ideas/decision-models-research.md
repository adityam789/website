# Decision models series: what was verified

Checked 2026-11-14. One line per claim. **P** = primary source opened and read. **P-abs** = primary, abstract only.
**S** = secondary only (no primary found). **X** = could not verify; removed from the posts or flagged.
Companion to `decision-models-series.md` (the outline). Where the two disagree, this file wins.

## Jev and TypeSafe

- P · Jev launched 15 Sep 2026; TypeSafe calls the class "System One Models". https://typesafe.ai/blog/introducing-system-one-models-and-jev
- P · Question types are **four**, not three: choice, score, noul, and box (box needs Jev 1.14). Noul returns one number, the probability of yes. https://docs.typesafe.ai/
- P · "A Choice question accepts up to 255 options." That is Jev's limit (and Google's: 2 to 255). It is not "most models": Strands Decider states no cap. https://docs.typesafe.ai/primitives/choice
- P · Any mix of question types in one request; no separate limit on question count; 64k per request, 32k per question. https://docs.typesafe.ai/models
- P · Price $0.042 per million input tokens, output free. Input: text and images (PNG, JPEG); no audio or video yet. https://docs.typesafe.ai/models
- P · Jev cannot be fine-tuned by customers: "the same weights serve every account". https://docs.typesafe.ai/models
- P · Architecture not disclosed (no decoder/encoder statement, no parameter count). The blog mentions only "a new model architecture, parallel sampler". Same blog post.
- P · Trained with "Reinforcement Learning for Calibrated Decisions (RLCD)"; no method detail given. Same blog post.
- P · TypeSafe publishes no ECE figure. Blog says "Calibrated: higher confidence means higher accuracy."
- P · Speed claims: homepage "193.6x Faster, 444.6x Cheaper"; blog table "40x-200x faster"; blog says evals ran "from our laptops" and are "on the higher end of real world gains". Not used in the posts.
- P · Simon Willison (21 Sep 2026): prefers "decision models" as the name; calls the approach "a regression even further towards black box machine learning systems"; quotes TypeSafe's docs that Jev 1.13 is "currently not great with numbers, dates, or 'adversarial content'". https://simonwillison.net/2026/Sep/21/jev/
- S · Archer Hume's architecture reconstruction (sparse-MoE causal transformer) is black-box inference from ~10,000 API calls; the author calls it "quite speculative". Not confirmed by TypeSafe. https://archerhume.com/posts/jevs-architecture-unmasked/

## Other vendors and the timeline

- P · Cloudflare Clef released 1 Oct 2026. "Clef uses Qwen for a prefill-only pass, then scores the valid schema choices in parallel." Clef 27B, Clef-flash 9B, Apache 2.0. https://blog.cloudflare.com/clef-decision-models/ · https://developers.cloudflare.com/changelog/post/2026-10-01-clef-workers-ai/
- P · Strands Decider: Qwen3.5-2B-Base body; "discard its language-modelling head... replace it with a small pointer head of about a million parameters"; 1.9 billion parameters; Apache 2.0; runs on Apple Silicon and CPU; listed uses include "Guardrails — grounding checks, safety classification, policy classification". Reported Brier/ECE 0.280 / 0.072. https://github.com/strands-labs/strands-decider
- X · "Amazon's Strands team" and "1 October" for Strands Decider. Repo org is strands-labs; README says v1 models are also in the `amazon` Hugging Face org; no release date on the page (model id suffix 2610 implies October 2026). Post reworded.
- X · "Open weights, data and training scripts" for Strands. Weights and training configs are public; whether the processed training rows are released was not confirmed. Post reworded to "open weights and training code".
- P · OpenAI Decisions API: model gpt-6-luna, $0.10 per million input tokens, output not charged, text and images, 1 to 400 questions per request. No launch date on the page. https://developers.openai.com/api/docs/guides/decisions
- P · Simon Willison's plugin post (6 Oct 2026) says OpenAI's API was "announced at last week's DevDay". https://simonwillison.net/2026/Oct/6/llm-openai-decisions/
- X · "OpenAI, Microsoft, Perplexity, Cloudflare and Liquid shipped on the same day in mid-October" (Admix). Admix gives no date and links only X posts. Contradicted for Cloudflare (1 Oct, primary). Removed.
- P · Hugging Face, "Decision Models in Hugging Face", 10 Nov 2026: a decision-model interface (state + questions to probabilities). https://huggingface.co/blog/decision
- P · Gemini Decisions API launched 11 Nov 2026; model Gemini Decision 1; text, images, audio, video, PDFs; 1 to 1,000 questions; noul, choice (2 to 255 options), score; $0.10 per million input tokens, output $0. Docs example: "Does the photo show physical damage to the device?" https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/ · https://aistudio.google.com/docs/decisions-api
- P · Simon Willison (11 Nov 2026): Gemini Decision 1 is "almost identical to Jev" in shape. https://simonwillison.net/2026/Nov/11/gemini-decisions-api/
- P · Perplexity pplx-decider-v1.1-27b: Qwen3.8-27B base, text and image input, Apache 2.0. The card's usage section mentions authenticated access to a private repository, so "open" is uncertain. https://huggingface.co/perplexity-ai/pplx-decider-v1.1-27b
- P · Laya (Convai Innovations): "ModernBERT-large (395M, bidirectional, fully fine-tuned) + a decision head trained from scratch", 421M total. An encoder, not a decoder. Card says it "ships over-confident". https://huggingface.co/convaiinnovations/laya
- P · Tiny-Jev-1.7B: Qwen3-1.7B decoder stack, LM head not used, linear head over marker-token hidden states; listed use "safety, reversibility and secret exposure of an agent's proposed shell / file / API action". Not affiliated with TypeSafe. https://huggingface.co/lostargon/Tiny-Jev-1.7B
- X · Towards AI "Jev explained" (HTTP 403) and WWT "Rise of Decision Models" (empty body): could not be read. Both removed as sources.

## Evaluations of decision models

- P · Deußer et al., "Evaluating and Benchmarking the System One Model Jev" (arXiv 2609.37647, 29 Sep 2026; Bonn / Lamarr / Fraunhofer IAIS): 37 datasets, 346,009 requests. "All three models degrade on low-resource languages, fine-grained or noisy labels, and rubric-based judgments, and binary probabilities need tuned thresholds". Jev 95-99% on IMDB, SST-2, HellaSwag, ARC. Threshold tuning moved UNFAIR-ToS micro-F1 from 0.50 to 0.75. No fine-tuned encoder baseline. https://arxiv.org/abs/2609.37647 (this is the benchmark the Boughanim blog summarises; the outline guessed 2609.24574, which was wrong)
- P · Ibrahim & Zaki, "Evaluating Decision Models for Text Annotation in Computational Social Science" (arXiv 2609.24574): 18 tasks, 7,977 items. "The decision model trails the per-task best LLM on 14 of 15 evaluation tasks, with a median deficit of 11.6 macro-F1 points, at a median 44 times lower measured cost." Better calibrated than the verbalised confidence of 16 of 19 LLMs. One task (empathy) with high confidence at near-chance accuracy. It does **not** report on fine-grained labels, noisy labels or low-resource languages. https://arxiv.org/abs/2609.24574
- P · Rafe & Das, crash narratives with Jev (arXiv 2609.24052): F1 0.908 against human labels; "Recalibration on the same labels reduces calibration error by a factor of 3.3." Records Jev's price as $0.042 per million input tokens. https://arxiv.org/abs/2609.24052
- P-abs · Geuter, Cheng, Alvarez-Melis, "Releasing the Inner Jev" (arXiv 2610.17205, 12 Oct 2026): LoRA plus a decision head initialised from a slice of the LM head; base models Gemma 4 and Qwen; fine-tuned Gemma 4 31B scores 84.4 on OpenDecisions; "accuracy comparable to Jev, with lower calibration error". Numbers are self-reported. Link changed from emergentmind to arXiv. https://arxiv.org/abs/2610.17205
- S · ECE 0.0588 for Jev on 662 prompt-injection messages: reported by Victor Dibia, measured by a third-party repo (jev-sec-bench), not read. https://victordibia.com/explainers/jev/
- S · Coverage at a 0.90 bar (0.2% / 20% / 67% at 60 / 75 / 90% accuracy): Dibia's own calculation ("a calculation, not a measurement"); the confidence distribution behind it is not stated. Kept, labelled as illustrative.
- S · Alex Molas: "The same model can be calibrated on one dataset but not on another." The post does **not** say "the vendor never sees your data"; that clause was mine and is removed. https://www.alexmolas.com/2026/09/23/jev-cant-be-calibrated.html
- S · anth.us "Fine-Tuning Jev: You Can't": accuracy 0.768 to 0.870 and ECE 0.151 to 0.030 on 600 held-out items of a **synthetic** sentiment set. Correction: ECE 0.030 came from a refit on 87 labels; the accuracy gain came from adding one extra question at round 140, not from the calibrated layer (the layer alone left accuracy flat at 0.768 to 0.765). Post reworded. https://anth.us/articles/fine-tuning-jev/
- S · Anthony Maio: changed policies, customers or fraud patterns "can quietly undermine probabilities that were reliable last month". Opinion, kept as attributed. RLCD claim re-sourced to TypeSafe.

## Older foundations

- P · Bucher & Martini (arXiv 2406.08660): "fine-tuning with application-specific training data achieves superior performance in all cases". Fine-tuned RoBERTa, DeBERTa V3, Electra, XLNet vs zero-shot GPT-3.5, GPT-4, Claude 3 Opus, BART; four tasks (news sentiment, stance on tweets, anger in German political text, party EU positions). https://arxiv.org/abs/2406.08660
- P · Hsieh et al., Distilling Step-by-Step (arXiv 2305.02301, Findings of ACL 2023): "our finetuned 770M T5 model outperforms the few-shot prompted 540B PaLM model using only 80% of available data on a benchmark". One benchmark, not all four. https://arxiv.org/abs/2305.02301
- P · Belcak et al. (arXiv 2506.02153): "the majority of agentic subtasks in deployed agentic systems are repetitive, scoped, and non-conversational"; outlines an LLM-to-SLM conversion (collect usage data, curate, cluster tasks, select and fine-tune small models, iterate). There is **no routing step** in that algorithm; "route" removed from my paraphrase. https://arxiv.org/abs/2506.02153
- P · RouteLLM (Ong et al., ICLR 2025): "can reduce costs by over 2 times without sacrificing response quality" (arXiv version adds "in certain cases"); routers include a BERT classifier and a causal LLM classifier (Llama 3 8B). https://proceedings.iclr.cc/paper_files/paper/2025/hash/5503a7c69d48a2f86fc00b3dc09de686-Abstract-Conference.html
- P · Palamadai Chandrasekaran, "Auditable Decision Models with Learned Abstention and Real-Time Steering" (arXiv 2605.27768, May 2026): predicts YES, NO or TBD; "A model that must always choose YES or NO can conceal uncertainty in cases where an operator would prefer review." It is a BERT-base encoder and predates Jev; not a System One model. Post now says so. https://arxiv.org/abs/2605.27768
- P · Guo et al., On Calibration of Modern Neural Networks (ICML 2017): temperature scaling; ECE as the calibration metric. https://arxiv.org/abs/1706.04599
- P · Casanueva et al. (arXiv 2003.04807): BANKING77, 13,083 customer service queries, 77 intents. https://arxiv.org/abs/2003.04807

## Regulation

- P · **SR 26-2 exists.** "Revised Guidance on Model Risk Management", 17 Apr 2026, Federal Reserve with OCC and FDIC; it "supersedes and replaces SR letter 11-7". Most relevant to banking organizations over $30 billion in total assets. https://www.federalreserve.gov/supervisionreg/srletters/sr2602.htm
- P · SR 26-2 attachment, footnote 3: "Generative AI and agentic AI models are novel and rapidly evolving. As such, they are not within the scope of this guidance." It applies to "traditional statistical and quantitative models and non-generative, non-agentic AI models". https://www.federalreserve.gov/supervisionreg/srletters/SR2602a1.pdf
- P · SR 26-2 validation components: conceptual soundness, outcomes analysis ("compares model outputs to corresponding real-world outcomes"), ongoing model monitoring. Same PDF.
- P · SR 26-2 on vendors: banks "may not receive from the vendor the underlying code, data, or methodology... Nevertheless, the principles of model risk management remain applicable." Same PDF.
- X · SR 11-7 text itself: the Fed and OCC URLs for the 2011 letter now return 404 or an empty shell. Not read. The posts cite SR 26-2 and mention SR 11-7 only as what it replaced.
- X · Protiviti and IBM Promontory write-ups: no longer needed; replaced by the regulator's text.
- Open question, stated as such in post 2: whether a decision model counts as "generative AI" (out of scope) or "non-generative AI" (in scope) under SR 26-2. The guidance does not say.

## Not verified, not used

- Admix's "cannot hold a conversation" line (its own claim, no source): the point is kept as my own reasoning, link removed.
- HackerNoon "20 best open-source decision models": secondary; its claims are now sourced to TypeSafe docs. Removed.
- eesel pages: replaced by Google, Cloudflare and Perplexity primaries. Removed.
- dsebastien: kept only for the triage and "many narrow questions" patterns, which are that author's advice, attributed as such.
