import { useEffect } from 'react'

// ── Lightning arc algorithm ───────────────────────────────
// Builds a flat list of {x1,y1,x2,y2,alpha} segments
// representing a recursive zigzag bolt with random branches.
function buildBolt(x1, y1, x2, y2, spread, depth, segs = [], alpha = 1) {
  if (depth === 0 || Math.hypot(x2 - x1, y2 - y1) < 10) {
    segs.push({ x1, y1, x2, y2, alpha })
    return segs
  }

  const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * spread
  const my = (y1 + y2) / 2 + (Math.random() - 0.5) * spread * 0.25

  buildBolt(x1, y1, mx, my, spread * 0.65, depth - 1, segs, alpha)

  // Random branch fork
  if (depth >= 3 && Math.random() > 0.5) {
    const bx = mx + (Math.random() - 0.5) * spread * 2.2
    const by = my + (Math.random() * 0.5 + 0.3) * spread
    buildBolt(mx, my, bx, by, spread * 0.4, depth - 2, segs, alpha * 0.35)
  }

  buildBolt(mx, my, x2, y2, spread * 0.65, depth - 1, segs, alpha)
  return segs
}

// Renders one lightning frame: 3 passes (wide glow → mid → white core)
function paintBolt(canvas, ctx, x1, y1, x2, y2) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Slight y-jitter per frame keeps the bolt alive/flickering
  const sy = y1 + (Math.random() - 0.5) * 14
  const ey = y2 + (Math.random() - 0.5) * 14
  const spread = Math.abs(x2 - x1) * 0.12
  const segs = buildBolt(x1, sy, x2, ey, spread, 7)

  const passes = [
    { lw: 9,   colorFn: (a) => `rgba(251,191,36,${+(0.22 * a).toFixed(2)})`, blur: 32 },
    { lw: 3.5, colorFn: (a) => `rgba(251,191,36,${+(0.85 * a).toFixed(2)})`, blur: 14 },
    { lw: 1.5, colorFn: (a) => a > 0.6 ? '#fff' : `rgba(255,255,255,${+(a * 1.5).toFixed(2)})`, blur: 6 },
  ]

  for (const { lw, colorFn, blur } of passes) {
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.shadowColor = '#fbbf24'
    ctx.shadowBlur = blur

    for (const s of segs) {
      ctx.lineWidth = lw * (s.alpha < 1 ? 0.55 : 1)
      ctx.strokeStyle = colorFn(s.alpha)
      ctx.beginPath()
      ctx.moveTo(s.x1, s.y1)
      ctx.lineTo(s.x2, s.y2)
      ctx.stroke()
    }
  }
}

// ── Arc animation driver ──────────────────────────────────
// Canvas is position:fixed (not inside section) so it's fully
// independent of the section's opacity:0 pending state.
function fireArc(section, onDone) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    onDone()
    return
  }

  const rect = section.getBoundingClientRect()
  const W    = Math.ceil(rect.width) + 20
  const H    = 190
  const arcY = 72  // canvas-relative y where the arc runs = section top boundary

  const canvas = document.createElement('canvas')
  canvas.width  = W
  canvas.height = H
  Object.assign(canvas.style, {
    position:      'fixed',
    top:           `${Math.round(rect.top) - arcY}px`,
    left:          `${Math.round(rect.left) - 10}px`,
    width:         `${W}px`,
    height:        `${H}px`,
    pointerEvents: 'none',
    zIndex:        '9999',
  })
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')

  // Three flashes: delay (ms from start) + duration (ms)
  const flashes = [
    { at: 0,   len: 90 },
    { at: 130, len: 72 },
    { at: 215, len: 58 },
  ]
  const totalMs = 295

  let startTs = null
  let fi = 0

  function tick(ts) {
    if (!startTs) startTs = ts
    const t = ts - startTs

    if (t >= totalMs) {
      canvas.remove()
      onDone()
      return
    }

    const f = flashes[fi]
    if (f) {
      if (t >= f.at && t < f.at + f.len) {
        paintBolt(canvas, ctx, 0, arcY, W, arcY)
      } else if (t >= f.at + f.len) {
        ctx.clearRect(0, 0, W, H)
        fi++
      }
    }

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
