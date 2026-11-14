import { ImageResponse } from 'next/og';
import { site } from '../data/site';

export const alt = `${site.name}, ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Default social preview card. Blog posts override it with their own cover. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 80, background: '#0F0F0E', color: '#F0EDE8' }}>
        <div style={{ display: 'flex', fontSize: 30, fontWeight: 600 }}>
          AM<span style={{ color: '#E07B30' }}>.</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 92, letterSpacing: -3, lineHeight: 1 }}>{site.name}</div>
          <div style={{ display: 'flex', fontSize: 34, marginTop: 28, opacity: 0.7 }}>
            {site.role} at {site.employer} · backend systems, AI tooling
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 26, color: '#E07B30' }}>{site.domain}</div>
      </div>
    ),
    size,
  );
}
