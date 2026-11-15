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
    slug: 'fraud-refund-recovery',
    title: 'Recovering $160M a year from fraudulent accounts',
    summary: 'A fraud refund and currency-conversion system that moves money back out of fraudulent accounts.',
    metrics: [
      { value: '$160M', label: 'recovered per year' },
      { value: '$10M', label: 'litigation risk mitigated' },
    ],
    built: ['Engineered the refund system and the currency conversion it depends on.'],
    stack: ['Java', 'Spring Boot', 'Oracle SQL'],
    featured: true,
  },
  {
    slug: 'regulatory-filing-automation',
    title: 'Automating regulatory filings across 5 AML rules',
    summary: 'Suspicious-activity reports that used to need a manual investigation are now filed automatically.',
    metrics: [
      { value: '10K+', label: 'manual investigations removed per year' },
      { value: '30K+', label: 'investigator hours saved annually' },
    ],
    built: [
      'Automated report filing to regulators across five anti-money-laundering rules.',
      'Built an account-bundling tool that consolidates 1M+ transaction records and automates multi-jurisdiction filing.',
    ],
    stack: ['Java', 'Spring Boot', 'Oracle SQL'],
    featured: true,
  },
  {
    slug: 'compliance-platform-to-gcp',
    title: 'Moving a compliance platform from on-prem Oracle to GCP',
    summary: 'Cloud-native migration of a case-management platform, designed as cell-based and multi-tenant.',
    metrics: [
      { value: 'Cell-based', label: 'multi-tenant architecture' },
      { value: 'SVP / CTO', label: 'design presented to leadership' },
    ],
    built: [
      'Drove the migration from on-prem Oracle to Cloud Run, Spanner, GKE and Pub/Sub.',
      'Designed the cell-based multi-tenant architecture and presented it to SVP and CTO leadership.',
    ],
    stack: ['GCP', 'Cloud Run', 'Spanner', 'GKE', 'Pub/Sub'],
    featured: true,
  },
  {
    slug: 'law-enforcement-portal',
    title: 'Re-architecting a portal that handles 25K+ subpoenas a year',
    summary: 'A rebuild of the law-enforcement fulfillment portal that cut both latency and storage by more than half.',
    metrics: [
      { value: '−55%', label: 'latency and storage' },
      { value: '$5M', label: 'saved per year' },
    ],
    built: [
      'Re-architected the fulfillment portal end to end.',
      'Orchestrated an integration that automates 2,000+ child-exploitation case reports a year to law enforcement.',
    ],
    stack: ['Java', 'Spring Boot', 'AWS'],
  },
  {
    slug: 'llm-and-agent-tooling',
    title: 'LLM assistants and agents for case work',
    summary: 'Chat assistants and agentic tools that take routine steps off investigators and engineers.',
    metrics: [
      { value: '3', label: 'LLM chat assistants' },
      { value: '2', label: 'agentic solutions' },
    ],
    built: [
      'Built three assistants for case processing, team routing and compliance narrative generation.',
      'Built a voice-activated case assistant and an Oracle SQL prompt-to-PR generator on Crew AI.',
    ],
    stack: ['LangChain', 'Crew AI', 'Python'],
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
    note: 'Supported 160 students, designed and graded exams and projects, and automated project grading with Gradescope, Docker and Python. Received Best Teaching Assistant recognition.',
  },
  {
    course: 'CICS 256: Physical Computing',
    role: 'Course Assistant · UMass CICS',
    period: 'Feb 2022 – May 2022',
    note: 'Arduino-based lab course for 40 students. Mentored final project teams and debugged sensors and microcontrollers hands-on.',
  },
];

export interface Project { name: string; year: string; short: string; desc: string; tags: string[]; href?: string }

export const PROJECTS: Project[] = [
  {
    name: 'Market Lens',
    year: '2025',
    short: 'Multi-source financial intelligence with LLM-powered sentiment analysis',
    desc: 'Multi-API financial intelligence system integrating 6+ data sources with deduplication and LLM-powered sentiment analysis. Auto-syncs to Google Sheets for portfolio signal tracking.',
    tags: ['Python', 'Claude', 'Grok', 'Alpha Vantage', 'Google Sheets'],
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
    role: 'Software Engineer',
    period: 'Jun 2023 – Present',
    location: 'San Jose, CA',
    tags: ['Java', 'Spring Boot', 'GCP', 'AWS', 'LangChain', 'Crew AI', 'Oracle SQL'],
    bullets: [
      'Drove cloud-native migration of compliance case-management platform (OneSCM) from on-prem Oracle to GCP (Cloud Run, Spanner, GKE, Pub/Sub); presented cell-based multi-tenant architecture to SVP/CTO leadership.',
      'Engineered fraud refund & currency-conversion system — recovers $160M/year from fraudulent accounts, mitigates $10M in litigation risk.',
      'Automated SAR filing across 5 AML rules — eliminates 10K+ manual investigations/year, saves 30K+ investigator hours annually.',
      'Built Account Bundling tool: consolidates 1M+ transaction records, automates multi-jurisdiction filing.',
      'Engineered 3 LLM chat assistants for case processing, team routing, and compliance narrative generation.',
      'Built 2 Agentic AI solutions (Crew AI): voice-activated case assistant + Oracle SQL prompt-to-PR generator.',
      'Re-architected Law Enforcement Fulfillment Portal (25K+ subpoenas/year): −55% latency and storage, saves $5M/yr.',
      'Orchestrated NCMEC integration: automates 2,000+ child-exploitation case reports/year to law enforcement.',
    ],
  },
  {
    company: 'PayPal',
    role: 'Software Engineer Intern',
    period: 'Jun 2022 – Aug 2022',
    location: 'San Jose, CA',
    tags: ['Java', 'Spring Boot', 'Celonis', 'ETL'],
    bullets: [
      'Built Java/Spring ETL connector: extracts and loads 3.5M case-management logs into Celonis for process mining, enabling discovery and operational monitoring.',
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
      'Developed ML pipelines for time-series forecasting with concept-drift detection — 7% error reduction on enterprise datasets.',
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
      'Designed admin portal for a virtual event management platform.',
      'Implemented secure RESTful APIs with QR-code-based event check-in functionality.',
    ],
  },
  {
    company: 'UMass CICS',
    role: 'Undergraduate Research Assistant',
    period: 'Dec 2021 – May 2023',
    location: 'Amherst, MA',
    tags: ['R', 'Python', 'LIME', 'SHAP', 'NLP'],
    bullets: [
      'Evaluated causal inference algorithms on non-linear observational datasets in R under PhD researcher Pracheta Amaranath.',
      'Investigated LIME/SHAP explainability of NLP search engines (LETOR) under Prof. James Allan at CIIR.',
    ],
  },
];
