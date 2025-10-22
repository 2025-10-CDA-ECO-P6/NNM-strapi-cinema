import { getArtisteById } from "../api/api_artistes.js";
import { createArtisteCard } from "../ui/artiste_card.js"
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

  // Clear container
  container.innerHTML = "";

  // Création layout 2 colonnes
  const layout = document.createElement("div");
  layout.className = "artiste-detail-layout";

  // Colonne gauche - carte artiste
  const leftCol = document.createElement("div");
  leftCol.className = "artiste-detail-left";

  const artisteCard = createArtisteCard(artiste, false); 
  leftCol.appendChild(artisteCard);

  // Colonne droite - films associés
  const rightCol = document.createElement("div");
  rightCol.className = "artiste-detail-right";

  if (artiste.associated_movies && artiste.associated_movies.length > 0) {
    artiste.associated_movies.forEach((movie) => {
      const filmCard = createFilmCard(movie);
      rightCol.appendChild(filmCard);
    });
  } else {
    rightCol.textContent = "Aucun film associé trouvé.";
  }

  // Ajout des colonnes au layout
  layout.appendChild(leftCol);
  layout.appendChild(rightCol);

  // Ajout du layout au container
  container.appendChild(layout);
}

document.addEventListener("DOMContentLoaded", showArtisteDetails);