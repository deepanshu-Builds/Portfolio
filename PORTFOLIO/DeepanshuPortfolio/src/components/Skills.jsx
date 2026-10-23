import skills from '../data/Skills'
import ScrollFloat from './ScrollFloat'
import ScrambleText from './ScrambleText'
import Reveal from './Reveal'
import './Skills.css'

function Skills() {
  return (
    <section className="section skills" id="skills">
      <div className="section-head">
        <div>
          <p className="section-label">What I work with</p>
          <ScrollFloat text="Skills" className="section-title" />
        </div>
      </div>

      {/* ek column: har category ki ek row, skills us row mein scramble hoke likhte hain */}
      <div className="skills-list">
        {skills.map((group, gi) => (
          <Reveal key={group.category} delay={gi * 0.08} className="skill-row">
            <h3 className="skill-cat">
              <span className="skill-idx">{String(gi + 1).padStart(2, '0')}</span>
              {group.category}
            </h3>
            <ul className="skill-items">
              {group.items.map((item, ii) => (
                <li key={item}>
                  <ScrambleText text={item} delay={gi * 0.15 + ii * 0.07} />
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export default Skills