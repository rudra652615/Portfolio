import { useEffect, useRef, useState } from "react";
import {
  ArrowDown, ArrowRight, ArrowUpRight, AtSign, BookOpen, BrainCircuit, BriefcaseBusiness,
  Check, ExternalLink, Github, GraduationCap, Linkedin, Mail, Menu, MessageSquare,
  Settings, Shield, Terminal, Trophy, X, Zap
} from "lucide-react";
import { certification, education, experience, profile, projects, skills } from "./data";

const navItems = [
  ["Home", "home"], ["About", "about"], ["Projects", "projects"], ["Skills", "skills"],
  ["Experience", "experience"], ["Certifications", "certifications"], ["Education", "education"], ["Contact", "contact"]
];

const icons = { shield: Shield, terminal: Terminal, users: Trophy };
const isConfigured = (value) => Boolean(value?.trim() && !value.includes("[ADD"));
const externalHref = (value) => {
  const url = value.trim();
  if (/^(https?:|mailto:|tel:)/i.test(url)) return url;
  if (url.startsWith("//")) return `https:${url}`;
  return `https://${url}`;
};

function PlaceholderLink({ href, children, className = "", onUnavailable, "aria-label": ariaLabel }) {
  if (!isConfigured(href)) {
    return <button type="button" aria-label={ariaLabel} className={`${className} placeholder-link`} onClick={onUnavailable}>{children}</button>;
  }
  const target = externalHref(href);
  return <a className={className} aria-label={ariaLabel} href={target} target={target.startsWith("mailto:") || target.startsWith("tel:") ? undefined : "_blank"} rel="noreferrer">{children}</a>;
}

function ProjectCard({ project, onUnavailable }) {
  const Icon = icons[project.icon] || Shield;
  const className = `project-card reveal ${project.featured ? "featured" : ""}`;
  const contents = <>
    <div className="project-cover">
      <img className="project-image" src={project.imagePath} alt="" aria-hidden="true" onError={(event) => { event.currentTarget.style.display = "none"; }} />
      <div className="project-cover-overlay"></div>
      <span className="project-cover-icon"><Icon size={23} /></span>
      <span className="project-cover-label">{project.featured ? "FEATURED PROJECT" : "PROJECT PREVIEW"}</span>
    </div>
    <div className="project-content">
      <div className="project-body">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="tag-row">{project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
      </div>
      <span className="project-arrow" aria-hidden="true"><ArrowRight size={18} /></span>
    </div>
  </>;

  if (!isConfigured(project.link)) {
    return <article
      className={`${className} placeholder-link`}
      role="button"
      tabIndex={0}
      aria-label={`Project link unavailable: ${project.title}`}
      onClick={onUnavailable}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onUnavailable();
        }
      }}
    >{contents}</article>;
  }

  const target = externalHref(project.link);
  return <a
    className={className}
    href={target}
    target={target.startsWith("mailto:") || target.startsWith("tel:") ? undefined : "_blank"}
    rel="noreferrer"
  >{contents}</a>;
}

function SectionHeading({ eyebrow, title, copy }) {
  return <div className="section-heading reveal"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{copy && <p className="section-copy">{copy}</p>}</div>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [activeSection, setActiveSection] = useState("home");
  const [certificateOpen, setCertificateOpen] = useState(false);
  const certificateCardRef = useRef(null);
  const certificateCloseRef = useRef(null);

  useEffect(() => {
    const sections = navItems.map(([, id]) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: "-25% 0px -60% 0px", threshold: [0.1, 0.4] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!certificateOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setCertificateOpen(false);
      } else if (event.key === "Tab") {
        event.preventDefault();
        certificateCloseRef.current?.focus();
      }
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    certificateCloseRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousOverflow;
      certificateCardRef.current?.focus();
    };
  }, [certificateOpen]);

  const goTo = (id) => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  const showNotice = (text) => { setNotice(text); window.setTimeout(() => setNotice(""), 4500); };

  return <div className="site-shell">
    <header className="site-header">
      <a className="brand" href="#home" onClick={() => goTo("home")}><span className="brand-mark"><Shield size={17} /></span><span>{profile.name}</span></a>
      <button className="menu-toggle" type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen(!menuOpen)}><span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>{menuOpen ? <X /> : <Menu />}</button>
      <nav id="primary-navigation" className={`nav ${menuOpen ? "is-open" : ""}`} aria-label="Primary navigation">
        {navItems.map(([label, id]) => <a key={id} className={activeSection === id ? "active" : ""} aria-current={activeSection === id ? "location" : undefined} href={`#${id}`} onClick={() => goTo(id)}>{label}</a>)}
        <a className="nav-cta" href="#contact" onClick={() => goTo("contact")}>Get In Touch <ArrowRight size={15} /></a>
      </nav>
    </header>

    <main>
      <section id="home" className="hero section-pad">
        <div className="hero-grid" aria-hidden="true"></div>
        <div className="hero-content reveal">
          <h1 className="hero-title"><span className="hero-greeting">Hi, I'm </span><span className="gradient-text">{profile.name}</span></h1>
          <h2 className="hero-headline">Cybersecurity &amp; Risk Intelligence</h2>
          <p className="hero-subheading">{profile.subheading}</p>
          <p className="hero-summary">{profile.summary}</p>
          <div className="badge-row">{profile.badges.map((badge) => <span className="badge" key={badge}>{badge}</span>)}</div>
          <div className="hero-actions"><a className="button button-primary" href="#projects" onClick={() => goTo("projects")}>View My Projects <ArrowRight size={17} /></a><button className="button button-secondary" onClick={() => showNotice(`Add your resume at ${profile.resumePath.replace("./", "")} to enable this download.`)}>Download Resume <ArrowDown size={17} /></button></div>
        </div>
        <div className="portrait-card reveal" aria-label="Portrait placeholder">
          <div className="security-rings" aria-hidden="true"><span></span><span></span><span></span></div>
          <div className="portrait-glow"></div>
          <div className="portrait-fallback"><Shield size={48} strokeWidth={1} /><strong></strong><span></span></div>
          <img src={profile.portraitPath} alt="Portrait of Rudra Kumar" onError={(event) => { event.currentTarget.style.display = "none"; }} />
          <div className="hero-signal" aria-hidden="true"><span>DETECT</span><span>ANALYZE</span><span>DECIDE</span><span>INTERVENE</span></div>
          <span className="corner corner-tl"></span><span className="corner corner-br"></span>
        </div>
      </section>

      <section id="projects" className="content-section projects-section">
        <div className="section-title-row"><div><p className="eyebrow">SELECTED WORK</p><h2>Featured Projects</h2><p className="section-copy">A selection of security experiments and collaborative work.</p></div><span className="section-index">01 — 03</span></div>
        <div className="project-grid">{projects.map((project) => <ProjectCard key={project.title} project={project} onUnavailable={() => showNotice("Project link unavailable. Add the real URL in src/data.js.")} />)}</div>
      </section>

      <div className="overview-grid content-section">
        <section id="about" className="overview-card">
          <div className="mini-heading"><span className="icon-box"><BrainCircuit size={19} /></span><div><p className="eyebrow">ABOUT ME</p><h2>More About Me</h2></div></div>
          <div className="about-layout"><div className="about-text"><p>I’m a BCA student exploring cybersecurity through building, experimentation, and problem-solving. My interest is not limited to finding vulnerabilities — I’m interested in understanding how security risks are identified, analyzed, and turned into decisions.</p><p>I’ve been developing my foundation across Python, C, HTML, CSS, JavaScript, PHP, web technologies, and cybersecurity concepts, while experimenting with practical projects and security tools. I’m particularly interested in cybersecurity &amp; ethical hacking, risk intelligence &amp; threat analysis, security simulation, web security, and Python &amp; C.</p><p>I’m still early in my journey, but my approach is simple: <strong>learn something → build something → test it → understand why it works.</strong></p><p>I’m currently looking for opportunities to learn from cybersecurity professionals, collaborate on interesting projects, and gain practical experience in the field.</p></div><div className="principles"><div><Zap size={17} /><span>Learn by building</span></div><div><Check size={17} /><span>Test with intention</span></div><div><MessageSquare size={17} /><span>Turn risk into clarity</span></div></div></div>
        </section>

        <section id="skills" className="overview-card skills-card">
          <div className="mini-heading"><span className="icon-box"><Settings size={19} /></span><div><p className="eyebrow">SKILLS</p><h2>Technologies &amp; Tools</h2></div></div>
          <div className="skills-grid">{Object.entries(skills).map(([category, items]) => <div className="skill-group reveal" key={category}><h3>{category}</h3><div className="skill-list">{items.map((skill) => <span className={skill.startsWith("[") ? "skill placeholder-skill" : "skill"} key={skill}>{skill}</span>)}</div></div>)}</div>
        </section>
      </div>

      <div className="credentials-grid content-section">
        <section id="experience" className="credential-panel">
          <div className="credential-heading"><BriefcaseBusiness size={20} /><div><p className="eyebrow">JOURNEY</p><h2>Experience</h2></div></div>
          <article className="compact-entry reveal"><span className="entry-icon"><BriefcaseBusiness size={19} /></span><div><h3>{experience.role}</h3><p className="accent-text">{experience.company}</p><p className="entry-meta">{experience.dates} <span>·</span> {experience.location}</p><p className="entry-description">{experience.description}</p><button className="text-link" type="button" onClick={() => setCertificateOpen(true)}>View Certificate <ArrowRight size={15} /></button></div></article>
        </section>
        <section id="education" className="credential-panel">
          <div className="credential-heading"><GraduationCap size={21} /><div><p className="eyebrow">ACADEMIC BACKGROUND</p><h2>Education</h2></div></div>
          {education.map((entry) => <article className="compact-entry reveal" key={entry.school}><span className="entry-icon"><GraduationCap size={19} /></span><div><h3>{entry.school}</h3><p className="accent-text">{entry.program}</p><p className="entry-meta">{entry.dates}{entry.location && <> <span>·</span> {entry.location}</>}</p><p className="entry-description">{entry.details}</p></div></article>)}
        </section>
        <section id="certifications" className="credential-panel">
          <div className="credential-heading"><BookOpen size={20} /><div><p className="eyebrow">PROFESSIONAL CREDENTIALS</p><h2>Certification</h2></div></div>
          <article
            ref={certificateCardRef}
            className="compact-entry reveal certificate-entry"
            role="button"
            tabIndex={0}
            aria-label={`View certificate: ${certification.title}`}
            onClick={() => setCertificateOpen(true)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setCertificateOpen(true);
              }
            }}
          ><span className="entry-icon certificate-icon"><BookOpen size={19} /><img src={certification.previewPath} alt="" onError={(event) => { event.currentTarget.style.display = "none"; }} /></span><div><h3>{certification.title}</h3><p className="accent-text">{certification.issuer}</p><p className="entry-meta">{certification.date} <span>·</span> Grade {certification.grade}</p><span className="text-link">View Certificate <ExternalLink size={14} /></span></div></article>
        </section>
      </div>

      <section id="contact" className="contact-section content-section">
        <div className="contact-intro"><p className="eyebrow">LET'S CONNECT</p><h2>Good conversations build good things.</h2><p className="section-copy">Interested in cybersecurity, technology, collaboration or simply discussing an interesting project? Feel free to reach out.</p></div>
        <div className="contact-grid"><div className="contact-links"><PlaceholderLink href={profile.links.linkedin} onUnavailable={() => showNotice("Add your LinkedIn URL in src/data.js.")} className="contact-link"><Linkedin size={18} /> LinkedIn <ArrowUpRight /></PlaceholderLink><PlaceholderLink href={profile.links.github} onUnavailable={() => showNotice("Add your GitHub URL in src/data.js.")} className="contact-link"><Github size={18} /> GitHub <ArrowUpRight /></PlaceholderLink><PlaceholderLink href={profile.links.email ? `mailto:${profile.links.email}` : ""} onUnavailable={() => showNotice("Add your email address in src/data.js.")} className="contact-link"><Mail size={18} /> Email <ArrowUpRight /></PlaceholderLink></div><form className="contact-form" onSubmit={(event) => { event.preventDefault(); showNotice(isConfigured(profile.links.email) ? "Your email client can be used to send this message." : "Form is ready, but add an email in src/data.js to enable the mailto flow."); }}><label>Name<input required name="name" placeholder="Your name" /></label><label>Email<input required type="email" name="email" placeholder="you@example.com" /></label><label>Message<textarea required name="message" rows="4" placeholder="Tell me what you're building..."></textarea></label><button className="button button-primary" type="submit">Prepare Message <ArrowRight size={17} /></button></form></div>
      </section>
    </main>

    <footer className="footer"><div><a className="brand" href="#home"><span className="brand-mark"><Shield size={17} /></span><span>{profile.name}</span></a><p>Cybersecurity | Risk Intelligence | Builder</p><p className="muted">Building a safer digital world, one project at a time.</p></div><div className="footer-right"><div className="social-row"><PlaceholderLink href={profile.links.linkedin} onUnavailable={() => showNotice("Add your social links in src/data.js.")} aria-label="LinkedIn"><Linkedin size={18} /></PlaceholderLink><PlaceholderLink href={profile.links.github} onUnavailable={() => showNotice("Add your social links in src/data.js.")} aria-label="GitHub"><Github size={18} /></PlaceholderLink><PlaceholderLink href={profile.links.email ? `mailto:${profile.links.email}` : ""} onUnavailable={() => showNotice("Add your email in src/data.js.")} aria-label="Email"><AtSign size={18} /></PlaceholderLink>{isConfigured(profile.links.x) && <a href={profile.links.x} target="_blank" rel="noreferrer" aria-label="X / Twitter">𝕏</a>}</div><small>© 2026 Rudra Kumar. All rights reserved.</small></div></footer>
    {certificateOpen && <div className="certificate-modal-backdrop" role="presentation" onClick={() => setCertificateOpen(false)}>
      <section className="certificate-modal" role="dialog" aria-modal="true" aria-labelledby="certificate-modal-title" onClick={(event) => event.stopPropagation()}>
        <div className="certificate-modal-heading"><h2 id="certificate-modal-title">{certification.title}</h2><button ref={certificateCloseRef} type="button" className="certificate-modal-close" aria-label="Close certificate preview" onClick={() => setCertificateOpen(false)}><X size={22} /></button></div>
        <img src={certification.previewPath} alt={`${certification.title} certificate`} />
      </section>
    </div>}
    {notice && <div className="toast" role="status">{notice}</div>}
  </div>;
}

export default App;
