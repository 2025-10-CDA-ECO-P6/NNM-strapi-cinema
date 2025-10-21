import { searchAll } from "../api/api_search.js";

const params = new URLSearchParams(window.location.search);
const query = params.get("q");
const titleEl = document.querySelector("#search-query");
const filmsList = document.querySelector("#list-films");
const acteursList = document.querySelector("#list-acteurs");
const countFilms = document.querySelector("#count-films");
const countActeurs = document.querySelector("#count-acteurs");

if (query) {
  titleEl.textContent = `Résultats pour “${query}”`;
  loadResults(query);
}

async function loadResults(q) {
  const { movies, actors } = await searchAll(q);

  renderList(filmsList, movies, "Aucun film trouvé.", (m) => `
    <li class="card">
      ${m.poster_image ? `<img src="${m.poster_image}" alt="${m.title}">` : ""}
      <h3>${m.title}</h3>
      ${m.realisator ? `<p>${m.realisator}</p>` : ""}
    </li>
  `);

  renderList(acteursList, actors, "Aucun artiste trouvé.", (a) => `
    <li class="card">
      ${a.profile_path ? `<img src="${a.profile_path}" alt="${a.name} ${a.last_name || ""}">` : ""}
      <h3>${a.name} ${a.last_name || ""}</h3>
    </li>
  `);

  countFilms.textContent = `${movies.length} film(s)`;
  countActeurs.textContent = `${actors.length} artiste(s)`;
}

function renderList(container, items, emptyText, templateFn) {
  if (!items || items.length === 0) {
    container.innerHTML = `<p>${emptyText}</p>`;
    return;
  }
  container.innerHTML = items.map(templateFn).join("");
}
