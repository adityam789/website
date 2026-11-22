/** Small deterministic helpers shared by the blog animations. */

export type Pt = [number, number];

export const clamp = (x: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Hermite ease between two edges, 0 below e0 and 1 above e1. */
export function smooth(e0: number, e1: number, x: number) {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
}

/** Seeded PRNG (mulberry32) so every reader sees the same "random" samples. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function gauss(r: () => number) {
  const u = Math.max(r(), 1e-9);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r());
}

export const pathD = (pts: Pt[]) =>
  pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('');

export const mixPts = (a: Pt[], b: Pt[], t: number): Pt[] =>
  a.map((p, i) => [lerp(p[0], b[i][0], t), lerp(p[1], b[i][1], t)]);

/** Sample a curve on [0, upto] as polyline points. */
export function sample(fn: (p: number) => Pt, upto = 1, n = 40): Pt[] {
  const k = Math.max(2, Math.round(n * upto));
  return Array.from({ length: k + 1 }, (_, i) => fn((upto * i) / k));
}

/** Heading in degrees for a car drawn pointing up, given the next point. */
export const headingDeg = (from: Pt, to: Pt) =>
  (Math.atan2(to[0] - from[0], from[1] - to[1]) * 180) / Math.PI;
