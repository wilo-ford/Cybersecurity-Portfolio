// Sources : CV PDF fourni le 18 novembre 2026 et README du portfolio GitHub lié.
// null = lien non fourni : aucun bouton trompeur n’est généré.
export const profile = {
  siteUrl: 'https://mohamed-abogourin-portfolio.awalabgr.workers.dev',
  name: 'Mohamed ABOGOURIN',
  location: 'Cotonou, Bénin',
  email: 'awalabgr@gmail.com',
  phone: '+2290167544610',
  phoneDisplay: '01 67 54 46 10',
  phoneInternationalDisplay: '+229 01 67 54 46 10',
  whatsapp: '2290167544610',
  github: 'https://github.com/wilo-ford/Cybersecurity-Portfolio',
  linkedin: null,
  cv: '/cv-mohamed-abogourin.pdf',
  title: 'Étudiant en systèmes d’information · Cybersécurité',
  education: 'L3 Informatique (Systèmes d’Information)',
  focus: 'Orientations : SOC & pentest',
  availability: 'Cybersécurité · janvier 2027',
  intro: 'J’explore les systèmes, les réseaux et la sécurité web pour mieux comprendre et protéger les systèmes d’information.',
  about: 'Étudiant en Licence 3 Systèmes d’Information à l’ESGIS, à Cotonou, je développe mes compétences en Linux, réseaux, sécurité web et pentest en laboratoire. Je souhaite contribuer à l’analyse des événements de sécurité et à la rédaction de rapports techniques, tout en continuant à apprendre au sein d’une équipe.',
  opportunity: 'Disponible à partir de janvier 2027 pour un stage académique en cybersécurité. À l’écoute d’opportunités junior et de missions freelance adaptées à mon niveau.'
};
export const skills = [{
  icon: 'terminal',
  title: 'Linux & Bash',
  label: 'Pratique en laboratoire · bases de Bash',
  text: 'Commandes Linux, SSH, permissions, recherche de fichiers, tâches cron et découverte des binaires setuid avec Bandit.',
  tags: ['Kali Linux', 'Ubuntu', 'SSH', 'Bash · bases']
}, {
  icon: 'network',
  title: 'Réseaux & analyse',
  label: 'Fondamentaux & initiation',
  text: 'TCP/IP, DNS, HTTP. Découverte de ports et initiation à l’analyse du trafic.',
  tags: ['Nmap', 'Wireshark', 'TCP/IP', 'DNS']
}, {
  icon: 'shield',
  title: 'Sécurité web & pentest',
  label: 'Pratique en laboratoire',
  text: 'Injection SQL, énumération web, exercices d’exploitation, sessions shell/Meterpreter et vérification des privilèges obtenus.',
  tags: ['PortSwigger', 'Metasploit', 'Gobuster', 'Notions OWASP']
}, {
  icon: 'server',
  title: 'Systèmes & virtualisation',
  label: 'Projets académiques',
  text: 'Installation de Windows Server et d’AD DS, virtualisation imbriquée avec Hyper-V, VMware ESXi et conteneurisation Docker.',
  tags: ['Windows Server', 'AD DS', 'Hyper-V', 'VMware ESXi', 'Docker']
}, {
  icon: 'monitoring',
  title: 'Supervision Linux',
  label: 'Projet académique de groupe',
  text: 'Supervision d’une machine virtuelle Ubuntu : collecte et visualisation des métriques avec Prometheus, Node Exporter et Grafana.',
  tags: ['Ubuntu', 'Prometheus', 'Node Exporter', 'Grafana']
}, {
  icon: 'code',
  title: 'Python & Git',
  label: 'Bases & pratique académique',
  text: 'Bases de Python, analyse de données avec Pandas dans un projet de groupe et utilisation de Git dans les exercices Bandit.',
  tags: ['Python · bases', 'Pandas', 'Git · laboratoire']
}];
export const projects = [{
  id: 'bandit',
  number: '01',
  category: 'LABORATOIRE · LINUX',
  title: 'Du terminal à la compréhension.',
  name: 'OverTheWire Bandit',
  summary: 'Parcours des niveaux 0 à 34 : SSH, permissions, recherche de fichiers, cron, binaires setuid et manipulation de données avec Git.',
  tags: ['Linux', 'SSH', 'Bash'],
  visual: 'terminal',
  detail: 'Parcours personnel déclaré terminé dans le CV et documenté dans le README du portfolio GitHub. Quatre write-ups couvrent les niveaux 0–5, 6–12, 13–20 et 21–33 : commandes Linux, permissions, SSH, cron, setuid et Git.',
  role: 'Pratique personnelle',
  link: 'https://github.com/wilo-ford/Cybersecurity-Portfolio/tree/main/Write-ups'
}, {
  id: 'monitoring',
  number: '02',
  category: 'PROJET ACADÉMIQUE · SUPERVISION',
  title: 'Rendre les systèmes observables.',
  name: 'Monitoring Linux',
  summary: 'Supervision d’une machine virtuelle Ubuntu avec Prometheus, Node Exporter et Grafana. Réalisation en groupe avec rapport.',
  tags: ['Prometheus', 'Grafana', 'Ubuntu'],
  visual: 'monitoring',
  detail: 'Projet académique de groupe : mise en place d’une chaîne de supervision sur une machine virtuelle Ubuntu, avec Node Exporter pour les métriques et Grafana pour leur visualisation. Rapport de groupe mentionné dans le CV.',
  role: 'Projet de groupe',
  link: null
}, {
  id: 'docker',
  number: '03',
  category: 'PROJET ACADÉMIQUE · CONTENEURS',
  title: 'Des services qui travaillent ensemble.',
  name: 'Application Docker',
  summary: 'Conteneurisation d’une application Node.js / MySQL avec Dockerfile et Docker Compose.',
  tags: ['Docker', 'Node.js', 'MySQL'],
  visual: 'docker',
  detail: 'Projet académique de conteneurisation d’une application Node.js avec une base MySQL. Utilisation de Dockerfile et Docker Compose. Le dépôt et le détail de la contribution restent à ajouter.',
  role: 'Projet académique',
  link: null
}, {
  id: 'web',
  number: '04',
  category: 'LABORATOIRE · SÉCURITÉ WEB',
  title: 'Comprendre une faille pour mieux la prévenir.',
  name: 'Labs PortSwigger',
  summary: 'Exercices d’injection SQL en environnement pédagogique : contournement d’authentification, UNION et extraction de données.',
  tags: ['Sécurité web', 'SQL', 'PortSwigger'],
  visual: 'web',
  detail: 'Pratique de labs de la Web Security Academy mentionnée dans le CV. Les exercices portent sur l’injection SQL. Les noms et preuves des labs individuels peuvent être ajoutés lorsque les liens seront disponibles.',
  role: 'Pratique personnelle',
  link: null
}, {
  id: 'pentest-lab',
  number: '05',
  category: 'LABORATOIRE · PENTEST',
  title: 'Expérimenter dans un cadre pédagogique.',
  name: 'Lab de pentest Kali',
  summary: 'Énumération web et exploitation de vulnérabilités avec Metasploit et Gobuster, dans un laboratoire pédagogique.',
  tags: ['Kali Linux', 'Metasploit', 'Gobuster'],
  visual: 'pentest',
  detail: 'Travaux pratiques décrits dans le CV : énumération web, exploitation de vsFTPd et Shellshock, lecture de fichiers via Ghostcat sur Tomcat, sessions shell/Meterpreter et vérification des privilèges obtenus. Ces expériences sont présentées comme des exercices de laboratoire.',
  role: 'Pratique en laboratoire',
  link: null
}, {
  id: 'windows-server',
  number: '06',
  category: 'PROJET ACADÉMIQUE · SYSTÈMES',
  title: 'Construire et administrer un environnement.',
  name: 'Windows Server & ESXi',
  summary: 'Windows Server 2025, AD DS, virtualisation imbriquée avec Hyper-V et gestion d’utilisateurs sur VMware ESXi 7.0.3.',
  tags: ['Windows Server', 'AD DS', 'VMware ESXi'],
  visual: 'systems',
  detail: 'Projet académique mentionné dans le CV : installation de Windows Server, Hyper-V avec virtualisation imbriquée, installation d’AD DS et création d’utilisateurs dans ESXi. L’environnement associe Windows Server 2025 et VMware ESXi 7.0.3.',
  role: 'Projet académique',
  link: null
}, {
  id: 'sahelsound',
  number: '07',
  category: 'PROJET ACADÉMIQUE · PYTHON',
  title: 'Explorer les données avec Python.',
  name: 'SahelSound Records',
  summary: 'Projet académique réalisé en groupe : analyse de données avec Python et Pandas.',
  tags: ['Python · bases', 'Pandas', 'Projet de groupe'],
  visual: 'analysis',
  detail: 'SahelSound Records est présenté dans le CV comme un projet de groupe consacré à l’analyse de données avec Pandas. Il illustre une application académique des bases de Python. Le jeu de données, les résultats détaillés et la contribution individuelle pourront être documentés ultérieurement.',
  role: 'Projet de groupe',
  link: null
}];
export const documentation = {
  title: 'Apprendre, puis documenter.',
  text: 'Quatre comptes rendus publics : commandes utilisées, explications et difficultés rencontrées au fil des challenges Linux.',
  href: 'https://github.com/wilo-ford/Cybersecurity-Portfolio/tree/main/Write-ups',
  label: 'Lire les 4 write-ups'
};
const cvEvidence = [{
  label: 'Présentation dans le CV',
  url: profile.cv
}];
// Compléter personalContribution uniquement avec une contribution individuelle confirmée.
// Les captures et rapports réels peuvent être ajoutés à evidence lorsqu’ils sont disponibles.
export const practiceDetails = {
  bandit: {
    objective: 'Développer mes réflexes Linux à travers les challenges progressifs d’OverTheWire Bandit.',
    actions: ['Connexion SSH, navigation et recherche de fichiers.', 'Travail sur les permissions, cron et les binaires setuid.', 'Manipulation de données et utilisation de Git.', 'Rédaction de quatre write-ups couvrant les niveaux 0–5, 6–12, 13–20 et 21–33.'],
    result: 'Parcours personnel terminé (niveaux 0 à 34), avec quatre comptes rendus consultables sur GitHub.',
    evidenceLabel: 'Write-ups publics',
    evidence: [{
      label: 'Niveaux 0 à 5',
      url: 'https://github.com/wilo-ford/Cybersecurity-Portfolio/blob/main/Write-ups/bandit-niveaux-0-5.md'
    }, {
      label: 'Niveaux 6 à 12',
      url: 'https://github.com/wilo-ford/Cybersecurity-Portfolio/blob/main/Write-ups/bandit-niveaux-6-12.md'
    }, {
      label: 'Niveaux 13 à 20',
      url: 'https://github.com/wilo-ford/Cybersecurity-Portfolio/blob/main/Write-ups/bandit-niveaux-13-20.md'
    }, {
      label: 'Niveaux 21 à 33',
      url: 'https://github.com/wilo-ford/Cybersecurity-Portfolio/blob/main/Write-ups/bandit-niveaux-21-33.md'
    }],
    personalContribution: 'Réalisation du parcours Linux et rédaction des quatre write-ups publiés dans mon dépôt GitHub.',
    environment: 'OverTheWire Bandit · connexion SSH · environnement pédagogique Linux',
    challenge: 'Au niveau 13 → 14, une connexion depuis la session distante était refusée. Le write-up décrit l’isolement des causes possibles, puis le transfert de la clé sur la machine locale pour établir une connexion SSH externe.',
    learning: 'Distinguer un problème de permissions, de clé ou de connexion et adapter la méthode à partir des messages observés.',
    lessonSource: 'https://github.com/wilo-ford/Cybersecurity-Portfolio/blob/main/Write-ups/bandit-niveaux-13-20.md'
  },
  monitoring: {
    objective: 'Superviser une machine virtuelle Ubuntu et rendre ses métriques observables.',
    actions: ['Utilisation de Node Exporter pour exposer les métriques.', 'Collecte des métriques avec Prometheus.', 'Visualisation dans Grafana et réalisation d’un rapport de groupe.'],
    result: 'Projet collectif de supervision Linux réalisé avec Prometheus, Node Exporter et Grafana, accompagné d’un rapport de groupe.',
    evidenceLabel: 'Projet académique présenté dans le CV',
    evidence: cvEvidence,
    personalContribution: null
  },
  docker: {
    objective: 'Conteneuriser une application associant Node.js et MySQL.',
    actions: ['Préparation d’un Dockerfile.', 'Utilisation de Docker Compose pour l’application et sa base de données.'],
    result: 'Application Node.js/MySQL conteneurisée dans le cadre d’un projet académique.',
    evidenceLabel: 'Projet académique présenté dans le CV',
    evidence: cvEvidence,
    personalContribution: null
  },
  web: {
    objective: 'Comprendre le fonctionnement des injections SQL dans les laboratoires de la Web Security Academy.',
    actions: ['Exercices de contournement d’authentification.', 'Pratique des attaques UNION.', 'Extraction de données dans les environnements pédagogiques PortSwigger.'],
    result: 'Exercices d’injection SQL réalisés dans les laboratoires de la Web Security Academy.',
    evidenceLabel: 'Pratique présentée dans le CV',
    evidence: cvEvidence,
    personalContribution: null
  },
  'pentest-lab': {
    objective: 'Pratiquer l’énumération et l’exploitation de vulnérabilités dans un laboratoire Kali Linux.',
    actions: ['Énumération web avec Gobuster.', 'Exercices d’exploitation de vsFTPd et de Shellshock.', 'Lecture de fichiers via Ghostcat sur Tomcat.', 'Utilisation de sessions shell/Meterpreter avec Metasploit.', 'Vérification des privilèges obtenus.'],
    result: 'Travaux pratiques d’énumération, d’exploitation et d’observation des privilèges réalisés dans un environnement de laboratoire.',
    evidenceLabel: 'Pratique présentée dans le CV',
    evidence: cvEvidence,
    personalContribution: null
  },
  'windows-server': {
    objective: 'Mettre en place un environnement académique Windows Server et de virtualisation.',
    actions: ['Installation de Windows Server 2025 et d’AD DS.', 'Utilisation d’Hyper-V avec virtualisation imbriquée.', 'Création d’utilisateurs dans VMware ESXi 7.0.3.'],
    result: 'Projet académique associant Windows Server, AD DS, Hyper-V et VMware ESXi.',
    evidenceLabel: 'Projet académique présenté dans le CV',
    evidence: cvEvidence,
    personalContribution: null
  },
  sahelsound: {
    objective: 'Appliquer les bases de Python à un projet d’analyse de données.',
    actions: ['Analyse de données avec la bibliothèque Pandas.', 'Réalisation du projet SahelSound Records en groupe.'],
    result: 'Projet académique de groupe d’analyse de données avec Pandas.',
    evidenceLabel: 'Projet de groupe présenté dans le CV',
    evidence: cvEvidence,
    personalContribution: null
  }
};
export const timeline = [{
  date: '2026 — 2027',
  title: 'Licence 3 · Systèmes d’Information',
  place: 'ESGIS · Cotonou',
  text: 'Poursuite du parcours universitaire et développement des compétences en cybersécurité par la pratique.',
  current: true
}, {
  date: '2025 — 2026',
  title: 'Licence 2',
  place: 'ESGIS · Cotonou',
  text: 'Formation en informatique et réalisation de projets académiques en systèmes, supervision et conteneurisation.'
}];
