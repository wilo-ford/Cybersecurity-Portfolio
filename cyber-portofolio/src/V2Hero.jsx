import { lazy, Suspense, useEffect, useRef, useState } from 'react';
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
  { label: 'Git', icon: Code2 },
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
function DomainMotion({ index }) {
  return <svg className={'v2-domain-motion motion-' + index} viewBox="0 0 100 65" aria-hidden="true">
    {index === 0 ? <><path d="M10 51L35 10 55 45 80 18 94 53 10 51 80 18M35 10L94 53M55 45L10 51"/>{[[10,51],[35,10],[55,45],[80,18],[94,53]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="2.5" style={{animationDelay:`${i*.4}s`}}/>)}</> : index === 1 ? <>{Array.from({length:18},(_,i)=><rect key={i} x={i*5+5} y={51-(i*17%37)} width="2.5" height={5+(i*17%37)} style={{animationDelay:`${i*.12}s`}}/>)}<path d="M3 57H98M3 37H98M3 17H98"/></> : <>{[0,1,2].map(i=><path key={i} d={`M12 ${16+i*13}L49 ${3+i*13} 88 ${16+i*13} 49 ${30+i*13}Z`} style={{animationDelay:`${i*.4}s`}}/>)}</>}
  </svg>;
}
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
  const hero = useRef(null);
  const [open, setOpen] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);
  const [visible, setVisible] = useState(true);
  const [visited, setVisited] = useState(false);
  useEffect(() => {
    const el=hero.current;
    const observer=new IntersectionObserver(([entry])=>{setVisible(entry.isIntersecting);if(entry.isIntersecting)setVisited(true);});
    observer.observe(el);
    let frame=0;
    const move=event=>{if(paused||lite||frame)return;frame=requestAnimationFrame(()=>{const box=el.getBoundingClientRect();el.style.setProperty('--parallax-x',`${(event.clientX/box.width-.5)*7}px`);el.style.setProperty('--parallax-y',`${(event.clientY/box.height-.5)*4}px`);frame=0;});};
    const reset=()=>{el.style.setProperty('--parallax-x','0px');el.style.setProperty('--parallax-y','0px');};
    el.addEventListener('pointermove',move);el.addEventListener('pointerleave',reset);
    return()=>{observer.disconnect();cancelAnimationFrame(frame);el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',reset);};
  },[paused,lite]);
  return <section ref={hero} id="accueil" className={'v2-hero' + (paused || !visible ? ' v2-still' : '')}>
    <div className="v2-backdrop" aria-hidden="true"/><div className="v2-atmosphere" aria-hidden="true"/>
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
        <button type="button" className={"v2-crystal-button" + (!lite && !webglFailed ? " v2-enhanced" : "")} onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="crystal-status" aria-label={open ? 'Refermer le cristal interactif' : 'Ouvrir le cristal et explorer les domaines cybersécurité'}>
          <Crystal open={open} paused={paused || !visible}/>
          {!lite && visited && !webglFailed && <Suspense fallback={null}><CrystalWebGL open={open} paused={paused} onUnavailable={() => setWebglFailed(true)}/></Suspense>}
        </button>
        <p id="crystal-status" className="v2-crystal-caption" role="status">{open ? "Réseau révélé · cliquez pour refermer" : "Cliquez pour révéler le réseau"}</p>
        {webglFailed && <p className="v2-render-note" role="status">Version légère active · interaction conservée</p>}
      </div>
    </div>
    <div className="v2-domains" aria-label="Mes domaines d’intérêt">{paths.map((item,index)=><a className="v2-domain" href={item.href} key={item.title}><span className="v2-domain-icon"><item.icon size={42} strokeWidth={1.45}/></span><span><strong>{item.title}</strong><small>{item.sub}</small></span><DomainMotion index={index}/><ArrowUpRight className="v2-domain-arrow" size={20}/></a>)}</div>
    <a className="v2-scroll-cue" href="#a-propos" aria-label="Défiler vers la présentation"><span/></a>
    <div className="v2-reference-strip">
      <div className="v2-about-preview">
        <a href="#a-propos" className="v2-monogram-card" aria-label="En savoir plus sur Mohamed ABOGOURIN"><span>MA<b>.</b></span></a>
        <div className="v2-about-text"><p className="v2-strip-label">À PROPOS DE MOI</p><p>Étudiant en L3 Informatique (Systèmes d’Information), passionné par la cybersécurité, le pentest et les opérations SOC. Je me forme continuellement, réalise des projets pratiques et vise un stage pour renforcer mon expérience terrain.</p><a href="#a-propos" className="v2-strip-link">En savoir plus <ArrowRight size={17}/></a></div>
      </div>
      <div className="v2-skills-preview"><p className="v2-strip-label">COMPÉTENCES CLÉS</p><div className="v2-skill-tiles">{skillTiles.map(({label,icon:Icon})=><a key={label} href="#competences" className="v2-skill-tile"><Icon size={27} strokeWidth={1.6}/><span>{label}</span></a>)}</div></div>
    </div>
    <div className="v2-bottom"><a href="#a-propos"><ArrowDown size={14}/> DÉCOUVRIR MON PARCOURS</a><div><button aria-pressed={lite} onClick={()=>setLite(!lite)}>{lite ? 'Mode détaillé' : 'Mode léger'}</button><button aria-pressed={paused} onClick={()=>setPaused(!paused)}>{paused ? <Play size={13}/> : <Pause size={13}/>} {paused ? 'Animer' : 'Pause'}</button></div></div>
  </section>;
}
