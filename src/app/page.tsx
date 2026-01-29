'use client';

import { Card } from '@/components/ui/Card';
import { Activity, AlertTriangle, CheckCircle, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Mesa de Comando</h1>
                <p style={{ color: '#666' }}>Visão geral da fábrica em tempo real.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                <Card>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
                        <div style={{ padding: '1rem', background: '#e0f2fe', borderRadius: '12px', color: '#0284c7' }}>
                            <Activity size={24} />
                        </div>
                        <div>
                            <span style={{ fontSize: '0.9rem', color: '#666' }}>Produção Hoje</span>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>8,450 <small style={{ fontSize: '0.8rem' }}>un</small></div>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
                        <div style={{ padding: '1rem', background: '#fef3c7', borderRadius: '12px', color: '#d97706' }}>
                            <Clock size={24} />
                        </div>
                        <div>
                            <span style={{ fontSize: '0.9rem', color: '#666' }}>O.S. Pendentes</span>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>12</div>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
                        <div style={{ padding: '1rem', background: '#dcfce7', borderRadius: '12px', color: '#16a34a' }}>
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <span style={{ fontSize: '0.9rem', color: '#666' }}>Receita Mês</span>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>R$ 142k</div>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
                        <div style={{ padding: '1rem', background: '#fee2e2', borderRadius: '12px', color: '#dc2626' }}>
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <span style={{ fontSize: '0.9rem', color: '#666' }}>Alertas Estoque</span>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>3</div>
                        </div>
                    </div>
                </Card>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <Card title="Status das Máquinas">
                    <div style={{ display: 'grid', gap: '1rem', padding: '1rem' }}>
                        <MachineStatus name="Heidelberg XL 75" status="running" efficiency={92} />
                        <MachineStatus name="Konica Minolta C3070" status="maintenance" efficiency={0} />
                        <MachineStatus name="Plotter Roland" status="idle" efficiency={100} />
                    </div>
                </Card>

                <Card title="Atalhos Rápidos">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem' }}>
                        <QuickLink href="/quotes" label="Novo Orçamento (F2)" />
                        <QuickLink href="/production" label="Ver Produção (F3)" />
                        <QuickLink href="/stock" label="Consultar Estoque (F4)" />
                    </div>
                </Card>
            </div>
        </div>
    );
}

function MachineStatus({ name, status, efficiency }: { name: string, status: string, efficiency: number }) {
    const color = status === 'running' ? '#22c55e' : status === 'maintenance' ? '#ef4444' : '#eab308';
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: '#f9fafb', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                <span style={{ fontWeight: 600 }}>{name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase' }}>{status === 'running' ? 'Operando' : status === 'maintenance' ? 'Manutenção' : 'Ociosa'}</span>
                {status === 'running' && <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{efficiency}% Eficiência</span>}
            </div>
        </div>
    );
}

function QuickLink({ href, label }: { href: string, label: string }) {
    return (
        <Link href={href}>
            <div style={{ padding: '0.75rem', background: 'var(--background)', borderRadius: '6px', cursor: 'pointer', border: '1px solid transparent', transition: 'all 0.2s', fontWeight: 500 }}>
                {label}
            </div>
        </Link>
    );
}
