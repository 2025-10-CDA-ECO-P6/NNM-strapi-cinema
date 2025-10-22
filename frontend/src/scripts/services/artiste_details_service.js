import { getArtisteById } from "../api/api_artistes.js";
import { createArtisteCard } from "../ui/artiste_card.js";
import { createFilmCard } from "../ui/film_card.js";

async function showArtisteDetails() {
  const params = new URLSearchParams(globalThis.location.search);
  const id = params.get("id");

  if (!id) {
    document.getElementById("artiste-detail").textContent = "Aucun ID fourni dans l'URL.";
    return;
  }

  const artiste = await getArtisteById(id);
  const container = document.getElementById("artiste-detail-section");

  if (!artiste) {
    container.textContent = "Artiste non trouvé.";
    return;
  }

  container.innerHTML = "";

  const layout = document.createElement("div");
  layout.className = "artiste-detail-layout";

  const leftCol = document.createElement("div");
  leftCol.className = "artiste-detail-left";

  const rightCol = document.createElement("div");
  rightCol.className = "artiste-detail-right";

  const artisteFilmsTitle = document.createElement("h1");
  artisteFilmsTitle.className = "artist-film-title featured-label";
  artisteFilmsTitle.textContent = "Films Associés";

  const artisteTitle = document.createElement("h1");
  artisteTitle.className = "artist-title featured-label";
  artisteTitle.textContent = "L'Artiste";

  rightCol.appendChild(artisteFilmsTitle);
  leftCol.appendChild(artisteTitle);

  const artisteCard = createArtisteCard(artiste, false);
  leftCol.appendChild(artisteCard);

  if (artiste.associated_movies && artiste.associated_movies.length > 0) {
    artiste.associated_movies.forEach((movie) => {
      const filmCard = createFilmCard(movie);
      rightCol.appendChild(filmCard);
    });
  } else {
    rightCol.textContent = "Aucun film associé trouvé.";
  }

  layout.appendChild(leftCol);
  layout.appendChild(rightCol);

  container.appendChild(layout);
}

document.addEventListener("DOMContentLoaded", showArtisteDetails);
