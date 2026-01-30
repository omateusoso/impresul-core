'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Search, Filter, Droplet, Scissors, Layers, Box, CheckSquare, AlertTriangle, Play, Pause, FolderOpen, MapPin, Wrench, Download, Clock, PlusCircle } from 'lucide-react';
import styles from './page.module.css';

// Types
type ProcessStage = 'ennoblement' | 'cutting' | 'manual';
type DieStatus = 'good' | 'maintenance' | 'missing';

interface Job {
    id: string;
    client: string;
    jobTitle: string;
    stage: ProcessStage;
    specs: string[]; // e.g., "Verniz Local", "Faca #2091"
    dieCutId?: string;
    quantity: number;
    notes?: string;
    awaitingDrying?: boolean; // New: For Ennoblement
}

interface DieCut {
    id: string;
    name: string;
    location: string;
    status: DieStatus;
    dims: string;
}

// Mock Data - Jobs (Moved from Finishing)
const INITIAL_JOBS: Job[] = [
    { id: '109237', client: 'Zaffari', jobTitle: 'Cartazes A3 Verão', stage: 'ennoblement', specs: ['Verniz Total UV', 'Frente'], quantity: 5000, awaitingDrying: true },
    { id: '109241', client: 'Tramontina', jobTitle: 'Caixa Faqueiro', stage: 'cutting', specs: ['Corte e Vinco', 'Microondulado'], dieCutId: 'F-3301', quantity: 1500 },
    { id: '109245', client: 'Panvel', jobTitle: 'Envelope Dízimo', stage: 'manual', specs: ['Colagem Lateral', 'Dobra'], dieCutId: 'F-2091', quantity: 10000 },
];

// Mock Data - Die Library
const DIE_LIBRARY: DieCut[] = [
    { id: 'F-3301', name: 'Caixa Padrão G', location: 'Corredor B, Gancho 12', status: 'good', dims: '30x40x10' },
    { id: 'F-2091', name: 'Envelope Saco P', location: 'Corredor A, Gaveta 3', status: 'maintenance', dims: '15x20' },
    { id: 'F-1002', name: 'Pasta Orelha Redonda', location: 'Corredor C, Alta', status: 'good', dims: '45x32' },
];

export default function CuttingPage() {
    const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [isOperatorModalOpen, setIsOperatorModalOpen] = useState(false);
    const [librarySearch, setLibrarySearch] = useState('');

    const filteredDies = DIE_LIBRARY.filter(die =>
        die.name.toLowerCase().includes(librarySearch.toLowerCase()) ||
        die.id.toLowerCase().includes(librarySearch.toLowerCase())
    );

    const handleJobClick = (job: Job) => {
        setSelectedJob(job);
        setIsOperatorModalOpen(true);
    };

    const getDieStatus = (dieId: string | undefined) => {
        if (!dieId) return null;
        return DIE_LIBRARY.find(d => d.id === dieId) || null;
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <h1>Corte, Vinco & Enobrecimento</h1>
                    <span className={styles.subtitle}>Gestão de Facas e Processos Pós-Impressão</span>
                </div>
                <div className={styles.headerActions}>
                    <Button variant="secondary" onClick={() => setIsLibraryOpen(true)}>
                        <FolderOpen size={16} className="mr-2" />
                        Acervo de Facas
                    </Button>
                </div>
            </header>

            <div className={styles.kanbanBoard}>
                {/* 1. Ennoblement */}
                <KanbanColumn title="Enobrecimento (Verniz/Lam)" icon={Droplet} color="purple">
                    {jobs.filter(j => j.stage === 'ennoblement').map(job => (
                        <JobCard key={job.id} job={job} onClick={() => handleJobClick(job)} />
                    ))}
                </KanbanColumn>

                {/* 2. Cutting */}
                <KanbanColumn title="Corte e Vinco" icon={Scissors} color="orange">
                    {jobs.filter(j => j.stage === 'cutting').map(job => (
                        <JobCard key={job.id} job={job} onClick={() => handleJobClick(job)} />
                    ))}
                </KanbanColumn>

                {/* 3. Manual */}
                <KanbanColumn title="Acabamento Final" icon={Box} color="green">
                    {jobs.filter(j => j.stage === 'manual').map(job => (
                        <JobCard key={job.id} job={job} onClick={() => handleJobClick(job)} />
                    ))}
                </KanbanColumn>
            </div>

            {/* DIE CUT LIBRARY MODAL */}
            {isLibraryOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.libraryModal}>
                        <div className={styles.modalHeader}>
                            <h2>Biblioteca de Facas e Matrizes</h2>
                            <button className={styles.closeBtn} onClick={() => setIsLibraryOpen(false)}>×</button>
                        </div>
                        <div className={styles.libraryBody}>
                            <div className={styles.searchBar}>
                                <Search size={20} className={styles.searchIcon} />
                                <input
                                    placeholder="Buscar por ID (#F-XXX) ou Nome (Caixa Pizza...)"
                                    value={librarySearch}
                                    onChange={(e) => setLibrarySearch(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className={styles.resultsGrid}>
                                {filteredDies.map(die => (
                                    <div key={die.id} className={styles.dieCard}>
                                        <div className={styles.dieHeader}>
                                            <span className={styles.dieIdBadge}>{die.id}</span>
                                            <DieStatusBadge status={die.status} />
                                        </div>
                                        <h4>{die.name}</h4>
                                        <div className={styles.dieMeta}>
                                            <div className={styles.metaRow}>
                                                <MapPin size={14} /> {die.location}
                                            </div>
                                            <div className={styles.metaRow}>
                                                <Layers size={14} /> {die.dims}
                                            </div>
                                        </div>
                                        <div className={styles.dieActions}>
                                            <Button variant="outline" size="sm" className="w-full mt-2">
                                                <Download size={14} className="mr-2" /> Baixar DXF
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* OPERATOR SETUP MODAL */}
            {isOperatorModalOpen && selectedJob && (
                <div className={styles.modalOverlay}>
                    <div className={styles.operatorModal}>
                        <div className={styles.modalHeader}>
                            <div className={styles.jobInfo}>
                                <h2>#{selectedJob.id} - {selectedJob.client}</h2>
                                <span className={styles.jobBreadcrumb}>{selectedJob.jobTitle}</span>
                            </div>
                            <button className={styles.closeBtn} onClick={() => setIsOperatorModalOpen(false)}>×</button>
                        </div>

                        <div className={styles.splitBody}>
                            {/* BLOCK A: THE TOOL (Ferramenta) */}
                            <div className={styles.panelBlockA}>
                                <div className={styles.sectionTitle}>Bloco A: A Ferramenta</div>
                                {selectedJob.dieCutId ? (
                                    (() => {
                                        const die = getDieStatus(selectedJob.dieCutId);
                                        if (die) {
                                            return (
                                                <div className={styles.assetCard}>
                                                    <div className={styles.assetHeader}>
                                                        <Scissors size={18} />
                                                        <span>Faca Solicitada</span>
                                                    </div>
                                                    <div className={styles.assetMain}>
                                                        <span className={styles.bigId}>{die.id}</span>
                                                        <DieStatusBadge status={die.status} />
                                                    </div>
                                                    <div className={styles.assetLocation}>
                                                        <MapPin size={14} /> {die.location}
                                                    </div>
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div className={styles.alertCard}>
                                                    <AlertTriangle size={24} />
                                                    <div>
                                                        <h4>Faca Nova Necessária</h4>
                                                        <p>Solicitar confecção com terceiro.</p>
                                                        <Button size="sm" className="mt-2 bg-pink-600 text-white hover:bg-pink-700">Solicitar Faca</Button>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    })()
                                ) : (
                                    <div className={styles.infoBox}>
                                        <Droplet size={18} />
                                        <span>Processo químico/manual. Sem matriz física.</span>
                                    </div>
                                )}
                            </div>

                            {/* BLOCK B: SPECS */}
                            <div className={styles.panelBlockB}>
                                <div className={styles.sectionTitle}>Bloco B: Especificações</div>
                                <div className={styles.specsList}>
                                    {selectedJob.stage === 'ennoblement' && (
                                        <>
                                            <div className={styles.specRow}><strong>Tipo:</strong> Verniz UV Total</div>
                                            <div className={styles.specRow}><strong>Face:</strong> Frente e Verso</div>
                                            {selectedJob.awaitingDrying && (
                                                <div className={styles.dryingAlert}>
                                                    <Clock size={16} /> Aguardando Secagem da Impressão
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {selectedJob.stage === 'cutting' && (
                                        <>
                                            <div className={styles.specRow}><strong>Corte:</strong> Bater e Destacar</div>
                                            <div className={styles.specRow}><strong>Vinco:</strong> Nas marcações</div>
                                            <div className={styles.specRow}><strong>Sobra:</strong> Aparar rebarbas</div>
                                        </>
                                    )}
                                    {selectedJob.stage === 'manual' && (
                                        <>
                                            <div className={styles.specRow}><strong>Dobra:</strong> Central</div>
                                            <div className={styles.specRow}><strong>Cola:</strong> Lateral Direita</div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* BLOCK C: QUALITY */}
                            <div className={styles.panelBlockC}>
                                <div className={styles.sectionTitle}>Bloco C: Validação de Qualidade</div>
                                <div className={styles.checklist}>
                                    {selectedJob.stage === 'ennoblement' && (
                                        <>
                                            <label className={styles.checkItem}><input type="checkbox" /> Registro UV batendo?</label>
                                            <label className={styles.checkItem}><input type="checkbox" /> Sem bolhas/manchas?</label>
                                        </>
                                    )}
                                    {selectedJob.stage === 'cutting' && (
                                        <>
                                            <label className={styles.checkItem}><input type="checkbox" /> Faca afiada?</label>
                                            <label className={styles.checkItem}><input type="checkbox" /> Pressão do corte correta?</label>
                                            <label className={styles.checkItem}><input type="checkbox" /> Vinco sem estourar fibra?</label>
                                        </>
                                    )}
                                    {selectedJob.stage === 'manual' && (
                                        <>
                                            <label className={styles.checkItem}><input type="checkbox" /> Esquadro da dobra ok?</label>
                                            <label className={styles.checkItem}><input type="checkbox" /> Quantidade conferida?</label>
                                        </>
                                    )}
                                </div>

                                <div className={styles.actionArea}>
                                    <Button variant="primary" className={styles.startBtn} disabled={selectedJob.awaitingDrying}>
                                        <Play size={20} />
                                        {selectedJob.awaitingDrying ? 'Aguarde Secagem' : 'Iniciar Produção'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function KanbanColumn({ title, icon: Icon, children, color }: any) {
    return (
        <div className={`${styles.column} ${styles[color]}`}>
            <div className={styles.columnHeader}>
                <div className={styles.headerTitleRow}>
                    <Icon size={18} />
                    <span>{title}</span>
                </div>
            </div>
            <div className={styles.columnBody}>
                {children}
            </div>
        </div>
    );
}

function JobCard({ job, onClick }: { job: Job, onClick: any }) {
    const Icon = job.stage === 'ennoblement' ? Droplet : job.stage === 'cutting' ? Scissors : Box;

    return (
        <div className={styles.card} onClick={onClick}>
            <div className={styles.cardHeader}>
                <span className={styles.jobId}>#{job.id}</span>
                {job.dieCutId && <span className={styles.dieBadgeDark}>{job.dieCutId}</span>}
            </div>
            <h4 className={styles.cardTitle}>{job.client}</h4>
            <p className={styles.cardJob}>{job.jobTitle}</p>

            {job.awaitingDrying && (
                <div className={styles.dryingBadge}>
                    <Clock size={12} /> Aguardando Secagem
                </div>
            )}

            <div className={styles.cardFooter}>
                <Icon size={14} className={styles.footerIcon} />
                <span className={styles.qty}>{job.quantity.toLocaleString()} un</span>
            </div>
        </div>
    );
}

function DieStatusBadge({ status }: { status: DieStatus }) {
    const config = {
        good: { label: 'Disponível', color: '#16a34a', icon: CheckSquare },
        maintenance: { label: 'Afiação', color: '#facc15', icon: Wrench },
        missing: { label: 'Perdida', color: '#ef4444', icon: AlertTriangle },
    }[status];
    const Icon = config.icon;

    return (
        <span className={styles.statusBadge} style={{ color: config.color, borderColor: config.color }}>
            <Icon size={10} />
            {config.label}
        </span>
    );
}
