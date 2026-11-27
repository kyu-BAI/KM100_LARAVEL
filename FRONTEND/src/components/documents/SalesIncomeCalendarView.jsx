import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Building2,
  TrendingUp,
  DollarSign,
  Check,
  Edit3,
  Trash2,
  FileSpreadsheet
} from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const ENTITIES = ['PETC', 'Knoah Mari', 'Red Goose'];

function formatDateYMD(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getReadableDate(ymd) {
  if (!ymd || !/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return ymd || '';
  const [y, m, d] = ymd.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

export default React.memo(function SalesIncomeCalendarView({
  mode, // 'sales' | 'income'
  filteredItems,
  onSaveDailyEntry,
  onDeleteItem,
  onExportExcel,
  isAdmin,
  isPetcEmployee,
  isKnoahEmployee,
  isRedGooseEmployee,
  isLight,
  activeNav,
  styles
}) {
  const isSales = mode === 'sales';
  const accentColor = isSales ? '#10b981' : '#3b82f6';
  const todayYMD = useMemo(() => formatDateYMD(new Date()), []);

  // Determine default entity from activeNav or employee scope
  const defaultEntity = useMemo(() => {
    const sub = (activeNav?.subCategory || '').toLowerCase();
    if (sub.includes('red') || isRedGooseEmployee) return 'Red Goose';
    if (sub.includes('knoah') || isKnoahEmployee) return 'Knoah Mari';
    if (sub.includes('petc') || isPetcEmployee) return 'PETC';
    return 'PETC';
  }, [activeNav?.subCategory, isPetcEmployee, isKnoahEmployee, isRedGooseEmployee]);

  const [selectedEntity, setSelectedEntity] = useState(defaultEntity);
  const [selectedDate, setSelectedDate] = useState(todayYMD);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarCursor, setCalendarCursor] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [amountInput, setAmountInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [editingItemId, setEditingItemId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSelectedEntity(defaultEntity);
  }, [defaultEntity]);

  // Keep calendar cursor synced when selectedDate changes externally
  useEffect(() => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
      const [y, m] = selectedDate.split('-').map(Number);
      setCalendarCursor({ year: y, month: m - 1 });
    }
  }, [selectedDate]);

  // Map existing entries by `${entity}::${date}` for dot indicators
  const entriesByEntityDate = useMemo(() => {
    const map = new Map();
    for (const item of filteredItems) {
      const d = item.receiptDate || item.scannedDate || '';
      const ent = (item.entity || 'PETC').toLowerCase();
      if (d) {
        map.set(`${ent}::${d}`, item);
      }
    }
    return map;
  }, [filteredItems]);

  // Build calendar grid cells for current month
  const calendarDays = useMemo(() => {
    const { year, month } = calendarCursor;
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const ymd = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ day: d, ymd });
    }
    return cells;
  }, [calendarCursor]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const da = a.receiptDate || a.scannedDate || '';
      const db = b.receiptDate || b.scannedDate || '';
      return db.localeCompare(da);
    });
  }, [filteredItems]);

  const totalRecorded = useMemo(() => {
    return filteredItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  }, [filteredItems]);

  const handleSelectCalendarDate = (ymd) => {
    setSelectedDate(ymd);
    setCalendarOpen(false);
    const existing = entriesByEntityDate.get(`${selectedEntity.toLowerCase()}::${ymd}`);
    if (existing) {
      setEditingItemId(existing.id);
      setAmountInput(existing.amount ? String(existing.amount) : '');
      setNotesInput(existing.notes || existing.description || '');
    } else {
      setEditingItemId(null);
      setAmountInput('');
      setNotesInput('');
    }
  };

  const handleSelectEntity = (entity) => {
    setSelectedEntity(entity);
    const existing = entriesByEntityDate.get(`${entity.toLowerCase()}::${selectedDate}`);
    if (existing) {
      setEditingItemId(existing.id);
      setAmountInput(existing.amount ? String(existing.amount) : '');
      setNotesInput(existing.notes || existing.description || '');
    } else {
      setEditingItemId(null);
      setAmountInput('');
      setNotesInput('');
    }
  };

  const handleEditRow = (item) => {
    const d = item.receiptDate || item.scannedDate || todayYMD;
    setSelectedEntity(item.entity || defaultEntity);
    setSelectedDate(d);
    setEditingItemId(item.id);
    setAmountInput(item.amount ? String(item.amount) : '');
    setNotesInput(item.notes || item.description || '');
    setCalendarOpen(false);
  };

  const handleSubmit = async () => {
    const numericAmount = parseFloat(amountInput);
    if (isNaN(numericAmount) || numericAmount < 0 || amountInput.trim() === '') {
      return;
    }
    setIsSaving(true);
    try {
      await onSaveDailyEntry({
        id: editingItemId,
        mode,
        entity: selectedEntity,
        date: selectedDate,
        amount: numericAmount,
        notes: notesInput.trim()
      });
      setEditingItemId(null);
      setAmountInput('');
      setNotesInput('');
    } finally {
      setIsSaving(false);
    }
  };

  const shiftMonth = (delta) => {
    setCalendarCursor(prev => {
      let m = prev.month + delta;
      let y = prev.year;
      if (m < 0) {
        m = 11;
        y -= 1;
      } else if (m > 11) {
        m = 0;
        y += 1;
      }
      return { year: y, month: m };
    });
  };

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={true}>
      <View style={{ padding: 16, gap: 16 }}>
        {/* Top Summary & Export Row */}
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: 16,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: isLight ? '#cbd5e1' : '#334155',
          backgroundColor: isLight ? '#ffffff' : '#1e293b'
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isSales
                ? (isLight ? '#ecfdf5' : 'rgba(16, 185, 129, 0.15)')
                : (isLight ? '#eff6ff' : 'rgba(59, 130, 246, 0.15)'),
              borderWidth: 1,
              borderColor: isSales
                ? (isLight ? '#a7f3d0' : 'rgba(16, 185, 129, 0.3)')
                : (isLight ? '#bfdbfe' : 'rgba(59, 130, 246, 0.3)')
            }}>
              {isSales ? <TrendingUp size={20} color={accentColor} /> : <DollarSign size={20} color={accentColor} />}
            </View>
            <View>
              <Text style={{ fontSize: 16, fontWeight: '800', color: isLight ? '#0f172a' : '#f8fafc' }}>
                Daily {isSales ? 'Sales' : 'Income'} Entry
              </Text>
              <Text style={{ fontSize: 12.5, color: isLight ? '#64748b' : '#94a3b8' }}>
                Choose a date from the dropdown calendar and record the establishment's daily {isSales ? 'sales' : 'income'}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <View style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 8,
              backgroundColor: isLight ? '#f8fafc' : '#0f172a',
              borderWidth: 1,
              borderColor: isLight ? '#cbd5e1' : '#334155'
            }}>
              <Text style={{ fontSize: 10.5, fontWeight: '700', color: isLight ? '#64748b' : '#94a3b8', letterSpacing: 0.4 }}>
                TOTAL {isSales ? 'SALES' : 'INCOME'} ({filteredItems.length} {filteredItems.length === 1 ? 'DAY' : 'DAYS'})
              </Text>
              <Text style={{ fontSize: 16, fontWeight: '800', color: accentColor }}>
                ₱{totalRecorded.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>

            {onExportExcel && (
              <TouchableOpacity
                onPress={onExportExcel}
                style={[styles.exportExcelBtn, isLight && styles.exportExcelBtnLight]}
              >
                <FileSpreadsheet size={14} color={isLight ? '#059669' : '#34d399'} />
                <Text style={[styles.exportExcelBtnText, isLight && styles.exportExcelBtnTextLight]}>
                  Export Excel
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Daily Input Form Card with Dropdown Calendar */}
        <View style={{
          padding: 18,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: isLight ? '#cbd5e1' : '#334155',
          backgroundColor: isLight ? '#ffffff' : '#1e293b',
          gap: 14,
          zIndex: 20
        }}>
          {/* Step 1: Establishment Selector (hidden when an establishment is already selected in sidebar) */}
          {!activeNav?.subCategory && (
          <View>
            <Text style={[styles.inputLabel, isLight && styles.inputLabelLight]}>
              ESTABLISHMENT / BRANCH *
            </Text>
            <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
              {ENTITIES.map(ent => {
                const isSelected = selectedEntity === ent;
                const isDisabled =
                  (isPetcEmployee && ent !== 'PETC') ||
                  (isKnoahEmployee && ent !== 'Knoah Mari') ||
                  (isRedGooseEmployee && ent !== 'Red Goose');
                return (
                  <TouchableOpacity
                    key={ent}
                    disabled={isDisabled}
                    onPress={() => handleSelectEntity(ent)}
                    style={{
                      flex: 1,
                      minWidth: 120,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 7,
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      borderRadius: 8,
                      borderWidth: 1.5,
                      borderColor: isSelected ? '#f47721' : (isLight ? '#cbd5e1' : '#334155'),
                      backgroundColor: isSelected
                        ? (isLight ? '#fff7ed' : 'rgba(244, 119, 33, 0.15)')
                        : (isLight ? '#f8fafc' : '#0f172a'),
                      opacity: isDisabled ? 0.45 : 1,
                      cursor: isDisabled ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <Building2 size={15} color={isSelected ? '#f47721' : (isLight ? '#64748b' : '#94a3b8')} />
                    <Text style={{
                      fontSize: 13,
                      fontWeight: isSelected ? '700' : '600',
                      color: isSelected ? '#ea580c' : (isLight ? '#1e293b' : '#cbd5e1')
                    }}>
                      {ent}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          )}

          {/* Step 2: Dropdown Calendar + Daily Amount + Remarks */}
          <View style={{ flexDirection: 'row', gap: 14, flexWrap: 'wrap', alignItems: 'flex-start', zIndex: 30 }}>
            {/* Dropdown Calendar Picker */}
            <View style={{ flex: 1.2, minWidth: 260, position: 'relative', zIndex: 40 }}>
              <Text style={[styles.inputLabel, isLight && styles.inputLabelLight]}>
                SELECT DATE (DROPDOWN CALENDAR) *
              </Text>
              <TouchableOpacity
                onPress={() => setCalendarOpen(prev => !prev)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 12,
                  paddingVertical: 11,
                  borderRadius: 8,
                  borderWidth: 1.5,
                  borderColor: calendarOpen ? '#f47721' : (isLight ? '#cbd5e1' : '#334155'),
                  backgroundColor: isLight ? '#f8fafc' : '#0f172a'
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Calendar size={16} color="#f47721" />
                  <Text style={{ fontSize: 13.5, fontWeight: '700', color: isLight ? '#0f172a' : '#f8fafc' }}>
                    {selectedDate}
                  </Text>
                  <Text style={{ fontSize: 12, color: isLight ? '#64748b' : '#94a3b8' }}>
                    ({getReadableDate(selectedDate)})
                  </Text>
                </View>
                <ChevronDown size={16} color={isLight ? '#475569' : '#94a3b8'} />
              </TouchableOpacity>

              {/* Calendar Dropdown Popover */}
              {calendarOpen && (
                <View style={{
                  marginTop: 6,
                  padding: 12,
                  borderRadius: 10,
                  borderWidth: 1.5,
                  borderColor: isLight ? '#cbd5e1' : '#334155',
                  backgroundColor: isLight ? '#ffffff' : '#0f172a',
                  shadowColor: '#000',
                  shadowOpacity: 0.15,
                  shadowRadius: 12,
                  elevation: 8
                }}>
                  {/* Month Navigation Header */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <TouchableOpacity
                      onPress={() => shiftMonth(-1)}
                      style={{
                        padding: 6,
                        borderRadius: 6,
                        backgroundColor: isLight ? '#f1f5f9' : '#1e293b'
                      }}
                    >
                      <ChevronLeft size={16} color={isLight ? '#334155' : '#cbd5e1'} />
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={{ fontSize: 13.5, fontWeight: '800', color: isLight ? '#0f172a' : '#f8fafc' }}>
                        {MONTH_NAMES[calendarCursor.month]} {calendarCursor.year}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleSelectCalendarDate(todayYMD)}
                        style={{
                          paddingHorizontal: 8,
                          paddingVertical: 3,
                          borderRadius: 999,
                          backgroundColor: isLight ? '#fff7ed' : 'rgba(244, 119, 33, 0.2)',
                          borderWidth: 1,
                          borderColor: '#f47721'
                        }}
                      >
                        <Text style={{ fontSize: 10.5, fontWeight: '700', color: '#f47721' }}>Today</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      onPress={() => shiftMonth(1)}
                      style={{
                        padding: 6,
                        borderRadius: 6,
                        backgroundColor: isLight ? '#f1f5f9' : '#1e293b'
                      }}
                    >
                      <ChevronRight size={16} color={isLight ? '#334155' : '#cbd5e1'} />
                    </TouchableOpacity>
                  </View>

                  {/* Weekday Headers */}
                  <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                    {WEEKDAYS.map(wd => (
                      <Text
                        key={wd}
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          fontSize: 11,
                          fontWeight: '700',
                          color: isLight ? '#64748b' : '#94a3b8'
                        }}
                      >
                        {wd}
                      </Text>
                    ))}
                  </View>

                  {/* Calendar Grid */}
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {calendarDays.map((cell, idx) => {
                      if (!cell) {
                        return <View key={`empty-${idx}`} style={{ width: '14.285%', height: 34 }} />;
                      }
                      const isSel = cell.ymd === selectedDate;
                      const isToday = cell.ymd === todayYMD;
                      const hasEntry = entriesByEntityDate.has(`${selectedEntity.toLowerCase()}::${cell.ymd}`);
                      return (
                        <TouchableOpacity
                          key={cell.ymd}
                          onPress={() => handleSelectCalendarDate(cell.ymd)}
                          style={{
                            width: '14.285%',
                            height: 34,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 6,
                            backgroundColor: isSel
                              ? '#f47721'
                              : isToday
                                ? (isLight ? '#fff7ed' : 'rgba(244, 119, 33, 0.15)')
                                : 'transparent',
                            borderWidth: isToday && !isSel ? 1 : 0,
                            borderColor: '#f47721'
                          }}
                        >
                          <Text style={{
                            fontSize: 12.5,
                            fontWeight: isSel || isToday ? '800' : '500',
                            color: isSel ? '#ffffff' : (isLight ? '#1e293b' : '#e2e8f0')
                          }}>
                            {cell.day}
                          </Text>
                          {hasEntry && (
                            <View style={{
                              width: 4,
                              height: 4,
                              borderRadius: 2,
                              backgroundColor: isSel ? '#ffffff' : accentColor,
                              marginTop: 1
                            }} />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>

            {/* Daily Amount Input */}
            <View style={{ flex: 1, minWidth: 200 }}>
              <Text style={[styles.inputLabel, isLight && styles.inputLabelLight]}>
                DAILY {isSales ? 'SALES' : 'INCOME'} AMOUNT (PHP) *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  isLight && styles.inputLight,
                  { fontSize: 15, fontWeight: '700' }
                ]}
                placeholder="0.00"
                placeholderTextColor={isLight ? '#94a3b8' : '#64748b'}
                keyboardType="numeric"
                value={amountInput}
                onChangeText={setAmountInput}
              />
              {amountInput.trim() !== '' && (isNaN(parseFloat(amountInput)) || parseFloat(amountInput) < 0) && (
                <Text style={{ fontSize: 11.5, color: '#ef4444', marginTop: 4, fontWeight: '600' }}>
                  Please enter a valid non-negative amount.
                </Text>
              )}
            </View>

            {/* Notes / Remarks Input */}
            <View style={{ flex: 1.2, minWidth: 220 }}>
              <Text style={[styles.inputLabel, isLight && styles.inputLabelLight]}>
                NOTES / REMARKS (OPTIONAL)
              </Text>
              <TextInput
                style={[styles.input, isLight && styles.inputLight]}
                placeholder={isSales ? 'e.g. POS + Cash register total' : 'e.g. Daily bank remittance / collection'}
                placeholderTextColor={isLight ? '#94a3b8' : '#64748b'}
                value={notesInput}
                onChangeText={setNotesInput}
              />
            </View>
          </View>

          {/* Action Row */}
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 10 }}>
            {editingItemId && (
              <TouchableOpacity
                onPress={() => {
                  setEditingItemId(null);
                  setAmountInput('');
                  setNotesInput('');
                }}
                style={styles.btnSecondary}
              >
                <Text style={styles.btnSecondaryText}>Cancel Edit</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSaving || amountInput.trim() === '' || isNaN(parseFloat(amountInput))}
              style={[
                styles.btnPrimary,
                (isSaving || amountInput.trim() === '' || isNaN(parseFloat(amountInput))) && { opacity: 0.55 }
              ]}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Check size={16} color="#fff" />
                  <Text style={styles.btnPrimaryText}>
                    {editingItemId
                      ? `Update Daily ${isSales ? 'Sales' : 'Income'}`
                      : `Save Daily ${isSales ? 'Sales' : 'Income'}`}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Recorded Daily Entries Table */}
        <View style={{
          borderRadius: 12,
          borderWidth: 1,
          borderColor: isLight ? '#cbd5e1' : '#334155',
          backgroundColor: isLight ? '#ffffff' : '#1e293b',
          overflow: 'hidden'
        }}>
          <View style={[styles.tableRowHeader, isLight && styles.tableRowHeaderLight]}>
            <Text style={[styles.th, { width: 45, textAlign: 'center' }, isLight && styles.thLight]}>#</Text>
            <Text style={[styles.th, { width: 140 }, isLight && styles.thLight]}>DATE</Text>
            <Text style={[styles.th, { flex: 1, minWidth: 120 }, isLight && styles.thLight]}>ESTABLISHMENT</Text>
            <Text style={[styles.th, { flex: 2, minWidth: 200 }, isLight && styles.thLight]}>REMARKS / DESCRIPTION</Text>
            <Text style={[styles.th, { width: 150, textAlign: 'right', paddingRight: 16 }, isLight && styles.thLight]}>
              DAILY {isSales ? 'SALES' : 'INCOME'} (PHP)
            </Text>
            <Text style={[styles.th, { width: 100, textAlign: 'center' }, isLight && styles.thLight]}>ACTIONS</Text>
          </View>

          {sortedItems.length === 0 ? (
            <View style={{ padding: 28, alignItems: 'center' }}>
              <Text style={{ fontSize: 13.5, fontWeight: '600', color: isLight ? '#64748b' : '#94a3b8' }}>
                No daily {isSales ? 'sales' : 'income'} entries recorded yet. Choose a date above to add one.
              </Text>
            </View>
          ) : (
            sortedItems.map((item, idx) => (
              <View
                key={item.id}
                style={[
                  styles.tableRow,
                  isLight && styles.tableRowLight,
                  idx % 2 === 1 && (isLight ? styles.tableRowAltLight : styles.tableRowAlt)
                ]}
              >
                <Text style={[styles.td, { width: 45, textAlign: 'center', color: '#64748b' }]}>{idx + 1}</Text>
                <Text style={[styles.td, { width: 140, fontWeight: '700', color: isLight ? '#0f172a' : '#f8fafc' }]}>
                  {item.receiptDate || item.scannedDate || '-'}
                </Text>
                <Text style={[styles.td, { flex: 1, minWidth: 120 }, isLight && styles.tdLight]} numberOfLines={1}>
                  {item.entity || '-'}
                </Text>
                <Text style={[styles.td, { flex: 2, minWidth: 200 }, isLight && styles.tdLight]} numberOfLines={1}>
                  {item.notes || item.description || item.title || '-'}
                </Text>
                <Text style={[styles.td, { width: 150, textAlign: 'right', paddingRight: 16, fontWeight: '800', color: accentColor }]}>
                  ₱{(parseFloat(item.amount) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
                <View style={[styles.td, { width: 100, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }]}>
                  <TouchableOpacity
                    style={[styles.btnActionIcon, isLight && styles.btnActionIconLight, { minWidth: 32, minHeight: 32, alignItems: 'center', justifyContent: 'center' }]}
                    onPress={() => handleEditRow(item)}
                    title="Edit daily entry"
                  >
                    <Edit3 size={15} color="#f47721" />
                  </TouchableOpacity>
                  {isAdmin && (
                    <TouchableOpacity
                      style={[styles.btnActionIcon, isLight && styles.btnActionIconLight, { minWidth: 32, minHeight: 32, alignItems: 'center', justifyContent: 'center' }]}
                      onPress={() => onDeleteItem(item.id, item.fileName || item.title)}
                      title="Delete entry"
                    >
                      <Trash2 size={15} color="#ef4444" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
});
