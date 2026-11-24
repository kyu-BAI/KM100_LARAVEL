import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import {
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  PanelLeft,
  Search,
  X,
  Camera,
  FileSpreadsheet,
  RefreshCw
} from 'lucide-react';

export default function TopHeader({
  sidebarOpen,
  setSidebarOpen,
  searchQuery,
  setSearchQuery,
  openAddModal,
  exportFolderToExcel,
  activeNav,
  fetchData,
  isSyncing,
  currentUser,
  isAdmin,
  isEmployee,
  currentPage,
  setCurrentPage,
  setShowEmployeeModal,
  width,
  isDesktop,
  isMobile,
  isSmallMobile,
  isLight,
  styles
}) {
  // GLOBAL PROFESSIONAL TOP HEADER BAR
  return (
    <View
      accessibilityRole="banner"
      style={[
        styles.topHeader,
        isMobile && styles.topHeaderMobile,
        isSmallMobile && styles.topHeaderSmallMobile,
        isLight && styles.topHeaderLight
      ]}>
        <View style={[styles.topHeaderLeft, isSmallMobile && { gap: 8 }]}>
          <TouchableOpacity
            style={[
              styles.sidebarToggleBtn,
              isSmallMobile && { padding: 6 },
              isLight && styles.sidebarToggleBtnLight
            ]}
            onPress={() => setSidebarOpen(prev => !prev)}
            title={sidebarOpen ? "Hide directory tree" : "Browse all folders & branches"}
            accessibilityRole="button"
            accessibilityLabel={sidebarOpen ? "Hide directory tree sidebar" : "Show directory tree sidebar"}
          >
            {sidebarOpen ? (
              <PanelLeftOpen size={isSmallMobile ? 18 : 20} color={isLight ? '#252525' : '#cbd5e1'} />
            ) : (
              <PanelLeftClose size={isSmallMobile ? 18 : 20} color={isLight ? '#252525' : '#cbd5e1'} />
            )}
          </TouchableOpacity>

          <View style={styles.brandContainer}>
            <View style={{
              width: isSmallMobile ? 32 : 38,
              height: isSmallMobile ? 32 : 38,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0
            }}>
              <Image
                source={{ uri: '/km100-logo.png' }}
                accessibilityLabel="KM100 Logo"
                alt="KM100 Logo"
                style={{ width: '100%', height: '100%' }}
                resizeMode="contain"
              />
            </View>
            <View style={{ gap: 2, minWidth: 0, justifyContent: 'center' }}>
              <Text
                style={[styles.brandTitle, isLight && styles.brandTitleLight, isMobile && { fontSize: 14 }]}
                accessibilityRole="header"
                aria-level="1"
                numberOfLines={1}
              >
                <Text style={{ color: '#f47721', fontWeight: '800' }}>KM</Text>
                <Text style={{ color: isLight ? '#252525' : '#f8fafc', fontWeight: '800' }}>
                  {width < 640 ? '100 Skills & Training' : '100 Skills and Training Center, Inc.'}
                </Text>
              </Text>
              <Text
                style={[styles.brandSub, isLight && styles.brandSubLight, isMobile && { fontSize: 11 }]}
                numberOfLines={1}
              >Receipt Management System
              </Text>
          </View>
        </View>
      </View>

        {/* Center Search Bar on Desktop & Large Tablet */}
        {width >= 960 && (
          <View style={[styles.headerSearchBox, isLight && styles.headerSearchBoxLight]}>
            <Search size={15} color={isLight ? '#888888' : '#94a3b8'} />
            <TextInput
              style={[styles.headerSearchInput, isLight && styles.headerSearchInputLight]}
              placeholder="Search store, receipt title, invoice #, amount..."
              placeholderTextColor={isLight ? '#888888' : '#64748b'}
              value={searchQuery}
              onChangeText={setSearchQuery}
              accessibilityLabel="Search inventory by store, receipt title, invoice number, or amount"
              autoComplete="off"
              autoCorrect={false}
              spellCheck={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                accessibilityRole="button"
                accessibilityLabel="Clear search input"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <X size={14} color={isLight ? '#888888' : '#94a3b8'} />
              </TouchableOpacity>
            )}
          </View>
        )}

      {/* Right Header Action Cluster */}
      <View style={[styles.topHeaderRight, isSmallMobile && { gap: 5 }]}>
        {/* PRIMARY HERO BUTTON: SCAN RECEIPT */}
        <TouchableOpacity
          style={[styles.heroScanBtn, isSmallMobile && { paddingHorizontal: 9, paddingVertical: 7, gap: 5 }]}
          onPress={openAddModal}
          title="Scan physical receipt or upload document"
          accessibilityRole="button"
          accessibilityLabel="Scan receipt or upload document"
        >
          <Camera size={isSmallMobile ? 14 : 16} color="#ffffff" />
          <Text style={[styles.heroScanBtnText, isSmallMobile && { fontSize: 11 }]}>
            {width < 440 ? 'Scan' : 'Scan Receipt'}
          </Text>
        </TouchableOpacity>

        {/* Live Sync Pill (Desktop & Tablet only) */}
        {width >= 1280 && (
          <TouchableOpacity
            style={[styles.headerSyncPill, isLight && styles.headerSyncPillLight]}
            onPress={() => fetchData(false)}
            title="Click to sync with database"
            accessibilityRole="button"
            accessibilityLabel="Sync data with database"
          >
            <RefreshCw size={11} color={isSyncing ? '#f47721' : '#10b981'} />
            <Text style={[styles.headerSyncText, isLight && styles.headerSyncTextLight]}>
              {isSyncing ? 'Syncing...' : 'Sync'}
            </Text>
          </TouchableOpacity>
        )}

        {/* User Profile / Admin & Employee Session Management */}
          {currentUser && (
            <TouchableOpacity
              style={[
                styles.headerUserBlock,
                currentPage === 'admin' && {
                  borderColor: '#f47721',
                  backgroundColor: isLight ? '#fef3eb' : 'rgba(244, 119, 33, 0.15)',
                  boxShadow: isLight ? '0 1px 3px rgba(0,0,0,0.06)' : '0 1px 4px rgba(0,0,0,0.3)'
                },
                isEmployee && {
                  borderColor: isLight ? '#fcd3b4' : 'rgba(244, 119, 33, 0.35)',
                  backgroundColor: isLight ? '#fef3eb' : 'rgba(244, 119, 33, 0.12)'
                },
                isSmallMobile && { marginLeft: 0 }
              ]}
              onPress={() => {
                if (isEmployee) {
                  setShowEmployeeModal(true);
                } else {
                  setCurrentPage(prev => (prev === 'admin' ? 'inventory' : 'admin'));
                }
              }}
              title={isEmployee ? "Click to view Employee Profile & Logout" : "Click to open Admin Portal, Logout & Employee Creation"}
              accessibilityLabel="User Profile Management"
            >
              <View style={[
                styles.headerUserAvatar,
                isEmployee && { backgroundColor: '#f47721' },
                isSmallMobile && { width: 26, height: 26 },
                isLight && !isEmployee && styles.headerUserAvatarLight
              ]}>
                <Text style={[styles.headerUserInitial, isSmallMobile && { fontSize: 11 }]}>
                  {(currentUser.fullName || currentUser.name || currentUser.email || 'A').charAt(0).toUpperCase()}
                </Text>
              </View>
              {!isSmallMobile && (
                <View style={{ gap: 1, paddingRight: 4 }}>
                  <Text style={[styles.headerUserName, isLight && styles.headerUserNameLight]} numberOfLines={1}>
                    {currentUser.fullName ? currentUser.fullName.split(' ')[0] : (isEmployee ? 'Staff' : 'Admin')}
                  </Text>
                  <Text style={[
                    styles.headerUserRole,
                    isEmployee && { color: isLight ? '#f47721' : '#ff9345', fontWeight: '800' },
                    isLight && !isEmployee && styles.headerUserRoleLight
                  ]}>
                    {isEmployee ? (currentUser.department ? `${currentUser.department.toUpperCase()} • STAFF` : 'STAFF') : (currentUser.role ? currentUser.role.toUpperCase() : 'ADMIN')}
                  </Text>
                </View>
              )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
