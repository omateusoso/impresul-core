'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Search, Filter, Plus, User, Mail, Phone, Shield, Briefcase, Settings, ToggleLeft, ToggleRight, Check, X, Camera } from 'lucide-react';
import styles from './page.module.css';

// Types
type AccessRole = 'admin' | 'manager' | 'editor' | 'viewer' | 'operator';
type Department = 'sales' | 'prepress' | 'printing' | 'finishing' | 'logistics' | 'admin' | 'director';

interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: AccessRole;
    department: Department;
    jobTitle: string;
    active: boolean;
    lastLogin: string;
    skills: string[]; // Operational Tags
}

// Mock Data
const TEAM_MEMBERS: UserProfile[] = [
    {
        id: 'EX-001', name: 'Carlos Vendedor', email: 'carlos@impresul.com',
        role: 'editor', department: 'sales', jobTitle: 'Executivo de Contas', active: true, lastLogin: 'Hoje 08:30',
        skills: ['prospecting', 'negotiation']
    },
    {
        id: 'OP-045', name: 'Jorge Impressor', email: 'jorge.gto@impresul.com',
        role: 'operator', department: 'printing', jobTitle: 'Impressor Offset I', active: true, lastLogin: 'Hoje 07:15',
        skills: ['heidelberg_xl', 'gto_52', 'maintenance_lvl1']
    },
    {
        id: 'PP-012', name: 'Felipe Design', email: 'felipe@impresul.com',
        role: 'editor', department: 'prepress', jobTitle: 'Arte-Finalista Sr', active: true, lastLogin: 'Ontem 18:00',
        skills: ['preflight', 'ctp_output', 'color_proof']
    },
    {
        id: 'DIR-001', name: 'Roberto Boss', email: 'roberto@impresul.com',
        role: 'admin', department: 'director', jobTitle: 'Diretor Geral', active: true, lastLogin: 'Hoje 10:00',
        skills: ['all_access']
    }
];

export default function TeamPage() {
    const [members, setMembers] = useState<UserProfile[]>(TEAM_MEMBERS);
    const [selectedMember, setSelectedMember] = useState<UserProfile | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTab, setModalTab] = useState<1 | 2 | 3>(1);

    // Modal State (Simplified for mockup)
    const [formData, setFormData] = useState<Partial<UserProfile>>({});

    const handleEditUser = (user: UserProfile) => {
        setSelectedMember(user);
        setFormData(user);
        setModalTab(1);
        setIsModalOpen(true);
    };

    const handleNewUser = () => {
        setSelectedMember(null);
        setFormData({ active: true, skills: [] });
        setModalTab(1);
        setIsModalOpen(true);
    };

    const toggleStatus = (id: string) => {
        setMembers(prev => prev.map(m => m.id === id ? { ...m, active: !m.active } : m));
    };

    const getDeptColor = (dept: Department) => {
        const map = {
            sales: 'blue', prepress: 'cyan', printing: 'orange', finishing: 'purple',
            logistics: 'green', admin: 'gray', director: 'black'
        };
        return map[dept] || 'gray';
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <h1>Gestão de Equipe</h1>
                    <span className={styles.subtitle}>Diretório de Colaboradores & Controle de Acesso (RBAC)</span>
                </div>
                <div className={styles.actions}>
                    <Button variant="primary" onClick={handleNewUser}>
                        <Plus size={16} className="mr-2" /> Novo Colaborador
                    </Button>
                </div>
            </header>

            <div className={styles.gridContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Colaborador</th>
                            <th>Cargo / Função</th>
                            <th>Departamento</th>
                            <th>Nível Acesso</th>
                            <th>Último Login</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map(user => (
                            <tr key={user.id} className={!user.active ? styles.inactiveRow : ''}>
                                <td>
                                    <div className={styles.userCell}>
                                        <div className={styles.avatar}>{user.name.charAt(0)}</div>
                                        <div className={styles.userInfo}>
                                            <span className={styles.userName}>{user.name}</span>
                                            <span className={styles.userEmail}>{user.email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>{user.jobTitle}</td>
                                <td><DeptBadge dept={user.department} /></td>
                                <td>
                                    <span className={styles.roleBadge}>{user.role}</span>
                                </td>
                                <td className={styles.metaText}>{user.lastLogin}</td>
                                <td>
                                    <button className={styles.toggleBtn} onClick={() => toggleStatus(user.id)}>
                                        {user.active ? <ToggleRight size={24} className="text-green-600" /> : <ToggleLeft size={24} className="text-gray-400" />}
                                    </button>
                                </td>
                                <td>
                                    <button className={styles.iconBtn} onClick={() => handleEditUser(user)}>
                                        <Settings size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* USER WIZARD MODAL */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2>{selectedMember ? 'Editar Colaborador' : 'Novo Colaborador'}</h2>
                            <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>×</button>
                        </div>

                        <div className={styles.wizardTabs}>
                            <button className={`${styles.wizTab} ${modalTab === 1 ? styles.wizTabActive : ''}`} onClick={() => setModalTab(1)}>
                                <User size={16} /> 1. Dados Pessoais
                            </button>
                            <button className={`${styles.wizTab} ${modalTab === 2 ? styles.wizTabActive : ''}`} onClick={() => setModalTab(2)}>
                                <Briefcase size={16} /> 2. Operacional
                            </button>
                            <button className={`${styles.wizTab} ${modalTab === 3 ? styles.wizTabActive : ''}`} onClick={() => setModalTab(3)}>
                                <Shield size={16} /> 3. Segurança & Acesso
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            {modalTab === 1 && (
                                <div className={styles.formGrid}>
                                    <div className={styles.photoArea}>
                                        <div className={styles.largeAvatar}>{formData.name ? formData.name.charAt(0) : '?'}</div>
                                        <Button variant="secondary" size="sm">
                                            <Camera size={14} className="mr-2" /> Alterar Foto
                                        </Button>
                                    </div>
                                    <div className={styles.inputsArea}>
                                        <div className={styles.formGroup}>
                                            <label>Nome Completo</label>
                                            <input className={styles.input} defaultValue={formData.name} placeholder="Nome do funcionário" />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>E-mail Corporativo</label>
                                            <input className={styles.input} defaultValue={formData.email} placeholder="email@impresul.com" />
                                        </div>
                                        <div className={styles.row}>
                                            <div className={styles.formGroup}>
                                                <label>CPF (Login)</label>
                                                <input className={styles.input} placeholder="000.000.000-00" />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>WhatsApp</label>
                                                <input className={styles.input} placeholder="(51) 99999-9999" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalTab === 2 && (
                                <div className={styles.opsArea}>
                                    <div className={styles.formGroup}>
                                        <label>Departamento (Vínculo Principal)</label>
                                        <select className={styles.select} defaultValue={formData.department}>
                                            <option value="sales">Comercial / Vendas</option>
                                            <option value="prepress">Pré-Impressão / Design</option>
                                            <option value="printing">Impressão (Fábrica)</option>
                                            <option value="finishing">Acabamento</option>
                                            <option value="logistics">Expedição</option>
                                            <option value="admin">Administrativo</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Cargo Específico</label>
                                        <input className={styles.input} defaultValue={formData.jobTitle} placeholder="Ex: Operador Heidelberg I" />
                                    </div>

                                    <div className={styles.skillsSection}>
                                        <label>Habilidades & Tags Operacionais</label>
                                        <p className={styles.helperText}>Ao marcar estas opções, o colaborador aparecerá nas listas de seleção das respectivas máquinas.</p>

                                        <div className={styles.tagsGrid}>
                                            <label className={styles.checkCard}>
                                                <input type="checkbox" defaultChecked={formData.skills?.includes('heidelberg_xl')} />
                                                <span>Operar Heidelberg XL</span>
                                            </label>
                                            <label className={styles.checkCard}>
                                                <input type="checkbox" defaultChecked={formData.skills?.includes('gto_52')} />
                                                <span>Operar GTO 52</span>
                                            </label>
                                            <label className={styles.checkCard}>
                                                <input type="checkbox" defaultChecked={formData.skills?.includes('digital_konica')} />
                                                <span>Operar Konica Minolta</span>
                                            </label>
                                            <label className={styles.checkCard}>
                                                <input type="checkbox" defaultChecked={formData.skills?.includes('preflight')} />
                                                <span>Realizar Preflight/Chapa</span>
                                            </label>
                                            <label className={styles.checkCard}>
                                                <input type="checkbox" defaultChecked={formData.skills?.includes('finishing_guillotine')} />
                                                <span>Operar Guilhotina</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalTab === 3 && (
                                <div className={styles.permissionArea}>
                                    <div className={styles.roleSelector}>
                                        <label>Perfil de Acesso (Role Preset)</label>
                                        <select className={styles.select} defaultValue={formData.role}>
                                            <option value="admin">Diretor / Admin (Acesso Total)</option>
                                            <option value="manager">Gerente de Setor (Edição Total no Depto)</option>
                                            <option value="editor">Vendedor / Editor (Acesso Restrito)</option>
                                            <option value="operator">Operador / Fábrica (Apenas Tarefas)</option>
                                            <option value="viewer">Visualizador (Apenas Leitura)</option>
                                        </select>
                                    </div>

                                    <div className={styles.permissionChecklist}>
                                        <h4>Resumo de Permissões:</h4>
                                        <ul className={styles.permList}>
                                            <li className={styles.permItem}><Check size={14} className="text-green-600" /> Acesso ao Dashboard</li>
                                            <li className={styles.permItem}><Check size={14} className="text-green-600" /> Criar Ordens de Serviço</li>
                                            <li className={styles.permItem}><X size={14} className="text-red-500" /> Visualizar Custos e Margens</li>
                                            <li className={styles.permItem}><X size={14} className="text-red-500" /> Excluir Registros</li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={styles.modalFooter}>
                            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                            <Button variant="primary" onClick={() => { setIsModalOpen(false); alert('Usuário salvo com sucesso!'); }}>
                                Salvar Colaborador
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function DeptBadge({ dept }: { dept: string }) {
    const config: any = {
        sales: { label: 'Comercial', color: '#1d4ed8', bg: '#dbeafe' },
        prepress: { label: 'Pré-Impressão', color: '#0891b2', bg: '#cffafe' },
        printing: { label: 'Impressão', color: '#ea580c', bg: '#ffedd5' },
        finishing: { label: 'Acabamento', color: '#9333ea', bg: '#f3e8ff' },
        logistics: { label: 'Expedição', color: '#16a34a', bg: '#dcfce7' },
        director: { label: 'Diretoria', color: '#ffffff', bg: '#0f172a' },
        admin: { label: 'Adm', color: '#475569', bg: '#f1f5f9' },
    };

    const style = config[dept] || config.admin;

    return (
        <span className={styles.deptBadge} style={{ color: style.color, backgroundColor: style.bg }}>
            {style.label}
        </span>
    );
}
