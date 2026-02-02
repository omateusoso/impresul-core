'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Search, Filter, TrendingUp, TrendingDown, DollarSign, Calendar, AlertTriangle, CheckCircle, Lock, Unlock, Mail, FileText, Plus } from 'lucide-react';
import styles from './page.module.css';

// Types
type FinanceTab = 'overview' | 'receivables' | 'payables' | 'commissions';
type PaymentStatus = 'paid' | 'pending' | 'overdue';

interface Transaction {
    id: string;
    entity: string; // Client or Supplier
    description: string;
    value: number;
    dueDate: string;
    status: PaymentStatus;
    type: 'in' | 'out'; // Receivable or Payable
    docRef?: string;
    approvalRequired?: boolean;
    approved?: boolean;
}

interface Commission {
    id: string;
    agent: string;
    jobRef: string;
    value: number;
    saleStatus: PaymentStatus; // Linked to Client Payment
}

// Mock Data
const RECEIVABLES: Transaction[] = [
    { id: 'REC-001', entity: 'Zaffari', description: 'NF 8920 - Cartazes', value: 5400.00, dueDate: '30/01/2026', status: 'pending', type: 'in', docRef: 'Boleto 293' },
    { id: 'REC-002', entity: 'Tramontina', description: 'NF 8915 - Catálogo', value: 12500.50, dueDate: '25/01/2026', status: 'overdue', type: 'in', docRef: 'Boleto 280' },
    { id: 'REC-003', entity: 'Panvel', description: 'NF 8922 - Flyers', value: 3200.00, dueDate: '15/02/2026', status: 'pending', type: 'in', docRef: 'Boleto 295' },
    { id: 'REC-004', entity: 'Gerdau', description: 'NF 8890 - Manual', value: 1500.00, dueDate: '10/01/2026', status: 'paid', type: 'in', docRef: 'Pix' },
];

const PAYABLES: Transaction[] = [
    { id: 'PAY-001', entity: 'Suzano Papel', description: 'Compra de Couché 150g', value: 15000.00, dueDate: '05/02/2026', status: 'pending', type: 'out', approvalRequired: true, approved: false },
    { id: 'PAY-002', entity: 'CEEE Equatorial', description: 'Energia Elétrica Jan', value: 4500.00, dueDate: '10/02/2026', status: 'pending', type: 'out', approvalRequired: false },
    { id: 'PAY-003', entity: 'Sun Chemical', description: 'Tintas Offset', value: 2800.00, dueDate: '02/02/2026', status: 'pending', type: 'out', approvalRequired: false },
];

const COMMISSIONS: Commission[] = [
    { id: 'COM-001', agent: 'Agência Paim', jobRef: '#109237', value: 540.00, saleStatus: 'pending' },
    { id: 'COM-002', agent: 'Carlos (Vendas)', jobRef: '#109240', value: 1250.00, saleStatus: 'overdue' },
    { id: 'COM-003', agent: 'Agência Maya', jobRef: '#109200', value: 320.00, saleStatus: 'paid' },
];

export default function FinancePage() {
    const [activeTab, setActiveTab] = useState<FinanceTab>('overview');
    const [receivables, setReceivables] = useState(RECEIVABLES);
    const [payables, setPayables] = useState(PAYABLES);

    // logic for receivables selection
    const [selectedReceivables, setSelectedReceivables] = useState<string[]>([]);

    const toggleReceivableSelect = (id: string) => {
        setSelectedReceivables(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const handleBatchReceive = () => {
        setReceivables(prev => prev.map(r => selectedReceivables.includes(r.id) ? { ...r, status: 'paid' } : r));
        setSelectedReceivables([]);
        alert('Baixa de pagamentos realizada com sucesso! Limite de crédito liberado.');
    };

    const handleApprovePayable = (id: string) => {
        setPayables(prev => prev.map(p => p.id === id ? { ...p, approved: true } : p));
    };

    const formatCurrency = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // Tabs Components
    const OverviewTab = () => (
        <div className={styles.dashboardGrid}>
            <div className={styles.kpiCard}>
                <div className={styles.kpiLabel}>Saldo em Banco</div>
                <div className={styles.kpiValuePositive}>R$ 124.500,00</div>
                <div className={styles.kpiMeta}>Última atualização: 10:45</div>
            </div>
            <div className={styles.kpiCard}>
                <div className={styles.kpiLabel}>A Receber Hoje</div>
                <div className={styles.kpiValueNeutral}>R$ 5.400,00</div>
                <div className={styles.kpiMeta}>1 Boleto</div>
            </div>
            <div className={styles.kpiCard}>
                <div className={styles.kpiLabel}>A Pagar Hoje</div>
                <div className={styles.kpiValueNegative}>R$ 0,00</div>
                <div className={styles.kpiMeta}>Tudo pago</div>
            </div>
            <div className={styles.kpiCard}>
                <div className={styles.kpiLabel}>Inadimplência</div>
                <div className={styles.kpiValueWarning}>12.5%</div>
                <div className={styles.kpiMeta}>R$ 12.500 em atraso</div>
            </div>

            <div className={styles.chartContainer}>
                <h3>Fluxo de Caixa Projetado (30 Dias)</h3>
                <div className={styles.mockChart}>
                    {/* Mock Visualization of Lines */}
                    <div className={styles.chartLineGreen} style={{ height: '60%', width: '100%' }}></div>
                    <div className={styles.chartLineRed} style={{ height: '40%', width: '100%' }}></div>
                    <div className={styles.chartalert}>
                        <AlertTriangle size={16} />
                        <span>Atenção: Projeção negativa para 15/02. Antecipe recebíveis.</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const ReceivablesTab = () => (
        <div className={styles.tableContainer}>
            <div className={styles.actionBar}>
                <div className={styles.filters}>
                    <Button variant="outline" size="sm">Hoje</Button>
                    <Button variant="outline" size="sm">Esta Semana</Button>
                    <Button variant="outline" size="sm" className="text-red-500 border-red-200">Vencidos</Button>
                </div>
                {selectedReceivables.length > 0 && (
                    <Button variant="primary" size="sm" onClick={handleBatchReceive}>
                        <CheckCircle size={16} className="mr-2" />
                        Dar Baixa ({selectedReceivables.length})
                    </Button>
                )}
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th style={{ width: '40px' }}></th>
                        <th>Status</th>
                        <th>Cliente</th>
                        <th>Descrição / Doc</th>
                        <th>Vencimento</th>
                        <th style={{ textAlign: 'right' }}>Valor</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {receivables.map(r => (
                        <tr key={r.id}>
                            <td>
                                {r.status !== 'paid' && (
                                    <input
                                        type="checkbox"
                                        checked={selectedReceivables.includes(r.id)}
                                        onChange={() => toggleReceivableSelect(r.id)}
                                        className={styles.checkbox}
                                    />
                                )}
                            </td>
                            <td><StatusBadge status={r.status} /></td>
                            <td className={styles.fontBold}>{r.entity}</td>
                            <td>
                                <div className={styles.colFlex}>
                                    <span>{r.description}</span>
                                    <span className={styles.subText}>{r.docRef}</span>
                                </div>
                            </td>
                            <td className={r.dueDate === '30/01/2026' ? styles.textBold : ''}>{r.dueDate}</td>
                            <td className={styles.cellMoney}>{formatCurrency(r.value)}</td>
                            <td>
                                {r.status !== 'paid' && (
                                    <button className={styles.iconBtn} title="Reenviar Boleto">
                                        <Mail size={16} />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const PayablesTab = () => (
        <div className={styles.tableContainer}>
            <div className={styles.actionBar}>
                <Button variant="primary" size="sm">
                    <Plus size={16} className="mr-2" /> Novo Pagamento
                </Button>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Fornecedor</th>
                        <th>Descrição</th>
                        <th>Vencimento</th>
                        <th style={{ textAlign: 'right' }}>Valor</th>
                        <th>Aprovação</th>
                    </tr>
                </thead>
                <tbody>
                    {payables.map(p => (
                        <tr key={p.id}>
                            <td><StatusBadge status={p.status} /></td>
                            <td className={styles.fontBold}>{p.entity}</td>
                            <td>{p.description}</td>
                            <td>{p.dueDate}</td>
                            <td className={styles.cellMoneyRed}>-{formatCurrency(p.value)}</td>
                            <td>
                                {p.approvalRequired ? (
                                    p.approved ? (
                                        <span className={styles.badgeApproved}>Aprovado</span>
                                    ) : (
                                        <button className={styles.approveBtn} onClick={() => handleApprovePayable(p.id)}>
                                            <Lock size={14} className="mr-1" /> Aprovar
                                        </button>
                                    )
                                ) : (
                                    <span className={styles.badgeAuto}>Auto</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const CommissionsTab = () => (
        <div className={styles.tableContainer}>
            <div className={styles.infoBanner}>
                <Lock size={16} />
                <span>As comissões só são liberadas para pagamento após a quitação da fatura pelo cliente.</span>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Status Comissão</th>
                        <th>Vendedor / Agência</th>
                        <th>Ref. Job</th>
                        <th>Status da Venda</th>
                        <th style={{ textAlign: 'right' }}>Comissão (10%)</th>
                    </tr>
                </thead>
                <tbody>
                    {COMMISSIONS.map(c => {
                        const isUnlocked = c.saleStatus === 'paid';
                        return (
                            <tr key={c.id} className={!isUnlocked ? styles.rowLocked : ''}>
                                <td>
                                    {isUnlocked ? (
                                        <span className={styles.badgeOpen}><Unlock size={12} /> Liberada</span>
                                    ) : (
                                        <span className={styles.badgeLocked}><Lock size={12} /> Bloqueada</span>
                                    )}
                                </td>
                                <td className={styles.fontBold}>{c.agent}</td>
                                <td>{c.jobRef}</td>
                                <td><StatusBadge status={c.saleStatus} labelOverride={c.saleStatus === 'paid' ? 'Cliente Pagou' : c.saleStatus === 'overdue' ? 'Cliente Em Atraso' : 'Aguardando Pagto'} /></td>
                                <td className={styles.cellMoney}>{formatCurrency(c.value)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <h1>Financeiro & Controladoria</h1>
                    <span className={styles.subtitle}>Cofre Digital • Fluxo de Caixa</span>
                </div>
                <div className={styles.balanceDisplay}>
                    <DollarSign size={20} />
                    <span>Saldo do Dia: <strong>R$ 124.500,00</strong></span>
                </div>
            </header>

            <div className={styles.tabs}>
                <button className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`} onClick={() => setActiveTab('overview')}>
                    Visão Geral
                </button>
                <button className={`${styles.tab} ${activeTab === 'receivables' ? styles.active : ''}`} onClick={() => setActiveTab('receivables')}>
                    A Receber
                </button>
                <button className={`${styles.tab} ${activeTab === 'payables' ? styles.active : ''}`} onClick={() => setActiveTab('payables')}>
                    A Pagar
                </button>
                <button className={`${styles.tab} ${activeTab === 'commissions' ? styles.active : ''}`} onClick={() => setActiveTab('commissions')}>
                    Comissões
                </button>
            </div>

            <div className={styles.contentArea}>
                {activeTab === 'overview' && <OverviewTab />}
                {activeTab === 'receivables' && <ReceivablesTab />}
                {activeTab === 'payables' && <PayablesTab />}
                {activeTab === 'commissions' && <CommissionsTab />}
            </div>
        </div>
    );
}

function StatusBadge({ status, labelOverride }: { status: string, labelOverride?: string }) {
    const config = {
        paid: { label: 'Pago', color: '#16a34a', bg: '#dcfce7' }, // Green
        pending: { label: 'A Vencer', color: '#b45309', bg: '#fffbeb' }, // Yellow/Orange
        overdue: { label: 'Vencido', color: '#ef4444', bg: '#fee2e2' } // Red
    }[status as PaymentStatus] || { label: status, color: '#64748b', bg: '#f1f5f9' };

    return (
        <span className={styles.badge} style={{ color: config.color, backgroundColor: config.bg }}>
            {labelOverride || config.label}
        </span>
    );
}
