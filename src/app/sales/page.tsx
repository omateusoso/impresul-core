'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

export default function SalesPage() {
    return (
        <div style={{ padding: '1.5rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Vendas (CRM)</h1>
            <Card title="Funil de Vendas">
                <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                    Módulo em construção. Aqui entrará o Kanban de oportunidades.
                </div>
            </Card>
        </div>
    );
}
