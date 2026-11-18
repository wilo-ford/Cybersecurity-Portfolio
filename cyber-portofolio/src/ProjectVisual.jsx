import { Code, Network, Server, ShieldCheck } from 'lucide-react';

// These are diagrams, not screenshots or measured project results.
export default function ProjectVisual({
  type
}) {
  if (type === 'analysis') return <div className="data-diagram" aria-hidden="true"><Code size={28} /><span>Données</span><i>→</i><span>Python / Pandas</span><i>→</i><span>Analyse</span></div>;
  if (type === 'pentest') return <div className="project-terminal" aria-hidden="true"><div className="window-dots"><i /><i /><i /></div><p><span>LAB / KALI LINUX</span></p><p>Metasploit · Gobuster</p><p className="muted">Énumération → exploitation</p><p className="terminal-success">Vérifier les privilèges obtenus</p></div>;
  if (type === 'systems') return <div className="container-diagram" aria-hidden="true"><div><Server size={26} /><span>AD DS</span></div><span className="connector">⟷</span><div><Network size={26} /><span>ESXi</span></div><p>Windows Server · Hyper-V</p></div>;
  if (type === 'terminal') return <div className="project-terminal" aria-hidden="true"><div className="window-dots"><i /><i /><i /></div><p><span>bandit@bandit</span>:~$ ssh</p><p className="muted">Observer les permissions</p><p>Comprendre les commandes</p><p className="terminal-success">Documenter la démarche</p></div>;
  if (type === 'monitoring') return <div className="monitoring-diagram" aria-hidden="true"><span>Ubuntu</span><i>↓</i><span>Node Exporter</span><i>↓</i><span>Prometheus → Grafana</span><small>Collecte · visualisation</small></div>;
  if (type === 'docker') return <div className="container-diagram" aria-hidden="true"><div><Server size={26} /><span>NODE.JS</span></div><span className="connector">⟷</span><div><span className="db-icon">▱</span><span>MYSQL</span></div><p>docker compose up</p></div>;
  return <div className="web-visual" aria-hidden="true"><span>LAB / SÉCURITÉ WEB</span><code>Injection SQL</code><div><ShieldCheck size={29} /><span>Observer. Comprendre.<br />Documenter.</span></div></div>;
}
