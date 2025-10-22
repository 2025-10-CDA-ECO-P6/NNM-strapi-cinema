import { getArtisteById } from "../api/api_artistes.js";
import { createFilmCard } from "../ui/film_card.js";


function createArtisteInfo(artiste) {
  const artisteBlock = document.createElement("div");
  artisteBlock.className = "artiste-info";

  const img = document.createElement("img");
  img.src = artiste.profile_path
    ? `https://image.tmdb.org/t/p/w300${artiste.profile_path}`
    : "./src/assets/placeholder.webp";
  img.alt = artiste.full_name || "Artiste inconnu";

  const name = document.createElement("h2");
  name.textContent = artiste.full_name || "Nom inconnu";

  const bio = document.createElement("p");
  bio.textContent = artiste.biography || "Biographie non disponible.";

  artisteBlock.append(img, name, bio);
  return artisteBlock;
}

function createFilmsSection(associated_movies) {
  const section = document.createElement("div");
  section.className = "artist-films-section";

  const title = document.createElement("h1");
  title.textContent = "Films Associés";
  title.className = "artist-film-title";
  section.appendChild(title);

  const grid = document.createElement("div");
  grid.className = "artist-films-grid";

  if (associated_movies?.length) {
    associated_movies.forEach((movie) => {
      grid.appendChild(createFilmCard(movie));
    });
  } else {
    const noMovies = document.createElement("p");
    noMovies.textContent = "Aucun film associé trouvé.";
    grid.appendChild(noMovies);
  }

  section.appendChild(grid);
  return section;
}


function createArtisteLayout(artiste) {
  const layout = document.createElement("div");
  layout.className = "artiste-detail-layout";

  const leftCol = document.createElement("div");
  leftCol.className = "artiste-detail-left";

  const rightCol = document.createElement("div");
  rightCol.className = "artiste-detail-right";

  const artisteTitle = document.createElement("h1");
  artisteTitle.textContent = "L'Artiste";
  artisteTitle.className = "artist-title";

  const artisteBlock = createArtisteInfo(artiste);
  leftCol.append(artisteTitle, artisteBlock);

  const filmsSection = createFilmsSection(artiste.associated_movies);
  rightCol.appendChild(filmsSection);

  layout.append(leftCol, rightCol);
  return layout;
}


export async function showArtisteDetails() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const container = document.getElementById("artiste-detail-section");

  if (!id) {
    container.textContent = "Aucun ID fourni dans l'URL.";
    return;
  }

  const artiste = await getArtisteById(id);
  if (!artiste) {
    container.textContent = "Artiste non trouvé.";
    return;
  }

  container.innerHTML = "";
  const layout = createArtisteLayout(artiste);
  container.appendChild(layout);
}

document.addEventListener("DOMContentLoaded", showArtisteDetails);