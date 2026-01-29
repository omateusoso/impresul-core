'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, Layout, Save, Send, User, Calendar, Edit2 } from 'lucide-react';
import styles from './page.module.css';

const TEMPLATES = [
    {
        id: 't1',
        name: 'Pedido Recebido',
        subject: 'Confirmamos o recebimento do seu pedido #{OS_ID}',
        body: 'Olá {Nome_Cliente},\n\nRecebemos seu pedido de {Produto}. A previsão de entrega é para {Data_Entrega}.\n\nAtenciosamente,\nEquipe Impresul'
    },
    {
        id: 't2',
        name: 'Orçamento Aprovado',
        subject: 'Orçamento #{OS_ID} aprovado com sucesso!',
        body: 'Olá {Nome_Cliente},\n\nObrigado por aprovar o orçamento. Já iniciamos a produção.\n\nValor: {Valor_Total}\n\nObrigado!'
    },
    {
        id: 't3',
        name: 'Pedido Pronto',
        subject: 'Seu material está pronto para retirada',
        body: 'Olá {Nome_Cliente},\n\nO seu material ({Produto}) já está pronto e disponível na nossa expedição.\n\nHorário: 08:00 às 18:00.'
    },
];

export default function AutomationPage() {
    const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
    const [editedBody, setEditedBody] = useState(TEMPLATES[0].body);
    const [editedSubject, setEditedSubject] = useState(TEMPLATES[0].subject);

    const handleTemplateSelect = (template: typeof TEMPLATES[0]) => {
        setSelectedTemplate(template);
        setEditedBody(template.body);
        setEditedSubject(template.subject);
    };

    const insertToken = (token: string) => {
        setEditedBody(prev => prev + ` {${token}}`);
    };

    // Live Preview Data
    const PREVIEW_DATA = {
        Nome_Cliente: 'Padaria Cheirinho de Pão',
        OS_ID: '4921',
        Produto: '5000 Panfletos A5',
        Data_Entrega: '02/02/2026',
        Valor_Total: 'R$ 1.250,00'
    };

    const processPreview = (text: string) => {
        let processed = text;
        Object.entries(PREVIEW_DATA).forEach(([key, value]) => {
            processed = processed.replace(new RegExp(`{${key}}`, 'g'), value);
        });
        return processed;
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <h1>Automação de E-mails</h1>
                </div>
                <div className={styles.actions}>
                    <Button variant="ghost">Cancelar</Button>
                    <Button variant="primary">
                        <Save size={16} className="mr-2" />
                        Salvar Modelo
                    </Button>
                </div>
            </header>

            <div className={styles.editorLayout}>
                {/* Sidebar: Templates & Variables */}
                <aside className={styles.sidebar}>
                    <Card title="Modelos" className={styles.card}>
                        <div className={styles.templateList}>
                            {TEMPLATES.map(t => (
                                <button
                                    key={t.id}
                                    className={`${styles.templateBtn} ${selectedTemplate.id === t.id ? styles.active : ''}`}
                                    onClick={() => handleTemplateSelect(t)}
                                >
                                    <Layout size={16} />
                                    <span>{t.name}</span>
                                </button>
                            ))}
                        </div>
                    </Card>

                    <Card title="Variáveis Dinâmicas" className={styles.card}>
                        <div className={styles.tokenList}>
                            <button onClick={() => insertToken('Nome_Cliente')} className={styles.tokenBtn}><User size={14} /> Nome do Cliente</button>
                            <button onClick={() => insertToken('OS_ID')} className={styles.tokenBtn}><Edit2 size={14} /> Número O.S.</button>
                            <button onClick={() => insertToken('Data_Entrega')} className={styles.tokenBtn}><Calendar size={14} /> Data Entrega</button>
                        </div>
                    </Card>
                </aside>

                {/* Center: Editor */}
                <main className={styles.editorMain}>
                    <Card className={styles.editorCard}>
                        <div className={styles.fieldGroup}>
                            <label>Assunto</label>
                            <Input
                                value={editedSubject}
                                onChange={e => setEditedSubject(e.target.value)}
                            />
                        </div>

                        <div className={styles.fieldGroup}>
                            <label>Corpo do E-mail</label>
                            <textarea
                                className={styles.textarea}
                                value={editedBody}
                                onChange={e => setEditedBody(e.target.value)}
                            />
                        </div>
                    </Card>
                </main>

                {/* Right: Live Preview */}
                <aside className={styles.previewSidebar}>
                    <div className={styles.previewHeader}>Preview em Tempo Real</div>
                    <div className={styles.mobileFrame}>
                        <div className={styles.emailPreview}>
                            <div className={styles.emailHeader}>
                                <strong>De:</strong> Impresul &lt;nao-responda@impresul.com&gt;<br />
                                <strong>Para:</strong> cliente@exemplo.com<br />
                                <strong>Assunto:</strong> {processPreview(editedSubject)}
                            </div>
                            <div className={styles.emailBody}>
                                {processPreview(editedBody).split('\n').map((line, i) => (
                                    <p key={i} style={{ minHeight: '1rem' }}>{line}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
