import { useState } from 'react'
import './Navbar.css'

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="navbar">
      <a href="#" className="logo">Deepanshu Saini</a>

      {/* sirf mobile pe dikhta hai */}
      <button
        className="menu-btn"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {open ? 'Close' : 'Menu'}
      </button>

      <nav className={open ? 'nav-links open' : 'nav-links'}>
        <a href="#projects" onClick={() => setOpen(false)}>Projects</a>
        <a href="#skills" onClick={() => setOpen(false)}>Skills</a>
        <a href="#about" onClick={() => setOpen(false)}>About</a>
        <a href="#contact" className="talk-btn" onClick={() => setOpen(false)}>Let's Talk</a>
      </nav>
    </header>
  )
}

export default Navbar