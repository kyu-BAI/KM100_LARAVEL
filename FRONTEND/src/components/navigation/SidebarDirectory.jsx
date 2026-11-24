import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Layers,
  FileSpreadsheet,
  Eye,
  EyeOff,
  PlusCircle,
  Folder,
  Calendar,
  Package,
  FileCheck,
  ShieldCheck,
  X
} from 'lucide-react';
import { SHORT_MONTHS as months } from '../../constants/calendar';

export default function SidebarDirectory({
  sidebarOpen,
  setSidebarOpen,
  isDrawerMode,
  activeNav,
  setActiveNav,
  items,
  filteredItems,
  showAllFiles,
  handleToggleShowAll,
  openAddModal,
  exportFolderToExcel,
  expandedNodes,
  toggleNode,
  currentUser,
  isAdmin,
  isEmployee,
  isKnoahEmployee,
  isRedGooseEmployee,
  isPetcEmployee,
  isConsumablesEmployee,
  isSalesIncomeEmployee,
  isLight,
  styles
}) {
  const userDept = (currentUser?.department || currentUser?.assignedBranch || '').toLowerCase();
  const hasAllBranchesScope = userDept.includes('all');
  return (
    <>
      {/* Backdrop for Drawer on Mobile & Tablet */}
        {isDrawerMode && sidebarOpen && (
          <TouchableOpacity
            style={styles.mobileDrawerBackdrop}
            activeOpacity={1}
            onPress={() => setSidebarOpen(false)}
          />
        )}

        {/* LEFT SIDEBAR (Desktop docked / Drawer on Tablet & Mobile) */}
        {sidebarOpen && (
          <View style={[
            styles.sidebar,
            isDrawerMode && styles.mobileSidebarDrawer,
            isLight && styles.sidebarLight,
            isDrawerMode && isLight && styles.mobileSidebarDrawerLight
          ]}>
            {/* Top Company Branding Banner in Sidebar */}
  
            <View style={[styles.sidebarTitleRow, isLight && styles.sidebarTitleRowLight]}>
              <Text style={[styles.sidebarSectionTitle, isLight && styles.sidebarSectionTitleLight]}>DOCUMENT DIRECTORY</Text>
            </View>

            {/* Branch Scope Banner for Employees */}
            {isEmployee && (
              <View style={{
                backgroundColor: isLight ? '#fef3eb' : 'rgba(244, 119, 33, 0.12)',
                borderWidth: 1,
                borderColor: isLight ? '#fcd3b4' : 'rgba(244, 119, 33, 0.35)',
                borderRadius: 8,
                padding: 10,
                marginHorizontal: 12,
                marginTop: 6,
                marginBottom: 10,
                gap: 3
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Building2 size={14} color="#f47721" />
                  <Text style={{ fontSize: 11, fontWeight: '800', color: isLight ? '#f47721' : '#ff9345' }}>
                    BRANCH: {(currentUser.department)}
                  </Text>
                </View>
                <Text style={{ fontSize: 10, color: isLight ? '#666666' : '#d8d4cb' }}>
                  Restricted to your assigned branch records.
                </Text>
              </View>
            )}

            <View style={{ display: 'none' }}>
              {!isDrawerMode && (
                <TouchableOpacity
                  onPress={() => setSidebarOpen(false)}
                  style={[styles.sidebarCollapseBtn, isLight && styles.sidebarCollapseBtnLight]}
                  title="Hide sidebar"
                >
                  <ChevronLeft size={16} color={isLight ? '#475569' : '#94a3b8'} />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView style={styles.treeScroll} showsVerticalScrollIndicator={false}>
              {/* 1. All Files Node with Toggle Switch */}
              <View
                style={[
                  styles.treeItem,
                  activeNav.type === 'all' && (isLight ? styles.treeItemActiveLight : styles.treeItemActive),
                  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
                ]}
              >
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, minWidth: 0, paddingVertical: 4 }}
                  onPress={() => setActiveNav({
                    type: 'all',
                    year: null,
                    month: null,
                    subCategory: null,
                    label: 'All Inventory Files'
                  })}
                >
                  <Layers size={17} color={activeNav.type === 'all' ? (isLight ? '#f47721' : '#ff9345') : (isLight ? '#666666' : '#94a3b8')} />
                  <Text style={[styles.treeText, isLight && styles.treeTextLight, activeNav.type === 'all' && (isLight ? styles.treeTextActiveLight : styles.treeTextActive)]} numberOfLines={1}>
                    All Inventory Files ({isEmployee ? filteredItems.length : items.length})
                  </Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  {/* Export All Records to Excel */}
                  <TouchableOpacity
                    style={styles.treeFolderExportBtn}
                    onPress={() => exportFolderToExcel({
                      type: 'all',
                      year: null,
                      month: null,
                      subCategory: null,
                      label: 'All Inventory Files'
                    })}
                    title="Export All Records to Excel (.xlsx)"
                    accessibilityRole="button"
                    accessibilityLabel="Export all records to Excel spreadsheet"
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <FileSpreadsheet size={12} color={isLight ? '#059669' : '#34d399'} />
                  </TouchableOpacity>

                  {/* Interactive Toggle Switch Button */}
                  <TouchableOpacity
                    style={[styles.sidebarToggleSwitch, showAllFiles && styles.sidebarToggleSwitchActive]}
                    onPress={handleToggleShowAll}
                    accessibilityRole="button"
                    accessibilityLabel={showAllFiles ? "Click to hide all files" : "Click to display all files"}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <View style={[styles.sidebarToggleThumb, showAllFiles && styles.sidebarToggleThumbActive]} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Actions in Sidebar */}
              <TouchableOpacity
                style={styles.treeItem}
                onPress={openAddModal}
              >
                <PlusCircle size={17} color="#34d399" />
                <Text style={styles.treeText}>Add Document</Text>
              </TouchableOpacity>

              <View style={styles.separator} />

              {/* 2. PETC SALES */}
              {(isAdmin || isPetcEmployee || isSalesIncomeEmployee || hasAllBranchesScope) && (
              <View style={styles.categoryBlock}>
                <View
                  style={[
                    styles.treeItem,
                    activeNav.type === 'petc-sales' && !activeNav.year && styles.treeItemActive,
                    { justifyContent: 'space-between' }
                  ]}
                >
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}
                    onPress={() => {
                      setActiveNav({
                        type: 'petc-sales',
                        year: null,
                        month: null,
                        subCategory: null,
                        label: 'PETC Sales'
                      });
                    }}
                  >
                    <TouchableOpacity onPress={() => toggleNode('petc-sales')} style={styles.iconToggle}>
                      {expandedNodes['petc-sales'] ? <ChevronDown size={15} color="#94a3b8" /> : <ChevronRight size={15} color="#94a3b8" />}
                    </TouchableOpacity>
                    <Folder size={17} color="#34d399" />
                    <Text style={[styles.treeCategoryTitle, activeNav.type === 'petc-sales' && styles.treeTextActive]} numberOfLines={1}>
                      PETC SALES
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.treeFolderExportBtn}
                    onPress={() => exportFolderToExcel({
                      type: 'petc-sales',
                      year: null,
                      month: null,
                      subCategory: null,
                      label: 'PETC Sales'
                    })}
                    title="Export PETC Sales to Excel (.xlsx)"
                  >
                    <FileSpreadsheet size={12} color={isLight ? '#059669' : '#34d399'} />
                  </TouchableOpacity>
                </View>

                {expandedNodes['petc-sales'] && (
                  <View style={styles.treeChildren}>
                    {/* 2026 */}
                    <TouchableOpacity
                      style={[styles.treeSubItem, activeNav.type === 'petc-sales' && activeNav.year === '2026' && !activeNav.month && styles.treeItemActive]}
                      onPress={() => {
                        setActiveNav({
                          type: 'petc-sales',
                          year: '2026',
                          month: null,
                          subCategory: null,
                          label: 'PETC Sales > 2026'
                        });
                      }}
                    >
                      <TouchableOpacity onPress={() => toggleNode('petc-sales-2026')} style={styles.iconToggle}>
                        {expandedNodes['petc-sales-2026'] ? <ChevronDown size={13} color="#64748b" /> : <ChevronRight size={13} color="#64748b" />}
                      </TouchableOpacity>
                      <Calendar size={14} color="#f47721" />
                      <Text style={[styles.treeSubText, activeNav.type === 'petc-sales' && activeNav.year === '2026' && styles.treeTextActive]} numberOfLines={1}>
                        2026
                      </Text>
                    </TouchableOpacity>

                    {expandedNodes['petc-sales-2026'] && (
                      <View style={styles.monthPillRow}>
                        {months.map(m => (
                          <TouchableOpacity
                            key={`sales-26-${m}`}
                            style={[styles.monthMiniPill, activeNav.type === 'petc-sales' && activeNav.year === '2026' && activeNav.month === m && styles.monthMiniPillActive]}
                            onPress={() => {
                              setActiveNav({
                                type: 'petc-sales',
                                year: '2026',
                                month: m,
                                subCategory: null,
                                label: `PETC Sales > 2026 > ${m}`
                              });
                            }}
                          >
                            <Text style={[styles.monthMiniPillText, activeNav.type === 'petc-sales' && activeNav.year === '2026' && activeNav.month === m && styles.monthMiniPillTextActive]}>
                              {m}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}

                    {/* 2027 */}
                    <TouchableOpacity
                      style={[styles.treeSubItem, activeNav.type === 'petc-sales' && activeNav.year === '2027' && !activeNav.month && styles.treeItemActive]}
                      onPress={() => {
                        setActiveNav({
                          type: 'petc-sales',
                          year: '2027',
                          month: null,
                          subCategory: null,
                          label: 'PETC Sales > 2027'
                        });
                      }}
                    >
                      <TouchableOpacity onPress={() => toggleNode('petc-sales-2027')} style={styles.iconToggle}>
                        {expandedNodes['petc-sales-2027'] ? <ChevronDown size={13} color="#64748b" /> : <ChevronRight size={13} color="#64748b" />}
                      </TouchableOpacity>
                      <Calendar size={14} color="#f47721" />
                      <Text style={[styles.treeSubText, activeNav.type === 'petc-sales' && activeNav.year === '2027' && styles.treeTextActive]} numberOfLines={1}>
                        2027
                      </Text>
                    </TouchableOpacity>

                    {expandedNodes['petc-sales-2027'] && (
                      <View style={styles.monthPillRow}>
                        {months.map(m => (
                          <TouchableOpacity
                            key={`sales-27-${m}`}
                            style={[styles.monthMiniPill, activeNav.type === 'petc-sales' && activeNav.year === '2027' && activeNav.month === m && styles.monthMiniPillActive]}
                            onPress={() => {
                              setActiveNav({
                                type: 'petc-sales',
                                year: '2027',
                                month: m,
                                subCategory: null,
                                label: `PETC Sales > 2027 > ${m}`
                              });
                            }}
                          >
                            <Text style={[styles.monthMiniPillText, activeNav.type === 'petc-sales' && activeNav.year === '2027' && activeNav.month === m && styles.monthMiniPillTextActive]}>
                              {m}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                )}
              </View>

                            )}

              {/* 3. PETC INCOME */}
              {(isAdmin || isPetcEmployee || isSalesIncomeEmployee || hasAllBranchesScope) && (
              <View style={styles.categoryBlock}>
                <View
                  style={[
                    styles.treeItem,
                    activeNav.type === 'petc-income' && !activeNav.year && styles.treeItemActive,
                    { justifyContent: 'space-between' }
                  ]}
                >
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}
                    onPress={() => {
                      setActiveNav({
                        type: 'petc-income',
                        year: null,
                        month: null,
                        subCategory: null,
                        label: 'PETC Income'
                      });
                    }}
                  >
                    <TouchableOpacity onPress={() => toggleNode('petc-income')} style={styles.iconToggle}>
                      {expandedNodes['petc-income'] ? <ChevronDown size={15} color="#94a3b8" /> : <ChevronRight size={15} color="#94a3b8" />}
                    </TouchableOpacity>
                    <Folder size={17} color="#60a5fa" />
                    <Text style={[styles.treeCategoryTitle, activeNav.type === 'petc-income' && styles.treeTextActive]} numberOfLines={1}>
                      PETC INCOME
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.treeFolderExportBtn}
                    onPress={() => exportFolderToExcel({
                      type: 'petc-income',
                      year: null,
                      month: null,
                      subCategory: null,
                      label: 'PETC Income'
                    })}
                    title="Export PETC Income to Excel (.xlsx)"
                  >
                    <FileSpreadsheet size={12} color={isLight ? '#059669' : '#34d399'} />
                  </TouchableOpacity>
                </View>

                {expandedNodes['petc-income'] && (
                  <View style={styles.treeChildren}>
                    {/* 2026 */}
                    <TouchableOpacity
                      style={[styles.treeSubItem, activeNav.type === 'petc-income' && activeNav.year === '2026' && !activeNav.month && styles.treeItemActive]}
                      onPress={() => {
                        setActiveNav({
                          type: 'petc-income',
                          year: '2026',
                          month: null,
                          subCategory: null,
                          label: 'PETC Income > 2026'
                        });
                      }}
                    >
                      <TouchableOpacity onPress={() => toggleNode('petc-income-2026')} style={styles.iconToggle}>
                        {expandedNodes['petc-income-2026'] ? <ChevronDown size={13} color="#64748b" /> : <ChevronRight size={13} color="#64748b" />}
                      </TouchableOpacity>
                      <Calendar size={14} color="#60a5fa" />
                      <Text style={[styles.treeSubText, activeNav.type === 'petc-income' && activeNav.year === '2026' && styles.treeTextActive]} numberOfLines={1}>
                        2026
                      </Text>
                    </TouchableOpacity>

                    {expandedNodes['petc-income-2026'] && (
                      <View style={styles.monthPillRow}>
                        {months.map(m => (
                          <TouchableOpacity
                            key={`inc-26-${m}`}
                            style={[styles.monthMiniPill, activeNav.type === 'petc-income' && activeNav.year === '2026' && activeNav.month === m && styles.monthMiniPillActive]}
                            onPress={() => {
                              setActiveNav({
                                type: 'petc-income',
                                year: '2026',
                                month: m,
                                subCategory: null,
                                label: `PETC Income > 2026 > ${m}`
                              });
                            }}
                          >
                            <Text style={[styles.monthMiniPillText, activeNav.type === 'petc-income' && activeNav.year === '2026' && activeNav.month === m && styles.monthMiniPillTextActive]}>
                              {m}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}

                    {/* 2027 */}
                    <TouchableOpacity
                      style={[styles.treeSubItem, activeNav.type === 'petc-income' && activeNav.year === '2027' && !activeNav.month && styles.treeItemActive]}
                      onPress={() => {
                        setActiveNav({
                          type: 'petc-income',
                          year: '2027',
                          month: null,
                          subCategory: null,
                          label: 'PETC Income > 2027'
                        });
                      }}
                    >
                      <TouchableOpacity onPress={() => toggleNode('petc-income-2027')} style={styles.iconToggle}>
                        {expandedNodes['petc-income-2027'] ? <ChevronDown size={13} color="#64748b" /> : <ChevronRight size={13} color="#64748b" />}
                      </TouchableOpacity>
                      <Calendar size={14} color="#60a5fa" />
                      <Text style={[styles.treeSubText, activeNav.type === 'petc-income' && activeNav.year === '2027' && styles.treeTextActive]} numberOfLines={1}>
                        2027
                      </Text>
                    </TouchableOpacity>

                    {expandedNodes['petc-income-2027'] && (
                      <View style={styles.monthPillRow}>
                        {months.map(m => (
                          <TouchableOpacity
                            key={`inc-27-${m}`}
                            style={[styles.monthMiniPill, activeNav.type === 'petc-income' && activeNav.year === '2027' && activeNav.month === m && styles.monthMiniPillActive]}
                            onPress={() => {
                              setActiveNav({
                                type: 'petc-income',
                                year: '2027',
                                month: m,
                                subCategory: null,
                                label: `PETC Income > 2027 > ${m}`
                              });
                            }}
                          >
                            <Text style={[styles.monthMiniPillText, activeNav.type === 'petc-income' && activeNav.year === '2027' && activeNav.month === m && styles.monthMiniPillTextActive]}>
                              {m}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                )}
              </View>

                            )}

              {/* 4. EXPENSES */}
              <View style={styles.categoryBlock}>
                <View
                  style={[
                    styles.treeItem,
                    activeNav.type === 'expenses' && !activeNav.subCategory && styles.treeItemActive,
                    { justifyContent: 'space-between' }
                  ]}
                >
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}
                    onPress={() => {
                      setActiveNav({
                        type: 'expenses',
                        year: null,
                        month: null,
                        subCategory: null,
                        label: 'Expenses'
                      });
                    }}
                  >
                    <TouchableOpacity onPress={() => toggleNode('expenses')} style={styles.iconToggle}>
                      {expandedNodes['expenses'] ? <ChevronDown size={15} color="#94a3b8" /> : <ChevronRight size={15} color="#94a3b8" />}
                    </TouchableOpacity>
                    <Folder size={17} color="#f87171" />
                    <Text style={[styles.treeCategoryTitle, activeNav.type === 'expenses' && styles.treeTextActive]} numberOfLines={1}>
                      EXPENSES
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.treeFolderExportBtn}
                    onPress={() => exportFolderToExcel({
                      type: 'expenses',
                      year: null,
                      month: null,
                      subCategory: null,
                      label: 'Expenses'
                    })}
                    title="Export Expenses to Excel (.xlsx)"
                  >
                    <FileSpreadsheet size={12} color={isLight ? '#059669' : '#34d399'} />
                  </TouchableOpacity>
                </View>

                {expandedNodes['expenses'] && (
                  <View style={styles.treeChildren}>
                    {[
                      { id: 'expenses-2026-petc', label: 'Expenses 2026 (PETC)' },
                      { id: 'red-goose-2026', label: 'Red Goose Expenses 2026' },
                      { id: 'knoah-mari-2026', label: 'Knoah Mari Expenses 2026' },
                    ]
                    .filter(branch => {
                      if (isAdmin || hasAllBranchesScope) return true;
                      if (isKnoahEmployee) return branch.id === 'knoah-mari-2026';
                      if (isRedGooseEmployee) return branch.id === 'red-goose-2026';
                      if (isPetcEmployee) return branch.id === 'expenses-2026-petc';
                      return false;
                    })
                    .map(branch => (
                      <TouchableOpacity
                        key={branch.id}
                        style={[styles.treeSubItem, activeNav.subCategory === branch.id && styles.treeItemActive]}
                        onPress={() => {
                          setActiveNav({
                            type: 'expenses',
                            year: null,
                            month: null,
                            subCategory: branch.id,
                            label: `Expenses > ${branch.label}`
                          });
                        }}
                      >
                        <ChevronRight size={12} color="#94a3b8" />
                        <Text style={[styles.treeSubText, activeNav.subCategory === branch.id && styles.treeTextActive]} numberOfLines={1}>
                          {branch.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* 5. CONSUMABLES */}
              {(isAdmin || isConsumablesEmployee || hasAllBranchesScope) && (
              <View style={styles.categoryBlock}>
                <View
                  style={[
                    styles.treeItem,
                    activeNav.type === 'consumables' && !activeNav.subCategory && styles.treeItemActive,
                    { justifyContent: 'space-between' }
                  ]}
                >
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}
                    onPress={() => {
                      setActiveNav({
                        type: 'consumables',
                        year: null,
                        month: null,
                        subCategory: null,
                        label: 'Consumables'
                      });
                    }}
                  >
                    <TouchableOpacity onPress={() => toggleNode('consumables')} style={styles.iconToggle}>
                      {expandedNodes['consumables'] ? <ChevronDown size={15} color="#94a3b8" /> : <ChevronRight size={15} color="#94a3b8" />}
                    </TouchableOpacity>
                    <Package size={17} color="#fbbf24" />
                    <Text style={[styles.treeCategoryTitle, activeNav.type === 'consumables' && styles.treeTextActive]} numberOfLines={1}>
                      CONSUMABLES
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.treeFolderExportBtn}
                    onPress={() => exportFolderToExcel({
                      type: 'consumables',
                      year: null,
                      month: null,
                      subCategory: null,
                      label: 'Consumables'
                    })}
                    title="Export Consumables to Excel (.xlsx)"
                  >
                    <FileSpreadsheet size={12} color={isLight ? '#059669' : '#34d399'} />
                  </TouchableOpacity>
                </View>

                {expandedNodes['consumables'] && (
                  <View style={styles.treeChildren}>
                    {[
                      { id: 'office-supply', label: 'Office supply' },
                      { id: 'cleaning-supply', label: 'Cleaning supply' },
                      { id: 'red-goose-consumables', label: 'Red Goose' },
                      { id: 'knoah-mari-consumables', label: 'Knoah Mari' }
                    ].map(branch => (
                      <TouchableOpacity
                        key={branch.id}
                        style={[styles.treeSubItem, activeNav.subCategory === branch.id && styles.treeItemActive]}
                        onPress={() => {
                          setActiveNav({
                            type: 'consumables',
                            year: null,
                            month: null,
                            subCategory: branch.id,
                            label: `Consumables > ${branch.label}`
                          });
                        }}
                      >
                        <ChevronRight size={12} color="#94a3b8" />
                        <Text style={[styles.treeSubText, activeNav.subCategory === branch.id && styles.treeTextActive]} numberOfLines={1}>
                          {branch.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
              )}

              {/* 6. VOUCHERS */}
              {isAdmin && (
              <View style={styles.categoryBlock}>
                <View
                  style={[
                    styles.treeItem,
                    activeNav.type === 'vouchers' && !activeNav.subCategory && styles.treeItemActive,
                    { justifyContent: 'space-between' }
                  ]}
                >
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}
                    onPress={() => {
                      setActiveNav({
                        type: 'vouchers',
                        year: null,
                        month: null,
                        subCategory: null,
                        label: 'Vouchers'
                      });
                    }}
                  >
                    <TouchableOpacity onPress={() => toggleNode('vouchers')} style={styles.iconToggle}>
                      {expandedNodes['vouchers'] ? <ChevronDown size={15} color="#94a3b8" /> : <ChevronRight size={15} color="#94a3b8" />}
                    </TouchableOpacity>
                    <FileCheck size={17} color="#a78bfa" />
                    <Text style={[styles.treeCategoryTitle, activeNav.type === 'vouchers' && styles.treeTextActive]} numberOfLines={1}>
                      VOUCHERS
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.treeFolderExportBtn}
                    onPress={() => exportFolderToExcel({
                      type: 'vouchers',
                      year: null,
                      month: null,
                      subCategory: null,
                      label: 'Vouchers'
                    })}
                    title="Export Vouchers to Excel (.xlsx)"
                  >
                    <FileSpreadsheet size={12} color={isLight ? '#059669' : '#34d399'} />
                  </TouchableOpacity>
                </View>

                {expandedNodes['vouchers'] && (
                  <View style={styles.treeChildren}>
                    {[
                      { id: 'vouchers-petc', label: 'PETC' },
                      { id: 'vouchers-stc', label: 'STC' },
                      { id: 'vouchers-knoah-mari', label: 'Knoah Mari' },
                      { id: 'vouchers-red-goose', label: 'Red Goose' }
                    ].map(branch => (
                      <TouchableOpacity
                        key={branch.id}
                        style={[styles.treeSubItem, activeNav.subCategory === branch.id && styles.treeItemActive]}
                        onPress={() => {
                          setActiveNav({
                            type: 'vouchers',
                            year: null,
                            month: null,
                            subCategory: branch.id,
                            label: `Vouchers > ${branch.label}`
                          });
                        }}
                      >
                        <ChevronRight size={12} color="#94a3b8" />
                        <Text style={[styles.treeSubText, activeNav.subCategory === branch.id && styles.treeTextActive]} numberOfLines={1}>
                          {branch.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              )}

              {/* 7. PETC INSURANCE */}
              {(isAdmin || isPetcEmployee || hasAllBranchesScope) && (
              <View style={styles.categoryBlock}>
                <View
                  style={[
                    styles.treeItem,
                    activeNav.type === 'petc-insurance' && !activeNav.year && styles.treeItemActive,
                    { justifyContent: 'space-between' }
                  ]}
                >
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}
                    onPress={() => {
                      setActiveNav({
                        type: 'petc-insurance',
                        year: null,
                        month: null,
                        subCategory: null,
                        label: 'PETC Insurance'
                      });
                    }}
                  >
                    <TouchableOpacity onPress={() => toggleNode('petc-insurance')} style={styles.iconToggle}>
                      {expandedNodes['petc-insurance'] ? <ChevronDown size={15} color="#94a3b8" /> : <ChevronRight size={15} color="#94a3b8" />}
                    </TouchableOpacity>
                    <ShieldCheck size={17} color="#2dd4bf" />
                    <Text style={[styles.treeCategoryTitle, activeNav.type === 'petc-insurance' && styles.treeTextActive]} numberOfLines={1}>
                      PETC INSURANCE
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.treeFolderExportBtn}
                    onPress={() => exportFolderToExcel({
                      type: 'petc-insurance',
                      year: null,
                      month: null,
                      subCategory: null,
                      label: 'PETC Insurance'
                    })}
                    title="Export PETC Insurance to Excel (.xlsx)"
                  >
                    <FileSpreadsheet size={12} color={isLight ? '#059669' : '#34d399'} />
                  </TouchableOpacity>
                </View>

                {expandedNodes['petc-insurance'] && (
                  <View style={styles.treeChildren}>
                    {/* 2026 */}
                    <TouchableOpacity
                      style={[styles.treeSubItem, activeNav.type === 'petc-insurance' && activeNav.year === '2026' && !activeNav.month && styles.treeItemActive]}
                      onPress={() => {
                        setActiveNav({
                          type: 'petc-insurance',
                          year: '2026',
                          month: null,
                          subCategory: null,
                          label: 'PETC Insurance > 2026'
                        });
                      }}
                    >
                      <TouchableOpacity onPress={() => toggleNode('petc-insurance-2026')} style={styles.iconToggle}>
                        {expandedNodes['petc-insurance-2026'] ? <ChevronDown size={13} color="#64748b" /> : <ChevronRight size={13} color="#64748b" />}
                      </TouchableOpacity>
                      <Calendar size={14} color="#2dd4bf" />
                      <Text style={[styles.treeSubText, activeNav.type === 'petc-insurance' && activeNav.year === '2026' && styles.treeTextActive]} numberOfLines={1}>
                        2026
                      </Text>
                    </TouchableOpacity>

                    {expandedNodes['petc-insurance-2026'] && (
                      <View style={styles.monthPillRow}>
                        {months.map(m => (
                          <TouchableOpacity
                            key={`ins-26-${m}`}
                            style={[styles.monthMiniPill, activeNav.type === 'petc-insurance' && activeNav.year === '2026' && activeNav.month === m && styles.monthMiniPillActive]}
                            onPress={() => {
                              setActiveNav({
                                type: 'petc-insurance',
                                year: '2026',
                                month: m,
                                subCategory: null,
                                label: `PETC Insurance > 2026 > ${m}`
                              });
                            }}
                          >
                            <Text style={[styles.monthMiniPillText, activeNav.type === 'petc-insurance' && activeNav.year === '2026' && activeNav.month === m && styles.monthMiniPillTextActive]}>
                              {m}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}

                    {/* 2027 */}
                    <TouchableOpacity
                      style={[styles.treeSubItem, activeNav.type === 'petc-insurance' && activeNav.year === '2027' && !activeNav.month && styles.treeItemActive]}
                      onPress={() => {
                        setActiveNav({
                          type: 'petc-insurance',
                          year: '2027',
                          month: null,
                          subCategory: null,
                          label: 'PETC Insurance > 2027'
                        });
                      }}
                    >
                      <TouchableOpacity onPress={() => toggleNode('petc-insurance-2027')} style={styles.iconToggle}>
                        {expandedNodes['petc-insurance-2027'] ? <ChevronDown size={13} color="#64748b" /> : <ChevronRight size={13} color="#64748b" />}
                      </TouchableOpacity>
                      <Calendar size={14} color="#2dd4bf" />
                      <Text style={[styles.treeSubText, activeNav.type === 'petc-insurance' && activeNav.year === '2027' && styles.treeTextActive]} numberOfLines={1}>
                        2027
                      </Text>
                    </TouchableOpacity>

                    {expandedNodes['petc-insurance-2027'] && (
                      <View style={styles.monthPillRow}>
                        {months.map(m => (
                          <TouchableOpacity
                            key={`ins-27-${m}`}
                            style={[styles.monthMiniPill, activeNav.type === 'petc-insurance' && activeNav.year === '2027' && activeNav.month === m && styles.monthMiniPillActive]}
                            onPress={() => {
                              setActiveNav({
                                type: 'petc-insurance',
                                year: '2027',
                                month: m,
                                subCategory: null,
                                label: `PETC Insurance > 2027 > ${m}`
                              });
                            }}
                          >
                            <Text style={[styles.monthMiniPillText, activeNav.type === 'petc-insurance' && activeNav.year === '2027' && activeNav.month === m && styles.monthMiniPillTextActive]}>
                              {m}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                )}
              </View>
              )}
            </ScrollView>


          </View>
        )}
    </>
  );
}
