import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, Image } from 'react-native';
import {
  FileSpreadsheet,
  FileText,
  Printer,
  Download,
  Edit3,
  X,
  CreditCard,
  Building2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  ListFilter
} from 'lucide-react';
import { rotateImageDataUrl } from '../../services/imageService';

export default function DocumentViewerModal({
  viewItem,
  onClose,
  onPrint,
  onDownload,
  onRename,
  onSaveUprightPhoto,
  isLight,
  isMobile,
  styles
}) {
  const [isImageMaximized, setIsImageMaximized] = useState(false);
  const [isItemsExpanded, setIsItemsExpanded] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isSavingUpright, setIsSavingUpright] = useState(false);

  const receiptImageUri = (viewItem?.filePath?.startsWith('data:image') || viewItem?.filePath?.startsWith('http') || viewItem?.filePath?.startsWith('blob:'))
    ? viewItem.filePath
    : viewItem?.previewData?.image;

  const handleZoomIn = () => setZoomLevel(prev => Math.min(3, +(prev + 0.25).toFixed(2)));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(0.5, +(prev - 0.25).toFixed(2)));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleResetZoom = () => {
    setZoomLevel(1);
    setRotation(0);
  };
  const handleDownloadImage = () => {
    if (!receiptImageUri) return;
    const link = document.createElement('a');
    link.href = receiptImageUri;
    link.download = `${viewItem?.fileName || 'receipt'}_photo.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <Modal visible={!!viewItem} transparent animationType="fade">
        <View style={[styles.modalOverlay, isMobile && styles.modalOverlayMobile]}>
          <View style={[styles.viewerModalContainer, isMobile && styles.modalContainerMobile, isLight && styles.viewerModalContainerLight]}>
            <View style={[styles.viewerHeader, isMobile && styles.modalHeaderMobile, isLight && styles.modalHeaderLight]}>
              <View style={[styles.viewerHeaderLeft, isMobile && { gap: 10, flex: 1, minWidth: 0 }]}>
                <View style={[styles.viewerBadge, isMobile && { width: 38, height: 38 }]}>
                  {viewItem?.fileFormat === 'XLSX' ? (
                    <FileSpreadsheet size={isMobile ? 20 : 26} color="#34d399" />
                  ) : (
                    <FileText size={isMobile ? 20 : 26} color={isLight ? '#f47721' : '#f47721'} />
                  )}
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={[styles.viewerTitle, isMobile && { fontSize: 14 }, isLight && styles.viewerTitleLight]} numberOfLines={1}>{viewItem?.fileName}</Text>
                  <Text style={[styles.viewerSubtitle, isMobile && { fontSize: 10 }, isLight && styles.viewerSubtitleLight]} numberOfLines={1}>
                    {viewItem?.category} • {viewItem?.subCategory} • Entity: {viewItem?.entity}
                  </Text>
                </View>
              </View>

              <View style={styles.viewerHeaderActions}>
                <TouchableOpacity
                  style={[styles.btnOutline, isMobile && { paddingHorizontal: 8, paddingVertical: 6 }]}
                  onPress={() => window.print()}
                  title="Print / Save PDF"
                >
                  <Printer size={16} color={isLight ? '#475569' : '#cbd5e1'} />
                  {!isMobile && <Text style={[styles.btnOutlineText, isLight && { color: '#475569' }]}>Print</Text>}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btnOutline, isMobile && { paddingHorizontal: 8, paddingVertical: 6 }]}
                  onPress={() => {
                    if (onRename && viewItem) {
                      onRename(viewItem);
                    }
                  }}
                  title="Rename Document"
                >
                  <Edit3 size={16} color={isLight ? '#f47721' : '#f47721'} />
                  {!isMobile && <Text style={[styles.btnOutlineText, isLight && { color: '#f47721' }]}>Rename</Text>}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btnOutline, isMobile && { paddingHorizontal: 8, paddingVertical: 6 }]}
                  onPress={() => {
                    if (!viewItem) return;
                    const blob = new Blob([JSON.stringify(viewItem, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = viewItem?.fileName || 'document.json';
                    a.click();
                    setTimeout(() => URL.revokeObjectURL(url), 1000);
                  }}
                  title="Export Data"
                >
                  <Download size={16} color={isLight ? '#475569' : '#cbd5e1'} />
                  {!isMobile && <Text style={[styles.btnOutlineText, isLight && { color: '#475569' }]}>Export</Text>}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalCloseBtn, isLight && styles.modalCloseBtnLight]}
                  onPress={onClose}
                >
                  <X size={20} color={isLight ? '#475569' : '#94a3b8'} />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView style={[styles.viewerBody, isLight && styles.modalBodyLight]}>
              <View style={styles.viewerStatsGrid}>
                <View style={styles.viewerStatBox}>
                  <Text style={styles.viewerStatLabel}>ESTABLISHMENT</Text>
                  <Text style={[styles.viewerStatValue, { color: '#f47721' }]} numberOfLines={1}>
                    {viewItem?.establishment || viewItem?.previewData?.establishment || 'General'}
                  </Text>
                </View>
                <View style={styles.viewerStatBox}>
                  <Text style={styles.viewerStatLabel}>DATE SCANNED</Text>
                  <Text style={styles.viewerStatValue}>
                    {viewItem?.scannedDate || viewItem?.createdAt || '-'}
                  </Text>
                </View>
                <View style={styles.viewerStatBox}>
                  <Text style={styles.viewerStatLabel}>RECEIPT DATE (ISSUED)</Text>
                  <Text style={styles.viewerStatValue}>
                    {viewItem?.receiptDate || viewItem?.previewData?.receipt_date || '-'}
                  </Text>
                </View>
                <View style={styles.viewerStatBox}>
                  <Text style={styles.viewerStatLabel}>TOTAL AMOUNT</Text>
                  <Text style={[styles.viewerStatValue, { color: '#34d399' }]}>
                    {viewItem?.amount ? `₱${Number(viewItem.amount).toLocaleString()}` : 'N/A'}
                  </Text>
                </View>
                <View style={styles.viewerStatBox}>
                  <Text style={styles.viewerStatLabel}>DESCRIPTION</Text>
                  <Text style={styles.viewerStatValue} numberOfLines={1}>
                    {viewItem?.description || viewItem?.previewData?.description || viewItem?.title}
                  </Text>
                </View>
                <View style={styles.viewerStatBox}>
                  <Text style={styles.viewerStatLabel}>AUDIT STATUS</Text>
                  <Text style={[styles.viewerStatValue, { color: '#34d399' }]}>
                    {viewItem?.status || 'Active'}
                  </Text>
                </View>
                <View style={styles.viewerStatBox}>
                  <Text style={styles.viewerStatLabel}>FILE TYPE</Text>
                  <Text style={styles.viewerStatValue}>
                    {viewItem?.fileFormat} ({viewItem?.fileSize})
                  </Text>
                </View>
              </View>

              {viewItem?.notes && (
                <View style={styles.viewerSection}>
                  <Text style={styles.viewerSectionTitle}>OFFICIAL NOTES & DESCRIPTIONS</Text>
                  <View style={styles.notesBox}>
                    <Text style={styles.notesText}>{viewItem.notes}</Text>
                  </View>
                </View>
              )}

              {/* Scanned Physical Receipt Image Attachment */}
              {receiptImageUri && (
                <View style={styles.viewerSection}>
                  <View style={styles.previewHeaderRow}>
                    <Text style={styles.viewerSectionTitle}>SCANNED PHYSICAL DOCUMENT PHOTO</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={[styles.previewBadge, { backgroundColor: 'rgba(52, 211, 153, 0.15)', color: '#34d399', borderColor: 'rgba(52, 211, 153, 0.3)' }]}>
                        Verified Capture
                      </Text>
                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 6,
                          backgroundColor: isLight ? '#fef3eb' : 'rgba(56, 189, 248, 0.12)',
                          borderColor: isLight ? '#fcd3b4' : 'rgba(56, 189, 248, 0.3)',
                          borderWidth: 1,
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                          borderRadius: 6,
                          cursor: 'pointer'
                        }}
                        onPress={() => {
                          setZoomLevel(1);
                          setRotation(0);
                          setIsImageMaximized(true);
                        }}
                        title="Maximize receipt image to inspect full quality"
                      >
                        <Maximize2 size={13} color={isLight ? '#f47721' : '#f47721'} />
                        <Text style={{ fontSize: 11, fontWeight: '700', color: isLight ? '#f47721' : '#f47721' }}>
                          Maximize Photo
                        </Text>
                      </TouchableOpacity>

                      {onSaveUprightPhoto && (
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 5,
                            backgroundColor: isLight ? '#f5f3ef' : 'rgba(255, 255, 255, 0.08)',
                            borderColor: isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.15)',
                            borderWidth: 1,
                            paddingHorizontal: 9,
                            paddingVertical: 5,
                            borderRadius: 6,
                            cursor: isSavingUpright ? 'wait' : 'pointer'
                          }}
                          disabled={isSavingUpright}
                          onPress={async () => {
                            if (isSavingUpright || !receiptImageUri) return;
                            setIsSavingUpright(true);
                            try {
                              const rotated = await rotateImageDataUrl(receiptImageUri, 90, 0.88);
                              await onSaveUprightPhoto(viewItem, rotated);
                            } finally {
                              setIsSavingUpright(false);
                            }
                          }}
                          title="Rotate receipt 90° clockwise and save permanently upright"
                        >
                          <RotateCw size={13} color={isLight ? '#f47721' : '#f47721'} />
                          <Text style={{ fontSize: 11, fontWeight: '600', color: isLight ? '#f47721' : '#f47721' }}>
                            {isSavingUpright ? 'Saving...' : 'Rotate Upright'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.92}
                    onPress={() => {
                      setZoomLevel(1);
                      setRotation(0);
                      setIsImageMaximized(true);
                    }}
                    style={[styles.scannedImageViewerBox, { position: 'relative', cursor: 'zoom-in' }]}
                    title="Click image to open in full screen"
                  >
                    <Image
                      source={{ uri: receiptImageUri }}
                      style={{ width: '100%', height: 380, borderRadius: 8, backgroundColor: isLight ? '#f8fafc' : '#0c1322' }}
                      resizeMode="contain"
                    />
                    <View style={{
                      position: 'absolute',
                      bottom: 12,
                      right: 12,
                      backgroundColor: 'rgba(15, 23, 42, 0.82)',
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: 'rgba(255, 255, 255, 0.15)',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6
                    }}>
                      <Maximize2 size={12} color="#f47721" />
                      <Text style={{ color: '#f8fafc', fontSize: 11, fontWeight: '600' }}>Click to Maximize</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}

              {/* ITEMIZED RECEIPT BREAKDOWN DROPDOWN ACCORDION */}
              {(() => {
                const lineItems = viewItem?.lineItems || viewItem?.previewData?.lineItems || [];
                if (!lineItems || lineItems.length === 0) return null;
                return (
                  <View style={{
                    marginTop: 14,
                    marginBottom: 14,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: isLight ? '#cbd5e1' : '#334155',
                    backgroundColor: isLight ? '#ffffff' : '#252525',
                    overflow: 'hidden'
                  }}>
                    {/* Accordion Header Toggle */}
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => setIsItemsExpanded(prev => !prev)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingVertical: 10,
                        paddingHorizontal: 12,
                        backgroundColor: isLight ? '#f8fafc' : '#1e293b',
                        borderBottomWidth: isItemsExpanded ? 1 : 0,
                        borderBottomColor: isLight ? '#e2e8f0' : '#334155'
                      }}
                      accessibilityRole="button"
                      accessibilityLabel="Toggle listed items breakdown"
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                        <ListFilter size={15} color={isLight ? '#f47721' : '#f47721'} />
                        <Text style={{ fontSize: 12, fontWeight: '700', color: isLight ? '#252525' : '#f8fafc' }} numberOfLines={1}>
                          LISTED ITEMS IN RECEIPT
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
                            {lineItems.length} {lineItems.length === 1 ? 'item' : 'items'}
                          </Text>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Text style={{ fontSize: 11, color: isLight ? '#64748b' : '#94a3b8' }}>
                          {isItemsExpanded ? 'Hide' : 'Show'}
                        </Text>
                        {isItemsExpanded ? (
                          <ChevronUp size={16} color={isLight ? '#64748b' : '#94a3b8'} />
                        ) : (
                          <ChevronDown size={16} color={isLight ? '#64748b' : '#94a3b8'} />
                        )}
                      </View>
                    </TouchableOpacity>

                    {/* Expanded Table */}
                    {isItemsExpanded && (
                      <View style={{ padding: 10 }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: '100%' }}>
                          <View style={{ minWidth: isMobile ? 320 : '100%', width: '100%' }}>
                            {/* Header */}
                            <View style={{
                              flexDirection: 'row',
                              backgroundColor: isLight ? '#f5f3ef' : '#1e293b',
                              paddingVertical: 6,
                              paddingHorizontal: 8,
                              borderRadius: 4,
                              marginBottom: 4
                            }}>
                              <Text style={{ width: 65, fontSize: 10, fontWeight: '700', color: isLight ? '#475569' : '#94a3b8' }}>QTY & UNIT</Text>
                              <Text style={{ flex: 2.2, minWidth: 120, fontSize: 10, fontWeight: '700', color: isLight ? '#475569' : '#94a3b8' }}>ARTICLE / ITEM</Text>
                              <Text style={{ width: 75, fontSize: 10, fontWeight: '700', color: isLight ? '#475569' : '#94a3b8', textAlign: 'right' }}>UNIT PRICE</Text>
                              <Text style={{ width: 85, fontSize: 10, fontWeight: '700', color: isLight ? '#475569' : '#94a3b8', textAlign: 'right' }}>AMOUNT</Text>
                            </View>

                            {/* Rows */}
                            {lineItems.map((item, idx) => (
                              <View
                                key={idx}
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  paddingVertical: 6,
                                  paddingHorizontal: 8,
                                  backgroundColor: idx % 2 === 1 ? (isLight ? '#f8fafc' : 'rgba(30, 41, 59, 0.4)') : 'transparent',
                                  borderBottomWidth: 1,
                                  borderBottomColor: isLight ? '#f5f3ef' : '#1e293b'
                                }}
                              >
                                <Text style={{ width: 65, fontSize: 11, color: isLight ? '#334155' : '#cbd5e1', fontWeight: '600' }}>
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
                              </View>
                            ))}

                            {/* Subtotal / Footer Row */}
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
                              <Text style={{ fontSize: 11, fontWeight: '700', color: isLight ? '#475569' : '#94a3b8' }}>
                                Total ({lineItems.length} items):
                              </Text>
                              <Text style={{ fontSize: 12, fontWeight: '800', color: isLight ? '#059669' : '#34d399' }}>
                                ₱{lineItems.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </Text>
                            </View>
                          </View>
                        </ScrollView>
                      </View>
                    )}
                  </View>
                );
              })()}

              {viewItem?.previewData && (
                <View style={styles.viewerSection}>
                  <View style={styles.previewHeaderRow}>
                    <Text style={styles.viewerSectionTitle}>EMBEDDED DOCUMENT CONTENT PREVIEW</Text>
                    <Text style={styles.previewBadge}>Interactive Preview</Text>
                  </View>

                  <View style={styles.previewTableContainer}>
                    <View style={styles.previewTableRowHeader}>
                      {viewItem.previewData.columns?.map((col, cIdx) => (
                        <Text key={cIdx} style={[styles.previewTh, { flex: cIdx === 0 ? 1.5 : 1 }]}>
                          {col.toUpperCase()}
                        </Text>
                      ))}
                    </View>

                    {viewItem.previewData.rows
                      ?.filter(row => {
                        const label = String(row?.[0] || '').toLowerCase();
                        return !label.includes('target database') && !label.includes('database table');
                      })
                      ?.map((row, rIdx) => (
                        <View key={rIdx} style={[styles.previewTableRow, rIdx % 2 === 1 && styles.previewTableRowAlt]}>
                          {row.map((cell, cIdx) => (
                            <Text key={cIdx} style={[styles.previewTd, { flex: cIdx === 0 ? 1.5 : 1 }]}>
                              {cell}
                            </Text>
                          ))}
                        </View>
                      ))}
                  </View>

                  {viewItem.previewData.summary && (
                    <View style={styles.previewSummaryBox}>
                      <Text style={styles.previewSummaryTitle}>SUMMARY METRICS</Text>
                      <View style={styles.previewSummaryGrid}>
                        {Object.entries(viewItem.previewData.summary)
                          .filter(([key]) => !key.toLowerCase().includes('database') && !key.toLowerCase().includes('table'))
                          .map(([key, val]) => (
                            <View key={key} style={styles.previewSummaryItem}>
                              <Text style={styles.summaryItemKey}>{key}:</Text>
                              <Text style={styles.summaryItemVal}>{val}</Text>
                            </View>
                          ))}
                      </View>
                    </View>
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        </View>

        {/* FULL-SCREEN HIGH-RESOLUTION RECEIPT LIGHTBOX */}
        {isImageMaximized && receiptImageUri && (
          <Modal
            visible={isImageMaximized}
            transparent
            animationType="fade"
            onRequestClose={() => setIsImageMaximized(false)}
          >
            <View style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(2, 6, 23, 0.97)',
              zIndex: 999999,
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Top Controls Bar */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: isMobile ? 12 : 24,
                paddingVertical: 12,
                backgroundColor: 'rgba(15, 23, 42, 0.96)',
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(255, 255, 255, 0.1)',
                gap: 12,
                flexWrap: 'wrap'
              }}>
                <View style={{ flex: 1, minWidth: 180 }}>
                  <Text style={{ color: '#f8fafc', fontSize: isMobile ? 13 : 15, fontWeight: '700' }} numberOfLines={1}>
                    {viewItem?.fileName || 'Scanned Receipt'}
                  </Text>
                  <Text style={{ color: '#94a3b8', fontSize: 11 }}>
                    {viewItem?.establishment || 'Original Capture'} • High Definition Quality
                  </Text>
                </View>

                {/* Toolbar: Zoom Out, Indicator, Zoom In, Rotate, Reset, Download, Close */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  {/* Zoom Out */}
                  <TouchableOpacity
                    onPress={handleZoomOut}
                    style={{
                      padding: 8,
                      borderRadius: 6,
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      borderWidth: 1,
                      borderColor: 'rgba(255, 255, 255, 0.15)',
                      cursor: 'pointer'
                    }}
                    title="Zoom Out (-25%)"
                  >
                    <ZoomOut size={16} color="#f8fafc" />
                  </TouchableOpacity>

                  {/* Zoom Level Indicator */}
                  <View style={{
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 6,
                    backgroundColor: 'rgba(56, 189, 248, 0.12)',
                    borderWidth: 1,
                    borderColor: 'rgba(56, 189, 248, 0.25)',
                    minWidth: 54,
                    alignItems: 'center'
                  }}>
                    <Text style={{ color: '#f47721', fontSize: 12, fontWeight: '700', fontFamily: 'monospace' }}>
                      {Math.round(zoomLevel * 100)}%
                    </Text>
                  </View>

                  {/* Zoom In */}
                  <TouchableOpacity
                    onPress={handleZoomIn}
                    style={{
                      padding: 8,
                      borderRadius: 6,
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      borderWidth: 1,
                      borderColor: 'rgba(255, 255, 255, 0.15)',
                      cursor: 'pointer'
                    }}
                    title="Zoom In (+25%)"
                  >
                    <ZoomIn size={16} color="#f8fafc" />
                  </TouchableOpacity>

                  {/* Rotate 90° */}
                  <TouchableOpacity
                    onPress={handleRotate}
                    style={{
                      padding: 8,
                      borderRadius: 6,
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      borderWidth: 1,
                      borderColor: 'rgba(255, 255, 255, 0.15)',
                      cursor: 'pointer'
                    }}
                    title="Rotate 90 degrees"
                  >
                    <RotateCw size={16} color="#f8fafc" />
                  </TouchableOpacity>

                  {/* Save as Upright in Database */}
                  {rotation !== 0 && onSaveUprightPhoto && (
                    <TouchableOpacity
                      onPress={async () => {
                        if (isSavingUpright || !receiptImageUri) return;
                        setIsSavingUpright(true);
                        try {
                          const rotated = await rotateImageDataUrl(receiptImageUri, rotation, 0.88);
                          await onSaveUprightPhoto(viewItem, rotated);
                          setRotation(0);
                        } finally {
                          setIsSavingUpright(false);
                        }
                      }}
                      disabled={isSavingUpright}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        paddingHorizontal: 10,
                        paddingVertical: 7,
                        borderRadius: 6,
                        backgroundColor: 'rgba(52, 211, 153, 0.2)',
                        borderWidth: 1,
                        borderColor: 'rgba(52, 211, 153, 0.45)',
                        cursor: isSavingUpright ? 'wait' : 'pointer'
                      }}
                      title="Save this orientation permanently to the database so it always stays upright"
                    >
                      <CheckCircle2 size={14} color="#34d399" />
                      <Text style={{ color: '#34d399', fontSize: 11, fontWeight: '700' }}>
                        {isSavingUpright ? 'Saving...' : 'Save as Upright'}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {/* Reset Zoom & Rotation */}
                  <TouchableOpacity
                    onPress={handleResetZoom}
                    style={{
                      padding: 8,
                      borderRadius: 6,
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      borderWidth: 1,
                      borderColor: 'rgba(255, 255, 255, 0.15)',
                      cursor: 'pointer'
                    }}
                    title="Reset to 100%"
                  >
                    <RotateCcw size={16} color="#94a3b8" />
                  </TouchableOpacity>

                  {/* Download Original Photo */}
                  <TouchableOpacity
                    onPress={handleDownloadImage}
                    style={{
                      padding: 8,
                      borderRadius: 6,
                      backgroundColor: 'rgba(52, 211, 153, 0.15)',
                      borderWidth: 1,
                      borderColor: 'rgba(52, 211, 153, 0.3)',
                      cursor: 'pointer'
                    }}
                    title="Download Original Uncompressed Image"
                  >
                    <Download size={16} color="#34d399" />
                  </TouchableOpacity>

                  {/* Close Lightbox */}
                  <TouchableOpacity
                    onPress={() => setIsImageMaximized(false)}
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

              {/* Scrollable & Pannable Viewport */}
              <View style={{
                flex: 1,
                overflow: 'auto',
                alignItems: 'center',
                justifyContent: 'center',
                padding: isMobile ? 12 : 24
              }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '100%',
                    minHeight: '100%',
                    transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.15s ease-out'
                  }}
                >
                  <img
                    src={receiptImageUri}
                    alt={viewItem?.fileName || 'Scanned Receipt'}
                    style={{
                      maxWidth: zoomLevel <= 1 ? (isMobile ? '95vw' : '88vw') : 'none',
                      maxHeight: zoomLevel <= 1 ? (isMobile ? '76vh' : '82vh') : 'none',
                      objectFit: 'contain',
                      borderRadius: 6,
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.08)',
                      imageRendering: 'auto'
                    }}
                  />
                </div>
              </View>

              {/* Bottom Info Bar */}
              <View style={{
                paddingVertical: 10,
                paddingHorizontal: 16,
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                borderTopWidth: 1,
                borderTopColor: 'rgba(255, 255, 255, 0.08)',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 12
              }}>
                <Text style={{ color: '#94a3b8', fontSize: 11, textAlign: 'center' }}>
                  🔎 Use the <Text style={{ color: '#f47721', fontWeight: '700' }}>Zoom In (+)</Text> and <Text style={{ color: '#f47721', fontWeight: '700' }}>Rotate</Text> buttons to inspect serial numbers, line items, and store stamps in crisp original quality.
                </Text>
              </View>
            </View>
          </Modal>
        )}
      </Modal>
  );
}
