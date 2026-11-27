import XLSX from 'xlsx-js-style';

/**
 * Generates and downloads a clean, executive, and professional Excel report (.xlsx)
 * without folder paths or clutter, highlighting essential receipt & financial information.
 *
 * @param {Object} options
 * @param {string} options.folderLabel - Active folder/branch name (used only to identify scope)
 * @param {Array} options.folderItems - Array of receipt items to export
 * @param {Function} options.showNotice - Notification callback (text, type)
 */
export function exportRecordsToExcel({ folderLabel = 'Inventory Records', folderItems = [], showNotice }) {
  if (!folderItems || folderItems.length === 0) {
    if (showNotice) showNotice('No records available to export.', 'error');
    return;
  }

  try {
    const encodeCell = (r, c) => XLSX.utils.encode_cell({ r, c });
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Derive a clean, human-readable report title without folder arrows (e.g. "Knoah Mari Expenses" instead of "Expenses > Knoah Mari Expenses 2026")
    const cleanScope = folderLabel
      .split('>')
      .map(s => s.trim())
      .filter(Boolean)
      .pop() || 'Inventory Records';

    const isConsumablesReport = cleanScope.toLowerCase().includes('consumable') || 
                                cleanScope.toLowerCase().includes('office') || 
                                folderItems.every(it => it.category === 'Consumables' || it.categoryId === 'consumables');

    const isSalesReport = !isConsumablesReport && (
      cleanScope.toLowerCase().includes('sales') ||
      folderItems.every(it => (it.category || '').toLowerCase() === 'sales')
    );
    const isIncomeReport = !isConsumablesReport && (
      cleanScope.toLowerCase().includes('income') ||
      folderItems.every(it => (it.category || '').toLowerCase() === 'income')
    );
    const isDailySalesOrIncome = isSalesReport || isIncomeReport;

    const reportTitle = cleanScope.toUpperCase() + (
      isConsumablesReport
        ? ' - CONSUMABLES INVENTORY REGISTER'
        : isSalesReport
          ? ' - DAILY SALES REPORT'
          : isIncomeReport
            ? ' - DAILY INCOME REPORT'
            : ' - AUDIT REPORT'
    );

    // Calculate total sum
    const totalAmount = folderItems.reduce((sum, it) => sum + (parseFloat(it.amount) || 0), 0);
    const totalFormatted = '₱' + totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // 1. Prepare clean array of arrays (AOA)
    const headerCols = isConsumablesReport
      ? ['Item No.', 'Date', 'Particulars', 'Supplier', 'OR / SI No.', 'Qty', 'Unit Measure', 'Unit Cost (PHP)', 'Amount (PHP)', 'Branch', 'Status']
      : isDailySalesOrIncome
        ? ['No.', 'Date', 'Establishment', 'Remarks / Notes', isSalesReport ? 'Daily Sales (PHP)' : 'Daily Income (PHP)', 'Status']
        : ['No.', 'Document Title', 'Establishment / Store', 'Invoice / OR No.', 'Branch', 'Receipt Date', 'Date Recorded', 'Amount (PHP)', 'Status'];

    const summaryLabel = isDailySalesOrIncome
      ? `EXPORT DATE: ${dateStr} • ${timeStr}     |     TOTAL DAYS: ${folderItems.length}     |     TOTAL ${isSalesReport ? 'SALES' : 'INCOME'}: ${totalFormatted}     |     STATUS: RECORDED`
      : `EXPORT DATE: ${dateStr} • ${timeStr}     |     TOTAL RECORDS: ${folderItems.length}     |     TOTAL AMOUNT: ${totalFormatted}     |     STATUS: VERIFIED INVENTORY`;

    const aoa = [
      // Row 0: Company Header Banner
      ['KM100 SKILLS & TRAINING CENTER, INC.'],
      // Row 1: Report Title Banner
      [reportTitle],
      // Row 2: Metadata Summary Bar
      [summaryLabel],
      // Row 3: Spacer Row
      [],
      // Row 4: Clean, Essential Table Column Headers
      headerCols
    ];

    const exportItems = isDailySalesOrIncome
      ? [...folderItems].sort((a, b) => (b.receiptDate || b.scannedDate || '').localeCompare(a.receiptDate || a.scannedDate || ''))
      : folderItems;

    // 2. Map and clean each item row
    exportItems.forEach((item, index) => {
      const num = index + 1;
      const preview = item.previewData || {};

      if (isConsumablesReport) {
        const itemNumber = item.itemNo || preview.itemNo || num;
        const dateVal = item.receiptDate || preview.date || item.scannedDate || item.createdAt || '-';
        const particulars = item.title || preview.particulars || item.fileName?.replace(/\.item$/i, '') || '-';
        const supplier = item.supplier || preview.supplier || (item.establishment && item.establishment !== item.entity ? item.establishment : '') || '-';
        const orSiNo = item.orSiNo || preview.orSiNo || preview.or_si_no || '-';
        const qty = parseFloat(item.quantity) || parseFloat(preview.quantity) || 1;
        const unitMeasure = item.unit || preview.unitMeasure || 'pcs';
        const amount = parseFloat(item.amount) || parseFloat(preview.amount) || 0;
        const unitCost = parseFloat(item.unitCost) || parseFloat(preview.unitCost) || (qty > 0 && amount > 0 ? (amount / qty) : 0);
        const branch = item.entity || '-';
        const status = item.status || 'In Stock';

        aoa.push([
          itemNumber,
          dateVal,
          particulars,
          supplier,
          orSiNo,
          qty,
          unitMeasure,
          unitCost,
          amount,
          branch,
          status
        ]);
      } else if (isDailySalesOrIncome) {
        const entryDate = item.receiptDate || item.scannedDate || item.createdAt || '-';
        const establishment = item.entity || item.establishment || '-';
        const remarks = item.notes || item.description || item.title || '-';
        const amount = parseFloat(item.amount) || 0;
        const status = item.status || 'Recorded';

        aoa.push([
          num,
          entryDate,
          establishment,
          remarks,
          amount,
          status
        ]);
      } else {
        const docTitle = item.title || item.fileName || '-';
        const store = item.establishment || item.store || '-';
        const invoiceOr = item.referenceNumber || item.orNumber || item.invoiceNumber || '-';
        const branch = item.entity || item.subCategory || '-';
        const receiptDate = item.receiptDate || (item.year ? `${item.year} ${item.month || ''}`.trim() : '-');
        const recordedDate = item.scannedDate || item.createdAt || '-';
        const amount = parseFloat(item.amount) || 0;
        const status = item.status || 'Verified';

        aoa.push([
          num,
          docTitle,
          store,
          invoiceOr,
          branch,
          receiptDate,
          recordedDate,
          amount,
          status
        ]);
      }
    });

    const dataStartRow = 5; // Row index 5 is first item
    const dataEndRow = dataStartRow + exportItems.length - 1;
    const colCount = headerCols.length;
    const amountColIdx = isConsumablesReport ? 8 : isDailySalesOrIncome ? 4 : 7;
    const statusColIdx = colCount - 1;

    // 3. Summary Footer Rows
    aoa.push([]); // Spacer row
    const totalRow = new Array(colCount).fill('');
    totalRow[0] = isSalesReport ? 'TOTAL SALES (PHP):' : isIncomeReport ? 'TOTAL INCOME (PHP):' : 'TOTAL AMOUNT (PHP):';
    totalRow[amountColIdx] = totalAmount;
    totalRow[statusColIdx] = 'KM100 VERIFIED';
    aoa.push(totalRow);
    aoa.push([
      'KM100 • OFFICIAL AUDIT COPY'
    ]);

    // 4. Create Worksheet
    const ws = XLSX.utils.aoa_to_sheet(aoa);

    // 5. Optimized Column Widths (breathing room for all data)
    ws['!cols'] = isConsumablesReport
      ? [
          { wch: 10 }, // Item No.
          { wch: 14 }, // Date
          { wch: 30 }, // Particulars
          { wch: 24 }, // Supplier
          { wch: 16 }, // OR / SI No.
          { wch: 8 },  // Qty
          { wch: 14 }, // Unit Measure
          { wch: 16 }, // Unit Cost
          { wch: 18 }, // Amount
          { wch: 16 }, // Branch
          { wch: 14 }  // Status
        ]
      : isDailySalesOrIncome
        ? [
            { wch: 7 },  // No.
            { wch: 16 }, // Date
            { wch: 20 }, // Establishment
            { wch: 42 }, // Remarks / Notes
            { wch: 22 }, // Daily Sales / Income (PHP)
            { wch: 16 }  // Status
          ]
        : [
            { wch: 6 },  // 0: No.
            { wch: 28 }, // 1: Document Title
            { wch: 32 }, // 2: Establishment / Store
            { wch: 20 }, // 3: Invoice / OR No.
            { wch: 18 }, // 4: Branch
            { wch: 15 }, // 5: Receipt Date
            { wch: 16 }, // 6: Date Recorded
            { wch: 20 }, // 7: Amount (PHP)
            { wch: 15 }  // 8: Status
          ];

    // 6. Merged Regions
    const totalRowIdx = dataEndRow + 2;
    const footerRowIdx = totalRowIdx + 1;

    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: colCount - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: colCount - 1 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: colCount - 1 } },
      { s: { r: totalRowIdx, c: 0 }, e: { r: totalRowIdx, c: amountColIdx - 1 } },
      { s: { r: footerRowIdx, c: 0 }, e: { r: footerRowIdx, c: colCount - 1 } }
    ];

    // Row heights for executive spacing
    ws['!rows'] = [
      { hpt: 30 }, // Row 0: Company
      { hpt: 22 }, // Row 1: Subtitle
      { hpt: 20 }, // Row 2: Metadata
      { hpt: 10 }, // Row 3: Spacer
      { hpt: 25 }  // Row 4: Column Headers
    ];

    // 7. KM100 Orange Styling Palette
    const brandNavy = { fgColor: { rgb: '1E293B' } };
    const brandBlue = { fgColor: { rgb: 'F47721' } };
    const metadataFill = { fgColor: { rgb: 'FFF7ED' } };
    const headerFill = { fgColor: { rgb: 'FFEDD5' } };
    const altRowFill = { fgColor: { rgb: 'FFFBF5' } };
    const summaryFill = { fgColor: { rgb: 'FFEDD5' } };

    const thinBorder = {
      top: { style: 'thin', color: { rgb: 'FED7AA' } },
      bottom: { style: 'thin', color: { rgb: 'FED7AA' } },
      left: { style: 'thin', color: { rgb: 'FED7AA' } },
      right: { style: 'thin', color: { rgb: 'FED7AA' } }
    };

    const headerBorder = {
      top: { style: 'medium', color: { rgb: 'F47721' } },
      bottom: { style: 'medium', color: { rgb: 'F47721' } },
      left: { style: 'thin', color: { rgb: 'FDBA74' } },
      right: { style: 'thin', color: { rgb: 'FDBA74' } }
    };

    const doubleBottomBorder = {
      top: { style: 'thin', color: { rgb: 'F47721' } },
      bottom: { style: 'double', color: { rgb: '9A3412' } },
      left: { style: 'thin', color: { rgb: 'FDBA74' } },
      right: { style: 'thin', color: { rgb: 'FDBA74' } }
    };

    // Style Row 0: Company Header
    const cellA1 = ws[encodeCell(0, 0)];
    if (cellA1) {
      cellA1.s = {
        font: { name: 'Calibri', sz: 14, bold: true, color: { rgb: 'FFFFFF' } },
        fill: brandNavy,
        alignment: { horizontal: 'center', vertical: 'center' }
      };
    }

    // Style Row 1: Report Title
    const cellA2 = ws[encodeCell(1, 0)];
    if (cellA2) {
      cellA2.s = {
        font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: 'FFFFFF' } },
        fill: brandBlue,
        alignment: { horizontal: 'center', vertical: 'center' }
      };
    }

    // Style Row 2: Metadata Bar
    const cellA3 = ws[encodeCell(2, 0)];
    if (cellA3) {
      cellA3.s = {
        font: { name: 'Calibri', sz: 9, bold: true, color: { rgb: '334155' } },
        fill: metadataFill,
        border: {
          bottom: { style: 'thin', color: { rgb: 'CBD5E1' } }
        },
        alignment: { horizontal: 'center', vertical: 'center' }
      };
    }

    // Style Row 4: Column Headers
    for (let c = 0; c < colCount; c++) {
      const cell = ws[encodeCell(4, c)];
      if (cell) {
        const isCenter = isDailySalesOrIncome
          ? (c === 0 || c === 1 || c === 2 || c === statusColIdx)
          : isConsumablesReport
            ? (c === 0 || c === 1 || c === 4 || c === 5 || c === 6 || c === 9 || c === statusColIdx)
            : (c === 0 || c === 3 || c === 4 || c === 5 || c === 6 || c === statusColIdx);
        const isRight = c === amountColIdx || (isConsumablesReport && c === 7);
        cell.s = {
          font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '0F172A' } },
          fill: headerFill,
          border: headerBorder,
          alignment: {
            horizontal: isCenter ? 'center' : isRight ? 'right' : 'left',
            vertical: 'center'
          }
        };
      }
    }

    // Style Data Rows
    for (let r = dataStartRow; r <= dataEndRow; r++) {
      const isAlt = (r - dataStartRow) % 2 === 1;
      for (let c = 0; c < colCount; c++) {
        const cell = ws[encodeCell(r, c)];
        if (cell) {
          const s = {
            font: { name: 'Calibri', sz: 9.5, color: { rgb: '1E293B' } },
            border: thinBorder,
            alignment: { vertical: 'center' }
          };

          if (isAlt) s.fill = altRowFill;
          const isCenterCol = isDailySalesOrIncome
            ? (c === 0 || c === 1 || c === 2)
            : isConsumablesReport
              ? (c === 0 || c === 1 || c === 4 || c === 5 || c === 6 || c === 9)
              : (c === 0 || c === 3 || c === 4 || c === 5 || c === 6);

          if (isCenterCol) {
            s.alignment.horizontal = 'center';
            if (isDailySalesOrIncome && c === 1) s.font.bold = true;
          } else if (c === amountColIdx || (isConsumablesReport && c === 7)) {
            s.alignment.horizontal = 'right';
            s.font.bold = true;
            s.numFmt = '₱#,##0.00;[Red](₱#,##0.00);"-"';
          } else if (c === statusColIdx) {
            s.alignment.horizontal = 'center';
            s.font.bold = true;
            s.font.color = { rgb: '059669' };
          } else {
            s.alignment.horizontal = 'left';
            if (!isDailySalesOrIncome && c === 1) s.font.bold = true;
          }

          cell.s = s;
        }
      }
    }

    // Style Summary Row (Total Amount)
    for (let c = 0; c < colCount; c++) {
      const cell = ws[encodeCell(totalRowIdx, c)];
      if (cell) {
        cell.s = {
          font: { name: 'Calibri', sz: 10.5, bold: true, color: { rgb: '0F172A' } },
          fill: summaryFill,
          border: doubleBottomBorder,
          alignment: {
            horizontal: c === amountColIdx ? 'right' : c === statusColIdx ? 'center' : 'right',
            vertical: 'center'
          }
        };
        if (c === amountColIdx) {
          cell.s.numFmt = '₱#,##0.00;[Red](₱#,##0.00);"-"';
          cell.s.font.sz = 11.5;
        }
        if (c === statusColIdx) {
          cell.s.font.color = { rgb: '059669' };
        }
      }
    }

    // Style Footer Watermark Row
    const footerCell = ws[encodeCell(footerRowIdx, 0)];
    if (footerCell) {
      footerCell.s = {
        font: { name: 'Calibri', sz: 8.5, italic: true, color: { rgb: '94A3B8' } },
        alignment: { horizontal: 'center', vertical: 'center' }
      };
    }

    // 8. Create Workbook and Export Clean File
    const wb = XLSX.utils.book_new();
    const safeSheetName = (cleanScope.replace(/[\\/?*[\]:]/g, ' ').substring(0, 31).trim()) || 'Audit Report';
    XLSX.utils.book_append_sheet(wb, ws, safeSheetName);

    // Clean, short, professional file name: e.g. "KM100_Knoah_Mari_Expenses_Audit_2026-11-19.xlsx"
    const cleanFileScope = cleanScope.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
    const safeFileName = `KM100_${cleanFileScope || 'Audit'}_${now.toISOString().split('T')[0]}.xlsx`;

    XLSX.writeFile(wb, safeFileName);

    if (showNotice) {
      showNotice(`Successfully exported ${folderItems.length} records to "${safeFileName}"!`);
    }
  } catch (err) {
    console.error('Error exporting to Excel:', err);
    if (showNotice) {
      showNotice('Export failed: ' + (err.message || err), 'error');
    }
  }
}
