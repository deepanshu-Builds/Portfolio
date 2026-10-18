import ParticleWave from './ParticleWave'
import ParticleHeading from './ParticleHeading'
import './Hero.css'

// component ke bahar rakha hai taaki har render pe naya array na bane
const headingLines = [
  { text: 'Creative', color: '#ffffff' },
  { text: 'Developer', color: '#555555' },
]

function Hero() {
  return (
    <section className="hero">
      <ParticleWave />

      <ParticleHeading lines={headingLines} />

      <div className="hero-bottom">
        <div className="hero-left">
          
          
        </div>

        

        <p className="about-text">
          Full-stack developer who loves building fast, clean web apps.
          Comfortable with MongoDB, Express, React and Node, always
          learning something new.
        </p>
      </div>
    </section>
  )
}

export default Hero