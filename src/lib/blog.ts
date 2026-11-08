import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import GithubSlugger from 'github-slugger';

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog');

export interface PostMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO yyyy-mm-dd
  tag: 'Tech' | 'Life';
  cover?: string;
  coverAlt?: string;
  draft: boolean;
  readMinutes: number;
}

export interface TocItem {
  id: string;
  text: string;
  depth: 2 | 3;
}

export interface Post extends PostMeta {
  content: string;
  toc: TocItem[];
}

function stripInline(s: string) {
  return s.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*_`]/g, '').trim();
}

/** Extract h2/h3 headings (outside code fences) with ids matching rehype-slug. */
function buildToc(content: string): TocItem[] {
  const slugger = new GithubSlugger();
  const toc: TocItem[] = [];
  let inFence = false;
  for (const line of content.split('\n')) {
    if (line.startsWith('```')) inFence = !inFence;
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.*)$/.exec(line);
    if (!m) continue;
    const text = stripInline(m[2]);
    toc.push({ id: slugger.slug(text), text, depth: m[1].length as 2 | 3 });
  }
  return toc;
}

function parse(slug: string): Post {
  const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.md`), 'utf8');
  const { data, content } = matter(raw);
  const words = content.replace(/```[\s\S]*?```/g, '').split(/\s+/).filter(Boolean).length;
  return {
    slug,
    title: data.title,
    excerpt: data.excerpt ?? '',
    date: typeof data.date === 'string' ? data.date : new Date(data.date).toISOString().slice(0, 10),
    tag: data.tag ?? 'Tech',
    cover: data.cover,
    coverAlt: data.coverAlt,
    draft: Boolean(data.draft),
    readMinutes: Math.max(1, Math.round(words / 220)),
    content,
    toc: buildToc(content),
  };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => parse(f.replace(/\.md$/, '')))
    .filter(p => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(p => ({
      slug: p.slug, title: p.title, excerpt: p.excerpt, date: p.date,
      tag: p.tag, cover: p.cover, coverAlt: p.coverAlt, draft: p.draft, readMinutes: p.readMinutes,
    }));
}

export function getPost(slug: string): Post | null {
  const file = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const post = parse(slug);
  return post.draft ? null : post;
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
