'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Plus, Filter, Package, AlertTriangle, Printer, Archive, Layers, Ruler, History, Trash2, X, Save, CheckSquare, Square } from 'lucide-react';
import styles from './page.module.css';
import { INVENTORY_ITEMS, InventoryItem, MACHINES } from '@/lib/inventoryData';

type FilterType = 'all' | 'offset' | 'visual' | 'supply';
type ModalTab = 'identity' | 'specs' | 'compatibility' | 'rules';

export default function StockPage() {
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<ModalTab>('identity');

    // Modal Form State (Mocked for UI demo)
    const [formData, setFormData] = useState<Partial<InventoryItem>>({
        type: 'rigid',
        compatibleMachines: []
    });

    const filteredItems = INVENTORY_ITEMS.filter(item => {
        const matchesFilter = activeFilter === 'all' || item.category === activeFilter;
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.internalCode.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleMachineToggle = (machineName: string) => {
        const current = formData.compatibleMachines || [];
        const updated = current.includes(machineName)
            ? current.filter(m => m !== machineName)
            : [...current, machineName];
        setFormData({ ...formData, compatibleMachines: updated });
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <h1>Gestão de Estoque</h1>
                    <span className={styles.badge}>{INVENTORY_ITEMS.length} Itens</span>
                </div>
                <div className={styles.actions}>
                    <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                        <Plus size={16} className="mr-2" />
                        Novo Substrato [F2]
                    </Button>
                </div>
            </header>

            <div className={styles.toolbar}>
                <div className={styles.filterPills}>
                    <FilterPill label="Todos" active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} />
                    <FilterPill label="Offset (Papéis)" active={activeFilter === 'offset'} onClick={() => setActiveFilter('offset')} />
                    <FilterPill label="Comunicação Visual" active={activeFilter === 'visual'} onClick={() => setActiveFilter('visual')} />
                    <FilterPill label="Insumos" active={activeFilter === 'supply'} onClick={() => setActiveFilter('supply')} />
                </div>
                <div className={styles.searchBox}>
                    <Search size={16} className={styles.searchIcon} />
                    <input
                        className={styles.searchInput}
                        placeholder="Buscar material..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.grid}>
                {filteredItems.map(item => (
                    <InventoryCard key={item.id} item={item} />
                ))}
            </div>

            {/* SMART MODAL */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2>Cadastrar Novo Material</h2>
                            <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.modalTabs}>
                                <TabButton label="Identidade" icon={Package} active={activeTab === 'identity'} onClick={() => setActiveTab('identity')} />
                                <TabButton label="Especificações" icon={Ruler} active={activeTab === 'specs'} onClick={() => setActiveTab('specs')} />
                                <TabButton label="Compatibilidade" icon={Printer} active={activeTab === 'compatibility'} onClick={() => setActiveTab('compatibility')} />
                                <TabButton label="Regras & Histórico" icon={History} active={activeTab === 'rules'} onClick={() => setActiveTab('rules')} />
                            </div>

                            <div className={styles.tabContent}>
                                {activeTab === 'identity' && (
                                    <div className={styles.formGrid}>
                                        <div className={styles.formGroup}>
                                            <label>Tipo de Material</label>
                                            <select
                                                className={styles.select}
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                            >
                                                <option value="rigid">Substrato Rígido/Folha (Papel, PS)</option>
                                                <option value="roll">Substrato Flexível/Rolo (Lona, Vinil)</option>
                                                <option value="supply">Insumo de Máquina (Tinta)</option>
                                            </select>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Nome Comercial</label>
                                            <Input placeholder="Ex: Couché Brilho Suzano" />
                                        </div>
                                        <div className={styles.row}>
                                            <div className={styles.formGroup}>
                                                <label>Código Interno</label>
                                                <Input placeholder="Gerar Automático" />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>Fabricante</label>
                                                <select className={styles.select}>
                                                    <option>Suzano</option>
                                                    <option>Klabin</option>
                                                    <option>3M</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className={styles.row}>
                                            <div className={styles.formGroup}>
                                                <label>Custo Reposição (R$)</label>
                                                <Input type="number" placeholder="0,00" />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>Unidade</label>
                                                <select className={styles.select}>
                                                    {formData.type === 'rigid' ? (
                                                        <>
                                                            <option>Resma (500fls)</option>
                                                            <option>Folha Solta</option>
                                                            <option>Milheiro</option>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <option>Rolo</option>
                                                            <option>Metro Linear</option>
                                                            <option>m²</option>
                                                        </>
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'specs' && (
                                    <div className={styles.formGrid}>
                                        {formData.type === 'rigid' ? (
                                            <>
                                                <div className={styles.row}>
                                                    <InputAdornment label="Gramatura" suffix="g/m²" placeholder="150" />
                                                    <InputAdornment label="Espessura" suffix="micras" placeholder="---" />
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label>Dimensões do Padrão</label>
                                                    <div className={styles.row}>
                                                        <InputAdornment suffix="mm" placeholder="Largura (660)" />
                                                        <span style={{ alignSelf: 'center' }}>x</span>
                                                        <InputAdornment suffix="mm" placeholder="Altura (960)" />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className={styles.row}>
                                                    <InputAdornment label="Largura da Bobina" suffix="m" placeholder="3.20" />
                                                    <InputAdornment label="Comprimento do Rolo" suffix="m" placeholder="50" />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'compatibility' && (
                                    <div className={styles.formGrid}>
                                        <p className={styles.helperText}>Marque onde este material pode ser utilizado:</p>

                                        <h4 className={styles.groupTitle}>Offset & Digital Sheet</h4>
                                        <div className={styles.checkboxGrid}>
                                            {MACHINES.offset.map(m => (
                                                <CheckboxCard
                                                    key={m.id}
                                                    label={m.name}
                                                    checked={formData.compatibleMachines?.includes(m.name)}
                                                    onChange={() => handleMachineToggle(m.name)}
                                                />
                                            ))}
                                        </div>

                                        <h4 className={styles.groupTitle} style={{ marginTop: '1rem' }}>Grande Formato</h4>
                                        <div className={styles.checkboxGrid}>
                                            {MACHINES.plotter.map(m => (
                                                <CheckboxCard
                                                    key={m.id}
                                                    label={m.name}
                                                    checked={formData.compatibleMachines?.includes(m.name)}
                                                    onChange={() => handleMachineToggle(m.name)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'rules' && (
                                    <div className={styles.formGrid}>
                                        <div className={styles.row}>
                                            <InputAdornment label="Estoque Mínimo (Ponto de Pedido)" suffix="un" placeholder="5" />
                                            <div className={styles.formGroup} style={{ flex: 2 }}>
                                                <label>Localização Física</label>
                                                <Input placeholder="Ex: Corredor B, Prateleira 4" />
                                            </div>
                                        </div>

                                        <div className={styles.historyLog}>
                                            <h4>Histórico Recente (Log)</h4>
                                            <table className={styles.logTable}>
                                                <thead>
                                                    <tr>
                                                        <th>Data</th>
                                                        <th>Tipo</th>
                                                        <th>Qtd</th>
                                                        <th>Usuário</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>29/01 14:30</td>
                                                        <td style={{ color: '#16a34a' }}>Entrada</td>
                                                        <td>+50</td>
                                                        <td>Mateus</td>
                                                    </tr>
                                                    <tr>
                                                        <td>28/01 09:15</td>
                                                        <td style={{ color: '#111' }}>Saída</td>
                                                        <td>-5</td>
                                                        <td>Jão</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <button className={styles.deleteButton}>
                                <Trash2 size={16} /> Excluir Material
                            </button>
                            <div className={styles.footerActions}>
                                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                                <Button variant="primary">
                                    <Save size={16} className="mr-2" />
                                    Salvar Alterações
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function FilterPill({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            className={`${styles.filterPill} ${active ? styles.activePill : ''}`}
            onClick={onClick}
        >
            {label}
        </button>
    );
}

function InventoryCard({ item }: { item: InventoryItem }) {
    const isLowStock = item.stock <= item.minStock;

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.cardTitleType}>
                    <span className={styles.typeBadge}>{item.type === 'rigid' ? 'Folha' : item.type === 'roll' ? 'Rolo' : 'Insumo'}</span>
                    <h3>{item.name}</h3>
                </div>
                {isLowStock && (
                    <div className={styles.lowStockBadge}>
                        <AlertTriangle size={14} /> Baixo
                    </div>
                )}
            </div>

            <div className={styles.cardStats}>
                <div className={styles.stat}>
                    <span className={styles.statLabel}>Estoque</span>
                    <span className={`${styles.statValue} ${isLowStock ? styles.textDanger : ''}`}>
                        {item.stock} <small>{item.unit}</small>
                    </span>
                </div>
                <div className={styles.stat}>
                    <span className={styles.statLabel}>Custo</span>
                    <span className={styles.statValue}>R$ {item.cost.toFixed(2)}</span>
                </div>
            </div>

            <div className={styles.cardFooter}>
                <div className={styles.machineTags}>
                    {item.compatibleMachines.slice(0, 3).map((machine, i) => (
                        <span key={i} className={styles.machineTag}>{machine.split(' ')[0]}</span>
                    ))}
                    {item.compatibleMachines.length > 3 && <span className={styles.machineTag}>+2</span>}
                </div>
                <span className={styles.location}>{item.location}</span>
            </div>
        </div>
    );
}

function TabButton({ label, icon: Icon, active, onClick }: any) {
    return (
        <button className={`${styles.tabButton} ${active ? styles.activeTab : ''}`} onClick={onClick}>
            <Icon size={16} />
            {label}
        </button>
    );
}

function InputAdornment({ label, suffix, placeholder }: any) {
    return (
        <div className={styles.formGroup}>
            {label && <label>{label}</label>}
            <div className={styles.adornmentWrapper}>
                <input className={styles.adornmentInput} placeholder={placeholder} type="number" />
                <div className={styles.suffix}>{suffix}</div>
            </div>
        </div>
    );
}

function CheckboxCard({ label, checked, onChange }: any) {
    return (
        <div
            className={`${styles.checkboxCard} ${checked ? styles.checkedCard : ''}`}
            onClick={onChange}
        >
            <div className={styles.checkboxIcon}>
                {checked ? <CheckSquare size={18} /> : <Square size={18} />}
            </div>
            <span>{label}</span>
        </div>
    );
}
