import { useRef, useState } from 'react'
import projects from '../data/Projects'
import ScrollFloat from './ScrollFloat'
import Reveal from './Reveal'
import './Projects.css'

function Slide({ project, index, total, active, onSelect }) {
  // screenshot na mile toh gradient placeholder dikhao
  const [imgFailed, setImgFailed] = useState(false)
  const num = String(index + 1).padStart(2, '0')

  return (
    <article
      className={active ? 'slide active' : 'slide'}
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${total}: ${project.name}`}
      onClick={onSelect}
    >
      <div className="slide-media">
        {imgFailed ? (
          <div className="slide-ph" style={{ background: project.gradient }}>
            {num}
          </div>
        ) : (
          <img
            src={project.image}
            alt={`${project.name} screenshot`}
            draggable="false"
            onError={() => setImgFailed(true)}
          />
        )}
        <span className="slide-num">{num}</span>
      </div>

      {/* sirf active slide ki detail dikhti hai, baaki mein hidden (tab se bhi nahi pakdi jaati) */}
      <div className="slide-body">
        <h3 className="slide-name">{project.name}</h3>
        <p className="slide-desc">{project.description}</p>
        <ul className="slide-tags">
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <a href={project.github} className="slide-link">GitHub ↗</a>
      </div>
    </article>
  )
}

function Projects() {
  const [index, setIndex] = useState(0)
  const startX = useRef(null)
  const dragged = useRef(false)
  const total = projects.length

  // last ke baad wapas pehle pe, aur pehle se peeche last pe
  const go = (i) => setIndex((i + total) % total)

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') go(index - 1)
    if (e.key === 'ArrowRight') go(index + 1)
  }

  // swipe / drag: 50px se zyada khiche toh agla ya pichla slide
  const onPointerDown = (e) => {
    startX.current = e.clientX
    dragged.current = false
  }
  const onPointerUp = (e) => {
    if (startX.current === null) return
    const dx = e.clientX - startX.current
    startX.current = null
    if (Math.abs(dx) > 50) {
      dragged.current = true
      go(dx < 0 ? index + 1 : index - 1)
      setTimeout(() => { dragged.current = false }, 0)
    }
  }

  return (
    <section className="projects" id="projects">
      <div className="section-head projects-head">
        <div>
          <p className="section-label">Selected work</p>
          <ScrollFloat text="Projects" className="section-title" />
        </div>
        <p className="section-count">({String(total).padStart(2, '0')})</p>
      </div>

      <Reveal delay={0.1}>
      <div className="carousel" role="region" aria-roledescription="carousel" aria-label="Projects">
        <div
          className="carousel-viewport"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => { startX.current = null }}
        >
          {/* --index se CSS track ko khiska deta hai */}
          <div className="carousel-track" style={{ '--index': index }}>
            {projects.map((project, i) => (
              <Slide
                key={project.id}
                project={project}
                index={i}
                total={total}
                active={i === index}
                // side wale (aadhe dikhte) card pe click karo toh woh beech mein aa jaata hai
                onSelect={() => { if (!dragged.current && i !== index) go(i) }}
              />
            ))}
          </div>
        </div>

        <div className="carousel-controls">
          <button className="car-btn" onClick={() => go(index - 1)} aria-label="Previous project">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>

          <div className="car-dots">
            {projects.map((project, i) => (
              <button
                key={project.id}
                className={i === index ? 'car-dot active' : 'car-dot'}
                onClick={() => go(i)}
                aria-label={`Go to project ${i + 1}`}
              />
            ))}
          </div>

          <button className="car-btn" onClick={() => go(index + 1)} aria-label="Next project">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      </Reveal>
    </section>
  )
}

export default Projects