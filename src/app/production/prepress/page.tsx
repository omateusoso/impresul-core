'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Filter, Clock, CheckCircle, AlertTriangle, Copy, Play, Pause, Upload, Share2, Printer, Plus, FolderPlus, Link as LinkIcon, MoreHorizontal } from 'lucide-react';
import styles from './page.module.css';

// Types
type status = 'input' | 'preflight' | 'approval' | 'ready';

interface Job {
    id: string; // Parent ID
    childId: string; // CF-XXX
    client: string;
    jobTitle: string;
    status: status;
    deadline: string;
    urgent: boolean;
    folderPath: string;
    serverLink: string;
    serviceType?: string;
}

// Mock Data
const INITIAL_JOBS: Job[] = [
    { id: '109237', childId: 'CF-902', client: 'Zaffari', jobTitle: 'Cartazes A3 Verão', status: 'input', deadline: 'Hoje', urgent: true, folderPath: '\\\\JobData\\2026\\109237_Zaffari_Cartazes', serverLink: '', serviceType: 'Fechamento' },
    { id: '109238', childId: 'CF-903', client: 'Panvel', jobTitle: 'Folheto Ofertas', status: 'preflight', deadline: 'Amanhã', urgent: false, folderPath: '\\\\JobData\\2026\\109238_Panvel_Folheto', serverLink: 'core.impresul.com/proof/p8s9d', serviceType: 'Retoque' },
    { id: '109235', childId: 'CF-901', client: 'Tramontina', jobTitle: 'Catálogo 2026', status: 'approval', deadline: '20/02', urgent: false, folderPath: '\\\\JobData\\2026\\109235_Tramontina', serverLink: 'core.impresul.com/proof/xWy9z', serviceType: 'Criação' },
];

export default function PrePressPage() {
    const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [isOperatorModalOpen, setIsOperatorModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Create Modal State
    const [newOsParentId, setNewOsParentId] = useState('');
    const [newOsClient, setNewOsClient] = useState('');
    const [generatedPath, setGeneratedPath] = useState('');

    // Timer Logic mock
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0);

    useEffect(() => {
        let interval: any;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setTimeElapsed(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    // Format Timer
    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleCopyPath = (path: string) => {
        navigator.clipboard.writeText(path);
        // Toast notification would go here
    };

    const openJob = (job: Job) => {
        setSelectedJob(job);
        setIsOperatorModalOpen(true);
    };

    // Auto-generate path when inputs change
    useEffect(() => {
        if (newOsParentId && newOsClient) {
            const cleanClient = newOsClient.replace(/[^a-zA-Z0-9]/g, '');
            setGeneratedPath(`\\\\JobData\\2026\\${newOsParentId}_${cleanClient}`);
        }
    }, [newOsParentId, newOsClient]);

    const handleCreateOS = () => {
        const newJob: Job = {
            id: newOsParentId || '000000',
            childId: `CF-${Math.floor(Math.random() * 1000)}`,
            client: newOsClient || 'Cliente',
            jobTitle: 'Novo Job (Carregando...)',
            status: 'input',
            deadline: 'A definir',
            urgent: false,
            folderPath: generatedPath,
            serverLink: '',
            serviceType: 'Fechamento'
        };
        setJobs([...jobs, newJob]);
        setIsCreateModalOpen(false);
        // Reset form
        setNewOsParentId('');
        setNewOsClient('');
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <h1>Pré-Impressão</h1>
                    <span className={styles.subtitle}>Cor Fotolito (Serviços Internos)</span>
                </div>
                <div className={styles.headerActions}>
                    <div className={styles.searchBox}>
                        <Search size={16} className={styles.searchIcon} />
                        <LinkTestButton />
                    </div>
                    <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
                        <Plus size={16} className="mr-2" />
                        Abrir O.S. (Cor Fotolito)
                    </Button>
                </div>
            </header>

            <div className={styles.kanbanBoard}>
                <KanbanColumn
                    title="Entrada"
                    count={jobs.filter(j => j.status === 'input').length}
                    color="gray"
                >
                    {jobs.filter(j => j.status === 'input').map(job => (
                        <JobCard key={job.childId} job={job} onCopy={() => handleCopyPath(job.folderPath)} onClick={() => openJob(job)} />
                    ))}
                </KanbanColumn>

                <KanbanColumn
                    title="Preflight / Análise"
                    count={jobs.filter(j => j.status === 'preflight').length}
                    color="blue"
                >
                    {jobs.filter(j => j.status === 'preflight').map(job => (
                        <JobCard key={job.childId} job={job} onCopy={() => handleCopyPath(job.folderPath)} onClick={() => openJob(job)} />
                    ))}
                </KanbanColumn>

                <KanbanColumn
                    title="Aguardando Aprovação"
                    count={jobs.filter(j => j.status === 'approval').length}
                    color="yellow"
                >
                    {jobs.filter(j => j.status === 'approval').map(job => (
                        <JobCard key={job.childId} job={job} onCopy={() => handleCopyPath(job.folderPath)} onClick={() => openJob(job)} />
                    ))}
                </KanbanColumn>

                <KanbanColumn
                    title="Liberado / Chapa"
                    count={jobs.filter(j => j.status === 'ready').length}
                    color="green"
                >
                    {jobs.filter(j => j.status === 'ready').map(job => (
                        <JobCard key={job.childId} job={job} onCopy={() => handleCopyPath(job.folderPath)} onClick={() => openJob(job)} />
                    ))}
                </KanbanColumn>
            </div>

            {/* CREATE O.S. MODAL */}
            {isCreateModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalSmall}>
                        <div className={styles.modalHeader}>
                            <h2>Abertura de Serviço - Cor Fotolito</h2>
                            <button className={styles.closeBtn} onClick={() => setIsCreateModalOpen(false)}>×</button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.formGroup}>
                                <label>Vínculo O.S. Principal (Impresul)</label>
                                <div className={styles.row}>
                                    <Input placeholder="Ex: 109237" value={newOsParentId} onChange={e => setNewOsParentId(e.target.value)} />
                                    <Input placeholder="Nome do Cliente" value={newOsClient} onChange={e => setNewOsClient(e.target.value)} style={{ flex: 2 }} />
                                </div>
                            </div>

                            <div className={styles.pathSection}>
                                <label>Diretório de Trabalho (JobData)</label>
                                <div className={styles.pathInputGroup}>
                                    <Input value={generatedPath} readOnly className={styles.pathInput} />
                                    <button className={styles.iconActionBtn} title="Criar Pasta"><FolderPlus size={18} /></button>
                                    <button className={styles.iconActionBtn} title="Copiar Caminho"><Copy size={18} /></button>
                                </div>
                                <span className={styles.helperText}>Caminho gerado automaticamente conforme padrão ISO.</span>
                            </div>

                            <div className={styles.checklistGrid}>
                                <label>Tipo de Serviço:</label>
                                <div className={styles.radioRow}>
                                    <label><input type="radio" name="srv" defaultChecked /> Fechamento</label>
                                    <label><input type="radio" name="srv" /> Retoque</label>
                                    <label><input type="radio" name="srv" /> Criação</label>
                                </div>

                                <div className={styles.divider} />

                                <label>Checklist de Entrada (Obrigatório):</label>
                                <label className={styles.checkRow}><input type="checkbox" /> Sangria (3mm a 5mm)</label>
                                <label className={styles.checkRow}><input type="checkbox" /> Converter Pantones p/ CMYK</label>
                                <label className={styles.checkRow}><input type="checkbox" /> Overprint no Preto (100% K)</label>
                                <label className={styles.checkRow}><input type="checkbox" /> Resolução (300dpi)</label>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Cancelar</Button>
                            <Button variant="primary" onClick={handleCreateOS}>Gerar O.S. Interna</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* OPERATOR MODAL */}
            {isOperatorModalOpen && selectedJob && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalLarge}>
                        <div className={styles.modalHeader}>
                            <div className={styles.jobInfo}>
                                <span className={styles.childIdBadge}>{selectedJob.childId} (Cor Fotolito)</span>
                                <h2>{selectedJob.client} - {selectedJob.jobTitle}</h2>
                            </div>
                            <div className={styles.parentVinculum}>
                                <LinkIcon size={12} /> Ref. O.S. #{selectedJob.id}
                            </div>
                            <button className={styles.closeBtn} onClick={() => setIsOperatorModalOpen(false)}>×</button>
                        </div>

                        <div className={styles.modalBodyLarge}>
                            {/* Left Panel: Ticket */}
                            <div className={styles.leftPanel}>
                                <div className={styles.timerLarge}>
                                    <div className={styles.timerValue}>{formatTime(timeElapsed)}</div>
                                    <div className={styles.timerControls}>
                                        <button className={`${styles.timerBtn} ${isTimerRunning ? styles.pause : styles.play}`} onClick={() => setIsTimerRunning(!isTimerRunning)}>
                                            {isTimerRunning ? <Pause size={20} /> : <Play size={20} />}
                                            {isTimerRunning ? 'Pausar' : 'Iniciar'}
                                        </button>
                                    </div>
                                    <span className={styles.timerLabel}>Tempo de Serviço Acumulado</span>
                                </div>

                                <div className={styles.metaInfo}>
                                    <div className={styles.metaItem}>
                                        <label>Operador</label>
                                        <select className={styles.select}><option>Carlos (Design)</option></select>
                                    </div>
                                    <div className={styles.metaItem}>
                                        <label>Máquina Destino</label>
                                        <span className={styles.readOnlyField}>Heidelberg XL 75</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Panel: Files & Workflow */}
                            <div className={styles.rightPanel}>
                                <div className={styles.sectionTitle}>Gestão de Arquivos</div>
                                <div className={styles.fileActions}>
                                    <div className={styles.serverPathBox} onClick={() => handleCopyPath(selectedJob.folderPath)}>
                                        <Copy size={14} />
                                        <span>{selectedJob.folderPath}</span>
                                    </div>
                                    <div className={styles.uploadZone}>
                                        <Upload size={24} />
                                        <span>Arraste a Prova (PDF) aqui</span>
                                    </div>
                                </div>

                                <div className={styles.approvalSection}>
                                    <div className={styles.sectionTitle}>Aprovação Online</div>
                                    <div className={styles.linkBox}>
                                        <input value={selectedJob.serverLink || 'Link não gerado'} readOnly />
                                        <button><Share2 size={16} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <div className={styles.plateInput}>
                                <label>Gravar ID das Chapas:</label>
                                <input placeholder="Ex: 40922-A/B/C/K" />
                            </div>
                            <Button variant="primary">
                                <Printer size={16} className="mr-2" />
                                Finalizar e Liberar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function KanbanColumn({ title, count, children, color }: any) {
    const colorClass = color ? styles[`col${color}`] : '';
    return (
        <div className={`${styles.column} ${colorClass}`}>
            <div className={styles.columnHeader}>
                <span className={styles.colTitle}>{title}</span>
                <span className={styles.colCount}>{count}</span>
            </div>
            <div className={styles.columnBody}>
                {children}
            </div>
        </div>
    );
}

function JobCard({ job, onCopy, onClick }: { job: Job, onCopy: any, onClick: any }) {
    return (
        <div className={styles.card} onClick={onClick}>
            <div className={styles.cardHeader}>
                <span className={styles.childId}>{job.childId}</span>
                <span className={styles.parentId}><LinkIcon size={10} /> {job.id}</span>
            </div>
            <h4 className={styles.cardTitle}>{job.client}</h4>
            <p className={styles.cardJob}>{job.jobTitle}</p>

            <div className={styles.pathRow} onClick={(e) => { e.stopPropagation(); onCopy(); }} title={job.folderPath}>
                <Copy size={12} className={styles.pathIcon} />
                <span className={styles.pathText}>{job.folderPath}</span>
            </div>

            <div className={styles.cardFooter}>
                <span className={styles.serviceTag}>{job.serviceType}</span>
                <div className={styles.cardActions}>
                    <button className={styles.actionIcon} onClick={(e) => e.stopPropagation()} title="Enviar Aprovação"><Share2 size={14} /></button>
                </div>
            </div>
        </div>
    );
}

// Temporary Helper
import Link from 'next/link';
function LinkTestButton() {
    return (
        <Link href="/proof/mock-token" target="_blank">
            <Button variant="ghost" size="sm" style={{ fontSize: '0.75rem' }}>Link Prova</Button>
        </Link>
    )
}
