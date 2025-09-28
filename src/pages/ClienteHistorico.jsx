import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { serviceOrderService } from '../services/serviceOrderService';
import { clientService } from '../services/clientService';
import { capitalizeText } from '../utils/capitalizeText';
import Header from '../components/Header';
import '../styles/ClienteHistorico.css';
import Button from '../components/Button';

const ClienteHistorico = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [serviceOrders, setServiceOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);
    const [error, setError] = useState(null);
    const [expandedOrders, setExpandedOrders] = useState(new Set());

    useEffect(() => {
        if (id) {
            loadClientData();
        }
    }, [id]);

    const loadClientData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Carregar lista de clientes e encontrar o cliente específico
            const clientes = await clientService.listarTodos();
            const clientData = clientes.find(cliente => cliente.id === parseInt(id));

            if (!clientData) {
                throw new Error('Cliente não encontrado');
            }

            setClient(clientData);

            // Carregar histórico de ordens de serviço
            await loadServiceOrders();
        } catch (error) {
            console.error('Erro ao carregar dados do cliente:', error);
            setError('Não foi possível carregar os dados do cliente.');
        } finally {
            setIsLoading(false);
        }
    };

    const loadServiceOrders = async () => {
        setIsLoadingOrders(true);
        try {
            const data = await serviceOrderService.getServiceOrdersByRenter(id);
            setServiceOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Erro ao carregar histórico do cliente:', error);
            setError('Não foi possível carregar o histórico de ordens de serviço.');
        } finally {
            setIsLoadingOrders(false);
        }
    };

    const formatCurrency = (value) => {
        if (!value) return 'R$ 0,00';
        const numericValue = parseFloat(value);
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(numericValue);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR');
        } catch {
            return '-';
        }
    };

    const getStatusColor = (phaseName) => {
        switch (phaseName?.toLowerCase()) {
            case 'triagem':
                return 'status-triagem';
            case 'lavagem':
                return 'status-lavagem';
            case 'costura':
                return 'status-costura';
            case 'finalizado':
                return 'status-finalizado';
            case 'pendente':
                return 'status-pendente';
            default:
                return 'status-default';
        }
    };

    const toggleOrderExpansion = (orderId) => {
        setExpandedOrders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(orderId)) {
                newSet.delete(orderId);
            } else {
                newSet.add(orderId);
            }
            return newSet;
        });
    };

    const handleGoBack = () => {
        navigate('/clientes');
    };

    if (isLoading) {
        return (
            <>
                <Header nomeHeader="Histórico do Cliente" />
                <div className="cliente-historico-container">
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Carregando dados do cliente...</p>
                    </div>
                </div>
            </>
        );
    }

    if (error || !client) {
        return (
            <>
                <Header nomeHeader="Histórico do Cliente" />
                <div className="cliente-historico-container">
                    <div className="error-state">
                        <i className="bi bi-exclamation-triangle"></i>
                        <h3>Erro ao carregar cliente</h3>
                        <p>{error || 'Cliente não encontrado.'}</p>
                        <button
                            className="btn-retry"
                            onClick={loadClientData}
                            disabled={isLoading}
                        >
                            Tentar novamente
                        </button>
                        <button
                            className="btn-back"
                            onClick={handleGoBack}
                        >
                            Voltar para Clientes
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header nomeHeader="Histórico do Cliente" />
            <div className="cliente-historico-container">
                {/* Botão de voltar */}
                <div className="back-button-container">
                    <Button text="Voltar para Clientes" onClick={handleGoBack} iconName="arrow-left" iconPosition="left" />
                </div>

                {/* Informações do cliente */}
                <div className="client-info">
                    <div className="client-header">
                        <div className="client-avatar">
                            {client.name ? client.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div className="client-details">
                            <h2>{capitalizeText(client.name || 'Cliente')}</h2>
                            <p>CPF: {client.cpf || '-'}</p>
                            <p>E-mail: {client.email || '-'}</p>
                            <p>Telefone: {client.phone || '-'}</p>
                        </div>
                    </div>
                </div>

                {/* Histórico de ordens de serviço */}
                <div className="service-orders-section">
                    <div className="section-header">
                        <h3>Histórico de Ordens de Serviço</h3>
                        <button
                            className="btn-refresh"
                            onClick={loadServiceOrders}
                            disabled={isLoadingOrders}
                        >
                            <i className="bi bi-arrow-clockwise"></i>
                            Atualizar
                        </button>
                    </div>

                    {isLoadingOrders ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Carregando histórico...</p>
                        </div>
                    ) : serviceOrders.length === 0 ? (
                        <div className="no-orders">
                            <i className="bi bi-clipboard"></i>
                            <p>Nenhuma ordem de serviço encontrada para este cliente.</p>
                        </div>
                    ) : (
                        <div className="service-orders-list">
                            <div className="orders-summary">
                                <p>Total de ordens: <strong>{serviceOrders.length}</strong></p>
                            </div>
                            <div className="orders-container">
                                {serviceOrders.map((order) => {
                                    const isExpanded = expandedOrders.has(order.id);

                                    return (
                                        <div key={order.id} className="service-order-card">
                                            {/* Cabeçalho sempre visível - clicável para expandir/colapsar */}
                                            <div
                                                className="order-header collapsible-header"
                                                onClick={() => toggleOrderExpansion(order.id)}
                                            >
                                                <div className="order-id">
                                                    <strong>Ordem #{order.id}</strong>
                                                    <span className={`status-badge ${getStatusColor(order.phase_name)}`}>
                                                        {capitalizeText(order.phase_name || 'Não definido')}
                                                    </span>
                                                </div>
                                                <div className="order-header-right">
                                                    <div className="order-value">
                                                        {formatCurrency(order.total_value)}
                                                    </div>
                                                    <div className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
                                                        <i className="bi bi-chevron-down"></i>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Detalhes básicos sempre visíveis */}
                                            <div className="order-details d-flex flex-row flex-wrap gap-2">
                                                <div className="detail-row">
                                                    <span className="label">Evento:</span>
                                                    <span className="value">{capitalizeText(order.event_name || '-')}</span>
                                                </div>
                                                <div className="detail-row">
                                                    <span className="label">Data do Evento:</span>
                                                    <span className="value">{formatDate(order.event_date)}</span>
                                                </div>
                                                <div className="detail-row">
                                                    <span className="label">Data da Ordem:</span>
                                                    <span className="value">{formatDate(order.order_date)}</span>
                                                </div>
                                                <div className="detail-row">
                                                    <span className="label">Funcionário:</span>
                                                    <span className="value">{capitalizeText(order.employee_name || '-')}</span>
                                                </div>
                                                <div className="detail-row">
                                                    <span className="label">Atendente:</span>
                                                    <span className="value">{capitalizeText(order.attendant_name || '-')}</span>
                                                </div>
                                            </div>

                                            {/* Conteúdo expandível */}
                                            <div className={`collapsible-content ${isExpanded ? 'expanded' : ''}`}>
                                                <div className="payment-info">
                                                    <div className="payment-row">
                                                        <span className="label">Valor Total:</span>
                                                        <span className="value total">{formatCurrency(order.total_value)}</span>
                                                    </div>
                                                    <div className="payment-row">
                                                        <span className="label">Pagamento Antecipado:</span>
                                                        <span className="value advance">{formatCurrency(order.advance_payment)}</span>
                                                    </div>
                                                    <div className="payment-row">
                                                        <span className="label">Pagamento Restante:</span>
                                                        <span className="value remaining">{formatCurrency(order.remaining_payment)}</span>
                                                    </div>
                                                </div>

                                                <div className="dates-info">
                                                    <div className="dates-row">
                                                        <div className="date-item">
                                                            <span className="label">Prova:</span>
                                                            <span className="value">{formatDate(order.prova_date)}</span>
                                                        </div>
                                                        <div className="date-item">
                                                            <span className="label">Retirada:</span>
                                                            <span className="value">{formatDate(order.retirada_date)}</span>
                                                        </div>
                                                        <div className="date-item">
                                                            <span className="label">Devolução:</span>
                                                            <span className="value">{formatDate(order.devolucao_date)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {order.justificativa_atraso && (
                                                    <div className="delay-justification">
                                                        <span className="label">Justificativa de Atraso:</span>
                                                        <p className="value">{order.justificativa_atraso}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ClienteHistorico;
