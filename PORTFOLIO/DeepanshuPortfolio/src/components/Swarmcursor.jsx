import { useEffect, useRef } from 'react'

// Cursor ke aas-paas chhote dots ka jhund ghoomta hai.
// Yeh ek hi canvas hai jo poori screen pe fixed hai, isliye har section mein chalta hai.
function SwarmCursor({ count = 44 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // phone (touch) pe cursor hota hi nahi, aur reduced motion walon ke liye bhi band
    const canHover = window.matchMedia('(pointer: fine)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!canHover || reduceMotion) return

    let w = 0
    let h = 0
    let alpha = 0
    let frameId
    const mouse = { x: 0, y: 0, inside: false }

    // har dot ka apna chhota gola chakkar (radius, speed, size) hai
    const bugs = Array.from({ length: count }, () => ({
      x: 0,
      y: 0,
      px: 0,
      py: 0,
      angle: Math.random() * Math.PI * 2,
      radius: 12 + Math.random() * 52,
      speed: (0.012 + Math.random() * 0.025) * (Math.random() < 0.5 ? -1 : 1),
      size: 1 + Math.random() * 1.8,
      ease: 0.05 + Math.random() * 0.07,
    }))

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    // canvas fixed hai, isliye clientX/clientY seedha chal jaata hai (scroll se farak nahi padta)
    const onMove = (e) => {
      // pehli baar aaye toh dots wahin pe aa jaayein, door se udke na aayein
      if (!mouse.inside) {
        bugs.forEach((b) => {
          b.x = b.px = e.clientX + (Math.random() - 0.5) * 40
          b.y = b.py = e.clientY + (Math.random() - 0.5) * 40
        })
      }
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.inside = true
    }
    const onLeave = () => {
      mouse.inside = false
    }

    const loop = () => {
      frameId = requestAnimationFrame(loop)
      // mouse window se bahar gaya toh dots dheere dheere gayab
      alpha += ((mouse.inside ? 1 : 0) - alpha) * 0.08
      ctx.clearRect(0, 0, w, h)
      if (alpha < 0.01) return

      ctx.lineCap = 'round'
      ctx.strokeStyle = '#fff'
      ctx.fillStyle = '#fff'

      for (const b of bugs) {
        b.angle += b.speed
        const tx = mouse.x + Math.cos(b.angle) * b.radius
        const ty = mouse.y + Math.sin(b.angle * 1.3) * b.radius * 0.7
        b.px = b.x
        b.py = b.y
        b.x += (tx - b.x) * b.ease
        b.y += (ty - b.y) * b.ease

        // chhoti si poonchh, aur dot
        const vx = b.x - b.px
        const vy = b.y - b.py
        ctx.globalAlpha = alpha * 0.35
        ctx.lineWidth = b.size * 0.8
        ctx.beginPath()
        ctx.moveTo(b.x - vx * 5, b.y - vy * 5)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()

        ctx.globalAlpha = alpha * 0.9
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove)
    document.documentElement.addEventListener('mouseleave', onLeave)
    loop()

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [count])

  return <canvas ref={canvasRef} className="swarm" aria-hidden="true" />
}

export default SwarmCursor