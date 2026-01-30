'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { CheckCircle, XCircle, Download, ZoomIn, ZoomOut, AlertTriangle } from 'lucide-react';

export default function ProofPage() {
    const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
    const [rejectionReason, setRejectionReason] = useState('');

    if (status === 'approved') {
        return (
            <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border-2 border-green-100">
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Aprovado com Sucesso!</h1>
                    <p className="text-gray-600 mb-6">Obrigado. Seu arquivo já foi liberado para a produção e entrará em máquina em breve.</p>
                    <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-500">
                        ID da Aprovação: #APR-9921<br />
                        IP Registrado: 201.192.12.33
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <header className="bg-white px-6 py-4 shadow-sm flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold">I</div>
                    <div>
                        <h1 className="text-sm font-bold text-gray-900">Impresul - Sistema de Provas</h1>
                        <p className="text-xs text-gray-500">Job: #109237 - Cartazes A3 Verão</p>
                    </div>
                </div>
                <Button variant="outline" size="sm">
                    <Download size={16} className="mr-2" /> Baixar PDF
                </Button>
            </header>

            {/* Viewer Area */}
            <main className="flex-1 p-6 flex flex-col items-center justify-center gap-4 relative">
                <div className="bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-200" style={{ maxWidth: '800px', width: '100%', aspectRatio: '1.414' }}>
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300 relative group">
                        <span className="text-2xl font-bold">[ PROVA DIGITAL - MOCKUP ]</span>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors cursor-zoom-in" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 bg-white rounded-full shadow hover:bg-gray-50"><ZoomOut size={20} /></button>
                    <button className="p-2 bg-white rounded-full shadow hover:bg-gray-50"><ZoomIn size={20} /></button>
                </div>
            </main>

            {/* Action Bar */}
            <footer className="bg-white border-t border-gray-200 p-6">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                        <AlertTriangle size={16} className="text-amber-500" />
                        <span>Confira textos, telefones e cores antes de aprovar.</span>
                    </div>

                    <div className="flex gap-4 w-full md:w-auto">
                        <button
                            className="flex-1 md:flex-none px-6 py-3 rounded-lg border-2 border-red-100 text-red-600 font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                            onClick={() => setStatus('rejected')}
                        >
                            <XCircle size={20} />
                            REPROVAR
                        </button>
                        <button
                            className="flex-1 md:flex-none px-8 py-3 rounded-lg bg-green-600 text-white font-bold shadow-lg hover:bg-green-700 transition-transform active:scale-95 flex items-center justify-center gap-2"
                            onClick={() => {
                                if (confirm("Confirma que o arquivo está correto e autoriza a impressão?")) {
                                    setStatus('approved');
                                }
                            }}
                        >
                            <CheckCircle size={20} />
                            APROVAR PARA PRODUÇÃO
                        </button>
                    </div>
                </div>
            </footer>

            {/* Rejection Modal */}
            {status === 'rejected' && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <h2 className="text-lg font-bold text-red-600 mb-4">O que precisa ser corrigido?</h2>
                        <textarea
                            className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-red-200 outline-none"
                            placeholder="Descreva o erro (Ex: Cor do logo errada, telefone incorreto...)"
                            autoFocus
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                        />
                        <div className="flex justify-end gap-3 mt-4">
                            <Button variant="ghost" onClick={() => setStatus('pending')}>Cancelar</Button>
                            <Button variant="destructive" onClick={() => alert('Feedback enviado para a pré-impressão!')}>Enviar Reprovação</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Inline Tailwind-like classes used for simplicity in this mock component
// In a real scenario, this would use CSS Modules to match the rest of the project
