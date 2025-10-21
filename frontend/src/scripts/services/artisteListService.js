import { getArtistes } from "../api/api_artistes.js";

async function showArtistesList() {
  const artistes = await getArtistes();
  const artistesListe = document.getElementById("artiste-list");

  if (!artistes.length) {
    artistesListe.innerHTML = "<li>Aucun artiste trouvé</li>";
    return;
  }

  artistesListe.innerHTML = "";

  artistes.forEach((artiste) => {
    const li = document.createElement("li");
    li.className = "artiste-card";

    const img = document.createElement("img");
    img.src = "./src/assets/placeholder.webp";
    img.alt = artiste.full_name || "Photo de l'artiste";

    const name = document.createElement("h3");
    name.textContent = artiste.full_name || "Nom inconnu";

    li.appendChild(img);
    li.appendChild(name);

    artistesListe.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", showArtistesList);
