import Background from './components/Background'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Projects from './components/Projects'
import Skills from './components/Skills'
import About from './components/About'
import Contact from './components/Contact'
import SwarmCursor from './components/SwarmCursor'

function App() {
  return (
    <>
      {/* peeche ka background aur cursor effect: ek baar yahan, har section mein chalte hain */}
      <Background />
      <SwarmCursor />
      <Navbar />

      <main className="page">
        <Hero />
        <Projects />
        <Skills />
        <About />
        <Contact />
      </main>
    </>
  )
}

export default App