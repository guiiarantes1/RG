// Exemplo de serviço que usa automaticamente o interceptor
import api from './api';

// Exemplo de função que busca dados protegidos
export const getProtectedData = async () => {
  try {
    // O token será automaticamente incluído no header Authorization
    const response = await api.get('/api/v1/protected-endpoint/');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Exemplo de função que envia dados para endpoint protegido
export const createProtectedResource = async (data) => {
  try {
    // O token será automaticamente incluído no header Authorization
    const response = await api.post('/api/v1/protected-endpoint/', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Exemplo de função que atualiza dados em endpoint protegido
export const updateProtectedResource = async (id, data) => {
  try {
    // O token será automaticamente incluído no header Authorization
    const response = await api.put(`/api/v1/protected-endpoint/${id}/`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Exemplo de função que deleta dados de endpoint protegido
export const deleteProtectedResource = async (id) => {
  try {
    // O token será automaticamente incluído no header Authorization
    const response = await api.delete(`/api/v1/protected-endpoint/${id}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}; 