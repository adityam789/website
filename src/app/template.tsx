/** Re-mounts on every navigation, so each page gets one short fade-in (disabled under reduced motion). */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
