import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import {
  FileSpreadsheet,
  FileText,
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
  styles
}) {
  return (
    <ScrollView style={styles.tableVertical} showsVerticalScrollIndicator={true}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ minWidth: '100%' }}>
        <View style={styles.table}>
          <View style={[styles.tableRowHeader, isLight && styles.tableRowHeaderLight]}>
            <Text style={[styles.th, { width: 45, textAlign: 'center' }, isLight && styles.thLight]}>#</Text>
            <Text style={[styles.th, { flex: 2.2, minWidth: 220 }, isLight && styles.thLight]}>FILE NAME</Text>
            <Text style={[styles.th, { flex: 1.2, minWidth: 140 }, isLight && styles.thLight]}>CATEGORY</Text>
            <Text style={[styles.th, { flex: 1, minWidth: 110 }, isLight && styles.thLight]}>ENTITY</Text>
            <Text style={[styles.th, { width: 120 }, isLight && styles.thLight]}>PERIOD / DATE</Text>
            <Text style={[styles.th, { width: 130, textAlign: 'right', paddingRight: 16 }, isLight && styles.thLight]}>AMOUNT (PHP)</Text>
            <Text style={[styles.th, { width: 130 }, isLight && styles.thLight]}>STATUS</Text>
            <Text style={[styles.th, { width: 125, textAlign: 'center' }, isLight && styles.thLight]}>ACTIONS</Text>
          </View>

          {filteredItems.map((item, idx) => (
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
                {item.fileFormat === 'XLSX' ? <FileSpreadsheet size={16} color="#10b981" /> : <FileText size={16} color={isLight ? '#f47721' : '#ff9345'} />}
                <Text style={[styles.td, { fontWeight: '600', color: isLight ? '#252525' : '#f8fafc', flex: 1 }]} numberOfLines={1}>
                  {item.fileName}
                </Text>
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
                <View style={[styles.statusDot, { backgroundColor: item.status === 'Verified' ? '#10b981' : '#f59e0b' }]} />
                <Text style={[styles.statusText, isLight && styles.statusTextLight]}>
                  {item.status || 'Verified'}
                </Text>
              </View>
              <View style={[styles.td, { width: 125, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }]}>
                <TouchableOpacity
                  style={[styles.btnActionIcon, isLight && styles.btnActionIconLight, { minWidth: 32, minHeight: 32, alignItems: 'center', justifyContent: 'center' }]}
                  onPress={(e) => {
                    e.stopPropagation?.();
                    onViewItem(item);
                  }}
                  title="View Document Details"
                  accessibilityRole="button"
                  accessibilityLabel={`View document details for ${item.fileName}`}
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
                    title="Delete Document (Admin Only)"
                    accessibilityRole="button"
                    accessibilityLabel={`Delete document ${item.fileName}`}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Trash2 size={15} color="#f87171" />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ScrollView>
  );
}
