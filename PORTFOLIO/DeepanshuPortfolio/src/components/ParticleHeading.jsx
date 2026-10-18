import { useEffect, useRef } from 'react'

// Heading ko chhote chhote dots (particles) mein todta hai.
// Mouse / finger paas aaye toh dots door bhaagte hain, phir wapas apni jagah aa jaate hain.
function ParticleHeading({ lines }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const mouse = { x: -9999, y: -9999 }
    let groups = []
    let w = 0
    let h = 0
    let dot = 2
    let radius = 100
    let frameId
    let lastWidth = 0
    let resizeTimer

    const fontFor = (size) => `400 ${size}px "Abril Fatface", Georgia, serif`

    // 1) text ko ek hidden canvas pe likho, 2) pixels padho, 3) har pixel ek particle
    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = wrap.clientWidth
      lastWidth = w

      // heading itni badi na ho ki paragraph screen se bahar jaye. height limit sirf tab lagao jab screen ki height sahi mile (kuch jagah shuru mein 0 hoti hai)
      const hCap = window.innerHeight >= 400 ? window.innerHeight * 0.22 : Infinity

      // pehle 100px pe naap lo, phir size aisa nikalo ki sabse lamba word poori width bhare
      const off = document.createElement('canvas')
      const octx = off.getContext('2d')
      octx.font = fontFor(100)
      const widest100 = Math.max(...lines.map((l) => octx.measureText(l.text.toUpperCase()).width))
      if (!widest100 || !w) return
      const size = Math.min(220, hCap, (100 * w * 0.98) / widest100)

      const lineH = size * 0.95
      h = Math.ceil(lineH * lines.length)

      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      off.width = w
      off.height = h
      octx.font = fontFor(size)
      octx.fillStyle = '#fff'
      const capH = octx.measureText('H').actualBoundingBoxAscent
      lines.forEach((l, i) => {
        octx.fillText(l.text.toUpperCase(), 0, i * lineH + lineH / 2 + capH / 2)
      })

      const data = octx.getImageData(0, 0, w, h).data
      const gap = Math.max(2, Math.round(size / 55))
      dot = gap * 0.8
      radius = Math.max(60, size * 0.75)

      groups = lines.map((l) => ({ color: l.color, pts: [] }))
      for (let y = 0; y < h; y += gap) {
        for (let x = 0; x < w; x += gap) {
          if (data[(y * w + x) * 4 + 3] > 128) {
            const g = Math.min(lines.length - 1, Math.floor(y / lineH))
            groups[g].pts.push({
              x: reduceMotion ? x : Math.random() * w, // shuru mein bikhre hue, phir jud jaate hain
              y: reduceMotion ? y : Math.random() * h,
              ox: x,
              oy: y,
              vx: 0,
              vy: 0,
            })
          }
        }
      }
      if (reduceMotion) draw()
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const g of groups) {
        ctx.fillStyle = g.color
        for (const p of g.pts) {
          if (!reduceMotion) {
            const dx = p.x - mouse.x
            const dy = p.y - mouse.y
            const d2 = dx * dx + dy * dy
            if (d2 < radius * radius) {
              const d = Math.sqrt(d2) || 1
              const force = (radius - d) / radius
              p.vx += (dx / d) * force * 6
              p.vy += (dy / d) * force * 6
            }
            // spring: apni asli jagah ki taraf kheencho
            p.vx += (p.ox - p.x) * 0.06
            p.vy += (p.oy - p.y) * 0.06
            p.vx *= 0.86
            p.vy *= 0.86
            p.x += p.vx
            p.y += p.vy
          }
          ctx.fillRect(p.x, p.y, dot, dot)
        }
      }
    }

    const loop = () => {
      draw()
      frameId = requestAnimationFrame(loop)
    }

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const onLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }
    // mobile pe address bar se resize fire hota hai, isliye sirf width badle tab rebuild
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        if (wrap.clientWidth !== lastWidth) build()
      }, 150)
    }

    let cancelled = false
    let started = false
    const start = () => {
      if (cancelled || started) return
      started = true
      build()
      if (!reduceMotion) loop()
    }
    // font load hone ke baad hi build karo, warna galat font ke dots ban jaayenge
    document.fonts.load('400 100px "Abril Fatface"').catch(() => {}).then(start)
    // font load na bhi ho toh 1.5 sec baad heading zaroor dikhegi
    const fallbackTimer = setTimeout(start, 1500)

    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', onResize)

    return () => {
      cancelled = true
      cancelAnimationFrame(frameId)
      clearTimeout(resizeTimer)
      clearTimeout(fallbackTimer)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [lines])

  return (
    <div className="hero-title" ref={wrapRef}>
      {/* screen reader aur SEO ke liye asli heading, canvas sirf dikhane ke liye hai */}
      <h1 className="sr-only">{lines.map((l) => l.text).join(' ')}</h1>
      <canvas ref={canvasRef} className="particle-heading" aria-hidden="true" />
    </div>
  )
}

export default ParticleHeading