'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Activity, AlertTriangle, CheckCircle, TrendingUp, Clock, Users, Printer, Package, DollarSign } from 'lucide-react';
import styles from './page.module.css';

type UserRole = 'manager' | 'sales' | 'production';

export default function Home() {
    const [role, setRole] = useState<UserRole>('manager');

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.title}>
                    <h1>Mesa de Comando</h1>
                    <p>Bem-vindo, {role === 'manager' ? 'Admin' : role === 'sales' ? 'Vendedor' : 'Operador'}.</p>
                </div>

                <div className={styles.roleSwitcher}>
                    <button
                        className={`${styles.roleButton} ${role === 'manager' ? styles.active : ''}`}
                        onClick={() => setRole('manager')}
                    >
                        Gerente
                    </button>
                    <button
                        className={`${styles.roleButton} ${role === 'sales' ? styles.active : ''}`}
                        onClick={() => setRole('sales')}
                    >
                        Comercial
                    </button>
                    <button
                        className={`${styles.roleButton} ${role === 'production' ? styles.active : ''}`}
                        onClick={() => setRole('production')}
                    >
                        Fábrica
                    </button>
                </div>
            </header>

            {role === 'manager' && <ManagerView />}
            {role === 'sales' && <SalesView />}
            {role === 'production' && <ProductionView />}
        </div>
    );
}

function ManagerView() {
    return (
        <>
            <div className={styles.kpiGrid}>
                <KPICard icon={TrendingUp} label="Faturamento Hoje" value="R$ 12.450" color="#16a34a" />
                <KPICard icon={Activity} label="Eficiência Global" value="89%" color="#0284c7" />
                <KPICard icon={AlertTriangle} label="Gargalos (PCP)" value="2" color="#dc2626" />
                <KPICard icon={Clock} label="OTIF (Prazo)" value="98%" color="#d97706" />
            </div>

            <div className={styles.mainGrid}>
                <Card title="Status do Parque Gráfico">
                    <div className={styles.machineList}>
                        <MachineStatus name="Heidelberg XL 75" status="running" task="#OS-4921 - Cartões" />
                        <MachineStatus name="Konica Minolta C3070" status="error" task="Parada: Manutenção" />
                        <MachineStatus name="Plotter Roland" status="idle" task="Aguardando Arquivo" />
                        <MachineStatus name="Corte e Vinco" status="running" task="#OS-4880 - Packaging" />
                    </div>
                </Card>
                <Card title="Alertas Críticos">
                    <div className={styles.taskQueue}>
                        <TaskItem title="Estoque Baixo: Couché 300g" subtitle="Abaixo de 10%" priority="high" />
                        <TaskItem title="Reprovação Cliente" subtitle="OS #4900 - Cor errada" priority="medium" />
                    </div>
                </Card>
            </div>
        </>
    );
}

function SalesView() {
    return (
        <>
            <div className={styles.kpiGrid}>
                <KPICard icon={DollarSign} label="Minha Meta (Mês)" value="R$ 85k / 100k" color="#16a34a" />
                <KPICard icon={Clock} label="Aguardando Aprovação" value="8 Orç." color="#eab308" />
                <KPICard icon={CheckCircle} label="Fechados Hoje" value="3" color="#0284c7" />
                <KPICard icon={Users} label="Novos Leads" value="12" color="#9333ea" />
            </div>

            <div className={styles.mainGrid}>
                <Card title="Funil de Vendas Recente">
                    <div className={styles.taskQueue}>
                        <TaskItem title="Restaurante Sabor Divino" subtitle="Cardápios - Aguardando Aprovação (R$ 4.200)" priority="medium" />
                        <TaskItem title="Tech Solutions" subtitle="Folders - Em negociação" priority="low" />
                        <TaskItem title="Evento XPTO" subtitle="Crachás - Urgente" priority="high" />
                    </div>
                </Card>
                <Card title="Atalhos">
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button className={styles.roleButton} style={{ border: '1px solid #ddd' }}>Novo Orçamento</button>
                        <button className={styles.roleButton} style={{ border: '1px solid #ddd' }}>Cadastrar Cliente</button>
                    </div>
                </Card>
            </div>
        </>
    );
}

function ProductionView() {
    return (
        <>
            <div className={styles.kpiGrid}>
                <KPICard icon={Printer} label="Jobs na Fila" value="14" color="#0284c7" />
                <KPICard icon={Package} label="Expedição Hoje" value="85 Caixas" color="#16a34a" />
                <KPICard icon={AlertTriangle} label="Paradas" value="1" color="#dc2626" />
                <KPICard icon={Clock} label="Tempo Médio Setup" value="18 min" color="#666" />
            </div>

            <div className={styles.mainGrid}>
                <Card title="Próximos Jobs (Fila de Impressão)">
                    <div className={styles.machineList}>
                        <MachineStatus name="#OS-4922 - Folders A4" status="idle" task="Próximo: Heidelberg" />
                        <MachineStatus name="#OS-4925 - Cartões Visita" status="idle" task="Próximo: Konica" />
                        <MachineStatus name="#OS-4930 - Banner" status="idle" task="Próximo: Plotter" />
                    </div>
                </Card>
                <Card title="Leitura de O.S.">
                    <div style={{ padding: '2rem', border: '2px dashed #ddd', borderRadius: '8px', textAlign: 'center' }}>
                        <p style={{ color: '#888' }}>Aponte o Leitor de QR Code ou Digite a O.S.</p>
                    </div>
                </Card>
            </div>
        </>
    );
}

function KPICard({ icon: Icon, label, value, color }: any) {
    return (
        <div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ color: color, backgroundColor: `${color}15` }}>
                <Icon size={24} />
            </div>
            <div className={styles.kpiContent}>
                <span className={styles.kpiLabel}>{label}</span>
                <span className={styles.kpiValue}>{value}</span>
            </div>
        </div>
    );
}

function MachineStatus({ name, status, task }: any) {
    return (
        <div className={`${styles.machineItem} ${styles[status]}`}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111' }}>{name}</span>
                <span style={{ fontSize: '0.8rem', color: '#555' }}>{task}</span>
            </div>
            <StatusDot status={status} />
        </div>
    );
}

function StatusDot({ status }: { status: string }) {
    const color = status === 'running' ? '#00AEEF' : status === 'error' ? '#EC008C' : '#FFF200';
    return <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: color, boxShadow: `0 0 0 2px white, 0 0 0 3px ${color}` }} />;
}

function TaskItem({ title, subtitle, priority }: any) {
    return (
        <div className={styles.taskItem}>
            <div className={styles.taskInfo}>
                <h4>{title}</h4>
                <p>{subtitle}</p>
            </div>
            {priority === 'high' && <span className={styles.priorityBadge}>Urgente</span>}
        </div>
    );
}
