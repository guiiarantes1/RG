import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Sempre redireciona para login sem parâmetros
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 