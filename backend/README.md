# CineVerse — Back-end (API Strapi)

## Objectif du back-end
Le back-end du projet **CineVerse** a pour objectif de fournir une **API headless complète et sécurisée** pour la gestion des données cinématographiques.  
Basé sur **Strapi**, il permet de :

- Centraliser les informations sur les **films**, **réalisateurs** et **acteurs** ;
- Importer automatiquement des données depuis **The Movie Database (TMDb)** ;
- Exposer ces données via des **endpoints** ;
- Gérer les **rôles et permissions** selon le profil utilisateur ;

## Architecture du projet
```bash
backend/
├── node_modules/ → Dépendances installées par npm
│
├── public/ → Fichiers publics accessibles depuis l’API
│ ├── robots.txt
│ └── uploads/ → Médias importés (affiches, visuels)
│
├── src/
│ ├── admin/ → Configuration de l’interface d’administration Strapi
│ │ ├── app.example.tsx
│ │ ├── tsconfig.json
│ │ └── vite.config.example.ts
│ │
│ ├── api/ → Dossier principal des API Strapi
│ │ ├── external-data/ → Schémas de données et types (Movie, Actor)
│ │ │ ├── content-types/
│ │ │ │ ├── actor/schema.json
│ │ │ │ └── movie/schema.json
│ │ │ └── types/types.ts
│ │ │
│ │ └── tmdb/ → Intégration avec l’API The Movie Database (TMDb)
│ │ ├── controllers/tmdb.ts
│ │ ├── routes/tmdb.ts
│ │ └── services/tmdb.ts
│ │
│ ├── extensions/ → Extensions éventuelles ou plugins Strapi
│ └── index.ts → Point d’entrée principal du serveur Strapi
│
├── types/
│ └── generated/ → Types générés automatiquement par Strapi
│ ├── components.d.ts
│ └── contentTypes.d.ts
│
├── package.json → Dépendances et scripts npm
├── package-lock.json → Verrouillage des versions
├── tsconfig.json → Configuration TypeScript
```
--- 

## Endpoints avec l'api TMDB
1. Film Populaire  
GET /movie/popular  
2. Films par recherche  
GET /search/movie  
3. Détails d’un film + crédits  
GET /movie/{movie_id}  
4. Détails d’un acteur  
GET /person/{person_id}  

--- 

## Installation du projet  

### 1. Cloner le dépôt  
```bash
git clone https://github.com/2025-10-CDA-ECO-P6/NNM-strapi-cinema.git
cd backend
```

### 2. Variables d'environnements
Crée un fichier `.env` à la racine de `backend/` (ne pas le committer).  
Exemple minimal pour un setup local **SQLite + TMDb** :

```env
# Réseau / serveur
HOST=0.0.0.0  
PORT=1337  
URL=http://localhost:1337  

# Base de données 
DATABASE_CLIENT=sqlite  
DATABASE_FILENAME=.tmp/data.db  

# Intégration TMDb
## Jeton d'accès en lecture
TMDB_API_KEY=token_tmdb 
## Base url de l'api
TMDB_BASE_URL=https://api.themoviedb.org/3
```

### 3. Installer les dépendances
```bash
npm install
```

## Lancement du Strapi

### En mode Dévellopement : Démarrage du serveur Strapi
```bash
npm run develop
```
Le serveur démarre sur (http://localhost:1337/admin)

### 3. En mode production
```bash
npm run build
npm start
```

## Commande local pour les tests
```bash
npm run lint
npm run test
npm run build
```
###  Husky
Nous utilisons **Husky** pour exécuter automatiquement des vérifications (lint, formatage, tests, etc.) avant chaque commit.  
Il s’active automatiquement lors des actions Git — aucune commande manuelle n’est nécessaire. 
