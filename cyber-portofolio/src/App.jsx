import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, ArrowRight, ShieldCheck, Terminal, Network, Server, Mail, Menu, X, Github, Download, ExternalLink, Activity, Code } from 'lucide-react';
import { profile, skills, projects, timeline } from './content';
import Hero, { Brand } from './Hero.jsx';
import Contact from './Contact.jsx';
import PracticeDetails, { DocumentationStrip } from './PracticeDetails.jsx';
import ProjectVisual from './ProjectVisual.jsx';
import ProjectPage, { projectHref } from './ProjectPage.jsx';
const navigation = [['accueil', 'Accueil'], ['a-propos', 'À propos'], ['competences', 'Compétences'], ['projets', 'Projets'], ['parcours', 'Parcours'], ['contact', 'Contact']];
const icons = {
  terminal: Terminal,
  network: Network,
  shield: ShieldCheck,
  server: Server,
  monitoring: Activity,
  code: Code
};
function initialLite() {
  // The legacy ma-lite preference was also written by automatic CPU detection.
  // Do not carry that ambiguous, silent animation shutdown into this version.
  try {
    const saved = localStorage.getItem('ma-render-quality');
    if (saved !== null) return saved === 'lite';
  } catch {}
  return !!navigator.connection?.saveData || matchMedia('(max-width: 900px), (pointer: coarse)').matches;
}
function initialPaused() {
  try {
    const saved = localStorage.getItem('ma-motion');
    if (saved === 'playing' || saved === 'paused') return saved === 'paused';
  } catch {}
  return matchMedia('(prefers-reduced-motion: reduce)').matches;
}
function SectionHeading({
  number,
  label,
  title,
  children
}) {
  return <div className="section-heading"><div><p className="eyebrow"><span>{number}</span> {label}</p><h2>{title}</h2></div>{children && <p className="section-intro">{children}</p>}</div>;
}
function ProjectCard({
  project,
  open
}) {
  return <article className="project"><button className="project-open" onClick={e => open(project, e)} aria-label={'Découvrir ' + project.name}><div className={'project-visual ' + project.visual}><span className="project-number">{project.number}</span><ProjectVisual type={project.visual} /><span className="visual-caption">Schéma illustratif</span><span className="project-expand"><ArrowUpRight size={20} /></span></div><div className="project-content"><p className="eyebrow">{project.category}</p><h3>{project.name}</h3><p className="project-tagline">{project.title}</p><p>{project.summary}</p><div className="tags">{project.tags.map(t => <span key={t}>{t}</span>)}</div><span className="project-more">Aperçu du projet<ArrowUpRight size={16} /></span></div></button><a className="project-page-link" href={projectHref(project)}>Fiche complète{project.id === 'bandit' && <span>4 write-ups publics</span>}<ArrowUpRight size={17} /></a></article>;
}
function ProjectDialog({
  project,
  close
}) {
  const dialog = useRef(null);
  useEffect(() => {
    const el = dialog.current;
    el.showModal();
    return () => {
      if (el.open) el.close();
    };
  }, []);
  return <dialog ref={dialog} className="project-dialog" onCancel={e => {
    e.preventDefault();
    close();
  }} onClick={e => {
    if (e.target === e.currentTarget) close();
  }} aria-labelledby="dialog-title"><div className="dialog-toolbar"><span>APERÇU DU PROJET</span><button className="dialog-close icon-button" onClick={close} aria-label="Fermer le projet"><X /></button></div><p className="eyebrow">{project.category}</p><h2 id="dialog-title">{project.name}</h2><p className="dialog-role">{project.role}</p><div className="dialog-illustration"><ProjectVisual type={project.visual} /><span className="visual-caption">Schéma illustratif</span></div><PracticeDetails project={project} /><div className="tags">{project.tags.map(t => <span key={t}>{t}</span>)}</div><div className="dialog-actions"><a className="text-button" href={projectHref(project)}>Ouvrir la fiche partageable<ArrowUpRight size={16} /></a>{project.link && <a className="text-button" href={project.link} target="_blank" rel="noopener noreferrer">Voir les write-ups<ExternalLink size={16} /></a>}<button className="text-button" onClick={close}>Revenir aux projets <ArrowRight size={16} /></button></div></dialog>;
}
function Portfolio() {
  const [menu, setMenu] = useState(false),
    [active, setActive] = useState('accueil');
  const [lite, updateLite] = useState(true),
    [paused, updatePaused] = useState(true),
    [selected, setSelected] = useState(null);
  const trigger = useRef(null),
    qualityChanged = useRef(false);
  const setLite = value => {
    qualityChanged.current = true;
    updateLite(value);
    try {
      localStorage.setItem('ma-render-quality', value ? 'lite' : 'full');
    } catch {}
  };
  const openProject = (project, event) => {
    trigger.current = event.currentTarget;
    setSelected(project);
  };
  const closeProject = () => {
    setSelected(null);
    requestAnimationFrame(() => trigger.current?.focus({
      preventScroll: true
    }));
  };
  useEffect(() => {
    updatePaused(initialPaused());
    let timeout;
    const quality = initialLite();
    if (!quality) timeout = setTimeout(() => {
      if (!qualityChanged.current) updateLite(false);
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);
  const setPaused = value => {
    updatePaused(value);
    try {
      localStorage.setItem('ma-motion', value ? 'paused' : 'playing');
    } catch {}
  };
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
    }, {
      rootMargin: '-15% 0px -65% 0px'
    });
    document.querySelectorAll('main section[id]').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', paused);
    document.documentElement.dataset.motion = paused ? 'paused' : 'playing';
  }, [paused]);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const changed = e => updatePaused(e.matches);
    media.addEventListener('change', changed);
    return () => media.removeEventListener('change', changed);
  }, []);
  useEffect(() => {
    if (!menu) return;
    const onKey = e => {
      if (e.key === 'Escape') setMenu(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menu]);
  return <>
    <a className="skip-link" href="#contenu">Aller au contenu</a>
    <header className="site-header immersive-header"><div className="header-inner"><a className="header-brand" href="#accueil" aria-label="Mohamed ABOGOURIN, accueil"><Brand /><span className="header-name">Mohamed <b>ABOGOURIN</b></span></a><nav id="mobile-nav" aria-label="Navigation principale" className={menu ? 'nav open' : 'nav'}>{navigation.map(([id, name]) => <a key={id} href={'#' + id} className={active === id ? 'active' : ''} onClick={() => setMenu(false)} aria-current={active === id ? 'location' : undefined}>{name}</a>)}</nav>{profile.github && <a className="github-header" href={profile.github} target="_blank" rel="noreferrer"><Github size={17} />GitHub</a>}<a className="header-contact" href="#contact"><Mail size={15} />Me contacter</a><button className="menu-button icon-button" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="mobile-nav" aria-label={menu ? 'Fermer le menu' : 'Ouvrir le menu'}>{menu ? <X /> : <Menu />}</button></div></header>
    <main id="contenu">
      <Hero lite={lite} setLite={setLite} paused={paused} setPaused={setPaused} />
      <section id="a-propos" className="section page-width"><SectionHeading number="01" label="À PROPOS" title={<>Linux, réseaux,<br /><em>sécurité web.</em></>} /><div className="about-layout"><div className="about-mark" aria-hidden="true"><span className="about-cross">+</span><div className="monogram">MA<span>.</span></div><span className="about-coordinates">COTONOU, BÉNIN<br />6.36° N · 2.43° E</span><div className="about-ring" /></div><div className="about-copy"><p className="lead">Étudiant à Cotonou,<br />la pratique comme fil conducteur.</p><p>{profile.about}</p><p>Mon parcours Bandit est accompagné de quatre comptes rendus publics. Mes projets académiques abordent aussi la supervision Linux, la virtualisation et la conteneurisation.</p><div className="about-facts"><div><span>FORMATION</span><strong>L3 · Systèmes d’Information</strong><small>ESGIS, Cotonou</small></div><div><span>MON APPROCHE</span><strong>Pratique & documentation</strong><small>Laboratoires et projets académiques</small></div></div>{profile.cv && <a href={profile.cv} className="text-button" download>Télécharger mon CV <Download size={16} /></a>}</div></div></section>
      <section id="competences" className="section skills-section"><div className="page-width"><SectionHeading number="02" label="COMPÉTENCES" title={<>Des bases solides.<br /><em>Un apprentissage continu.</em></>}>Les outils que je pratique et les connaissances que je développe en laboratoire et en formation.</SectionHeading><div className="skills-grid">{skills.map((skill, i) => {
              const Icon = icons[skill.icon];
              return <article className="skill" key={skill.title}><div className="skill-top"><Icon size={23} strokeWidth={1.4} /><span>0{i + 1}</span></div><h3>{skill.title}</h3><p className="skill-level">{skill.label}</p><p>{skill.text}</p><div className="tags">{skill.tags.map(t => <span key={t}>{t}</span>)}</div></article>;
            })}</div><DocumentationStrip /><p className="skills-note"><ShieldCheck size={15} /> Pratique en laboratoire, projets académiques et documentation technique.</p></div></section>
      <section id="projets" className="section page-width"><SectionHeading number="03" label="PROJETS & PRATIQUES" title={<>Explorer, comprendre,<br /><em>puis documenter.</em></>}>Trois réalisations pour découvrir ma pratique de Linux, de la supervision et de la sécurité web.</SectionHeading><div className="projects-grid featured-projects">{['bandit', 'monitoring', 'web'].map(id => <ProjectCard key={id} project={projects.find(p => p.id === id)} open={openProject} />)}</div><details className="more-projects"><summary>Voir les 4 autres pratiques <span>Systèmes, Docker, pentest et Python</span><ArrowDown size={18} /></summary><div className="projects-grid">{projects.filter(p => !['bandit', 'monitoring', 'web'].includes(p.id)).map(p => <ProjectCard key={p.id} project={p} open={openProject} />)}</div></details></section>
      <section id="parcours" className="section pathway-section"><div className="page-width pathway-layout"><div><SectionHeading number="04" label="PARCOURS" title={<>Mon parcours<br /><em>à l’ESGIS.</em></>} /><p className="pathway-intro">Une formation en systèmes d’information, complétée par des laboratoires personnels en cybersécurité.</p><span className="pathway-signature">Toujours en apprentissage <ArrowUpRight size={17} /></span></div><div className="timeline">{timeline.map(item => <article className={item.current ? 'timeline-item current' : 'timeline-item'} key={item.date}><span className="timeline-dot" /><p className="timeline-date">{item.date}{item.current && <span>EN COURS</span>}</p><h3>{item.title}</h3><p className="timeline-place">{item.place}</p><p>{item.text}</p></article>)}</div></div></section>
      <Contact />
    </main><footer className="page-width footer"><a className="footer-brand" href="#accueil" aria-label="Retour à l’accueil"><Brand compact /></a><p>© {new Date().getFullYear()} Mohamed ABOGOURIN<span>Apprendre. Comprendre. Protéger.</span></p><a href="#accueil" className="back-top">Retour en haut <ArrowUpRight size={16} /></a></footer>{selected && <ProjectDialog project={selected} close={closeProject} />}
  </>;
}
export default function App({
  projectId = null
}) {
  const project = projects.find(item => item.id === projectId);
  return project ? <ProjectPage project={project} /> : <Portfolio />;
}
