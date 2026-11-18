# Améliorations publiées — 18 novembre 2026

Portfolio : https://mohamed-abogourin-portfolio.awalabgr.workers.dev/

Déploiement Cloudflare : `16ab6ff73b154597b784cde0bbea0edc`.

## Réalisé

- Recherche de stage de janvier 2027 visible dès l’accueil ; SOC et pentest présentés comme orientations.
- Bureau nocturne et identité bleu marine/cyan conservés ; halos secondaires atténués.
- Descriptions de compétences, étiquettes, formulaires, commandes et pied de page plus lisibles. Contraste de la devise corrigé.
- Trois projets en première lecture, quatre autres pratiques dépliables ; retrait du grand monogramme décoratif sur petit écran.
- Fiches avec bouton de fermeture accessible pendant le défilement et retour du focus au bouton d’origine.
- Sept pages partageables avec titre, description et URL canonique propres.
- Étude de cas Bandit enrichie à partir de ses write-ups publics : environnement, contribution, difficulté et enseignement.
- Sources CV explicitement distinguées des livrables techniques publics dans les autres fiches.
- Graphiques synthétiques remplacés par des schémas illustratifs ; aucun résultat inventé.
- Rotation continue du globe léger et nettoyage de la boucle d’animation lors du démontage du composant.
- Rendu léger animé par défaut sur mobile, avec activation 3D volontaire ; Three.js absent du chargement mobile initial dans les tests.
- Pré-rendu de l’accueil et des sept fiches : contenu disponible sans JavaScript, puis hydraté par React.
- Image de partage 1200 × 630, métadonnées, robots.txt, sitemap.xml et vraie page 404.
- Suppression de 86 anciennes règles CSS inutilisées et remise en forme des sources.
- Code, configuration Wrangler et instructions de mise à jour conservés dans le dossier du projet.

## Vérifié

- Trois tests Node de contenu réussis ; compilation Vite et pré-rendu réussis.
- Validation à blanc avec Wrangler 4.164.0 réussie.
- Tests navigateur locaux : 320, 390, 768, 1024, 1280 et 1440 px ; pas de débordement horizontal.
- Retour du focus, commandes d’animation, pause, reprise, préférences mémorisées et mouvement réduit vérifiés.
- Alternances répétées SVG/WebGL sans erreur JavaScript capturée.
- Contact : liens email/téléphone/WhatsApp et préparation du message vérifiés, sans envoyer de message.
- Contrôle public : 19 fichiers comparés par empreinte avec les fichiers compilés, dont le CV inchangé ; en-têtes de sécurité vérifiés.
- Tests des améliorations sur le site public réussis, avec sept fiches et consultation sans JavaScript ; aucune erreur page ou console capturée dans ce parcours.
- Mesures mobiles ponctuelles et vérification des routes : `test-results/performance-report.json`. Ce sont des mesures de laboratoire, sans score Lighthouse ni mesure INP réelle.

Le transfert initial mobile est d’environ 250 ko dans ces essais, contre environ 370 ko lors de l’audit initial. Les trois LCP simulés sont de 7,38 s, 2,52 s et 2,38 s : le premier démarrage reste nettement plus lent. Ces résultats variables ne permettent pas d’affirmer que l’objectif de chargement est atteint pour tous les visiteurs. Une observation sur de vrais téléphones reste utile. Aucun saut de mise en page notable n’a été observé dans ces trois essais.

## Ce qui dépend encore de Mohamed

Fournir des éléments réels pour une deuxième étude de cas, en priorité le projet de supervision : contribution individuelle, rapport ou extrait partageable, difficulté rencontrée et capture de résultat. Compléter ensuite les autres pratiques avec les noms de labs, configurations ou dépôts disponibles.

La liste détaillée et les emplacements à modifier sont dans `A-COMPLETER.md`. Aucun document absent ni rôle de groupe n’a été inventé pour compléter la présentation.
