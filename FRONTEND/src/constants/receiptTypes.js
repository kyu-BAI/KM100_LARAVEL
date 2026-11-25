// Receipt Types matching dedicated database tables and handwritten accounting diagrams
export const RECEIPT_TYPES = [
  {
    id: 'petc-sales',
    name: 'PETC Sales Receipt',
    tableName: 'petc_sales_receipts',
    description: 'Vehicle emission testing fee receipt & inspection certificate',
    category: 'Sales',
    categoryId: 'sales',
    subCategory: 'Sales 2026 (PETC)',
    entity: 'PETC',
    prefix: 'SALES'
  },
  {
    id: 'red-goose-sales',
    name: 'Red Goose Sales Receipt',
    tableName: 'inventory_items',
    description: 'Red Goose branch sales and customer invoices',
    category: 'Sales',
    categoryId: 'sales',
    subCategory: 'Red Goose Sales 2026',
    entity: 'Red Goose',
    prefix: 'SALES-RG'
  },
  {
    id: 'knoah-mari-sales',
    name: 'Knoah Mari Sales Receipt',
    tableName: 'inventory_items',
    description: 'Knoah Mari branch sales and customer invoices',
    category: 'Sales',
    categoryId: 'sales',
    subCategory: 'Knoah Mari Sales 2026',
    entity: 'Knoah Mari',
    prefix: 'SALES-KM'
  },
  {
    id: 'petc-income',
    name: 'PETC Income Receipt',
    tableName: 'inventory_items',
    description: 'PETC daily collections, revenue vouchers & operational income',
    category: 'Income',
    categoryId: 'income',
    subCategory: 'Income 2026 (PETC)',
    entity: 'PETC',
    prefix: 'INC'
  },
  {
    id: 'red-goose-income',
    name: 'Red Goose Income Receipt',
    tableName: 'inventory_items',
    description: 'Red Goose branch daily collections and operational income',
    category: 'Income',
    categoryId: 'income',
    subCategory: 'Red Goose Income 2026',
    entity: 'Red Goose',
    prefix: 'INC-RG'
  },
  {
    id: 'knoah-mari-income',
    name: 'Knoah Mari Income Receipt',
    tableName: 'inventory_items',
    description: 'Knoah Mari branch daily collections & revenue vouchers',
    category: 'Income',
    categoryId: 'income',
    subCategory: 'Knoah Mari Income 2026',
    entity: 'Knoah Mari',
    prefix: 'INC-KM'
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
