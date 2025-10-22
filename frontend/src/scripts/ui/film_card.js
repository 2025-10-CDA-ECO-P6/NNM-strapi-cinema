export function createFilmCard(movie, isLink = true) {
  const card = document.createElement("div");
  card.className = "film-card";

  const container = isLink ? document.createElement("a") : document.createElement("div");
  container.className = isLink ? "artiste-link" : "artiste-container";
  if (isLink) container.href = `film.html?id=${movie.id}`;

  const img = document.createElement("img");
  img.src = movie.poster_image || "./src/assets/placeholder.webp";
  img.alt = movie.title || "Affiche du film";
  img.style.width = "100%";
  img.style.borderRadius = "6px";
  card.appendChild(img);

  const title = document.createElement("h4");
  title.textContent = movie.title || "Titre inconnu";
  title.className = "small-title";
  card.appendChild(title);

  const releaseDate = document.createElement("p");
  releaseDate.textContent = `Date de sortie : ${movie.release_date || "N/A"}`;
  card.appendChild(releaseDate);

  container.appendChild(card);
  return container;
}
