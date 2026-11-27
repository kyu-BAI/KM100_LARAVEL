import React from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

export default function ConfirmActionModal({
  visible,
  title = 'Confirm Action',
  message,
  itemName,
  confirmLabel = 'Delete Record',
  isProcessing = false,
  onConfirm,
  onCancel,
  isLight,
  isMobile,
  styles
}) {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onCancel}>
      <View style={[styles.modalOverlay, isMobile && styles.modalOverlayMobile]}>
        <View style={[styles.renameModalContainer, isMobile && { width: '92%', maxWidth: '100%' }, isLight && styles.renameModalContainerLight]}>
          <View style={styles.renameModalHeader}>
            <View style={[styles.renameIconBox, { backgroundColor: isLight ? '#fef2f2' : 'rgba(239, 68, 68, 0.15)', borderColor: isLight ? '#fecaca' : 'rgba(239, 68, 68, 0.3)', borderWidth: 1 }]}>
              <AlertTriangle size={20} color="#ef4444" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.renameModalTitle, isLight && styles.renameModalTitleLight]}>{title}</Text>
              <Text style={styles.renameModalSubtitle}>This action cannot be undone</Text>
            </View>
            <TouchableOpacity
              style={[styles.modalCloseBtn, isLight && styles.modalCloseBtnLight]}
              onPress={onCancel}
              disabled={isProcessing}
              accessibilityRole="button"
              accessibilityLabel="Close confirmation dialog"
            >
              <X size={18} color={isLight ? '#475569' : '#94a3b8'} />
            </TouchableOpacity>
          </View>

          <View style={styles.renameModalBody}>
            <Text style={{ fontSize: 13.5, lineHeight: 20, color: isLight ? '#334155' : '#cbd5e1' }}>
              {message || 'Are you sure you want to permanently remove this record?'}
            </Text>
            {itemName ? (
              <View style={{
                marginTop: 10,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
                backgroundColor: isLight ? '#f8fafc' : '#0f172a',
                borderWidth: 1,
                borderColor: isLight ? '#cbd5e1' : '#334155'
              }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: isLight ? '#0f172a' : '#f8fafc' }} numberOfLines={2}>
                  {itemName}
                </Text>
              </View>
            ) : null}
          </View>

          <View style={[styles.modalFooter, isLight && styles.modalFooterLight]}>
            <TouchableOpacity
              style={styles.btnSecondary}
              onPress={onCancel}
              disabled={isProcessing}
            >
              <Text style={styles.btnSecondaryText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.btnPrimary,
                { backgroundColor: '#ef4444', borderColor: '#ef4444' },
                isProcessing && { opacity: 0.65 }
              ]}
              onPress={onConfirm}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Trash2 size={15} color="#fff" />
                  <Text style={styles.btnPrimaryText}>{confirmLabel}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
