const path = require('path');
const { updateCatalog } = require(path.resolve(__dirname, '../scripts/updateCatalog.js'));



jest.mock('axios');

describe('🧪 Test du script updateCatalog', () => {
  let mockStrapi;

  beforeEach(() => {
    mockStrapi = {
      db: {
        query: jest.fn().mockReturnValue({
          findOne: jest.fn(),
          create: jest.fn(),
        }),
      },
    };
    jest.clearAllMocks();
  });

  it('✅ Ajoute un film si absent', async () => {
    axios.get.mockResolvedValue({
      data: { results: [{ id: 1, title: 'Inception', overview: 'Dreams', release_date: '2010-07-16' }] },
    });
    mockStrapi.db.query().findOne.mockResolvedValue(null);

    await updateCatalog(mockStrapi);

    expect(mockStrapi.db.query().create).toHaveBeenCalledTimes(1);
  });

  it('⚠️ Ignore un film déjà présent', async () => {
    axios.get.mockResolvedValue({
      data: { results: [{ id: 2, title: 'Matrix', overview: 'Neo', release_date: '1999-03-31' }] },
    });
    mockStrapi.db.query().findOne.mockResolvedValue({ id: 2 });

    await updateCatalog(mockStrapi);

    expect(mockStrapi.db.query().create).not.toHaveBeenCalled();
  });

  it('❌ Gère une erreur API proprement', async () => {
    axios.get.mockRejectedValue(new Error('Erreur réseau'));

    await expect(updateCatalog(mockStrapi)).rejects.toThrow('Erreur réseau');
  });
});
