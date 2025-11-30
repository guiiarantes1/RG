import api from './api';

/**
 * Serviço financeiro - funções para consumo pelo frontend.
 * Observação: ajuste conforme sua API.
 */

/**
 * Busca o resumo financeiro consolidado para as ordens de serviço.
 * Endpoint acordado: GET /api/v1/service-orders/finance/
 * Query params aceitos: start_date e end_date (YYYY-MM-DD).
 */
export async function getFinanceSummary(params = {}) {
  const resp = await api.get(`/api/v1/service-orders/finance/`, { params });
  return resp.data;
}

/**
 * Ação de "fechar caixa" — registra um fechamento de caixa no backend.
 */
export async function postCloseCash(payload) {
  const resp = await api.post(`/api/v1/finance/close-cash`, payload);
  return resp.data;
}

export default {
  getFinanceSummary,
  postCloseCash,
};

