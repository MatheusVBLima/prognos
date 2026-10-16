// Shared pieces for the hairline "service manual" drawings. Ink is currentColor and the one
// highlighted part is var(--accent), so every drawing follows the theme the page runs on.

export const INK = "currentColor"
export const ORANGE = "var(--accent)"
export const PAPER = "var(--background)"
export const HAIR = 1.25

export type Point = { x: number; y: number }

// Isometric projection. Three planes cover every drawing:
// - `flat`: the floor. Local x runs down-right, local y runs down-left.
// - `deck`: the floor turned a quarter, so text and charts read up-right and climb straight up.
// - `wall`: an upright face turned to the right. Local x runs up-right, local y runs straight down.
export const ISO = { a: 0.74, b: 0.42 }

export function flat(cx: number, cy: number) {
  return `matrix(${ISO.a} ${ISO.b} ${-ISO.a} ${ISO.b} ${cx} ${cy})`
}

export function onFlat(cx: number, cy: number, x: number, y: number): Point {
  return { x: cx + ISO.a * (x - y), y: cy + ISO.b * (x + y) }
}

export function deck(cx: number, cy: number) {
  return `matrix(${ISO.a} ${-ISO.b} ${ISO.a} ${ISO.b} ${cx} ${cy})`
}

export function onDeck(cx: number, cy: number, x: number, y: number): Point {
  return { x: cx + ISO.a * (x + y), y: cy + ISO.b * (y - x) }
}

export function wall(cx: number, cy: number) {
  return `matrix(${ISO.a} ${-ISO.b} 0 1 ${cx} ${cy})`
}

export function onWall(cx: number, cy: number, x: number, y: number): Point {
  return { x: cx + ISO.a * x, y: cy - ISO.b * x + y }
}

// Diagonal hatching inside a rectangle.
export function Hatch({ x, y, w, h, gap = 6 }: { x: number; y: number; w: number; h: number; gap?: number }) {
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

// A leader from a part to a mono label: dot on the part, a short shoulder, then the text.
export function Callout({ from, to, code, label, size = 10 }: { from: Point; to: Point; code: string; label?: string; size?: number }) {
  return (
    <g strokeWidth={0.8}>
      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} />
      <line x1={to.x} y1={to.y} x2={to.x + size * 1.4} y2={to.y} />
      <circle cx={from.x} cy={from.y} r={size / 5} fill={INK} stroke="none" />
      <text x={to.x + size * 2} y={to.y + size * 0.35} fontSize={size} letterSpacing={size * 0.16} fill={INK} stroke="none">
        <tspan fontWeight={600}>{code}</tspan>
        {label ? ` ${label}` : null}
      </text>
    </g>
  )
}

// A filled arrowhead sitting on the end of the segment from -> to.
export function Arrowhead({ from, to, size = 12 }: { from: number[]; to: number[]; size?: number }) {
  const len = Math.hypot(to[0] - from[0], to[1] - from[1])
  const [dx, dy] = [(to[0] - from[0]) / len, (to[1] - from[1]) / len]
  const [bx, by] = [to[0] - dx * size, to[1] - dy * size]
  const half = size * 0.42
  return <path d={`M ${to[0]} ${to[1]} L ${bx - dy * half} ${by + dx * half} L ${bx + dy * half} ${by - dx * half} Z`} fill={INK} stroke="none" />
}

export function Heart() {
  return <path d="M 0 5 C -8 -1, -7 -7, -3.5 -7 C -1.5 -7, 0 -5.5, 0 -4 C 0 -5.5, 1.5 -7, 3.5 -7 C 7 -7, 8 -1, 0 5 Z" />
}

export function Bubble() {
  return <path d="M -6 -5 H 6 V 3 H -1 L -5 7 V 3 H -6 Z" />
}

export function Plane() {
  return <path d="M -7 0 L 7 -6 L 3 7 L 0 2 Z M 0 2 L 7 -6" />
}
