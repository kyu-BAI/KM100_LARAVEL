import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import {
  FileSpreadsheet,
  FileText,
  Package,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Receipt,
  ShieldCheck,
  Ticket,
  Layers
} from 'lucide-react';

const CATEGORY_ORDER = [
  'Sales',
  'Income',
  'Expenses',
  'Consumables',
  'Vouchers',
  'PETC Insurance'
];

const CATEGORY_META = {
  Sales: { color: '#10b981', bgLight: '#ecfdf5', bgDark: 'rgba(16, 185, 129, 0.12)', borderLight: '#a7f3d0', borderDark: 'rgba(16, 185, 129, 0.3)', Icon: TrendingUp },
  Income: { color: '#3b82f6', bgLight: '#eff6ff', bgDark: 'rgba(59, 130, 246, 0.12)', borderLight: '#bfdbfe', borderDark: 'rgba(59, 130, 246, 0.3)', Icon: DollarSign },
  Expenses: { color: '#ef4444', bgLight: '#fef2f2', bgDark: 'rgba(239, 68, 68, 0.12)', borderLight: '#fecaca', borderDark: 'rgba(239, 68, 68, 0.3)', Icon: Receipt },
  Consumables: { color: '#f59e0b', bgLight: '#fffbeb', bgDark: 'rgba(245, 158, 11, 0.12)', borderLight: '#fde68a', borderDark: 'rgba(245, 158, 11, 0.3)', Icon: Package },
  Vouchers: { color: '#8b5cf6', bgLight: '#f5f3ff', bgDark: 'rgba(139, 92, 246, 0.12)', borderLight: '#ddd6fe', borderDark: 'rgba(139, 92, 246, 0.3)', Icon: Ticket },
  'PETC Insurance': { color: '#14b8a6', bgLight: '#f0fdfa', bgDark: 'rgba(20, 184, 166, 0.12)', borderLight: '#99f6e4', borderDark: 'rgba(20, 184, 166, 0.3)', Icon: ShieldCheck }
};

function getItemCategoryGroup(item) {
  const cat = (item.category || '').trim();
  if (cat) return cat;
  if (item.subCategory?.includes('Store Consumables') || item.subCategory?.includes('Office supplies')) {
    return 'Consumables';
  }
  return 'Other';
}

export default React.memo(function DocumentTableView({
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
  const isAllInventoryView = activeNav?.type === 'all';
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All');
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 50;

  useEffect(() => {
    setPage(1);
  }, [activeNav?.type, activeNav?.subCategory, filteredItems.length]);

  const groupedSections = useMemo(() => {
    if (!isAllInventoryView) return [];

    const groupsMap = new Map();
    for (const item of filteredItems) {
      const cat = getItemCategoryGroup(item);
      if (!groupsMap.has(cat)) {
        groupsMap.set(cat, []);
      }
      groupsMap.get(cat).push(item);
    }

    const orderedKeys = [
      ...CATEGORY_ORDER.filter(k => groupsMap.has(k)),
      ...Array.from(groupsMap.keys()).filter(k => !CATEGORY_ORDER.includes(k)).sort()
    ];

    return orderedKeys.map(category => {
      const items = groupsMap.get(category) || [];
      const totalAmount = items.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);
      return { category, items, totalAmount };
    });
  }, [filteredItems, isAllInventoryView]);

  const visibleSections = useMemo(() => {
    if (selectedTypeFilter === 'All') return groupedSections;
    return groupedSections.filter(s => s.category === selectedTypeFilter);
  }, [groupedSections, selectedTypeFilter]);

  const toggleGroup = (category) => {
    setCollapsedGroups(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const renderRow = (item, idx) => {
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
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Segregation Type Pills Bar (only in All Inventory Files) */}
      {isAllInventoryView && groupedSections.length > 0 && (
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 8,
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: isLight ? '#e2e8f0' : '#1e293b',
          backgroundColor: isLight ? '#f8fafc' : '#0f172a'
        }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: isLight ? '#64748b' : '#94a3b8', letterSpacing: 0.5, marginRight: 4 }}>
            SEGREGATED BY TYPE:
          </Text>
          <TouchableOpacity
            onPress={() => setSelectedTypeFilter('All')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: selectedTypeFilter === 'All' ? '#f47721' : (isLight ? '#cbd5e1' : '#334155'),
              backgroundColor: selectedTypeFilter === 'All' ? '#f47721' : (isLight ? '#ffffff' : '#1e293b')
            }}
          >
            <Layers size={12} color={selectedTypeFilter === 'All' ? '#ffffff' : (isLight ? '#475569' : '#cbd5e1')} />
            <Text style={{ fontSize: 12, fontWeight: '700', color: selectedTypeFilter === 'All' ? '#ffffff' : (isLight ? '#334155' : '#cbd5e1') }}>
              All Types ({filteredItems.length})
            </Text>
          </TouchableOpacity>

          {groupedSections
            .filter(({ category }) => category !== 'PETC Insurance')
            .map(({ category, items }) => {
            const meta = CATEGORY_META[category] || { color: '#64748b', bgLight: '#f1f5f9', bgDark: '#1e293b', borderLight: '#cbd5e1', borderDark: '#334155', Icon: Layers };
            const isSelected = selectedTypeFilter === category;
            const IconComp = meta.Icon;
            return (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedTypeFilter(isSelected ? 'All' : category)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: isSelected ? meta.color : (isLight ? meta.borderLight : meta.borderDark),
                  backgroundColor: isSelected ? meta.color : (isLight ? meta.bgLight : meta.bgDark)
                }}
              >
                <IconComp size={12} color={isSelected ? '#ffffff' : meta.color} />
                <Text style={{ fontSize: 12, fontWeight: '700', color: isSelected ? '#ffffff' : (isLight ? '#1e293b' : '#f8fafc') }}>
                  {category} ({items.length})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

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

            {isAllInventoryView ? (
              visibleSections.map(({ category, items, totalAmount }) => {
                const meta = CATEGORY_META[category] || { color: '#64748b', bgLight: '#f1f5f9', bgDark: '#1e293b', borderLight: '#cbd5e1', borderDark: '#334155', Icon: Layers };
                const IconComp = meta.Icon;
                const isCollapsed = !!collapsedGroups[category];

                return (
                  <View key={category}>
                    {/* Category Segregation Group Header */}
                    <TouchableOpacity
                      onPress={() => toggleGroup(category)}
                      activeOpacity={0.8}
                      accessibilityRole="button"
                      accessibilityState={{ expanded: !isCollapsed }}
                      accessibilityLabel={`${category} section (${items.length} records)`}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 14,
                        paddingVertical: 10,
                        backgroundColor: isLight ? meta.bgLight : meta.bgDark,
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderColor: isLight ? meta.borderLight : meta.borderDark,
                        borderLeftWidth: 4,
                        borderLeftColor: meta.color
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        {isCollapsed ? (
                          <ChevronRight size={16} color={meta.color} />
                        ) : (
                          <ChevronDown size={16} color={meta.color} />
                        )}
                        <IconComp size={16} color={meta.color} />
                        <Text style={{
                          fontSize: 13,
                          fontWeight: '800',
                          letterSpacing: 0.4,
                          color: isLight ? '#0f172a' : '#f8fafc',
                          textTransform: 'uppercase'
                        }}>
                          {category}
                        </Text>
                        <View style={{
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          borderRadius: 999,
                          backgroundColor: isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.6)',
                          borderWidth: 1,
                          borderColor: isLight ? meta.borderLight : meta.borderDark
                        }}>
                          <Text style={{ fontSize: 11, fontWeight: '700', color: meta.color }}>
                            {items.length} {items.length === 1 ? 'record' : 'records'}
                          </Text>
                        </View>
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        {totalAmount > 0 && (
                          <Text style={{ fontSize: 12.5, fontWeight: '700', color: isLight ? '#334155' : '#e2e8f0' }}>
                            Subtotal: ₱{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </Text>
                        )}
                        <Text style={{ fontSize: 11, fontWeight: '600', color: isLight ? '#64748b' : '#94a3b8' }}>
                          {isCollapsed ? 'Show' : 'Hide'}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {/* Segregated Rows for this Category */}
                    {!isCollapsed && items.map((item, idx) => renderRow(item, idx))}
                  </View>
                );
              })
            ) : (
              filteredItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((item, idx) => renderRow(item, (page - 1) * PAGE_SIZE + idx))
            )}
          </View>
        </ScrollView>
      </ScrollView>

      {!isAllInventoryView && filteredItems.length > PAGE_SIZE && (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderTopWidth: 1,
          borderTopColor: isLight ? '#e2e8f0' : '#1e293b',
          backgroundColor: isLight ? '#f8fafc' : '#0f172a'
        }}>
          <Text style={{ fontSize: 12, color: isLight ? '#475569' : '#94a3b8' }}>
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredItems.length)} of {filteredItems.length}
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              disabled={page <= 1}
              onPress={() => setPage(p => Math.max(1, p - 1))}
              style={[styles.btnSecondary, page <= 1 && { opacity: 0.45 }]}
            >
              <Text style={styles.btnSecondaryText}>Prev</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={page * PAGE_SIZE >= filteredItems.length}
              onPress={() => setPage(p => p + 1)}
              style={[styles.btnSecondary, page * PAGE_SIZE >= filteredItems.length && { opacity: 0.45 }]}
            >
              <Text style={styles.btnSecondaryText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
});
