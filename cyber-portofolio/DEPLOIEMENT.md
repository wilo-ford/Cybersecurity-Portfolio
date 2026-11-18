# Améliorations appliquées après audit — 18 novembre 2026

La version publiée annonce la recherche de stage de janvier 2027, privilégie trois projets et garde les quatre autres dans un volet dépliable. Les textes, contrôles et contrastes secondaires ont été agrandis ou renforcés. Le focus revient au déclencheur après fermeture d’une fiche.

Le globe léger tourne continuellement et son animation est nettoyée lors du démontage du composant, afin d’éviter une course avec les références SVG. Sur mobile, le rendu léger est utilisé au démarrage sans téléchargement de Three.js ; la 3D reste activable. Le choix manuel et la pause persistent séparément. Le bureau conserve la composition validée.

L’accueil et sept fiches projet sont pré-rendus en HTML. Les URL `/projets/<identifiant>/` sont partageables, avec des métadonnées propres. Une image Open Graph 1200 × 630, un lien canonique, un sitemap et robots.txt sont inclus. Workers utilise désormais une vraie page 404.

Bandit comporte une contribution personnelle documentée, un exemple de difficulté et un enseignement tirés des write-ups publics. Les six autres fiches précisent la nature de leur source CV. Les graphes synthétiques sont remplacés par des schémas illustratifs. Aucune contribution de groupe inconnue n’est ajoutée.

Les contrôles locaux de contenu, d’affichage sur six largeurs, de focus, de pré-rendu sans JavaScript, de contact et de mouvement passent. Wrangler 4.164.0 valide le déploiement à blanc. Les résultats publics sont consignés dans `test-results/deployment-report.json` et `test-results/improvements-report.json`.

Voir `A-COMPLETER.md` pour les contributions, captures et livrables à fournir personnellement. Les notes ci-dessous décrivent la construction et les vérifications précédentes ; les changements ci-dessus les complètent.

---

# Portfolio corrigé selon Photo 1.jpg — 18 novembre 2026

- URL publique : https://mohamed-abogourin-portfolio.awalabgr.workers.dev/
- Worker : `mohamed-abogourin-portfolio`.
- Compte : `Awalabgr@gmail.com's Account` (`e473fb38faa8df16c964b05d97e422c3`).
- Dernier déploiement, après améliorations de l’audit : `16ab6ff73b154597b784cde0bbea0edc`.
- Hébergement : Workers Static Assets ; aucun service payant ni abonnement activé.
- Publication : connecteur Cloudflare déjà authentifié, conformément au choix de l’utilisateur.

## Correction visuelle

L’accueil utilise la maquette fournie : bureau immersif plein écran, portable cyan, tasse MA, carnet, plantes, étagère ambre, fenêtre nocturne et baobab. Le logo, la navigation, le nom et les boutons sont des éléments HTML. Le terminal React est projeté dans l’écran du portable ; le globe africain est rendu en Three.js et tourne doucement. Le décor WebP fait environ 124 Ko.

La pièce est un décor photographique en parallaxe, avec terminal et globe interactifs ; les meubles ne sont pas des modèles 3D manipulables. Le mode léger conserve la composition avec un globe SVG.

## Vérification

La section Compétences comporte six catégories, avec supervision Linux, Hyper-V et Python/Git plus visibles. Un encart met en avant les quatre write-ups Bandit et le rapport de groupe du projet de supervision. La sélection comprend désormais sept projets/pratiques, dont SahelSound Records, clairement identifié comme un projet académique de groupe avec Pandas.

Les fiches présentent l’objectif, les actions réalisées, le résultat et la documentation disponible. Les quatre comptes rendus Bandit ont des liens publics directs. Pour les autres projets, le lien est explicitement une présentation dans le CV. Les contributions individuelles non précisées restent non publiées. Le test navigateur vérifie les six catégories, les sept projets, les sections des fiches, les liens et l’affichage mobile. Captures : `skills-desktop.png`, `skills-mobile.png`, `practice-bandit.png`, `practice-sahelsound.png` et `project-sahelsound.png` dans `test-results/`.

La section Contact présente trois blocs distincts : E-mail (`awalabgr@gmail.com`), Téléphone (`01 67 54 46 10`, indicatif béninois +229) et WhatsApp (`+229 01 67 54 46 10`). Le formulaire permet de préparer un message avec un nom facultatif et un sujet, puis ouvre WhatsApp pour relecture et envoi par le visiteur. Aucun envoi ni stockage de messages n’est effectué par le serveur du portfolio.

Le test `scripts/contact-check.cjs` contrôle les destinations `mailto:`, `tel:` et `wa.me`, les messages vides, l’encodage des accents et caractères spéciaux, le lien de secours et six largeurs d’écran. L’ouverture WhatsApp est interceptée pendant les tests : aucun message n’est envoyé. Rapport : `test-results/contact-report.json`. Aperçus : `contact-desktop.png`, `contact-mobile.png`.

Le terminal affiche uniquement `mohamed` comme nom d’utilisateur. Le PDF fourni est disponible sans modification via « Télécharger mon CV » sur l’accueil et dans À propos. Les en-têtes définissent un téléchargement PDF avec le nom `CV_Mohamed_ABOGOURIN.pdf`. Le lien GitHub et les quatre write-ups Bandit ont été vérifiés dans le dépôt lié au CV. Les compétences et la disponibilité de janvier 2027 proviennent de ce document.

Rapport de téléchargement : `test-results/cv-download-report.json`. La comparaison SHA-256 vérifie que le document téléchargé est identique au PDF fourni.

Correction du 18 novembre : le mode léger n’arrête plus les animations. L’ancienne détection automatique à quatre cœurs, qui figeait le globe et mémorisait cet état, a été supprimée. La qualité (`ma-render-quality`) et la pause (`ma-motion`) sont indépendantes. Le globe léger SVG tourne également ; le terminal tape les commandes et affiche leurs sorties progressivement. La rotation 3D est plus perceptible. Vapeur discrète de la tasse et variation douce de lumière complètent la scène.

`scripts/motion-check.cjs` vérifie des différences réelles entre captures du globe, la progression du texte, leur immobilité en pause, la reprise, la persistance, le mode léger, la réduction des mouvements et un PC simulé à quatre cœurs. Rapport : `test-results/motion-report.json`. L’ancienne préférence `ma-lite=true` est incluse dans ce scénario de régression.

- Compilation Vite et trois contrôles Node réussis.
- Tests Edge : six sections, terminal, globe WebGL, pause, mode léger persistant, mouvement réduit, modales, menu mobile et contact.
- Aucun débordement à 320, 390, 768, 1024, 1280 et 1440 pixels.
- Aucun échec de requête ni erreur JavaScript/console lors des tests locaux.
- `test-results/hero-reference.png` : accueil au format de la maquette, 1280 × 721.
- `test-results/desktop.png`, `mobile.png`, `lite.png` : captures.
- `test-results/browser-report.json` : résultat des tests navigateur.
- `test-results/deployment-report.json` : comparaison des fichiers publics et en-têtes de sécurité/cache.

## Mise à jour

Voir `README.md`, `CONTENU.md` et `design/REFERENCE.md`. Textes dans `src/content.js`, accueil dans `src/Hero.jsx`, globe dans `src/GlobeScene.jsx`, style dans `src/immersive.css`.

La configuration Wrangler est conservée. La simulation `wrangler deploy --dry-run` avait été validée ; la connexion Wrangler reste à effectuer pour publier par CLI.

L’installation précédente a émis une alerte pour le moteur local optionnel `workerd`. Utiliser Vite (`portfolio.ps1 dev` ou `preview`) pour ce site statique ; l’émulation `wrangler dev` n’a pas été validée.
