import type { Metadata } from 'next';
import { Instrument_Serif, Geist, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../components/ThemeProvider';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import ScrollProgress from '../components/ScrollProgress';
import PointerGlow from '../components/PointerGlow';
import CommandPalette, { type PaletteItem } from '../components/CommandPalette';
import { getAllPosts } from '../lib/blog';
import { site, NAV_LINKS } from '../data/site';
import { CASE_STUDIES } from '../data/work';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-serif-next',
  display: 'swap',
});

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans', display: 'swap' });

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono-next',
  display: 'swap',
});

const title = `${site.name} — ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description: site.description,
  alternates: { types: { 'application/rss+xml': '/feed.xml' } },
  openGraph: { title, description: site.description, url: site.url, siteName: site.name, locale: 'en_US', type: 'website' },
  twitter: { card: 'summary_large_image', title, description: site.description },
  robots: { index: true, follow: true },
};

// Runs before first paint: applies the saved or system theme (no flash) and marks JS as available for reveals.
const BOOT = `(function(){try{var d=document.documentElement;d.classList.add('js');var t=localStorage.getItem('theme');if(t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches)d.classList.add('dark')}catch(e){}})()`;

const PERSON = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  url: site.url,
  jobTitle: site.role,
  worksFor: { '@type': 'Organization', name: site.employer },
  sameAs: [site.github.url, site.linkedin.url],
};

function paletteItems(): PaletteItem[] {
  return [
    { label: 'Home', group: 'Pages', href: '/' },
    ...NAV_LINKS.map(l => ({ label: l.label[0].toUpperCase() + l.label.slice(1), group: 'Pages', href: l.href })),
    ...getAllPosts().map(p => ({ label: p.title, group: 'Writing', href: `/blog/${p.slug}` })),
    ...CASE_STUDIES.map(c => ({ label: c.title, group: 'Case study', href: `/work#${c.slug}` })),
    { label: 'Toggle dark mode', group: 'Action', action: 'theme' as const },
    { label: 'Download resume', group: 'Action', href: '/resume.pdf' },
    { label: 'Download CV', group: 'Action', href: '/cv.pdf' },
    { label: 'Email me', group: 'Action', href: `mailto:${site.email}` },
    { label: 'GitHub', group: 'Elsewhere', href: site.github.url },
    { label: 'LinkedIn', group: 'Elsewhere', href: site.linkedin.url },
  ];
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${instrumentSerif.variable} ${geist.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON) }} />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <a href="#main" className="skip-link">Skip to content</a>
          <ScrollProgress />
          <Nav />
          <main id="main">{children}</main>
          <Footer />
          <PointerGlow />
          <CommandPalette items={paletteItems()} />
        </ThemeProvider>
      </body>
    </html>
  );
}
