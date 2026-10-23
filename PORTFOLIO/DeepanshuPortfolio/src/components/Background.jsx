import ParticleWave from './ParticleWave'
import './Background.css'

// Poori site ke peeche ek hi background, taaki har section ek jaisa lage
function Background() {
  return (
    <div className="bg" aria-hidden="true">
      <ParticleWave />
    </div>
  )
}

export default Background