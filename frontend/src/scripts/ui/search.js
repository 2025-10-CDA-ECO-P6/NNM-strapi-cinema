// Import de la fonction pour chercher films + acteurs
import { searchAll } from "../api/api_search.js";

// Import des URLs de config (Strapi + TMDB)
import { API_BASE_URL, TMDB_BASE_IMAGE_URL } from "../../../config.js";

// === Récupération du paramètre "q" dans l’URL ===
// Exemple : search.html?q=recherchetoto
const params = new URLSearchParams(window.location.search);
const query = params.get("q");

// Sélecteurs DOM (titres, listes et compteurs)
const titleEl = document.querySelector("#search-query");
const filmsList = document.querySelector("#list-films");
const acteursList = document.querySelector("#list-acteurs");
const countFilms = document.querySelector("#count-films");
const countActeurs = document.querySelector("#count-acteurs");

// Si une recherche présente dans l’URL → lance la fonction
if (query) {
  titleEl.textContent = `Résultats pour “${query}”`;
  loadResults(query);
}

// === Fonction principale : charger résultats ===
async function loadResults(q) {
  // Appel API → récupère les films et acteurs correspondant
  const { movies, actors } = await searchAll(q);

  // Garde uniquement les films avec une img valide
  const moviesWithImage = movies.filter((m) => m.poster_image && m.poster_image.trim() !== "");

  // Génère liste des films (HTML dynamique)
  renderList(filmsList, moviesWithImage, "Aucun film trouvé.", (m) => {
    let poster = null;

    // Reconstruit l’URL complète de l’image avec path de bdd et url de base tmdb 
    if (m.poster_image && m.poster_image.startsWith("/")) {
      poster = `${TMDB_BASE_IMAGE_URL}${m.poster_image}`;
    }

    // Template HTML pour chaque film
    return `
      <li class="card">
      <a href="film.html?id=${m.tmdb_id || m.id}" class="film-link">
        <img src="${poster}" alt="${m.title}">
        <h3>${m.title}</h3>
        ${m.realisator ? `<p><em>Réalisateur : ${m.realisator}</em></p>` : ""}
      </a>
      </li>
    `;
  });

  // === Acteurs ===
  renderList(acteursList, actors, "Aucun artiste trouvé.", (a) => {
    // Vérifie si le profil est défini et non vide
    const hasPhoto = a.profile_path && a.profile_path.trim() !== "";

    // URL complète 
    const profile = hasPhoto
      ? a.profile_path.startsWith("http")
        ? a.profile_path
        : `${TMDB_BASE_IMAGE_URL}${a.profile_path}`
      : null;

    return `
      <li class="card actor-card">
        ${hasPhoto ? `<img src="${profile}" alt="${a.full_name || `${a.name} ${a.last_name || ""}`}">` : ""}
        <h3>${a.full_name || `${a.name} ${a.last_name || ""}`}</h3>
      </li>
    `;
  });


  // MAJ des compteurs de resultats
  countFilms.textContent = `${moviesWithImage.length} film(s)`;
  countActeurs.textContent = `${actors.length} artiste(s)`;
}

// === Fonction pour afficher liste (films ou acteurs) ===
function renderList(container, items, emptyText, templateFn) {
  if (!items || items.length === 0) {
    container.innerHTML = `<p>${emptyText}</p>`;
    return;
  }
  // On génère le HTML pour chaque élément
  container.innerHTML = items.map(templateFn).join("");
}
