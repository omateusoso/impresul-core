export interface Order {
    id: string;
    client: string;
    jobName: string;
    quantity: number;
    deadline: string;
    status: 'pending' | 'prepress' | 'printing' | 'finishing' | 'ready' | 'delivered';
    printer: 'Heidelberg' | 'Konica' | 'Plotter';
    priority: 'normal' | 'high';
}

export const ORDERS: Order[] = [
    { id: '4001', client: 'Padaria Cheirinho de Pão', jobName: 'Panfletos A5', quantity: 5000, deadline: '2024-02-01', status: 'printing', printer: 'Heidelberg', priority: 'normal' },
    { id: '4002', client: 'Construtora Silva', jobName: 'Cartões de Visita', quantity: 500, deadline: '2024-01-30', status: 'finishing', printer: 'Konica', priority: 'high' },
    { id: '4003', client: 'Agência Criativa Vibe', jobName: 'Revista Institucional', quantity: 1000, deadline: '2024-02-05', status: 'prepress', printer: 'Heidelberg', priority: 'normal' },
    { id: '4004', client: 'Restaurante Sabor Caseiro', jobName: 'Cardápios PVC', quantity: 50, deadline: '2024-01-29', status: 'ready', printer: 'Plotter', priority: 'high' },
    { id: '4005', client: 'Imobiliária House', jobName: 'Pastas com Bolsa', quantity: 1000, deadline: '2024-02-10', status: 'pending', printer: 'Heidelberg', priority: 'normal' },
    { id: '4006', client: 'Evento Tech 2024', jobName: 'Crachás', quantity: 300, deadline: '2024-01-28', status: 'delivered', printer: 'Konica', priority: 'high' },
    { id: '4007', client: 'Bar do Zé', jobName: 'Comandas', quantity: 2000, deadline: '2024-02-02', status: 'printing', printer: 'Heidelberg', priority: 'normal' },
    { id: '4008', client: 'Escola Aprender', jobName: 'Apostilas', quantity: 100, deadline: '2024-02-03', status: 'finishing', printer: 'Konica', priority: 'normal' },
];
