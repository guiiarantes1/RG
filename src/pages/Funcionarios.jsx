import React, { useState, useEffect } from 'react';
import { mascaraCPF, mascaraTelefone, removerMascara } from '../utils/Mascaras';
import { capitalizeText } from '../utils/capitalizeText';
import PhoneInput from 'react-phone-number-input';
import ptBR from 'react-phone-number-input/locale/pt-BR';
import Swal from 'sweetalert2';
import '../styles/Funcionarios.css';
import Header from '../components/Header';
import Button from '../components/Button';
import { registerEmployee, getEmployees, updateEmployee } from '../services/employeeService';

const Funcionarios = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    phone: '',
    email: '',
    role: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Carregar dados da API
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const data = await getEmployees();
      setFuncionarios(data);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao carregar funcionários',
        text: 'Não foi possível carregar a lista de funcionários.',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    // Aplicar máscaras conforme o campo
    if (name === 'cpf') {
      formattedValue = mascaraCPF(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handlePhoneChange = (value) => {
    setFormData(prev => ({
      ...prev,
      phone: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.name || !formData.cpf || !formData.phone || !formData.email || !formData.role) {
      Swal.fire({
        icon: 'error',
        title: 'Campos obrigatórios',
        text: 'Por favor, preencha todos os campos obrigatórios.',
        confirmButtonColor: '#ef4444'
      });
      return;
    }
    
    try {
      if (editingId) {
        // Editar funcionário existente
        await updateEmployee(editingId, formData);
        setEditingId(null);
        
        Swal.fire({
          icon: 'success',
          title: 'Funcionário atualizado!',
          text: 'Os dados do funcionário foram atualizados com sucesso.',
          confirmButtonColor: '#10b981'
        });
      } else {
        // Adicionar novo funcionário
        await registerEmployee(formData);
        
        Swal.fire({
          icon: 'success',
          title: 'Funcionário cadastrado!',
          text: 'O funcionário foi cadastrado com sucesso.',
          confirmButtonColor: '#10b981'
        });
      }
      
      // Recarregar lista de funcionários
      await loadEmployees();
      
      // Limpar formulário
      setFormData({
        name: '',
        cpf: '',
        phone: '',
        email: '',
        role: ''
      });
    } catch (error) {
      console.error('Erro ao salvar funcionário:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao salvar funcionário',
        text: error.message || 'Ocorreu um erro ao salvar o funcionário.',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const handleEdit = (funcionario) => {
    window.scrollTo(0, 0);
    setFormData(funcionario);
    setEditingId(funcionario.id);
  };

  

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      cpf: '',
      phone: '',
      email: '',
      role: ''
    });
  };

  const filteredFuncionarios = funcionarios.filter(funcionario =>
    funcionario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCargoColor = (role) => {
    switch (role) {
      case 'ADMINISTRADOR':
        return '#ef4444';
      case 'ATENDENTE':
        return '#3b82f6';
      case 'RECEPÇÃO':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  return (
    <>
    <Header nomeHeader={'Funcionários'} />
    <div className="funcionarios-container">

      {/* Formulário de Cadastro */}
      <div className="form-section mb-4" style={{ backgroundColor: 'var(--color-bg-card)' }}>
        <h2 style={{ fontSize: '18px' }}>{editingId ? 'Editar Funcionário' : 'Cadastrar Novo Funcionário'}</h2>
        <form onSubmit={handleSubmit} className="funcionario-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Nome Completo *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={capitalizeText(formData.name)}
                onChange={handleInputChange}
                required
                placeholder="Digite o nome completo"
                style={{ height: '35px' }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="cpf">CPF *</label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={mascaraCPF(removerMascara(formData.cpf))}
                onChange={handleInputChange}
                required
                placeholder="000.000.000-00"
                style={{ height: '35px' }}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="telefone">Telefone *</label>
              <PhoneInput
                international
                defaultCountry="BR"
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="(00) 00000-0000"
                labels={ptBR}
                className="phone-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">E-mail *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="email@exemplo.com"
                style={{ height: '35px' }}
              />
            </div>
          </div>

          <div className="form-row mb-0">
            <div className="form-group">
              <label htmlFor="cargo">Cargo *</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                style={{ height: '35px' }}
              >
                <option value="">Selecione um cargo</option>
                <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                <option value="ATENDENTE">ATENDENTE</option>
                <option value="RECEPÇÃO">RECEPÇÃO</option>
              </select>
            </div>
            <div className="form-group"></div>
          </div>

  
            <Button text={editingId ? 'Atualizar' : 'Cadastrar'} type="submit" variant="primary" style={{ width: 'fit-content', marginLeft: 'auto' }} />
            {editingId && (
              <Button text="Cancelar" type="button" variant="secondary" onClick={handleCancelEdit} style={{ width: 'fit-content', marginLeft: 'auto' }} />
            )}
        </form>
      </div>

      {/* Listagem de Funcionários */}
      <div className="list-section">
        <div className="list-header">
          <h2 style={{ fontSize: '18px' }}>Funcionários Cadastrados</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar funcionários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <i className="bi bi-search search-icon"></i>
          </div>
        </div>

        <div className="funcionarios-grid">
          {filteredFuncionarios.length === 0 ? (
            <div className="no-results">
              <i className="bi bi-people"></i>
              <p>Nenhum funcionário encontrado</p>
            </div>
          ) : (
            filteredFuncionarios.map(funcionario => (
              <div key={funcionario.id} className="funcionario-card">
                <div className="funcionario-header">
                  <div className="funcionario-avatar">
                    <i className="bi bi-person-circle"></i>
                  </div>
                  <div className="funcionario-info">
                    <h3>{capitalizeText(funcionario.name)}</h3>
                    <span 
                      className="cargo-badge"
                      style={{ backgroundColor: getCargoColor(funcionario.role) }}
                    >
                      {funcionario.role}
                    </span>
                  </div>
                  <div className="funcionario-actions">
                    <button
                      onClick={() => handleEdit(funcionario)}
                      className="btn-edit"
                      title="Editar"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn-delete"
                      title="Excluir"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
                
                <div className="funcionario-details">
                  <div className="detail-item">
                    <i className="bi bi-person"></i>
                    <span>{mascaraCPF(removerMascara(funcionario.cpf))}</span>
                  </div>
                  <div className="detail-item">
                    <i className="bi bi-telephone"></i>
                    <span>{funcionario.phone ? funcionario.phone.replace('+55', '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3') : ''}</span>
                  </div>
                  <div className="detail-item">
                    <i className="bi bi-envelope"></i>
                    <span>{funcionario.email}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Funcionarios; 