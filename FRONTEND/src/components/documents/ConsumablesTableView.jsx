import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import {
  Package,
  Plus,
  FileSpreadsheet,
  Eye,
  Edit3,
  Trash2,
  Calendar,
  Building2,
  Hash,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function ConsumablesTableView({
  filteredItems = [],
  onViewItem,
  onEditItem,
  onDeleteItem,
  onAddConsumable,
  onExportExcel,
  isAdmin,
  isLight,
  activeNav,
  styles
}) {
  const navSub = (activeNav?.subCategory || '').toLowerCase();
  const isPetc = navSub.includes('petc') || navSub.includes('office');
  const isKnoah = navSub.includes('knoah');
  const isRedGoose = navSub.includes('red');

  // Title for the table
  const tableTitle = isPetc
    ? 'PETC Office Supplies'
    : isKnoah
      ? 'Knoah Mari Store Consumables'
      : isRedGoose
        ? 'Red Goose Store Consumables'
        : (activeNav?.label?.replace('Consumables > ', '') || 'Consumables & Supplies');

  // Calculations for summary banner
  const totalItems = filteredItems.length;
  const totalQty = filteredItems.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);
  const totalAmount = filteredItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  return (
    <View style={{ flex: 1, flexDirection: 'column' }}>
      {/* 1. Executive Consumables Header Bar */}
      <View style={[
        {
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderBottomColor: isLight ? '#e2e8f0' : '#334155',
          backgroundColor: isLight ? '#ffffff' : '#1e293b',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12
        }
      ]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{
            width: 38,
            height: 38,
            borderRadius: 8,
            backgroundColor: isLight ? '#fff7ed' : 'rgba(244, 119, 33, 0.15)',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: '#f47721'
          }}>
            <Package size={20} color="#f47721" />
          </View>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '800',
                color: isLight ? '#0f172a' : '#f8fafc',
                letterSpacing: 0.3
              }}>
                {tableTitle}
              </Text>
              <View style={{
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 12,
                backgroundColor: isLight ? '#f1f5f9' : '#0f172a',
                borderWidth: 1,
                borderColor: isLight ? '#cbd5e1' : '#334155'
              }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: isLight ? '#475569' : '#94a3b8' }}>
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </Text>
              </View>
            </View>
            <Text style={{ fontSize: 11, color: isLight ? '#64748b' : '#94a3b8', marginTop: 2 }}>
              Inventory register based on official receipts & sales invoices
            </Text>
          </View>
        </View>

        {/* Right Action Buttons: + Add Consumable & Export Excel */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {onExportExcel && (
            <TouchableOpacity
              style={[
                styles.exportExcelBtn,
                isLight && styles.exportExcelBtnLight,
                { paddingHorizontal: 12, paddingVertical: 8 }
              ]}
              onPress={onExportExcel}
              title="Export this consumables table to formal Excel spreadsheet"
            >
              <FileSpreadsheet size={14} color={isLight ? '#059669' : '#34d399'} />
              <Text style={[styles.exportExcelBtnText, isLight && styles.exportExcelBtnTextLight]}>
                Export Excel
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.heroScanBtn,
              { paddingHorizontal: 14, paddingVertical: 8, gap: 6 }
            ]}
            onPress={() => onAddConsumable ? onAddConsumable() : null}
            title={isPetc ? "Add Office Supplies" : "Add Consumable"}
          >
            <Plus size={16} color="#ffffff" />
            <Text style={styles.heroScanBtnText}>
              {isPetc ? 'Add Office Supplies' : 'Add Consumable'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Interactive KPI Stats Strip */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: isLight ? '#f8fafc' : '#0f172a',
        borderBottomWidth: 1,
        borderBottomColor: isLight ? '#e2e8f0' : '#334155',
        gap: 16,
        flexWrap: 'wrap'
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: isLight ? '#64748b' : '#94a3b8' }}>TOTAL ITEMS:</Text>
          <Text style={{ fontSize: 12, fontWeight: '800', color: isLight ? '#0f172a' : '#f8fafc' }}>{totalItems}</Text>
        </View>
        <View style={{ width: 1, height: 14, backgroundColor: isLight ? '#cbd5e1' : '#334155' }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: isLight ? '#64748b' : '#94a3b8' }}>TOTAL QUANTITY:</Text>
          <Text style={{ fontSize: 12, fontWeight: '800', color: '#f47721' }}>{totalQty.toLocaleString()}</Text>
        </View>
        <View style={{ width: 1, height: 14, backgroundColor: isLight ? '#cbd5e1' : '#334155' }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: isLight ? '#64748b' : '#94a3b8' }}>TOTAL VALUE:</Text>
          <Text style={{ fontSize: 12, fontWeight: '800', color: '#10b981' }}>
            ₱{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
        </View>
      </View>

      {/* 3. The Consumables Table (Matching Handwritten Reference Card) */}
      <ScrollView style={styles.tableVertical} showsVerticalScrollIndicator={true}>
        <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={{ minWidth: '100%' }}>
          <View style={[styles.table, { minWidth: 1080 }]}>
            {/* Table Header Row: Exact 9 Columns from reference image */}
            <View style={[
              styles.tableRowHeader,
              isLight && styles.tableRowHeaderLight,
              { backgroundColor: isLight ? '#f1f5f9' : '#1e293b', borderBottomWidth: 2, borderBottomColor: '#f47721' }
            ]}>
              <Text style={[styles.th, { width: 75, textAlign: 'center' }, isLight && styles.thLight]}>ITEM NO.</Text>
              <Text style={[styles.th, { width: 105 }, isLight && styles.thLight]}>DATE</Text>
              <Text style={[styles.th, { flex: 2, minWidth: 210 }, isLight && styles.thLight]}>PARTICULARS</Text>
              <Text style={[styles.th, { flex: 1.3, minWidth: 150 }, isLight && styles.thLight]}>SUPPLIER</Text>
              <Text style={[styles.th, { width: 125 }, isLight && styles.thLight]}>OR / SI NO.</Text>
              <Text style={[styles.th, { width: 75, textAlign: 'right', paddingRight: 8 }, isLight && styles.thLight]}>QTY</Text>
              <Text style={[styles.th, { width: 115, textAlign: 'center' }, isLight && styles.thLight]}>UNIT MEASURE</Text>
              <Text style={[styles.th, { width: 115, textAlign: 'right', paddingRight: 8 }, isLight && styles.thLight]}>UNIT COST</Text>
              <Text style={[styles.th, { width: 130, textAlign: 'right', paddingRight: 14 }, isLight && styles.thLight]}>AMOUNT</Text>
              <Text style={[styles.th, { width: 105, textAlign: 'center' }, isLight && styles.thLight]}>ACTIONS</Text>
            </View>

            {/* Empty State Row */}
            {filteredItems.length === 0 && (
              <View style={{
                paddingVertical: 50,
                paddingHorizontal: 20,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isLight ? '#ffffff' : '#0f172a'
              }}>
                <View style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  backgroundColor: isLight ? '#fff7ed' : 'rgba(244, 119, 33, 0.15)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12
                }}>
                  <Package size={28} color="#f47721" />
                </View>
                <Text style={{ fontSize: 16, fontWeight: '700', color: isLight ? '#0f172a' : '#f8fafc', marginBottom: 6 }}>
                  No Consumables Recorded in {tableTitle}
                </Text>
                <Text style={{ fontSize: 13, color: isLight ? '#64748b' : '#94a3b8', textAlign: 'center', maxWidth: 450, marginBottom: 18 }}>
                  Keep track of cleaning supplies, office items, paper, and store consumables following the official register format.
                </Text>
                <TouchableOpacity
                  style={[styles.heroScanBtn, { paddingHorizontal: 18, paddingVertical: 10 }]}
                  onPress={() => onAddConsumable && onAddConsumable()}
                >
                  <Plus size={16} color="#ffffff" />
                  <Text style={styles.heroScanBtnText}>
                    {isPetc ? '+ Add Office Supplies' : '+ Add Consumable Item'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Table Data Rows */}
            {filteredItems.map((item, idx) => {
              const preview = item.previewData || {};
              const itemNumber = item.itemNo || preview.itemNo || `${idx + 1}`;
              const dateVal = item.receiptDate || preview.date || item.scannedDate || item.createdAt || '-';
              const particulars = item.title || preview.particulars || item.fileName?.replace(/\.item$/i, '') || '-';
              const supplier = item.supplier || preview.supplier || (item.establishment && item.establishment !== item.entity ? item.establishment : '') || '-';
              const orSiNo = item.orSiNo || preview.orSiNo || preview.or_si_no || '-';
              const qty = parseFloat(item.quantity) || parseFloat(preview.quantity) || 1;
              const unitMeasure = item.unit || preview.unitMeasure || 'pcs';
              const amount = parseFloat(item.amount) || parseFloat(preview.amount) || 0;
              const unitCost = parseFloat(item.unitCost) || parseFloat(preview.unitCost) || (qty > 0 && amount > 0 ? (amount / qty) : 0);

              return (
                <TouchableOpacity
                  key={item.id || idx}
                  style={[
                    styles.tableRow,
                    isLight && styles.tableRowLight,
                    idx % 2 === 1 && (isLight ? styles.tableRowAltLight : styles.tableRowAlt),
                    { minHeight: 46 }
                  ]}
                  onPress={() => onViewItem && onViewItem(item)}
                >
                  {/* 1. Item No. */}
                  <View style={{ width: 75, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 4,
                      backgroundColor: isLight ? '#f1f5f9' : '#0f172a'
                    }}>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: isLight ? '#475569' : '#94a3b8' }}>
                        {itemNumber}
                      </Text>
                    </View>
                  </View>

                  {/* 2. Date */}
                  <Text style={[styles.td, { width: 105, fontSize: 12 }, isLight && styles.tdLight]} numberOfLines={1}>
                    {dateVal}
                  </Text>

                  {/* 3. Particulars */}
                  <View style={{ flex: 2, minWidth: 210, flexDirection: 'row', alignItems: 'center', gap: 8, paddingRight: 10 }}>
                    <Package size={15} color="#f47721" />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.td, { fontWeight: '700', color: isLight ? '#0f172a' : '#f8fafc', fontSize: 13 }]} numberOfLines={1}>
                        {particulars}
                      </Text>
                      {item.notes ? (
                        <Text style={{ fontSize: 10, color: isLight ? '#64748b' : '#94a3b8' }} numberOfLines={1}>
                          {item.notes}
                        </Text>
                      ) : null}
                    </View>
                  </View>

                  {/* 4. Supplier */}
                  <Text style={[styles.td, { flex: 1.3, minWidth: 150, paddingRight: 8, fontSize: 12 }, isLight && styles.tdLight]} numberOfLines={1}>
                    {supplier}
                  </Text>

                  {/* 5. OR / SI no. */}
                  <View style={{ width: 125, paddingRight: 8, justifyContent: 'center' }}>
                    <Text style={[styles.td, { fontFamily: 'monospace', fontWeight: '600', fontSize: 12, color: isLight ? '#0369a1' : '#38bdf8' }]} numberOfLines={1}>
                      {orSiNo}
                    </Text>
                  </View>

                  {/* 6. Qty */}
                  <Text style={[styles.td, { width: 75, textAlign: 'right', paddingRight: 8, fontWeight: '700', fontSize: 13 }, isLight && styles.tdLight]}>
                    {qty}
                  </Text>

                  {/* 7. Unit Measure */}
                  <View style={{ width: 115, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 10,
                      backgroundColor: isLight ? '#fef3eb' : 'rgba(244, 119, 33, 0.12)',
                      borderWidth: 1,
                      borderColor: isLight ? '#fcd3b4' : 'rgba(244, 119, 33, 0.3)'
                    }}>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: '#f47721' }}>
                        {unitMeasure}
                      </Text>
                    </View>
                  </View>

                  {/* 8. Unit Cost */}
                  <Text style={[styles.td, { width: 115, textAlign: 'right', paddingRight: 8, fontSize: 12, color: isLight ? '#475569' : '#cbd5e1' }]}>
                    {unitCost > 0 ? `₱${unitCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}
                  </Text>

                  {/* 9. Amount */}
                  <Text style={[styles.td, { width: 130, textAlign: 'right', paddingRight: 14, fontWeight: '800', color: amount > 0 ? '#10b981' : (isLight ? '#94a3b8' : '#64748b'), fontSize: 13 }]}>
                    {amount > 0 ? `₱${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '₱0.00'}
                  </Text>

                  {/* 10. Actions */}
                  <View style={{ width: 105, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <TouchableOpacity
                      style={[styles.btnActionIcon, isLight && styles.btnActionIconLight, { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }]}
                      onPress={(e) => {
                        e.stopPropagation?.();
                        onViewItem && onViewItem(item);
                      }}
                      title="View Consumable Details"
                    >
                      <Eye size={14} color={isLight ? '#f47721' : '#f47721'} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.btnActionIcon, isLight && styles.btnActionIconLight, { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }]}
                      onPress={(e) => {
                        e.stopPropagation?.();
                        onEditItem && onEditItem(item);
                      }}
                      title="Edit Consumable Item"
                    >
                      <Edit3 size={14} color={isLight ? '#0284c7' : '#38bdf8'} />
                    </TouchableOpacity>

                    {isAdmin && (
                      <TouchableOpacity
                        style={[styles.btnActionIcon, isLight && styles.btnActionIconLight, { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }]}
                        onPress={(e) => {
                          e.stopPropagation?.();
                          onDeleteItem && onDeleteItem(item.id, item.fileName);
                        }}
                        title="Delete Consumable Item"
                      >
                        <Trash2 size={14} color="#ef4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* 4. Summary Totals Footer Row */}
            <View style={[
              styles.tableRowHeader,
              isLight && styles.tableRowHeaderLight,
              {
                backgroundColor: isLight ? '#f8fafc' : '#0b1120',
                borderTopWidth: 2,
                borderTopColor: isLight ? '#cbd5e1' : '#334155',
                minHeight: 48
              }
            ]}>
              <View style={{ width: 75 + 105 + 210 + 150 + 125, paddingLeft: 16, justifyContent: 'center' }}>
                <Text style={{ fontWeight: '800', fontSize: 12, color: isLight ? '#1e293b' : '#f8fafc', letterSpacing: 0.5 }}>
                  TOTAL INVENTORY ({totalItems} {totalItems === 1 ? 'ITEM' : 'ITEMS'})
                </Text>
              </View>
              <Text style={{ width: 75, textAlign: 'right', paddingRight: 8, fontWeight: '800', fontSize: 13, color: '#f47721' }}>
                {totalQty}
              </Text>
              <View style={{ width: 115 + 115, paddingRight: 8, alignItems: 'flex-end', justifyContent: 'center' }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: isLight ? '#64748b' : '#94a3b8' }}>
                  GRAND TOTAL:
                </Text>
              </View>
              <Text style={{ width: 130, textAlign: 'right', paddingRight: 14, fontWeight: '800', fontSize: 14, color: '#10b981' }}>
                ₱{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
              <View style={{ width: 105 }} />
            </View>
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
}
