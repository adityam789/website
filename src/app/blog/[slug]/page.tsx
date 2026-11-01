import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import PostBody from '../../../components/blog/PostBody';
import TableOfContents from '../../../components/blog/TableOfContents';
import Reveal from '../../../components/Reveal';
import { formatDate, getAllPosts, getPost } from '../../../lib/blog';
import styles from './post.module.css';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Aditya Maheshwari`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      url: `https://mahicodes.com/blog/${post.slug}`,
      images: post.cover ? [{ url: post.cover, width: 1672, height: 941 }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.cover ? [post.cover] : undefined,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const [title, ...rest] = post.title.split(': ');
  const subtitle = rest.join(': ');

  return (
    <article className="section">
      <div className="container-wide">
        <Reveal>
          <header className={styles.header}>
            <Link href="/blog" className={styles.back}>← writing</Link>
            <div className={styles.meta}>
              <span className={`tag ${post.tag === 'Life' ? styles.tagLife : ''}`}>{post.tag}</span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden>·</span>
              <span>{post.readMinutes} min read</span>
            </div>
            <h1 className={`display ${styles.title}`}>
              {title}
              {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
            </h1>
            <p className={styles.dek}>{post.excerpt}</p>
          </header>
        </Reveal>

        {post.cover && (
          <Reveal delay={80}>
            <div className={styles.cover}>
              <Image
                src={post.cover}
                alt="A monitor showing a code diff with a green checkmark, and a mirror beside it reflecting the same checkmark."
                width={1672}
                height={941}
                priority
                sizes="(max-width: 1200px) 100vw, 1150px"
              />
            </div>
          </Reveal>
        )}

        <div className={styles.layout}>
          <TableOfContents items={post.toc} />
          <div className={styles.column}>
            <PostBody content={post.content} />

            <footer className={styles.footer}>
              <p>Thanks for reading. If you disagree, or have a better check, I&apos;d like to hear it.</p>
              <div className={styles.footerLinks}>
                <Link href="/contact" className="btn-primary">say hello →</Link>
                <Link href="/blog" className="btn-secondary">← all writing</Link>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </article>
  );
}
