import { createServer } from 'vite';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { profile, projects } from '../src/content.js';

const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const template = await readFile('dist/index.html', 'utf8');
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { render } = await server.ssrLoadModule('/src/prerender.jsx');
  function document(project) {
    const title = project ? `${project.name} — Mohamed ABOGOURIN` : 'Mohamed ABOGOURIN — Stage en cybersécurité';
    const description = project ? project.summary : 'Étudiant en L3 à l’ESGIS, Cotonou. Recherche de stage en cybersécurité dès janvier 2027. Linux, réseaux, sécurité web et write-ups Bandit.';
    const url = profile.siteUrl + (project ? `/projets/${project.id}/` : '/');
    return template.replace('<div id="root"></div>', `<div id="root">${render(project?.id)}</div>`)
      .replace(/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`)
      .replace(/(<meta name="description" content=")[^"]*/, `$1${escape(description)}`)
      .replace(/(<meta property="og:title" content=")[^"]*/, `$1${escape(title)}`)
      .replace(/(<meta property="og:description" content=")[^"]*/, `$1${escape(description)}`)
      .replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`)
      .replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`);
  }
  await writeFile('dist/index.html', document());
  for (const project of projects) {
    const directory = `dist/projets/${project.id}`;
    await mkdir(directory, { recursive: true });
    await writeFile(`${directory}/index.html`, document(project));
  }
  const urls = ['/', ...projects.map(p => `/projets/${p.id}/`)];
  await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(path => `<url><loc>${profile.siteUrl}${path}</loc></url>`).join('')}</urlset>\n`);
  await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${profile.siteUrl}/sitemap.xml\n`);
  console.log(`Pré-rendu : accueil et ${projects.length} fiches projet, sitemap et robots.txt.`);
} finally {
  await server.close();
}
