import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Copy, Download } from 'lucide-react';
import Brand from './Brand.jsx';
import { profile } from './content.js';
import ProjectVisual from './ProjectVisual.jsx';
import PracticeDetails from './PracticeDetails.jsx';
export const projectHref = project => `/projets/${project.id}/`;
export default function ProjectPage({
  project
}) {
  const [status, setStatus] = useState('');
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(profile.siteUrl + projectHref(project));
      setStatus('Lien copié.');
    } catch {
      setStatus('Vous pouvez copier l’adresse dans la barre du navigateur.');
    }
  }
  return <>
    <a className="skip-link" href="#contenu">Aller au contenu</a>
    <header className="project-page-header page-width"><a href="/" aria-label="Mohamed ABOGOURIN, accueil"><Brand compact /></a><a className="text-button" href="/#projets"><ArrowLeft size={18} />Tous les projets</a><a className="button secondary" href="/#contact">Me contacter<ArrowRight size={16} /></a></header>
    <main id="contenu" className="case-study page-width">
      <p className="eyebrow">{project.category}</p><h1>{project.name}</h1><p className="case-summary">{project.summary}</p><p className="dialog-role">{project.role}</p>
      <div className="case-layout"><article className="case-content"><div className={'project-visual ' + project.visual}><ProjectVisual type={project.visual} /><span className="visual-caption">Schéma illustratif</span></div><PracticeDetails project={project} /></article><aside className="case-sidebar"><h2>En bref</h2><div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><p>Pratique en laboratoire ou projet académique, présenté à mon niveau d’étudiant.</p><a className="text-button" href={profile.cv} download="CV_Mohamed_ABOGOURIN.pdf"><Download size={17} />Télécharger mon CV</a><button className="text-button" onClick={copyLink}>{status === 'Lien copié.' ? <Check size={17} /> : <Copy size={17} />}Copier le lien du projet</button><p className="share-status" role="status">{status}</p></aside></div>
      <a className="button secondary" href="/#projets"><ArrowLeft size={18} />Revenir aux projets</a>
    </main>
    <footer className="page-width footer"><p>© {new Date().getFullYear()} Mohamed ABOGOURIN</p><a className="text-button" href="/#contact">Parlons de votre opportunité<ArrowRight size={16} /></a></footer>
  </>;
}
