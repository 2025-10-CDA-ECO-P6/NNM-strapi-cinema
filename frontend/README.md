# CineVerse — Front-end (Vitrine)

## Objectif du front-end  

Le front-end du projet **CineVerse** a pour objectif de proposer une **interface vitrine** permettant de visualiser et de parcourir les **films** et **acteurs** gérés par le back-end Strapi.

Cette interface permet :
- de **présenter le catalogue** des films importés depuis TMDb,
- d’**afficher dynamiquement** les informations issues de l’API Strapi,
- de **valoriser l’expérience utilisateur** à travers un design responsive et épuré.

---

## Architecture du projet  
frontend/
├── public/                → Ressources statiques (favicon, images)
├──   src/
│   ├──   assets/            → Images, polices, icônes
│   ├──   components/        → Composants UI réutilisables (cartes, header, footer)
│   ├──   pages/             → Pages principales (films, acteurs)
│   ├──   scripts/           → Fichiers JavaScript (logique API, interactions)
│   │   ├── api.js           → Fonctions pour consommer l’API Strapi
│   │   └── ui.js            → Gestion des interactions front
│   ├── index.html            → Page d’entrée principale
│   └── main.js               → Point d’entrée de l’application