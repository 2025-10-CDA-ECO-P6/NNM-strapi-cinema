#  Documentation technique — Endpoints

## `/tmdb/api_popular`

## Description
L’endpoint `/tmdb/api_popular` est une route **GET** qui permet de récupérer la liste des **films les plus populaires** depuis l’API externe **TMDb**.

## Fonctionnement
Lors de l’appel, la requête est transmise au contrôleur `api-popular`, qui :
1. Interroge l’API TMDb pour obtenir les films populaires.
2. Transforme et filtre les données reçues.
3. Retourne une réponse JSON contenant les informations essentielles sur les films (titre, date de sortie, description, etc.).

## Sécurité
Cette route est **publique** (`auth: false`), ce qui signifie qu’elle ne nécessite aucune authentification.

## Utilisation
Elle est principalement utilisée pour afficher sur le **front-end** une sélection actualisée des films populaires, par exemple sur la page d’accueil ou dans une section “Tendances”.

### Exemple avec `curl` :
```bash
curl -X GET http://localhost:1337/api/tmdb/popular
```

## `/tmdb/api_search`

## Description
L’endpoint `/tmdb/api_search` est une route **GET** utilisée pour interagir avec l’API externe **TMDb**.  
Elle permet d’effectuer une recherche dynamique de films à partir d’un mot-clé fourni en paramètre.

## Fonctionnement
Lorsqu’elle est appelée, la requête est transmise au contrôleur `api-search`, qui :
1. Envoie une requête à l’API TMDb.
2. Traite et nettoie les données reçues.
3. Retourne au client une réponse JSON contenant les informations pertinentes sur les films trouvés.

## Sécurité
Cette route ne nécessite **aucune authentification** (`auth: false`), ce qui la rend accessible publiquement.

## Utilisation
Elle est principalement utilisée par le **front-end** pour permettre une recherche rapide et à jour des films disponibles dans la base de données TMDb.
