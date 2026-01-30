'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Plus, Filter, Eye, FileText, Calendar, MoreHorizontal, Layers, CheckCircle, AlertTriangle } from 'lucide-react';
import styles from './page.module.css';

// Mock Data for Service Orders
const SERVICE_ORDERS = [
    { id: '109237', client: 'Zaffari', job: 'Cartaz A3 Promoção Verão', sector: 'printing', sectorLabel: 'Impressão', status: 'running', user: 'JS', value: 5400.00, payment: 'paid', deadline: '2026-02-05' },
    { id: '109238', client: 'Panvel', job: 'Folheto Ofertas Quinzenal', sector: 'prepress', sectorLabel: 'Pré-Impressão', status: 'start', user: 'MA', value: 12500.00, payment: 'pending', deadline: '2026-02-08' },
    { id: '109239', client: 'Tramontina', job: 'Catálogo 2026 - Capa Dura', sector: 'finishing', sectorLabel: 'Acabamento', status: 'attention', user: 'RO', value: 28900.00, payment: 'paid', deadline: '2026-02-02' }, // Late warning
    { id: '109240', client: 'Grendene', job: 'Embalagem Melissa', sector: 'shipping', sectorLabel: 'Expedição', status: 'done', user: 'JS', value: 3200.00, payment: 'invoiced', deadline: '2026-02-01' },
    { id: '109241', client: 'Unimed', job: 'Receituário Controlado', sector: 'printing', sectorLabel: 'Impressão', status: 'running', user: 'MA', value: 1800.00, payment: 'pending', deadline: '2026-02-10' },
];

export default function ServiceOrdersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <h1>Ordens de Serviço</h1>
                    <div className={styles.kpiWrapper}>
                        <div className={styles.kpiItem}>
                            <span className={styles.kpiLabel}>Em Produção</span>
                            <span className={styles.kpiValue}>42</span>
                        </div>
                        <div className={styles.kpiItem}>
                            <span className={`${styles.kpiLabel} ${styles.textMagenta}`}>Atrasadas</span>
                            <span className={`${styles.kpiValue} ${styles.textMagenta}`}>3</span>
                        </div>
                        <div className={styles.kpiItem}>
                            <span className={styles.kpiLabel}>Expedição</span>
                            <span className={styles.kpiValue}>15</span>
                        </div>
                    </div>
                </div>
                <div className={styles.actions}>
                    <div className={styles.filterBar}>
                        <button className={styles.filterButton}>
                            <Filter size={14} className="mr-2" />
                            Por Setor
                        </button>
                        <button className={styles.filterButton}>
                            <Layers size={14} className="mr-2" />
                            Financeiro
                        </button>
                    </div>
                    <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
                        <Plus size={16} className="mr-2" />
                        Nova O.S. [F2]
                    </Button>
                </div>
            </header>

            <div className={styles.gridContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ width: 100 }}>Nº O.S.</th>
                            <th>Cliente / Job</th>
                            <th style={{ width: 150 }}>Status Produção</th>
                            <th style={{ width: 120 }}>Entrega</th>
                            <th style={{ width: 60 }}>Vend.</th>
                            <th style={{ width: 120, textAlign: 'right' }}>Valor</th>
                            <th style={{ width: 60, textAlign: 'center' }}>Pagto</th>
                            <th style={{ width: 80, textAlign: 'right' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {SERVICE_ORDERS.map(os => (
                            <tr key={os.id}>
                                <td className={styles.mono}>#{os.id}</td>
                                <td>
                                    <div className={styles.clientCell}>
                                        <span className={styles.clientName}>{os.client}</span>
                                        <span className={styles.jobTitle}>{os.job}</span>
                                    </div>
                                </td>
                                <td>
                                    <StatusBadge sector={os.sector} label={os.sectorLabel} />
                                </td>
                                <td className={styles.mono}>{new Date(os.deadline).toLocaleDateString('pt-BR')}</td>
                                <td>
                                    <div className={styles.avatar}>{os.user}</div>
                                </td>
                                <td className={styles.mono} style={{ textAlign: 'right' }}>
                                    R$ {os.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    {os.payment === 'paid' && <div className={styles.paymentDot} style={{ background: '#22c55e' }} title="Pago" />}
                                    {os.payment === 'pending' && <div className={styles.paymentDot} style={{ background: '#ef4444' }} title="Pendente" />}
                                    {os.payment === 'invoiced' && <div className={styles.paymentDot} style={{ background: '#eab308' }} title="Faturado" />}
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <div className={styles.actionButtons}>
                                        <button className={styles.iconBtn}><Eye size={16} /></button>
                                        <button className={styles.iconBtn}><FileText size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* BIFURCATOR MODAL */}
            {isCreateModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.bifurcatorModal}>
                        <h2 className={styles.bifurcatorTitle}>Como deseja iniciar esta O.S.?</h2>
                        <div className={styles.bifurcatorOptions}>
                            <button className={styles.optionCard}>
                                <div className={styles.optionIcon}><FileText size={32} /></div>
                                <h3>Importar de Orçamento</h3>
                                <p>Puxar dados técnicos e comerciais de um orçamento aprovado.</p>
                            </button>
                            <button className={styles.optionCard}>
                                <div className={styles.optionIcon}><Plus size={32} /></div>
                                <h3>Criar do Zero</h3>
                                <p>Para jobs internos, reimpressões ou pedidos diretos sem orçamento.</p>
                            </button>
                        </div>
                        <button className={styles.closeBtn} onClick={() => setIsCreateModalOpen(false)}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatusBadge({ sector, label }: { sector: string, label: string }) {
    let style = {};
    switch (sector) {
        case 'prepress': style = { backgroundColor: '#e0f2fe', color: '#0369a1' }; break; // Cyan-ish
        case 'printing': style = { backgroundColor: '#fef9c3', color: '#854d0e' }; break; // Yellow-ish
        case 'finishing': style = { backgroundColor: '#f3e8ff', color: '#6b21a8' }; break; // Purple
        case 'shipping': style = { backgroundColor: '#f3f4f6', color: '#1f2937' }; break; // Gray
        default: style = { backgroundColor: '#f3f4f6', color: '#1f2937' };
    }

    return (
        <span className={styles.statusBadge} style={style}>
            {label}
        </span>
    );
}
