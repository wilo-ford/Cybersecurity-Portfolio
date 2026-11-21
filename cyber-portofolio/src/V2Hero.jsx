import { lazy, Suspense, useState } from 'react';
const CrystalWebGL = lazy(() => import('./CrystalWebGL.jsx'));
import { ArrowDown, ArrowRight, ArrowUpRight, Download, Pause, Play, Github, Linkedin, Mail, Crosshair, Layers3, ShieldCheck, Network, Code2, Eye, Activity, Box, Globe2, Terminal, Container, Shield, Cpu } from 'lucide-react';
import { profile } from './content';
import './v2-hero.css';

const skillTiles = [
  { label: 'Linux', icon: Terminal },
  { label: 'Réseaux', icon: Network },
  { label: 'Python', icon: Code2 },
  { label: 'Nmap', icon: Eye },
  { label: 'Wireshark', icon: Activity },
  { label: 'Burp Suite', icon: Shield },
  { label: 'Docker', icon: Container },
  { label: 'OWASP', icon: Globe2 },
  { label: 'Virtualisation', icon: Box },
  { label: 'Bash', icon: Cpu }
];
const paths = [
  { title: 'Pentest', sub: 'Identifier et exploiter les vulnérabilités', href: '#projets', icon: Crosshair },
  { title: 'SOC', sub: 'Surveiller, détecter et réagir aux menaces', href: '#competences', icon: Layers3 },
  { title: 'Sécurité SI', sub: 'Renforcer la sécurité des systèmes d’information', href: '#a-propos', icon: ShieldCheck }
];
function Crystal({ open, paused }) {
  return <div className={'v2-crystal-system' + (open ? ' is-open' : '') + (paused ? ' is-paused' : '')} aria-hidden="true">
    <div className="v2-orbit v2-orbit-one" /><div className="v2-orbit v2-orbit-two" />
    <div className="v2-crystal">
      <div className="v2-facet v2-facet-a" /><div className="v2-facet v2-facet-b" />
      <div className="v2-facet v2-facet-c" /><div className="v2-facet v2-facet-d" />
      <div className="v2-crystal-core">MA<span>.</span></div>
    </div>
    <div className="v2-network"><i/><i/><i/><i/><i/><i/><svg viewBox="0 0 320 320"><path d="M160 45L65 110 80 230 160 275 255 215 260 100 160 45M65 110L255 215M260 100L80 230M160 45L160 275M65 110L260 100M80 230L255 215"/></svg></div>
    <div className="v2-pedestal"><div/></div>
  </div>;
}
export default function V2Hero({ lite, setLite, paused, setPaused }) {
  const [open, setOpen] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);
  return <section id="accueil" className="v2-hero">
    <div className="v2-sky" aria-hidden="true"/><div className="v2-mountains" aria-hidden="true"/><div className="v2-landscape" aria-hidden="true"/>
    <div className="v2-architecture" aria-hidden="true"><div className="v2-arch v2-arch-left"/><div className="v2-arch v2-arch-center"/><div className="v2-arch v2-arch-right"/><div className="v2-floor"/></div>
    <div className="v2-hero-main">
      <div className="v2-copy">
        <p className="v2-eyebrow"><span/> PORTFOLIO · CYBERSÉCURITÉ</p>
        <h1><span>Mohamed</span><em>ABOGOURIN</em></h1>
        <p className="v2-role">Étudiant en L3 Informatique, spécialisé en systèmes d’information, passionné par la cybersécurité, le pentest et les opérations SOC.</p>
        <div className="v2-actions"><a href="#projets" className="v2-primary">Découvrir mes projets <ArrowRight size={17}/></a>{profile.cv && <a href={profile.cv} download className="v2-secondary">Télécharger mon CV <Download size={16}/></a>}</div>
        <div className="v2-socials"><a href={profile.github} aria-label="GitHub" target="_blank" rel="noopener noreferrer"><Github size={18}/></a>{profile.linkedin && <a href={profile.linkedin} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><Linkedin size={18}/></a>}<a href={"mailto:"+profile.email} aria-label="Email"><Mail size={18}/></a></div>
      </div>
      <div className="v2-art">
        <button type="button" className={"v2-crystal-button" + (!lite && !webglFailed ? " v2-enhanced" : "")} onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Refermer le cristal interactif' : 'Ouvrir le cristal et explorer les domaines cybersécurité'}>
          <Crystal open={open} paused={paused || lite}/>
          {!lite && !webglFailed && <Suspense fallback={null}><CrystalWebGL open={open} paused={paused} onUnavailable={() => setWebglFailed(true)}/></Suspense>}
        </button>
        <div className="v2-crystal-caption">{open ? "Explorez les domaines ci-dessous" : "Cliquez sur le cristal pour explorer"}</div>
      </div>
    </div>
    <div className="v2-domains">{paths.map(item=><a className="v2-domain" href={item.href} key={item.title}><span className="v2-domain-icon"><item.icon size={42} strokeWidth={1.45}/></span><span><strong>{item.title}</strong><small>{item.sub}</small></span><ArrowUpRight size={24}/></a>)}</div>
    <div className="v2-reference-strip">
      <div className="v2-about-preview">
        <a href="#a-propos" className="v2-monogram-card" aria-label="En savoir plus sur Mohamed ABOGOURIN"><span>MA<b>.</b></span></a>
        <div className="v2-about-text"><p className="v2-strip-label">À PROPOS DE MOI</p><p>Étudiant en L3 Informatique (Systèmes d’Information), passionné par la cybersécurité, le pentest et les opérations SOC. Je me forme continuellement, réalise des projets pratiques et vise un stage pour renforcer mon expérience terrain.</p><a href="#a-propos" className="v2-strip-link">En savoir plus <ArrowRight size={17}/></a></div>
      </div>
      <div className="v2-skills-preview"><p className="v2-strip-label">COMPÉTENCES CLÉS</p><div className="v2-skill-tiles">{skillTiles.map(({label,icon:Icon})=><a key={label} href="#competences" className="v2-skill-tile"><Icon size={27} strokeWidth={1.6}/><span>{label}</span></a>)}</div></div>
    </div>
    <div className="v2-bottom"><a href="#a-propos"><ArrowDown size={14}/> DÉCOUVRIR MON PARCOURS</a><div><button onClick={()=>setLite(!lite)}>{lite ? 'Mode détaillé' : 'Mode léger'}</button><button onClick={()=>setPaused(!paused)}>{paused ? <Play size={13}/> : <Pause size={13}/>} {paused ? 'Animer' : 'Pause'}</button></div></div>
  </section>;
}
