import { lazy, Suspense, useState } from 'react';
const CrystalWebGL = lazy(() => import('./CrystalWebGL.jsx'));
import { ArrowDown, ArrowRight, Download, Pause, Play, Sparkles } from 'lucide-react';
import { profile } from './content';
import './v2-hero.css';

const paths = [
  { title: 'Pentest', sub: 'Explorer les vulnérabilités', href: '#projets', symbol: '◇' },
  { title: 'SOC', sub: 'Observer les événements', href: '#competences', symbol: '◎' },
  { title: 'Sécurité SI', sub: 'Comprendre et protéger', href: '#a-propos', symbol: '▧' }
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
    <div className="v2-sky" aria-hidden="true"/><div className="v2-mountains" aria-hidden="true"/>
    <div className="v2-architecture" aria-hidden="true"><div className="v2-arch v2-arch-left"/><div className="v2-arch v2-arch-right"/><div className="v2-floor"/></div>
    <div className="v2-hero-main">
      <div className="v2-copy">
        <p className="v2-eyebrow"><span/> PORTFOLIO · CYBERSÉCURITÉ</p>
        <h1><span>Mohamed</span><em>ABOGOURIN</em></h1>
        <p className="v2-role">Étudiant en L3 Systèmes d’Information</p>
        <p className="v2-intro">{profile.intro}</p>
        <p className="v2-availability">À la recherche d'un stage en cybersécurité · Janvier 2027</p>
        <div className="v2-actions"><a href="#projets" className="v2-primary">Découvrir mes projets <ArrowRight size={17}/></a>{profile.cv && <a href={profile.cv} download className="v2-secondary">Télécharger mon CV <Download size={16}/></a>}</div>
      </div>
      <div className="v2-art">
        <button type="button" className={"v2-crystal-button" + (!lite && !webglFailed ? " v2-enhanced" : "")} onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Refermer le cristal interactif' : 'Ouvrir le cristal et explorer les domaines cybersécurité'}>
          <Crystal open={open} paused={paused || lite}/>
          {!lite && !webglFailed && <Suspense fallback={null}><CrystalWebGL open={open} paused={paused} onUnavailable={() => setWebglFailed(true)}/></Suspense>}
        </button>
        <div className="v2-crystal-caption">{open ? 'Explorez mon univers cybersécurité' : 'Touchez le cristal pour explorer'} <Sparkles size={13}/></div>
      </div>
    </div>
    <div className="v2-domains">{paths.map(item=><a className="v2-domain" href={item.href} key={item.title}><span className="v2-domain-icon">{item.symbol}</span><span><strong>{item.title}</strong><small>{item.sub}</small></span><ArrowRight size={18}/></a>)}</div>
    <div className="v2-bottom"><a href="#a-propos"><ArrowDown size={14}/> DÉCOUVRIR MON PARCOURS</a><div><button onClick={()=>setLite(!lite)}>{lite ? 'Mode détaillé' : 'Mode léger'}</button><button onClick={()=>setPaused(!paused)}>{paused ? <Play size={13}/> : <Pause size={13}/>} {paused ? 'Animer' : 'Pause'}</button></div></div>
  </section>;
}
