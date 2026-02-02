'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    Calculator,
    Printer,
    Package,
    Briefcase,
    Users,
    FileCheck,
    Scissors,
    Receipt,
    DollarSign,
    Box,
    Truck
} from 'lucide-react';
import styles from './Sidebar.module.css';

const MENU_GROUPS = [
    {
        title: 'Mesa de Comando',
        items: [
            { label: 'Dashboard', icon: Home, path: '/', shortcut: 'F1' },
            { label: 'Estoque Global', icon: Box, path: '/stock', shortcut: 'F8' },
        ]
    },
    {
        title: 'Comercial & Custos',
        items: [
            { label: 'Ordens de Serviço', icon: Briefcase, path: '/service-orders', shortcut: 'F2' },
            { label: 'Orçamentos', icon: Calculator, path: '/engineering/quotes', shortcut: 'F3' },
            { label: 'Clientes', icon: Users, path: '/clients', shortcut: 'F4' },
        ]
    },
    {
        title: 'Chão de Fábrica',
        items: [
            { label: 'Pré-Impressão', icon: FileCheck, path: '/production/prepress', shortcut: 'Q' },
            { label: 'Impressão', icon: Printer, path: '/production/printing', shortcut: 'W' },
            { label: 'Corte & Vinco', icon: Scissors, path: '/production/cutting', shortcut: 'E' },
            { label: 'Acabamento', icon: Package, path: '/production/finishing', shortcut: 'R' },
            { label: 'Expedição', icon: Truck, path: '/production/shipping', shortcut: 'T' },
        ]
    },
    {
        title: 'Administrativo',
        items: [
            { label: 'Faturamento', icon: Receipt, path: '/admin/billing', shortcut: 'A' },
            { label: 'Financeiro', icon: DollarSign, path: '/admin/finance', shortcut: 'S' },
            { label: 'Gestão de Equipe', icon: Users, path: '/admin/team', shortcut: 'D' },
        ]
    }
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <h1>GRÁFICA<span>XYZ</span></h1>
            </div>

            <nav className={styles.nav}>
                {MENU_GROUPS.map((group, groupIndex) => (
                    <div key={groupIndex} className={styles.group}>
                        <h3 className={styles.groupTitle}>{group.title}</h3>
                        {group.items.map((item) => {
                            const Icon = item.icon;
                            // Check if path is active or if it's a sub-route
                            const isActive = pathname === item.path || pathname?.startsWith(item.path + '/');

                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`${styles.link} ${isActive ? styles.active : ''}`}
                                >
                                    <div className={styles.iconWrapper}>
                                        <Icon size={18} />
                                    </div>
                                    <span className={styles.label}>{item.label}</span>
                                    {item.shortcut && <span className={styles.shortcut}>{item.shortcut}</span>}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            <div className={styles.footer}>
                <div className={styles.userProfile}>
                    <div className={styles.avatar}>A</div>
                    <div className={styles.userInfo}>
                        <span className={styles.userName}>Admin</span>
                        <span className={styles.userRole}>Gerente</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
