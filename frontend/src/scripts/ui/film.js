// Fonction  d'affichage des détails d'un film
import { getMovieDetail } from "../api/api_detail_movie.js";
//  url de base pour les images TMDB
import { TMDB_BASE_IMAGE_URL } from "../../../config.js";


// Attendre DOM chargé avant d’exécuter le script
document.addEventListener("DOMContentLoaded", async () => {
  // Récupère l’ID du film depuis les paramètres de l’URL
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  // Si aucun ID dans l’URL = erorr
  if (!id) {
    document.body.innerHTML = "<p>ID manquant dans l’URL.</p>";
    return;
  }

  // Appel API Strapi pour récupérer les infos du film
  const movie = await getMovieDetail(id);

  // Si aucune donnée renvoyée = erreur s
  if (!movie) {
    document.body.innerHTML = "<p>Film introuvable ou erreur serveur.</p>";
    return;
  }
  // sinon rendre les infos du film
  renderMovie(movie);
});

/**
 * Affiche les infos du film dans le DOM
 * @param {object} m - Données du film
 */

//  fonction de rendu du film
function renderMovie(m) {
   // Sélecteur du conteneur principal
  const container = document.querySelector(".film-detail");

  // URL complète de l’affiche du film
  const posterUrl = m.poster_image
    ? `${TMDB_BASE_IMAGE_URL}${m.poster_image}`
    : "";

  // Structure principale
  container.innerHTML = `
    <section class="film-hero">
      <div class="film-hero-overlay">
        <div class="film-poster">
          ${posterUrl ? `<img src="${posterUrl}" alt="Affiche de ${m.title}">` : ""}
        </div>
        <div class="film-meta">
          <h1>${m.title}</h1>
          ${m.release_date ? `<p><strong>Sortie :</strong> ${new Date(m.release_date).toLocaleDateString("fr-FR")}</p>` : ""}
          ${m.realisator ? `<p><strong>Réalisateur :</strong> ${m.realisator}</p>` : ""}
          ${m.description ? `<p><strong>Description :</strong> ${m.description}</p>` : ""}
        </div>
      </div>
    </section>

    ${m.actors?.length ? `
    <section class="film-actors">
      <h2>Acteurs principaux</h2>
      <ul class="actors-list">
        ${m.actors.map(a => `
          <li class="actor-card">
            <div class="actor-photo">
              <img src="${a.profile_path 
                ? `https://image.tmdb.org/t/p/w185${a.profile_path}` 
                : './src/assets/placeholder.webp'}" 
                alt="${a.full_name}" 
                onerror="this.src='./src/assets/placeholder.webp'">
            </div>
            <p class="actor-name">${a.full_name}</p>
          </li>
        `).join("")}
      </ul>
    </section>
    ` : ""}
  `;
}
