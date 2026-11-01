import Image from 'next/image';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import Ladder from './Ladder';
import styles from './PostBody.module.css';

/** Known image sizes (px) so next/image can reserve space without layout shift. */
const IMAGE_SIZES: Record<string, [number, number]> = {
  'verifiability.png': [1920, 819],
  'discernment-loop.png': [1024, 1536],
  'cover.png': [1672, 941],
};

const PILLS: Record<string, string> = {
  solid: 'good',
  maturing: 'good',
  improving: 'mid',
  early: 'low',
  high: 'good',
  medium: 'mid',
  low: 'low',
};

function textOf(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(textOf).join('');
  return '';
}

const components: Components = {
  // A paragraph that only holds an image becomes a <figure>; unwrap it to keep the HTML valid.
  p: ({ node, children }) => {
    const only = node?.children.length === 1 ? node.children[0] : null;
    if (only && only.type === 'element' && only.tagName === 'img') return <>{children}</>;
    return <p>{children}</p>;
  },
  h2: ({ children, id }) => (
    <h2 id={id} className={styles.h2}>
      <a href={`#${id}`} className={styles.anchor} aria-label="Link to this section">#</a>
      {children}
    </h2>
  ),
  h3: ({ children, id }) => (
    <h3 id={id} className={styles.h3}>
      <a href={`#${id}`} className={styles.anchor} aria-label="Link to this section">#</a>
      {children}
    </h3>
  ),
  a: ({ href = '', children }) => {
    const external = href.startsWith('http');
    return (
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  },
  blockquote: ({ children }) => <blockquote className={styles.pull}>{children}</blockquote>,
  table: ({ children }) => (
    <div className={styles.tableWrap}>
      <table>{children}</table>
    </div>
  ),
  // Turn status words (Solid / Improving / High / Medium …) into colored pills.
  td: ({ children }) => {
    const raw = textOf(children).trim();
    const first = raw.split(/[ ,]/)[0].toLowerCase();
    const kind = PILLS[first];
    // Only pill short, label-like cells ("Solid", "Improving (building …)", "Medium to low")
    if (kind && raw.length < 60 && /^(solid|maturing|improving|early|high|medium|low)\b/i.test(raw)) {
      return (
        <td>
          <span className={`${styles.pill} ${styles[`pill_${kind}`]}`}>{children}</span>
        </td>
      );
    }
    return <td>{children}</td>;
  },
  img: ({ src, alt }) => {
    if (typeof src !== 'string') return null;
    const [w, h] = IMAGE_SIZES[src.split('/').pop() ?? ''] ?? [1200, 700];
    const tall = h > w;
    return (
      <figure className={`${styles.figure} ${tall ? styles.figureTall : ''}`}>
        <Image src={src} alt={alt ?? ''} width={w} height={h} sizes="(max-width: 900px) 100vw, 760px" />
        {alt && <figcaption>{alt.split(':')[0]}</figcaption>}
      </figure>
    );
  },
  // ```ladder → custom component; any other fence → normal code block
  pre: ({ children }) => <>{children}</>,
  code: ({ className, children }) => {
    if (className === 'language-ladder') return <Ladder />;
    if (className) {
      return (
        <pre className={styles.codeBlock}>
          <code>{children}</code>
        </pre>
      );
    }
    return <code className={styles.inlineCode}>{children}</code>;
  },
};

export default function PostBody({ content }: { content: string }) {
  return (
    <div className={styles.body}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
