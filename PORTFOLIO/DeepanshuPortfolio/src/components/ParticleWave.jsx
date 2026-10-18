import { useEffect, useRef } from 'react'

// Chhote chhote dots ka wave jo hero ke peeche chalta rehta hai
function ParticleWave() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let frameId
    let time = 0

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#fff'

      // chhoti screen pe dots thode paas paas
      const gap = w < 500 ? 7 : 9

      for (let x = 0; x < w; x += gap) {
        for (let y = 0; y < h; y += gap) {
          // center se door jaate hue ellipse ke hisaab se wave banta hai
          const dx = (x - w / 2) / (w * 0.5)
          const dy = (y - h / 2) / (h * 0.5)
          const dist = Math.sqrt(dx * dx + dy * dy)
          const wave = Math.sin(dist * 9 - time)

          if (dist < 1 && wave > 0.55) {
            ctx.globalAlpha = (1 - dist) * 0.9
            ctx.fillRect(x, y, wave * 1.3, wave * 1.3)
          }
        }
      }
      ctx.globalAlpha = 1
    }

    const loop = () => {
      time += 0.015
      draw()
      frameId = requestAnimationFrame(loop)
    }

    const onResize = () => {
      resize()
      draw()
    }

    resize()
    window.addEventListener('resize', onResize)

    // reduced motion ON ho toh animation nahi chalayenge
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      draw()
    } else {
      loop()
    }

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="particle-wave" />
}

export default ParticleWave