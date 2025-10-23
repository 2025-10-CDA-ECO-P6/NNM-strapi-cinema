# Documentation technique — Endpoints

| Méthode  | Endpoint                     | Contrôleur / Handler                 | Auth | Description  |
|----------|------------------------------|--------------------------------------|------|--------------|
| GET      | `/tmdb/api_popular`          | `api-popular.apiPopular`             | ❌   | Films les plus récents |
| GET      | `/tmdb/api_search`           | `api-search.apiSearch`               | ❌   | Recherche de films par mot-clé |
| GET      | `/tmdb/api_actor`            | `api-actor.getAllActors`             | ❌   | Liste des acteurs |
| GET      | `/tmdb/api_actor/:id`        | `api-actor.getActorById`             | ❌   | Détails d’un acteur |
| GET      | `/tmdb/api_catalog`          | `api-catalog.apiCatalog`             | ❌   | Catalogue de films enrichi |
| GET      | `/tmdb/api_detail_movie/:id` | `api-detail-movie.apiDetailMovie`    | ❌   | Détails d’un film |
| GET      | `/tmdb/secure-popular`       | `tmdb.securePopular`                 | 🔒   | Version test sécurisée (avec token) |

---

## `/tmdb/api_popular`
Récupère la liste des **derniers films sortis**.  
```bash
curl http://localhost:1337/api/tmdb/api_popular
```

---

## `/tmdb/api_search`
Recherche de films via le paramètre `q`.  
```bash
curl "http://localhost:1337/api/tmdb/api_search?q=inception"
```

---

## `/tmdb/api_actor`
Retourne la liste des **acteurs populaires**.  
```bash
curl http://localhost:1337/api/tmdb/api_actor
```

---

## `/tmdb/api_actor/:id`
Retourne les **détails d’un acteur** (bio, filmographie, etc.).  
```bash
curl http://localhost:1337/api/tmdb/api_actor/287
```

---

## `/tmdb/api_catalog`
Renvoie un **catalogue complet** de films issus de TMDb.  
```bash
curl http://localhost:1337/api/tmdb/api_catalog
```

---

## `/tmdb/api_detail_movie/:id`
Retourne les **informations détaillées** d’un film : titre, synopsis, affiche, genres, etc.  
```bash
curl http://localhost:1337/api/tmdb/api_detail_movie/550
```

---

## 🔒 `/tmdb/secure-popular`
Version sécurisée pour tests internes (auth gérée dans le contrôleur).  
```bash
curl http://localhost:1337/api/tmdb/secure-popular
```
