import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await dashboardService.getDashboardData();
      console.log('📊 Resposta completa da API:', response);
      console.log('📊 Dados do dashboard:', response.data);
      
      // Verificar se a resposta tem a estrutura esperada
      if (response && response.data) {
        setDashboardData(response.data);
      } else {
        console.warn('⚠️ Resposta da API não tem a estrutura esperada:', response);
        setDashboardData(response || {});
      }
    } catch (err) {
      console.error('❌ Erro no hook useDashboard:', err);
      setError(err.message || 'Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const refetch = () => {
    fetchDashboardData();
  };

  return {
    dashboardData,
    loading,
    error,
    refetch
  };
};

export default useDashboard; 