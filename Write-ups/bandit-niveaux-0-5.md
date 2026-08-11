 # OverTheWire Bandit — Write-up niveaux 0 à 5

## Niveau 0 → 1
**Objectif :** Se connecter en SSH et lire le mot de passe du niveau suivant.
**Commande :** `cat readme`
**Ce que j'ai appris :** Connexion SSH de base, lecture de fichier simple.

## Niveau 1 → 2
**Objectif :** Lire un fichier nommé `-` (juste un tiret).
**Commande :** `cat ./-`
**Ce que j'ai appris :** Un tiret seul est interprété par le shell comme une option ; il faut préfixer avec `./` pour cibler le fichier local.

## Niveau 2 → 3
**Objectif :** Lire un fichier nommé `--spaces in this filename--`.
**Commande :** `cat "./--spaces in this filename--"`
**Ce que j'ai appris :** Combiner guillemets (pour les espaces) et `./` (pour le tiret initial) permet de cibler des noms de fichiers complexes.

## Niveau 3 → 4
**Objectif :** Trouver un fichier caché dans un dossier caché.
**Commande :** `ls -la` puis `cat ...Hiding-From-You`
**Ce que j'ai appris :** Les fichiers commençant par un point sont cachés et invisibles avec un simple `ls` ; `-la` les révèle.

## Niveau 4 → 5
**Objectif :** Identifier le seul fichier lisible parmi plusieurs (file00 à file09), les autres étant des leurres binaires.
**Commande :** `file ./file*` puis `cat` sur le fichier marqué "ASCII text"
**Ce que j'ai appris :** La commande `file` permet d'identifier le type réel d'un fichier, indépendamment de son nom.

## Niveau 5 → 6
**Objectif :** Trouver un fichier précis parmi une vingtaine de fichiers/dossiers, selon des critères de taille et de permissions.
**Commande :** `find . -type f -size 1033c ! -executable`
**Ce que j'ai appris :** `find` permet de filtrer par taille exacte (`-size Nc` pour des octets) et d'exclure certains critères avec `!` (ici, exclure les fichiers exécutables).
