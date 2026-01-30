'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Search, Filter, Scissors, BookOpen, Package, Truck, Printer, Camera, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import styles from './page.module.css';

// Types
type FinishingStage = 'refile' | 'assembly' | 'packing' | 'shipping';

interface Job {
    id: string;
    client: string;
    jobTitle: string;
    stage: FinishingStage;
    quantity: number;
    instruction: string; // e.g. "Pacotes de 50un"
    deadline?: string; // e.g. "14:00"
    urgent?: boolean;
    specs: string[];
}

// Mock Data
const INITIAL_JOBS: Job[] = [
    {
        id: '109237', client: 'Zaffari', jobTitle: 'Cartazes A3 Verão', stage: 'refile',
        quantity: 5000, instruction: 'Refile Final 29,7x42cm', specs: ['Couché 150g']
    },
    {
        id: '109240', client: 'Tramontina', jobTitle: 'Catálogo 2026', stage: 'assembly',
        quantity: 200, instruction: 'Espiral Preto + Capa PVC', specs: ['Capa Dura', 'Miolo 90g']
    },
    {
        id: '109248', client: 'Panvel', jobTitle: 'Flyers Ofertas', stage: 'packing',
        quantity: 10000, instruction: 'Pacotes de 100un (Cintas)', urgent: true, deadline: '16:00', specs: ['Couché 90g']
    },
];

export default function FinishingPage() {
    const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Modal Logic
    const [volumeCount, setVolumeCount] = useState(1);
    const [hasSample, setHasSample] = useState(false);
    const [samplePhoto, setSamplePhoto] = useState<string | null>(null);

    const handleJobClick = (job: Job) => {
        setSelectedJob(job);
        setIsModalOpen(true);
        // Reset modal state
        setVolumeCount(1);
        setHasSample(false);
        setSamplePhoto(null);
    };

    const handleGenerateLabels = () => {
        alert(`Gerando PDF de etiquetas para ${volumeCount} volumes...\nImpressora: Zebra ZT230 (Aguarde)`);
    };

    const handlePhotoUpload = () => {
        // Simulating upload
        setSamplePhoto('fake-url');
    };

    const handleFinish = () => {
        if (!hasSample) {
            alert('Erro: Você deve confirmar a separação da amostra.');
            return;
        }
        if (!samplePhoto) {
            alert('Erro: Foto da amostra é obrigatória.');
            return;
        }
        alert('Job movido para Expedição!');
        setIsModalOpen(false);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <h1>Acabamento Final</h1>
                    <span className={styles.subtitle}>Manuseio, Montagem e Expedição</span>
                </div>
            </header>

            <div className={styles.kanbanBoard}>
                <KanbanColumn title="Refile (Guilhotina)" icon={Scissors} color="gray">
                    {jobs.filter(j => j.stage === 'refile').map(job => (
                        <InstructionCard key={job.id} job={job} onClick={() => handleJobClick(job)} />
                    ))}
                </KanbanColumn>

                <KanbanColumn title="Montagem / Manuseio" icon={BookOpen} color="blue">
                    {jobs.filter(j => j.stage === 'assembly').map(job => (
                        <InstructionCard key={job.id} job={job} onClick={() => handleJobClick(job)} />
                    ))}
                </KanbanColumn>

                <KanbanColumn title="Empacotamento" icon={Package} color="orange">
                    {jobs.filter(j => j.stage === 'packing').map(job => (
                        <InstructionCard key={job.id} job={job} onClick={() => handleJobClick(job)} />
                    ))}
                </KanbanColumn>

                <KanbanColumn title="Pronto p/ Expedição" icon={Truck} color="green">
                    {jobs.filter(j => j.stage === 'shipping').map(job => (
                        <InstructionCard key={job.id} job={job} onClick={() => handleJobClick(job)} />
                    ))}
                </KanbanColumn>
            </div>

            {/* PACKING STATION MODAL */}
            {isModalOpen && selectedJob && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <div className={styles.jobInfo}>
                                <h2>{selectedJob.client} - {selectedJob.jobTitle}</h2>
                                <span className={styles.jobBreadcrumb}>#{selectedJob.id} • {selectedJob.quantity.toLocaleString()} un</span>
                            </div>
                            <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>×</button>
                        </div>

                        <div className={styles.modalBody}>
                            {/* BLOCK A: MANEUVER */}
                            <div className={styles.block}>
                                <div className={styles.blockHeader}>
                                    <BookOpen size={18} /> Bloco A: Instruções de Manobra
                                </div>
                                <div className={styles.instructionBig}>
                                    {selectedJob.instruction}
                                </div>
                                <div className={styles.specsList}>
                                    {selectedJob.specs.map((s, i) => <span key={i} className={styles.specTag}>{s}</span>)}
                                </div>
                            </div>

                            {/* BLOCK B: QUALITY */}
                            <div className={styles.block}>
                                <div className={styles.blockHeader}>
                                    <CheckCircle size={18} /> Bloco B: Controle de Qualidade
                                </div>
                                <div className={styles.checklist}>
                                    <label className={styles.checkItem}><input type="checkbox" /> Quantidade conferida?</label>
                                    <label className={styles.checkItem}><input type="checkbox" /> Sem manchas/amassados?</label>
                                    <label className={styles.checkItem}><input type="checkbox" /> Ordem das páginas correta?</label>
                                </div>
                            </div>

                            {/* BLOCK C: LABELS & SAMPLE */}
                            <div className={`${styles.block} ${styles.blockHighlight}`}>
                                <div className={styles.blockHeader}>
                                    <Printer size={18} /> Bloco C: Etiquetagem e Amostra
                                </div>

                                <div className={styles.toolsGrid}>
                                    <div className={styles.toolColumn}>
                                        <label>Volumes / Caixas:</label>
                                        <div className={styles.inputGroup}>
                                            <input
                                                type="number"
                                                value={volumeCount}
                                                onChange={e => setVolumeCount(Number(e.target.value))}
                                                className={styles.qtyInput}
                                            />
                                            <Button variant="secondary" onClick={handleGenerateLabels}>
                                                <Printer size={16} className="mr-2" />
                                                Gerar PDF Zebra
                                            </Button>
                                        </div>
                                    </div>

                                    <div className={styles.toolColumn}>
                                        <label>Amostra de Arquivo:</label>
                                        <div className={styles.sampleToggle}>
                                            <label className={styles.switch}>
                                                <input type="checkbox" checked={hasSample} onChange={e => setHasSample(e.target.checked)} />
                                                <span className={styles.slider} />
                                            </label>
                                            <span>Separei a amostra</span>
                                        </div>

                                        {hasSample && (
                                            <button
                                                className={`${styles.uploadBtn} ${samplePhoto ? styles.uploaded : ''}`}
                                                onClick={handlePhotoUpload}
                                            >
                                                <Camera size={20} />
                                                {samplePhoto ? 'Foto Anexada ✓' : 'Tirar Foto da Amostra'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <Button variant="primary" size="lg" className="w-full" onClick={handleFinish}>
                                <Truck size={20} className="mr-2" />
                                Liberar para Expedição
                            </Button>
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

function InstructionCard({ job, onClick }: { job: Job, onClick: any }) {
    return (
        <div className={styles.card} onClick={onClick}>
            <div className={styles.cardHeader}>
                <span className={styles.jobId}>#{job.id}</span>
                {job.urgent && <span className={styles.urgentBadge}>Urgent</span>}
            </div>
            <h4 className={styles.clientName}>{job.client}</h4>

            <div className={styles.instructionBadge}>
                {job.instruction}
            </div>

            {job.deadline && (
                <div className={styles.deadlineRow}>
                    <Clock size={12} />
                    <span>Hoje, {job.deadline}</span>
                </div>
            )}

            <div className={styles.cardFooter}>
                <span className={styles.qty}>{job.quantity.toLocaleString()} un</span>
            </div>
        </div>
    );
}
