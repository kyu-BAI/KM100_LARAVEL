import React from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native';
import { Edit3, X, CheckCircle2 } from 'lucide-react';

export default function RenameDocumentModal({
  renameItem,
  renameNewName,
  setRenameNewName,
  isRenaming,
  onSave,
  onClose,
  isLight,
  isMobile,
  styles
}) {
  return (
    <Modal visible={!!renameItem} transparent animationType="fade">
        <View style={[styles.modalOverlay, isMobile && styles.modalOverlayMobile]}>
          <View style={[styles.renameModalContainer, isMobile && { width: '92%', maxWidth: '100%' }, isLight && styles.renameModalContainerLight]}>
            <View style={styles.renameModalHeader}>
              <View style={styles.renameIconBox}>
                <Edit3 size={20} color={isLight ? '#f47721' : '#f47721'} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.renameModalTitle, isLight && styles.renameModalTitleLight]}>Rename Document</Text>
                <Text style={styles.renameModalSubtitle}>Update the document file name and record title</Text>
              </View>
              <TouchableOpacity
                style={[styles.modalCloseBtn, isLight && styles.modalCloseBtnLight]}
                onPress={onClose}
              >
                <X size={18} color={isLight ? '#475569' : '#94a3b8'} />
              </TouchableOpacity>
            </View>

            <View style={styles.renameModalBody}>
              <Text style={[styles.renameFieldLabel, isLight && styles.renameFieldLabelLight]}>DOCUMENT FILE NAME:</Text>
              <TextInput
                style={[styles.renameInput, isLight && styles.renameInputLight]}
                value={renameNewName}
                onChangeText={setRenameNewName}
                placeholder="Enter new file name..."
                placeholderTextColor={isLight ? '#94a3b8' : '#64748b'}
                autoComplete="off"
                autoCorrect={false}
                spellCheck={false}
                autoFocus
                selectTextOnFocus
              />
              <Text style={styles.renameHint}>
                Format: {renameItem?.fileFormat || 'JPG'} • Current: {renameItem?.fileName}
              </Text>
            </View>

            <View style={styles.renameModalFooter}>
              <TouchableOpacity
                style={[styles.btnSecondary, isLight && styles.btnSecondaryLight]}
                onPress={onClose}
                disabled={isRenaming}
              >
                <Text style={[styles.btnSecondaryText, isLight && styles.btnSecondaryTextLight]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btnSaveVerified, isRenaming && { opacity: 0.6 }]}
                onPress={onSave}
                disabled={isRenaming}
              >
                <CheckCircle2 size={16} color="#ffffff" />
                <Text style={styles.btnSaveVerifiedText}>
                  {isRenaming ? 'Saving...' : 'Save Name'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
  );
}
