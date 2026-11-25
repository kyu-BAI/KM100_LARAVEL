import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import {
  FileSpreadsheet,
  FileText,
  Package,
  Edit3,
  Trash2
} from 'lucide-react';

export default function DocumentTableView({
  filteredItems,
  onViewItem,
  onRenameItem,
  onDeleteItem,
  isAdmin,
  isLight,
  activeNav,
  styles
}) {
  const isConsumablesTable = activeNav?.type === 'consumables';

  return (
    <ScrollView style={styles.tableVertical} showsVerticalScrollIndicator={true}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ minWidth: '100%' }}>
        <View style={styles.table}>
          <View style={[styles.tableRowHeader, isLight && styles.tableRowHeaderLight]}>
            <Text style={[styles.th, { width: 45, textAlign: 'center' }, isLight && styles.thLight]}>#</Text>
            <Text style={[styles.th, { flex: 2.2, minWidth: 220 }, isLight && styles.thLight]}>
              {isConsumablesTable ? 'ITEM / CONSUMABLE' : 'FILE NAME'}
            </Text>
            <Text style={[styles.th, { flex: 1.2, minWidth: 140 }, isLight && styles.thLight]}>CATEGORY</Text>
            <Text style={[styles.th, { flex: 1, minWidth: 110 }, isLight && styles.thLight]}>ENTITY</Text>
            <Text style={[styles.th, { width: 120 }, isLight && styles.thLight]}>
              {isConsumablesTable ? 'DATE ADDED' : 'PERIOD / DATE'}
            </Text>
            <Text style={[styles.th, { width: 130, textAlign: 'right', paddingRight: 16 }, isLight && styles.thLight]}>
              {isConsumablesTable ? 'VALUE (PHP)' : 'AMOUNT (PHP)'}
            </Text>
            <Text style={[styles.th, { width: 130 }, isLight && styles.thLight]}>
              {isConsumablesTable ? 'STOCK / STATUS' : 'STATUS'}
            </Text>
            <Text style={[styles.th, { width: 125, textAlign: 'center' }, isLight && styles.thLight]}>ACTIONS</Text>
          </View>

          {filteredItems.map((item, idx) => {
            const isConsumable = item.category === 'Consumables' || item.subCategory?.includes('Store Consumables');
            const displayName = isConsumable ? (item.title || item.fileName?.replace(/\.item$/i, '')) : item.fileName;

            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.tableRow,
                  isLight && styles.tableRowLight,
                  idx % 2 === 1 && (isLight ? styles.tableRowAltLight : styles.tableRowAlt)
                ]}
                onPress={() => onViewItem(item)}
              >
                <Text style={[styles.td, { width: 45, textAlign: 'center', color: '#64748b' }]}>{idx + 1}</Text>
                <View style={{ flex: 2.2, minWidth: 220, flexDirection: 'row', alignItems: 'center', gap: 8, paddingRight: 12 }}>
                  {isConsumable ? (
                    <Package size={16} color="#fbbf24" />
                  ) : item.fileFormat === 'XLSX' ? (
                    <FileSpreadsheet size={16} color="#10b981" />
                  ) : (
                    <FileText size={16} color={isLight ? '#f47721' : '#ff9345'} />
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.td, { fontWeight: '600', color: isLight ? '#252525' : '#f8fafc' }]} numberOfLines={1}>
                      {displayName}
                    </Text>
                    {isConsumable && item.quantity ? (
                      <Text style={{ fontSize: 11, color: isLight ? '#64748b' : '#94a3b8' }}>
                        Qty: {item.quantity} {item.unit || 'pcs'}
                      </Text>
                    ) : null}
                  </View>
                </View>
                <Text style={[styles.td, { flex: 1.2, minWidth: 140, paddingRight: 8 }, isLight && styles.tdLight]} numberOfLines={1}>{item.category}</Text>
                <Text style={[styles.td, { flex: 1, minWidth: 110, paddingRight: 8 }, isLight && styles.tdLight]} numberOfLines={1}>{item.entity}</Text>
                <Text style={[styles.td, { width: 120 }, isLight && styles.tdLight]}>
                  {item.scannedDate || item.createdAt || (item.year ? `${item.year} ${item.month !== 'CURRENT' ? item.month : ''}`.trim() : item.receiptDate || '-')}
                </Text>
                <Text style={[styles.td, { width: 130, textAlign: 'right', paddingRight: 16, fontWeight: '700', color: item.amount > 0 ? (isLight ? '#252525' : '#f47721') : (isLight ? '#888888' : '#64748b') }]}>
                  {item.amount > 0 ? `₱${parseFloat(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}
                </Text>
                <View style={[styles.td, { width: 130, flexDirection: 'row', alignItems: 'center', gap: 6 }]}>
                  <View style={[styles.statusDot, { backgroundColor: (isConsumable || item.status === 'Verified') ? '#10b981' : '#f59e0b' }]} />
                  <Text style={[styles.statusText, isLight && styles.statusTextLight]}>
                    {item.status || (isConsumable ? 'In Stock' : 'Verified')}
                  </Text>
                </View>
                <View style={[styles.td, { width: 125, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }]}>
                  <TouchableOpacity
                    style={[styles.btnActionIcon, isLight && styles.btnActionIconLight, { minWidth: 32, minHeight: 32, alignItems: 'center', justifyContent: 'center' }]}
                    onPress={(e) => {
                      e.stopPropagation?.();
                      onViewItem(item);
                    }}
                    title={isConsumable ? "View Consumable Details" : "View Document Details"}
                    accessibilityRole="button"
                    accessibilityLabel={`View details for ${displayName}`}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <FileText size={15} color={isLight ? '#f47721' : '#ff9345'} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btnActionIcon, isLight && styles.btnActionIconLight, { minWidth: 32, minHeight: 32, alignItems: 'center', justifyContent: 'center' }]}
                    onPress={(e) => {
                      e.stopPropagation?.();
                      onRenameItem(item);
                    }}
                    title="Rename Document"
                    accessibilityRole="button"
                    accessibilityLabel={`Rename document ${item.fileName}`}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Edit3 size={15} color={isLight ? '#f47721' : '#ff9345'} />
                  </TouchableOpacity>
                  {isAdmin && (
                    <TouchableOpacity
                      style={[styles.btnActionIcon, isLight && styles.btnActionIconLight, { minWidth: 32, minHeight: 32, alignItems: 'center', justifyContent: 'center' }]}
                      onPress={(e) => {
                        e.stopPropagation?.();
                        onDeleteItem(item.id, item.fileName);
                      }}
                      title="Delete Record"
                      accessibilityRole="button"
                      accessibilityLabel={`Delete record ${item.fileName}`}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Trash2 size={15} color="#ef4444" />
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </ScrollView>
  );
}
