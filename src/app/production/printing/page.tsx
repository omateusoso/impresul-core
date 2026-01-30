'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

export default function PrintingPage() {
    return (
        <div style={{ padding: '1.5rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Impressão</h1>
            <Card title="Fila de Máquinas">
                <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                    Módulo em construção. Controle de O.S. em máquina.
                </div>
            </Card>
        </div>
    );
}
