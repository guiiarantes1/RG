import api from './api';

/**
 * Service para operações relacionadas a Marcas (Brands)
 */
const brandService = {
  /**
   * Lista marcas com paginação
   * @param {number} pageIndex - Índice da página (começa em 0)
   * @param {number} pageSize - Tamanho da página
   * @returns {Promise<{count: number, next: string|null, previous: string|null, results: Array<{id: number, description: string}>}>}
   */
  async getBrands(pageIndex = 0, pageSize = 10, search = '') {
    const page = pageIndex + 1; // API espera página começando em 1
    let url = `/api/v1/brands/?page=${page}&page_size=${pageSize}`;
    if (search && search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    const response = await api.get(url);
    return response.data;
  },
};

export default brandService;
