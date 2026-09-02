# OverTheWire Bandit — Write-up niveaux 13 à 20

## Niveau 13 → 14
**Objectif :** Une clé privée SSH (`sshkey.private`) est fournie pour se connecter à bandit14, sans mot de passe.

**Commandes :
**scp -P 2220 bandit13@bandit.labs.overthewire.org:sshkey.private ~/awal13key
chmod 600 ~/awal13key
ssh -i ~/awal13key bandit14@bandit.labs.overthewire.org -p 2220

**Explication :**
- `scp` copie la clé depuis le serveur vers ma propre machine.
- `chmod 600` restreint les permissions du fichier (lecture/écriture pour le propriétaire uniquement) — SSH refuse d'utiliser une clé privée trop ouverte en permissions.
- `-i` indique le fichier de clé privée à utiliser pour l'authentification.

**Difficulté rencontrée :** en tentant de me connecter directement depuis l'intérieur de la session bandit13 vers `localhost`, le serveur coupait systématiquement la connexion avec le message "Connecting from localhost is blocked to conserve resources", quel que soit le backend (`gibson-0` ou `gibson-1`) ou les options SSH utilisées. La solution a été de télécharger la clé sur ma propre machine avec `scp`, puis de me connecter directement depuis là en utilisant le nom de domaine externe plutôt que `localhost` — ce qui contourne le problème.

**Ce que j'ai appris :** face à un blocage réseau, il faut isoler méthodiquement chaque variable (clé, permissions, algorithme, backend) avant de conclure à un problème serveur. Aussi : parfois la meilleure solution n'est pas de forcer une méthode qui ne marche pas, mais de changer complètement d'approche (ici, connexion externe plutôt qu'interne).

## Niveau 14 → 15
**Objectif :** Envoyer le mot de passe de bandit14 à un service qui écoute sur le port 30000 en local, pour recevoir le mot de passe de bandit15.

**Commande :**nc localhost 30000
Puis taper le mot de passe et valider.

**Explication :** `nc` (netcat) envoie et reçoit des données brutes sur un port réseau. C'est une façon simple de communiquer directement avec un service sans passer par un protocole complexe.

**Ce que j'ai appris :** principe de base d'un service réseau qui répond selon les données reçues — utile pour comprendre comment fonctionnent beaucoup de services applicatifs.

## Niveau 15 → 16
**Objectif :** Même principe que le niveau 14, mais le service (port 30001) utilise du chiffrement SSL/TLS.

**Commande :**openssl s_client -quiet -connect localhost:30001
Puis taper le mot de passe de bandit15 et valider.

**Explication :** `nc` ne gère pas le chiffrement, donc `openssl s_client` est utilisé à la place pour établir une connexion chiffrée avant d'envoyer les données. L'option `-quiet` évite que certaines touches soient interprétées comme des commandes spéciales du protocole (ex: la lettre "k" déclenchant un "Key Update").

**Ce que j'ai appris :** différence pratique entre une connexion en clair et une connexion chiffrée, et le rôle d'un certificat (même auto-signé, comme ici) dans l'établissement d'une session TLS.

## Niveau 16 → 17
**Objectif :** Parmi une plage de ports (31000-32000), trouver celui qui utilise SSL et transmet le mot de passe suivant.

**Commandes :**nmap -p 31000-32000 --script ssl-enum-ciphers localhost
openssl s_client -quiet -connect localhost:31790

**Explication :**
- `nmap` scanne la plage de ports pour lister ceux qui sont ouverts, et le script `ssl-enum-ciphers` identifie lesquels parlent SSL/TLS parmi eux.
- Une fois les candidats identifiés, chacun est testé avec `openssl s_client` jusqu'à trouver le bon.

**Résultat obtenu :** une clé SSH privée (pas un simple mot de passe) pour se connecter à bandit17.

**Ce que j'ai appris :** utilisation de `nmap` avec des scripts pour identifier des services spécifiques sur un ensemble de ports, technique de base en reconnaissance réseau.

## Niveau 17 → 18
**Objectif :** Deux fichiers presque identiques (`passwords.old` et `passwords.new`) ; le mot de passe est la seule ligne qui diffère entre les deux.

**Commande :**diff passwords.old passwords.new

**Explication :** `diff` compare deux fichiers ligne par ligne et n'affiche que les différences. La ligne précédée de `>` indique le contenu du nouveau fichier — c'est le mot de passe recherché.

**Ce que j'ai appris :** `diff` est un outil essentiel pour repérer rapidement des changements entre deux versions d'un fichier, très utile en analyse de configuration ou de logs.

## Niveau 18 → 19
**Objectif :** Ce niveau déconnecte automatiquement toute session SSH interactive (via un `.bashrc` modifié), avant même de pouvoir taper une commande.

**Commande :**ssh bandit18@bandit.labs.overthewire.org -p 2220 cat readme

**Explication :** au lieu d'ouvrir un shell interactif classique (qui déclencherait le `.bashrc` piégé), on ajoute directement la commande à exécuter à la fin de la commande SSH. Le serveur exécute uniquement cette commande, affiche le résultat, puis ferme la connexion — sans jamais passer par le `.bashrc`.

**Ce que j'ai appris :** SSH permet d'exécuter une commande unique à distance sans ouvrir de session complète, ce qui peut contourner certains scripts de démarrage indésirables.

## Niveau 19 → 20
**Objectif :** Un binaire setuid (`bandit20-do`) permet d'exécuter une commande avec les droits d'un autre utilisateur (bandit20).

**Commande :**./bandit20-do cat /etc/bandit_pass/bandit20

**Explication :** le bit setuid (visible dans les permissions du fichier sous forme d'un `s` : `-rwsr-x---`) fait que le programme s'exécute avec les droits de son propriétaire (bandit20) plutôt qu'avec ceux de l'utilisateur qui le lance (bandit19). Cela permet de lire un fichier normalement inaccessible.

**Ce que j'ai appris :** le mécanisme setuid est une notion de sécurité Linux importante — il permet des élévations de privilèges contrôlées, mais peut aussi être une source de vulnérabilité s'il est mal configuré (un des grands classiques en escalade de privilèges).

## Niveau 20 → 21
**Objectif :** Un binaire setuid (`suconnect`) se connecte à un port local donné et valide le mot de passe reçu.

**Commandes :**echo MOT_DE_PASSE_BANDIT20 | nc -l -p 12345 &
./suconnect 12345

**Explication :**
- La première commande lance `nc` en mode écoute (`-l`) sur le port 12345, en arrière-plan (`&`), avec le mot de passe de bandit20 prêt à être envoyé dès qu'une connexion arrive.
- La seconde commande lance `suconnect`, qui se connecte à ce même port, récupère le mot de passe envoyé, le vérifie, et transmet en retour le mot de passe de bandit21 s'il est correct.

**Ce que j'ai appris :** ce niveau illustre une communication entre deux processus distincts sur la même machine via un port réseau local — utile pour comprendre les échanges client/serveur, même en local.
