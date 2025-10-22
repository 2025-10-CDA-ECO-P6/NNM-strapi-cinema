// Fonction chercher  films depuis BDD via Strapi
import { getPopularMoviesFromDB } from "../api/api_index.js";

// Importe fonction init carrousel Swiper
import { initSwiper } from "../initswiper.js";


// Attendre que le DOM soit chargé
document.addEventListener("DOMContentLoaded", async () => {
  // Récupère les films dans la base 
  const movies = await getPopularMoviesFromDB();

  // ===  Bloc principal ===
  if (movies && movies.length > 0) {
    // Garder  films avec date de sortie ET img de fond valide
    const validMovies = movies.filter(m => 
      m.release_date &&
      m.background_image && 
      m.background_image.trim() !== ""
    );

    // Trie films du plus récent au plus ancien
    const sorted = validMovies.sort((a, b) => {
      const dateA = new Date(a.release_date);
      const dateB = new Date(b.release_date);
      return dateB - dateA; // plus récent d'abord
    });

    // Garder plus récent avec image valide
    const lastMovie = sorted[0];

    // Récupère la balise <img> du film vedette
    const featured = document.getElementById("featured-movie");
    const featuredLink = document.getElementById("featured-link");

    // Si img du film absente → affiche placeholder
    const imagePath = lastMovie?.background_image
      ? `https://image.tmdb.org/t/p/w1280${lastMovie.background_image}`
      : "./src/assets/placeholder.webp";

      featured.src = imagePath;
      featured.alt = lastMovie?.title || "Image non disponible";

    // Met a jour img et balise alt
    featured.src = imagePath;
    featured.alt = lastMovie?.title || "Image non disponible";

    // IMG CLIQUABLE - lien vers page détail film
    if (featuredLink && lastMovie?.tmdb_id) {
      featuredLink.href = `film.html?id=${lastMovie.tmdb_id}`;
    }

    // Récupère éléments texte bandeau (titre, label, date)
    const overlayTitle = document.querySelector(".featured-title");
    const overlayLabel = document.querySelector(".featured-label");
    const overlayDate = document.querySelector(".featured-date");


    // Remplis titre + texte du bandeau
    if (overlayTitle) overlayTitle.textContent = lastMovie?.title || "Titre inconnu";
    if (overlayLabel) overlayLabel.textContent = "Dernière sortie";

    // Affiche date formatée 
    if (overlayDate && lastMovie?.release_date) {
      const date = new Date(lastMovie.release_date);
      const formatted = date.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      overlayDate.textContent = `Sorti le ${formatted}`;
    }
  }
  // === 2. Création carrousel Swiper ===
  const carouselContainer = document.querySelector(".swiper-wrapper");

// Filtre uniquement les films avec affiche valide
const validMovies = movies.filter(
  (movie) => movie.poster_image && movie.poster_image.trim() !== ""
);

  // Limite 10 films max
  validMovies.slice(1, 10).forEach((movie) => {
    // Pour chaque film → Crée "slide"
    const slide = document.createElement("div");
    slide.classList.add("swiper-slide");

      // Formater  date :
      let formattedDate = "";
      if (movie.release_date) {
        const date = new Date(movie.release_date);
        formattedDate = date.toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }

    // Image + titre du film dans HTML du slide
    const poster = movie.poster_image
      ? `https://image.tmdb.org/t/p/w500${movie.poster_image}`
      : "./src/assets/placeholder.webp";
    slide.innerHTML = `
      <div class="slide-content">
      <a href="film.html?id=${movie.tmdb_id}">
        <img src="${poster}" alt="${movie.title}">
      </a>
        <h3 class="slide-title">
          ${movie.title}
          ${movie.release_date ? `<span class="slide-date"> — Sorti le ${new Date(movie.release_date).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric"
          })}</span>` : ""}
        </h3>
      </div>
    `;

    // Ajoute dans le conteneur du carrousel
    carouselContainer.appendChild(slide);
  });

  // === 3. Initialisation du carrousel Swiper === 
  initSwiper();
});
