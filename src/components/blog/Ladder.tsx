import styles from './Ladder.module.css';

const STEPS = [
  { name: 'Prompt', role: 'You write every instruction' },
  { name: 'Context', role: 'You curate what the agent sees' },
  { name: 'Harness', role: 'You design the checks and constraints' },
  { name: 'Loop', role: 'You design the system that prompts' },
  { name: 'Graph', role: 'You design the gates and handoffs' },
];

/** "The ladder of control" — rendered from the Mermaid spec as themed, responsive HTML. */
export default function Ladder() {
  return (
    <figure className={styles.figure}>
      <ol className={styles.steps}>
        {STEPS.map((s, i) => (
          <li
            key={s.name}
            className={styles.step}
            style={{ ['--i' as string]: i, ['--n' as string]: STEPS.length }}
          >
            <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
            <span className={styles.name}>{s.name}</span>
            <span className={styles.role}>{s.role}</span>
          </li>
        ))}
        <li className={styles.discernment}>
          <span className={styles.name}>Discernment</span>
          <span className={styles.role}>You still own the low-verifiability calls</span>
        </li>
      </ol>
      <figcaption className={styles.caption}>
        The ladder of control: each layer moves the human further from typing the next instruction.
      </figcaption>
    </figure>
  );
}
