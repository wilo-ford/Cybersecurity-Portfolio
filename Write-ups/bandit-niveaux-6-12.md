# OverTheWire Bandit — Write-up niveaux 6 à 12

## Niveau 6 → 7
**Objectif :** Le mot de passe est caché dans un fichier quelque part sur le système entier, appartenant à l'utilisateur bandit7, au groupe bandit6, et faisant exactement 33 octets.

**Commande :** `find / -user bandit7 -group bandit6 -size 33c 2>/dev/null`

**Explication :**
- `find /` lance la recherche depuis la racine du système (`/`), donc partout.
- `-user bandit7` filtre uniquement les fichiers appartenant à cet utilisateur.
- `-group bandit6` filtre en plus par groupe propriétaire.
- `-size 33c` filtre par taille exacte (le `c` signifie "en octets").
- `2>/dev/null` redirige les erreurs (typiquement "permission denied" sur des dossiers protégés) vers `/dev/null`, un "trou noir" qui supprime tout ce qu'on y envoie — ça évite que l'écran soit pollué par des centaines de lignes d'erreurs inutiles.

**Ce que j'ai appris :** `find` peut combiner plusieurs critères en même temps pour affiner une recherche sur un système entier. C'est une technique de base en investigation/forensics quand on cherche un fichier précis sans savoir où il se trouve.

## Niveau 7 → 8
**Objectif :** Le mot de passe suivant se trouve dans un fichier `data.txt` très volumineux, juste à côté du mot "millionth".

**Commande :** `grep millionth data.txt`

**Explication :**
- `grep` cherche un motif texte (ici le mot "millionth") dans un fichier et n'affiche que les lignes qui le contiennent.
- Sans `grep`, il aurait fallu faire défiler tout le fichier à l'œil pour trouver la bonne ligne au milieu de milliers d'autres — long et peu fiable.

**Ce que j'ai appris :** `grep` est l'outil de base pour isoler une information précise dans un gros volume de texte, ce qui est exactement le travail qu'on fait en analyse de logs (chercher une IP suspecte, une erreur précise, etc.).

## Niveau 11 → 12
**Objectif :** Le mot de passe est chiffré en ROT13 dans `data.txt` — chaque lettre est décalée de 13 positions dans l'alphabet.

**Commande :** `tr 'A-Za-z' 'N-ZA-Mn-za-m' < data.txt`

**Explication :**
- `tr` (translate) remplace chaque caractère d'un premier ensemble par le caractère correspondant d'un second ensemble.
- `'A-Za-z'` = l'alphabet normal (majuscules puis minuscules).
- `'N-ZA-Mn-za-m'` = le même alphabet mais décalé de 13 lettres (N est la 13e lettre après A).
- `< data.txt` redirige le contenu du fichier en entrée de `tr`, comme si on le tapait au clavier.
- Particularité du ROT13 : c'est une opération symétrique. Appliquer le décalage une deuxième fois annule le premier et redonne le texte original — c'est pour ça que le même alphabet décalé sert à chiffrer ET déchiffrer.

**Ce que j'ai appris :** ROT13 n'est pas un vrai chiffrement sécurisé (c'est trivial à casser), mais c'est un bon exercice pour comprendre le principe de substitution de caractères, la base de nombreux algorithmes de chiffrement plus avancés.

## Niveau 12 → 13
**Objectif :** `data.txt` contient un hexdump (représentation textuelle de données binaires) d'un fichier qui a été compressé plusieurs fois d'affilée, avec des outils différents à chaque couche — un peu comme des poupées russes.

**Étapes et explication de chaque commande :**

1. **Reconstituer le binaire à partir du hexdump :**
   `xxd -r data.txt > data.bin`
   `xxd` sert normalement à afficher un fichier binaire en hexadécimal (pour le lire). L'option `-r` fait l'inverse : elle prend du texte hexadécimal et reconstruit le fichier binaire d'origine.

2. **Identifier le vrai type du fichier obtenu :**
   `file data.bin`
   Cette commande regarde le contenu réel du fichier (pas son nom) pour dire ce qu'il est vraiment : gzip, bzip2, tar, etc.

3. **Décompresser selon le type trouvé, puis répéter l'identification :**
   - Si gzip → renommer en `.gz` puis `gunzip`
   - Si bzip2 → renommer en `.bz2` puis `bunzip2`
   - Si tar → renommer en `.tar` puis `tar -xf` (une archive tar regroupe des fichiers, elle ne les compresse pas forcément — d'où la commande différente)

**Séquence complète traversée sur ce niveau :**
hexdump → binaire → gzip → bzip2 → gzip → tar → tar → bzip2 → tar → gzip → texte ASCII final (le mot de passe)

**Ce que j'ai appris :** Le réflexe le plus important de ce niveau : ne jamais se fier à l'extension ou au nom d'un fichier, toujours vérifier son vrai type avec `file` avant d'agir dessus. C'est une pratique courante en analyse forensique ou face à un fichier suspect/pièce jointe malveillante, où l'extension peut être trompeuse volontairement. La méthode générale — identifier, traiter, répéter jusqu'à obtenir le résultat final — s'applique à beaucoup de situations d'analyse de données inconnues.
