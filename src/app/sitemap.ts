import type { MetadataRoute } from 'next';
import { getAllPosts } from '../lib/blog';
import { site, NAV_LINKS } from '../data/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url },
    ...NAV_LINKS.map(l => ({ url: `${site.url}${l.href}` })),
    ...getAllPosts().map(p => ({ url: `${site.url}/blog/${p.slug}`, lastModified: p.date })),
  ];
}
