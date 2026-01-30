'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Search, Filter, AlertTriangle, FileText, CheckCircle, Receipt, ExternalLink, Calculator, DollarSign, Image as ImageIcon } from 'lucide-react';
import styles from './page.module.css';

// Types
type BillingStatus = 'pending' | 'issue' | 'billed';

interface BillItem {
    id: string; // OS ID
    client: string;
    jobTitle: string;
    value: number;
    poNumber: string;
    cnpj: string;
    cnpjValid: boolean;
    status: BillingStatus;
    podUrl?: string; // Proof of Delivery Evidence
    issueReason?: string;
    date: string;
}

// Mock Data
const INITIAL_ITEMS: BillItem[] = [
    {
        id: '109237', client: 'Zaffari', jobTitle: 'Cartazes A3 Verão', value: 5400.00,
        poNumber: '', cnpj: '93.015.006/0001-13', cnpjValid: true, status: 'pending', podUrl: 'fake-url', date: '30/01'
    },
    {
        id: '109240', client: 'Tramontina', jobTitle: 'Catálogo 2026', value: 12500.50,
        poNumber: 'PO-9988', cnpj: '87.934.000/0001-96', cnpjValid: true, status: 'pending', podUrl: 'fake-url', date: '29/01'
    },
    {
        id: '109255', client: 'Agência Maya', jobTitle: 'Materiais Diversos', value: 1200.00,
        poNumber: '', cnpj: '', cnpjValid: false, status: 'issue', issueReason: 'Cadastro Incompleto (IE)', date: '28/01'
    },
    {
        id: '109200', client: 'Gerdau', jobTitle: 'Manual de Segurança', value: 3200.00,
        poNumber: '450099', cnpj: '33.000.167/0001-01', cnpjValid: true, status: 'billed', date: '25/01'
    },
];

export default function BillingPage() {
    const [items, setItems] = useState<BillItem[]>(INITIAL_ITEMS);
    const [activeTab, setActiveTab] = useState<BillingStatus>('pending');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isEmissionModalOpen, setIsEmissionModalOpen] = useState(false);

    // Derived State
    const filteredItems = useMemo(() => items.filter(i => i.status === activeTab), [items, activeTab]);
    const selectedItems = useMemo(() => items.filter(i => selectedIds.includes(i.id)), [items, selectedIds]);
    const totalSelected = selectedItems.reduce((acc, curr) => acc + curr.value, 0);

    // Handlers
    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const handlePoChange = (id: string, newPo: string) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, poNumber: newPo } : item));
    };

    const handleGroupEmission = () => {
        if (selectedItems.length === 0) return;
        // Check if all selected have same client (simplified for demo)
        const firstClient = selectedItems[0].client;
        if (!selectedItems.every(i => i.client === firstClient)) {
            alert('Erro: Apenas itens do mesmo cliente podem ser agrupados em uma NFe.');
            return;
        }
        setIsEmissionModalOpen(true);
    };

    const handleFinalizeEmission = () => {
        alert('NFe Emitida com Sucesso! E-mail enviado ao cliente.');
        setItems(prev => prev.map(item => selectedIds.includes(item.id) ? { ...item, status: 'billed' } : item));
        setSelectedIds([]);
        setIsEmissionModalOpen(false);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <h1>Faturamento & Emissão</h1>
                    <span className={styles.subtitle}>Checkout Financeiro • Emissão NFe 4.0</span>
                </div>
                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <label>A Faturar</label>
                        <span>R$ {items.filter(i => i.status === 'pending').reduce((a, b) => a + b.value, 0).toLocaleString()}</span>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className={styles.tabs}>
                <button className={`${styles.tab} ${activeTab === 'pending' ? styles.active : ''}`} onClick={() => setActiveTab('pending')}>
                    A Faturar ({items.filter(i => i.status === 'pending').length})
                </button>
                <button className={`${styles.tab} ${activeTab === 'issue' ? styles.active : ''}`} onClick={() => setActiveTab('issue')}>
                    Com Problemas ({items.filter(i => i.status === 'issue').length})
                </button>
                <button className={`${styles.tab} ${activeTab === 'billed' ? styles.active : ''}`} onClick={() => setActiveTab('billed')}>
                    Histórico ({items.filter(i => i.status === 'billed').length})
                </button>
            </div>

            {/* HIGH DENSITY GRID */}
            <div className={styles.gridContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ width: '40px' }}></th>
                            <th>O.S. / Job</th>
                            <th style={{ textAlign: 'right' }}>Valor (R$)</th>
                            <th>Pedido de Compra (PO)</th>
                            <th>Cliente / Documento</th>
                            <th>Gatilho (Origem)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map(item => (
                            <tr key={item.id} className={`${styles.row} ${!item.cnpjValid ? styles.rowError : ''} ${selectedIds.includes(item.id) ? styles.rowSelected : ''}`}>
                                <td>
                                    {item.status === 'pending' && item.cnpjValid && (
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(item.id)}
                                            onChange={() => toggleSelect(item.id)}
                                            className={styles.checkbox}
                                        />
                                    )}
                                    {!item.cnpjValid && <AlertTriangle size={16} className="text-red-500" />}
                                </td>
                                <td>
                                    <div className={styles.cellJob}>
                                        <span className={styles.osId}>#{item.id}</span>
                                        <span className={styles.jobTitle}>{item.jobTitle}</span>
                                    </div>
                                </td>
                                <td className={styles.cellValue}>
                                    {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </td>
                                <td>
                                    {item.status === 'pending' ? (
                                        <input
                                            className={styles.poInput}
                                            value={item.poNumber}
                                            placeholder="Inserir PO..."
                                            onChange={(e) => handlePoChange(item.id, e.target.value)}
                                        />
                                    ) : (
                                        <span className={styles.poStatic}>{item.poNumber || '---'}</span>
                                    )}
                                </td>
                                <td>
                                    <div className={styles.cellClient}>
                                        <strong>{item.client}</strong>
                                        <span className={`${styles.cnpj} ${!item.cnpjValid ? styles.cnpjError : ''}`}>
                                            {item.cnpj || 'SEM CADASTRO'}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <div className={styles.originTag}>
                                        <CheckCircle size={12} />
                                        <span>Expedição ({item.date})</span>
                                        {item.podUrl && <ExternalLink size={10} className="ml-1" />}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* BATCH ACTION BAR */}
            {selectedIds.length > 0 && (
                <div className={styles.batchBar}>
                    <div className={styles.batchInfo}>
                        <span className={styles.batchCount}>{selectedIds.length} selecionados</span>
                        <span className={styles.batchTotal}>Total: R$ {totalSelected.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <Button variant="primary" onClick={handleGroupEmission}>
                        <Receipt size={18} className="mr-2" />
                        Agrupar e Emitir NFe
                    </Button>
                </div>
            )}

            {/* EMISSION MODAL */}
            {isEmissionModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2>Conferência de Emissão NFe</h2>
                            <button className={styles.closeBtn} onClick={() => setIsEmissionModalOpen(false)}>×</button>
                        </div>
                        <div className={styles.modalBody}>
                            {/* Left: Tax Data */}
                            <div className={styles.leftPanel}>
                                <h3><Calculator size={16} /> Dados Fiscais</h3>
                                <div className={styles.formGroup}>
                                    <label>Natureza da Operação</label>
                                    <select className={styles.select}>
                                        <option>5.102 - Venda de Mercadoria</option>
                                        <option>5.933 - Prestação de Serviço</option>
                                    </select>
                                </div>
                                <div className={styles.taxSummary}>
                                    <div className={styles.taxRow}>
                                        <span>Base de Cálculo</span>
                                        <strong>R$ {totalSelected.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                                    </div>
                                    <div className={styles.taxRow}>
                                        <span>ICMS (18%)</span>
                                        <span>R$ {(totalSelected * 0.18).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className={styles.taxRow}>
                                        <span>IPI (5%)</span>
                                        <span>R$ {(totalSelected * 0.05).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Cobrança</label>
                                    <select className={styles.select}>
                                        <option>Boleto - 28 Dias</option>
                                        <option>PIX (À Vista)</option>
                                        <option>Transferência</option>
                                    </select>
                                </div>
                            </div>

                            {/* Right: Audit Evidence */}
                            <div className={styles.rightPanel}>
                                <h3><CheckCircle size={16} /> Auditoria de Entrega</h3>
                                <div className={styles.podScroll}>
                                    {selectedItems.map(item => (
                                        <div key={item.id} className={styles.podItem}>
                                            <div className={styles.podHeader}>
                                                <strong>#{item.id} - {item.jobTitle}</strong>
                                            </div>
                                            <div className={styles.mockImage}>
                                                <ImageIcon size={32} />
                                                <span>Foto do Canhoto (Mock)</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <div className={styles.obsArea}>
                                <label>Observações na Nota:</label>
                                <input placeholder="Ex: Ref. Pedido de Compra 999..." className={styles.input} />
                            </div>
                            <Button variant="primary" size="lg" onClick={handleFinalizeEmission}>
                                <Receipt size={20} className="mr-2" /> Emitir NFe e Gerar Boleto
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
