export function createFilmCard(movie, isLink = true) {
  const card = document.createElement("div");
  card.className = "film-card";

  const container = isLink ? document.createElement("a") : document.createElement("div");
  container.className = isLink ? "artiste-link" : "artiste-container";
  if (isLink) container.href = `film.html?id=${movie.tmdb_id}`;

  const img = document.createElement("img");

  if (movie.poster_image) {
    img.src = `https://image.tmdb.org/t/p/w1280${movie.poster_image}`;
  } else {
    img.src = "./src/assets/placeholder.webp";
  }

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
