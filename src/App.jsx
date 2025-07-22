import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Login from './pages/Login'
import Home from './pages/Home'
import Funcionarios from './pages/Funcionarios'
import Sidebar from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'
import { useTheme } from './hooks/useTheme'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { setSidebarState } from './store/slices/sidebarSlice'
import { useAuth } from './hooks/useAuth'
import 'react-phone-number-input/style.css';
import './App.css'
import Triagem from './pages/Triagem'
import OrdemServico from './pages/OrdemServico'

function AppContent() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const isSidebarCollapsed = useSelector((state) => state.sidebar.isSidebarCollapsed);
  const location = useLocation();
  
  // Verifica se está na rota de login
  const isLoginPage = location.pathname === '/login';

  useEffect(() => {
    // Se estiver autenticado e na rota raiz, redireciona para dashboard
    if (isAuthenticated && location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [location.pathname, isAuthenticated, navigate]);

  return (
    <div className="App">
      {!isLoginPage && <Sidebar setSideOpen={(c) => dispatch(setSidebarState(c))} />}
      <main className={`main-content ${isSidebarCollapsed && !isLoginPage ? 'collapsed' : ''} ${isLoginPage ? 'no-sidebar' : ''}`} id='main'>
        <Routes>
          {/* Rota raiz - redireciona para dashboard se autenticado, senão para login */}
          <Route path="/" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          } />
          
          {/* Rota de login - se já estiver autenticado, redireciona para dashboard */}
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          } />
          
          {/* Rotas protegidas */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          
          <Route path="/funcionarios" element={
            <ProtectedRoute>
              <Funcionarios />
            </ProtectedRoute>
          } />
          
          <Route path="/triagem" element={
            <ProtectedRoute>
              <Triagem />
            </ProtectedRoute>
          } />
          
          <Route path="/ordens" element={
            <ProtectedRoute>
              <OrdemServico />
            </ProtectedRoute>
          } />
          
          {/* Rota para qualquer caminho não encontrado */}
          <Route path="*" element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
