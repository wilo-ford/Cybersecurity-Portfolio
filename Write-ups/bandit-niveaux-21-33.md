# OverTheWire Bandit — Write-up niveaux 21 à 33 (fin du wargame)

## Niveau 21 → 22
**Objectif :** Un cron job s'exécute avec les droits de bandit22 et copie son mot de passe dans un fichier temporaire mal protégé.

**Commandes :**
cat /etc/cron.d/cronjob_bandit22
cat /usr/bin/cronjob_bandit22.sh
cat /tmp/<nom_du_fichier_révélé>

**Ce que j'ai appris :** un cron job qui écrit un secret dans `/tmp` avec des permissions trop ouvertes (644, lisible par tout le monde) est une faille classique — `/tmp` est un dossier partagé par tous les utilisateurs du système.

## Niveau 22 → 23
**Objectif :** Même principe que le niveau 21, mais le nom du fichier temporaire est un hash MD5 calculé dynamiquement, changeant à chaque exécution.

**Commande :**
echo I am user bandit23 | md5sum
cat /tmp/<hash_obtenu>

**Ce que j'ai appris :** un nom de fichier "aléatoire" n'est une protection que s'il n'est pas prévisible — ici, la formule de calcul du hash était connue et reproductible, donc pas de vraie protection.

## Niveau 23 → 24
**Objectif :** Un cron job exécute tout script déposé dans un dossier précis, à condition qu'il appartienne à l'utilisateur courant.

**Commandes :**
echo '#!/bin/bash
cat /etc/bandit_pass/bandit24 > /tmp/resultat' > /var/spool/bandit24/foo/monscript.sh
chmod 777 /var/spool/bandit24/foo/monscript.sh
attendre 1 minute
cat /tmp/resultat

**Ce que j'ai appris :** un mécanisme qui exécute automatiquement des fichiers déposés par des utilisateurs non fiables est une faille d'escalade de privilèges classique.

## Niveau 24 → 25
**Objectif :** Brute force d'un code PIN à 4 chiffres (10 000 combinaisons possibles) envoyé à un port local, en plus du mot de passe connu.

**Commandes :**
```bash
#!/bin/bash
for i in $(seq -w 0000 9999); do
    echo "MOT_DE_PASSE $i" | nc -w 1 localhost 30002
    sleep 0.1
done
```
Lancé avec :
nohup ./brute.sh > resultats.txt 2>&1 &
grep -A 1 "Correct" resultats.txt

**Difficultés rencontrées :** un premier essai sans pause entre les tentatives a provoqué une coupure de connexion (probablement une protection anti-abus du serveur). Solution : ajouter `sleep 0.1` entre chaque tentative, et lancer le script avec `nohup ... &` pour qu'il continue de tourner en arrière-plan même si la session SSH se coupe.

**Ce que j'ai appris :** l'automatisation d'un brute force nécessite de gérer la robustesse du script (résistance aux coupures, exécution en arrière-plan), pas juste la logique de génération des combinaisons.

## Niveau 25 → 26
**Objectif :** Une clé SSH privée est fournie, mais se connecter normalement ferme immédiatement la session (shell restreint).

**Solution :** réduire la hauteur du terminal pour forcer l'affichage du message d'accueil à passer par un pager (`more`), puis utiliser le raccourci `v` du pager pour ouvrir `vi`, et depuis `vi` lancer un vrai shell :
:set shell=/bin/bash
:shell

**Ce que j'ai appris :** un shell restreint mal configuré peut être contourné via des programmes tiers autorisés (ici, un éditeur de texte) qui offrent eux-mêmes un accès shell caché — technique classique d'évasion de shell restreint (« shell breakout »).

## Niveau 26 → 27
**Objectif :** Un binaire setuid (`bandit27-do`) appartenant à bandit27 permet d'exécuter une commande avec ses droits.

**Commande :**
./bandit27-do cat /etc/bandit_pass/bandit27

## Niveau 27 → 28
**Objectif :** Cloner un dépôt Git accessible via un utilisateur dédié (`bandit27-git`), pour lire le mot de passe dans le README.

**Commande :**
git clone ssh://bandit27-git@bandit.labs.overthewire.org:2220/home/bandit27-git/repo /tmp/repo27
cat /tmp/repo27/README

**Difficulté rencontrée :** cloner depuis l'intérieur d'une session bandit (vers `localhost`) déclenchait le même blocage réseau qu'au niveau 13. Solution : cloner depuis ma propre machine, en utilisant le nom de domaine externe et en précisant le port (`:2220`) dans l'URL SSH.

**Ce que j'ai appris :** la syntaxe d'une URL Git via SSH personnalisée (`ssh://user@host:port/chemin`), utile pour des dépôts hébergés sur des ports non-standards.

## Niveau 28 → 29
**Objectif :** Le mot de passe est masqué dans la version actuelle du README, mais visible dans l'historique Git.

**Commandes :**
git log
git show <hash_du_commit>

**Ce que j'ai appris :** supprimer une information sensible dans la dernière version d'un fichier ne l'efface pas de l'historique Git — une vraie faille de sécurité fréquente en entreprise (secrets committés puis "retirés" sans purger l'historique).

## Niveau 29 → 30
**Objectif :** Le mot de passe se trouve sur une branche Git différente de la branche principale.

**Commandes :**
git branch -a
git show origin/dev:README.md

**Ce que j'ai appris :** un dépôt peut contenir plusieurs branches avec des informations différentes ; toujours vérifier `git branch -a` pour voir toutes les branches distantes, pas seulement celle sur laquelle on se trouve.

## Niveau 30 → 31
**Objectif :** Le mot de passe est caché dans un tag Git plutôt que dans un commit ou une branche.

**Commandes :**
git tag
git show secret

**Ce que j'ai appris :** les tags Git peuvent aussi être utilisés pour stocker/marquer de l'information, pas seulement des numéros de version.

## Niveau 31 → 32
**Objectif :** Pousser (`push`) un fichier précis vers le dépôt distant pour recevoir le mot de passe suivant.

**Commandes :**
git config --global user.email "..."
git config --global user.name "..."
echo "May I come in?" > key.txt
git add -f key.txt
git commit -m "add key.txt"
git push origin master

**Difficulté rencontrée :** un fichier `.gitignore` empêchait l'ajout normal du fichier demandé. Solution : forcer l'ajout avec `git add -f`.

**Ce que j'ai appris :** un `.gitignore` peut être utilisé pour dissimuler volontairement un fichier des opérations Git standards ; l'option `-f` (force) permet de l'outrepasser si nécessaire.

## Niveau 32 → 33
**Objectif :** Un shell qui transforme tout ce qui est tapé en majuscules, cassant les commandes Linux normales (sensibles à la casse).

**Commande :**
$0

**Explication :** `$0` est une variable spéciale contenant le nom du programme en cours d'exécution (ici, le shell restreint). La taper relance ce même programme, ce qui a pour effet d'ouvrir un shell bash normal sans passer par la transformation en majuscules — et donne directement accès avec les droits de bandit33 (le niveau suivant), sans étape intermédiaire.

**Ce que j'ai appris :** les shells restreints basés sur une simple transformation de l'entrée (ici, mise en majuscules) peuvent être contournés via des mécanismes internes au shell (variables spéciales) qui échappent à cette transformation.

## Niveau 33 — Fin du wargame
Dernier niveau : confirmation que les 34 niveaux de Bandit sont complétés. Pas de mot de passe supplémentaire à ce stade — juste un message de félicitations du jeu.

---

**Bilan général de Bandit (niveaux 0 à 34) :** progression complète du wargame, couvrant la navigation Linux de base, la gestion des permissions, les recherches avancées (`find`, `grep`), le décodage et la décompression multi-couches, l'authentification par clé SSH, la communication réseau (`nc`, `openssl s_client`), le scan de ports (`nmap`), les binaires setuid, les cron jobs mal sécurisés, le brute force automatisé, l'évasion de shells restreints, et l'utilisation de Git (historique, branches, tags, `.gitignore`) comme vecteur de fuite d'information.


