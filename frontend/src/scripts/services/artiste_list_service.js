import { getArtistes } from "../api/api_artistes.js";
import { createArtisteCard } from "../ui/artiste_card.js";

async function showArtistesList() {
  const artistes = await getArtistes();
  const artistesListe = document.getElementById("artiste-list");

  if (!artistes.length) {
    artistesListe.innerHTML = "<li>Aucun artiste trouvé</li>";
    return;
  }

  artistesListe.innerHTML = "";

  artistes.forEach((artiste) => {
    const card = createArtisteCard(artiste, true);

    const li = document.createElement("li");
    li.appendChild(card);

    artistesListe.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", showArtistesList);
