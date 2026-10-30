// Re-mounts on every tab change, so each page arrives with a short rise.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
