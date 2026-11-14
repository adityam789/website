import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

/** Favicon: the "AM." mark. */
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111110', color: '#F8F7F4', fontSize: 30, fontWeight: 600, borderRadius: 14 }}>
        AM<span style={{ color: '#E07B30' }}>.</span>
      </div>
    ),
    size,
  );
}
