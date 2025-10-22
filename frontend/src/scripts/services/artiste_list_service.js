import { getArtistes } from "../api/api_artistes.js";
import { createArtisteCard } from "../ui/artiste_card.js";

async function showArtistesList() {
  const artistes = await getArtistes();
  const artistesListe = document.getElementById("list-acteurs");

  artistesListe.innerHTML = "";

  if (!artistes.length) {
    artistesListe.innerHTML = "<li>Aucun artiste trouvé</li>";
    return;
  }

  artistes.forEach((artiste) => {
    const card = createArtisteCard(artiste);
    artistesListe.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", showArtistesList);