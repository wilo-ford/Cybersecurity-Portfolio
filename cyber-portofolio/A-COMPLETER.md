# Ce qu’il reste à fournir personnellement

Les améliorations de mise en page, d’accessibilité, de partage, de rendu léger et de pré-rendu sont réalisées. Aucune compétence ni contribution inconnue n’a été inventée.

## Priorité : une deuxième étude de cas technique

Pour **Monitoring Linux**, fournir le rapport de groupe ou les extraits que vous avez le droit de partager, puis préciser :

- La partie que vous avez personnellement réalisée.
- L’environnement utilisé : machine virtuelle, système et composants.
- Une difficulté rencontrée et la façon dont vous l’avez résolue.
- Le résultat réellement observé, sans inventer de chiffres.
- Une capture de Grafana ou un extrait de configuration, après retrait des identifiants, adresses privées utiles, secrets et données de tiers.

Une page claire et une capture utile suffisent pour commencer. Le rapport n’est pas actuellement publié : la fiche renvoie explicitement à la présentation dans le CV.

## Compléments utiles pour les autres pratiques

- **PortSwigger** : noms exacts des labs réalisés, notes ou captures de réussite et explication d’un cas.
- **Docker** : dépôt ou Dockerfile/Compose partageables, rôle personnel et instructions de lancement.
- **Windows Server / ESXi** : contribution, schéma réel de l’environnement et capture de configuration.
- **Lab Kali** : périmètre pédagogique, démarche, observations et remédiations apprises ; aucune donnée d’une cible réelle sans autorisation.
- **SahelSound Records** : rôle individuel, origine du jeu de données et conclusions réellement obtenues.

Ces éléments peuvent être ajoutés progressivement. Ils ne sont pas nécessaires pour que le site fonctionne.

## Positionnement et présence professionnelle

- La recherche de stage est affichée pour **janvier 2027**, conformément au CV. Modifier `profile.availability` et `profile.opportunity` dans `src/content.js` si la date évolue.
- SOC et pentest sont présentés comme des orientations. Ajouter un cas SOC seulement après l’avoir réalisé et documenté.
- Ajouter un profil LinkedIn uniquement s’il existe et correspond à vos informations.
- Un domaine personnel est facultatif ; le lien Workers fonctionne déjà. Il nécessite votre choix de nom et, éventuellement, un achat.

## Où ajouter les preuves

Dans `src/content.js`, l’objet `practiceDetails` comprend `personalContribution`, `environment`, `challenge`, `learning`, `lessonSource` et `evidence`. Les champs inconnus restent vides et ne sont pas affichés. Les documents publics peuvent être placés dans `public/` puis liés par leur chemin, ou hébergés dans votre dépôt GitHub.

Après modification : `./portfolio.ps1 check`, puis `./portfolio.ps1 build`. Pour publier par Wrangler, une authentification CLI est nécessaire ; la connexion du connecteur Cloudflare n’est pas transférée automatiquement au terminal.
