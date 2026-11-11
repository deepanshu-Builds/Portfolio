import ParticleHeading from './ParticleHeading'
import DitherVeil from './DitherVeil'

import './Hero.css'
import Background from './Background'

// component ke bahar rakha hai taaki har render pe naya array na bane
const headingLines = [
  { text: 'DEEPANSHU', color: '#08f2fa' },
  { text: 'SAINI', color: '#e1dff1' },
]

function Hero() {
  return (
  <>

      <div className="hero">
        <ParticleHeading lines={headingLines} 
        style={{
       
        }}
        />

        <div className="hero-bottom">
          <div className="hero-info">
            {/* <p className="about-text">
              Full-stack developer who loves building fast, clean web apps.
              Comfortable with MongoDB, Express, React and Node, always
              learning something new.
            </p> */}
              <DitherVeil
             
               fit="contain"
     inkColor="#080808"
    paperColor="#fffcfd"
    pixelSize={0}
    levels={3}
  
    />
          </div>
        </div>
      </div>
      </>
   
  )
}

export default Hero