#!/bin/bash
echo "🚀 Inicializando repositório Git..."
git init
git checkout -b main 2>/dev/null || git checkout -b master

echo "📦 Adicionando arquivos..."
git add .
git commit -m "Initial commit: Impresul Core platform"

echo "🔗 Conectando ao GitHub..."
git remote remove origin 2>/dev/null
git remote add origin https://github.com/omateusoso/impresul-core.git

echo "⬆️ Enviando para o GitHub..."
git push -u origin main

echo "✅ Concluído! Repositório configurado com sucesso."
