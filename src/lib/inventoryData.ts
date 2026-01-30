export type Vendor = 'Suzano' | '3M' | 'Avery' | 'Klabin' | 'Sun Chemical';

export interface InventoryItem {
    id: string;
    internalCode: string;
    name: string;
    vendor: Vendor;
    type: 'rigid' | 'roll' | 'supply';
    category: 'offset' | 'visual' | 'supply';
    stock: number;
    unit: string;
    minStock: number;
    cost: number;
    location: string;
    // Specs
    weight?: number; // g/m²
    thickness?: number; // microns
    dimensions?: string; // e.g. "660x960"
    width?: number; // meters (for rolls)
    length?: number; // meters (for rolls)
    // Compatibility
    compatibleMachines: string[];
    // History (Mocked separately or included)
    lastMovement?: string;
}

export const INVENTORY_ITEMS: InventoryItem[] = [
    // PAPERS (OFFSET)
    {
        id: '1',
        internalCode: 'PAP-CB-150',
        name: 'Couché Brilho 150g',
        vendor: 'Suzano',
        type: 'rigid',
        category: 'offset',
        stock: 15, // Resmas
        unit: 'resmas',
        minStock: 5,
        cost: 120.00,
        location: 'A-01',
        weight: 150,
        dimensions: '660x960',
        compatibleMachines: ['Heidelberg XL 75', 'Konica Minolta C3070'],
        lastMovement: '2023-10-25'
    },
    {
        id: '2',
        internalCode: 'PAP-OFF-90',
        name: 'Offset 90g',
        vendor: 'Klabin',
        type: 'rigid',
        category: 'offset',
        stock: 50,
        unit: 'resmas',
        minStock: 10,
        cost: 85.50,
        location: 'A-02',
        weight: 90,
        dimensions: '660x960',
        compatibleMachines: ['Heidelberg XL 75', 'Konica Minolta C3070'],
        lastMovement: '2023-10-26'
    },
    {
        id: '3',
        internalCode: 'PAP-SUP-300',
        name: 'Supremo Duo Design 300g',
        vendor: 'Suzano',
        type: 'rigid',
        category: 'offset',
        stock: 3, // Low stock
        unit: 'resmas',
        minStock: 8,
        cost: 210.00,
        location: 'A-03',
        weight: 300,
        dimensions: '660x960',
        compatibleMachines: ['Heidelberg XL 75'], // Too thick for some digital printers maybe?
        lastMovement: '2023-10-20'
    },

    // VISUAL COMMUNICATION (ROLLS)
    {
        id: '4',
        internalCode: 'LON-BK-440',
        name: 'Lona Backlight 440g',
        vendor: '3M',
        type: 'roll',
        category: 'visual',
        stock: 2, // Rolls
        unit: 'rolos',
        minStock: 1,
        cost: 450.00,
        location: 'B-01',
        width: 3.20,
        length: 50,
        compatibleMachines: ['Plotter Mutoh', 'HP Latex'],
        lastMovement: '2023-10-15'
    },
    {
        id: '5',
        internalCode: 'VIN-AD-BRI',
        name: 'Vinil Adesivo Branco Brilho',
        vendor: 'Avery',
        type: 'roll',
        category: 'visual',
        stock: 8,
        unit: 'rolos',
        minStock: 3,
        cost: 280.00,
        location: 'B-02',
        width: 1.06,
        length: 50,
        compatibleMachines: ['Plotter Mutoh', 'HP Latex', 'Plotter Roland'],
        lastMovement: '2023-10-27'
    },

    // SUPPLIES
    {
        id: '6',
        internalCode: 'TIN-CY-OFF',
        name: 'Tinta Offset Cyan',
        vendor: 'Sun Chemical',
        type: 'supply',
        category: 'supply',
        stock: 12,
        unit: 'kg',
        minStock: 5,
        cost: 45.00,
        location: 'C-01',
        compatibleMachines: ['Heidelberg XL 75'],
        lastMovement: '2023-10-22'
    }
];

export const MACHINES = {
    offset: [
        { id: 'm1', name: 'Heidelberg XL 75', type: 'offset' },
        { id: 'm2', name: 'Konica Minolta C3070', type: 'digital' }
    ],
    plotter: [
        { id: 'm3', name: 'Plotter Mutoh', type: 'solvent' },
        { id: 'm4', name: 'HP Latex', type: 'latex' },
        { id: 'm5', name: 'Plotter Roland', type: 'cut' }
    ]
};
