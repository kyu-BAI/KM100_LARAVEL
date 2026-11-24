/**
 * KM100 Database Mappers
 *
 * Transforms between MySQL snake_case database columns and frontend camelCase attributes.
 */

export function mapFromDb(row, tableName = '') {
  if (!row) return null;

  // Determine category accurately based on category field, source table, or filename
  let rawCat = row.category;
  const fileName = row.file_name || '';

  if (!rawCat || (rawCat === 'Expenses' && (
    tableName === 'petc_sales_receipts' || 
    tableName === 'petc_income_receipts' || 
    tableName === 'petc_insurance_receipts' || 
    tableName === 'consumables_receipts' || 
    tableName === 'voucher_receipts' || 
    fileName.includes('SALES') || 
    fileName.includes('INC') || 
    fileName.includes('INS') || 
    fileName.includes('CNS') || 
    fileName.includes('VCH')
  ))) {
    if (tableName === 'petc_sales_receipts' || fileName.includes('SALES')) {
      rawCat = 'PETC Sales';
    } else if (tableName === 'petc_insurance_receipts' || fileName.includes('INS')) {
      rawCat = 'PETC Insurance';
    } else if (fileName.includes('INC')) {
      rawCat = 'PETC Income';
    } else if (tableName === 'consumables_receipts' || fileName.includes('CNS')) {
      rawCat = 'Consumables';
    } else if (tableName === 'voucher_receipts' || fileName.includes('VCH')) {
      rawCat = 'Vouchers';
    } else if (!rawCat) {
      rawCat = 'Expenses';
    }
  }

  // Derive category_id accurately
  let rawCatId = row.category_id;
  if (!rawCatId || (rawCatId === 'expenses' && rawCat !== 'Expenses')) {
    if (rawCat === 'PETC Sales') rawCatId = 'petc-sales';
    else if (rawCat === 'PETC Income') rawCatId = 'petc-income';
    else if (rawCat === 'PETC Insurance') rawCatId = 'petc-insurance';
    else if (rawCat === 'Consumables') rawCatId = 'consumables';
    else if (rawCat === 'Vouchers') rawCatId = 'vouchers';
    else rawCatId = rawCat.toLowerCase().replace(/\s+/g, '-');
  }

  // Derive entity accurately
  let rawEntity = row.entity;
  if (!rawEntity) {
    if (tableName === 'knoah_mari_expense_receipts' || fileName.includes('EXP-KM')) {
      rawEntity = 'Knoah Mari';
    } else if (tableName === 'red_goose_expense_receipts' || fileName.includes('EXP-RG')) {
      rawEntity = 'Red Goose';
    } else {
      rawEntity = 'PETC';
    }
  }

  const scanDate = row.scanned_at 
    ? new Date(row.scanned_at).toISOString().split('T')[0]
    : (row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : '');
  const recDate = row.receipt_date || row.preview_data?.receipt_date || '';

  return {
    id: row.id,
    fileName: row.file_name,
    title: row.title || row.file_name,
    establishment: row.establishment || row.preview_data?.establishment || '',
    receiptDate: recDate,
    scannedDate: scanDate,
    description: row.description || row.preview_data?.description || '',
    category: rawCat,
    categoryId: rawCatId,
    subCategory: row.sub_category || (rawEntity ? `${rawEntity} ${rawCat}` : rawCat),
    subCategoryId: row.sub_category_id || '',
    entity: rawEntity,
    year: row.year ? String(row.year) : '',
    month: row.month ? String(row.month).toUpperCase() : '',
    amount: Number(row.amount) || 0,
    currency: row.currency || 'PHP',
    quantity: Number(row.quantity) || 1,
    unit: row.unit || 'receipt',
    status: row.status || 'Active',
    fileFormat: row.file_format || 'JPG',
    fileSize: row.file_size || '0 KB',
    filePath: row.file_path || '',
    notes: row.notes || '',
    tags: Array.isArray(row.tags) ? row.tags : [],
    previewData: row.preview_data || null,
    createdAt: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : '',
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString().split('T')[0] : ''
  };
}

export function mapToDb(item) {
  return {
    id: item.id,
    file_name: item.fileName || item.title || 'document.pdf',
    title: item.title || item.fileName || 'Untitled Document',
    establishment: item.establishment || '',
    receipt_date: item.receiptDate || '',
    description: item.description || '',
    category: item.category || '',
    category_id: item.categoryId || '',
    sub_category: item.subCategory || '',
    sub_category_id: item.subCategoryId || '',
    entity: item.entity || '',
    year: item.year !== undefined && item.year !== null ? String(item.year) : '',
    month: item.month || '',
    amount: Number(item.amount) || 0,
    currency: item.currency || 'PHP',
    quantity: Number(item.quantity) || 0,
    unit: item.unit || '',
    status: item.status || 'Active',
    file_format: item.fileFormat || 'PDF',
    file_size: item.fileSize || '0 KB',
    file_path: item.filePath || '',
    notes: item.notes || '',
    tags: Array.isArray(item.tags) ? item.tags : [],
    preview_data: item.previewData || null,
    updated_at: new Date().toISOString()
  };
}
