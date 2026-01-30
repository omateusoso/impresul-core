'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Plus, Filter, Calculator, FileText, Send, Save, Copy, Trash2, X, ChevronRight, Check, Printer, DollarSign } from 'lucide-react';
import styles from './page.module.css';

// Mock Data for Quotes
const QUOTES = [
    { id: '4921', date: '2026-01-30', client: 'Zaffari', job: 'Cartazes A3 Verão', requester: 'João S.', engineer: 'Roberto', specs: ['Offset', 'Couché 150g', '4x0'], value: 0, status: 'waiting' },
    { id: '4920', date: '2026-01-29', client: 'Panvel', job: 'Folheto Ofertas', requester: 'Maria', engineer: 'Roberto', specs: ['Offset', 'LWC 60g', '4x4'], value: 12500.00, status: 'calculated' },
    { id: '4919', date: '2026-01-28', client: 'Tramontina', job: 'Catálogo 2026', requester: 'Roberto', engineer: 'Roberto', specs: ['Offset', 'Capa Dura', 'HotStamping'], value: 28900.00, status: 'approved' },
    { id: '4918', date: '2026-01-28', client: 'Restaurante Sabor', job: 'Cardápios', requester: 'João S.', engineer: 'Roberto', specs: ['Digital', 'Laminação'], value: 450.00, status: 'lost' },
];

type QuoteStatus = 'waiting' | 'calculated' | 'approved' | 'lost';
type FilterType = 'all' | QuoteStatus;

export default function QuotesPage() {
    const [activeFilter, setActiveFilter] = useState<FilterType>('waiting');
    const [isInternalModalOpen, setIsInternalModalOpen] = useState(false);

    // Calculator Mock State
    const [calcStep, setCalcStep] = useState(1); // 1: Context, 2: Engineering, 3: Pricing

    const filteredQuotes = QUOTES.filter(q => activeFilter === 'all' || q.status === activeFilter);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <h1>Engenharia de Vendas</h1>
                    <span className={styles.subtitle}>Gestão de Orçamentos</span>
                </div>
                <div className={styles.actions}>
                    <Button variant="primary" onClick={() => setIsInternalModalOpen(true)}>
                        <Plus size={16} className="mr-2" />
                        Novo Orçamento [F2]
                    </Button>
                </div>
            </header>

            <div className={styles.toolbar}>
                <div className={styles.filterPills}>
                    <FilterPill label="Aguardando Cálculo" count={1} color="magenta" active={activeFilter === 'waiting'} onClick={() => setActiveFilter('waiting')} />
                    <FilterPill label="Calculados" count={1} color="cyan" active={activeFilter === 'calculated'} onClick={() => setActiveFilter('calculated')} />
                    <FilterPill label="Aprovados" count={1} color="green" active={activeFilter === 'approved'} onClick={() => setActiveFilter('approved')} />
                    <FilterPill label="Arquivados" count={1} color="gray" active={activeFilter === 'lost'} onClick={() => setActiveFilter('lost')} />
                </div>
                <div className={styles.searchBox}>
                    <Search size={16} className={styles.searchIcon} />
                    <input className={styles.searchInput} placeholder="Buscar orçamento..." />
                </div>
            </div>

            <div className={styles.gridContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ width: 80 }}>Nº Orç.</th>
                            <th style={{ width: 100 }}>Data</th>
                            <th>Cliente / Job</th>
                            <th style={{ width: 100 }}>Solicitante</th>
                            <th style={{ width: 100 }}>Resp.</th>
                            <th>Specs Resumidas</th>
                            <th style={{ width: 120, textAlign: 'right' }}>Valor Total</th>
                            <th style={{ width: 120, textAlign: 'center' }}>Status</th>
                            <th style={{ width: 100, textAlign: 'right' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredQuotes.map(quote => (
                            <tr key={quote.id}>
                                <td className={styles.mono}>#{quote.id}</td>
                                <td className={styles.mono}>{new Date(quote.date).toLocaleDateString('pt-BR')}</td>
                                <td>
                                    <div className={styles.clientCell}>
                                        <span className={styles.clientName}>{quote.client}</span>
                                        <span className={styles.jobTitle}>{quote.job}</span>
                                    </div>
                                </td>
                                <td className={styles.textSmall}>{quote.requester}</td>
                                <td className={styles.textSmall}>{quote.engineer}</td>
                                <td>
                                    <div className={styles.tags}>
                                        {quote.specs.map((spec, i) => (
                                            <span key={i} className={styles.specTag}>{spec}</span>
                                        ))}
                                    </div>
                                </td>
                                <td className={styles.mono} style={{ textAlign: 'right' }}>
                                    {quote.value > 0 ? `R$ ${quote.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <StatusBadge status={quote.status} />
                                </td>
                                <td>
                                    <div className={styles.actionButtons}>
                                        <button className={styles.iconBtn} title="Calcular/Editar"><Calculator size={16} /></button>
                                        <button className={styles.iconBtn} title="PDF"><FileText size={16} /></button>
                                        <button className={styles.iconBtn} title="Duplicar"><Copy size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* CALCULATOR MODAL */}
            {isInternalModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.calculatorModal}>
                        <div className={styles.modalHeader}>
                            <h2>Nova Calculadora de Custos</h2>
                            <div className={styles.stepIndicator}>
                                <StepBadge num={1} label="Contexto" active={calcStep === 1} completed={calcStep > 1} />
                                <div className={styles.stepLine} />
                                <StepBadge num={2} label="Engenharia" active={calcStep === 2} completed={calcStep > 2} />
                                <div className={styles.stepLine} />
                                <StepBadge num={3} label="Preço" active={calcStep === 3} completed={calcStep > 3} />
                            </div>
                            <button className={styles.closeBtn} onClick={() => setIsInternalModalOpen(false)}><X size={20} /></button>
                        </div>

                        <div className={styles.modalBody}>
                            {calcStep === 1 && (
                                <div className={styles.blockContainer}>
                                    <h3>Bloco A: O Pedido</h3>
                                    <div className={styles.formGrid}>
                                        <div className={styles.formGroup}>
                                            <label>Cliente</label>
                                            <Input placeholder="Buscar cliente..." />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Título do Trabalho</label>
                                            <Input placeholder="Ex: Cartazes Promoção de Verão" />
                                        </div>
                                        <div className={styles.row}>
                                            <div className={styles.formGroup}>
                                                <label>Vendedor (Dono da Conta)</label>
                                                <select className={styles.select}>
                                                    <option>João Silva</option>
                                                    <option>Maria Atendimento</option>
                                                </select>
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>Prazo Esperado</label>
                                                <Input type="date" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {calcStep === 2 && (
                                <div className={styles.blockContainer}>
                                    <h3>Bloco B: Engenharia & Imposição</h3>
                                    <div className={styles.engineeringGrid}>
                                        <div className={styles.specsForm}>
                                            <div className={styles.row}>
                                                <div className={styles.formGroup}>
                                                    <label>Quantidade</label>
                                                    <Input type="number" placeholder="5000" />
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label>Formato Fechado (mm)</label>
                                                    <div className={styles.dimInput}>
                                                        <input placeholder="297" /> x <input placeholder="420" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>Máquina</label>
                                                <select className={styles.select}>
                                                    <option>Heidelberg XL 75</option>
                                                    <option>Konica Minolta C3070</option>
                                                </select>
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>Papel (Substrato)</label>
                                                <Input placeholder="Buscar papel (Ex: Couché 150g)" />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>Cores</label>
                                                <div className={styles.colorOptions}>
                                                    <button className={`${styles.colorBtn} ${styles.activeColor}`}>4x0</button>
                                                    <button className={styles.colorBtn}>4x4</button>
                                                    <button className={styles.colorBtn}>1x0</button>
                                                    <button className={styles.colorBtn}>1x1</button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles.visualPanel}>
                                            <div className={styles.impositionCanvas}>
                                                <div className={styles.sheetLabel}>Folha Inteira: 660x960mm</div>
                                                <div className={styles.sheetVisual}>
                                                    {/* Mocking 4 A3 pages on a sheet */}
                                                    <div className={styles.pageItem} />
                                                    <div className={styles.pageItem} />
                                                    <div className={styles.pageItem} />
                                                    <div className={styles.pageItem} />
                                                </div>
                                                <div className={styles.yieldLabel}>Aproveitamento: 4 p/ folha (85%)</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {calcStep === 3 && (
                                <div className={styles.blockContainer}>
                                    <h3>Bloco C: Fechamento de Preço</h3>
                                    <div className={styles.pricingGrid}>
                                        <div className={styles.costBreakdown}>
                                            <h4>Custo Industrial</h4>
                                            <div className={styles.costRow}>
                                                <span>Papel</span>
                                                <span>R$ 1.200,00</span>
                                            </div>
                                            <div className={styles.costRow}>
                                                <span>Impressão (Hora/Maq)</span>
                                                <span>R$ 800,00</span>
                                            </div>
                                            <div className={styles.costRow}>
                                                <span>Chapas/Clics</span>
                                                <span>R$ 150,00</span>
                                            </div>
                                            <div className={styles.costRow}>
                                                <span>Acabamento</span>
                                                <span>R$ 300,00</span>
                                            </div>
                                            <div className={`${styles.costRow} ${styles.totalCost}`}>
                                                <span>Total Custos</span>
                                                <span>R$ 2.450,00</span>
                                            </div>
                                        </div>

                                        <div className={styles.markupSection}>
                                            <div className={styles.formGroup}>
                                                <label>Markup / Margem Lucro (%)</label>
                                                <div className={styles.markupInputWrapper}>
                                                    <input type="number" defaultValue={100} className={styles.markupInput} />
                                                    <div className={styles.percentSymbol}>%</div>
                                                </div>
                                            </div>

                                            <div className={styles.finalPriceCard}>
                                                <span className={styles.finalLabel}>Preço Final de Venda</span>
                                                <span className={styles.finalValue}>R$ 4.900,00</span>
                                                <span className={styles.unitPrice}>R$ 0,98 un.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={styles.modalFooter}>
                            <div className={styles.footerLeft}>
                                <button className={styles.secondaryBtn}><Save size={16} /> Salvar Rascunho</button>
                                <button className={styles.secondaryBtn}><FileText size={16} /> PDF Técnico</button>
                            </div>
                            <div className={styles.footerRight}>
                                {calcStep > 1 && (
                                    <Button variant="ghost" onClick={() => setCalcStep(calcStep - 1)}>Voltar</Button>
                                )}
                                {calcStep < 3 ? (
                                    <Button variant="primary" onClick={() => setCalcStep(calcStep + 1)}>
                                        Próximo Passo <ChevronRight size={16} />
                                    </Button>
                                ) : (
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <Button variant="outline">
                                            <Printer size={16} className="mr-2" />
                                            Gerar Proposta
                                        </Button>
                                        <Button variant="primary" onClick={() => setIsInternalModalOpen(false)}>
                                            <Send size={16} className="mr-2" />
                                            Enviar para Vendas
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function FilterPill({ label, count, color, active, onClick }: any) {
    const colorMap: any = {
        magenta: { bg: '#FFF0F5', text: '#db2777', border: '#db2777' },
        cyan: { bg: '#E0F7FA', text: '#0284c7', border: '#0284c7' },
        green: { bg: '#dcfce7', text: '#16a34a', border: '#16a34a' },
        gray: { bg: '#f3f4f6', text: '#4b5563', border: '#9ca3af' },
    };

    const theme = colorMap[color];

    return (
        <button
            className={`${styles.filterPill} ${active ? styles.activePill : ''}`}
            onClick={onClick}
            style={active ? { backgroundColor: theme.text, color: 'white', borderColor: theme.text } : {}}
        >
            {label}
            {count > 0 && <span className={styles.pillCount} style={{ backgroundColor: active ? 'white' : theme.bg, color: active ? theme.text : theme.text }}>{count}</span>}
        </button>
    );
}

function StatusBadge({ status }: { status: QuoteStatus }) {
    const config = {
        waiting: { label: 'Aguardando Cálculo', color: '#db2777', bg: '#FFF0F5' },
        calculated: { label: 'Calculado', color: '#0284c7', bg: '#E0F7FA' },
        approved: { label: 'Aprovado (O.S.)', color: '#16a34a', bg: '#dcfce7' },
        lost: { label: 'Arquivado', color: '#6b7280', bg: '#f3f4f6' },
    }[status];

    return (
        <span className={styles.statusBadge} style={{ backgroundColor: config.bg, color: config.color }}>
            {config.label}
        </span>
    );
}

function StepBadge({ num, label, active, completed }: any) {
    return (
        <div className={`${styles.stepBadge} ${active ? styles.activeStep : ''} ${completed ? styles.completedStep : ''}`}>
            <div className={styles.stepNum}>{completed ? <Check size={12} /> : num}</div>
            <span className={styles.stepLabel}>{label}</span>
        </div>
    );
}
