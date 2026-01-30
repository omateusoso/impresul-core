'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Search, Package, AlertTriangle, ArrowDown, ShoppingCart } from 'lucide-react';
import styles from './page.module.css';
import { SUBSTRATES } from '@/lib/mockData';

// Augment mock data for display
const EXTENDED_STOCK = SUBSTRATES.map(s => ({
    ...s,
    maxStock: s.stock * (Math.random() > 0.5 ? 1.5 : 2.5), // Simulate max capacity
    consumption: Math.floor(Math.random() * 500),
}));

export default function StockPage() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <h1>Almoxarifado</h1>
                    <span className={styles.badge}>Status Geral: Estável</span>
                </div>
                <div className={styles.actions}>
                    <div className={styles.searchBox}>
                        <Search size={16} className={styles.searchIcon} />
                        <input className={styles.searchInput} placeholder="Buscar material..." />
                    </div>
                    <Button variant="primary">
                        <ShoppingCart size={16} className="mr-2" />
                        Solicitar Compra
                    </Button>
                </div>
            </header>

            <div className={styles.grid}>
                {EXTENDED_STOCK.map(item => {
                    const percentage = (item.stock / item.maxStock) * 100;
                    const isLowStock = item.stock <= item.warningThreshold;

                    return (
                        <div key={item.id} className={`${styles.stockCard} ${isLowStock ? styles.lowStock : ''}`}>
                            <div className={styles.cardHeader}>
                                <div className={styles.iconWrapper}>
                                    <Package size={20} />
                                </div>
                                <div className={styles.cardTitle}>
                                    <h3>{item.name}</h3>
                                    <span>Cod: {item.id.toUpperCase()}</span>
                                </div>
                                {isLowStock && (
                                    <div className={styles.alertIcon}>
                                        <AlertTriangle size={18} />
                                    </div>
                                )}
                            </div>

                            <div className={styles.stockDisplay}>
                                <div className={styles.values}>
                                    <span className={styles.current}>{item.stock.toLocaleString()} <small>{item.unit}</small></span>
                                    <span className={styles.total}>/ {item.maxStock.toLocaleString()}</span>
                                </div>

                                <div className={styles.statusBar}>
                                    <div
                                        className={styles.statusFill}
                                        style={{
                                            width: `${percentage}%`,
                                            backgroundColor: isLowStock ? '#EC008C' : '#00AEEF' // CMYK Magenta / Cyan
                                        }}
                                    />
                                </div>
                            </div>

                            <div className={styles.footer}>
                                <div className={styles.stat}>
                                    <ArrowDown size={14} className={styles.trendIcon} />
                                    <span>Consumo mês: {item.consumption}</span>
                                </div>
                                {isLowStock && (
                                    <Button variant="danger" size="sm" className={styles.buyButton}>
                                        Repor
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
