// The Prognos mark: a P taken apart, with the orange bowl pulled up and away from the ink stem.
// Ink follows currentColor; the orange is fixed so the mark keeps its colour under any theme.
export const BRAND_ORANGE = "#d9731a"

export function PrognosMark({ className }: { className?: string }) {
  return (
    <svg viewBox="6 3 22 24" className={className} aria-hidden>
      <rect x={6} y={5} width={7} height={22} fill="currentColor" />
      <path d="M 16.5 3 H 20.5 A 7.5 7.5 0 0 1 20.5 18 H 16.5 Z" fill={BRAND_ORANGE} />
    </svg>
  )
}
