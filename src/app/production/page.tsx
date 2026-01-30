'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Printer, Filter, MoreHorizontal, CheckSquare, Square } from 'lucide-react';
import styles from './page.module.css';
import { ORDERS, Order } from '@/lib/osData';

const statusColors: Record<string, string> = {
    pending: '#F3F4F6', // Grey (Waiting)
    prepress: '#00AEEF', // Cyan (Production/Action)
    printing: '#00AEEF', // Cyan
    finishing: '#FFF200', // Yellow (Processing/Attention)
    ready: '#FFF200', // Yellow (Waiting for pickup)
    delivered: '#111111', // Black (Finalized)
};

const statusLabels: Record<string, string> = {
    pending: 'Aguardando',
    prepress: 'Pré-Impressão',
    printing: 'Impressão',
    finishing: 'Acabamento',
    ready: 'Pronto',
    delivered: 'Entregue',
};

export default function ProductionPage() {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [filter, setFilter] = useState('');

    const toggleSelect = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredOrders.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredOrders.map(o => o.id)));
        }
    };

    const filteredOrders = ORDERS.filter(order =>
        order.client.toLowerCase().includes(filter.toLowerCase()) ||
        order.jobName.toLowerCase().includes(filter.toLowerCase()) ||
        order.id.includes(filter)
    );

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <h1>Chão de Fábrica</h1>
                    <span className={styles.badge}>{filteredOrders.length} O.S. Ativas</span>
                </div>
                <div className={styles.actions}>
                    <div className={styles.searchBox}>
                        <Search size={16} className={styles.searchIcon} />
                        <input
                            className={styles.searchInput}
                            placeholder="Filtrar O.S., Cliente ou Trabalho..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>
                    <Button variant="secondary">
                        <Filter size={16} className="mr-2" />
                        Filtros
                    </Button>
                </div>
            </header>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ width: 40 }}>
                                <div onClick={toggleSelectAll} className={styles.checkbox}>
                                    {selectedIds.size === filteredOrders.length && filteredOrders.length > 0 ? <CheckSquare size={18} /> : <Square size={18} />}
                                </div>
                            </th>
                            <th>O.S.</th>
                            <th>Status</th>
                            <th>Prioridade</th>
                            <th>Cliente</th>
                            <th>Trabalho</th>
                            <th>Qtd.</th>
                            <th>Máquina</th>
                            <th>Prazo</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map(order => (
                            <tr key={order.id} className={selectedIds.has(order.id) ? styles.selectedRow : ''} onClick={() => toggleSelect(order.id)}>
                                <td>
                                    <div className={styles.checkbox}>
                                        {selectedIds.has(order.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                                    </div>
                                </td>
                                <td className="mono">#{order.id}</td>
                                <td>
                                    <span className={styles.statusBadge} style={{ backgroundColor: statusColors[order.status], color: order.status === 'delivered' ? 'white' : '#111111' }}>
                                        {statusLabels[order.status]}
                                    </span>
                                </td>
                                <td>
                                    {order.priority === 'high' && (
                                        <span className={styles.highPriority}>URGENTE</span>
                                    )}
                                </td>
                                <td className={styles.clientName}>{order.client}</td>
                                <td>{order.jobName}</td>
                                <td className="mono">{order.quantity}</td>
                                <td>{order.printer}</td>
                                <td className="mono">{new Date(order.deadline).toLocaleDateString('pt-BR')}</td>
                                <td>
                                    <button className={styles.iconButton}>
                                        <MoreHorizontal size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedIds.size > 0 && (
                <div className={styles.batchActions}>
                    <div className={styles.batchInfo}>
                        <span className={styles.countBadge}>{selectedIds.size}</span>
                        <span>itens selecionados</span>
                    </div>
                    <div className={styles.batchButtons}>
                        <Button variant="secondary" size="sm">Imprimir O.S.</Button>
                        <Button variant="secondary" size="sm">Gerar Etiquetas</Button>
                        <div className={styles.divider} />
                        <Button variant="primary" size="sm">Avançar Status</Button>
                    </div>
                </div>
            )}
        </div>
    );
}
