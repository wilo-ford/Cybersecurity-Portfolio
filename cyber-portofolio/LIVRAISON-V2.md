# Livraison V2 — Mohamed ABOGOURIN

Branche : `design/editorial-luxury-cyber-v2` · [PR #1](https://github.com/wilo-ford/Cybersecurity-Portfolio/pull/1).

Cette version est destinée à la validation. Aucun workflow ne déploie le site : GitHub Actions compile, teste et conserve les captures. La configuration de production `wrangler.jsonc` est conservée. La prévisualisation utilise uniquement `wrangler.preview.jsonc`, avec un nom de Worker distinct, sans binding, domaine personnalisé ni accès à des données de production.

## Examiner la version

- Prévisualisation séparée : <https://mohamed-abogourin-portfolio-v2-preview.awalabgr.workers.dev/>
- [Accueil 1536 × 864](screenshots/accueil-1536x864.png)
- [Accueil 1440 × 900](screenshots/accueil-1440x900.png)
- [Accueil mobile 390 × 844](screenshots/accueil-390x844.png)
- [Cristal ouvert](screenshots/cristal-ouvert-1536x864.png)
- [Page desktop complète](screenshots/page-1536.png) et [page mobile complète](screenshots/page-390.png)
- Palette des projets harmonisée : [desktop](screenshots/projets-1440x900.png), [mobile](screenshots/projets-390x844.png) et [fiche projet](screenshots/projet-detail-1440x900.png).

La prévisualisation est publique et porte l’en-tête `X-Robots-Tag: noindex, nofollow`, ainsi qu’un `robots.txt` interdisant l’indexation. Ce n’est pas un contrôle d’accès.

## Réalisation

L’interface reprend la composition de la référence finale : arches de pierre éclairées, ciel bleu et rose, montagnes, sol sombre, nom en serif italique ivoire et bleu glacé, cartes vitrées, monogramme et grille de dix compétences. L’interface est véritablement responsive ; le décor ne contient ni texte, ni carte, ni cristal. Sa provenance et son prompt sont dans [design/REFERENCE.md](design/REFERENCE.md).

La palette V2 s’applique également aux schémas, terminaux, voyants, aperçus et fiches de tous les projets : bleu nuit, bleu glacé et bleu lumineux. Les anciens accents verts ont été retirés. Le bloc de documentation et le contact WhatsApp emploient aussi cette palette. Les couleurs communes sont regroupées dans `src/v2-theme.css`.

Le cristal Three.js comporte huit facettes transparentes distinctes avec reflets d’environnement et traits spéculaires, des circuits internes, des particules, un anneau à ruban et traînées indépendant, un socle à plusieurs anneaux lumineux. Au clic, Entrée ou Espace, les facettes s’écartent et dévoilent un réseau de dix nœuds. Le second clic referme la géométrie. Le bouton expose son état et un statut textuel est annoncé.

Les cartes animent des nœuds, un signal et des couches protectrices. Les cartes et boutons répondent au survol et au focus. Le monogramme a un halo lent ; les compétences, projets, notes et éléments de parcours apparaissent au scroll. La navigation suit la section active. La parallaxe du décor est limitée à quelques pixels.

Les sept sections, sept fiches projet partageables, CV, coordonnées et quatre write-ups Bandit sont conservés. Le formulaire prépare un message WhatsApp à relire avant envoi ; aucun serveur ne collecte les messages. Les liens absents restent absents. Git remplace Burp Suite dans le bandeau car seuls les éléments documentés sont affichés. Les orientations Pentest/SOC/SI ne prétendent pas constituer une expérience professionnelle.

## Performance et accessibilité

- Three.js est un chunk différé : démarrage après le contenu sur ordinateur, aucun téléchargement WebGL par défaut sur mobile ou connexion avec économie de données.
- Rendu plafonné à 30 images/s et pixel ratio 1,25 ; aucune ombre temps réel ni post-traitement lourd. Les animations WebGL s’arrêtent hors écran, dans un onglet caché et en pause. Le dernier rendu est conservé lors de la pause.
- Mode léger CSS interactif, également utilisé si WebGL échoue ; changement de mode mémorisé. Animations CSS du hero suspendues hors écran.
- Préférence de mouvement réduit prise en compte, contrôle Pause/Animer, focus visibles, lien d’évitement, menu clavier et modale avec restitution du focus.
- HTML pré-rendu : accueil et sept fiches consultables sans JavaScript. Les interactions 3D et le formulaire nécessitent JavaScript.
- Police locale WOFF2 latine ~39 Ko ; décor WebP ~107 Ko. Aucun CDN à l’exécution.

## Vérifications et reproduction

Les dépendances du lockfile sont conservées. Environnement de validation : Windows, Node 24, Vite 7, Edge Chromium en mode headless. GitHub Actions utilise Node 22 et Chromium sous Linux.

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm build
pnpm preview --host 127.0.0.1 --port 4173
```

Dans un second terminal, avec Playwright installé et un navigateur Chromium disponible :

```sh
pnpm test:browser
pnpm test:contact
pnpm screenshots
```

Le runner accepte `PLAYWRIGHT_MODULE` (chemin du module Playwright), `EDGE_EXECUTABLE` (facultatif) et `PORTFOLIO_URL` (facultatif). Le workflow montre une installation reproductible dans `/tmp/v2-playwright`. Pour un usage local standard : `npm install --prefix /tmp/v2-playwright playwright@1.58.2` puis installer Chromium avec Playwright. Sous Windows, utiliser un dossier temporaire équivalent et renseigner les variables.

Contrôles réalisés :

- Trois tests de contenu ; compilation Vite et pré-rendu des huit pages.
- Chromium aux dimensions 1536 × 864, 1440 × 900 et 390 × 844 ; absence de débordement également vérifiée à 320, 768, 1024 et 1280 pixels.
- Ouverture/fermeture au clavier ; animation géométrique complète ; pixels du canvas conservés après une ouverture en pause ; arrêt du rendu en pause et hors écran ; trois démontages/remontages du moteur.
- Échec WebGL simulé ; absence de chargement de Three.js sur mobile par défaut ; contenu sans JavaScript.
- Modale projet, focus initial et restitution, sept routes projet, téléchargement du PDF ; coordonnées, validation et encodage du formulaire. Aucune demande WhatsApp réelle n’est envoyée par les tests.
- `wrangler deploy --dry-run --config wrangler.preview.jsonc` : paquet de prévisualisation reconnu sans binding.

Les rapports JSON locaux sont dans `test-results/` ; GitHub Actions les joint à l’artefact des captures. Les anciens scripts `browser-check.cjs`, `motion-check.cjs` et `improvements-check.cjs` restent des références V1, avec des sélecteurs de globe/terminal ; la suite V2 exécutée par la CI est `browser-v2.mjs`.

Le contrôle d’intégrité distant vérifie le hash et les en-têtes des 22 fichiers publiés. Les mesures mobiles simulées (CPU ×4, débit 1,6 Mbit/s, latence ajoutée 150 ms, cache navigateur désactivé) sont conservées dans `audit/v2-performance-after.json`. Le chargement initial transfère environ **275 Ko**, sans Three.js, contre environ 447 Ko avant l’allègement de la police. Le fichier de police passe de 210 140 à 39 260 octets. Deux observations LCP sont disponibles (1,87 s et 2,62 s) ; le premier passage n’a pas exposé de mesure de peinture et reste explicitement marqué indisponible. Ces observations de laboratoire ne constituent pas une validation matérielle ni une promesse de temps de chargement.

Vite signale un chunk Three.js supérieur à 500 Ko non compressé (~131 Ko gzip). Il est différé et absent du téléchargement mobile par défaut. Il ne s’agit pas d’un échec de compilation.

## Mettre à jour et prévisualiser

- Informations, niveaux, projets, parcours et liens : `src/content.js`.
- Intro, bandeau et dix tuiles : `src/V2Hero.jsx`.
- Décor, composition, responsive : `src/v2-reference.css`.
- Géométrie, matériaux, animation et budgets WebGL : `src/CrystalWebGL.jsx`.
- CV : remplacer `public/cv-mohamed-abogourin.pdf` en gardant le nom du fichier.
- Notes du blog : liste dans `src/App.jsx`, liée aux quatre documents réels du dépôt.
- Image de partage : démarrer la prévisualisation locale, puis exécuter `node scripts/social-card.cjs` et reconstruire.

Après validation locale, publication de la **prévisualisation uniquement**, avec Wrangler authentifié :

```sh
pnpm deploy:preview
```

Ce script reconstruit `dist/`, copie le résultat dans un `dist-preview/` propre, ajoute la non-indexation puis cible le Worker V2 séparé. Le déploiement de livraison peut aussi employer le connecteur Cloudflare via les API officielles d’upload de Static Assets ; aucun secret n’est versionné. Voir la [documentation Cloudflare](https://developers.cloudflare.com/workers/static-assets/direct-upload/).

Ne lancer aucune publication de production et ne fusionner aucune PR sans l’approbation explicite de Mohamed.

## Écarts et limites connus

Le rendu suit la maquette, sans être une copie pixel à pixel. La géométrie temps réel et ses reflets sont simplifiés par rapport au cristal illustré. L’architecture est une image avec parallaxe et éclairage atmosphérique ; les reflets du sol ne sont pas des réflexions ray-tracées de la scène 3D. Les icônes et certains détails calligraphiques sont recréés en vectoriel/CSS. Sur mobile, la disposition devient verticale et le moteur CSS est utilisé par défaut.

La validation Chromium couvre les dimensions d’un iPhone et un ralentissement CPU simulé, pas un essai matériel sur un iPhone physique ou un PC Intel HD précis. Aucun score Lighthouse, audit WCAG exhaustif ou mesure de fluidité sur ces appareils réels n’est revendiqué.

Les contributions individuelles et livrables techniques manquants restent décrits dans [A-COMPLETER.md](A-COMPLETER.md). Aucun projet, résultat, certification ou expérience n’a été inventé.
