import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Roboto_Mono } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { KeyboardNavigator } from '@/components/layout/KeyboardNavigator';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-brand' });
const robotoMono = Roboto_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
    title: 'Impresul Core',
    description: 'Sistema de Gestão Integrada',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
            <body className={`${jakarta.variable} ${robotoMono.variable}`}>
                <div style={{ display: 'flex', minHeight: '100vh' }}>
                    <Sidebar />
                    <KeyboardNavigator />
                    <main style={{ flex: 1, marginLeft: '280px', padding: '2rem' }}>
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}
