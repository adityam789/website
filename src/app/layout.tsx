import type { Metadata } from 'next';
import { Instrument_Serif, Geist, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../components/ThemeProvider';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import ScrollProgress from '../components/ScrollProgress';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Aditya Maheshwari — Software Engineer',
  description:
    'Software engineer at PayPal. I build backend systems, AI tools, and occasionally very good pasta. Based in San Jose, CA.',
  openGraph: {
    title: 'Aditya Maheshwari — Software Engineer',
    description:
      'Software engineer at PayPal. I build backend systems, AI tools, and occasionally very good pasta. Based in San Jose, CA.',
    url: 'https://mahicodes.com',
    siteName: 'Aditya Maheshwari',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aditya Maheshwari — Software Engineer',
    description:
      'Software engineer at PayPal. I build backend systems, AI tools, and occasionally very good pasta.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${instrumentSerif.variable} ${geist.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <ThemeProvider>
          <ScrollProgress />
          <Nav />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
