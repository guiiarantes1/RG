import api from './api';

export const triagemService = {
    // Criar nova triagem
    criarTriagem: async (dadosTriagem) => {
        try {
            const response = await api.post('/api/v1/service-orders/pre-triage/', dadosTriagem);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Buscar triagens (opcional para futuras implementações)
    buscarTriagens: async (params = {}) => {
        try {
            const response = await api.get('/api/v1/service-orders/pre-triage/', { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Buscar triagem por ID (opcional para futuras implementações)
    buscarTriagemPorId: async (id) => {
        try {
            const response = await api.get(`/api/v1/service-orders/pre-triage/${id}/`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}; 