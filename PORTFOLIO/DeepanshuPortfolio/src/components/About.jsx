import StrokeText from './Stroketext'
import Reveal from './Reveal'
import './About.css'

const facts = [
  { label: 'Based in', value: 'Meerut, India' },
  { label: 'Studying', value: 'BCA, 2024 – 2027' },
  { label: 'Focus', value: 'MERN stack' },
  { label: 'Looking for', value: 'Internships' },
]

function About() {
  return (
    <section className="section about" id="about">
      <div className="section-head">
        <div>
          <p className="section-label">Who I am</p>
          <StrokeText lines={['About me']} accent={['U', 'M']} width="clamp(200px, 28vw, 400px)" />
        </div>
      </div>

      <div className="about-grid">
        <Reveal className="about-copy">
          <p>
            I’m Deepanshu, a BCA student from Meerut and a self-taught MERN stack developer. I like building
            things that work end to end, from the database all the way to the screen.
          </p>
          <p>
            I learn by building. FlowMail pushed me into real-world backend topics like JWT authentication,
            role-based access and rate limiting. Along the way I’ve also built a real-time chat app, a Discord
            bot and a text-to-speech service.
          </p>
          <p>
            Right now I’m looking for an internship where I can work on real products and learn from a team,
            mostly around Noida and Delhi-NCR. On the side, I practise DSA in C++ and I’m starting to explore
            Gen AI.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="about-facts">
          <dl>
            {facts.map((fact) => (
              <div key={fact.label} className="fact">
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}

export default About