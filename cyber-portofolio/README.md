# Portfolio de Mohamed ABOGOURIN

Portfolio en français, réalisé avec React, Vite, Three.js et Tailwind CSS, pour Cloudflare Workers Static Assets.

**Version V2 en validation** : [prévisualisation séparée](https://mohamed-abogourin-portfolio-v2-preview.awalabgr.workers.dev/) · [livraison, captures, tests et mises à jour](LIVRAISON-V2.md). La branche V2 et la PR #1 ne publient pas en production automatiquement.

La version améliorée met en avant la recherche de stage de janvier 2027, trois projets principaux et quatre autres pratiques dépliables. Voir `A-COMPLETER.md` pour les preuves et contributions qui restent à fournir personnellement.

L’accueil et les sept fiches `/projets/<identifiant>/` sont pré-rendus en HTML lors de la compilation, puis rendus interactifs par React. Ils restent consultables sans JavaScript. Le mode léger animé est utilisé par défaut sur mobile ; la 3D est activable sur demande. Sur ordinateur, la 3D démarre après le contenu, en respectant le choix de qualité mémorisé.

## Démarrer sous Windows

Depuis ce dossier, ouvrez PowerShell :

```powershell
.\portfolio.ps1 install
.\portfolio.ps1 dev
```

Le script utilise Node.js et pnpm installés sur le PC, ou le runtime fourni par Codex. Hors de ce PC, installer Node.js LTS et pnpm. Si PowerShell empêche l’exécution des scripts, les commandes pnpm ci-dessous sont équivalentes ; aucune modification de politique système n’est nécessaire.

```text
pnpm install --frozen-lockfile
pnpm dev
```

Ouvrir l’adresse locale affichée dans le terminal.

## Modifier les contenus

- `src/content.js` : nom, e-mail, présentation, compétences, projets, parcours et liens.
- Dans ce même fichier, `practiceDetails` décrit les objectifs, actions, résultats et documents de chaque pratique. Ajouter les captures ou rapports réels dans `evidence` ; renseigner `personalContribution` lorsqu’une contribution individuelle est confirmée. Un champ vide n’est pas affiché.
- `src/styles.css` et `src/immersive.css` : couleurs, tailles et mise en page responsive.
- `src/Hero.jsx` : accueil, projection du terminal dans l’écran du portable et parallaxe.
- `src/TerminalScreen.jsx` : commandes tapées, sorties progressives et gestion de la pause.
- `src/Contact.jsx` et `src/contact.css` : coordonnées, liens et formulaire de préparation WhatsApp.
- `src/ProjectPage.jsx` et `src/ProjectVisual.jsx` : fiches partageables et schémas illustratifs.
- `src/refinements.css` : lisibilité, hiérarchie des projets, commandes et fiches.
- `scripts/prerender.mjs` : HTML des huit pages, métadonnées, sitemap et robots.txt générés. Ne pas modifier directement `dist/`.
- `profile.siteUrl` dans `src/content.js` et les métadonnées de `index.html` : adresse publique à adapter si un domaine est ajouté.
- `public/partage-portfolio.png` : image de partage 1200 × 630. Le script optionnel `scripts/social-card.cjs` permet de la recréer avec Playwright et Edge.

La fiche Bandit utilise les write-ups publics pour présenter l’environnement, une difficulté réelle et les enseignements. Les autres fiches distinguent la présentation dans le CV d’un livrable technique public. Les illustrations n’affichent aucune mesure fictive.

## Contrôles après modification

`portfolio.ps1 check` lance les contrôles de contenu. `portfolio.ps1 build` compile Vite puis génère les pages HTML. La configuration Workers utilise `404-page`, avec une véritable page introuvable et des fichiers robots/sitemap.

Les tests navigateur optionnels sont `scripts/browser-check.cjs`, `scripts/motion-check.cjs`, `scripts/contact-check.cjs` et `scripts/improvements-check.cjs`. Ils utilisent Playwright, disponible via un paquet installé ou la variable `PLAYWRIGHT_MODULE`, ainsi qu’Edge ou le chemin `EDGE_EXECUTABLE`. Ils démarrent leur propre prévisualisation Vite ; `PORTFOLIO_URL` permet de viser le site publié. Le test de contact intercepte WhatsApp et n’envoie aucun message.
- `src/PracticeDetails.jsx` et `src/experience.css` : fiches détaillées, documentation et présentation des six blocs de compétences.
- `src/GlobeScene.jsx` : globe Three.js, Afrique lumineuse et orbites animées.
- `src/LiteGlobe.jsx` : globe SVG animé pour le mode léger ou sans WebGL.
- `public/bureau-nocturne.webp` : décor photographique préparé à partir de la maquette.
- `design/REFERENCE.md` : référence, architecture visuelle et prompt ImageGen utilisé.
- `src/App.jsx` : sections et interactions.
- `public/` : CV PDF, favicon et autres fichiers publics.
- `index.html` : titre, description et métadonnées de partage.

Le CV fourni est déjà publié dans `public/cv-mohamed-abogourin.pdf`, avec un bouton de téléchargement sur l’accueil et dans la présentation. Pour le mettre à jour, remplacer ce fichier puis reconstruire et déployer. Le lien GitHub et les write-ups Bandit ont été vérifiés dans le dépôt indiqué par le CV. LinkedIn et les autres liens de projets restent modifiables dans les champs `null`.

Les données proviennent du PDF fourni, de l’ancienne image de CV et du README du dépôt GitHub lié. Voir `CONTENU.md`. Le PDF fourni est téléchargeable sans modification. Le terminal utilise simplement `mohamed` ; le nom du portfolio reste Mohamed ABOGOURIN. Aucun faux témoignage, taux de maîtrise ou certification n’a été ajouté.

Les compétences sont regroupées en six catégories : Linux/Bash, réseaux, sécurité web/pentest, systèmes/virtualisation, supervision Linux et Python/Git. Sept projets ou pratiques sont présentés, dont SahelSound Records (projet académique de groupe avec Pandas). Les quatre write-ups Bandit possèdent des liens publics ; les autres fiches renvoient clairement à leur présentation dans le CV tant que des documents de projet supplémentaires n’ont pas été fournis.

## Tester et compiler

```powershell
.\portfolio.ps1 check
.\portfolio.ps1 build
.\portfolio.ps1 preview
```

Équivalents : `pnpm check`, `pnpm build`, `pnpm preview`. La compilation finale se trouve dans `dist/` ; ne pas modifier ces fichiers directement.

Un contrôle de navigateur optionnel est fourni dans `scripts/browser-check.cjs`. Il requiert Playwright accessible via `PLAYWRIGHT_MODULE` ou installé séparément, ainsi qu’Edge sous Windows (chemin personnalisable via `EDGE_EXECUTABLE`). Il teste le globe 3D, le terminal projeté, les modales, le mode léger, sa persistance, le mouvement réduit, le menu mobile et l’absence de débordement à 320, 390, 768, 1024, 1280 et 1440 pixels. Captures et résultats dans `test-results/`. `hero-reference.png` est une capture de l’accueil au format de la maquette.

## Mettre à jour le site public avec Wrangler

Le premier déploiement a utilisé le connecteur Cloudflare déjà authentifié, à la demande de l’utilisateur. La configuration `wrangler.jsonc` cible le même Worker et les mêmes assets statiques. Aucun service payant n’est nécessaire pour le site actuel.

Pour une prochaine mise à jour depuis le PC :

```powershell
.\portfolio.ps1 install
.\portfolio.ps1 login
.\portfolio.ps1 whoami
.\portfolio.ps1 deploy
```

Lors de `login`, terminer soi-même la connexion et l’autorisation dans Cloudflare. Ne jamais mettre de clé API dans les fichiers du projet ou dans une conversation.

Équivalents sur un poste équipé de pnpm :

```text
pnpm install --frozen-lockfile
pnpm exec wrangler login
pnpm exec wrangler whoami
pnpm check
pnpm deploy
```

`deploy` reconstruit le site puis publie sur le Worker `mohamed-abogourin-portfolio` du compte configuré. Son URL reste identique. Ne pas utiliser une autre configuration ou modifier le nom pour mettre à jour ce portfolio.

## Performances et fonctionnement

- Three.js est importé à la demande et n’est pas chargé lorsque le mode léger est actif dès l’ouverture.
- Globe Three.js plafonné à 24 images/s, globe léger SVG à 12 images/s, terminal actualisé à 10 images/s, densité de pixels plafonnée à 1,5.
- Animation suspendue lorsque la scène sort de l’écran ou lorsque l’onglet est masqué.
- Le mode léger change la qualité du rendu et conserve la rotation du globe et l’animation du terminal. Il peut être choisi manuellement ou démarrer avec l’économie de données. Le nombre de cœurs ne désactive plus les animations.
- Le bouton « Pause / Activer les animations » gère le mouvement séparément. La préférence système de mouvement réduit est respectée, avec réactivation explicite possible. Les choix manuels sont mémorisés avec `ma-render-quality` et `ma-motion` ; l’ancien `ma-lite` issu de la détection automatique est ignoré.
- Secours SVG si WebGL n’est pas disponible. Le mode léger conserve toutes les sections et fonctions de contact.
- Le décor photographique WebP fait environ 124 Ko et reste identique en mode léger. La pièce est un décor en parallaxe, le globe est réellement rendu en 3D ; le terminal et toute l’interface sont des composants indépendants de l’image.
- Pas de textures, polices ou modèles 3D distants ; aucune analyse d’audience ni cookie de suivi.
- Le contact présente l’e-mail, le téléphone et WhatsApp dans trois blocs séparés. Le téléphone et le numéro WhatsApp sont configurés dans `src/content.js` : `+2290167544610` / `2290167544610`.
- Le formulaire prépare un message avec le nom facultatif, le sujet et le texte, puis ouvre WhatsApp. Le visiteur relit et envoie lui-même le message dans WhatsApp. Aucun message n’est envoyé par le serveur, aucune donnée du formulaire n’est stockée par le site et aucune API WhatsApp Business payante n’est utilisée. Un lien de secours reste disponible si le navigateur bloque l’ouverture de la nouvelle fenêtre.
- Le terminal est une animation pédagogique locale : aucun Nmap ou autre processus système n’est exécuté.
- `_headers` applique les en-têtes de sécurité et la mise en cache des fichiers à nom haché.

Le test `scripts/motion-check.cjs` compare des captures successives du globe et le texte du terminal : rotation réelle, arrêt en pause, reprise, ancien réglage mémorisé, PC simulé à quatre cœurs, mode léger animé et mouvement réduit. Résultats dans `test-results/motion-report.json` ; captures `globe-before.png` et `globe-after.png`.

Le test `scripts/contact-check.cjs` vérifie les trois destinations, la validation du message, les accents et caractères spéciaux, le lien de secours et six largeurs d’écran. Il intercepte l’ouverture de WhatsApp : aucun message n’est envoyé pendant les tests. Rapport : `test-results/contact-report.json` ; aperçus : `contact-desktop.png` et `contact-mobile.png`.

Le lien suit le format officiel [WhatsApp Click to Chat](https://faq.whatsapp.com/5913398998672934). Le préfixe national `01` est conservé après `+229`, conformément au [plan de numérotation béninois](https://web.arcep.bj/passage-des-numero-a-10-chiffre/).

Les requêtes aux assets statiques sont gratuites et illimitées selon la [documentation Cloudflare](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/), consultée le 18 novembre 2026. Ce projet n’utilise ni D1, ni KV, ni R2, ni API payante. Aucun abonnement n’a été modifié.

## Structure

```text
src/                 Code React, contenus, style, terminal et globe Three.js
design/              Référence visuelle et provenance du décor
public/              Fichiers publics et en-têtes HTTP
scripts/             Tests navigateur et aide au déploiement par connecteur
tests/               Contrôles de contenu
dist/                Version de production compilée
test-results/        Captures et rapport de vérification
wrangler.jsonc       Cible Workers et dossier des assets
pnpm-lock.yaml       Versions verrouillées des dépendances
portfolio.ps1        Commandes Windows
DEPLOIEMENT.md       URL et informations de publication
```
