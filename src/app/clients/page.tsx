'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

export default function ClientsPage() {
    return (
        <div style={{ padding: '1.5rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Base de Clientes</h1>
            <Card title="Diretório de Clientes">
                <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                    Módulo em construção. Lista de clientes e histórico.
                </div>
            </Card>
        </div>
    );
}
