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

    const reportTitle = cleanScope.toUpperCase() + ' - AUDIT REPORT';

    // Calculate total sum
    const totalAmount = folderItems.reduce((sum, it) => sum + (parseFloat(it.amount) || 0), 0);
    const totalFormatted = '₱' + totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // 1. Prepare clean array of arrays (AOA)
    const aoa = [
      // Row 0: Company Header Banner
      ['KM100 SKILLS & TRAINING CENTER, INC.'],
      // Row 1: Report Title Banner
      [reportTitle],
      // Row 2: Metadata Summary Bar
      [`EXPORT DATE: ${dateStr} • ${timeStr}     |     TOTAL RECORDS: ${folderItems.length}     |     TOTAL AMOUNT: ${totalFormatted}     |     STATUS: VERIFIED INVENTORY`],
      // Row 3: Spacer Row
      [],
      // Row 4: Clean, Essential Table Column Headers (NO folder/category clutter)
      ['No.', 'Document Title', 'Establishment / Store', 'Invoice / OR No.', 'Branch', 'Receipt Date', 'Date Recorded', 'Amount (PHP)', 'Status']
    ];

    // 2. Map and clean each item row
    folderItems.forEach((item, index) => {
      const num = index + 1;
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
    });

    const dataStartRow = 5; // Row index 5 is first item
    const dataEndRow = dataStartRow + folderItems.length - 1;

    // 3. Summary Footer Rows
    aoa.push([]); // Spacer row
    aoa.push([
      'TOTAL AMOUNT (PHP):', // Merged col 0-6
      '',
      '',
      '',
      '',
      '',
      '',
      totalAmount,          // Col 7: Total Sum
      'KM100 VERIFIED'      // Col 8: Verified badge
    ]);
    aoa.push([
      'KM100 • OFFICIAL AUDIT COPY'
    ]);

    // 4. Create Worksheet
    const ws = XLSX.utils.aoa_to_sheet(aoa);

    // 5. Optimized Column Widths (breathing room for all data)
    ws['!cols'] = [
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
      { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }, // Title across 9 columns
      { s: { r: 1, c: 0 }, e: { r: 1, c: 8 } }, // Subtitle banner across 9 columns
      { s: { r: 2, c: 0 }, e: { r: 2, c: 8 } }, // Metadata bar across 9 columns
      { s: { r: totalRowIdx, c: 0 }, e: { r: totalRowIdx, c: 6 } }, // Total label merged A-G
      { s: { r: footerRowIdx, c: 0 }, e: { r: footerRowIdx, c: 8 } } // System watermark merged A-I
    ];

    // Row heights for executive spacing
    ws['!rows'] = [
      { hpt: 30 }, // Row 0: Company
      { hpt: 22 }, // Row 1: Subtitle
      { hpt: 20 }, // Row 2: Metadata
      { hpt: 10 }, // Row 3: Spacer
      { hpt: 25 }  // Row 4: Column Headers
    ];

    // 7. Styling Palette
    const brandNavy = { fgColor: { rgb: '0F172A' } };
    const brandBlue = { fgColor: { rgb: '0284C7' } };
    const metadataFill = { fgColor: { rgb: 'F1F5F9' } };
    const headerFill = { fgColor: { rgb: 'E2E8F0' } };
    const altRowFill = { fgColor: { rgb: 'F8FAFC' } };
    const summaryFill = { fgColor: { rgb: 'E0F2FE' } };

    const thinBorder = {
      top: { style: 'thin', color: { rgb: 'E2E8F0' } },
      bottom: { style: 'thin', color: { rgb: 'E2E8F0' } },
      left: { style: 'thin', color: { rgb: 'E2E8F0' } },
      right: { style: 'thin', color: { rgb: 'E2E8F0' } }
    };

    const headerBorder = {
      top: { style: 'medium', color: { rgb: '0284C7' } },
      bottom: { style: 'medium', color: { rgb: '0284C7' } },
      left: { style: 'thin', color: { rgb: 'CBD5E1' } },
      right: { style: 'thin', color: { rgb: 'CBD5E1' } }
    };

    const doubleBottomBorder = {
      top: { style: 'thin', color: { rgb: '0284C7' } },
      bottom: { style: 'double', color: { rgb: '0F172A' } },
      left: { style: 'thin', color: { rgb: 'CBD5E1' } },
      right: { style: 'thin', color: { rgb: 'CBD5E1' } }
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
    for (let c = 0; c < 9; c++) {
      const cell = ws[encodeCell(4, c)];
      if (cell) {
        cell.s = {
          font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '0F172A' } },
          fill: headerFill,
          border: headerBorder,
          alignment: {
            horizontal: c === 0 || c === 3 || c === 4 || c === 5 || c === 6 || c === 8 ? 'center' : c === 7 ? 'right' : 'left',
            vertical: 'center'
          }
        };
      }
    }

    // Style Data Rows
    for (let r = dataStartRow; r <= dataEndRow; r++) {
      const isAlt = (r - dataStartRow) % 2 === 1;
      for (let c = 0; c < 9; c++) {
        const cell = ws[encodeCell(r, c)];
        if (cell) {
          const s = {
            font: { name: 'Calibri', sz: 9.5, color: { rgb: '1E293B' } },
            border: thinBorder,
            alignment: { vertical: 'center' }
          };

          if (isAlt) s.fill = altRowFill;
          if (c === 0 || c === 3 || c === 4 || c === 5 || c === 6) {
            s.alignment.horizontal = 'center';
          } else if (c === 7) {
            s.alignment.horizontal = 'right';
            s.font.bold = true;
            s.numFmt = '₱#,##0.00;[Red](₱#,##0.00);"-"';
          } else if (c === 8) {
            s.alignment.horizontal = 'center';
            s.font.bold = true;
            s.font.color = { rgb: '059669' };
          } else {
            s.alignment.horizontal = 'left';
            if (c === 1) s.font.bold = true;
          }

          cell.s = s;
        }
      }
    }

    // Style Summary Row (Total Amount)
    for (let c = 0; c < 9; c++) {
      const cell = ws[encodeCell(totalRowIdx, c)];
      if (cell) {
        cell.s = {
          font: { name: 'Calibri', sz: 10.5, bold: true, color: { rgb: '0F172A' } },
          fill: summaryFill,
          border: doubleBottomBorder,
          alignment: {
            horizontal: c === 7 ? 'right' : c === 8 ? 'center' : 'right',
            vertical: 'center'
          }
        };
        if (c === 7) {
          cell.s.numFmt = '₱#,##0.00;[Red](₱#,##0.00);"-"';
          cell.s.font.sz = 11.5;
        }
        if (c === 8) {
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
