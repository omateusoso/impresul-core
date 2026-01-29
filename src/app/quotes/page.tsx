'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Send, AlertTriangle, CheckCircle } from 'lucide-react';
import styles from './page.module.css';
import { CLIENTS, SUBSTRATES } from '@/lib/mockData';

export default function QuotesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClient, setSelectedClient] = useState<any>(null);
    const [productName, setProductName] = useState('');
    const [quantity, setQuantity] = useState(1000);
    const [selectedSubstrate, setSelectedSubstrate] = useState('');

    // Derived state for suggestions
    const clientSuggestions = searchQuery.length > 2
        ? CLIENTS.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : [];

    // Simple Price Calculation Logic (Mocked)
    const basePrice = 50; // Setup cost
    const unitPrice = 0.25; // Average cost per unit
    const substrateCost = selectedSubstrate ? 0.10 : 0;

    const totalProductionCost = basePrice + (quantity * (unitPrice + substrateCost));
    const technicalMargin = 1.35; // 135%
    const finalPrice = totalProductionCost * technicalMargin;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <h1>Mesa de Orçamento</h1>
                    <span className={styles.badge}>Novo Orçamento #4921</span>
                </div>
                <div className={styles.actions}>
                    <Button variant="ghost">Limpar</Button>
                    <Button variant="secondary">Salvar Rascunho</Button>
                    <Button variant="primary">
                        <Send size={16} className="mr-2" />
                        Gerar e Enviar
                    </Button>
                </div>
            </header>

            <div className={styles.grid}>
                {/* Coluna 1: Cliente e Contexto */}
                <section className={styles.column}>
                    <Card title="Cliente" className={styles.card}>
                        <div className={styles.searchContainer}>
                            <Search className={styles.searchIcon} size={18} />
                            <Input
                                placeholder="Buscar cliente (CPF/CNPJ/Nome)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {clientSuggestions.length > 0 && !selectedClient && (
                                <div className={styles.suggestions} style={{
                                    position: 'absolute', top: '100%', left: 0, right: 0,
                                    background: 'white', border: '1px solid #ddd', borderRadius: '6px',
                                    zIndex: 10, marginTop: '4px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}>
                                    {clientSuggestions.map(client => (
                                        <div
                                            key={client.id}
                                            style={{ padding: '0.75rem', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                                            onClick={() => {
                                                setSelectedClient(client);
                                                setSearchQuery(client.name);
                                            }}
                                        >
                                            <strong style={{ display: 'block', fontSize: '0.9rem' }}>{client.name}</strong>
                                            <span style={{ fontSize: '0.75rem', color: '#666' }}>{client.cnpj}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className={styles.clientInfo}>
                            {!selectedClient ? (
                                <div className={styles.emptyState}>
                                    Nenhum cliente selecionado
                                </div>
                            ) : (
                                <div className={styles.clientDetails}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{selectedClient.name}</h3>
                                    <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>CNPJ: {selectedClient.cnpj}</p>
                                    <div className={styles.statusBadge} data-status={selectedClient.status} style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                                        padding: '2px 8px', borderRadius: '99px', fontSize: '0.75rem',
                                        background: selectedClient.status === 'active' ? '#e6f4ea' : '#fce8e6',
                                        color: selectedClient.status === 'active' ? '#1e7e34' : '#c5221f'
                                    }}>
                                        {selectedClient.status === 'active' ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                                        {selectedClient.status === 'active' ? 'Ativo' : 'Bloqueado'}
                                    </div>
                                    <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', fontWeight: 500 }}>
                                        Crédito: R$ {selectedClient.credit.toLocaleString('pt-BR')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>

                    <Card title="Histórico Recente" className={`${styles.card} ${styles.historyCard}`}>
                        <p className={styles.placeholderText}>
                            {selectedClient ? 'Histórico carregado (3 pedidos nos últimos 6 meses).' : 'Selecione um cliente para ver o histórico.'}
                        </p>
                    </Card>
                </section>

                {/* Coluna 2: Configuração do Produto */}
                <section className={`${styles.column} ${styles.mainColumn}`}>
                    <Card title="Especificações do Produto" className={styles.card}>
                        <div className={styles.formGrid}>
                            <Input
                                label="Nome do Trabalho"
                                placeholder="Ex: Cartão de Visita"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                            />
                            <div className={styles.row}>
                                <Input
                                    label="Quantidade"
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                />
                                <Input label="Formato Fechado" placeholder="9x5 cm" />
                            </div>
                        </div>

                        <div className={styles.separator} />

                        <h3>Papel e Substrato</h3>
                        <div className={styles.stockSelector}>
                            <select
                                className={styles.select}
                                value={selectedSubstrate}
                                onChange={(e) => setSelectedSubstrate(e.target.value)}
                                style={{
                                    width: '100%', padding: '0.5rem', borderRadius: '6px',
                                    border: '1px solid var(--border)', fontSize: '0.95rem',
                                    background: 'var(--surface)'
                                }}
                            >
                                <option value="">Selecione o papel...</option>
                                {SUBSTRATES.map(sub => (
                                    <option key={sub.id} value={sub.id}>
                                        {sub.name} (Estoque: {sub.stock} {sub.unit})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.impositionPreview}>
                            <div className={styles.previewCanvas}>
                                <span>Preview de Imposição {quantity > 0 && `(${Math.ceil(quantity / 20)} folhas)`}</span>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* Coluna 3: Preço e Resumo */}
                <section className={styles.column}>
                    <Card title="Composição de Preço" className={styles.card}>
                        <div className={styles.priceList}>
                            <div className={styles.priceItem}>
                                <span>Custo Base (Setup)</span>
                                <span>R$ {basePrice.toFixed(2)}</span>
                            </div>
                            <div className={styles.priceItem}>
                                <span>Produção ({quantity} un)</span>
                                <span>R$ {(quantity * unitPrice).toFixed(2)}</span>
                            </div>
                            {selectedSubstrate && (
                                <div className={styles.priceItem}>
                                    <span>Papel Extra</span>
                                    <span>R$ {(quantity * substrateCost).toFixed(2)}</span>
                                </div>
                            )}
                            <div className={styles.priceDivider} />
                            <div className={`${styles.priceItem} ${styles.total}`}>
                                <span>TOTAL ESTIMADO</span>
                                <span>R$ {finalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </Card>

                    <Card title="Margem & Lucro" className={styles.card}>
                        <div className={styles.profitIndicator}>
                            <span>Margem Técnica: {(technicalMargin * 100 - 100).toFixed(0)}%</span>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: '70%' }} />
                            </div>
                            <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#666' }}>
                                Lucro Aprox: R$ {(finalPrice - totalProductionCost).toFixed(2)}
                            </p>
                        </div>
                    </Card>
                </section>
            </div>
        </div>
    );
}
