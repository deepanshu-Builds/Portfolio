import { useRef, useState } from 'react'
import projects from '../data/Projects';
import './Projects.css'

function ProjectCard({ project, index, active, onActivate }) {
  // screenshot na mile toh gradient placeholder dikhao
  const [imgFailed, setImgFailed] = useState(false)
  const num = String(index + 1).padStart(2, '0')

  return (
    <article
      className={active ? 'proj-card active' : 'proj-card'}
      tabIndex={0}
      aria-label={project.name}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
    >
      <div className="proj-media">
        {imgFailed ? (
          <div className="proj-ph" style={{ background: project.gradient }}>
            {num}
            <small>Screenshot yahan lagega</small>
          </div>
        ) : (
          <img src={project.image} alt={`${project.name} screenshot`} onError={() => setImgFailed(true)} />
        )}
      </div>
      <div className="proj-shade" />

      <span className="proj-num">{num}</span>

      {/* band card pe sirf naam (side mein likha hua) */}
      <div className="proj-rail">
        <span>{project.name}</span>
      </div>

      {/* khula card: poori detail */}
      <div className="proj-body">
        <h3 className="proj-name">{project.name}</h3>
        <p className="proj-desc">{project.description}</p>
        <ul className="proj-tags">
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <div className="proj-links">
          <a href={project.live} className="primary">Live Demo</a>
          <a href={project.github}>GitHub</a>
        </div>
      </div>
    </article>
  )
}

function Projects() {
  const [activeId, setActiveId] = useState(projects[0].id)
  const timer = useRef(null)

  // thoda delay, warna cards resize hote waqt idhar-udhar hilte (flicker) rehte hain
  const activateSoon = (id) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setActiveId(id), 70)
  }

  return (
    <section className="projects" id="projects">
      <div className="projects-head">
        <div>
          <p className="projects-label">Selected work</p>
          <h2 className="projects-title">Projects</h2>
        </div>
        <p className="projects-count">({String(projects.length).padStart(2, '0')})</p>
      </div>

      <div className="flex-gallery" onMouseLeave={() => clearTimeout(timer.current)}>
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={i}
            active={activeId === project.id}
            onActivate={() => activateSoon(project.id)}
          />
        ))}
      </div>
    </section>
  )
}

export default Projects