# Audit indépendant du portfolio de Mohamed ABOGOURIN

Date : 18 novembre 2026. Site : https://mohamed-abogourin-portfolio.awalabgr.workers.dev/

## Avis général

Le portfolio donne une bonne première impression et constitue une base crédible pour un étudiant de L3 en recherche de stage. Il affirme honnêtement le contexte scolaire et les laboratoires. Son principal déséquilibre est la différence entre la sophistication du décor et la profondeur des preuves consultables. Le prochain investissement utile est documentaire, accompagné de corrections de lisibilité et d’accessibilité.

Cette revue combine un second agent indépendant, une inspection du code, les captures et des contrôles sur le site publié. Aucun fichier de l’application ni déploiement n’a été modifié. Aucun message WhatsApp ou email n’a été envoyé. Le rapport est un audit de présentation, de fonctionnement et de configuration visible, pas un pentest ni une certification de sécurité ou de conformité WCAG.

## Ce qui fonctionne

- Identité immédiatement visible, logo MA reconnaissable et nom cohérent.
- Palette bleu marine/cyan cohérente ; l’ambre du bureau et les plantes donnent de la chaleur.
- Grand titre lisible ; principales actions Projets, Contact et CV accessibles dès l’accueil.
- Sections claires, cohérence des cartes, adaptation aux petites largeurs sans débordement horizontal observé à 390 et 320 px.
- Niveau étudiant, bases, initiation, laboratoire et projets collectifs annoncés. Aucune expertise senior, certification ou expérience client inventée.
- Quatre write-ups Bandit accessibles précisément. Absence de jauges artificielles de maîtrise.
- Email, téléphone et WhatsApp clairement distingués ; le formulaire explique qu’il prépare un message à envoyer via WhatsApp.
- Pause et mode léger disponibles ; préférence système de mouvement réduit prise en compte au démarrage.
- Ressources servies localement au domaine, image WebP de taille raisonnable, absence de police externe observée.
- HTTPS et en-têtes CSP, anti-intégration en iframe, nosniff, politique de référent et permissions restrictives effectivement présents.

## Priorités de fond

### 1. Montrer davantage le travail réalisé — élevée

Sur sept projets/pratiques, Bandit possède quatre documents publics précis ; les six autres fiches renvoient au CV. Le CV décrit le parcours, mais ne permet pas de vérifier une configuration, un résultat ou une analyse. Cela ne démontre aucune fausse déclaration : c’est un manque de preuves accessibles.

Toutes les contributions individuelles des fiches sont actuellement absentes, car les champs correspondants restent vides. Pour les travaux de groupe, un recruteur ne sait donc pas quelle partie Mohamed a réalisée.

Action : développer en priorité deux études de cas à partir des éléments réellement disponibles. Pour chacune : contexte, objectif, environnement, contribution personnelle, difficulté rencontrée, actions, résultat observable, limites, puis une capture anonymisée ou un extrait de configuration. Ne pas inventer de chiffres ou de contribution pour remplir la rubrique.

La supervision Ubuntu serait un bon deuxième projet à présenter si le rapport et la contribution personnelle sont confirmés. Bandit constitue déjà une base documentaire exploitable.

### 2. Préciser l’objectif professionnel — élevée

L’accueil affiche SOC et Pentest, tandis que le site couvre aussi systèmes, virtualisation, Docker et données. Ces bases sont utiles, mais la priorité de candidature reste diffuse. La disponibilité de janvier 2027 est indiquée seulement dans Contact. Aucun cas d’analyse SOC n’est actuellement documenté dans le portfolio.

Action : placer dès l’accueil « Recherche de stage académique en cybersécurité — janvier 2027 ». Présenter SOC et pentest comme orientations d’apprentissage. Conserver les missions freelance adaptées au niveau dans une proposition secondaire, formulée à partir des acquis vérifiés.

### 3. Distinguer les illustrations des résultats — moyenne

La courbe de supervision et les barres du projet Pandas sont dessinées dans le code ; les hauteurs des barres sont arbitraires. Elles n’établissent aucun résultat du projet. Remplacer ces aperçus par des captures réelles lorsque disponibles, ou ajouter « Illustration ». Le terminal Kali de l’accueil est également une démonstration animée, pas une console réelle.

## Design, couleurs et lecture

La palette n’a pas besoin d’être remplacée. Le bleu marine sert bien l’ambiance choisie ; le cyan relie identité et actions ; l’ambre évite une impression froide. Le vert WhatsApp reste fonctionnel. Le risque esthétique est une accumulation de néons et d’éléments « cyber » qui retient davantage l’attention que les réalisations.

Le décor, le globe, le logo, le nom cyan, les boutons lumineux et le terminal se disputent le premier regard. Garder la scène choisie, calmer les halos secondaires et réserver les accents les plus forts aux actions principales et à quelques informations utiles. La crédibilité vient des études de cas ; le décor doit les introduire.

Le défaut de lecture le plus net est typographique : corps des descriptions de compétences à 12 px, niveaux et étiquettes à 9 px ; commandes d’animation à 7 px sur mobile. Ces petits textes restent difficiles même avec un contraste correct. Une taille de 14–16 px pour la lecture courante et de 12–13 px pour les libellés serait une meilleure base, à vérifier visuellement après ajustement. Ce sont des recommandations de confort, pas un minimum WCAG universel de taille de police.

Un contraste insuffisant a été mesuré sur la devise du pied de page : environ 3,94:1, texte de 8 px, couleur #537482 sur #030b14. La référence AA pour du texte ordinaire est 4,5:1. Ce défaut est localisé ; il ne permet pas d’affirmer que toute la palette échoue. Les textes sur photo et dégradés nécessitent une vérification visuelle complémentaire. Référence : https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html

Les cartes Compétences sont régulières, mais assez denses. La section À propos et la devise reprennent plusieurs fois curiosité, apprentissage et compréhension. Remplacer une partie de ces répétitions par un exemple personnel vérifié rendrait le profil plus mémorable. La grande carte SahelSound donne un poids visuel important à un projet de données ; les projets les plus pertinents pour la candidature cyber devraient dominer.

## Mobile et accessibilité

À 390 × 844 px, la page mesure environ 10 544 px, soit 12,5 hauteurs d’écran ; à 320 px de large, environ 11 193 px. Les cartes successives rendent le parcours long. Le contact reste accessible par navigation, mais demanderait beaucoup de défilement en lecture linéaire. Mettre deux ou trois réalisations en avant, puis proposer les autres pratiques, améliorerait la hiérarchie.

Le bureau reste reconnaissable sur mobile, mais le terminal est trop petit pour être lu : il fonctionne alors comme décor. Le globe est présent, mais ne doit pas obliger le visiteur à attendre pour comprendre le profil. Les commandes de scène sont petites et peu visibles. Les boutons mobiles mesurent environ 23 px de haut : les agrandir apporterait du confort. Ne pas conclure automatiquement à une violation de taille de cible sans vérifier les exceptions d’espacement. Référence : https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html

Défaut clavier reproduit : la fiche projet reçoit correctement le focus sur son bouton de fermeture ; Échap ferme la fiche, mais le focus retombe sur BODY au lieu de revenir au bouton d’origine. Observé sur les trois formats, puis confirmé sur trois nouvelles ouvertures mobiles après attente. Restaurer explicitement le focus au déclencheur.

La présence d’un lien d’évitement, de libellés de formulaire, d’un dialogue natif et d’un mode de mouvement réduit est positive. Ces contrôles ne constituent pas une revue complète au lecteur d’écran.

## Animation et fidélité à la demande

Le globe WebGL possède une rotation continue lente, environ une minute par tour. En mode léger, l’angle suit une sinusoïde : il oscille plutôt que de réaliser une rotation continue. C’est une différence à corriger ou à expliciter au regard de la demande initiale.

Le bureau est une image avec un effet de parallaxe, un terminal HTML projeté et un globe Three.js. Il ne s’agit pas d’un bureau entièrement modélisé en 3D. Cette composition donne un bon résultat avec un poids limité, mais il faut décrire honnêtement son interactivité. La géographie simplifiée et les lignes du globe paraissent moins photoréalistes que le bureau ; affiner leur intégration serait une amélioration esthétique secondaire.

## Performance observée

Contrôles Edge sans interface, cache navigateur désactivé. Trois chargements distincts, sans échantillon statistique. Pour le format mobile 390 px : ralentissement CPU ×4, réseau 1,6 Mbit/s descendant et latence ajoutée de 150 ms. Cela ne reproduit pas le GPU, la batterie ou toutes les caractéristiques d’un véritable téléphone.

| Mesure | Bureau 1440 px | Mobile 390 px simulé | Petit format 320 px sans ralentissement |
|---|---:|---:|---:|
| LCP observé | 5,18 s | 4,06 s | 1,47 s |
| CLS observé | 0 | 0 | 0,00006 |
| Données transférées observées | ~370 ko | ~370 ko | ~371 ko |

Les variations montrent qu’il faut répéter les mesures avant d’attribuer une cause précise. Les deux premiers LCP dépassent l’objectif de 2,5 s ; cela justifie une optimisation et une campagne de mesures, sans prouver un échec pour tous les visiteurs. Le CLS est très faible dans ces essais. INP et score Lighthouse non mesurés ; aucune donnée réelle au 75e percentile disponible. Référence et seuils : https://web.dev/articles/vitals

Le fichier Three.js représente environ 133 ko transférés et 494 ko non compressés. Il est chargé dès l’accueil dans le mode normal. Même avec peu de données, le rendu GPU peut coûter sur un téléphone modeste. Le mode léger et l’arrêt du rendu hors écran sont utiles ; envisager un rendu léger initial sur mobile et une activation 3D volontaire, à tester pour conserver l’expérience souhaitée. Ne pas ajouter de textures ou bibliothèques lourdes pour des gains purement décoratifs.

Une erreur JavaScript « Cannot read properties of null (reading 'setAttribute') » a été capturée dans le premier parcours mobile. Elle n’a pas été reproduite lors des trois parcours suivants. Cause et impact non établis : à investiguer avec une trace complète, sans la présenter comme une panne systématique. Les deux autres parcours initiaux et les trois suivants n’ont pas produit d’erreur page.

## Diffusion, contact et maintenance

- Les fiches projet n’ont pas d’adresse propre. Prévoir un lien partageable par réalisation pour les candidatures.
- Métadonnées titre et description présentes ; absence de og:image, og:url et canonical. Une image de partage dédiée rendrait les liens plus soignés.
- Les requêtes /robots.txt et /sitemap.xml renvoient l’HTML d’accueil avec statut 200, de même qu’une URL inexistante, à cause du fallback SPA. Créer de vrais fichiers appropriés et prévoir le traitement des pages inconnues. Un fichier robots n’est pas obligatoire pour indexer le site.
- Le contenu principal dépend de JavaScript. Un prérendu statique des informations essentielles améliorerait leur disponibilité pour certains robots et outils de partage ; cela ne signifie pas que Google ne peut pas indexer React.
- Un domaine personnel serait un raffinement utile pour les candidatures, mais n’est pas indispensable pour commencer.
- WhatsApp est clairement annoncé : ce n’est pas une messagerie intégrée au site. Le lien email constitue une autre voie. Ne pas ajouter de collecte de messages ou de service payant sans besoin réel.
- Le code contient des styles anciens et des fichiers CSS très condensés. Nettoyer les règles inutilisées et reformater aiderait les futures modifications ; impact de performance non quantifié.
- Les en-têtes visibles sont une bonne base. Ils ne constituent pas une garantie d’absence de vulnérabilité ; aucune recherche intrusive ni audit de dépendances n’a été réalisé ici.

## Ordre d’amélioration recommandé

1. Afficher la recherche de stage et sa date dès l’accueil ; conserver un positionnement étudiant explicite.
2. Transformer deux projets en études de cas vérifiables, avec contribution personnelle confirmée.
3. Agrandir les petits textes, corriger le contraste du pied de page et restaurer le focus des fiches.
4. Réduire la longueur perçue du mobile par une sélection de projets, améliorer les commandes d’animation et l’oscillation du mode léger.
5. Répéter les mesures de chargement, investiguer l’erreur intermittente et évaluer un démarrage mobile plus léger.
6. Ajouter image de partage, liens vers les fiches et traitement correct des URL techniques/inexistantes.

Les captures et résultats bruts voisins de ce rapport permettent de revoir ces constats. Aucun changement du site n’a été publié pendant l’audit.
