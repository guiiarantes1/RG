import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '@mui/material';
import '../styles/Eventos.css';
import Header from '../components/Header';
import eventService from '../services/eventService';
import { capitalizeText } from '../utils/capitalizeText';
import Button from '../components/Button';
import CreateEventModal from '../components/CreateEventModal';

const Eventos = () => {
    const [eventos, setEventos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const navigate = useNavigate();
    
    // Estados de paginação
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(50);
    const [totalCount, setTotalCount] = useState(0);

    const loadEventos = useCallback(async (page = 1, search = '') => {
        setIsLoading(true);
        setError(null);
        try {
            const params = {
                page,
                page_size: pageSize,
            };
            if (search.trim()) {
                params.search = search.trim();
            }
            
            const data = await eventService.listarEventosAbertos(params);
            
            // Verifica se a resposta é paginada
            if (data && typeof data === 'object' && Array.isArray(data.events)) {
                setEventos(data.events);
                setCurrentPage(data.page || page);
                setTotalPages(data.total_pages || 1);
                setTotalCount(data.count || 0);
            } else {
                // Compatibilidade: se retornou array simples
                setEventos(Array.isArray(data) ? data : []);
                setCurrentPage(1);
                setTotalPages(1);
                setTotalCount(Array.isArray(data) ? data.length : 0);
            }
        } catch (error) {
            console.error('Erro ao carregar eventos:', error);
            setError('Não foi possível carregar a lista de eventos. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    }, [pageSize]);

    // Carregar eventos na montagem do componente
    useEffect(() => {
        loadEventos(1, '');
    }, [loadEventos]);

    const handleEventoClick = (eventoId) => {
        navigate(`/eventos/${eventoId}`);
    };

    const handleCreateEvent = () => {
        setShowCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
    };

    const handleEventCreated = () => {
        // Recarregar a lista de eventos após criar um novo
        setCurrentPage(1);
        loadEventos(1, searchTerm);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatEventDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatServiceOrdersCount = (count) => {
        if (!count || count === 0) return 'Nenhuma ordem de serviço';
        if (count === 1) return '1 ordem de serviço';
        return `${count} ordens de serviço`;
    };

    const formatStatus = (status) => {
        if (!status) return 'Status não definido';

        // Mapear status do backend para classes CSS
        const statusMap = {
            'SEM DATA': 'sem-data',
            'AGENDADO': 'agendado',
            'CANCELADO': 'cancelado',
            'FINALIZADO': 'finalizado',
            'POSSUI PENDÊNCIAS': 'pendencias'
        };

        return statusMap[status] || 'unknown';
    };

    // Debounce para busca
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setCurrentPage(1);
            loadEventos(1, searchTerm);
        }, 500);
        
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    // Handler para mudança de página
    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        loadEventos(value, searchTerm);
    };

    return (
        <>
            <Header nomeHeader="Eventos" />
            <div className="eventos-container">
                {/* Header da Lista */}
                <div className="list-section">
                    <div className="list-header">
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Buscar eventos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                                disabled={isLoading}
                            />
                            <i className="bi bi-search search-icon"></i>
                        </div>
                        
                        <div className="btn-container">
                            <Button
                                text="Criar Evento"
                                variant="primary"
                                iconName="plus"
                                iconPosition="left"
                                onClick={handleCreateEvent}
                            />
                        </div>
                    </div>

                    {/* Lista de Eventos */}
                    <div className="eventos-list">
                        {isLoading ? (
                            // Skeleton loading
                            Array.from({ length: 6 }).map((_, index) => (
                                <div key={index} className="evento-skeleton">
                                    <div className="skeleton-content">
                                        <div className="skeleton-title"></div>
                                        <div className="skeleton-description"></div>
                                        <div className="skeleton-details">
                                            <div className="skeleton-detail"></div>
                                            <div className="skeleton-detail"></div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : error ? (
                            <div className="error-state">
                                <i className="bi bi-exclamation-triangle"></i>
                                <h3>Erro ao carregar eventos</h3>
                                <p>{error}</p>
                                <Button
                                    variant="primary"
                                    iconName="arrow-clockwise"
                                    iconPosition="left"
                                    text="Tentar novamente"
                                    onClick={() => loadEventos(currentPage, searchTerm)}
                                    disabled={isLoading}
                                />
                            </div>
                        ) : eventos.length === 0 ? (
                            <div className="no-results">
                                <i className="bi bi-calendar-event" style={{ color: 'var(--color-accent)' }}></i>
                                <p>Nenhum evento encontrado</p>
                            </div>
                        ) : (
                            <>
                            <div className="eventos-grid">
                                {eventos.map(evento => (
                                    <>
                                        {evento.event_date && (
                                            <div
                                                key={evento.id}
                                                className="evento-card"
                                                onClick={() => handleEventoClick(evento.id)}
                                            >
                                                <div className="evento-card-header">
                                                    <h3 className="evento-title">
                                                        {evento.name ? capitalizeText(evento.name) : 'Evento sem nome'}
                                                    </h3>
                                                </div>

                                                <div className="evento-card-body">
                                                    <p className="evento-description">
                                                        {evento.description || 'Sem descrição disponível'}
                                                    </p>

                                                    <div className="evento-details">
                                                        <div className="evento-detail">
                                                            <i className="bi bi-calendar-event"></i>
                                                            <span>{formatEventDate(evento.event_date)}</span>
                                                        </div>
                                                        <div className="evento-detail">
                                                            <i className="bi bi-clipboard-check"></i>
                                                            <span>{formatServiceOrdersCount(evento.service_orders_count)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="evento-card-footer">
                                                    <div className="evento-status">
                                                        <span className={`status-badge status-${formatStatus(evento.status)}`}>
                                                            {evento.status || 'Status não definido'}
                                                        </span>
                                                    </div>
                                                    <div className="evento-arrow">
                                                        <i className="bi bi-arrow-right"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ))}
                            </div>
                            
                            {/* Paginação */}
                            {totalPages > 1 && (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '24px', flexWrap: 'wrap' }}>
                                    <Pagination
                                        count={totalPages}
                                        page={currentPage}
                                        onChange={handlePageChange}
                                        color="primary"
                                        disabled={isLoading}
                                        showFirstButton
                                        showLastButton
                                    />
                                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                                        {totalCount} evento{totalCount !== 1 ? 's' : ''} encontrado{totalCount !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal para criar evento */}
            <CreateEventModal
                show={showCreateModal}
                onClose={handleCloseCreateModal}
                onEventCreated={handleEventCreated}
            />
        </>
    );
};

export default Eventos;