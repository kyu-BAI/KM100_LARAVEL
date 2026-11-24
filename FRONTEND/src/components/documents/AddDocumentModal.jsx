import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  ActivityIndicator,
  Image
} from 'react-native';
import {
  FileText,
  FileSpreadsheet,
  Calendar,
  X,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  Camera,
  ArrowLeft,
  Check,
  RefreshCw,
  Receipt,
  Maximize2,
  RotateCw,
  RotateCcw,
  Building2,
  CreditCard,
  Smartphone,
  Edit3,
  ChevronDown,
  ChevronUp,
  ListFilter,
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';
import { RECEIPT_TYPES } from '../../constants/receiptTypes';
import { rotateImageDataUrl } from '../../services/imageService';

export default function AddDocumentModal({
  showAddModal,
  addMode,
  setAddMode,
  closeAddModal,
  stopCamera,
  startCamera,
  flipCamera,
  cameraActive,
  videoRef,
  insertedFile,
  setInsertedFile,
  isUploading,
  handleDeviceFileSelect,
  handleSaveInsertedFile,
  selectedReceiptType,
  setSelectedReceiptType,
  capturedReceiptPhoto,
  setCapturedReceiptPhoto,
  isSavingScan,
  isOcrProcessing,
  ocrStatusText,
  ocrProgress,
  ocrEstablishment,
  setOcrEstablishment,
  ocrReceiptDate,
  setOcrReceiptDate,
  ocrDescription,
  setOcrDescription,
  ocrAmount,
  setOcrAmount,
  ocrOrNumber,
  setOcrOrNumber,
  isOcrVerifiedView,
  setIsOcrVerifiedView,
  ocrValidationError,
  setOcrValidationError,
  ocrReceiptName,
  setOcrReceiptName,
  ocrLineItems,
  setOcrLineItems,
  saveVerifiedReceiptToDatabase,
  captureCameraSnapshotAndAutoSave,
  handleReceiptPhotoSelect,
  isAdmin,
  isKnoahEmployee,
  isRedGooseEmployee,
  isPetcEmployee,
  isConsumablesEmployee,
  isSalesIncomeEmployee,
  currentUser,
  activeNav,
  handleProcessReceiptPhoto,
  isLight,
  isMobile,
  styles
}) {
  const userDept = (currentUser?.department || currentUser?.assignedBranch || '').toLowerCase();
  const hasAllBranchesScope = userDept.includes('all');
  const [previewZoomed, setPreviewZoomed] = useState(false);
  const [isRotatingPhoto, setIsRotatingPhoto] = useState(false);
  const [isLineItemsExpanded, setIsLineItemsExpanded] = useState(true);
  const [isEditingLineItems, setIsEditingLineItems] = useState(false);

  // Helper to update a field in a specific line item
  const handleUpdateLineItem = (index, field, value) => {
    if (!setOcrLineItems) return;
    setOcrLineItems(prev => {
      const updated = [...(prev || [])];
      const item = { ...(updated[index] || {}) };
      item[field] = value;

      // Auto-recalculate amount if qty and unitPrice are changed
      if (field === 'qty' || field === 'unitPrice') {
        const q = parseFloat(field === 'qty' ? value : item.qty) || 0;
        const p = parseFloat(field === 'unitPrice' ? value : item.unitPrice) || 0;
        if (q > 0 && p > 0) {
          item.amount = Math.round(q * p * 100) / 100;
        }
      }
      updated[index] = item;
      return updated;
    });
  };

  // Helper to add a new blank line item entry
  const handleAddLineItem = () => {
    if (!setOcrLineItems) return;
    setOcrLineItems(prev => [
      ...(prev || []),
      { qty: '1', unit: 'PCS', name: '', unitPrice: 0, amount: 0 }
    ]);
    if (!isLineItemsExpanded) setIsLineItemsExpanded(true);
    if (!isEditingLineItems) setIsEditingLineItems(true);
  };

  // Helper to remove a line item entry
  const handleRemoveLineItem = (index) => {
    if (!setOcrLineItems) return;
    setOcrLineItems(prev => prev.filter((_, i) => i !== index));
  };

  // Helper to sync line items total sum with receipt total amount field
  const handleSyncTotalFromLineItems = () => {
    if (!ocrLineItems || !setOcrAmount) return;
    const sum = ocrLineItems.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
    setOcrAmount(sum > 0 ? sum.toFixed(2) : '0.00');
  };

  const handleRotateCapturedPhoto = async (deg) => {
    if (!capturedReceiptPhoto || isRotatingPhoto) return;
    setIsRotatingPhoto(true);
    try {
      const rotated = await rotateImageDataUrl(capturedReceiptPhoto, deg, 0.88);
      if (rotated && setCapturedReceiptPhoto) {
        setCapturedReceiptPhoto(rotated);
      }
    } catch (e) {
      console.warn('Failed to rotate photo:', e);
    } finally {
      setIsRotatingPhoto(false);
    }
  };
  return (
    <Modal visible={showAddModal} transparent animationType="fade">
      <View style={[styles.modalOverlay, isMobile && styles.modalOverlayMobile]}>
        <View style={[styles.formModalContainer, isMobile && styles.modalContainerMobile, isLight && styles.formModalContainerLight]}>
          {/* Modal Header */}
          <View style={[styles.modalHeader, isMobile && styles.modalHeaderMobile, isLight && styles.modalHeaderLight]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
              {addMode !== 'options' ? (
                <TouchableOpacity
                  onPress={() => {
                    stopCamera();
                    setAddMode('options');
                  }}
                  style={styles.backModalBtn}
                >
                  <ArrowLeft size={18} color={isLight ? '#f47721' : '#f47721'} />
                </TouchableOpacity>
              ) : (
                <View style={{
                  width: 32,
                  height: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  <Image
                    source={{ uri: '/km100-logo.png' }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="contain"
                  />
                </View>
              )}
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={[styles.modalTitle, isMobile && { fontSize: 15 }, isLight && styles.modalTitleLight]} numberOfLines={1}>
                  {addMode === 'options' && 'Add Document'}
                  {addMode === 'insert' && 'Insert Document from Device'}
                  {addMode === 'scan' && 'Scan Receipt Document'}
                </Text>
                <Text style={[styles.modalHeaderSub, isMobile && { fontSize: 11 }, isLight && styles.viewerSubtitleLight]} numberOfLines={1}>
                  {addMode === 'options' && 'Choose one of the two options below to add records'}
                  {addMode === 'insert' && `Target Category: ${activeNav?.label || 'General'}`}
                  {addMode === 'scan' && 'Choose receipt type and capture with camera'}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={closeAddModal} style={[styles.modalCloseBtn, isLight && styles.modalCloseBtnLight]}>
              <X size={18} color={isLight ? '#475569' : '#94a3b8'} />
            </TouchableOpacity>
          </View>

          {/* ---------------------------------------------------- */}
          {/* STAGE 1: THE TWO OPTIONS (Insert OR Scan)             */}
          {/* ---------------------------------------------------- */}
          {addMode === 'options' && (
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={[styles.optionsBody, isMobile && styles.optionsBodyMobile]}
              showsVerticalScrollIndicator={false}
            >
              {/* Option 1: Insert Document */}
              <TouchableOpacity
                style={[styles.optionCard, isMobile && styles.optionCardMobile, isLight && styles.optionCardLight]}
                onPress={() => setAddMode('insert')}
              >
                <View style={styles.optionCardTopRow}>
                  <View style={styles.optionIconBox}>
                    <UploadCloud size={24} color="#f47721" />
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={[styles.optionTitle, isLight && styles.optionTitleLight]}>Insert Document</Text>
                    <Text style={[styles.optionSubtitle, isLight && styles.optionSubtitleLight]}>Select file from device</Text>
                  </View>
                </View>
                <Text style={[styles.optionDescription, isLight && styles.optionDescriptionLight]}>
                  Browse or upload PDF reports, Excel spreadsheets (.xlsx), text files, or pre-scanned digital images stored on your device.
                </Text>
                <View style={[styles.optionActionBadge, isMobile && { width: '100%', alignItems: 'center' }]}>
                  <Text style={styles.optionActionText}>Select File →</Text>
                </View>
              </TouchableOpacity>

              {/* Option 2: Scan Document */}
              <TouchableOpacity
                style={[styles.optionCard, styles.optionCardScan, isMobile && styles.optionCardMobile, isLight && styles.optionCardLight]}
                onPress={() => setAddMode('scan')}
              >
                <View style={styles.optionCardTopRow}>
                  <View style={[styles.optionIconBox, styles.optionIconBoxScan]}>
                    <Camera size={24} color="#34d399" />
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={[styles.optionTitle, isLight && styles.optionTitleLight]}>Scan Document</Text>
                    <Text style={[styles.optionSubtitle, { color: '#34d399' }]}>Camera receipt scanner</Text>
                  </View>
                </View>
                <Text style={[styles.optionDescription, isLight && styles.optionDescriptionLight]}>
                  Capture physical receipts or vouchers (Emission Sales, CTPL Insurance, Expenses, Consumables) via camera with real-time OCR extraction.
                </Text>
                <View style={[styles.optionActionBadge, styles.optionActionBadgeScan, isMobile && { width: '100%', alignItems: 'center' }]}>
                  <Text style={[styles.optionActionText, { color: '#34d399' }]}>Scan Receipt →</Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          )}

          {/* ---------------------------------------------------- */}
          {/* STAGE 2: INSERT DOCUMENT FROM DEVICE                 */}
          {/* ---------------------------------------------------- */}
          {addMode === 'insert' && (
            <>
              <ScrollView style={styles.modalBody}>
                {/* Hidden file input */}
                <input
                  type="file"
                  id="deviceFileInput"
                  style={{ display: 'none' }}
                  onChange={handleDeviceFileSelect}
                />

                {!insertedFile ? (
                  <TouchableOpacity
                    style={styles.dropzone}
                    onPress={() => document.getElementById('deviceFileInput')?.click()}
                  >
                    <View style={styles.dropzoneIconBox}>
                      <UploadCloud size={40} color="#f47721" />
                    </View>
                    <Text style={styles.dropzoneTitle}>Choose a file from your device</Text>
                    <Text style={styles.dropzoneSub}>
                      Click anywhere in this box to browse existing files on your computer
                    </Text>
                    <View style={styles.supportedFormatsPill}>
                      <Text style={styles.supportedFormatsText}>Supported:XLSX</Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.selectedFileContainer}>
                    <View style={styles.selectedFileHeader}>
                      <View style={styles.fileIconBox}>
                        {insertedFile.name.endsWith('.xlsx') ? (
                          <FileSpreadsheet size={26} color="#34d399" />
                        ) : (
                          <FileText size={26} color="#f47721" />
                        )}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.selectedFileName} numberOfLines={1}>{insertedFile.name}</Text>
                        <Text style={styles.selectedFileSize}>
                          {(insertedFile.size / 1024).toFixed(1)} KB • Ready to save
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => setInsertedFile(null)}
                        style={styles.removeFileBtn}
                        title="Choose different file"
                      >
                        <X size={16} color="#f87171" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.insertMetaBox}>
                      <Text style={styles.insertMetaLabel}>DESTINATION DIRECTORY</Text>
                      <Text style={styles.insertMetaValue}>{activeNav?.label || 'General'}</Text>
                    </View>
                  </View>
                )}
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.btnSecondary}
                  onPress={() => setAddMode('options')}
                >
                  <Text style={styles.btnSecondaryText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btnPrimary, !insertedFile && { opacity: 0.5 }]}
                  onPress={handleSaveInsertedFile}
                  disabled={!insertedFile || isUploading}
                >
                  {isUploading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Check size={16} color="#fff" />
                      <Text style={styles.btnPrimaryText}>Save to Inventory</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* ---------------------------------------------------- */}
          {/* STAGE 3: SCAN DOCUMENT / RECEIPT                     */}
          {/* ---------------------------------------------------- */}
          {addMode === 'scan' && (
            <>
              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                {/* Step A: Choose what receipt you are about to scan */}
                <Text style={styles.scanSectionHeading}>
                  Receipt Category
                </Text>
                <View style={styles.receiptTypeGrid}>
                  {RECEIPT_TYPES.filter(rt => {
                    if (isAdmin || hasAllBranchesScope) return true;
                    if (isKnoahEmployee) return rt.entity === 'Knoah Mari' || rt.id.includes('knoah');
                    if (isRedGooseEmployee) return rt.entity === 'Red Goose' || rt.id.includes('red');
                    if (isPetcEmployee) return rt.entity === 'PETC' || rt.id.includes('petc');
                    if (isConsumablesEmployee) return rt.id === 'consumables-delivery' || rt.category === 'Consumables';
                    if (isSalesIncomeEmployee) return rt.category === 'PETC Sales' || rt.category === 'PETC Income';
                    return false;
                  }).map(rt => {
                    const isSelected = selectedReceiptType.id === rt.id;
                    return (
                      <TouchableOpacity
                        key={rt.id}
                        style={[
                          styles.receiptTypeCard,
                          isLight && styles.receiptTypeCardLight,
                          isSelected && styles.receiptTypeCardActive,
                          isSelected && isLight && styles.receiptTypeCardActiveLight,
                          isMobile && { width: '100%' }
                        ]}
                        onPress={() => setSelectedReceiptType(rt)}
                      >
                        <View style={styles.receiptTypeHeader}>
                          <Text style={[styles.receiptTypeName, isLight && styles.receiptTypeNameLight, isSelected && styles.receiptTypeNameActive]}>
                            {rt.name}
                          </Text>
                          {isSelected && <CheckCircle2 size={16} color={isLight ? '#059669' : '#34d399'} />}
                        </View>
                        <Text style={[styles.receiptTypeDesc, isLight && styles.receiptTypeDescLight]} numberOfLines={2}>{rt.description}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                          <View style={[styles.receiptEntityBadge, isLight && styles.receiptEntityBadgeLight]}>
                            <Text style={[styles.receiptEntityBadgeText, isLight && styles.receiptEntityBadgeTextLight]}>{rt.category} • {rt.entity}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Step B: Intelligent Camera & OCR Capture Triggers */}
                <View style={{ marginTop: 18, marginBottom: 8 }}>
                  <Text style={[styles.scanSectionHeading, isLight && { color: '#f47721' }]}>
                    Capture Receipt
                  </Text>
                </View>

                {/* Native mobile camera input */}
                <input
                  type="file"
                  id="mobileCameraInput"
                  accept="image/*"
                  capture="environment"
                  style={{ display: 'none' }}
                  onChange={handleReceiptPhotoSelect}
                />

                {/* Standard file picker input */}
                <input
                  type="file"
                  id="receiptPhotoUploadInput"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleReceiptPhotoSelect}
                />

                {isOcrProcessing ? (
                  /* OCR Processing Screen */
                  <View style={[styles.ocrScanningCard, isLight && { backgroundColor: '#f8fafc', borderColor: '#f47721' }]}>
                    <ActivityIndicator size="large" color="#f47721" />
                    <View style={{ alignItems: 'center', gap: 4 }}>
                      <Text style={[styles.ocrScanningTitle, isLight && { color: '#f47721' }]}>Scanning receipt...</Text>
                      <Text style={[styles.ocrScanningSub, isLight && { color: '#64748b' }]}>{ocrStatusText || 'Extracting receipt details...'}</Text>
                    </View>
                    <View style={styles.ocrProgressBarBg}>
                      <View style={[styles.ocrProgressBarFill, { width: `${Math.round((ocrProgress || 0.4) * 100)}%` }]} />
                    </View>
                  </View>
                ) : ocrValidationError ? (
                  /* OCR Error Screen: Non-Receipt Rejected or Processing Error */
                  <View style={[styles.ocrErrorCard, isLight && styles.ocrErrorCardLight]}>
                    <View style={styles.ocrErrorHeader}>
                      <View style={styles.ocrErrorIconBox}>
                        <AlertTriangle size={24} color="#ef4444" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.ocrErrorTitle, isLight && { color: '#b91c1c' }]}>
                          Receipt Scan Error
                        </Text>
                        <Text style={[styles.ocrErrorSubtitle, isLight && { color: '#64748b' }]}>
                          The scanned document could not be processed.
                        </Text>
                      </View>
                    </View>

                    {/* Photo Thumbnail + Reason */}
                    <View style={[styles.ocrErrorBody, isLight && { backgroundColor: '#fef2f2', borderColor: '#fecaca' }]}>
                      {capturedReceiptPhoto && (
                        <Image
                          source={{ uri: capturedReceiptPhoto }}
                          style={{ width: 60, height: 75, borderRadius: 6, borderWidth: 2, borderColor: '#ef4444' }}
                          resizeMode="cover"
                        />
                      )}
                      <View style={{ flex: 1, gap: 4 }}>
                        <Text style={{ fontSize: 12, fontWeight: '700', color: isLight ? '#991b1b' : '#f87171' }}>
                          Reason:
                        </Text>
                        <Text style={{ fontSize: 12, color: isLight ? '#7f1d1d' : '#fca5a5', lineHeight: 16 }}>
                          {ocrValidationError}
                        </Text>
                        <Text style={{ fontSize: 11, color: isLight ? '#64748b' : '#94a3b8', marginTop: 4 }}>
                          Please ensure the document is a clearly lit and valid receipt.
                        </Text>
                      </View>
                    </View>

                    {/* Action buttons to retake or pick file */}
                    <View style={[styles.ocrActionsRow, isMobile && { flexDirection: 'column' }]}>
                      <TouchableOpacity
                        style={[styles.btnRetakeOcr, { flex: 1, backgroundColor: '#f47721', borderColor: '#f47721' }]}
                        onPress={() => {
                          setOcrValidationError('');
                          setCapturedReceiptPhoto(null);
                          startCamera();
                        }}
                      >
                        <Camera size={16} color="#ffffff" />
                        <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 13 }}>
                          Retake Photo with Camera
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.btnRetakeOcr, isLight && styles.btnRetakeOcrLight, { flex: 1 }]}
                        onPress={() => {
                          setOcrValidationError('');
                          setCapturedReceiptPhoto(null);
                          document.getElementById('receiptPhotoUploadInput')?.click();
                        }}
                      >
                        <UploadCloud size={16} color={isLight ? '#334155' : '#cbd5e1'} />
                        <Text style={[styles.btnRetakeOcrText, isLight && styles.btnRetakeOcrTextLight]}>
                          Upload Different File
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : isOcrVerifiedView ? (
                  /* OCR Verification & Review Screen */
                  <View style={[styles.ocrVerificationContainer, isLight && styles.ocrVerificationContainerLight]}>
                    <View style={[styles.ocrVerificationHeader, isLight && { borderBottomColor: '#e2e8f0' }]}>
                      <View style={styles.ocrVerificationTitleRow}>
                        <Receipt size={18} color={isLight ? '#f47721' : '#f47721'} />
                        <Text style={[styles.ocrVerificationTitle, isLight && styles.ocrVerificationTitleLight]}>Receipt Details</Text>
                      </View>
                      <View style={[styles.receiptEntityBadge, { backgroundColor: isLight ? 'rgba(16, 185, 129, 0.12)' : 'rgba(52, 211, 153, 0.15)', borderColor: isLight ? 'rgba(16, 185, 129, 0.3)' : 'rgba(52, 211, 153, 0.3)', borderWidth: 1 }]}>
                        <Text style={[styles.receiptEntityBadgeText, { color: isLight ? '#059669' : '#34d399' }]}>Scanned Details</Text>
                      </View>
                    </View>

                    {/* Receipt thumbnail + preview & Upright Controls */}
                    <View style={[styles.ocrPreviewRow, isLight && styles.ocrPreviewRowLight]}>
                      {capturedReceiptPhoto && (
                        <TouchableOpacity
                          activeOpacity={0.88}
                          onPress={() => setPreviewZoomed(true)}
                          style={{ position: 'relative', cursor: 'zoom-in' }}
                          title="Click to maximize receipt photo"
                        >
                          <Image
                            source={{ uri: capturedReceiptPhoto }}
                            style={{ width: 68, height: 85, borderRadius: 6, borderWidth: 1, borderColor: isLight ? '#cbd5e1' : '#334155' }}
                            resizeMode="cover"
                          />
                          <View style={{
                            position: 'absolute',
                            bottom: 2,
                            right: 2,
                            backgroundColor: 'rgba(15, 23, 42, 0.85)',
                            borderRadius: 3,
                            padding: 2
                          }}>
                            <Maximize2 size={10} color="#f47721" />
                          </View>
                        </TouchableOpacity>
                      )}
                      <View style={{ flex: 1, minWidth: 0, gap: 5 }}>
                        <Text style={{ fontSize: 13, color: isLight ? '#252525' : '#f8fafc', fontWeight: '700' }} numberOfLines={1}>
                          {ocrEstablishment || selectedReceiptType.name}
                        </Text>
                        <Text style={{ fontSize: 11, color: isLight ? '#64748b' : '#94a3b8' }} numberOfLines={1}>
                          Classification: <Text style={{ color: isLight ? '#252525' : '#cbd5e1', fontWeight: '600' }}>{selectedReceiptType.name}</Text>
                        </Text>

                        {capturedReceiptPhoto && (
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2, flexWrap: 'wrap' }}>
                            {/* Rotate Left Button */}
                            <TouchableOpacity
                              onPress={() => handleRotateCapturedPhoto(-90)}
                              disabled={isRotatingPhoto}
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 4,
                                backgroundColor: isLight ? '#f5f3ef' : 'rgba(255, 255, 255, 0.08)',
                                borderColor: isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.15)',
                                borderWidth: 1,
                                paddingHorizontal: 8,
                                paddingVertical: 4,
                                borderRadius: 5,
                                cursor: isRotatingPhoto ? 'not-allowed' : 'pointer',
                                opacity: isRotatingPhoto ? 0.6 : 1
                              }}
                              title="Rotate receipt 90° counter-clockwise to keep it upright"
                            >
                              <RotateCcw size={12} color={isLight ? '#f47721' : '#f47721'} />
                              <Text style={{ fontSize: 11, color: isLight ? '#f47721' : '#f47721', fontWeight: '600' }}>
                                Rotate Left
                              </Text>
                            </TouchableOpacity>

                            {/* Rotate Right Button */}
                            <TouchableOpacity
                              onPress={() => handleRotateCapturedPhoto(90)}
                              disabled={isRotatingPhoto}
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 4,
                                backgroundColor: isLight ? '#f5f3ef' : 'rgba(255, 255, 255, 0.08)',
                                borderColor: isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.15)',
                                borderWidth: 1,
                                paddingHorizontal: 8,
                                paddingVertical: 4,
                                borderRadius: 5,
                                cursor: isRotatingPhoto ? 'not-allowed' : 'pointer',
                                opacity: isRotatingPhoto ? 0.6 : 1
                              }}
                              title="Rotate receipt 90° clockwise to keep it upright"
                            >
                              <RotateCw size={12} color={isLight ? '#f47721' : '#f47721'} />
                              <Text style={{ fontSize: 11, color: isLight ? '#f47721' : '#f47721', fontWeight: '600' }}>
                                Rotate Right
                              </Text>
                            </TouchableOpacity>

                            {/* Maximize Photo Pill */}
                            <TouchableOpacity
                              onPress={() => setPreviewZoomed(true)}
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 4,
                                backgroundColor: isLight ? '#fef3eb' : 'rgba(56, 189, 248, 0.12)',
                                borderColor: isLight ? '#fcd3b4' : 'rgba(56, 189, 248, 0.25)',
                                borderWidth: 1,
                                paddingHorizontal: 8,
                                paddingVertical: 4,
                                borderRadius: 5,
                                cursor: 'pointer'
                              }}
                              title="Maximize photo in full screen"
                            >
                              <Maximize2 size={11} color={isLight ? '#f47721' : '#f47721'} />
                              <Text style={{ fontSize: 11, color: isLight ? '#f47721' : '#f47721', fontWeight: '700' }}>
                                Expand
                              </Text>
                            </TouchableOpacity>

                            {/* Upright badge */}
                            <View style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: 3,
                              backgroundColor: 'rgba(52, 211, 153, 0.1)',
                              borderColor: 'rgba(52, 211, 153, 0.25)',
                              borderWidth: 1,
                              paddingHorizontal: 6,
                              paddingVertical: 3,
                              borderRadius: 5
                            }}>
                              <Check size={10} color="#34d399" />
                              <Text style={{ fontSize: 10, color: '#34d399', fontWeight: '700' }}>
                                Upright
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>
                    </View>

                    {/* Form fields: Document Name, Establishment, Date, Description, Amount, OR No */}
                    <View style={styles.ocrFieldsGrid}>
                      {/* Document Name */}
                      <View style={styles.ocrFieldItem}>
                        <View style={styles.ocrFieldLabelRow}>
                          <Edit3 size={13} color={isLight ? '#f47721' : '#f47721'} />
                          <Text style={[styles.ocrFieldLabel, isLight && styles.ocrFieldLabelLight]}>Document Name:</Text>
                        </View>
                        <TextInput
                          style={[styles.ocrFieldInput, isLight && styles.ocrFieldInputLight, { fontWeight: '700' }]}
                          value={ocrReceiptName}
                          onChangeText={setOcrReceiptName}
                          placeholder="e.g. Scanned_REC_1001 or Custom Receipt Name"
                          placeholderTextColor={isLight ? '#94a3b8' : '#64748b'}
                          accessibilityLabel="Receipt or file name"
                          autoComplete="off"
                          autoCorrect={false}
                          spellCheck={false}
                        />
                      </View>

                      {/* Establishment */}
                      <View style={styles.ocrFieldItem}>
                        <View style={styles.ocrFieldLabelRow}>
                          <Building2 size={13} color={isLight ? '#f47721' : '#f47721'} />
                          <Text style={[styles.ocrFieldLabel, isLight && styles.ocrFieldLabelLight]}>Establishment:</Text>
                        </View>
                        <TextInput
                          style={[styles.ocrFieldInput, isLight && styles.ocrFieldInputLight]}
                          value={ocrEstablishment}
                          onChangeText={setOcrEstablishment}
                          placeholder="e.g. Store or Business Name"
                          placeholderTextColor={isLight ? '#94a3b8' : '#64748b'}
                          accessibilityLabel="Establishment or business name"
                          autoComplete="off"
                          autoCorrect={false}
                          spellCheck={false}
                        />
                      </View>

                      {/* Receipt Date */}
                      <View style={styles.ocrFieldItem}>
                        <View style={styles.ocrFieldLabelRow}>
                          <Calendar size={13} color={isLight ? '#f47721' : '#f47721'} />
                          <Text style={[styles.ocrFieldLabel, isLight && styles.ocrFieldLabelLight]}>Receipt Date:</Text>
                        </View>
                        <TextInput
                          style={[styles.ocrFieldInput, isLight && styles.ocrFieldInputLight]}
                          value={ocrReceiptDate}
                          onChangeText={setOcrReceiptDate}
                          placeholder="YYYY-MM-DD"
                          placeholderTextColor={isLight ? '#94a3b8' : '#64748b'}
                          accessibilityLabel="Receipt issue date"
                          autoComplete="off"
                          autoCorrect={false}
                          spellCheck={false}
                        />
                      </View>

                      {/* Description */}
                      <View style={styles.ocrFieldItem}>
                        <View style={styles.ocrFieldLabelRow}>
                          <FileText size={13} color={isLight ? '#f47721' : '#f47721'} />
                          <Text style={[styles.ocrFieldLabel, isLight && styles.ocrFieldLabelLight]}>Description:</Text>
                        </View>
                        <TextInput
                          style={[styles.ocrFieldInput, isLight && styles.ocrFieldInputLight]}
                          value={ocrDescription}
                          onChangeText={setOcrDescription}
                          placeholder="e.g. Service or Item Details"
                          placeholderTextColor={isLight ? '#94a3b8' : '#64748b'}
                          accessibilityLabel="Description of receipt or items"
                          autoComplete="off"
                          autoCorrect={false}
                          spellCheck={false}
                        />
                      </View>

                      {/* Amount */}
                      <View style={styles.ocrFieldItem}>
                        <View style={styles.ocrFieldLabelRow}>
                          <CreditCard size={13} color={isLight ? '#059669' : '#34d399'} />
                          <Text style={[styles.ocrFieldLabel, isLight && styles.ocrFieldLabelLight]}>Total Amount (PHP):</Text>
                        </View>
                        <TextInput
                          style={[styles.ocrFieldInput, isLight && styles.ocrFieldInputLight, { color: isLight ? '#059669' : '#34d399', fontWeight: '700' }]}
                          value={ocrAmount}
                          onChangeText={setOcrAmount}
                          placeholder="0.00"
                          placeholderTextColor={isLight ? '#94a3b8' : '#64748b'}
                          keyboardType="numeric"
                          accessibilityLabel="Total receipt amount in Philippine Pesos"
                          autoComplete="off"
                          autoCorrect={false}
                          spellCheck={false}
                        />
                      </View>

                      {/* Invoice / OR Number */}
                      <View style={styles.ocrFieldItem}>
                        <View style={styles.ocrFieldLabelRow}>
                          <CheckCircle2 size={13} color={isLight ? '#f47721' : '#f47721'} />
                          <Text style={[styles.ocrFieldLabel, isLight && styles.ocrFieldLabelLight]}>Invoice / OR Number:</Text>
                        </View>
                        <TextInput
                          style={[styles.ocrFieldInput, isLight && styles.ocrFieldInputLight]}
                          value={ocrOrNumber}
                          onChangeText={setOcrOrNumber}
                          placeholder="e.g. 0002254722"
                          placeholderTextColor={isLight ? '#94a3b8' : '#64748b'}
                          accessibilityLabel="Official receipt or invoice number"
                          autoComplete="off"
                          autoCorrect={false}
                          spellCheck={false}
                        />
                      </View>
                    </View>

                    {/* Listed Items / Line Items Dropdown Accordion with Inline Editing */}
                    <View style={{
                      marginTop: 12,
                      marginBottom: 10,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: isLight ? '#cbd5e1' : '#334155',
                      backgroundColor: isLight ? '#ffffff' : '#252525',
                      overflow: 'hidden'
                    }}>
                      {/* Dropdown Header Toggle Button */}
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setIsLineItemsExpanded(prev => !prev)}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingVertical: 10,
                          paddingHorizontal: 12,
                          backgroundColor: isLight ? '#f8fafc' : '#1e293b',
                          borderBottomWidth: isLineItemsExpanded ? 1 : 0,
                          borderBottomColor: isLight ? '#e2e8f0' : '#334155'
                        }}
                        accessibilityRole="button"
                        accessibilityLabel="Toggle listed items in receipt"
                        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                          <ListFilter size={15} color={isLight ? '#f47721' : '#f47721'} />
                          <Text style={{ fontSize: 12, fontWeight: '700', color: isLight ? '#252525' : '#f8fafc' }} numberOfLines={1}>
                            Listed Items in Receipt
                          </Text>
                          <View style={{
                            backgroundColor: isLight ? '#fef3eb' : 'rgba(56, 189, 248, 0.15)',
                            paddingHorizontal: 7,
                            paddingVertical: 2,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: isLight ? '#fcd3b4' : 'rgba(56, 189, 248, 0.3)'
                          }}>
                            <Text style={{ fontSize: 10, fontWeight: '800', color: isLight ? '#e06412' : '#f47721' }}>
                              {(ocrLineItems || []).length} {(ocrLineItems || []).length === 1 ? 'item' : 'items'}
                            </Text>
                          </View>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          {/* Edit Mode Toggle Button */}
                          <TouchableOpacity
                            onPress={(e) => {
                              if (e && e.stopPropagation) e.stopPropagation();
                              setIsEditingLineItems(prev => !prev);
                              if (!isLineItemsExpanded) setIsLineItemsExpanded(true);
                            }}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: 4,
                              paddingHorizontal: 8,
                              paddingVertical: 4,
                              borderRadius: 5,
                              backgroundColor: isEditingLineItems ? '#f47721' : (isLight ? '#f5f3ef' : 'rgba(255, 255, 255, 0.08)'),
                              borderColor: isEditingLineItems ? '#f47721' : (isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.15)'),
                              borderWidth: 1
                            }}
                            title={isEditingLineItems ? 'Done editing items' : 'Edit item names, quantities, and prices'}
                          >
                            {isEditingLineItems ? (
                              <>
                                <Check size={11} color="#ffffff" />
                                <Text style={{ fontSize: 11, fontWeight: '700', color: '#ffffff' }}>Done</Text>
                              </>
                            ) : (
                              <>
                                <Edit2 size={11} color={isLight ? '#f47721' : '#f47721'} />
                                <Text style={{ fontSize: 11, fontWeight: '700', color: isLight ? '#f47721' : '#f47721' }}>Edit</Text>
                              </>
                            )}
                          </TouchableOpacity>

                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, marginLeft: 2 }}>
                            <Text style={{ fontSize: 11, color: isLight ? '#64748b' : '#94a3b8' }}>
                              {isLineItemsExpanded ? 'Hide' : 'Review'}
                            </Text>
                            {isLineItemsExpanded ? (
                              <ChevronUp size={16} color={isLight ? '#64748b' : '#94a3b8'} />
                            ) : (
                              <ChevronDown size={16} color={isLight ? '#64748b' : '#94a3b8'} />
                            )}
                          </View>
                        </View>
                      </TouchableOpacity>

                      {/* Expanded Breakdown Table & Editor */}
                      {isLineItemsExpanded && (
                        <View style={{ padding: 10 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                            <Text style={{ fontSize: 11, color: isLight ? '#64748b' : '#94a3b8' }}>
                              {isEditingLineItems ? 'Edit item names, quantities, unit prices, or amounts:' : 'Verify or edit detected entries before saving:'}
                            </Text>
                            {!isEditingLineItems && (
                              <TouchableOpacity
                                onPress={() => setIsEditingLineItems(true)}
                                style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}
                              >
                                <Edit2 size={11} color={isLight ? '#f47721' : '#f47721'} />
                                <Text style={{ fontSize: 11, color: isLight ? '#f47721' : '#f47721', fontWeight: '700' }}>
                                  Edit Items
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>

                          {(!ocrLineItems || ocrLineItems.length === 0) ? (
                            <View style={{
                              padding: 14,
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: isLight ? '#f8fafc' : '#1e293b',
                              borderRadius: 6,
                              borderWidth: 1,
                              borderStyle: 'dashed',
                              borderColor: isLight ? '#cbd5e1' : '#475569',
                              gap: 6
                            }}>
                              <Text style={{ fontSize: 12, color: isLight ? '#64748b' : '#94a3b8' }}>
                                No itemized entries currently listed.
                              </Text>
                              <TouchableOpacity
                                onPress={handleAddLineItem}
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  gap: 5,
                                  backgroundColor: '#f47721',
                                  paddingHorizontal: 10,
                                  paddingVertical: 5,
                                  borderRadius: 5
                                }}
                              >
                                <Plus size={13} color="#ffffff" />
                                <Text style={{ fontSize: 11, fontWeight: '700', color: '#ffffff' }}>
                                  Add First Item Entry
                                </Text>
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: '100%' }}>
                              <View style={{ minWidth: isMobile ? 360 : '100%', width: '100%' }}>
                                {/* Table Columns Header */}
                                <View style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  backgroundColor: isLight ? '#f5f3ef' : '#1e293b',
                                  paddingVertical: 6,
                                  paddingHorizontal: 8,
                                  borderRadius: 4,
                                  marginBottom: 4
                                }}>
                                  <Text style={{ width: 85, fontSize: 10, fontWeight: '700', color: isLight ? '#475569' : '#94a3b8' }}>QTY & UNIT</Text>
                                  <Text style={{ flex: 2.2, minWidth: 120, fontSize: 10, fontWeight: '700', color: isLight ? '#475569' : '#94a3b8' }}>ARTICLES / ITEM</Text>
                                  <Text style={{ width: 75, fontSize: 10, fontWeight: '700', color: isLight ? '#475569' : '#94a3b8', textAlign: 'right' }}>UNIT PRICE</Text>
                                  <Text style={{ width: 85, fontSize: 10, fontWeight: '700', color: isLight ? '#475569' : '#94a3b8', textAlign: 'right' }}>AMOUNT</Text>
                                  {isEditingLineItems && (
                                    <Text style={{ width: 28, textAlign: 'center', fontSize: 10, fontWeight: '700', color: isLight ? '#94a3b8' : '#64748b' }}></Text>
                                  )}
                                </View>

                                {/* Item Rows (Editable or Readonly) */}
                                {ocrLineItems.map((item, idx) => (
                                  <View
                                    key={idx}
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      paddingVertical: isEditingLineItems ? 4 : 6,
                                      paddingHorizontal: 8,
                                      backgroundColor: idx % 2 === 1 ? (isLight ? '#f8fafc' : 'rgba(30, 41, 59, 0.4)') : 'transparent',
                                      borderBottomWidth: 1,
                                      borderBottomColor: isLight ? '#f5f3ef' : '#1e293b',
                                      gap: 4
                                    }}
                                  >
                                    {isEditingLineItems ? (
                                      <>
                                        {/* Editable Qty & Unit */}
                                        <View style={{ flexDirection: 'row', gap: 3, width: 85 }}>
                                          <TextInput
                                            style={{
                                              width: 38,
                                              backgroundColor: isLight ? '#ffffff' : '#1e293b',
                                              borderColor: isLight ? '#cbd5e1' : '#475569',
                                              borderWidth: 1,
                                              borderRadius: 4,
                                              paddingHorizontal: 4,
                                              paddingVertical: 3,
                                              fontSize: 11,
                                              color: isLight ? '#252525' : '#f8fafc',
                                              textAlign: 'center'
                                            }}
                                            value={String(item.qty || '')}
                                            onChangeText={(val) => handleUpdateLineItem(idx, 'qty', val)}
                                            placeholder="Qty"
                                            placeholderTextColor={isLight ? '#94a3b8' : '#64748b'}
                                          />
                                          <TextInput
                                            style={{
                                              width: 44,
                                              backgroundColor: isLight ? '#ffffff' : '#1e293b',
                                              borderColor: isLight ? '#cbd5e1' : '#475569',
                                              borderWidth: 1,
                                              borderRadius: 4,
                                              paddingHorizontal: 4,
                                              paddingVertical: 3,
                                              fontSize: 11,
                                              color: isLight ? '#252525' : '#f8fafc',
                                              textAlign: 'center'
                                            }}
                                            value={String(item.unit || '')}
                                            onChangeText={(val) => handleUpdateLineItem(idx, 'unit', val)}
                                            placeholder="Unit"
                                            placeholderTextColor={isLight ? '#94a3b8' : '#64748b'}
                                          />
                                        </View>

                                        {/* Editable Item Name */}
                                        <TextInput
                                          style={{
                                            flex: 2.2,
                                            minWidth: 120,
                                            backgroundColor: isLight ? '#ffffff' : '#1e293b',
                                            borderColor: isLight ? '#cbd5e1' : '#475569',
                                            borderWidth: 1,
                                            borderRadius: 4,
                                            paddingHorizontal: 6,
                                            paddingVertical: 3,
                                            fontSize: 11,
                                            fontWeight: '600',
                                            color: isLight ? '#252525' : '#f8fafc'
                                          }}
                                          value={item.name}
                                          onChangeText={(val) => handleUpdateLineItem(idx, 'name', val)}
                                          placeholder="Item description"
                                          placeholderTextColor={isLight ? '#94a3b8' : '#64748b'}
                                        />

                                        {/* Editable Unit Price */}
                                        <TextInput
                                          style={{
                                            width: 75,
                                            backgroundColor: isLight ? '#ffffff' : '#1e293b',
                                            borderColor: isLight ? '#cbd5e1' : '#475569',
                                            borderWidth: 1,
                                            borderRadius: 4,
                                            paddingHorizontal: 4,
                                            paddingVertical: 3,
                                            fontSize: 11,
                                            color: isLight ? '#252525' : '#f8fafc',
                                            textAlign: 'right'
                                          }}
                                          value={item.unitPrice !== undefined && item.unitPrice !== null ? String(item.unitPrice) : ''}
                                          onChangeText={(val) => handleUpdateLineItem(idx, 'unitPrice', val)}
                                          placeholder="0.00"
                                          placeholderTextColor={isLight ? '#94a3b8' : '#64748b'}
                                          keyboardType="numeric"
                                        />

                                        {/* Editable Amount */}
                                        <TextInput
                                          style={{
                                            width: 85,
                                            backgroundColor: isLight ? '#ffffff' : '#1e293b',
                                            borderColor: isLight ? '#cbd5e1' : '#475569',
                                            borderWidth: 1,
                                            borderRadius: 4,
                                            paddingHorizontal: 4,
                                            paddingVertical: 3,
                                            fontSize: 11,
                                            fontWeight: '700',
                                            color: isLight ? '#f47721' : '#f47721',
                                            textAlign: 'right'
                                          }}
                                          value={item.amount !== undefined && item.amount !== null ? String(item.amount) : ''}
                                          onChangeText={(val) => handleUpdateLineItem(idx, 'amount', val)}
                                          placeholder="0.00"
                                          placeholderTextColor={isLight ? '#94a3b8' : '#64748b'}
                                          keyboardType="numeric"
                                        />

                                        {/* Delete Item Button */}
                                        <TouchableOpacity
                                          onPress={() => handleRemoveLineItem(idx)}
                                          style={{ width: 28, height: 26, alignItems: 'center', justifyContent: 'center' }}
                                          title="Delete entry"
                                        >
                                          <Trash2 size={13} color="#ef4444" />
                                        </TouchableOpacity>
                                      </>
                                    ) : (
                                      <>
                                        {/* Readonly View Row */}
                                        <Text style={{ width: 85, fontSize: 11, color: isLight ? '#334155' : '#cbd5e1', fontWeight: '600' }}>
                                          {item.qty || '1'} {item.unit || ''}
                                        </Text>
                                        <Text style={{ flex: 2.2, minWidth: 120, fontSize: 11, color: isLight ? '#252525' : '#f8fafc', fontWeight: '600' }} numberOfLines={1}>
                                          {item.name}
                                        </Text>
                                        <Text style={{ width: 75, fontSize: 11, color: isLight ? '#64748b' : '#94a3b8', textAlign: 'right' }}>
                                          {item.unitPrice > 0 ? `₱${parseFloat(item.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '-'}
                                        </Text>
                                        <Text style={{ width: 85, fontSize: 11, color: isLight ? '#f47721' : '#f47721', fontWeight: '700', textAlign: 'right' }}>
                                          ₱{parseFloat(item.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </Text>
                                      </>
                                    )}
                                  </View>
                                ))}

                                {/* Total Verification & Subtotal Footer */}
                                <View style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  paddingTop: 8,
                                  paddingHorizontal: 8,
                                  marginTop: 4,
                                  borderTopWidth: 1.5,
                                  borderTopColor: isLight ? '#cbd5e1' : '#334155'
                                }}>
                                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                    <CheckCircle2 size={13} color="#10b981" />
                                    <Text style={{ fontSize: 11, fontWeight: '700', color: isLight ? '#475569' : '#94a3b8' }}>
                                      Subtotal ({ocrLineItems.length} items):
                                    </Text>
                                  </View>
                                  <Text style={{ fontSize: 12, fontWeight: '800', color: isLight ? '#059669' : '#34d399' }}>
                                    ₱{ocrLineItems.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                  </Text>
                                </View>
                              </View>
                            </ScrollView>
                          )}

                          {/* Edit Mode Action Toolbar */}
                          {isEditingLineItems && (
                            <View style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginTop: 10,
                              paddingTop: 8,
                              borderTopWidth: 1,
                              borderTopColor: isLight ? '#f5f3ef' : '#1e293b',
                              flexWrap: 'wrap',
                              gap: 8
                            }}>
                              <TouchableOpacity
                                onPress={handleAddLineItem}
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  gap: 5,
                                  paddingHorizontal: 10,
                                  paddingVertical: 5,
                                  borderRadius: 5,
                                  backgroundColor: isLight ? '#f0fdf4' : 'rgba(16, 185, 129, 0.15)',
                                  borderColor: isLight ? '#bbf7d0' : 'rgba(16, 185, 129, 0.3)',
                                  borderWidth: 1
                                }}
                              >
                                <Plus size={12} color="#10b981" />
                                <Text style={{ fontSize: 11, fontWeight: '700', color: isLight ? '#15803d' : '#34d399' }}>
                                  Add Entry
                                </Text>
                              </TouchableOpacity>

                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <TouchableOpacity
                                  onPress={handleSyncTotalFromLineItems}
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 4,
                                    paddingHorizontal: 9,
                                    paddingVertical: 5,
                                    borderRadius: 5,
                                    backgroundColor: isLight ? '#f0f9ff' : 'rgba(56, 189, 248, 0.15)',
                                    borderColor: isLight ? '#fcd3b4' : 'rgba(56, 189, 248, 0.3)',
                                    borderWidth: 1
                                  }}
                                  title="Sync calculated items sum with Total Amount field"
                                >
                                  <RefreshCw size={11} color="#f47721" />
                                  <Text style={{ fontSize: 11, fontWeight: '700', color: isLight ? '#e06412' : '#f47721' }}>
                                    Sync Total Amount
                                  </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                  onPress={() => setIsEditingLineItems(false)}
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 4,
                                    paddingHorizontal: 10,
                                    paddingVertical: 5,
                                    borderRadius: 5,
                                    backgroundColor: '#f47721'
                                  }}
                                >
                                  <Check size={12} color="#ffffff" />
                                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#ffffff' }}>
                                    Done
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          )}
                        </View>
                      )}
                    </View>

                    {/* Actions */}
                    <View style={[styles.ocrActionsRow, isMobile && { flexDirection: 'column' }]}>
                      <TouchableOpacity
                        style={styles.btnSaveVerified}
                        onPress={saveVerifiedReceiptToDatabase}
                        disabled={isSavingScan}
                      >
                        {isSavingScan ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <>
                            <CheckCircle2 size={16} color="#fff" />
                            <Text style={styles.btnSaveVerifiedText}>
                              Save as {selectedReceiptType.name}
                            </Text>
                          </>
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.btnRetakeOcr, isLight && styles.btnRetakeOcrLight]}
                        onPress={() => {
                          setIsOcrVerifiedView(false);
                          setCapturedReceiptPhoto(null);
                        }}
                      >
                        <RefreshCw size={14} color={isLight ? '#475569' : '#94a3b8'} />
                        <Text style={[styles.btnRetakeOcrText, isLight && styles.btnRetakeOcrTextLight]}>Retake Photo</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : cameraActive ? (
                  /* Live Camera Viewfinder with Scanner Frame */
                  <View style={styles.cameraContainer}>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      style={{ width: '100%', height: isSmallMobile ? 240 : isMobile ? 300 : 360, objectFit: 'cover', borderRadius: 8, backgroundColor: '#000' }}
                    />
                    <View style={styles.cameraOverlayFrame}>
                      <View style={styles.scannerCornerTL} />
                      <View style={styles.scannerCornerTR} />
                      <View style={styles.scannerCornerBL} />
                      <View style={styles.scannerCornerBR} />
                      <Text style={styles.scannerGuideText}>Center receipt inside frame</Text>
                    </View>

                    <View style={styles.cameraActionRow}>
                      <TouchableOpacity
                        style={styles.btnCaptureShutter}
                        onPress={captureCameraSnapshotAndAutoSave}
                        disabled={isSavingScan || isOcrProcessing}
                      >
                        <Camera size={18} color="#fff" />
                        <Text style={styles.btnCaptureShutterText}>{isSmallMobile ? 'Capture' : 'Capture & Read Receipt'}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.btnFlipCamera} onPress={flipCamera}>
                        <RefreshCw size={14} color="#cbd5e1" />
                        <Text style={styles.btnFlipCameraText}>Flip</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.btnCancelCamera} onPress={stopCamera}>
                        <Text style={styles.btnCancelCameraText}>Close</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  /* Scan Mode Options */
                  <View style={[styles.scanTriggerGrid, isMobile && { flexDirection: 'column' }]}>
                    {/* Option 1: Live In-Browser Viewfinder */}
                    <TouchableOpacity style={styles.scanOptionBtn} onPress={() => startCamera('environment')}>
                      <View style={styles.scanOptionIconBox}>
                        <Camera size={26} color="#34d399" />
                      </View>
                      <Text style={styles.scanOptionTitle}>Open Live Camera Viewfinder</Text>
                      <Text style={styles.scanOptionSub}>Point device camera with alignment frame to read receipt</Text>
                    </TouchableOpacity>

                    {/* Option 2: Native Phone Camera App */}
                    <TouchableOpacity
                      style={[styles.scanOptionBtn, styles.scanOptionBtnNative]}
                      onPress={() => document.getElementById('mobileCameraInput')?.click()}
                    >
                      <View style={[styles.scanOptionIconBox, { backgroundColor: 'rgba(56, 189, 248, 0.1)', borderColor: 'rgba(56, 189, 248, 0.3)' }]}>
                        <Smartphone size={26} color="#f47721" />
                      </View>
                      <Text style={styles.scanOptionTitle}>Take Photo with Phone Camera</Text>
                      <Text style={styles.scanOptionSub}>Take clear photo, auto-read establishment, date & amount</Text>
                    </TouchableOpacity>

                    {/* Option 3: Upload Existing Photo */}
                    <TouchableOpacity
                      style={[styles.scanOptionBtn, styles.scanOptionBtnUpload]}
                      onPress={() => document.getElementById('receiptPhotoUploadInput')?.click()}
                    >
                      <View style={[styles.scanOptionIconBox, { backgroundColor: 'rgba(148, 163, 184, 0.1)', borderColor: 'rgba(148, 163, 184, 0.3)' }]}>
                        <UploadCloud size={26} color="#94a3b8" />
                      </View>
                      <Text style={styles.scanOptionTitle}>Upload Receipt Photo</Text>
                      <Text style={styles.scanOptionSub}>Upload receipt image from gallery or phone storage</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.btnSecondary}
                  onPress={() => {
                    stopCamera();
                    setAddMode('options');
                  }}
                >
                  <Text style={styles.btnSecondaryText}>Back</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Fullscreen Photo Lightbox Preview */}
      {previewZoomed && capturedReceiptPhoto && (
        <Modal
          visible={previewZoomed}
          transparent
          animationType="fade"
          onRequestClose={() => setPreviewZoomed(false)}
        >
          <View style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(2, 6, 23, 0.96)',
            zIndex: 999999,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: isMobile ? 12 : 24,
              paddingVertical: 12,
              backgroundColor: 'rgba(15, 23, 42, 0.96)',
              borderBottomWidth: 1,
              borderBottomColor: 'rgba(255, 255, 255, 0.1)'
            }}>
              <View style={{ flex: 1, minWidth: 160 }}>
                <Text style={{ color: '#f8fafc', fontSize: isMobile ? 13 : 15, fontWeight: '700' }} numberOfLines={1}>
                  {ocrEstablishment || selectedReceiptType.name} — Scanned Receipt Photo
                </Text>
                <Text style={{ color: '#94a3b8', fontSize: 11 }}>
                  Orient Upright & Inspect Quality
                </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <TouchableOpacity
                  onPress={() => handleRotateCapturedPhoto(-90)}
                  disabled={isRotatingPhoto}
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    cursor: isRotatingPhoto ? 'not-allowed' : 'pointer'
                  }}
                  title="Rotate Left 90°"
                >
                  <RotateCcw size={16} color="#f8fafc" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleRotateCapturedPhoto(90)}
                  disabled={isRotatingPhoto}
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    cursor: isRotatingPhoto ? 'not-allowed' : 'pointer'
                  }}
                  title="Rotate Right 90°"
                >
                  <RotateCw size={16} color="#f8fafc" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setPreviewZoomed(false)}
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    borderWidth: 1,
                    borderColor: 'rgba(239, 68, 68, 0.4)',
                    cursor: 'pointer',
                    marginLeft: 4
                  }}
                  title="Close Full Screen"
                >
                  <X size={18} color="#f87171" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{
              flex: 1,
              overflow: 'auto',
              alignItems: 'center',
              justifyContent: 'center',
              padding: isMobile ? 12 : 24
            }}>
              <img
                src={capturedReceiptPhoto}
                alt="Scanned Receipt Photo"
                style={{
                  maxWidth: isMobile ? '95vw' : '90vw',
                  maxHeight: isMobile ? '82vh' : '85vh',
                  objectFit: 'contain',
                  borderRadius: 6,
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.08)',
                  imageRendering: 'auto'
                }}
              />
            </View>
          </View>
        </Modal>
      )}
    </Modal>
  );
}
