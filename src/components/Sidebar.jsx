import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Modal from './Modal';
import ChangePassword from './ChangePassword';
import EditingProfile from './EditingProfile';
import { useAuth } from '../hooks/useAuth';
import { logout as logoutService } from '../services/authService';

import '../styles/Sidebar.css';

const SidebarLink = ({ to, label, onClick, iconBoot }) => {
  const location = useLocation();


  const handleClick = () => {
    if (window.innerWidth < 1000 && typeof onClick === 'function') {
      setTimeout(() => {
        onClick();
      }, 300);
    }
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      className={`sidebar-link text-decoration-none p-3 ${location.pathname.includes(to) ? 'active' : ''
        }`}
    >
      {iconBoot && <i className={`bi bi-${iconBoot}`}></i>}
      <span className="hide-on-collapse">{label}</span>
    </Link>
  );
};

const Sidebar = ({ setSideOpen }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalPassword, setShowModalPassword] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleCloseModal = () => setShowModal(false);
  const handleCloseModalPassword = () => setShowModalPassword(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(!isCollapsed));
    if (setSideOpen) {
      setSideOpen(!isCollapsed);
    }
  };

  const handleLogout = async () => {
    try {
      // Chama o serviço de logout para invalidar o refresh token no servidor
      await logoutService();
    } catch (error) {
      console.error('Erro ao fazer logout no servidor:', error);
    } finally {
      // Faz logout local independente do resultado do servidor
      logout();
      navigate('/login');
    }
  };

  // Obtém o nome do usuário para exibir
  const getUserDisplayName = () => {
    console.log('Dados do usuário no Sidebar:', user);
    console.log('user.name:', user?.name);
    console.log('user.username:', user?.username);
    
    if (user?.name) {
      return user.name.split(' ')[0]; // Retorna apenas o primeiro nome
    }
    if (user?.username) {
      return 'Usuário';
    }
    return 'Usuário';
  };

  return (
    <>
      <nav className={`sidebar d-flex flex-column position-fixed ${isCollapsed ? 'collapsed' : ''}`} id="sidebar">
        <button
          className={`btn toggle-sidebar ${isCollapsed ? 'collapsed' : ''}`}
          style={{ background: 'none', fontSize: '28px', alignSelf: 'flex-end', border: 'none', color: 'white' }}
          onClick={toggleSidebar}
        >
          <i className="bi bi-list"></i>
        </button>

        {/* logo */}
        <div className="d-flex px-4 pb-2" style={{ justifyContent: 'center' }}>
          <img src="/src/assets/logo.png" alt="Logo" style={{ width: !isCollapsed ? '50%' : '100%', margin: '0 auto', marginTop: '10px', transition: 'width 0.3s ease-in-out' }} />
        </div>

        {/* perfil */}
        <div className="profile-section mt-2 mb-2 px-3 py-2 dropdown">
          <div
            className="d-flex align-items-center dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ height: '45px', cursor: 'pointer' }}
          >

            <div className="ms-3 profile-info" style={{ width: '100%' }}>
              <h6 className="text-white mb-0" style={{ whiteSpace: 'normal' }}>
                Olá, {getUserDisplayName()}.
              </h6>
            </div>
          </div>

          <ul className="dropdown-menu">

            <li className='dropdown-item' onClick={() => setShowModal(true)} style={{ borderTop: '1px solid #ccdc' }}>
              <span className='edit-profile'>
                <i className="bi bi-pencil-square"></i> Editar perfil
              </span>
            </li>
            <li className='dropdown-item' onClick={() => setShowModalPassword(true)} style={{ borderTop: '1px solid #ccdc' }}>
              <span className="sair" style={{ padding: '0px 5px' }}>
                <i className="bi bi-key"></i> Alterar senha
              </span>
            </li>
            <li className='dropdown-item' onClick={handleLogout} style={{ borderTop: '1px solid #ccdc' }}>
              <span className="sair" style={{ padding: '0px 5px' }}>
                <i className="bi bi-box-arrow-right"></i> Sair
              </span>
            </li>
          </ul>
        </div>

        {/* links */}
        <div className="nav flex-column" style={{ height: '100%' }}>
          <SidebarLink to="/dashboard" iconBoot={'graph-up'} label="Dashboard" onClick={toggleSidebar} />
          <SidebarLink to="/triagem" iconBoot={'clipboard-check'} label="Triagem" onClick={toggleSidebar} />
          <SidebarLink to="/ordens" iconBoot={'list-check'} label="Ordens de serviço" onClick={toggleSidebar} />
          <SidebarLink to="/clientes" iconBoot={'people'} label="Clientes" onClick={toggleSidebar} />
          <SidebarLink to="/funcionarios" iconBoot={'person-lines-fill'} label="Funcionários" onClick={toggleSidebar} />
          
          <div className="mt-auto mb-3" style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
            <span className="version" style=
              {{ color: 'white', fontSize: '12px', textAlign: 'center', cursor: 'default' }} >Roupa de Gala® - 2025</span>
          </div>
        </div>
      </nav>
      {/* modal de edição de perfil */}
      <Modal
        show={showModal}
        onClose={handleCloseModal}
        onCloseX={handleCloseModal}
        title="Editar Perfil"
        bodyContent={<EditingProfile handleCloseModal={handleCloseModal} />}
      />
      {/* modal de alteração de senha */}
      <Modal
        show={showModalPassword}
        onClose={handleCloseModalPassword}
        onCloseX={handleCloseModalPassword}
        title=""
        bodyContent={<ChangePassword handleCloseModalPassword={handleCloseModalPassword} />}
      />
    </>
  );
};

export default Sidebar;
