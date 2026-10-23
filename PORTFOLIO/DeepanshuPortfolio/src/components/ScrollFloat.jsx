import { Fragment, useEffect, useRef } from 'react'

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

// Scroll karte hi text ke akshar neeche se ek ek karke upar uthte hain (React Bits ke ScrollFloat jaisa).
// Animation scroll ke saath chalti hai: scroll roko toh ruk jaati hai, wapas karo toh ulti chalti hai.
function ScrollFloat({ text, className = '' }) {
  const wrapRef = useRef(null)
  const charRefs = useRef([])
  const words = text.split(' ')
  let counter = 0

  useEffect(() => {
    const wrap = wrapRef.current
    const nodes = charRefs.current
    const n = nodes.length
    const stagger = Math.min(0.06, 0.5 / n) // har akshar thoda der se shuru hota hai
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let ticking = false

    const update = () => {
      ticking = false
      const vh = window.innerHeight
      const rect = wrap.getBoundingClientRect()

      // heading jaise jaise screen mein upar aati hai, progress 0 se 1 hota hai
      const progress = reduceMotion ? 1 : clamp((vh - rect.top - 40) / (vh * 0.55), 0, 1)

      nodes.forEach((node, i) => {
        if (!node) return
        let t = clamp((progress - i * stagger) / (1 - (n - 1) * stagger), 0, 1)
        t = 1 - Math.pow(1 - t, 3) // ease-out
        const r = 1 - t
        node.style.transform = `translateY(${r * 120}%) scaleY(${1 + r * 1.3}) scaleX(${1 - r * 0.3})`
        node.style.opacity = t
      })
    }

    // scroll pe har baar nahi, sirf screen refresh pe ek baar update
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [text])

  return (
    // asli text aria-label mein, taaki screen reader poora word padhe, akshar ek ek nahi
    <h2 ref={wrapRef} className={`scroll-float ${className}`} aria-label={text}>
      {words.map((word, wi) => (
        <Fragment key={wi}>
          {/* har word ka apna dabba: akshar uske neeche se nikalte dikhte hain */}
          <span className="sf-word" aria-hidden="true">
            {[...word].map((ch) => {
              const idx = counter++
              return (
                <span
                  key={idx}
                  className="sf-char"
                  ref={(el) => {
                    charRefs.current[idx] = el
                  }}
                >
                  {ch}
                </span>
              )
            })}
          </span>
          {wi < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </h2>
  )
}

export default ScrollFloat