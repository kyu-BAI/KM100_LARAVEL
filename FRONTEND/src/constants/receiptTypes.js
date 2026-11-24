// Receipt Types matching dedicated database tables and handwritten accounting diagrams
export const RECEIPT_TYPES = [
  {
    id: 'petc-sales',
    name: 'PETC Sales Receipt',
    tableName: 'petc_sales_receipts',
    description: 'Vehicle emission testing fee receipt & inspection certificate',
    category: 'PETC Sales',
    categoryId: 'petc-sales',
    subCategory: 'Emission Testing',
    entity: 'PETC',
    prefix: 'SALES'
  },
  {
    id: 'petc-income',
    name: 'PETC Income Receipt',
    tableName: 'inventory_items',
    description: 'PETC daily collections, revenue vouchers & operational income',
    category: 'PETC Income',
    categoryId: 'petc-income',
    subCategory: 'Daily Collection',
    entity: 'PETC',
    prefix: 'INC'
  },
  {
    id: 'petc-insurance',
    name: 'PETC CTPL Insurance Receipt',
    tableName: 'petc_insurance_receipts',
    description: 'Compulsory third party liability insurance policy payment',
    category: 'PETC Insurance',
    categoryId: 'petc-insurance',
    subCategory: 'CTPL Insurance',
    entity: 'PETC',
    prefix: 'INS'
  },
  {
    id: 'expenses-petc',
    name: 'PETC Expense Receipt',
    tableName: 'petc_expense_receipts',
    description: 'PETC calibration, utilities, rent, and operational disbursements',
    category: 'Expenses',
    categoryId: 'expenses',
    subCategory: 'Expenses 2026 (PETC)',
    entity: 'PETC',
    prefix: 'EXP-PETC'
  },
  {
    id: 'expenses-red-goose',
    name: 'Red Goose Expense Receipt',
    tableName: 'red_goose_expense_receipts',
    description: 'Red Goose branch operational expenses and invoices',
    category: 'Expenses',
    categoryId: 'expenses',
    subCategory: 'Red Goose Expenses 2026',
    entity: 'Red Goose',
    prefix: 'EXP-RG'
  },
  {
    id: 'expenses-knoah-mari',
    name: 'Knoah Mari Expense Receipt',
    tableName: 'knoah_mari_expense_receipts',
    description: 'Knoah Mari testing supplies, rent, and utility disbursements',
    category: 'Expenses',
    categoryId: 'expenses',
    subCategory: 'Knoah Mari Expenses 2026',
    entity: 'Knoah Mari',
    prefix: 'EXP-KM'
  },
  {
    id: 'consumables-delivery',
    name: 'Consumables Purchase Receipt',
    tableName: 'consumables_receipts',
    description: 'Office paper, cleaning chemicals & smoke filter deliveries',
    category: 'Consumables',
    categoryId: 'consumables',
    subCategory: 'Office supply',
    entity: 'General',
    prefix: 'CNS'
  },
  {
    id: 'voucher-disbursement',
    name: 'Payment Voucher Receipt',
    tableName: 'voucher_receipts',
    description: 'Official liquidation slip and petty cash payment voucher',
    category: 'Vouchers',
    categoryId: 'vouchers',
    subCategory: 'PETC',
    entity: 'PETC',
    prefix: 'VCH'
  }
];
