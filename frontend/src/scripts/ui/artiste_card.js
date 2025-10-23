export function createArtisteCard(artiste) {
  const li = document.createElement("li");
  li.className = "actor-card";

  const a = document.createElement("a");
  a.href = `artiste-details.html?id=${artiste.id}`;

  const img = document.createElement("img");
  img.src = artiste.profile_path
    ? `https://image.tmdb.org/t/p/w1280${artiste.profile_path}`
    : "./src/assets/placeholder.webp";
  img.alt = artiste.full_name || "Photo de l'artiste";

  const name = document.createElement("h3");
  name.textContent = artiste.full_name || "Nom inconnu";

  a.appendChild(img);
  a.appendChild(name);
  li.appendChild(a);

  return li;
}
