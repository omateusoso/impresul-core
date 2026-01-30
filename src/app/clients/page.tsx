'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Plus, Filter, Briefcase, User, Users, Building, AlertCircle, CheckCircle, CreditCard, Lock, Mail, Phone, MapPin } from 'lucide-react';
import styles from './page.module.css';

// Mock Data
const CLIENTS = [
    { id: '1', name: 'Zaffari Bourbon', type: 'client', cnpj: '93.015.006/0001-13', rep: 'João Silva', parentAgency: 'Paim Comunicação', financial: 'active', limit: 50000, lastPurchase: '2 dias atrás' },
    { id: '2', name: 'Paim Comunicação', type: 'agency', cnpj: '88.777.666/0001-22', commission: 15, financial: 'active', limit: 100000, lastPurchase: 'Hoje' },
    { id: '3', name: 'Panvel Farmácias', type: 'client', cnpj: '92.111.222/0001-33', rep: 'Maria Atend.', parentAgency: null, financial: 'active', limit: 30000, lastPurchase: '1 semana atrás' },
    { id: '4', name: 'Agência Escala', type: 'agency', cnpj: '77.888.999/0001-44', commission: 10, financial: 'blocked', limit: 0, lastPurchase: '3 meses atrás' }, // Blocked
    { id: '5', name: 'Mercado do Bairro', type: 'client', cnpj: '12.345.678/0001-90', rep: 'João Silva', parentAgency: null, financial: 'limit_exceeded', limit: 5000, lastPurchase: 'Ontem' },
];

type ClientType = 'all' | 'client' | 'agency' | 'inactive';
type ModalTab = 'registration' | 'commercial' | 'financial' | 'contacts';

export default function ClientsPage() {
    const [activeFilter, setActiveFilter] = useState<ClientType>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<ModalTab>('registration');
    const [formData, setFormData] = useState<any>({ type: 'client' });

    const filteredClients = CLIENTS.filter(client => {
        if (activeFilter === 'client' && client.type !== 'client') return false;
        if (activeFilter === 'agency' && client.type !== 'agency') return false;
        if (activeFilter === 'inactive' && client.financial !== 'blocked') return false;

        const searchLower = searchTerm.toLowerCase();
        return client.name.toLowerCase().includes(searchLower) || client.cnpj.includes(searchLower);
    });

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <h1>Gestão de Carteira</h1>
                    <span className={styles.subtitle}>Clientes & Agências Parceiras</span>
                </div>
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={16} className="mr-2" />
                    Novo Cadastro [F2]
                </Button>
            </header>

            <div className={styles.toolbar}>
                <div className={styles.tabs}>
                    <TabFilter label="Todos" active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} />
                    <TabFilter label="Clientes Diretos" active={activeFilter === 'client'} onClick={() => setActiveFilter('client')} />
                    <TabFilter label="Agências / Parceiros" icon={Briefcase} active={activeFilter === 'agency'} onClick={() => setActiveFilter('agency')} />
                    <TabFilter label="Inativos / Bloqueados" icon={Lock} color="magenta" active={activeFilter === 'inactive'} onClick={() => setActiveFilter('inactive')} />
                </div>
                <div className={styles.searchBox}>
                    <Search size={16} className={styles.searchIcon} />
                    <input
                        className={styles.searchInput}
                        placeholder="Buscar por Nome, CNPJ ou Contato..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.gridContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Empresa / Nome</th>
                            <th style={{ width: 150 }}>Tipo</th>
                            <th>Relacionamento</th>
                            <th style={{ width: 150 }}>Status Financeiro</th>
                            <th style={{ width: 150 }}>Última Compra</th>
                            <th style={{ width: 100, textAlign: 'right' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClients.map(client => (
                            <tr key={client.id} className={client.type === 'agency' ? styles.agencyRow : ''}>
                                <td>
                                    <div className={styles.companyCell}>
                                        <span className={styles.companyName}>{client.name}</span>
                                        <span className={styles.cnpj}>{client.cnpj}</span>
                                    </div>
                                </td>
                                <td>
                                    {client.type === 'agency' ? (
                                        <span className={styles.agencyBadge}><Briefcase size={12} /> Agência</span>
                                    ) : (
                                        <span className={styles.clientBadge}><User size={12} /> Cliente</span>
                                    )}
                                </td>
                                <td>
                                    {client.type === 'agency' ? (
                                        <span className={styles.relationship}>Comissão: <strong>{client.commission}%</strong></span>
                                    ) : (
                                        <div className={styles.relationshipCol}>
                                            <span>Atendido por: <strong>{client.rep}</strong></span>
                                            {client.parentAgency && <span className={styles.linkedAgency}>via {client.parentAgency}</span>}
                                        </div>
                                    )}
                                </td>
                                <td>
                                    <StatusWithIcon status={client.financial} />
                                </td>
                                <td className={styles.lastPurchase}>{client.lastPurchase}</td>
                                <td style={{ textAlign: 'right' }}>
                                    <Button variant="ghost" size="sm">Editar</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* LINKAGE MODAL */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2>Novo Cadastro</h2>
                            <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}><span aria-hidden>×</span></button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.modalTabs}>
                                <ModalTabButton label="Dados Cadastrais" icon={Building} active={activeTab === 'registration'} onClick={() => setActiveTab('registration')} />
                                <ModalTabButton label="Comercial & Vínculos" icon={Briefcase} active={activeTab === 'commercial'} onClick={() => setActiveTab('commercial')} />
                                <ModalTabButton label="Financeiro & Crédito" icon={CreditCard} active={activeTab === 'financial'} onClick={() => setActiveTab('financial')} />
                                <ModalTabButton label="Contatos" icon={Users} active={activeTab === 'contacts'} onClick={() => setActiveTab('contacts')} />
                            </div>

                            <div className={styles.tabContent}>
                                {activeTab === 'registration' && (
                                    <div className={styles.formGrid}>
                                        <div className={styles.formRow}>
                                            <div className={styles.formGroup}>
                                                <label>CNPJ / CPF</label>
                                                <div className={styles.inputWithAction}>
                                                    <Input placeholder="00.000.000/0000-00" />
                                                    <Button variant="outline">🔍 Buscar</Button>
                                                </div>
                                            </div>
                                            <div className={styles.formGroup} style={{ flex: 2 }}>
                                                <label>Razão Social</label>
                                                <Input placeholder="Preenchimento Automático" />
                                            </div>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Nome Fantasia</label>
                                            <Input placeholder="Ex: Panvel Farmácias" />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Classificação (Tipo de Parceiro)</label>
                                            <div className={styles.radioGroup}>
                                                <label className={styles.radioOption}>
                                                    <input
                                                        type="radio"
                                                        name="type"
                                                        checked={formData.type === 'client'}
                                                        onChange={() => setFormData({ ...formData, type: 'client' })}
                                                    />
                                                    <span>Cliente Final</span>
                                                </label>
                                                <label className={styles.radioOption}>
                                                    <input
                                                        type="radio"
                                                        name="type"
                                                        checked={formData.type === 'agency'}
                                                        onChange={() => setFormData({ ...formData, type: 'agency' })}
                                                    />
                                                    <span>Agência / Intermediário</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'commercial' && (
                                    <div className={styles.formGrid}>
                                        {formData.type === 'agency' ? (
                                            <div className={styles.formGroup}>
                                                <label>Comissão / BV Padrão (%)</label>
                                                <Input type="number" placeholder="10" style={{ width: 100 }} />
                                                <p className={styles.helperText}>Este valor será aplicado automaticamente em orçamentos vinculados a esta agência.</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className={styles.formGroup}>
                                                    <label>Vendedor Responsável (Dono da Conta)</label>
                                                    <select className={styles.select}>
                                                        <option>Selecione...</option>
                                                        <option>João Silva</option>
                                                        <option>Maria Atendimento</option>
                                                    </select>
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label>Vínculo com Agência (Quem atende?)</label>
                                                    <Input placeholder="Buscar Agência Parceira (Opcional)" />
                                                    <p className={styles.helperText}>Se preenchido, a agência receberá comissão sobre os jobs deste cliente.</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'financial' && (
                                    <div className={styles.formGrid}>
                                        <div className={styles.formRow}>
                                            <div className={styles.formGroup}>
                                                <label>Condição de Pagamento Padrão</label>
                                                <Input placeholder="Ex: 28 Dias Boleto" />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>Limite de Crédito (R$)</label>
                                                <Input placeholder="50.000,00" />
                                            </div>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>E-mail para NFE/Boleto</label>
                                            <Input placeholder="financeiro@cliente.com.br" />
                                        </div>
                                        <div className={styles.blockToggle}>
                                            <label className={styles.toggleLabel}>
                                                <input type="checkbox" />
                                                <span className={styles.toggleSlider}></span>
                                                Bloquear Novas O.S. (Inadimplente)
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'contacts' && (
                                    <div className={styles.contactsList}>
                                        <div className={styles.contactCard}>
                                            <div className={styles.contactHeader}>
                                                <strong>Mariana Souza</strong>
                                                <span className={`${styles.roleTag} ${styles.creativeTag}`}>Criativo / Arte</span>
                                            </div>
                                            <div className={styles.contactInfo}>
                                                <span><Mail size={12} /> mariana@agencia.com</span>
                                                <span><Phone size={12} /> (51) 99999-9999</span>
                                            </div>
                                        </div>
                                        <div className={styles.contactCard}>
                                            <div className={styles.contactHeader}>
                                                <strong>Roberto Financeiro</strong>
                                                <span className={`${styles.roleTag} ${styles.financeTag}`}>Financeiro</span>
                                            </div>
                                            <div className={styles.contactInfo}>
                                                <span><Mail size={12} /> fin@agencia.com</span>
                                                <span><Phone size={12} /> (51) 3333-3333</span>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" className={styles.addContactBtn}>+ Adicionar Contato</Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                            <Button variant="primary">Salvar Cadastro</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function TabFilter({ label, count, icon: Icon, color, active, onClick }: any) {
    return (
        <button
            className={`${styles.tabFilter} ${active ? styles.activeTabFilter : ''} ${color === 'magenta' ? styles.magentaTab : ''}`}
            onClick={onClick}
        >
            {Icon && <Icon size={14} />}
            {label}
        </button>
    );
}

function StatusWithIcon({ status }: { status: string }) {
    if (status === 'active') return <span className={styles.statusActive}><CheckCircle size={14} /> Liberado</span>;
    if (status === 'blocked') return <span className={styles.statusBlocked}><AlertCircle size={14} /> Bloqueado</span>;
    if (status === 'limit_exceeded') return <span className={styles.statusWarning}><AlertCircle size={14} /> Limite Excedido</span>;
    return null;
}

function ModalTabButton({ label, icon: Icon, active, onClick }: any) {
    return (
        <button className={`${styles.modalTabBtn} ${active ? styles.activeModalTab : ''}`} onClick={onClick}>
            <Icon size={16} />
            {label}
        </button>
    );
}
