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

    // Mock Empty State Toggle for Demo Purpose
    const [isEmptyState, setIsEmptyState] = useState(INVENTORY_ITEMS.length === 0);

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
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.breadcrumb}>
                    <span>Home</span> / <span className={styles.activeBreadcrumb}>Estoque</span>
                </div>
                <div className={styles.headerContent}>
                    <div className={styles.headerTitle}>
                        <h1>Gestão de Estoque</h1>
                    </div>
                    <div className={styles.actions}>
                        <Button variant="outline">
                            <Layers size={16} className="mr-2" />
                            Configurar Categorias
                        </Button>
                        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                            <Plus size={16} className="mr-2" />
                            Novo Item [F2]
                        </Button>
                    </div>
                </div>
            </header>

            {!isEmptyState ? (
                <>
                    {/* Toolbar */}
                    <div className={styles.toolbar}>
                        <div className={styles.searchBox}>
                            <Search size={18} className={styles.searchIcon} />
                            <input
                                className={styles.searchInput}
                                placeholder="Buscar por nome, código ou fabricante..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className={styles.filters}>
                            <select className={styles.filterSelect} onChange={(e) => setActiveFilter(e.target.value as any)}>
                                <option value="all">Todas Categorias</option>
                                <option value="offset">Papéis Offset</option>
                                <option value="visual">Comunicação Visual</option>
                                <option value="supply">Insumos</option>
                            </select>
                            <select className={styles.filterSelect}>
                                <option>Status: Todos</option>
                                <option>Em Estoque</option>
                                <option>Baixo</option>
                                <option>Crítico</option>
                            </select>
                            <select className={styles.filterSelect}>
                                <option>Máquina: Todas</option>
                                <option>Heidelberg</option>
                                <option>Plotter</option>
                            </select>
                        </div>
                    </div>

                    {/* Grid Content */}
                    <div className={styles.grid}>
                        {filteredItems.map(item => (
                            <InventoryCard key={item.id} item={item} />
                        ))}
                    </div>
                </>
            ) : (
                /* Empty State */
                <div className={styles.emptyState}>
                    <div className={styles.emptyIllustration}>
                        <Package size={64} strokeWidth={1} />
                    </div>
                    <h2>Seu almoxarifado está vazio</h2>
                    <p>Cadastre suas matérias-primas para que o sistema possa calcular orçamentos automáticos. Você pode cadastrar papéis, tintas, chapas ou qualquer insumo.</p>
                    <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                        Cadastrar Primeiro Material
                    </Button>
                </div>
            )}

            {/* SMART MODAL */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2>Novo Material de Estoque</h2>
                            <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.modalTabs}>
                                <TabButton label="1. Definição" icon={Package} active={activeTab === 'identity'} onClick={() => setActiveTab('identity')} />
                                <TabButton label="2. Custos & Estoque" icon={History} active={activeTab === 'rules'} onClick={() => setActiveTab('rules')} />
                                <TabButton label="3. Vínculos" icon={Printer} active={activeTab === 'compatibility'} onClick={() => setActiveTab('compatibility')} />
                            </div>

                            <div className={styles.tabContent}>
                                {activeTab === 'identity' && (
                                    <div className={styles.formGrid}>
                                        <div className={styles.formGroup}>
                                            <label>NOME DO MATERIAL</label>
                                            <Input placeholder="Ex: Vinil Adesivo 3M Fosco" />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>CATEGORIA</label>
                                            {/* Simulate Creatable Select */}
                                            <select className={styles.select}>
                                                <option>Selecionar ou digitar...</option>
                                                <option>Papéis</option>
                                                <option>Tintas</option>
                                                <option>Filamentos</option>
                                            </select>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>FORMATO DE ENTRADA</label>
                                            <div className={styles.formatSelector}>
                                                <FormatOption
                                                    icon={Layers}
                                                    label="Folha/Unidade"
                                                    desc="Papel, Chapas"
                                                    active={formData.type === 'rigid'}
                                                    onClick={() => setFormData({ ...formData, type: 'rigid' })}
                                                />
                                                <FormatOption
                                                    icon={Archive}
                                                    label="Rolo/Bobina"
                                                    desc="Lona, Vinil"
                                                    active={formData.type === 'roll'}
                                                    onClick={() => setFormData({ ...formData, type: 'roll' })}
                                                />
                                                <FormatOption
                                                    icon={AlertTriangle}
                                                    label="Líquido/Peso"
                                                    desc="Tintas, Resina"
                                                    active={formData.type === 'supply'}
                                                    onClick={() => setFormData({ ...formData, type: 'supply' })}
                                                />
                                            </div>
                                        </div>

                                        {formData.type === 'rigid' && (
                                            <div className={styles.row}>
                                                <InputAdornment label="LARGURA" suffix="mm" placeholder="660" />
                                                <InputAdornment label="ALTURA" suffix="mm" placeholder="960" />
                                                <InputAdornment label="GRAMATURA" suffix="g/m²" placeholder="300" />
                                            </div>
                                        )}
                                        {formData.type === 'roll' && (
                                            <div className={styles.row}>
                                                <InputAdornment label="LARGURA BOBINA" suffix="m" placeholder="1.20" />
                                                <InputAdornment label="COMPRIMENTO" suffix="m" placeholder="50" />
                                            </div>
                                        )}
                                        {formData.type === 'supply' && (
                                            <div className={styles.row}>
                                                <InputAdornment label="VOLUME" suffix="L/Kg" placeholder="1" />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'rules' && ( // Reusing 'rules' tab for Costs & Stock as per plan
                                    <div className={styles.formGrid}>
                                        <div className={styles.row}>
                                            <div className={styles.formGroup}>
                                                <label>CUSTO DE REPOSIÇÃO</label>
                                                <div className={styles.adornmentWrapper}>
                                                    <div className={styles.prefix}>R$</div>
                                                    <input className={styles.adornmentInput} placeholder="0,00" type="number" />
                                                </div>
                                                <p className={styles.helperText}>Valor pago ao fornecedor por unidade de compra.</p>
                                            </div>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>UNIDADE DE COMPRA VS. USO</label>
                                            <div className={styles.row}>
                                                <div className={styles.radioGroup}>
                                                    <label><input type="radio" name="unit" defaultChecked /> Pacote/Caixa</label>
                                                    <label><input type="radio" name="unit" /> Unidade Solta</label>
                                                </div>
                                            </div>
                                            <div className={styles.calculationPreview}>
                                                <span>Custo calculado por unidade: <strong>R$ 0,20</strong></span>
                                            </div>
                                        </div>

                                        <div className={styles.row}>
                                            <InputAdornment label="ESTOQUE MÍNIMO" suffix="un" placeholder="10" />
                                            <div className={styles.formGroup} style={{ flex: 2 }}>
                                                <label>LOCALIZAÇÃO FÍSICA</label>
                                                <Input placeholder="Corredor B, Prateleira 2" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'compatibility' && (
                                    <div className={styles.formGrid}>
                                        <p className={styles.helperText}>Marque onde este material pode ser utilizado:</p>
                                        <div className={styles.checkboxGrid}>
                                            {MACHINES.offset.map(m => (
                                                <CheckboxCard
                                                    key={m.id}
                                                    label={m.name}
                                                    checked={formData.compatibleMachines?.includes(m.name)}
                                                    onChange={() => handleMachineToggle(m.name)}
                                                />
                                            ))}
                                            {MACHINES.plotter.map(m => (
                                                <CheckboxCard
                                                    key={m.id}
                                                    label={m.name}
                                                    checked={formData.compatibleMachines?.includes(m.name)}
                                                    onChange={() => handleMachineToggle(m.name)}
                                                />
                                            ))}
                                        </div>

                                        {/* Mock Empty State for Machines */}
                                        {/* <div className={styles.emptyTabState}>
                                            <p>Nenhuma máquina cadastrada.</p>
                                            <Button variant="link">Cadastrar Uma Máquina</Button>
                                        </div> */}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                            <div className={styles.footerActions}>
                                <Button variant="outline">Salvar e Cadastrar Outro</Button>
                                <Button variant="primary" onClick={() => {
                                    setIsModalOpen(false);
                                    setIsEmptyState(false); // Demo transition
                                }}>
                                    Salvar e Fechar
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function FormatOption({ icon: Icon, label, desc, active, onClick }: any) {
    return (
        <div className={`${styles.formatOption} ${active ? styles.activeFormat : ''}`} onClick={onClick}>
            <Icon size={24} />
            <div className={styles.formatInfo}>
                <span className={styles.formatLabel}>{label}</span>
                <span className={styles.formatDesc}>{desc}</span>
            </div>
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
