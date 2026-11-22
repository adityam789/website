'use client';

import MotionFigure from '../motion/MotionFigure';
import { useClock } from '../motion/useClock';
import { clamp, pathD, sample, type Pt } from '../motion/math';
import { Box, Car, HIT_P, Lane, swerve, yAt } from '../motion/road';
import styles from '../motion/Motion.module.css';

const PW = 350;
const LEFT = PW / 2;
const RIGHT = PW + 20 + PW / 2;
/** Swerve sizes for the diffusion samples: three go left, three go right. */
const AMPS = [-64, -56, -70, 60, 68, 55];
const STRIP_Y = 372; // baseline of the lateral-offset distribution strip
const STRIP_H = 46;

const gaussian = (x: number, mu: number, sd: number) => Math.exp(-0.5 * ((x - mu) / sd) ** 2);
/** What drivers did at the box: two bumps, nothing in the middle. */
const data = (x: number) => 0.5 * gaussian(x, -62, 9) + 0.5 * gaussian(x, 62, 9);

function curve(cx: number, fn: (x: number) => number, close: boolean): string {
  const pts: Pt[] = [];
  for (let x = -100; x <= 100; x += 2) pts.push([cx + x, STRIP_Y - STRIP_H * fn(x)]);
  const d = pathD(pts);
  return close ? `${d}L${cx + 100} ${STRIP_Y}L${cx - 100} ${STRIP_Y}Z` : d;
}

function Strip({ cx, fit, fitClass, note, noteClass }: {
  cx: number; fit: (x: number) => number; fitClass: string; note: string; noteClass: string;
}) {
  return (
    <g>
      <path d={curve(cx, data, true)} className={styles.distData} />
      <path d={curve(cx, fit, false)} className={fitClass} />
      <line x1={cx - 100} y1={STRIP_Y} x2={cx + 100} y2={STRIP_Y} className={styles.axis} />
      <text x={cx} y={STRIP_Y + 18} textAnchor="middle" className={noteClass}>{note}</text>
    </g>
  );
}

/** Same scene, two policies: one Gaussian drives into the box, diffusion samples split around it. */
export default function AveragingTrap() {
  const clock = useClock({ duration: 7000 });
  const p = clamp(clock.t / 0.72);
  const pl = Math.min(p, HIT_P);
  const hit = p >= HIT_P;

  const straight = (q: number): Pt => [LEFT, yAt(q)];
  const sampleFn = (amp: number) => (q: number): Pt => [RIGHT + swerve(q, Math.sign(amp), Math.abs(amp)), yAt(q)];
  const ego = sampleFn(AMPS[0]);

  return (
    <MotionFigure
      clock={clock}
      heading="Left is fine. Right is fine. Their average is the box."
      caption="Illustrative. Grey bumps: where human drivers were when they passed the box. Amber: one Gaussian fit to them. Teal: what diffusion samples."
    >
      <svg viewBox="0 0 720 400" className={styles.svg} role="img" aria-labelledby="avg-t avg-d">
        <title id="avg-t">Why a single Gaussian policy averages two good maneuvers into a bad one</title>
        <desc id="avg-d">
          Two lanes of the same scene with a box ahead. On the left, a policy that outputs one Gaussian has learned
          from drivers who swerved left and drivers who swerved right; its mean is straight ahead, so the car drives
          into the box. On the right, a diffusion policy draws six samples: three swerve left, three swerve right, and
          none go straight. Below each, the distribution of lateral offsets: the data has two bumps; the Gaussian puts
          its peak between them; the diffusion samples match both bumps.
        </desc>

        <text x={LEFT} y={24} textAnchor="middle" className={styles.title}>One Gaussian policy</text>
        <text x={RIGHT} y={24} textAnchor="middle" className={styles.title}>Diffusion policy</text>

        {/* left: mean of the data, straight ahead */}
        <Lane cx={LEFT} />
        {[-1, 1].map(side => (
          <path key={side} d={pathD(sample(q => [LEFT + swerve(q, side), yAt(q)]))} className={styles.ghost} />
        ))}
        <Box cx={LEFT} hit={hit} />
        {pl > 0 && <path d={pathD(sample(straight, pl))} className={styles.trailAmber} />}
        <Car at={straight(pl)} />
        {hit && (
          <text x={LEFT + 34} y={126} className={styles.labelAmber}>collision</text>
        )}
        <text x={LEFT - 92} y={62} className={styles.label}>dashed: the data</text>

        {/* right: six samples, split */}
        <Lane cx={RIGHT} />
        <Box cx={RIGHT} />
        {AMPS.map((a, i) => {
          const fn = sampleFn(a);
          const head = fn(p);
          return (
            <g key={a}>
              {p > 0 && <path d={pathD(sample(fn, p))} className={styles.trailTeal} opacity={i === 0 ? 1 : 0.55} />}
              {i > 0 && <circle cx={head[0]} cy={head[1]} r={3.5} className={styles.dotTeal} />}
            </g>
          );
        })}
        <Car at={ego(p)} toward={ego(Math.min(1, p + 0.02))} />

        <Strip
          cx={LEFT}
          fit={x => 0.62 * gaussian(x, 0, 63)}
          fitClass={styles.curveAmber}
          note="peak lands in the gap: straight ahead"
          noteClass={styles.labelAmber}
        />
        <Strip
          cx={RIGHT}
          fit={data}
          fitClass={styles.curveTeal}
          note="two modes kept, nothing in between"
          noteClass={styles.labelTeal}
        />
      </svg>
    </MotionFigure>
  );
}
