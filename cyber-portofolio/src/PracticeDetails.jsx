import { FileText, ArrowUpRight, Download } from 'lucide-react';
import { practiceDetails, documentation } from './content';
export function DocumentationStrip() {
  return <aside className="documentation-strip" aria-labelledby="documentation-title"><div className="documentation-icon"><FileText size={26} strokeWidth={1.5} /></div><div className="documentation-copy"><p className="eyebrow">DOCUMENTATION TECHNIQUE</p><h3 id="documentation-title">{documentation.title}</h3><p>{documentation.text}</p></div><a href={documentation.href} target="_blank" rel="noopener noreferrer">{documentation.label}<ArrowUpRight size={16} /></a></aside>;
}
export default function PracticeDetails({
  project
}) {
  const details = practiceDetails[project.id];
  if (!details) return <p className="practice-fallback">{project.detail}</p>;
  return <div className="practice-details">
    <section className="practice-block"><h3>Objectif</h3><p>{details.objective}</p></section>
    {details.environment && <section className="practice-block"><h3>Environnement</h3><p>{details.environment}</p></section>}
    <section className="practice-block"><h3>Actions réalisées</h3><ul>{details.actions.map(action => <li key={action}>{action}</li>)}</ul></section>
    <section className="practice-block"><h3>Résultat</h3><p>{details.result}</p></section>
    {details.personalContribution && <section className="practice-block"><h3>Ma contribution</h3><p>{details.personalContribution}</p></section>}
    {details.challenge && <section className="practice-block"><h3>Difficulté rencontrée</h3><p>{details.challenge}</p></section>}
    {details.learning && <section className="practice-block"><h3>Ce que j’en retiens</h3><p>{details.learning}</p>{details.lessonSource && <a className="lesson-source text-button" href={details.lessonSource} target="_blank" rel="noopener noreferrer">Lire le compte rendu correspondant<ArrowUpRight size={15} /></a>}</section>}
    <section className="practice-block practice-evidence"><h3>{project.id === 'bandit' ? 'Documentation technique' : 'Source disponible'}</h3><p className="practice-evidence-label">{details.evidenceLabel}</p>{project.id !== 'bandit' && <p className="evidence-note">La présentation dans le CV décrit ce travail. Aucun livrable technique public n’est encore lié à cette fiche.</p>}<div className="practice-evidence-links">{details.evidence.map(item => {
          const external = /^https:\/\//.test(item.url);
          return <a key={item.url} href={item.url} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} download={!external && item.url.endsWith('.pdf') ? true : undefined}>{external ? <FileText size={15} /> : <Download size={15} />}<span>{item.label}</span>{external && <ArrowUpRight size={13} />}</a>;
        })}</div></section>
  </div>;
}
