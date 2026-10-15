import { cn } from "@/lib/utils"
import { Arrowhead, Callout, deck, flat, Hatch, INK, ISO, onDeck, onFlat, onWall, ORANGE, PAPER, wall } from "./iso"
import styles from "./manual.module.css"

// Detail plates for the component schedule (§2). Each one is a small isometric drawing of the
// part at work, with a single orange piece and mono callouts, in the same hand as Fig. 1.

const LABEL = 8

// PG-01: a radar scope sweeping the niche, with the rising signal lifted off it.
function RadarPlate() {
  const c = { x: 108, y: 94 }
  const r = 52
  const reach = ISO.a * r * Math.SQRT2
  const hot = onFlat(c.x, c.y, 3, -34)
  const tag = { x: hot.x, y: hot.y - 26 }
  const sweepFrom = { x: r * Math.cos((-120 * Math.PI) / 180), y: r * Math.sin((-120 * Math.PI) / 180) }
  const sweepTo = { x: r * Math.cos((-75 * Math.PI) / 180), y: r * Math.sin((-75 * Math.PI) / 180) }
  return (
    <>
      <g transform={`translate(0 7) ${flat(c.x, c.y)}`}>
        <circle r={r} fill={PAPER} />
      </g>
      <line x1={c.x - reach} y1={c.y} x2={c.x - reach} y2={c.y + 7} />
      <line x1={c.x + reach} y1={c.y} x2={c.x + reach} y2={c.y + 7} />
      <g transform={flat(c.x, c.y)}>
        <circle r={r} fill={PAPER} />
        {[38, 24, 10].map((ring) => (
          <circle key={ring} r={ring} strokeWidth={0.6} />
        ))}
        <line x1={-r} y1={0} x2={r} y2={0} strokeWidth={0.5} strokeDasharray="2 3" />
        <line x1={0} y1={-r} x2={0} y2={r} strokeWidth={0.5} strokeDasharray="2 3" />
        <path d={`M 0 0 L ${sweepFrom.x} ${sweepFrom.y} A ${r} ${r} 0 0 1 ${sweepTo.x} ${sweepTo.y} Z`} fill={ORANGE} />
        <line x1={0} y1={0} x2={sweepTo.x} y2={sweepTo.y} strokeWidth={1.5} />
        {[
          [-30, 14],
          [22, 28],
          [-22, -16],
          [38, -8],
          [-4, 42],
        ].map(([x, y]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r={2.2} fill={INK} stroke="none" />
        ))}
        <circle cx={3} cy={-34} r={3.2} fill={INK} stroke="none" />
        <circle cx={3} cy={-34} r={7.5} strokeWidth={0.8} />
      </g>
      <line x1={hot.x} y1={hot.y} x2={tag.x} y2={tag.y} strokeDasharray="2 2" strokeWidth={0.7} />
      <g transform={wall(tag.x, tag.y)}>
        <rect x={0} y={-22} width={62} height={22} fill={PAPER} />
        <text x={5} y={-7} fontSize={10} fontWeight={600} fill={INK} stroke="none">
          +312%
        </text>
        <polyline points="44,-6 48,-9 51,-8 57,-17" strokeWidth={1} />
      </g>
      <Callout from={onFlat(c.x, c.y, -10, -46)} to={{ x: 204, y: 74 }} code="SWEEP" label="24 H" size={LABEL} />
      <Callout from={onFlat(c.x, c.y, 38, -8)} to={{ x: 204, y: 114 }} code="SOURCES" label="6" size={LABEL} />
    </>
  )
}

// PG-02: the user's page, upright, and the brief Prognos pulls out of it.
function BriefPlate() {
  const o = { x: 30, y: 132 }
  const d = { x: 212, y: 112 }
  const swatches: [number, string][] = [
    [22, ORANGE],
    [30, INK],
    [38, PAPER],
  ]
  return (
    <>
      <g transform={wall(o.x, o.y)}>
        <rect x={0} y={-68} width={100} height={68} fill={PAPER} />
        <line x1={0} y1={-58} x2={100} y2={-58} />
        {[6, 11, 16].map((x) => (
          <circle key={x} cx={x} cy={-63} r={1.5} strokeWidth={0.7} />
        ))}
        <rect x={24} y={-65.5} width={70} height={5} rx={2.5} strokeWidth={0.7} />
        <line x1={30} y1={-63} x2={64} y2={-63} strokeWidth={0.6} />
        <line x1={8} y1={-48} x2={54} y2={-48} strokeWidth={3} />
        <line x1={8} y1={-41} x2={42} y2={-41} strokeWidth={3} />
        <line x1={8} y1={-33} x2={50} y2={-33} strokeWidth={0.6} />
        <rect x={8} y={-27} width={20} height={7} fill={INK} stroke="none" />
        <rect x={60} y={-50} width={32} height={30} />
        <Hatch x={60} y={-50} w={32} h={30} gap={4} />
        <line x1={8} y1={-13} x2={92} y2={-13} strokeWidth={0.5} strokeDasharray="2 2" />
        {[8, 36, 64].map((x) => (
          <rect key={x} x={x} y={-9} width={24} height={5} strokeWidth={0.6} />
        ))}
      </g>
      <path d="M 112 72 C 140 70, 160 80, 172 96" strokeDasharray="3 3" strokeWidth={0.8} />
      <Arrowhead from={[168, 89]} to={[172, 96]} size={7} />
      <g transform={deck(d.x, d.y)}>
        <rect x={-46} y={-26} width={92} height={52} fill={PAPER} />
        <line x1={-40} y1={-17} x2={-8} y2={-17} strokeWidth={2.4} />
        {swatches.map(([x, fill]) => (
          <rect key={x} x={x} y={-21} width={7} height={7} fill={fill} />
        ))}
        {[-6, 3, 12].map((y, i) => (
          <g key={y}>
            <rect x={-40} y={y - 2} width={4} height={4} strokeWidth={0.7} />
            <line x1={-32} y1={y} x2={[24, 10, 30][i]} y2={y} strokeWidth={0.7} />
          </g>
        ))}
      </g>
      <Callout from={onWall(o.x, o.y, 58, -63)} to={{ x: 146, y: 24 }} code="URL" label="OR TEXT" size={LABEL} />
      <Callout from={onDeck(d.x, d.y, 25.5, -17.5)} to={{ x: 232, y: 62 }} code="PALETTE" size={LABEL} />
    </>
  )
}

// PG-03: a timed script sheet with its hook lifted out of the first slot.
function ScriptPlate() {
  const s = { x: 128, y: 104 }
  const lift = 26
  const slot = { x: -54, y: -32, width: 94, height: 8 }
  const rows = [-14, -7, 0, 7, 14]
  const slotCorners = [
    [slot.x, slot.y],
    [slot.x + slot.width, slot.y],
    [slot.x + slot.width, slot.y + slot.height],
    [slot.x, slot.y + slot.height],
  ]
  return (
    <>
      <g transform={deck(s.x, s.y)}>
        <path d="M -70 -40 H 58 L 70 -28 V 40 H -70 Z" fill={PAPER} />
        <path d="M 58 -40 V -28 H 70" strokeWidth={0.7} />
        <line x1={-62} y1={-36} x2={-62} y2={36} strokeWidth={0.6} />
        {[-28, ...rows, 29].map((y) => (
          <line key={y} x1={-65} y1={y} x2={-59} y2={y} strokeWidth={0.6} />
        ))}
        <rect {...slot} strokeDasharray="2 2" strokeWidth={0.7} />
        <line x1={-54} y1={-20} x2={62} y2={-20} strokeWidth={0.5} strokeDasharray="2 3" />
        {rows.map((y, i) => (
          <line key={y} x1={-54} y1={y} x2={[52, 30, 44, 18, 38][i]} y2={y} strokeWidth={0.8} />
        ))}
        <line x1={-54} y1={21} x2={62} y2={21} strokeWidth={0.5} strokeDasharray="2 3" />
        <rect x={-54} y={24} width={40} height={10} rx={5} />
        <path d="M -29 29 h 8 m -3 -3 l 3 3 l -3 3" strokeWidth={0.8} />
      </g>
      {slotCorners.map(([x, y]) => {
        const p = onDeck(s.x, s.y, x, y)
        return <line key={`${x}${y}`} x1={p.x} y1={p.y} x2={p.x} y2={p.y - lift} strokeDasharray="2 2" strokeWidth={0.6} />
      })}
      <g transform={`translate(0 ${-lift}) ${deck(s.x, s.y)}`}>
        <rect {...slot} fill={ORANGE} />
        <line x1={-48} y1={-28} x2={28} y2={-28} strokeWidth={2.2} />
      </g>
      <Callout from={onDeck(s.x, s.y - lift, 40, -28)} to={{ x: 214, y: 34 }} code="HOOK" label="0:03" size={LABEL} />
      <Callout from={onDeck(s.x, s.y, 44, 0)} to={{ x: 214, y: 92 }} code="BEATS" label="4" size={LABEL} />
      <Callout from={onDeck(s.x, s.y, -34, 29)} to={{ x: 214, y: 136 }} code="CTA" label="0:27" size={LABEL} />
    </>
  )
}

// PG-04: a carousel fanned out slide by slide, cover in front, with its trim size.
function CarouselPlate() {
  const back = { x: 66, y: 96 }
  const step = { x: ISO.a * 24, y: ISO.b * 24 }
  const slides = [0, 1, 2, 3, 4]
  const front = { x: back.x + step.x * 4, y: back.y + step.y * 4 }
  return (
    <>
      {slides.map((i) => {
        const o = { x: back.x + step.x * i, y: back.y + step.y * i }
        const cover = i === 4
        const accent = i === 3
        return (
          <g key={i} transform={wall(o.x, o.y)}>
            <rect x={0} y={-50} width={40} height={50} fill={accent ? ORANGE : PAPER} />
            {accent && <Hatch x={0} y={-50} w={40} h={50} gap={5} />}
            {!accent && !cover && (
              <>
                <line x1={5} y1={-43} x2={26} y2={-43} strokeWidth={1.6} />
                <rect x={5} y={-37} width={30} height={18} strokeWidth={0.6} />
                <line x1={5} y1={-13} x2={32} y2={-13} strokeWidth={0.6} />
                <line x1={5} y1={-8} x2={22} y2={-8} strokeWidth={0.6} />
              </>
            )}
            {cover && (
              <>
                <line x1={5} y1={-42} x2={33} y2={-42} strokeWidth={2.6} />
                <line x1={5} y1={-35} x2={26} y2={-35} strokeWidth={2.6} />
                <rect x={5} y={-28} width={30} height={14} strokeWidth={0.6} />
                <polyline points="7,-16 15,-23 21,-19 26,-24 33,-16" strokeWidth={0.6} />
                {[0, 1, 2, 3, 4].map((n) => (
                  <circle key={n} cx={12 + n * 4} cy={-6} r={1.1} fill={n === 0 ? INK : PAPER} strokeWidth={0.5} />
                ))}
              </>
            )}
          </g>
        )
      })}
      <g transform={wall(front.x, front.y)} strokeWidth={0.6}>
        <line x1={0} y1={7} x2={40} y2={7} />
        <line x1={0} y1={4} x2={0} y2={10} />
        <line x1={40} y1={4} x2={40} y2={10} />
        <line x1={47} y1={0} x2={47} y2={-50} />
        <line x1={44} y1={0} x2={50} y2={0} />
        <line x1={44} y1={-50} x2={50} y2={-50} />
        <text x={20} y={16} fontSize={6.5} textAnchor="middle" letterSpacing={1} fill={INK} stroke="none">
          1080
        </text>
        <text transform="translate(55 -25) rotate(-90)" fontSize={6.5} textAnchor="middle" letterSpacing={1} fill={INK} stroke="none">
          1350
        </text>
      </g>
      <Callout from={onWall(back.x + step.x * 3, back.y + step.y * 3, 6, -46)} to={{ x: 206, y: 30 }} code="SLIDE" label="2 OF 5" size={LABEL} />
      <Callout from={onWall(front.x, front.y, 30, -42)} to={{ x: 206, y: 70 }} code="COVER" label="HOOK" size={LABEL} />
    </>
  )
}

// PG-05: a storyboard strip of four 9:16 shots beside a clapperboard, with its timeline.
function ReelPlate() {
  const r = { x: 168, y: 96 }
  const frames = [-74, -31, 12, 55]
  const holes = Array.from({ length: 18 }, (_, i) => -86 + i * 10)
  const marks = [-90, -40, 0, 45, 90]
  return (
    <>
      <g transform={`${wall(30, 118)} scale(1.15)`}>
        <rect x={0} y={-24} width={38} height={24} fill={PAPER} />
        <line x1={0} y1={-16} x2={38} y2={-16} strokeWidth={0.6} />
        <line x1={19} y1={-16} x2={19} y2={0} strokeWidth={0.6} />
        <line x1={4} y1={-9} x2={14} y2={-9} strokeWidth={0.6} />
        <line x1={23} y1={-9} x2={33} y2={-9} strokeWidth={0.6} />
        <g transform="rotate(-16 0 -24)">
          <rect x={0} y={-31} width={38} height={7} fill={PAPER} />
          {[3, 12, 21, 30].map((x) => (
            <path key={x} d={`M ${x} -31 h 4 l -4 7 h -4 Z`} fill={INK} stroke="none" />
          ))}
        </g>
        <circle cx={1.5} cy={-24} r={1.4} fill={INK} stroke="none" />
      </g>
      <g transform={deck(r.x, r.y)}>
        <rect x={-90} y={-32} width={180} height={64} fill={PAPER} />
        {holes.map((x) => (
          <g key={x} strokeWidth={0.6}>
            <rect x={x} y={-29.5} width={5} height={3.5} rx={0.8} />
            <rect x={x} y={26} width={5} height={3.5} rx={0.8} />
          </g>
        ))}
        {frames.map((x, i) => (
          <g key={x} transform={`translate(${x} -22)`}>
            <rect width={25} height={44} fill={i === 2 ? ORANGE : PAPER} />
            {i === 0 && (
              <>
                <circle cx={12.5} cy={15} r={5} />
                <path d="M 4 34 C 4 23, 21 23, 21 34" />
              </>
            )}
            {i === 1 && (
              <>
                <rect x={6} y={13} width={13} height={17} />
                <line x1={6} y1={18} x2={19} y2={18} strokeWidth={0.6} />
              </>
            )}
            {i === 2 && (
              <>
                <line x1={4} y1={18} x2={21} y2={18} strokeWidth={2.4} />
                <line x1={4} y1={25} x2={16} y2={25} strokeWidth={2.4} />
              </>
            )}
            {i === 3 && (
              <>
                <rect x={3} y={17} width={19} height={9} rx={4.5} />
                <path d="M 9 21.5 h 6 m -2.5 -2.5 l 2.5 2.5 l -2.5 2.5" strokeWidth={0.7} />
              </>
            )}
          </g>
        ))}
        <line x1={-90} y1={40} x2={90} y2={40} strokeWidth={0.7} />
        {marks.map((x) => (
          <line key={x} x1={x} y1={37} x2={x} y2={43} strokeWidth={0.7} />
        ))}
      </g>
      <Callout from={onDeck(r.x, r.y, 34, -19)} to={{ x: 216, y: 30 }} code="SHOT 3" label="0:12" size={LABEL} />
      <Callout from={onDeck(r.x, r.y, 90, 40)} to={{ x: 232, y: 112 }} code="CUT" label="0:30" size={LABEL} />
    </>
  )
}

// PG-06: the editor, upright, with one line pulled out to be swapped and a tone slider.
function EditorPlate() {
  const o = { x: 44, y: 140 }
  const pull = 26
  const out = { x: o.x + ISO.a * pull, y: o.y + ISO.b * pull }
  const slot = { x: 6, y: -44, width: 98, height: 8 }
  const slotCorners = [
    [slot.x, slot.y],
    [slot.x + slot.width, slot.y],
    [slot.x + slot.width, slot.y + slot.height],
    [slot.x, slot.y + slot.height],
  ]
  return (
    <>
      <g transform={wall(o.x, o.y)}>
        <rect x={0} y={-76} width={124} height={76} fill={PAPER} />
        <line x1={0} y1={-64} x2={124} y2={-64} />
        <rect x={6} y={-73} width={8} height={6} strokeWidth={0.7} />
        <rect x={17} y={-73} width={8} height={6} strokeWidth={0.7} />
        <line x1={8.5} y1={-70} x2={11.5} y2={-70} strokeWidth={1.4} />
        <line x1={21} y1={-72} x2={20.5} y2={-68} strokeWidth={0.8} />
        <line x1={34} y1={-70} x2={82} y2={-70} strokeWidth={0.8} />
        {[34, 58, 82].map((x) => (
          <line key={x} x1={x} y1={-72.5} x2={x} y2={-67.5} strokeWidth={0.6} />
        ))}
        <circle cx={66} cy={-70} r={2.8} fill={INK} stroke="none" />
        <path d="M 112 -67 a 4 4 0 1 0 -4 -4" strokeWidth={0.8} />
        <path d="M 108 -74 l 0 3 l 3 0" strokeWidth={0.8} />
        {[-56, -30, -22, -14].map((y, i) => (
          <line key={y} x1={6} y1={y} x2={[110, 96, 112, 70][i]} y2={y} strokeWidth={0.8} />
        ))}
        <rect {...slot} strokeDasharray="2 2" strokeWidth={0.7} />
        <line x1={6} y1={-6} x2={36} y2={-6} strokeWidth={0.5} />
      </g>
      {slotCorners.map(([x, y]) => {
        const from = onWall(o.x, o.y, x, y)
        const to = onWall(out.x, out.y, x, y)
        return <line key={`${x}${y}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} strokeDasharray="2 2" strokeWidth={0.6} />
      })}
      <g transform={wall(out.x, out.y)}>
        <rect {...slot} fill={ORANGE} />
        <line x1={11} y1={-40} x2={80} y2={-40} strokeWidth={2.2} />
        <line x1={86} y1={-46} x2={86} y2={-34} strokeWidth={0.9} />
      </g>
      <Callout from={onWall(o.x, o.y, 66, -70)} to={{ x: 196, y: 26 }} code="TONE" label="WARMER" size={LABEL} />
      <Callout from={onWall(out.x, out.y, slot.x + slot.width, -40)} to={{ x: 196, y: 82 }} code="SWAP" label="LINE 3" size={LABEL} />
    </>
  )
}

const PLATES = {
  radar: RadarPlate,
  brief: BriefPlate,
  script: ScriptPlate,
  carousel: CarouselPlate,
  reel: ReelPlate,
  editor: EditorPlate,
}

export type PlateKind = keyof typeof PLATES

export function Plate({ kind, className }: { kind: PlateKind; className?: string }) {
  const Drawing = PLATES[kind]
  return (
    <svg viewBox="0 0 300 160" className={cn(styles.mono, className)} fill="none" stroke={INK} strokeWidth={1} aria-hidden>
      <Drawing />
    </svg>
  )
}
