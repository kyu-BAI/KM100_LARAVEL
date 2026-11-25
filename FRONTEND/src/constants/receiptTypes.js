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
    id: 'consumables-petc-office',
    name: 'PETC Office Supplies Receipt',
    tableName: 'consumables_receipts',
    description: 'PETC office supplies, printer paper, thermal rolls & ink',
    category: 'Consumables',
    categoryId: 'consumables',
    subCategory: 'Office supplies',
    entity: 'PETC',
    prefix: 'CNS-PETC'
  },
  {
    id: 'consumables-knoah-mari-store',
    name: 'Knoah Mari Store Consumables',
    tableName: 'consumables_receipts',
    description: 'Knoah Mari store consumables, supplies, and kitchen materials',
    category: 'Consumables',
    categoryId: 'consumables',
    subCategory: 'Store Consumables',
    entity: 'Knoah Mari',
    prefix: 'CNS-KM'
  },
  {
    id: 'consumables-red-goose-store',
    name: 'Red Goose Store Consumables',
    tableName: 'consumables_receipts',
    description: 'Red Goose store consumables, retail packaging, and supplies',
    category: 'Consumables',
    categoryId: 'consumables',
    subCategory: 'Store Consumables',
    entity: 'Red Goose',
    prefix: 'CNS-RG'
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
