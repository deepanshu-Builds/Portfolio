import { useState } from 'react'
import './Navbar.css'

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="navbar">
      <a href="#" className="logo">MERN DEVELOPER</a>
      <button
        className="menu-btn"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {open ? 'Close' : 'Menu'}
      </button>

      <nav className={open ? 'nav-links open' : 'nav-links'}>
        <a href="#projects" onClick={() => setOpen(false)}>PROJECTS</a>
        <a href="#skills" onClick={() => setOpen(false)}>SKILLS</a>
        <a href="#about" onClick={() => setOpen(false)}>ABOUT</a>
        <a href="#contact" className="talk-btn" onClick={() => setOpen(false)}>LET'S TALK</a>
      </nav>
    </header>
  )
}

export default Navbar