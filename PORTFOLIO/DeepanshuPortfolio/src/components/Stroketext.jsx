import { useEffect, useRef, useState } from 'react'
import './StrokeText.css'

const FONT = '"Abril Fatface", Georgia, serif'

// Heading sirf outline (stroke) se pehle likhi jaati hai, jaise koi pen se bana raha ho,
// phir andar se bhar jaati hai. Screen mein aate hi chalta hai, mouse le jaao toh dobara chalta hai.
// Concept: SVG text ka stroke-dashoffset kam karte jaate hain, toh line dheere dheere khinchti hai.
function StrokeText({ lines, accent = [], width = '100%', className = '' }) {
  const ref = useRef(null)
  const [box, setBox] = useState({ w: 600, h: 100 })
  const texts = lines.map((l) => l.toUpperCase())
  // accent mein jo akshar likhe hain, woh alag rang mein dikhte hain
  const accentSet = new Set(accent.map((a) => a.toUpperCase()))
  const lineGap = 95 // ek line se doosri line ki doori (font-size 100 ke hisaab se)

  // font load hone ke baad text ka asli size naapo, taaki SVG ka frame bilkul fit baithe
  useEffect(() => {
    let cancelled = false
    const measure = () => {
      if (cancelled) return
      const ctx = document.createElement('canvas').getContext('2d')
      ctx.font = `400 100px ${FONT}`
      const widest = Math.max(...texts.map((t) => ctx.measureText(t).width))
      setBox({ w: Math.ceil(widest) + 8, h: lineGap * (texts.length - 1) + 100 })
    }
    document.fonts.load(`400 100px ${FONT}`).catch(() => {}).then(measure)
    return () => {
      cancelled = true
    }
  }, [lines.join('|')])

  // screen mein aate hi animation shuru
  useEffect(() => {
    const el = ref.current
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      el.classList.add('static')
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('play')
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const replay = () => {
    const el = ref.current
    if (el.classList.contains('static')) return
    el.classList.remove('play')
    void el.getBoundingClientRect() // browser ko animation reset karne ka mauka
    el.classList.add('play')
  }

  return (
    <h2
      ref={ref}
      className={`stroke-title ${className}`}
      aria-label={lines.join(' ')}
      onMouseEnter={replay}
    >
      <svg
        viewBox={`0 0 ${box.w} ${box.h}`}
        style={{ width }}
        aria-hidden="true"
        focusable="false"
      >
        <text style={{ fontFamily: FONT, fontSize: 100 }}>
          {texts.map((t, i) => (
            <tspan key={i} x="4" y={80 + i * lineGap}>
              {[...t].map((ch, ci) =>
                accentSet.has(ch) ? (
                  <tspan key={ci} className="accent">
                    {ch}
                  </tspan>
                ) : (
                  ch
                )
              )}
            </tspan>
          ))}
        </text>
      </svg>
    </h2>
  )
}

export default StrokeText