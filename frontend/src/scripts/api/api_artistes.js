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
