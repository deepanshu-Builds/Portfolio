import contact from '../data/Contact'
import StrokeText from './Stroketext'
import Reveal from './Reveal'
import './Contact.css'

function Contact() {
  return (
    <section className="section contact" id="contact">
      <div className="contact-inner">
        <p className="section-label">Got an idea or an opportunity?</p>
        <StrokeText lines={['Let’s make', 'it together']} accent={['’', 'K', 'G']} width="clamp(280px, 46vw, 640px)" className="contact-title" />

        <Reveal delay={0.1}>
          <p className="contact-sub">
            Looking for an intern, have a project in mind, or just want to say hi? My inbox is open.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <a className="contact-mail" href={`mailto:${contact.email}`}>{contact.email}</a>
        </Reveal>

        <Reveal delay={0.3}>
          <ul className="contact-links">
            {contact.links.map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <footer className="footer">© 2026 Deepanshu Saini</footer>
    </section>
  )
}

export default Contact