import styles from "./manual.module.css"

// Hairline "service manual" drawings. Ink is currentColor, the one highlighted part is
// var(--accent), so the plates follow whatever theme the page runs on.

const INK = "currentColor"
const ORANGE = "var(--accent)"
const HAIR = 1.25

const THETA = (-28.6 * Math.PI) / 180
const U = { x: Math.cos(THETA), y: Math.sin(THETA) }
const N = { x: -Math.sin(THETA), y: Math.cos(THETA) }
const A = { x: 10, y: 480 }
const LEN = 700

function at(t: number, offset = 0) {
  return { x: A.x + U.x * LEN * t + N.x * offset, y: A.y + U.y * LEN * t + N.y * offset }
}

function Hatch({ x, y, w, h, gap = 6 }: { x: number; y: number; w: number; h: number; gap?: number }) {
  const lines = []
  for (let i = gap; i < w + h; i += gap) {
    const x1 = x + Math.min(i, w)
    const y1 = y + Math.max(0, i - w)
    const x2 = x + Math.max(0, i - h)
    const y2 = y + Math.min(i, h)
    lines.push(<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />)
  }
  return <g strokeWidth={0.6}>{lines}</g>
}

function Leader({ t, side, n, length = 64 }: { t: number; side: 1 | -1; n: number; length?: number }) {
  const from = at(t, side * 14)
  const to = at(t + side * 0.015, side * length)
  return (
    <g>
      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} strokeWidth={0.8} />
      <circle cx={to.x} cy={to.y} r={10} fill="var(--background)" strokeWidth={0.9} />
      <text x={to.x} y={to.y + 3.5} textAnchor="middle" fontSize={10} fill={INK} stroke="none">
        {n}
      </text>
    </g>
  )
}

function Part({ t, spread, children }: { t: number; spread: number; children: React.ReactNode }) {
  const p = at(t)
  const style = { "--dx": `${-U.x * spread}px`, "--dy": `${-U.y * spread}px` } as React.CSSProperties
  return (
    <g className={styles.explode} style={style}>
      <g transform={`translate(${p.x} ${p.y}) rotate(-28.6)`}>{children}</g>
    </g>
  )
}

// Fig. 1: a post pulled apart along its assembly axis.
export function ExplodedPost({ className }: { className?: string }) {
  const chip = at(0.585)
  return (
    <svg viewBox="0 0 700 560" className={`${styles.mono} ${className ?? ""}`} fill="none" stroke={INK} strokeWidth={HAIR} aria-hidden>
      <line x1={A.x} y1={A.y} x2={at(1.02).x} y2={at(1.02).y} strokeDasharray="10 4 2 4" strokeWidth={0.7} />

      {/* Detail A: the trend behind the post. */}
      <g>
        <circle cx={230} cy={120} r={80} strokeWidth={0.9} />
        <line x1={196} y1={210} x2={260} y2={210} strokeWidth={0} />
        <text x={230} y={74} textAnchor="middle" fontSize={8} letterSpacing={1.5} fill={INK} stroke="none">
          P +312%
        </text>
        <line x1={184} y1={84} x2={276} y2={84} strokeWidth={0.7} />
        <line x1={184} y1={80} x2={184} y2={88} strokeWidth={0.7} />
        <line x1={276} y1={80} x2={276} y2={88} strokeWidth={0.7} />
        <rect x={184} y={102} width={92} height={42} fill={ORANGE} strokeWidth={0.9} />
        <polyline points="186,140 200,134 212,136 226,124 240,126 254,112 274,104" stroke="var(--foreground)" strokeWidth={1.4} />
        <Hatch x={184} y={102} w={92} h={42} gap={7} />
        <line x1={146} y1={120} x2={314} y2={120} strokeDasharray="6 3" strokeWidth={0.6} />
        <text x={230} y={218} textAnchor="middle" fontSize={8} letterSpacing={2} fill={INK} stroke="none">
          DETAIL A · TREND · 3:1
        </text>
        <line x1={298} y1={163} x2={chip.x - 24} y2={chip.y - 12} strokeWidth={0.8} />
      </g>

      {/* 1 · frame */}
      <Part t={0.13} spread={70}>
        <rect x={-82} y={-24} width={164} height={48} fill="var(--background)" />
        <rect x={-70} y={-15} width={124} height={30} />
        <circle cx={66} cy={0} r={5} />
        <Hatch x={-70} y={-15} w={124} h={30} gap={9} />
      </Part>
      {/* 2 · hook card */}
      <Part t={0.28} spread={40}>
        <rect x={-12} y={-17} width={24} height={34} fill="var(--background)" />
        <line x1={-7} y1={-8} x2={7} y2={-8} />
        <line x1={-7} y1={0} x2={4} y2={0} />
      </Part>
      {/* 3 · caption */}
      <Part t={0.43} spread={20}>
        <path d="M -70 -6 L 58 -14 L 72 6 L -56 14 Z" fill="var(--background)" />
        <line x1={-50} y1={2} x2={30} y2={-3} strokeWidth={0.7} />
        <line x1={-46} y1={8} x2={10} y2={4} strokeWidth={0.7} />
      </Part>
      {/* 4 · trend chip (the orange part) */}
      <Part t={0.585} spread={0}>
        <circle r={26} strokeDasharray="3 3" strokeWidth={0.8} />
        <rect x={-15} y={-12} width={30} height={24} fill={ORANGE} />
        <g stroke="var(--foreground)">
          <Hatch x={-15} y={-12} w={30} h={24} gap={5} />
        </g>
      </Part>
      {/* 5 · audio */}
      <Part t={0.7} spread={-20}>
        <polyline points="-24,0 -18,-12 -12,12 -6,-12 0,12 6,-12 12,12 18,-12 24,0" />
      </Part>
      {/* 6 · hashtag */}
      <Part t={0.8} spread={-40}>
        <rect x={-22} y={-5} width={44} height={10} fill="var(--background)" />
        <line x1={-26} y1={0} x2={-22} y2={0} />
        <circle cx={-14} cy={0} r={2.5} />
      </Part>
      {/* 7 · call to action */}
      <Part t={0.93} spread={-70}>
        <path d="M -24 6 L 4 -8 L 4 -26 L 26 -14 L 20 2 L 8 8 L 8 22 Z" fill="var(--background)" />
      </Part>

      <Leader t={0.13} side={1} n={1} />
      <Leader t={0.28} side={1} n={2} />
      <Leader t={0.43} side={-1} n={3} length={70} />
      <Leader t={0.585} side={1} n={4} />
      <Leader t={0.7} side={-1} n={5} />
      <Leader t={0.8} side={1} n={6} />
      <Leader t={0.93} side={-1} n={7} length={56} />
    </svg>
  )
}

type PlateKind = "radar" | "brief" | "script" | "carousel" | "reel" | "editor"

// Small exploded plates for the component schedule.
export function Plate({ kind, className }: { kind: PlateKind; className?: string }) {
  return (
    <svg viewBox="0 0 240 130" className={className} fill="none" stroke={INK} strokeWidth={1.1} aria-hidden>
      <line x1={10} y1={110} x2={230} y2={20} strokeDasharray="8 3 2 3" strokeWidth={0.6} />
      {kind === "radar" && (
        <g transform="translate(120 66)">
          <path d="M -60 30 A 66 66 0 0 1 60 30" />
          <path d="M -40 30 A 44 44 0 0 1 40 30" />
          <path d="M -20 30 A 22 22 0 0 1 20 30" />
          <line x1={0} y1={30} x2={44} y2={-24} />
          <circle cx={30} cy={-10} r={6} fill={ORANGE} />
          <line x1={-70} y1={30} x2={70} y2={30} />
        </g>
      )}
      {kind === "brief" && (
        <g>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${50 + i * 50} ${82 - i * 22}) rotate(-22)`}>
              <rect x={-26} y={-18} width={52} height={36} fill="var(--background)" />
              {i === 1 && <rect x={-26} y={-18} width={12} height={36} fill={ORANGE} />}
              <line x1={-8} y1={-6} x2={18} y2={-6} strokeWidth={0.7} />
              <line x1={-8} y1={2} x2={12} y2={2} strokeWidth={0.7} />
            </g>
          ))}
        </g>
      )}
      {kind === "script" && (
        <g transform="translate(120 66) rotate(-22)">
          <rect x={-70} y={-30} width={140} height={60} fill="var(--background)" />
          {[-16, -4, 8, 20].map((y, i) => (
            <line key={y} x1={-54} y1={y} x2={i === 1 ? 40 : 54} y2={y} strokeWidth={i === 0 ? 3 : 0.7} stroke={i === 0 ? ORANGE : INK} />
          ))}
          <line x1={-62} y1={-30} x2={-62} y2={30} strokeWidth={0.6} />
        </g>
      )}
      {kind === "carousel" && (
        <g>
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(${46 + i * 46} ${88 - i * 19}) rotate(-22)`}>
              <rect x={-16} y={-20} width={32} height={40} fill={i === 1 ? ORANGE : "var(--background)"} />
              <line x1={-8} y1={8} x2={8} y2={8} strokeWidth={0.7} />
            </g>
          ))}
        </g>
      )}
      {kind === "reel" && (
        <g transform="translate(120 66) rotate(-22)">
          <rect x={-86} y={-22} width={172} height={44} fill="var(--background)" />
          {[-60, -20, 20, 60].map((x, i) => (
            <rect key={x} x={x - 16} y={-14} width={32} height={28} fill={i === 2 ? ORANGE : "none"} />
          ))}
          {[-80, -40, 0, 40, 80].map((x) => (
            <line key={x} x1={x} y1={-22} x2={x} y2={-18} strokeWidth={0.7} />
          ))}
        </g>
      )}
      {kind === "editor" && (
        <g>
          <g transform="translate(58 96) rotate(-22)">
            <path d="M -14 0 L 0 -7 L 0 7 Z" fill={ORANGE} />
          </g>
          <g transform="translate(120 70) rotate(-22)">
            <rect x={-40} y={-8} width={80} height={16} fill="var(--background)" />
            <line x1={-40} y1={0} x2={40} y2={0} strokeWidth={0.6} />
          </g>
          <g transform="translate(186 42) rotate(-22)">
            <rect x={-14} y={-9} width={28} height={18} fill="var(--background)" />
          </g>
        </g>
      )}
    </svg>
  )
}

// Fig. 7: final assembly, a finished post on a phone.
export function FinalAssembly({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 360 300" className={`${styles.mono} ${className ?? ""}`} fill="none" stroke={INK} strokeWidth={1.2} aria-hidden>
      <g transform="translate(130 20)">
        <rect x={0} y={0} width={110} height={196} rx={14} fill="var(--background)" />
        <rect x={8} y={18} width={94} height={160} />
        <line x1={44} y1={9} x2={66} y2={9} />
        <rect x={8} y={18} width={94} height={96} fill={ORANGE} />
        <Hatch x={8} y={18} w={94} h={96} gap={8} />
        <circle cx={55} cy={66} r={14} fill="var(--background)" />
        <path d="M 51 58 L 63 66 L 51 74 Z" />
        <line x1={16} y1={130} x2={86} y2={130} strokeWidth={0.8} />
        <line x1={16} y1={140} x2={70} y2={140} strokeWidth={0.8} />
        <line x1={16} y1={160} x2={40} y2={160} strokeWidth={2} />
      </g>
      <g strokeWidth={0.7}>
        <line x1={130} y1={240} x2={240} y2={240} />
        <line x1={130} y1={234} x2={130} y2={246} />
        <line x1={240} y1={234} x2={240} y2={246} />
        <line x1={260} y1={20} x2={260} y2={216} />
        <line x1={254} y1={20} x2={266} y2={20} />
        <line x1={254} y1={216} x2={266} y2={216} />
        <line x1={138} y1={80} x2={60} y2={60} />
        <line x1={150} y1={150} x2={60} y2={170} />
        <line x1={170} y1={180} x2={262} y2={203} />
      </g>
      <g fontSize={9} letterSpacing={1.5} fill={INK} stroke="none">
        <text x={185} y={262} textAnchor="middle">W 1080</text>
        <text x={272} y={122}>H 1920</text>
        <text x={8} y={58}>PG-04 TREND</text>
        <text x={8} y={174}>PG-03 CAPTION</text>
        <text x={266} y={208}>PG-07 CTA</text>
      </g>
    </svg>
  )
}
