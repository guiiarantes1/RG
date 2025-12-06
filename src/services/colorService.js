import api from './api';

/**
 * Service para operações relacionadas a Cores (Color Catalogues)
 */
const colorService = {
  /**
   * Lista cores com paginação
   * @param {number} pageIndex - Índice da página (começa em 0)
   * @param {number} pageSize - Tamanho da página
   * @param {string} search - Termo de busca
   * @returns {Promise<{count: number, next: string|null, previous: string|null, results: Array<{id: number, description: string}>}>}
   */
  async getColors(pageIndex = 0, pageSize = 10, search = '') {
    const page = pageIndex + 1; // API espera página começando em 1
    let url = `/api/v1/color-catalogues/?page=${page}&page_size=${pageSize}`;
    if (search && search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    const response = await api.get(url);
    return response.data;
  },

  /**
   * Cria uma nova cor
   * @param {string} description - Descrição da cor
   * @returns {Promise<{id: number, description: string}>}
   */
  async createColor(description) {
    const response = await api.post('/api/v1/color-catalogues/', { description });
    return response.data;
  },

  /**
   * Atualiza uma cor existente
   * @param {number} id - ID da cor
   * @param {string} description - Nova descrição da cor
   * @returns {Promise<{id: number, description: string}>}
   */
  async updateColor(id, description) {
    const response = await api.patch(`/api/v1/color-catalogues/${id}/`, { description });
    return response.data;
  },

  /**
   * Deleta uma cor
   * @param {number} id - ID da cor
   * @returns {Promise<void>}
   */
  async deleteColor(id) {
    await api.delete(`/api/v1/color-catalogues/${id}/`);
  },
};

export default colorService;
