import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import {
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  Edit3,
  Trash2
} from 'lucide-react';

export default function DocumentCardsView({
  filteredItems,
  onViewItem,
  onRenameItem,
  onDeleteItem,
  isAdmin,
  isLight,
  styles
}) {
  return (
    <ScrollView style={styles.mobileCardList} showsVerticalScrollIndicator={false}>
      {filteredItems.map((item, idx) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.mobileCard, isLight && styles.mobileCardLight]}
          onPress={() => onViewItem(item)}
        >
          <View style={styles.mobileCardHeader}>
            <View style={styles.mobileCardIcon}>
              {item.fileFormat === 'XLSX' ? (
                <FileSpreadsheet size={20} color="#10b981" />
              ) : item.fileFormat === 'JPG' || item.fileFormat === 'PNG' ? (
                <ImageIcon size={20} color={isLight ? '#f47721' : '#ff9345'} />
              ) : (
                <FileText size={20} color={isLight ? '#f47721' : '#ff9345'} />
              )}
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={[styles.mobileCardTitle, isLight && styles.mobileCardTitleLight]} numberOfLines={1}>
                {item.fileName}
              </Text>
              <Text style={[styles.mobileCardCategory, isLight && styles.mobileCardCategoryLight]} numberOfLines={1}>
                {item.category} • {item.entity}
              </Text>
            </View>
            <View style={[styles.mobileCardBadge, isLight && styles.mobileCardBadgeLight]}>
              <Text style={[styles.mobileCardBadgeText, isLight && styles.mobileCardBadgeTextLight]}>
                {item.fileFormat || 'JPG'}
              </Text>
            </View>
          </View>

          <View style={styles.mobileCardMeta}>
            <Text style={[styles.mobileCardMetaText, isLight && styles.mobileCardMetaTextLight]}>
              {item.scannedDate || item.createdAt || (item.year ? `${item.year} ${item.month !== 'CURRENT' ? item.month : ''}`.trim() : item.receiptDate || '-')}
            </Text>
            {item.amount > 0 && (
              <Text style={[styles.mobileCardAmount, isLight && styles.mobileCardAmountLight]}>
                ₱{parseFloat(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </Text>
            )}
          </View>

          <View style={styles.mobileCardFooter}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={[styles.statusDot, { backgroundColor: item.status === 'Verified' ? '#10b981' : '#f59e0b' }]} />
              <Text style={[styles.mobileCardStatusText, isLight && styles.mobileCardStatusTextLight]}>
                {item.status || 'Verified'}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
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
                  style={[styles.mobileBtnDelete, { minWidth: 32, minHeight: 32, alignItems: 'center', justifyContent: 'center' }]}
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
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
