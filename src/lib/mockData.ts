export const CLIENTS = [
    { id: '1', name: 'Padaria Cheirinho de Pão', cnpj: '12.345.678/0001-90', status: 'active', credit: 5000 },
    { id: '2', name: 'Construtora Silva', cnpj: '98.765.432/0001-10', status: 'blocked', credit: 0 },
    { id: '3', name: 'Agência Criativa Vibe', cnpj: '11.222.333/0001-55', status: 'active', credit: 12000 },
    { id: '4', name: 'Restaurante Sabor Caseiro', cnpj: '44.555.666/0001-22', status: 'active', credit: 2000 },
];

export const SUBSTRATES = [
    { id: 'p1', name: 'Papel Couché Brilho 115g', stock: 5000, unit: 'folhas', warningThreshold: 1000 },
    { id: 'p2', name: 'Papel Couché Mate 170g', stock: 1200, unit: 'folhas', warningThreshold: 500 },
    { id: 'p3', name: 'Papel Offset 90g', stock: 10000, unit: 'folhas', warningThreshold: 2000 },
    { id: 'p4', name: 'Supremo Duo Design 250g', stock: 150, unit: 'folhas', warningThreshold: 200 }, // Low stock
];

export const SERVICES = [
    { id: 's1', name: 'Impressão 4x0', costPerUnit: 0.10 },
    { id: 's2', name: 'Impressão 4x4', costPerUnit: 0.18 },
    { id: 's3', name: 'Laminação Fosca', costPerUnit: 0.05 },
    { id: 's4', name: 'Verniz Localizado', costPerUnit: 0.12 },
];
