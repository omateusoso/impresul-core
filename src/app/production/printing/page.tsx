'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Search, Filter, Clock, Play, Pause, AlertTriangle, Printer, Layers, Scissors, Droplet, Package, Ban, CheckCircle, Cpu, Cog } from 'lucide-react';
import styles from './page.module.css';

// Types
type Sector = 'offset' | 'digital' | 'plotter' | 'silk' | 'sublimation';
type MachineStatus = 'running' | 'setup' | 'stopped' | 'idle';

interface Job {
    id: string;
    client: string;
    jobTitle: string;
    quantity: number;
    specs: string[]; // e.g., "Couché 150g", "4x4"
    status: 'queue' | 'setup' | 'running' | 'paused' | 'done';

    // Sector Specifics
    plateId?: string; // Offset
    verniz?: string; // Offset
    drawer?: string; // Digital
    media?: string; // Plotter
    quality?: string; // Plotter
    screens?: string; // Silk
    fabric?: string; // Sublimation
}

interface Machine {
    id: string;
    name: string;
    status: MachineStatus;
    jobs: Job[];
}

// Mock Data
const MACHINES_OFFSET: Machine[] = [
    {
        id: 'XL75', name: 'Heidelberg XL 75', status: 'running',
        jobs: [
            { id: '109237', client: 'Zaffari', jobTitle: 'Cartazes A3 Verão', quantity: 5000, specs: ['Couché 150g', '4x4'], status: 'running', plateId: 'PL-992', verniz: 'Base Água' },
            { id: '109240', client: 'Tramontina', jobTitle: 'Catálogo 2026', quantity: 2000, specs: ['Couché 300g', 'Capa'], status: 'queue', plateId: 'PL-995' }
        ]
    },
    {
        id: 'GTO52', name: 'Heidelberg GTO', status: 'stopped',
        jobs: []
    }
];

const MACHINES_DIGITAL: Machine[] = [
    {
        id: 'C3070', name: 'Konica Minolta C3070', status: 'idle',
        jobs: [
            { id: '109245', client: 'Panvel', jobTitle: 'Cartões de Visita', quantity: 200, specs: ['Couché 300g', '4x4'], status: 'queue', drawer: 'Gaveta 2' },
        ]
    },
    { id: 'XEROX', name: 'Xerox Versant', status: 'idle', jobs: [] }
];

const MACHINES_PLOTTER: Machine[] = [
    {
        id: 'ROLAND', name: 'Roland DG 640', status: 'running',
        jobs: [
            { id: '109250', client: 'Rede Super', jobTitle: 'Banner Fachada', quantity: 1, specs: ['Lona 440g', '1440dpi'], status: 'running', media: 'Lona Front', quality: 'High' }
        ]
    }
];

export default function ProductionHubPage() {
    const [activeSector, setActiveSector] = useState<Sector>('offset');
    const [isOperatorModalOpen, setIsOperatorModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [activeMachineName, setActiveMachineName] = useState('');

    const [timerState, setTimerState] = useState<'idle' | 'setup' | 'running'>('idle');
    const [timeElapsed, setTimeElapsed] = useState(0);

    // Get current machines based on sector
    const getMachines = () => {
        switch (activeSector) {
            case 'offset': return MACHINES_OFFSET;
            case 'digital': return MACHINES_DIGITAL;
            case 'plotter': return MACHINES_PLOTTER;
            default: return [];
        }
    };

    const handleJobClick = (job: Job, machineName: string) => {
        setSelectedJob(job);
        setActiveMachineName(machineName);
        setIsOperatorModalOpen(true);
        // Reset timer for demo
        setTimerState(job.status === 'setup' ? 'setup' : job.status === 'running' ? 'running' : 'idle');
    };

    // Timer Mock
    useEffect(() => {
        let interval: any;
        if (timerState !== 'idle') {
            interval = setInterval(() => setTimeElapsed(p => p + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timerState]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <h1>Hub de Produção</h1>
                    <span className={styles.subtitle}>Gestão de Chão de Fábrica</span>
                </div>
                <div className={styles.sectorTabs}>
                    <SectorTab label="Offset" icon={Layers} active={activeSector === 'offset'} onClick={() => setActiveSector('offset')} />
                    <SectorTab label="Digital" icon={Printer} active={activeSector === 'digital'} onClick={() => setActiveSector('digital')} />
                    <SectorTab label="Plotter" icon={Scissors} active={activeSector === 'plotter'} onClick={() => setActiveSector('plotter')} />
                    <SectorTab label="Serigrafia" icon={Droplet} active={activeSector === 'silk'} onClick={() => setActiveSector('silk')} />
                    <SectorTab label="Sublimação" icon={Package} active={activeSector === 'sublimation'} onClick={() => setActiveSector('sublimation')} />
                </div>
            </header>

            <div className={styles.swimlanesContainer}>
                {getMachines().map(machine => (
                    <div key={machine.id} className={styles.lane}>
                        <div className={`${styles.laneHeader} ${styles[machine.status]}`}>
                            <span className={styles.machineName}>{machine.name}</span>
                            <MachineStatusBadge status={machine.status} />
                        </div>
                        <div className={styles.laneBody}>
                            {machine.jobs.length > 0 ? (
                                machine.jobs.map(job => (
                                    <JobCard
                                        key={job.id}
                                        job={job}
                                        sector={activeSector}
                                        onClick={() => handleJobClick(job, machine.name)}
                                    />
                                ))
                            ) : (
                                <div className={styles.emptyState}>
                                    <span>Máquina Ociosa</span>
                                    <Button variant="outline" size="sm">Puxar Job</Button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {/* Spacer for scroll */}
                <div style={{ minWidth: '20px' }} />
            </div>

            {/* OPERATOR MODAL (TABLET MODE) */}
            {isOperatorModalOpen && selectedJob && (
                <div className={styles.modalOverlay}>
                    <div className={styles.tabletModal}>
                        <div className={styles.modalHeader}>
                            <div className={styles.jobInfo}>
                                <span className={styles.machineTag}>{activeMachineName}</span>
                                <h2>Produzindo: {selectedJob.client} - {selectedJob.jobTitle}</h2>
                            </div>
                            <button className={styles.closeBtn} onClick={() => setIsOperatorModalOpen(false)}>×</button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.mainInfo}>
                                <div className={styles.bigStat}>
                                    <label>Tiragem Total</label>
                                    <span className={styles.giantNumber}>{selectedJob.quantity.toLocaleString()}</span>
                                    <span className={styles.unit}>unidades</span>
                                </div>

                                <div className={styles.timerSection}>
                                    <div className={styles.timerDisplay}>{formatTime(timeElapsed)}</div>
                                    <div className={styles.timerControls}>
                                        <button
                                            className={`${styles.timerBtn} ${styles.btnSetup} ${timerState === 'setup' ? styles.activeBtn : ''}`}
                                            onClick={() => setTimerState(timerState === 'setup' ? 'idle' : 'setup')}
                                        >
                                            <Cog size={24} />
                                            SETUP / ACERTO
                                        </button>
                                        <button
                                            className={`${styles.timerBtn} ${styles.btnRun} ${timerState === 'running' ? styles.activeBtn : ''}`}
                                            onClick={() => setTimerState(timerState === 'running' ? 'idle' : 'running')}
                                        >
                                            <Play size={24} />
                                            PRODUÇÃO
                                        </button>
                                        <button
                                            className={`${styles.timerBtn} ${styles.btnStop}`}
                                            onClick={() => { setTimerState('idle'); alert('Motivo da Parada?'); }}
                                        >
                                            <Ban size={24} />
                                            PARADA
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.materialSection}>
                                <h3>Consumo de Material</h3>
                                <div className={styles.materialGrid}>
                                    <div className={styles.matCard}>
                                        <label>Previsto</label>
                                        <span>{(selectedJob.quantity * 1.05).toFixed(0)} fls</span>
                                    </div>
                                    <div className={styles.matInput}>
                                        <label>Gasto Real</label>
                                        <input type="number" placeholder="Digite..." />
                                    </div>
                                    <div className={styles.matCalculated}>
                                        <label>Quebra</label>
                                        <span style={{ color: '#ef4444' }}>-- %</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function SectorTab({ label, icon: Icon, active, onClick }: any) {
    return (
        <button
            className={`${styles.sectorTab} ${active ? styles.activeSector : ''}`}
            onClick={onClick}
        >
            <Icon size={18} />
            {label}
        </button>
    );
}

function MachineStatusBadge({ status }: { status: MachineStatus }) {
    const config = {
        running: { label: 'Rodando', color: '#16a34a', icon: CheckCircle },
        setup: { label: 'Setup', color: '#facc15', icon: Cog },
        stopped: { label: 'Parada', color: '#ef4444', icon: AlertTriangle },
        idle: { label: 'Ociosa', color: '#94a3b8', icon: Ban },
    }[status];
    const Icon = config.icon;

    return (
        <span className={styles.statusBadge} style={{ backgroundColor: config.color }}>
            <Icon size={12} strokeWidth={3} />
            {config.label}
        </span>
    );
}

function JobCard({ job, sector, onClick }: { job: Job, sector: Sector, onClick: any }) {
    return (
        <div className={styles.card} onClick={onClick}>
            <div className={styles.cardHeader}>
                <span className={styles.jobId}>#{job.id}</span>
                <span className={styles.client}>{job.client}</span>
            </div>

            <div className={styles.cardBody}>
                <span className={styles.quantity}>{job.quantity.toLocaleString()}</span>
                <div className={styles.specs}>
                    {job.specs.map((s, i) => <span key={i} className={styles.specTag}>{s}</span>)}
                </div>

                {/* Sector Specific Info */}
                <div className={styles.sectorInfo}>
                    {sector === 'offset' && job.plateId &&
                        <div className={styles.infoRow}><strong>Chapa:</strong> {job.plateId}</div>
                    }
                    {sector === 'digital' && job.drawer &&
                        <div className={styles.infoRow}><strong>Bandeja:</strong> {job.drawer}</div>
                    }
                    {sector === 'plotter' && job.media &&
                        <div className={styles.infoRow}><strong>Mídia:</strong> {job.media}</div>
                    }
                </div>
            </div>

            <div className={styles.cardFooter}>
                <span className={`${styles.statusDot} ${styles[job.status]}`} />
                <span className={styles.statusText}>
                    {job.status === 'running' ? 'Produzindo...' : 'Na Fila'}
                </span>
            </div>
        </div>
    );
}
