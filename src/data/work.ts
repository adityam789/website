export interface CaseStudy {
  slug: string;
  title: string;
  summary: string;
  metrics: { value: string; label: string }[];
  built: string[];
  stack: string[];
  featured?: boolean;
}

/** Case studies, written from public resume facts. Add trade-offs and decisions here as they are written up. */
export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'llm-case-agents',
    title: 'LLM agents that auto-close 80% of 61K+ issues',
    summary:
      'Three LLM agents (summarization, issue detection, dedup) on a case-management platform handling 1M+ cases a year. They link a customer’s related cases into one issue.',
    metrics: [
      { value: '80%', label: 'of 61K+ issues auto-closed' },
      { value: '34s', label: 'median, against 13 hours by hand' },
    ],
    built: [
      'Designed and shipped the three agents: 187K summaries at $0.02 a case in 17s on average, with dedup flagging 6% of cases as duplicates.',
      'Launched an offline evaluation pipeline that captures every model call with field-level encryption and scores 3K pairs a day with a deterministic check plus 2 LLM judges.',
      'Designed champion/challenger versioning for prompts and judges.',
    ],
    stack: ['LLM agents', 'LangSmith', 'Cloud Run', 'GCS'],
    featured: true,
  },
  {
    slug: 'compliance-platform-to-gcp',
    title: 'Migrating 3M+ cases from Oracle to Spanner with zero downtime',
    summary:
      'A case-management platform moved to GCP and grown from leadership-reviewed proofs of concept to 12 production services.',
    metrics: [
      { value: '99.99%', label: 'availability at 3.6M+ requests a day' },
      { value: '2 days', label: 'to migrate 3M+ cases, zero data diffs' },
    ],
    built: [
      'As a core engineer, migrated 3M+ cases in 2 days at 4K records a second over CDC, with zero downtime.',
      'Designed the cell-based multi-tenant architecture and presented it to SVP and CTO leadership.',
      'Grew the platform from SVP/CTO-reviewed AWS and GCP proofs of concept to 12 GKE and Cloud Run services with 80ms p95 reads.',
      'Primary on-call every other week.',
    ],
    stack: ['GCP', 'Spanner', 'GKE', 'Cloud Run', 'Pub/Sub', 'Striim CDC'],
    featured: true,
  },
  {
    slug: 'fraud-refund-recovery',
    title: 'Recovering $160M a year for defrauded accounts',
    summary: 'A fraud refund and currency-sweep system, plus account bundling for multi-jurisdiction filings.',
    metrics: [
      { value: '$160M', label: 'recovered per year' },
      { value: '$10M', label: 'litigation risk mitigated' },
    ],
    built: [
      'Built the fraud refund and currency-sweep system.',
      'Built an account-bundling tool that consolidates 1M+ transaction records: 600K accounts ($290M in transactions) bundled for automated multi-jurisdiction filings.',
    ],
    stack: ['Java', 'Spring Boot', 'Oracle SQL'],
    featured: true,
  },
  {
    slug: 'workflows-and-event-platform',
    title: 'Case orchestration and a transactional-outbox event platform',
    summary: 'The workflow engine and event delivery underneath the case lifecycle on GCP.',
    metrics: [
      { value: '316K+', label: 'workflow executions a month at 99.5% success' },
      { value: '99.5%', label: 'of 1.79M+ events delivered without dead-lettering' },
    ],
    built: [
      'Designed case-lifecycle orchestration on GCP Workflows (1.2s average), with a Redis context store that bypasses the 512KB state limit.',
      'Engineered the outbox event platform with idempotent claims, retry backoff and durable 45-day async case events.',
      'Chose chained Cloud Tasks over Cloud Scheduler: about $5 a month against about $10K a month at 100K events.',
      'Designed Bulk Actions: CSV-driven lifecycle actions in 500-case chunks with compensating rollback.',
    ],
    stack: ['GCP Workflows', 'Spanner', 'Pub/Sub', 'Pulsar', 'Cloud Tasks', 'Redis'],
  },
  {
    slug: 'l1-case-agent',
    title: 'Leading the design of an L1 case agent',
    summary:
      'An agent that follows SOP playbooks or plans freely within guardrails, evolved from a 14-node LangGraph state machine.',
    metrics: [
      { value: '3', label: 'engineers led' },
      { value: '2,500', label: 'investigator hours a month, sized at 10K cases a month' },
    ],
    built: [
      'Led the architecture: domain packs, human-in-the-loop gates, Milvus SOP retrieval and a React operator console.',
      'Served it through a Spring Boot MCP server with OAuth2 single sign-on.',
    ],
    stack: ['LangGraph', 'MCP', 'Spring Boot', 'Milvus', 'React'],
  },
  {
    slug: 'case-recommendation-model',
    title: 'Fine-tuning a 462-class case-recommendation model',
    summary:
      'A model that predicts an investigator’s next action across 14 disciplines, with a rationale and calibrated confidence.',
    metrics: [
      { value: '462', label: 'classes across 14 disciplines' },
      { value: '200K', label: 'cases, built from 26 BigQuery tables' },
    ],
    built: [
      'Built the dataset with PII-masked, LLM-written rationales.',
      'Trained 3 architectures (Qwen3-14B; ModernBERT-large + Qwen3-14B; Flan-T5-XXL) with QLoRA SFT and GRPO/RLAIF on Vertex AI.',
    ],
    stack: ['PyTorch', 'QLoRA', 'Vertex AI', 'BigQuery'],
  },
  {
    slug: 'regulatory-filing-automation',
    title: 'Automating Suspicious Activity Reports across 5 AML rules',
    summary: 'Reports that used to need a manual investigation are now prepared automatically.',
    metrics: [
      { value: '30K+', label: 'investigator hours saved per year' },
      { value: '10K+', label: 'manual investigations removed per year' },
    ],
    built: [
      'Led the automation of report filing to regulators across five anti-money-laundering rules.',
      'Included an LLM generator for the compliance narrative.',
    ],
    stack: ['Java', 'Spring Boot', 'Oracle SQL', 'LLM'],
  },
  {
    slug: 'law-enforcement-portal',
    title: 'Re-architecting a portal that handles 25K+ subpoenas a year',
    summary: 'A rebuild of the fulfillment portal that handles 25K+ subpoenas a year (137K+ requests), cutting latency and storage by more than half.',
    metrics: [
      { value: '−55%', label: 'latency and storage, each' },
      { value: '$5M', label: 'saved per year in infra, ops and vendor costs' },
    ],
    built: [
      'Re-architected the portal and closed 9 security vulnerabilities.',
      'Automated NCMEC reporting of 2,000 child-exploitation cases a year to law enforcement.',
    ],
    stack: ['Java', 'Spring Boot', 'AWS'],
  },
  {
    slug: 'llm-and-agent-tooling',
    title: 'Six GenAI tools for investigators and engineers',
    summary: 'Assistants and agents that take routine steps off case work and engineering.',
    metrics: [
      { value: '6', label: 'GenAI tools launched' },
    ],
    built: [
      'A voice-activated CrewAI case agent and an Oracle SQL prompt-to-PR generator.',
      'A root-cause assistant over logs, app data and Jira.',
      'LLM chat assistants for case processing and triage, team routing, form pre-fill and compliance narrative generation.',
    ],
    stack: ['LangChain', 'CrewAI', 'Python'],
  },
];

export interface Role {
  company: string;
  role: string;
  period: string;
  location: string;
  tags: string[];
  bullets: string[];
}

export const TEACHING = [
  {
    course: 'CS 446: Search Engines',
    role: 'Course Assistant · UMass CICS',
    period: 'May 2022 – May 2023',
    note: 'Supported 160 students, designed and graded exams and projects, and moved coding-project grading to Gradescope autograding (Docker, Python). Received Best Teaching Assistant recognition.',
  },
  {
    course: 'CICS 256: Physical Computing',
    role: 'Course Assistant · UMass CICS',
    period: 'Feb 2022 – May 2022',
    note: 'Arduino-based lab course for 40 students. Created and graded labs, mentored final-project teams on hardware design, and debugged sensors and microcontrollers hands-on.',
  },
];

export interface ProjectImage { src: string; alt: string; width: number; height: number; caption: string }
export interface Project {
  name: string;
  year: string;
  short: string;
  desc: string;
  tags: string[];
  href?: string;
  image?: ProjectImage;
}

export const PROJECTS: Project[] = [
  {
    name: 'SwipeSort',
    year: '2026',
    short: 'Local-first, AI-assisted file sorter: swipe each file toward its folder',
    desc: 'Tidies messy folders like Downloads on macOS and Windows. A local daemon scans and embeds each file and suggests a destination in your existing folder tree; you swipe on desktop or phone to confirm, pick an alternative or send it to an inbox. It finds duplicates, proposes new folders by clustering and can auto-sort watched folders. Every move is journaled and undoable, and nothing leaves the machine. On its synthetic test corpus, the right folder is in the top three suggestions about 99% of the time.',
    tags: ['Python', 'FastAPI', 'SQLite', 'fastembed', 'scikit-learn', 'React', 'TypeScript', 'Ollama'],
    href: 'https://github.com/adityam789/swipesort',
    image: {
      src: '/projects/swipesort.png',
      alt: 'Illustration of the SwipeSort desktop app: an input folder tree on the left, an output folder tree on the right, and a central card for invoice_0412.pdf suggesting Finance/Invoices at 91% confidence, with swipe directions for Trash, Choices, Skip and the suggested folder.',
      width: 1600,
      height: 900,
      caption: 'Illustration of the desktop UI with fictional files, made for this page. Not a screenshot.',
    },
  },
  {
    name: 'Decision Model Experiment',
    year: '2026',
    short: 'An open decision model, a cheap fit and a fine-tuned encoder, tested on four tasks',
    desc: 'A small reproducible test of Strands Decider 2B on four public classification tasks: as shipped, after a cheap calibration fit on a few hundred labels, and against a fine-tuned DistilRoBERTa. Reports accuracy, calibration error and coverage with confidence intervals. Two of the four tasks were in the model\'s own training list, so the two unseen tasks carry the zero-shot result. It is the experiment behind a three-part blog series.',
    tags: ['Python', 'PyTorch', 'Transformers', 'scikit-learn', 'Strands Decider'],
    href: 'https://github.com/adityam789/decision-models-experiment',
  },
  {
    name: 'Face Sorter & Finder',
    year: '2026',
    short: 'Sort photos by person and search them in plain language, fully offline',
    desc: 'Groups a messy photo folder into one folder per person, or finds every photo of one person, using InsightFace face embeddings and clustering on CPU. A photo index answers plain-language queries: dates, places and names become exact filters and the rest is ranked with SigLIP 2. Everything runs locally, with a CLI and a local web app.',
    tags: ['Python', 'InsightFace', 'SigLIP 2', 'ONNX Runtime', 'scikit-learn', 'SQLite', 'Gradio'],
    href: 'https://github.com/adityam789/image_face_detection',
    image: {
      src: '/projects/face-sorter-finder.png',
      alt: 'Diagram: a mixed photo folder passes through load, face detection, face embeddings and clustering, then is copied into one folder per person. A photo with two people goes into two folders. A second strip shows a photo search query split into exact filters and ranked visual text.',
      width: 1600,
      height: 900,
      caption: 'Illustration of the pipeline, made for this page. Not a screenshot.',
    },
  },
  {
    name: 'AI Avatar Agent',
    year: '2026',
    short: 'Turns a topic into a vertical talking-head video: research, script, voice, avatar',
    desc: 'Researches a topic (RSS, web search, optionally Reddit), has an LLM write a short narration, synthesises speech with Coqui XTTS v2, animates a still image with SadTalker and composites a 1080x1920 video with ffmpeg. Each stage writes one file per run, so runs are resumable and inspectable. An offline mode swaps every external service for fakes. A feature-complete prototype, now archived.',
    tags: ['Python', 'OpenRouter', 'Coqui XTTS v2', 'SadTalker', 'ffmpeg', 'FastAPI'],
    href: 'https://github.com/adityam789/ai-avatar-agent',
    image: {
      src: '/projects/ai-avatar-agent-demo.gif',
      alt: 'Looping demo: a blocky cartoon placeholder avatar with a green shirt on a blue background, stacked above a moving purple and teal gradient.',
      width: 270,
      height: 480,
      caption: 'Output of the offline demo mode: a placeholder avatar, a silent fake voice and a canned script. Not a real model render.',
    },
  },
  {
    name: 'Market Lens',
    year: '2025',
    short: 'Multi-source financial intelligence with LLM-powered sentiment analysis',
    desc: 'Python service over 6+ financial APIs (Alpha Vantage, Finnhub, NewsAPI) with deduplication and LLM sentiment scoring that feeds live portfolio tracking in Google Sheets.',
    tags: ['Python', 'Claude', 'Grok', 'Alpha Vantage', 'Finnhub', 'Google Sheets'],
  },
  {
    name: 'Deep Learning From Scratch',
    year: '2022',
    short: 'CNN, LSTM, and logistic regression, built without high-level libraries',
    desc: 'Trained an LSTM on classical guitar compositions to generate new musical sequences. Also implemented logistic regression, CNNs and MLPs from scratch.',
    tags: ['Python', 'TensorFlow', 'music21'],
    href: 'https://github.com/adityam789/Deep-Learning',
  },
  {
    name: 'CryptoSimulator',
    year: '2021',
    short: 'Back-end crypto trading sim with real-time Coinbase data and 2FA auth',
    desc: 'Back-end crypto trading simulator with real-time Coinbase exchange data, secure authentication, two-factor auth and API key management.',
    tags: ['Node.js', 'Express', 'MongoDB', 'Coinbase API'],
    href: 'https://github.com/adityam789/crypto_transaction_api',
  },
];

export const EXPERIENCE: Role[] = [
  {
    company: 'PayPal',
    role: 'Software Engineer II, Compliance Engineering',
    period: 'Apr 2025 – Present',
    location: 'San Jose, CA',
    tags: ['LangGraph', 'LangSmith', 'Vertex AI', 'GCP', 'Spanner', 'GKE', 'Cloud Run', 'Pub/Sub', 'Spring Boot'],
    bullets: [
      'Designed and shipped 3 LLM agents (summarization, issue detection, dedup) for a case-management platform handling 1M+ cases a year: auto-closed 80% of 61K+ issues (34s median against 13 hours by hand); 187K summaries at $0.02 a case.',
      'Launched an offline evaluation pipeline on Cloud Run: captures every model call with field-level encryption and scores 3K pairs a day with a deterministic check plus 2 LLM judges in LangSmith.',
      'Fine-tuned a case-recommendation model that predicts an investigator’s next action across 462 classes in 14 disciplines: a 200K-case dataset and 3 architectures trained with QLoRA SFT and GRPO/RLAIF on Vertex AI.',
      'Led 3 engineers to architect an L1 case agent, from a 14-node LangGraph state machine to an agent that follows SOP playbooks within guardrails, served via a Spring Boot MCP server; sized to save 2,500 investigator hours a month at 10K cases a month.',
      'Saved 30K+ investigator hours a year by leading Suspicious Activity Report automation across 5 AML rules, including an LLM narrative generator, removing 10K+ manual investigations a year.',
      'Presented the cell-based multi-tenant architecture for the case-management platform (OneSCM) to SVP/CTO leadership.',
      'As a core engineer, migrated 3M+ cases from Oracle to Spanner in 2 days with zero downtime or data diffs; grew the platform to 12 GKE and Cloud Run services serving 3.6M+ requests a day at 99.99% availability and 80ms p95 reads. Primary on-call every other week.',
      'Designed case-lifecycle orchestration on GCP Workflows running 316K+ executions a month at 99.5% success, with a Redis context store that bypasses the 512KB state limit.',
      'Engineered a transactional-outbox event platform (Spanner, Pub/Sub, Pulsar, Cloud Tasks): 99.5% of 1.79M+ events in 3 months delivered without dead-lettering.',
      'Designed Bulk Actions: CSV-driven lifecycle actions across many cases in 500-case chunks with compensating rollback.',
    ],
  },
  {
    company: 'PayPal',
    role: 'Software Engineer I',
    period: 'Jun 2023 – Apr 2025',
    location: 'San Jose, CA',
    tags: ['Java', 'Spring Boot', 'Oracle SQL', 'AWS', 'LangChain', 'CrewAI'],
    bullets: [
      'Recovered $160M a year for defrauded accounts and mitigated $10M in litigation risk with a fraud refund and currency-sweep system; bundled 600K accounts ($290M in transactions) for automated multi-jurisdiction filings.',
      'Cut latency and storage 55% each, and $5M a year in infra, ops and vendor costs, by re-architecting the Law Enforcement Fulfillment Portal (25K+ subpoenas a year, 137K+ requests), closing 9 security vulnerabilities.',
      'Automated NCMEC reporting of 2,000 child-exploitation cases a year to law enforcement.',
      'Built and launched 6 GenAI tools for investigators and engineers: a voice-activated CrewAI case agent, an Oracle SQL prompt-to-PR generator, a root-cause assistant over logs, app data and Jira, and LLM assistants for form pre-fill, team routing and case triage.',
    ],
  },
  {
    company: 'PayPal',
    role: 'Software Engineer Intern',
    period: 'Jun 2022 – Aug 2022',
    location: 'San Jose, CA',
    tags: ['Java', 'Spring', 'Celonis', 'ETL'],
    bullets: [
      'Built a Java/Spring ETL connector that exported 3.5M case-management logs to Celonis for process mining, enabling discovery and operational monitoring.',
      'Automated daily movement of thousands of new case records via scheduled batch jobs.',
    ],
  },
  {
    company: 'TestAIng',
    role: 'Machine Learning Intern',
    period: 'May 2021 – Aug 2021',
    location: 'Bangalore, India (Remote)',
    tags: ['Python', 'scikit-learn', 'LIME', 'SHAP'],
    bullets: [
      'Built time-series ML pipelines with concept-drift handling that cut error 7% on enterprise datasets.',
      'Integrated LIME and SHAP explainability methods for non-technical stakeholders.',
    ],
  },
  {
    company: 'Arevea Inc.',
    role: 'Software Engineer Intern',
    period: 'May 2021 – Aug 2021',
    location: 'Remote',
    tags: ['Angular', 'Node.js', 'SQL'],
    bullets: [
      'Built an Angular admin portal for a virtual event management platform.',
      'Implemented secure Node.js/SQL REST APIs with QR-code-based event check-in.',
    ],
  },
  {
    company: 'UMass CIIR',
    role: 'Research Assistant, Prof. James Allan',
    period: 'Mar 2023 – May 2023',
    location: 'Amherst, MA',
    tags: ['Python', 'LIME', 'SHAP', 'NLP', 'LETOR'],
    bullets: ['Applied LIME and SHAP to neural search rankers on LETOR to measure how outputs track interpretable features.'],
  },
  {
    company: 'UMass CICS',
    role: 'Research Assistant',
    period: 'Dec 2021 – Jan 2022',
    location: 'Amherst, MA',
    tags: ['R', 'Causal inference'],
    bullets: ['Evaluated causal inference algorithms on synthetic non-linear observational data in R under PhD researcher Pracheta Amaranath.'],
  },
];
