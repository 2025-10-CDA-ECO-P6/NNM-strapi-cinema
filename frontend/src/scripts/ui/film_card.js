export function createFilmCard(movie) {
  const card = document.createElement("div");
  card.className = "film-card";

  const title = document.createElement("h4");
  title.textContent = movie.title || "Titre inconnu";
  card.appendChild(title);

  const releaseDate = document.createElement("p");
  releaseDate.textContent = `Date de sortie : ${movie.release_date || "N/A"}`;
  card.appendChild(releaseDate);

  const img = document.createElement("img");
  img.src = movie.poster_image || "./src/assets/placeholder.webp";
  img.alt = movie.title || "Affiche du film";
  img.style.width = "100%";
  img.style.borderRadius = "6px";
  card.appendChild(img);

  return card;
}
