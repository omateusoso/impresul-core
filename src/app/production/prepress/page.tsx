'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

export default function PrepressPage() {
    return (
        <div style={{ padding: '1.5rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Pré-Impressão</h1>
            <Card title="Fila de Arquivos">
                <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                    Módulo em construção. Checklist de arquivos e chapas.
                </div>
            </Card>
        </div>
    );
}
