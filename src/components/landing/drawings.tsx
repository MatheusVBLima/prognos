// Fig. 1 (the hero) and Fig. 7 (final assembly). Shared projection helpers live in ./iso.
import { Arrowhead, Bubble, Callout, flat, HAIR, Hatch, Heart, INK, onFlat, ORANGE, PAPER, Plane } from "./iso"
import styles from "./manual.module.css"

function Layer({ cx, cy, spread, children }: { cx: number; cy: number; spread: number; children: React.ReactNode }) {
  const style = { "--dx": "0px", "--dy": `${spread}px` } as React.CSSProperties
  return (
    <g className={styles.explode} style={style}>
      <g transform={flat(cx, cy)}>{children}</g>
    </g>
  )
}

const TREND_BARS = [10, 13, 9, 15, 19, 16, 24, 31, 28, 47, 72]
const TREND_LINE = TREND_BARS.map((h, i) => [-95.5 + i * 17, 48 - h - 10]).filter((_, i) => i % 2 === 0)
const TREND_TIP = TREND_LINE[TREND_LINE.length - 1]

// Fig. 1: a reel exploded into its parts. The trend and the script hover above the phone the
// reel plays on. Parts are drawn bottom-up so each one sits in front of the part below it.
export function ExplodedPost({ className }: { className?: string }) {
  const cx = 272
  const W = 75
  const H = 130
  const [trend, script, phone] = [100, 290, 478]
  const corners = [
    [-W, -H],
    [W, -H],
    [W, H],
    [-W, H],
  ]

  // The phone is a rounded slab; its two silhouette points carry the side walls.
  const body = { w: W + 10, h: H + 14, r: 18 }
  const k = Math.SQRT1_2 * body.r
  const left = onFlat(cx, phone, -body.w + body.r - k, body.h - body.r + k)
  const right = onFlat(cx, phone, body.w - body.r + k, -body.h + body.r - k)
  const depth = 10
  const slab = <rect x={-body.w} y={-body.h} width={body.w * 2} height={body.h * 2} rx={body.r} fill={PAPER} />

  return (
    <svg viewBox="98 0 540 600" className={`${styles.mono} ${className ?? ""}`} fill="none" stroke={INK} strokeWidth={HAIR} aria-hidden>
      {/* Assembly guides: each corner drops straight down onto the phone screen. */}
      {corners.map(([x, y]) => {
        const top = onFlat(cx, trend, x, y)
        const bottom = onFlat(cx, phone, x, y)
        return <line key={`${x}${y}`} x1={top.x} y1={top.y} x2={bottom.x} y2={bottom.y} strokeDasharray="6 4" strokeWidth={0.6} />
      })}

      {/* PG-05 · the reel, playing on the phone */}
      <g className={styles.explode}>
        <g transform={`translate(0 ${depth}) ${flat(cx, phone)}`}>{slab}</g>
        <line x1={left.x} y1={left.y} x2={left.x} y2={left.y + depth} />
        <line x1={right.x} y1={right.y} x2={right.x} y2={right.y + depth} />
        <g transform={flat(cx, phone)}>
          {slab}
          <rect x={-W} y={-H} width={W * 2} height={H * 2} rx={4} />
          <rect x={-16} y={-H - 9} width={32} height={4} rx={2} />
          <line x1={-24} y1={H + 7} x2={24} y2={H + 7} strokeWidth={2} />

          <line x1={-58} y1={-110} x2={-26} y2={-110} strokeWidth={2.4} />
          <rect x={46} y={-116} width={14} height={11} rx={2} />
          <circle cx={53} cy={-110.5} r={3} />
          <circle cx={-4} cy={-40} r={20} />
          <path d="M -46 36 C -44 -18, 36 -18, 38 36 Z" />
          <g transform="translate(58 -34) scale(1.3)">
            <Heart />
          </g>
          <g transform="translate(58 -4) scale(1.3)">
            <Bubble />
          </g>
          <g transform="translate(58 26) scale(1.3)">
            <Plane />
          </g>
          <line x1={-58} y1={66} x2={-8} y2={66} strokeWidth={2.4} />
          <line x1={-58} y1={80} x2={34} y2={80} strokeWidth={0.8} />
          <line x1={-58} y1={92} x2={10} y2={92} strokeWidth={0.8} />
          <line x1={-58} y1={112} x2={58} y2={112} strokeWidth={0.8} />
          <line x1={-58} y1={112} x2={-14} y2={112} strokeWidth={3} />
          <circle cx={-14} cy={112} r={4} fill={INK} stroke="none" />
        </g>
      </g>

      {/* PG-03 · the script: hook, beats, call to action */}
      <Layer cx={cx} cy={script} spread={30}>
        <path d={`M ${-W} ${-H} H ${W - 22} L ${W} ${-H + 22} V ${H} H ${-W} Z`} fill={PAPER} />
        <path d={`M ${W - 22} ${-H} V ${-H + 22} H ${W}`} strokeWidth={0.8} />
        <rect x={-W + 14} y={-H + 18} width={38} height={13} fill={INK} stroke="none" />
        {[-74, -56, -38, -6, 12, 30, 48].map((y, i) => (
          <g key={y}>
            <line x1={-W + 14} y1={y} x2={-W + 28} y2={y} strokeWidth={0.7} />
            <line x1={-W + 38} y1={y} x2={i === 2 || i === 6 ? 16 : W - 16} y2={y} strokeWidth={i === 0 ? 2.4 : 0.8} />
          </g>
        ))}
        <line x1={-W + 14} y1={-22} x2={W - 14} y2={-22} strokeWidth={0.5} strokeDasharray="2 3" />
        <line x1={-W + 14} y1={70} x2={W - 14} y2={70} strokeWidth={0.5} strokeDasharray="2 3" />
        <rect x={-W + 14} y={84} width={84} height={22} rx={11} />
        <path d={`M ${-W + 74} 95 h 14 m -5 -5 l 5 5 l -5 5`} strokeWidth={1} />
      </Layer>

      {/* PG-01 · the trend, the one orange part. Its chart is drawn landscape (rotated a quarter
          turn) so the rising line climbs straight up the page. */}
      <Layer cx={cx} cy={trend} spread={60}>
        <rect x={-W} y={-H} width={W * 2} height={H * 2} fill={ORANGE} />
        <g stroke="var(--foreground)">
          <Hatch x={-W} y={-H} w={W * 2} h={H * 2} gap={10} />
        </g>
        <rect x={-W + 14} y={-H + 14} width={W * 2 - 28} height={H * 2 - 28} fill={PAPER} />
        <g transform="rotate(-90)">
          <text x={-102} y={-30} fontSize={22} fill={INK} stroke="none" fontWeight={600}>
            +312%
          </text>
          <line x1={-102} y1={-20} x2={-36} y2={-20} strokeWidth={0.6} strokeDasharray="2 3" />
          {TREND_BARS.map((h, i) => (
            <rect key={i} x={-100 + i * 17} y={48 - h} width={9} height={h} fill={i >= TREND_BARS.length - 2 ? ORANGE : PAPER} />
          ))}
          <polyline points={TREND_LINE.map(([x, y]) => `${x},${y}`).join(" ")} strokeWidth={1.6} />
          <Arrowhead from={TREND_LINE[TREND_LINE.length - 2]} to={TREND_TIP} />
          <line x1={-106} y1={48} x2={106} y2={48} strokeWidth={0.8} />
          {TREND_BARS.map((_, i) => (
            <line key={i} x1={-95.5 + i * 17} y1={48} x2={-95.5 + i * 17} y2={54} strokeWidth={0.6} />
          ))}
        </g>
      </Layer>

      <Callout from={onFlat(cx, trend, TREND_TIP[1], -TREND_TIP[0])} to={{ x: 462, y: trend - 40 }} code="PG-01" label="TREND +312%" size={11} />
      <Callout from={onFlat(cx, script, -W + 33, -H + 24)} to={{ x: 462, y: script - 96 }} code="HOOK" label="0:00-0:03" size={11} />
      <Callout from={onFlat(cx, script, W - 16, 30)} to={{ x: 462, y: script - 20 }} code="PG-03" label="SCRIPT 0:30" size={11} />
      <Callout from={onFlat(cx, phone, 58, -34)} to={{ x: 462, y: phone - 64 }} code="PG-05" label="REEL 9:16" size={11} />
    </svg>
  )
}

// Fig. 7: final assembly, a finished post on a phone.
export function FinalAssembly({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 360 300" className={`${styles.mono} ${className ?? ""}`} fill="none" stroke={INK} strokeWidth={1.2} aria-hidden>
      <g transform="translate(130 20)">
        <rect x={0} y={0} width={110} height={196} rx={14} fill={PAPER} />
        <rect x={8} y={18} width={94} height={160} />
        <line x1={44} y1={9} x2={66} y2={9} />
        <rect x={8} y={18} width={94} height={96} fill={ORANGE} />
        <Hatch x={8} y={18} w={94} h={96} gap={8} />
        <circle cx={55} cy={66} r={14} fill={PAPER} />
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
