import { useCallback, useEffect, useRef, useState } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#$%&*+<>'

// Text pehle ulte-seedhe akshar mein ghoomta hai, phir left se right ek ek karke sahi ho jaata hai.
// Screen mein aate hi chalta hai, aur mouse le jaao toh dobara chalta hai.
function ScrambleText({ text, delay = 0, duration = 900, className = '' }) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [shown, setShown] = useState(reduceMotion ? text : '')
  const rootRef = useRef(null)
  const frameRef = useRef(0)

  const run = useCallback(() => {
    if (reduceMotion) return
    cancelAnimationFrame(frameRef.current)
    const start = performance.now()
    let last = 0

    const tick = (now) => {
      // ~25 baar per second kaafi hai, har frame pe badalna zarurat se zyada hai
      if (now - last > 40 || now - start >= duration) {
        last = now
        const progress = Math.min(1, (now - start) / duration)
        const fixed = Math.floor(progress * text.length)
        let out = ''
        for (let i = 0; i < text.length; i++) {
          const ch = text[i]
          out += i < fixed || ch === ' ' ? ch : CHARS[Math.floor(Math.random() * CHARS.length)]
        }
        setShown(out)
        if (progress >= 1) return
      }
      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
  }, [text, duration, reduceMotion])

  useEffect(() => {
    if (reduceMotion) return
    const el = rootRef.current
    let timer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(run, delay * 1000)
          observer.disconnect()
        }
      },
      { threshold: 0.6 }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      clearTimeout(timer)
      cancelAnimationFrame(frameRef.current)
    }
  }, [run, delay, reduceMotion])

  return (
    <span ref={rootRef} className={`scramble ${className}`} onMouseEnter={run}>
      {/* asli text jagah gherta hai (width fixed rehti hai) aur screen reader ke liye hai */}
      <span className="scramble-real">{text}</span>
      <span className="scramble-fx" aria-hidden="true">{shown}</span>
    </span>
  )
}

export default ScrambleText