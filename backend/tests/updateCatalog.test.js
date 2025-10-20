// ✅ Import du module path pour construire les chemins de fichiers de manière sûre
const path = require('path');

/**
 * 🧩 On "mock" (simule) le module axios avant de l'importer.
 * Cela permet d'éviter les appels réseau réels pendant les tests.
 * Jest remplacera axios par une version contrôlée où l'on peut définir
 * ce que retourne axios.get().
 */
jest.mock('axios', () => ({
  get: jest.fn(), // on crée une fausse fonction axios.get
}));

// Maintenant qu'il est mocké, on peut l'importer sans risque
const axios = require('axios');

/**
 * 🧠 On importe la fonction à tester : updateCatalog
 * Elle se trouve dans le dossier backend/scripts/updateCatalog.js
 */
const { updateCatalog } = require(path.resolve(__dirname, '../scripts/updateCatalog.js'));

/**
 * 🧪 Suite de tests pour la fonction updateCatalog
 * On va tester les trois comportements principaux :
 * 1️⃣ Ajouter un film absent
 * 2️⃣ Ignorer un film déjà existant
 * 3️⃣ Gérer proprement une erreur API
 */
describe('🧪 Test du script updateCatalog', () => {
  let mockStrapi;

  /**
   * 🔁 Avant chaque test, on recrée une version "mockée" de Strapi
   * afin d’éviter les interférences entre les tests.
   */
  beforeEach(() => {
    mockStrapi = {
      db: {
        query: jest.fn().mockReturnValue({
          findOne: jest.fn(), // simulation de la recherche dans la base
          create: jest.fn(),  // simulation de la création d’un film
        }),
      },
    };

    jest.clearAllMocks(); // remet à zéro tous les mocks entre les tests
  });

  /**
   * ✅ TEST 1 — Ajoute un film si absent
   * On simule une réponse d’API contenant un film,
   * et on fait croire à Strapi que ce film n’existe pas encore.
   * Résultat attendu : le film doit être ajouté (appel à create()).
   */
  it('✅ Ajoute un film si absent', async () => {
    axios.get.mockResolvedValue({
      data: { results: [{ id: 1, title: 'Inception', overview: 'Dreams', release_date: '2010-07-16' }] },
    });

    mockStrapi.db.query().findOne.mockResolvedValue(null); // film non trouvé

    await updateCatalog(mockStrapi);

    // On vérifie que Strapi a bien essayé de créer un nouveau film
    expect(mockStrapi.db.query().create).toHaveBeenCalledTimes(1);
  });

  /**
   * ⚠️ TEST 2 — Ignore un film déjà présent
   * On simule une réponse d’API contenant un film,
   * mais cette fois, on fait croire que Strapi l’a déjà dans la base.
   * Résultat attendu : le film ne doit PAS être recréé.
   */
  it('⚠️ Ignore un film déjà présent', async () => {
    axios.get.mockResolvedValue({
      data: { results: [{ id: 2, title: 'Matrix', overview: 'Neo', release_date: '1999-03-31' }] },
    });

    mockStrapi.db.query().findOne.mockResolvedValue({ id: 2 }); // déjà existant

    await updateCatalog(mockStrapi);

    // Aucune création ne doit avoir lieu
    expect(mockStrapi.db.query().create).not.toHaveBeenCalled();
  });

  /**
   * ❌ TEST 3 — Gère une erreur API proprement
   * On simule une erreur réseau avec axios.get.
   * Résultat attendu : updateCatalog doit lever une exception.
   */
  it('❌ Gère une erreur API proprement', async () => {
    axios.get.mockRejectedValue(new Error('Erreur réseau')); // simulateur d’échec d’appel API

    // On vérifie que la fonction "rejette" bien une erreur
    await expect(updateCatalog(mockStrapi)).rejects.toThrow('Erreur réseau');
  });
});

