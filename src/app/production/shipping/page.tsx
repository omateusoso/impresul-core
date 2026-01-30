'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Search, Filter, Truck, Package, MapPin, UserCheck, FileText, Camera, CheckSquare, Printer, Navigation } from 'lucide-react';
import styles from './page.module.css';

// Types
type ShippingStatus = 'waiting' | 'in_transit' | 'pickup' | 'delivered';

interface Shipment {
    id: string; // O.S. ID
    client: string;
    volumes: number;
    weight: number; // kg
    region: string; // Zona Norte, Centro, Viamão
    address: string;
    status: ShippingStatus;
    driver?: string;
    podUrl?: string; // Proof of Delivery URL
}

// Mock Data
const INITIAL_SHIPMENTS: Shipment[] = [
    { id: '109237', client: 'Zaffari', volumes: 5, weight: 12.5, region: 'Zona Norte', address: 'Av. Assis Brasil, 4320', status: 'waiting' },
    { id: '109240', client: 'Tramontina', volumes: 2, weight: 4.0, region: 'Serra (Carlos Barbosa)', address: 'Rua Maurício Cardoso, 100', status: 'waiting' },
    { id: '109255', client: 'Panvel', volumes: 10, weight: 25.0, region: 'Centro', address: 'Rua dos Andradas, 1000', status: 'in_transit', driver: 'Moto 01 - João' },
    { id: '109260', client: 'Rede Super', volumes: 1, weight: 1.2, region: 'Retira Balcão', address: '---', status: 'pickup' },
    { id: '109220', client: 'Gerdau', volumes: 3, weight: 15.0, region: 'Zona Sul', address: 'Av. Ipiranga, 6681', status: 'delivered' },
];

export default function ShippingPage() {
    const [shipments, setShipments] = useState<Shipment[]>(INITIAL_SHIPMENTS);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [isManifestModalOpen, setIsManifestModalOpen] = useState(false);
    const [isPodModalOpen, setIsPodModalOpen] = useState(false);
    const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

    // Filter Logic
    const waitingShipments = shipments.filter(s => s.status === 'waiting');

    // Batch Selection Logic
    const toggleSelection = (id: string) => {
        setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleCreateManifest = () => {
        if (selectedItems.length === 0) return;
        setIsManifestModalOpen(true);
    };

    const confirmManifest = (driver: string) => {
        setShipments(prev => prev.map(s => selectedItems.includes(s.id) ? { ...s, status: 'in_transit', driver } : s));
        setSelectedItems([]);
        setIsManifestModalOpen(false);
        alert(`Romaneio criado com sucesso para ${driver}! Lista enviada para impressão.`);
    };

    // POD Logic
    const handlePodClick = (shipment: Shipment) => {
        if (shipment.status === 'delivered') { // Only for delivered items needing proof? Or maybe 'in_transit' -> 'delivered'? 
            // The prompt says "When clicking an item in 'Delivered' column".
            // Assuming 'Entregue' column contains items that physically arrived but need POD confirmation to clear.
            setSelectedShipment(shipment);
            setIsPodModalOpen(true);
        }
    };

    const confirmPod = () => {
        if (!selectedShipment) return;
        // In a real app, upload logic here
        alert(`Entrega confirmada para ${selectedShipment.client}. Faturamento notificado!`);
        // Remove from list or move to archive
        setShipments(prev => prev.filter(s => s.id !== selectedShipment.id));
        setIsPodModalOpen(false);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <h1>Expedição & Logística</h1>
                    <span className={styles.subtitle}>Torre de Controle de Entregas</span>
                </div>
            </header>

            <div className={styles.kanbanBoard}>
                {/* 1. Aguardando Rota (Manifest Creation Area) */}
                <div className={`${styles.column} ${styles.gray}`}>
                    <div className={styles.columnHeader}>
                        <Package size={18} />
                        <span>Aguardando Rota ({waitingShipments.length})</span>
                    </div>
                    <div className={styles.columnBody}>
                        {waitingShipments.map(s => (
                            <ShipmentCard
                                key={s.id}
                                shipment={s}
                                selectable
                                selected={selectedItems.includes(s.id)}
                                onSelect={() => toggleSelection(s.id)}
                            />
                        ))}
                    </div>
                </div>

                {/* 2. Em Rota */}
                <KanbanColumn title="Em Rota (Entrega)" icon={Truck} color="blue">
                    {shipments.filter(s => s.status === 'in_transit').map(s => (
                        <ShipmentCard key={s.id} shipment={s} />
                    ))}
                </KanbanColumn>

                {/* 3. Retira Balcão */}
                <KanbanColumn title="Retira Balcão" icon={UserCheck} color="orange">
                    {shipments.filter(s => s.status === 'pickup').map(s => (
                        <ShipmentCard key={s.id} shipment={s} isPickup />
                    ))}
                </KanbanColumn>

                {/* 4. Entregue (Need POD) */}
                <KanbanColumn title="Entregue (Pendente Baixa)" icon={FileText} color="green">
                    {shipments.filter(s => s.status === 'delivered').map(s => (
                        <ShipmentCard key={s.id} shipment={s} onClick={() => handlePodClick(s)} />
                    ))}
                </KanbanColumn>
            </div>

            {/* BATCH ACTION BAR (Romaneio) */}
            {selectedItems.length > 0 && (
                <div className={styles.batchBar}>
                    <span className={styles.batchCount}>{selectedItems.length} itens selecionados</span>
                    <Button variant="primary" onClick={handleCreateManifest}>
                        <FileText size={18} className="mr-2" />
                        Criar Romaneio de Saída
                    </Button>
                </div>
            )}

            {/* MANIFEST MODAL */}
            {isManifestModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2>Novo Romaneio de Saída</h2>
                            <button className={styles.closeBtn} onClick={() => setIsManifestModalOpen(false)}>×</button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.formGroup}>
                                <label>Motorista / Transportadora</label>
                                <select className={styles.select} id="driver-select">
                                    <option>Moto 01 - João</option>
                                    <option>Moto 02 - Carlos</option>
                                    <option>Fiorino - Expresso</option>
                                    <option>Correios (Sedex)</option>
                                    <option>JadLog</option>
                                </select>
                            </div>

                            <div className={styles.manifestList}>
                                <h3>Entregas no Romaneio:</h3>
                                {shipments.filter(s => selectedItems.includes(s.id)).map(s => (
                                    <div key={s.id} className={styles.manifestItem}>
                                        <div className={styles.manifestMeta}>
                                            <strong>{s.client}</strong>
                                            <span>{s.address}</span>
                                        </div>
                                        <span className={styles.regionBadgeSimple}>{s.region}</span>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.routeOptimization}>
                                <Navigation size={16} />
                                <span>Rota Otimizada: A → C → B (Economia estimada: 15 min)</span>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <Button className="w-full" onClick={() => {
                                const driver = (document.getElementById('driver-select') as HTMLSelectElement).value;
                                confirmManifest(driver);
                            }}>
                                <Printer size={18} className="mr-2" /> Confirmar e Imprimir
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* POD MODAL */}
            {isPodModalOpen && selectedShipment && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2>Baixa de Entrega (POD)</h2>
                            <button className={styles.closeBtn} onClick={() => setIsPodModalOpen(false)}>×</button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.podInfo}>
                                <strong>Client:</strong> {selectedShipment.client}
                                <br />
                                <strong>OS:</strong> #{selectedShipment.id}
                            </div>

                            <div className={styles.formGroup}>
                                <label>Recebido por (Nome/RG):</label>
                                <input type="text" className={styles.input} placeholder="Ex: Sr. José - Portaria" />
                            </div>

                            <div className={styles.uploadArea}>
                                <Camera size={32} />
                                <span>Carregar Foto do Canhoto Assinado</span>
                                <small>(Obrigatório para liberar Faturamento)</small>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <Button variant="primary" className="w-full" onClick={confirmPod}>
                                <CheckSquare size={18} className="mr-2" />
                                Finalizar e Notificar Faturamento
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

function ShipmentCard({ shipment, selectable, selected, onSelect, isPickup, onClick }: any) {
    return (
        <div
            className={`${styles.card} ${selected ? styles.selected : ''} ${isPickup ? styles.pickupCard : ''}`}
            onClick={selectable ? onSelect : onClick}
        >
            <div className={styles.cardHeader}>
                <span className={styles.osId}>#{shipment.id}</span>
                {selectable && (
                    <div className={`${styles.checkbox} ${selected ? styles.checked : ''}`} />
                )}
            </div>

            <h4 className={styles.client}>{shipment.client}</h4>

            <div className={styles.shipmentMeta}>
                <div className={styles.metaRow}>
                    <Package size={14} /> {shipment.volumes} Vol
                </div>
                <div className={styles.metaRow}>
                    <span>{shipment.weight} kg</span>
                </div>
            </div>

            <div className={styles.regionBadge} style={{
                backgroundColor: shipment.region.includes('Norte') ? '#dbeafe' :
                    shipment.region.includes('Centro') ? '#fce7f3' : '#f3f4f6',
                color: shipment.region.includes('Norte') ? '#1e40af' :
                    shipment.region.includes('Centro') ? '#9d174d' : '#4b5563'
            }}>
                <MapPin size={10} /> {shipment.region}
            </div>

            {shipment.driver && (
                <div className={styles.driverRow}>
                    <Truck size={12} /> {shipment.driver}
                </div>
            )}
        </div>
    );
}
