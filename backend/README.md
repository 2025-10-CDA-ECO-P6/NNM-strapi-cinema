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

##  US-07 — Mise à jour périodique du catalogue

Cette fonctionnalité permet de **mettre à jour automatiquement le catalogue de films** depuis l’API **TMDb** grâce à un **cron job** configuré dans Strapi.

###  Fonctionnement
- Un **cron job quotidien** lance automatiquement le script d’import.  
- Le script récupère les films populaires depuis TMDb.  
- Les **nouveaux films** sont ajoutés dans Strapi sans écraser les existants.  
- Un **journal** dans la console indique les ajouts et les doublons.  

###  Fichiers impliqués
- `config/cron-tasks.js` → planification du cron job  
- `scripts/updateCatalog.js` → logique d’import des films  
- `config/server.ts` → activation du cron dans Strapi  

###  Résultat attendu
Le catalogue est automatiquement tenu à jour chaque jour, sans intervention manuelle, tout en évitant les doublons.

## Tests unitaires

Les tests vérifient le bon fonctionnement du script **`updateCatalog.js`**, qui met à jour le catalogue de films depuis l’API TMDb.  
Ils utilisent **Jest** pour exécuter les tests et **Husky** pour les lancer avant chaque commit.

###  Commandes
```bash
# Lancer les tests
npx jest --runInBand --verbose

# Voir la couverture de code
npx jest --coverage
```

###  Vérifications

- **Ajout d’un nouveau film** s’il n’existe pas  
- **Ignorer les films** déjà présents  
- **Gestion propre des erreurs API**

## US-08 : Authentification API

### Objectif
Permettre l’accès sécurisé à l’API uniquement aux utilisateurs authentifiés via un **token JWT**, afin de protéger les données internes de l’application Strapi.

---

### Fonctionnement général
L’authentification repose sur le **système JWT natif de Strapi**.  
Lorsqu’un utilisateur se connecte, le serveur génère un **token unique et temporaire**.  
Ce token doit ensuite être transmis dans les requêtes pour accéder aux endpoints protégés.

---

###  Processus d’authentification
1. **Connexion utilisateur** :  
   L’utilisateur envoie ses identifiants (email + mot de passe) au point d’entrée `/api/auth/local`.  
   Strapi vérifie les informations et retourne un **JWT**.

2. **Utilisation du token** :  
   Pour chaque requête à une route protégée, le client ajoute dans l’en-tête HTTP :  
   `Authorization: Bearer <jwt_token>`

3. **Validation automatique** :  
   Strapi vérifie la validité du token :  
   - S’il est valide → accès autorisé.  
   - S’il est expiré, manquant ou invalide → réponse `401 Unauthorized`.

---

### Sécurisation des routes
Certaines routes (comme `/api/tmdb/secure-popular`) sont configurées pour exiger une authentification.  
Seuls les utilisateurs connectés peuvent y accéder.  
Les routes publiques restent disponibles sans token.

---

### Gestion des tokens
Les **tokens expirés** sont automatiquement invalidés par Strapi selon la configuration du projet.  
Un utilisateur doit alors se reconnecter pour obtenir un nouveau token.

---

### Résultat attendu
- Les endpoints sensibles sont protégés.  
- Un utilisateur non authentifié reçoit une erreur `401 Unauthorized`.  
- Un utilisateur authentifié accède normalement aux données.  
- Les échanges entre client et serveur sont sécurisés par le système JWT.
