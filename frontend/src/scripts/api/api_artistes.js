import { API_BASE_URL } from "../../../config.js";

export async function getArtistes() {
  const url = `${API_BASE_URL}/api/tmdb/api_actor`;

  try {
    const respons = await fetch(url);

    if (!respons.ok) throw new Error(`API Error: ${respons.status}`);

    const result = await respons.json();
    return result;
  } catch (error) {
    console.error(`Error while loadind Artistes :`, error);
    return [];
  }
}

export async function getArtisteById(id) {
  const url = `${API_BASE_URL}/api/tmdb/api_actor/${id}`;

  try {
    const response = await fetch(url);

    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Error while loading Artiste by ID:`, error);
    return null;
  }
}