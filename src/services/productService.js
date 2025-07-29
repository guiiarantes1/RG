import api from './api';

export const productService = {
    // Buscar cores
    buscarCores: async () => {
        try {
            const response = await api.get('/api/v1/colors/');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar cores:', error);
            throw error;
        }
    },

    // Buscar marcas
    buscarMarcas: async () => {
        try {
            const response = await api.get('/api/v1/brands/');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar marcas:', error);
            throw error;
        }
    },

    // Buscar produtos (para implementação futura)
    buscarProdutos: async () => {
        try {
            const response = await api.get('/api/v1/products/');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            throw error;
        }
    }
}; 