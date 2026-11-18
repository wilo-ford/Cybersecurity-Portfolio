import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ShieldCheck, Send, Mail, ArrowRight, ArrowDown, Leaf, Play, Pause, Download } from 'lucide-react';
import { profile } from './content';
import TerminalScreen from './TerminalScreen.jsx';
import LiteGlobe from './LiteGlobe.jsx';
const GlobeScene = lazy(() => import('./GlobeScene.jsx'));
export function Brand({
  compact = false
}) {
  return <span className={compact ? 'brand-mark compact' : 'brand-mark'} aria-hidden="true"><svg viewBox="0 0 110 70"><defs><linearGradient id={compact ? 'brandMetalSmall' : 'brandMetal'} x2="0" y2="1"><stop stopColor="#fff" /><stop offset=".4" stopColor="#d7e6f6" /><stop offset=".6" stopColor="#8ba8c8" /><stop offset="1" stopColor="#e1eefb" /></linearGradient></defs><text x="10" y="48" fill={'url(#' + (compact ? 'brandMetalSmall' : 'brandMetal') + ')'} fontFamily="Arial,sans-serif" fontSize="49" fontWeight="900" letterSpacing="-6" fontStyle="italic">MA</text><path d="M2 56Q40 34 102 49L89 41Q53 35 17 53M33 69L57 49 74 49Z" fill="#00d8ff" /></svg></span>;
}

// Maps a live HTML terminal onto the four corners of the photographed laptop.
function screenTransform(width, height) {
  const sx = width / 1672,
    sy = height / 941;
  const [p0, p1, p2, p3] = [[758, 380], [1175, 390], [1228, 653], [797, 681]].map(([x, y]) => [x * sx, y * sy]);
  const dx1 = p1[0] - p2[0],
    dx2 = p3[0] - p2[0],
    dx3 = p0[0] - p1[0] + p2[0] - p3[0];
  const dy1 = p1[1] - p2[1],
    dy2 = p3[1] - p2[1],
    dy3 = p0[1] - p1[1] + p2[1] - p3[1];
  const det = dx1 * dy2 - dx2 * dy1,
    g = (dx3 * dy2 - dx2 * dy3) / det,
    h = (dx1 * dy3 - dx3 * dy1) / det;
  const a = p1[0] - p0[0] + g * p1[0],
    b = p3[0] - p0[0] + h * p3[0],
    d = p1[1] - p0[1] + g * p1[1],
    e = p3[1] - p0[1] + h * p3[1];
  return `matrix3d(${a / 640},${d / 640},0,${g / 640},${b / 400},${e / 400},0,${h / 400},0,0,1,0,${p0[0]},${p0[1]},0,1)`;
}
function ImmersiveRoom({
  paused,
  lite,
  onUnavailable
}) {
  const stage = useRef(null);
  const [size, setSize] = useState({
      width: 1672,
      height: 941
    }),
    [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = stage.current;
    const resize = new ResizeObserver(([entry]) => setSize({
      width: entry.contentRect.width,
      height: entry.contentRect.height
    }));
    resize.observe(el);
    const obs = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    obs.observe(el);
    return () => {
      resize.disconnect();
      obs.disconnect();
    };
  }, []);
  return <div className="immersive-visual"><div className="immersive-stage" ref={stage}><img className="room-image" src="/bureau-nocturne.webp" alt="Bureau de nuit : ordinateur portable, tasse MA, livres, plantes, lumière chaude et fenêtre sur un baobab" fetchPriority="high" width="1672" height="941" /><TerminalScreen paused={paused} lite={lite} visible={visible} transform={screenTransform(size.width, size.height)} /><div className="globe-mount">{!lite ? <Suspense fallback={<LiteGlobe paused={paused || !visible} />}><GlobeScene paused={paused || !visible} onUnavailable={onUnavailable} /></Suspense> : <LiteGlobe paused={paused || !visible} />}</div><div className="room-vignette" /><div className="mug-steam" aria-hidden="true"><i /><i /><i /></div><div className="ambient-lamp" aria-hidden="true" /></div></div>;
}
export default function Hero({
  lite,
  setLite,
  paused,
  setPaused
}) {
  const hero = useRef(null);
  const move = e => {
    if (lite || paused || !matchMedia('(min-width:901px) and (pointer:fine)').matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    hero.current.style.setProperty('--pan-x', `${(e.clientX - r.left - r.width / 2) / r.width * 8}px`);
    hero.current.style.setProperty('--pan-y', `${(e.clientY - r.top - r.height / 2) / r.height * 5}px`);
  };
  const reset = () => {
    hero.current?.style.setProperty('--pan-x', '0px');
    hero.current?.style.setProperty('--pan-y', '0px');
  };
  useEffect(reset, [lite, paused]);
  return <section id="accueil" className="hero immersive-hero" ref={hero} onPointerMove={move} onPointerLeave={reset}><ImmersiveRoom paused={paused} lite={lite} onUnavailable={() => setLite(true)} /><div className="hero-copy"><p className="student-badge"><ShieldCheck size={20} strokeWidth={1.8} />Étudiant en cybersécurité</p><h1>Mohamed<br /><span>ABOGOURIN</span></h1><p className="hero-education">{profile.education}</p><p className="hero-availability"><strong>Recherche de stage</strong><span>{profile.availability}</span></p><p className="hero-focus">{profile.focus}</p><p className="hero-description">{profile.intro}</p><div className="hero-actions"><a className="button primary" href="#projets"><Send size={18} />Voir mes projets <ArrowRight size={18} /></a><a className="button secondary" href="#contact"><Mail size={18} />Me contacter</a></div>{profile.cv && <a className="hero-cv" href={profile.cv} download="CV_Mohamed_ABOGOURIN.pdf"><Download size={16} />Télécharger mon CV<span>PDF</span></a>}</div><div className="hero-bottom-bar"><a className="hero-scroll" href="#a-propos"><ArrowDown size={15} />Découvrir mon parcours</a><div className="scene-controls"><button className={lite ? 'scene-control selected' : 'scene-control'} onClick={() => setLite(!lite)} aria-label={lite ? 'Activer le globe 3D' : 'Passer en mode léger'} aria-pressed={!lite}><Leaf size={16} />{lite ? 'Activer la 3D' : 'Mode léger'}</button><span className="motion-status">{paused ? 'Animations en pause' : 'Animations activées'}</span><button className="scene-control motion-button" onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? <Play size={12} /> : <Pause size={12} />}{paused ? 'Animer' : 'Pause'}</button></div></div></section>;
}
