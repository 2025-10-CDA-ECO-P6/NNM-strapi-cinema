export function createArtisteCard(artiste, isLink = false) {
  const card = document.createElement("div");
  card.className = "artiste-card";

  const container = isLink ? document.createElement("a") : document.createElement("div");
  container.className = isLink ? "artiste-link" : "artiste-container";
  if (isLink) container.href = `artiste-details.html?id=${artiste.tmdb_actor_id}`;

  const img = document.createElement("img");

  img.src = `https://image.tmdb.org/t/p/w1280${artiste.profile_path}`;
  img.alt = artiste.full_name || "Photo de l'artiste";

  const name = document.createElement("h3");
  name.textContent = artiste.full_name || "Nom inconnu";

  container.appendChild(img);
  container.appendChild(name);
  card.appendChild(container);

  return card;
}
