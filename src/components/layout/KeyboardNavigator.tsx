'use client';

import { useRouter } from 'next/navigation';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';

export function KeyboardNavigator() {
    const router = useRouter();

    // F1: Mesa de Comando (Home)
    useKeyboardShortcut({ key: 'F1' }, () => router.push('/'));

    // F2: Engenharia de Vendas
    useKeyboardShortcut({ key: 'F2' }, () => router.push('/quotes'));

    // F3: Chão de Fábrica
    useKeyboardShortcut({ key: 'F3' }, () => router.push('/production'));

    // F4: Almoxarifado
    useKeyboardShortcut({ key: 'F4' }, () => router.push('/stock'));

    // F5: Expedição
    useKeyboardShortcut({ key: 'F5' }, () => router.push('/shipping'));

    return null; // This component renders nothing visually
}
