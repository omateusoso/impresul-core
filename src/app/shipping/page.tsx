import { Card } from '@/components/ui/Card';
import { Truck } from 'lucide-react';

export default function ShippingPage() {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: '1rem', color: '#888' }}>
            <Truck size={64} opacity={0.2} />
            <h2 style={{ fontSize: '1.5rem' }}>Módulo de Expedição em Desenvolvimento</h2>
        </div>
    );
}
