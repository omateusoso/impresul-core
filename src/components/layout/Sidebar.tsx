'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calculator, Printer, Package, Truck, Settings } from 'lucide-react';
import styles from './Sidebar.module.css';

const MENU_ITEMS = [
    { label: 'Mesa de Comando', icon: Home, path: '/', shortcut: 'F1' },
    { label: 'Engenharia de Vendas', icon: Calculator, path: '/quotes', shortcut: 'F2' },
    { label: 'Chão de Fábrica', icon: Printer, path: '/production', shortcut: 'F3' },
    { label: 'Almoxarifado', icon: Package, path: '/stock', shortcut: 'F4' },
    { label: 'Expedição', icon: Truck, path: '/shipping', shortcut: 'F5' },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <h1>IMPRESUL<span>CORE</span></h1>
            </div>

            <nav className={styles.nav}>
                {MENU_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`${styles.link} ${isActive ? styles.active : ''}`}
                        >
                            <div className={styles.iconWrapper}>
                                <Icon size={20} />
                            </div>
                            <span className={styles.label}>{item.label}</span>
                            <span className={styles.shortcut}>{item.shortcut}</span>
                        </Link>
                    );
                })}
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
