'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

export default function FinishingPage() {
    return (
        <div style={{ padding: '1.5rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Acabamento</h1>
            <Card title="Fila de Acabamento">
                <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                    Módulo em construção. Corte, vinco e expedição.
                </div>
            </Card>
        </div>
    );
}
