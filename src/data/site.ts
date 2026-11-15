/** Single source of truth for identity, links and navigation. Edit facts here, not in pages. */
export const site = {
  name: 'Aditya Maheshwari',
  role: 'Software Engineer',
  employer: 'PayPal',
  location: 'San Jose, CA',
  url: 'https://mahicodes.com',
  domain: 'mahicodes.com',
  email: 'aditya18mahi@gmail.com',
  github: { handle: 'adityam789', url: 'https://github.com/adityam789' },
  linkedin: { handle: 'aditya-maheshwari-05', url: 'https://linkedin.com/in/aditya-maheshwari-05' },
  description:
    'Software engineer at PayPal. I build backend systems, AI tools, and occasionally very good pasta. Based in San Jose, CA.',
};

export const NAV_LINKS = [
  { label: 'work', href: '/work' },
  { label: 'about', href: '/about' },
  { label: 'blog', href: '/blog' },
  { label: 'contact', href: '/contact' },
];

const PAYPAL_START = new Date('2023-06-01').getTime();
/** Whole years at PayPal, computed at build time so it never goes stale. */
export const PAYPAL_YEARS = Math.floor((Date.now() - PAYPAL_START) / (365.25 * 24 * 3600 * 1000));
export const CURRENT_YEAR = new Date().getFullYear();

export const PROOF = [
  { value: '80%', label: 'of 61K+ issues auto-closed by LLM agents' },
  { value: '99.99%', label: 'availability at 3.6M+ requests a day' },
  { value: '$160M', label: 'recovered for defrauded accounts each year' },
  { value: `${PAYPAL_YEARS}+`, label: 'years shipping at PayPal' },
];

/** Resume and CV downloads. The first track is the default; `/resume.pdf` and `/cv.pdf` are the hybrid files. */
export const RESUME_TRACKS = [
  { key: 'hybrid', label: 'Hybrid', hint: 'AI agents and the backends behind them', resume: '/resume.pdf', cv: '/cv.pdf' },
  {
    key: 'ai',
    label: 'AI',
    hint: 'LLM agents, evaluation and fine-tuning',
    resume: '/resumes/aditya-maheshwari-ai-resume.pdf',
    cv: '/resumes/aditya-maheshwari-ai-cv.pdf',
  },
  {
    key: 'backend',
    label: 'Backend',
    hint: 'distributed systems on GCP',
    resume: '/resumes/aditya-maheshwari-backend-resume.pdf',
    cv: '/resumes/aditya-maheshwari-backend-cv.pdf',
  },
];

export const PRINCIPLES = [
  { title: 'Clear, not clever', body: 'Good code is like good prose. If I can’t explain a change in my own words, it doesn’t merge.' },
  { title: 'Don’t over-engineer', body: 'I care about clean architecture and the simplest thing that holds up under real load.' },
  { title: 'Ship it, then sleep', body: 'In that order. Usually.' },
];

export const LIFE = [
  { emoji: '🏔', label: 'Hiking', sub: 'trails, peaks, summit sunrises' },
  { emoji: '🏀', label: 'Basketball', sub: 'pickup games, courts anywhere' },
  { emoji: '🍳', label: 'Cooking', sub: 'experimenting without a recipe' },
  { emoji: '🚗', label: 'Driving', sub: 'winding roads, long drives' },
  { emoji: '✈️', label: 'Travel', sub: 'new countries, no rigid itinerary' },
];
