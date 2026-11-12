import { useEffect } from 'react'

const DURATION = 760   // ms for bolt to descend full section height
const FADE_OUT = 180   // ms canvas opacity-out after descent

// ── Pre-compute a stable vertical zigzag polyline ────────
// cx = x center, H = total height, spread = max x deviation.
// Using sin() makes the shape deterministic (not random each frame),
// so the drawn portion stays still while the tip advances.
function buildBolt(cx, H, spread) {
  const pts = [{ x: cx, y: 0 }]
  const segH = 14
  let y = 0, i = 0
  while (y < H) {
    y = Math.min(y + segH, H)
    pts.push({ x: cx + Math.sin(i * 2.356 + 0.7) * spread, y })
    i++
  }
  return pts
}

// ── Render one animation frame ────────────────────────────
function paintFrame(canvas, ctx, pts, tipY, cx, nodes) {
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  if (tipY < 2) return

  // Build the visible slice of the bolt up to tipY + slight tip jitter
  const flickY = tipY + (Math.random() - 0.5) * 5
  const drawPts = []
  for (const p of pts) {
    if (p.y > flickY) {
      const prev = drawPts[drawPts.length - 1]
      if (prev) {
        const f = (flickY - prev.y) / (p.y - prev.y)
        drawPts.push({
          x: prev.x + (p.x - prev.x) * f + (Math.random() - 0.5) * 5,
          y: flickY,
        })
      }
      break
    }
    drawPts.push(p)
  }
  if (drawPts.length < 2) return

  // Three rendering passes: wide glow → amber body → white core
  for (const [lw, style, blur] of [
    [7,   'rgba(251,191,36,0.22)', 24],
    [2.5, 'rgba(251,191,36,0.88)', 10],
    [1.2, '#ffffff',                4],
  ]) {
    ctx.lineWidth   = lw
    ctx.strokeStyle = style
    ctx.shadowColor = '#fbbf24'
    ctx.shadowBlur  = blur
    ctx.lineCap     = 'round'
    ctx.lineJoin    = 'round'
    ctx.beginPath()
    drawPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y))
    ctx.stroke()
  }

  // Tip energy dot
  const tip = drawPts[drawPts.length - 1]
  ctx.shadowColor = '#fff'
  ctx.shadowBlur  = 18
  ctx.fillStyle   = '#fff'
  ctx.beginPath()
  ctx.arc(tip.x, tip.y, 4, 0, Math.PI * 2)
  ctx.fill()

  // Nodes: pulse when bolt arrives, settle to steady amber glow after
  for (const nd of nodes) {
    if (nd.y > tipY + 8) continue
    const alpha = Math.min(1, 0.55 + 0.45 * Math.exp(-(tipY - nd.y) / (H * 0.1)))
    // Outer ring
    ctx.shadowColor = '#fbbf24'
    ctx.shadowBlur  = alpha * 22
    ctx.strokeStyle = `rgba(251,191,36,${alpha})`
    ctx.lineWidth   = 1.8
    ctx.beginPath()
    ctx.arc(cx, nd.y, 7, 0, Math.PI * 2)
    ctx.stroke()
    // Fill
    ctx.fillStyle  = `rgba(251,191,36,${alpha * 0.28})`
    ctx.shadowBlur = 4
    ctx.beginPath()
    ctx.arc(cx, nd.y, 5.5, 0, Math.PI * 2)
    ctx.fill()
    // Center dot
    ctx.fillStyle  = `rgba(255,255,255,${alpha * 0.9})`
    ctx.shadowBlur = 6
    ctx.beginPath()
    ctx.arc(cx, nd.y, 2, 0, Math.PI * 2)
    ctx.fill()
  }
}

function ease(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t }

// ── Arc driver ────────────────────────────────────────────
// Canvas is position:absolute inside the section so it scrolls
// alongside the content — the bolt visually accompanies the
// section as it enters the viewport from below.
function fireArc(section, onDone) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    onDone()
    return
  }

  const H  = Math.ceil(section.getBoundingClientRect().height)
  const isMobile = window.innerWidth < 640
  const W  = isMobile ? 32 : 44
  const cx = W / 2
  const left = isMobile ? 4 : 8

  // 3–5 nodes spaced evenly down the section with small jitter
  const nodeCount = Math.max(3, Math.min(5, Math.round(H / 160)))
  const nodes = Array.from({ length: nodeCount }, (_, i) => ({
    y: H * (i + 1) / (nodeCount + 1) + (Math.random() - 0.5) * 14,
  }))

  const spread  = 10
  const boltPts = buildBolt(cx, H, spread)

  const canvas = document.createElement('canvas')
  canvas.width  = W
  canvas.height = H
  Object.assign(canvas.style, {
    position:      'absolute',
    top:           '0',
    left:          `${left}px`,
    width:         `${W}px`,
    height:        `${H}px`,
    pointerEvents: 'none',
    zIndex:        '30',
    transition:    `opacity ${FADE_OUT}ms ease`,
  })
  section.appendChild(canvas)
  const ctx = canvas.getContext('2d')

  let startTs = null

  function tick(ts) {
    if (!startTs) startTs = ts
    const t = (ts - startTs) / DURATION

    if (t >= 1) {
      paintFrame(canvas, ctx, boltPts, H, cx, nodes)
      canvas.style.opacity = '0'
      setTimeout(() => { canvas.remove(); onDone() }, FADE_OUT)
      return
    }

    paintFrame(canvas, ctx, boltPts, ease(t) * H, cx, nodes)
    requestAnimationFrame(tick)
  }

  requestAnimationFrame(tick)
}

// ── Hook ─────────────────────────────────────────────────
export function useSectionReveal() {
  useEffect(() => {
    const sections = document.querySelectorAll('[data-reveal]')
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target)
            const el = entry.target
            fireArc(el, () => { el.dataset.reveal = 'active' })
          }
        })
      },
      { threshold: 0.07, rootMargin: '0px 0px -48px 0px' },
    )

    sections.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}
