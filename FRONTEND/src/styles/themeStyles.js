import { StyleSheet } from 'react-native';

export function createStyles(isLight = true) {
  // 5-Tier Elevation & Depth System (UI/UX Pro Max + Impeccable)
  // Combines directional key light + ambient soft fill; eliminates colored halos
  const elev = {
    sm: isLight ? '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.04)' : '0 1px 3px rgba(0, 0, 0, 0.3)',
    md: isLight ? '0 4px 8px -2px rgba(0, 0, 0, 0.06), 0 2px 4px -1px rgba(0, 0, 0, 0.04)' : '0 4px 10px -2px rgba(0, 0, 0, 0.35)',
    lg: isLight ? '0 10px 18px -4px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)' : '0 10px 20px -4px rgba(0, 0, 0, 0.45)',
    xl: isLight ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)' : '0 20px 30px -5px rgba(0, 0, 0, 0.6)',
    modal: isLight ? '0 25px 50px -12px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.06)' : '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08)'
  };

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isLight ? '#f5f3ef' : '#090d16',
      flexDirection: 'column',
      height: '100%',
      width: '100%'
    },
    // HEADER USER NAME & ROLE
    headerUserName: {
      fontSize: 12,
      fontWeight: '700',
      color: isLight ? '#252525' : '#f8fafc'
    },
    headerUserNameLight: {
      color: '#252525'
    },
    headerUserRole: {
      fontSize: 9,
      fontWeight: '800',
      color: isLight ? '#f47721' : '#f47721',
      letterSpacing: 0.5
    },
    headerUserRoleLight: {
      color: '#f47721'
    },

    // ADMIN PORTAL STYLES
    adminPortalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: isLight ? '#e5e2dc' : '#1e293b'
    },
    adminPortalHeaderLight: {
      borderBottomColor: '#e5e2dc'
    },
    adminPortalTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: isLight ? '#252525' : '#f8fafc',
      letterSpacing: -0.4
    },
    adminPortalTitleLight: {
      color: '#252525'
    },
    adminPortalSub: {
      fontSize: 13,
      color: isLight ? '#64748b' : '#94a3b8'
    },
    adminPortalSubLight: {
      color: '#64748b'
    },
    adminBackBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: 8,
      backgroundColor: isLight ? '#f5f3ef' : '#1e293b',
      borderWidth: 1,
      borderColor: isLight ? '#d8d4cb' : '#334155',
      cursor: 'pointer',
      boxShadow: elev.sm
    },
    adminBackBtnLight: {
      backgroundColor: '#f5f3ef',
      borderColor: '#d8d4cb'
    },
    adminBackBtnText: {
      fontSize: 13,
      fontWeight: '700',
      color: isLight ? '#f47721' : '#f47721'
    },
    adminBackBtnTextLight: {
      color: '#f47721'
    },
    adminGrid: {
      flexDirection: 'row',
      gap: 20
    },
    adminProfileCard: {
      flex: 1,
      minWidth: 320,
      backgroundColor: isLight ? '#ffffff' : '#252525',
      borderRadius: 12,
      padding: 22,
      borderWidth: 1,
      borderColor: isLight ? '#e5e2dc' : '#1e293b',
      gap: 16,
      boxShadow: elev.md
    },
    adminProfileCardLight: {
      backgroundColor: '#ffffff',
      borderColor: '#e5e2dc'
    },
    adminLargeAvatarCircle: {
      width: 58,
      height: 58,
      borderRadius: 29,
      backgroundColor: '#f47721',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: '#f97316',
      boxShadow: elev.md
    },
    adminLargeAvatarInitials: {
      color: '#ffffff',
      fontSize: 22,
      fontWeight: '800'
    },
    adminProfileName: {
      fontSize: 16,
      fontWeight: '800',
      color: isLight ? '#252525' : '#f8fafc'
    },
    adminProfileNameLight: {
      color: '#252525'
    },
    adminProfileEmail: {
      fontSize: 12,
      color: isLight ? '#64748b' : '#94a3b8'
    },
    adminProfileEmailLight: {
      color: '#64748b'
    },
    adminPrivilegesBox: {
      backgroundColor: isLight ? '#f8fafc' : '#0c1322',
      borderRadius: 8,
      padding: 14,
      borderWidth: 1,
      borderColor: isLight ? '#e5e2dc' : '#1e293b'
    },
    adminPrivilegesBoxLight: {
      backgroundColor: '#f8fafc',
      borderColor: '#e5e2dc'
    },
    adminPrivilegesHeading: {
      fontSize: 10,
      fontWeight: '800',
      color: isLight ? '#475569' : '#94a3b8',
      letterSpacing: 0.8
    },
    adminPrivilegesHeadingLight: {
      color: '#475569'
    },
    privilegeItemText: {
      fontSize: 12,
      color: isLight ? '#334155' : '#d8d4cb',
      fontWeight: '500'
    },
    privilegeItemTextLight: {
      color: '#334155'
    },
    adminLogoutBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: isLight ? '#fee2e2' : 'rgba(239, 68, 68, 0.12)',
      borderWidth: 1,
      borderColor: isLight ? '#fca5a5' : 'rgba(239, 68, 68, 0.3)',
      paddingVertical: 12,
      borderRadius: 8,
      cursor: 'pointer'
    },
    adminLogoutBtnLight: {
      backgroundColor: '#fee2e2',
      borderColor: '#fca5a5'
    },
    adminLogoutBtnText: {
      color: isLight ? '#dc2626' : '#f87171',
      fontSize: 13,
      fontWeight: '700'
    },
    employeeFormCard: {
      flex: 1.6,
      minWidth: 320,
      backgroundColor: isLight ? '#ffffff' : '#252525',
      borderRadius: 12,
      padding: 22,
      borderWidth: 1,
      borderColor: isLight ? '#e5e2dc' : '#1e293b',
      gap: 14,
      boxShadow: elev.md
    },
    employeeFormCardLight: {
      backgroundColor: '#ffffff',
      borderColor: '#e5e2dc'
    },
    empIconBadge: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center'
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: isLight ? '#252525' : '#f8fafc'
    },
    cardTitleLight: {
      color: '#252525'
    },
    cardSubtitle: {
      fontSize: 12,
      color: isLight ? '#64748b' : '#94a3b8'
    },
    cardSubtitleLight: {
      color: '#64748b'
    },
    formFieldLabel: {
      fontSize: 10,
      fontWeight: '800',
      color: isLight ? '#475569' : '#94a3b8',
      letterSpacing: 0.5
    },
    formFieldLabelLight: {
      color: '#475569'
    },
    formInputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isLight ? '#f8fafc' : '#0c1322',
      borderWidth: 1,
      borderColor: isLight ? '#d8d4cb' : '#334155',
      borderRadius: 8,
      paddingHorizontal: 12,
      gap: 8,
      position: 'relative'
    },
    formInputWrapperLight: {
      backgroundColor: '#f8fafc',
      borderColor: '#d8d4cb'
    },
    formFieldInput: {
      flex: 1,
      paddingVertical: 10,
      fontSize: 13,
      color: isLight ? '#252525' : '#f8fafc',
      outlineStyle: 'none'
    },
    formFieldInputLight: {
      color: '#252525'
    },
    passwordGridRow: {
      flexDirection: 'row',
      gap: 12
    },
    empRoleChip: {
      paddingHorizontal: 11,
      paddingVertical: 6,
      borderRadius: 7,
      backgroundColor: isLight ? '#f5f3ef' : '#1e293b',
      borderWidth: 1,
      borderColor: isLight ? '#d8d4cb' : '#334155',
      cursor: 'pointer'
    },
    empRoleChipLight: {
      backgroundColor: '#f5f3ef',
      borderColor: '#d8d4cb'
    },
    empRoleChipActive: {
      backgroundColor: '#f47721',
      borderColor: '#f47721'
    },
    empRoleChipText: {
      fontSize: 11,
      fontWeight: '600',
      color: isLight ? '#475569' : '#94a3b8'
    },
    empRoleChipTextLight: {
      color: '#475569'
    },
    empRoleChipTextActive: {
      color: '#ffffff',
      fontWeight: '700'
    },
    btnCreateEmployee: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: '#f47721',
      paddingVertical: 12,
      borderRadius: 8,
      cursor: 'pointer',
      marginTop: 4,
      boxShadow: elev.sm
    },
    btnCreateEmployeeText: {
      color: '#ffffff',
      fontSize: 13,
      fontWeight: '700'
    },
    accountsListCard: {
      width: '100%',
      backgroundColor: isLight ? '#ffffff' : '#252525',
      borderRadius: 12,
      padding: 22,
      borderWidth: 1,
      borderColor: isLight ? '#e5e2dc' : '#1e293b',
      gap: 14,
      boxShadow: elev.md
    },
    accountsListCardLight: {
      backgroundColor: '#ffffff',
      borderColor: '#e5e2dc'
    },
    employeeRowCard: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderRadius: 8,
      backgroundColor: isLight ? '#f8fafc' : '#0c1322',
      borderWidth: 1,
      borderColor: isLight ? '#e5e2dc' : '#1e293b',
      gap: 12,
      flexWrap: 'wrap'
    },
    employeeRowCardLight: {
      backgroundColor: '#f8fafc',
      borderColor: '#e5e2dc'
    },
    empAvatarCircle: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: '#f47721',
      alignItems: 'center',
      justifyContent: 'center'
    },
    empAvatarInitials: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '700'
    },
    empNameText: {
      fontSize: 13,
      fontWeight: '700',
      color: isLight ? '#252525' : '#f8fafc'
    },
    empNameTextLight: {
      color: '#252525'
    },
    empEmailText: {
      fontSize: 11,
      color: isLight ? '#64748b' : '#94a3b8'
    },
    empEmailTextLight: {
      color: '#64748b'
    },
    empRoleBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      backgroundColor: isLight ? '#fef3eb' : 'rgba(244, 119, 33, 0.12)',
      borderWidth: 1,
      borderColor: isLight ? '#fcd3b4' : 'rgba(2, 132, 199, 0.3)'
    },
    empRoleBadgeLight: {
      backgroundColor: '#fef3eb',
      borderColor: '#fcd3b4'
    },
    empRoleBadgeText: {
      fontSize: 11,
      fontWeight: '700',
      color: isLight ? '#f47721' : '#f47721'
    },
    empRoleBadgeTextLight: {
      color: '#f47721'
    },
    empDeleteBtn: {
      padding: 7,
      borderRadius: 6,
      backgroundColor: isLight ? '#fee2e2' : 'rgba(239, 68, 68, 0.1)',
      borderWidth: 1,
      borderColor: isLight ? '#fca5a5' : 'rgba(239, 68, 68, 0.25)',
      cursor: 'pointer'
    },

    // TOP PROFESSIONAL HEADER BAR
    topHeader: {
      height: 64,
      backgroundColor: isLight ? '#ffffff' : '#0c1322',
      borderBottomWidth: 1,
      borderBottomColor: isLight ? '#e5e2dc' : '#1e293b',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      gap: 16,
      zIndex: 100
    },
    topHeaderLight: {
      backgroundColor: '#ffffff',
      borderBottomColor: '#e5e2dc'
    },
    topHeaderMobile: {
      height: 56,
      paddingHorizontal: 10,
      gap: 8
    },
    topHeaderSmallMobile: {
      height: 50,
      paddingHorizontal: 6,
      gap: 5
    },
    topHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12
    },
    sidebarToggleBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isLight ? '#f5f3ef' : '#1e293b',
      padding: 8,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isLight ? '#e5e2dc' : '#334155'
    },
    sidebarToggleBtnLight: {
      backgroundColor: '#f5f3ef',
      borderColor: '#e5e2dc'
    },
    sidebarToggleBtnText: {
      fontSize: 12,
      fontWeight: '600',
      color: isLight ? '#f47721' : '#f47721'
    },
    sidebarToggleBtnTextLight: {
      color: '#f47721'
    },
    brandContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10
    },
    brandBadge: {
      backgroundColor: '#f47721',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6
    },
    brandBadgeText: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: '800',
      letterSpacing: 0.5
    },
    brandTitle: {
      fontSize: 17,
      fontWeight: '800',
      color: isLight ? '#252525' : '#ffffff',
      letterSpacing: -0.2
    },
    brandTitleLight: {
      color: '#252525'
    },
    brandSub: {
      fontSize: 13,
      color: isLight ? '#64748b' : '#94a3b8',
      fontWeight: '500',
      letterSpacing: -0.1
    },
    brandSubLight: {
      color: '#64748b'
    },
    // Header Search Box
    headerSearchBox: {
      flex: 1,
      maxWidth: 420,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: isLight ? '#f8fafc' : '#090d16',
      borderWidth: 1,
      borderColor: isLight ? '#d8d4cb' : '#1e293b',
      borderRadius: 9999,
      paddingHorizontal: 12,
      height: 38
    },
    headerSearchBoxLight: {
      backgroundColor: '#f8fafc',
      borderColor: '#d8d4cb'
    },
    headerSearchInput: {
      flex: 1,
      fontSize: 12,
      color: isLight ? '#252525' : '#f8fafc',
      outlineStyle: 'none'
    },
    headerSearchInputLight: {
      color: '#252525'
    },
    // Header Actions
    topHeaderRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8
    },
    heroScanBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      backgroundColor: '#f47721',
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 9999,
      borderWidth: 1,
      borderColor: '#e06412',
      boxShadow: elev.sm,
      transition: 'transform 0.18s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.18s ease, filter 0.15s ease'
    },
    heroScanBtnText: {
      color: '#ffffff',
      fontSize: 13,
      fontWeight: '700'
    },
    heroExportBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: isLight ? '#f5f3ef' : '#1e293b',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 9999,
      borderWidth: 1,
      borderColor: isLight ? '#d8d4cb' : '#334155'
    },
    heroExportBtnLight: {
      backgroundColor: '#f5f3ef',
      borderColor: '#d8d4cb'
    },
    heroExportBtnText: {
      color: isLight ? '#059669' : '#10b981',
      fontSize: 12,
      fontWeight: '600'
    },
    heroExportBtnTextLight: {
      color: '#059669'
    },
    headerIconBtn: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: isLight ? '#f5f3ef' : '#1e293b',
      borderWidth: 1,
      borderColor: isLight ? '#d8d4cb' : '#334155'
    },
    headerIconBtnLight: {
      backgroundColor: '#f5f3ef',
      borderColor: '#d8d4cb'
    },
    headerSyncPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 9,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: isLight ? '#ecfdf5' : 'rgba(52, 211, 153, 0.12)',
      borderWidth: 1,
      borderColor: isLight ? '#a7f3d0' : 'rgba(52, 211, 153, 0.25)'
    },
    headerSyncPillLight: {
      backgroundColor: '#ecfdf5',
      borderColor: '#a7f3d0'
    },
    headerSyncText: {
      fontSize: 11,
      fontWeight: '600',
      color: isLight ? '#059669' : '#34d399'
    },
    headerSyncTextLight: {
      color: '#059669'
    },
    headerUserBlock: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginLeft: 4
    },
    headerUserAvatar: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: isLight ? '#f47721' : '#f47721',
      alignItems: 'center',
      justifyContent: 'center'
    },
    headerUserAvatarLight: {
      backgroundColor: '#f47721'
    },
    headerUserInitial: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: '700'
    },
    headerLogoutBtn: {
      padding: 6,
      borderRadius: 6,
      backgroundColor: isLight ? '#fee2e2' : 'rgba(239, 68, 68, 0.1)',
      borderWidth: 1,
      borderColor: isLight ? '#fca5a5' : 'rgba(239, 68, 68, 0.25)'
    },
    headerLogoutBtnLight: {
      backgroundColor: '#fef2f2',
      borderColor: '#fecaca'
    },
    // 1. STATS OVERVIEW GRID (AT-A-GLANCE METRICS)
    statsGrid: {
      flexDirection: 'row',
      gap: 12,
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 4
    },
    statsGridMobile: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      paddingHorizontal: 10,
      paddingTop: 10,
      paddingBottom: 2
    },
    statCard: {
      flex: 1,
      minWidth: 140,
      backgroundColor: isLight ? '#ffffff' : '#0c1322',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isLight ? '#e5e2dc' : '#1e293b',
      padding: 14,
      gap: 4,
      boxShadow: elev.sm,
      transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease, border-color 0.2s ease'
    },
    statCardMobile: {
      flexBasis: '47%',
      flexGrow: 1,
      padding: 10,
      borderRadius: 10
    },
    statCardLight: {
      backgroundColor: '#ffffff',
      borderColor: '#e5e2dc',
      boxShadow: elev.sm
    },
    statCardActive: {
      borderColor: isLight ? '#f47721' : '#f47721',
      backgroundColor: isLight ? '#f0f9ff' : 'rgba(244, 119, 33, 0.12)'
    },
    statCardActiveLight: {
      borderColor: '#f47721',
      backgroundColor: '#f0f9ff'
    },
    statCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    statCardLabel: {
      fontSize: 10,
      fontWeight: '800',
      color: isLight ? '#64748b' : '#94a3b8',
      letterSpacing: 0.5
    },
    statCardLabelLight: {
      color: '#64748b'
    },
    statIconBadge: {
      width: 28,
      height: 28,
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center'
    },
    statCardValue: {
      fontSize: 18,
      fontWeight: '800',
      letterSpacing: -0.5
    },
    statCardValueMobile: {
      fontSize: 14,
      letterSpacing: -0.2
    },
    statCardSub: {
      fontSize: 11,
      color: isLight ? '#94a3b8' : '#64748b'
    },
    statCardSubLight: {
      color: '#64748b'
    },
    // 2. HORIZONTAL CATEGORY NAVIGATION TABS
    categoryNavBar: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: isLight ? '#e5e2dc' : '#1e293b',
      backgroundColor: isLight ? '#f8fafc' : '#0c1322'
    },
    categoryNavBarLight: {
      borderBottomColor: '#e5e2dc'
    },
    categoryNavScroll: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8
    },
    categoryTab: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 10,
      backgroundColor: isLight ? '#ffffff' : '#252525',
      borderWidth: 1,
      borderColor: isLight ? '#e5e2dc' : '#1e293b',
      transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    categoryTabLight: {
      backgroundColor: '#ffffff',
      borderColor: '#d8d4cb'
    },
    categoryTabActive: {
      backgroundColor: isLight ? '#fef3eb' : '#1e293b',
      borderColor: isLight ? '#f47721' : '#f47721'
    },
    categoryTabActiveLight: {
      backgroundColor: '#fef3eb',
      borderColor: '#f47721'
    },
    categoryTabText: {
      fontSize: 12,
      fontWeight: '600',
      color: isLight ? '#64748b' : '#94a3b8'
    },
    categoryTabTextLight: {
      color: '#475569'
    },
    categoryTabTextActive: {
      color: isLight ? '#f47721' : '#f47721',
      fontWeight: isLight ? '700' : '700'
    },
    categoryTabTextActiveLight: {
      color: '#f47721',
      fontWeight: '700'
    },
    categoryTabBadge: {
      backgroundColor: isLight ? '#f5f3ef' : '#1e293b',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 10
    },
    categoryTabBadgeLight: {
      backgroundColor: '#f5f3ef'
    },
    categoryTabBadgeActive: {
      backgroundColor: '#f47721'
    },
    categoryTabBadgeText: {
      fontSize: 10,
      fontWeight: '700',
      color: isLight ? '#64748b' : '#94a3b8'
    },
    categoryTabBadgeTextActive: {
      color: '#ffffff'
    },
    categoryTabBadgeTextLight: {
      color: '#64748b'
    },
    // 3. CONTEXTUAL SUB-FILTER CHIPS
    subFilterRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: isLight ? '#f8fafc' : '#0c1322',
      borderBottomWidth: 1,
      borderBottomColor: isLight ? '#e5e2dc' : '#1e293b',
      flexWrap: 'wrap'
    },
    subFilterRowLight: {
      backgroundColor: '#f8fafc',
      borderBottomColor: '#e5e2dc'
    },
    subFilterHeading: {
      fontSize: 11,
      fontWeight: '700',
      color: isLight ? '#64748b' : '#94a3b8',
      marginRight: 4
    },
    subFilterHeadingLight: {
      color: '#64748b'
    },
    subFilterChip: {
      paddingHorizontal: 11,
      paddingVertical: 5,
      borderRadius: 20,
      backgroundColor: isLight ? '#f5f3ef' : '#1e293b',
      borderWidth: 1,
      borderColor: isLight ? '#d8d4cb' : '#334155',
      transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    subFilterChipLight: {
      backgroundColor: '#ffffff',
      borderColor: '#d8d4cb'
    },
    subFilterChipActive: {
      backgroundColor: isLight ? '#f47721' : '#f47721',
      borderColor: isLight ? '#f47721' : '#f47721'
    },
    subFilterChipActiveLight: {
      backgroundColor: '#f47721',
      borderColor: '#f47721'
    },
    subFilterChipText: {
      fontSize: 11,
      fontWeight: '600',
      color: isLight ? '#475569' : '#d8d4cb'
    },
    subFilterChipTextLight: {
      color: '#334155'
    },
    subFilterChipTextActive: {
      color: '#ffffff',
      fontWeight: '700'
    },
    // Clear Filter Action
    clearFilterBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: isLight ? '#fef2f2' : 'rgba(239, 68, 68, 0.12)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: isLight ? '#fecaca' : 'rgba(239, 68, 68, 0.25)',
      marginLeft: 6
    },
    clearFilterBtnLight: {
      backgroundColor: '#fef2f2',
      borderColor: '#fecaca'
    },
    clearFilterBtnText: {
      fontSize: 11,
      fontWeight: '600',
      color: isLight ? '#dc2626' : '#f87171'
    },
    clearFilterBtnTextLight: {
      color: '#dc2626'
    },
    // Mobile Floating Action Button
    mobileFloatingBar: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      zIndex: 9999
    },
    mobileFloatingBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: '#f47721',
      paddingHorizontal: 18,
      paddingVertical: 14,
      borderRadius: 30,
      boxShadow: elev.lg,
      borderWidth: 1,
      borderColor: '#34d399',
      animation: 'pulseGlow 2.8s infinite',
      transition: 'transform 0.18s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.18s ease'
    },
    mobileFloatingBtnText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '800',
      letterSpacing: 0.3
    },
    // Toast
    toast: {
      position: 'absolute',
      top: 16,
      right: 24,
      zIndex: 9999,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 8,
      boxShadow: elev.lg,
      animation: 'toastSlideIn 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
      transition: 'all 0.2s ease'
    },
    toastSuccess: {
      backgroundColor: '#f47721',
      borderColor: '#e06412',
      borderWidth: 1
    },
    toastError: {
      backgroundColor: '#dc2626',
      borderColor: '#ef4444',
      borderWidth: 1
    },
    toastText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '600'
    },
    // Main Workspace
    mainContent: {
      flex: 1,
      flexDirection: 'row',
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: isLight ? '#f5f3ef' : undefined
    },
    // Sidebar Tree
    sidebar: {
      width: 290,
      backgroundColor: isLight ? '#ffffff' : '#252525',
      borderRightWidth: 1,
      borderRightColor: isLight ? '#e5e2dc' : '#1e293b',
      flexDirection: 'column'
    },
    sidebarCompanyHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: isLight ? '#e5e2dc' : '#1e293b',
      backgroundColor: isLight ? '#f8fafc' : '#0c1322'
    },
    sidebarCompanyHeaderLight: {
      backgroundColor: '#f8fafc',
      borderBottomColor: '#e5e2dc'
    },
    sidebarLogoBox: {
      width: 38,
      height: 38,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    },
    sidebarCompanyName: {
      fontSize: 12,
      fontWeight: '800',
      color: isLight ? '#252525' : '#f8fafc',
      letterSpacing: 0.3
    },
    sidebarCompanyNameLight: {
      color: '#252525'
    },
    sidebarCompanySub: {
      fontSize: 10,
      fontWeight: '500',
      color: isLight ? '#64748b' : '#94a3b8'
    },
    sidebarCompanySubLight: {
      color: '#94a3b8'
    },
    sidebarTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: isLight ? '#e5e2dc' : '#1e293b'
    },
    sidebarCollapseBtn: {
      padding: 6,
      borderRadius: 6,
      backgroundColor: isLight ? '#f5f3ef' : '#1e293b',
      cursor: 'pointer',
      alignItems: 'center',
      justifyContent: 'center'
    },
    sidebarSectionTitle: {
      fontSize: 11,
      fontWeight: '800',
      color: isLight ? '#64748b' : '#94a3b8',
      letterSpacing: 0.8
    },
    treeScroll: {
      flex: 1,
      paddingHorizontal: 10,
      paddingVertical: 10
    },
    separator: {
      height: 1,
      backgroundColor: isLight ? '#e5e2dc' : '#1e293b',
      marginVertical: 10
    },
    categoryBlock: {
      marginBottom: 6
    },
    treeItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 6,
      gap: 8
    },
    treeItemActive: {
      backgroundColor: isLight ? '#fef3eb' : 'rgba(244, 119, 33, 0.12)',
      borderColor: isLight ? '#fcd3b4' : 'rgba(244, 119, 33, 0.35)'
    },
    iconToggle: {
      padding: 2
    },
    treeCategoryTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: isLight ? '#252525' : '#d8d4cb'
    },
    treeText: {
      fontSize: 13,
      color: isLight ? '#334155' : '#d8d4cb',
      fontWeight: '500'
    },
    treeTextActive: {
      color: isLight ? '#f47721' : '#f47721',
      fontWeight: '700'
    },
    treeChildren: {
      paddingLeft: 22,
      marginTop: 2,
      animation: 'accordionDown 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
    },
    treeSubItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6,
      paddingHorizontal: 8,
      borderRadius: 6,
      gap: 6
    },
    treeSubText: {
      fontSize: 12,
      color: isLight ? '#475569' : '#94a3b8',
      fontWeight: '500'
    },
    monthPillRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
      paddingLeft: 20,
      paddingVertical: 4
    },
    monthMiniPill: {
      paddingHorizontal: 7,
      paddingVertical: 3,
      borderRadius: 4,
      backgroundColor: isLight ? '#f5f3ef' : '#1e293b',
      borderWidth: 1,
      borderColor: isLight ? '#e5e2dc' : '#334155'
    },
    monthMiniPillActive: {
      backgroundColor: isLight ? '#f47721' : '#f47721',
      borderColor: isLight ? '#f47721' : '#f47721'
    },
    monthMiniPillText: {
      fontSize: 10,
      fontWeight: '600',
      color: isLight ? '#475569' : '#94a3b8'
    },
    monthMiniPillTextActive: {
      color: '#ffffff',
      fontWeight: '700'
    },
    // Main Content Area
    contentArea: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: isLight ? '#f8fafc' : '#090d16'
    },
    controlBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isLight ? '#e5e2dc' : '#1e293b',
      backgroundColor: isLight ? '#ffffff' : '#252525'
    },
    controlBarLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12
    },
    burgerToggleBtn: {
      padding: 6,
      borderRadius: 6,
      backgroundColor: isLight ? '#f5f3ef' : '#1e293b',
      borderWidth: 1,
      borderColor: isLight ? '#d8d4cb' : '#334155',
      cursor: 'pointer',
      alignItems: 'center',
      justifyContent: 'center'
    },
    breadcrumbs: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8
    },
    breadcrumbItem: {
      fontSize: 13,
      color: isLight ? '#64748b' : '#94a3b8'
    },
    breadcrumbActive: {
      fontSize: 14,
      color: isLight ? '#252525' : '#f8fafc',
      fontWeight: '700'
    },
    controlBarRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12
    },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isLight ? '#f8fafc' : '#0b1120',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      minHeight: 40,
      width: 260,
      borderWidth: 1,
      borderColor: isLight ? '#d8d4cb' : '#334155',
      gap: 10
    },
    searchInput: {
      flex: 1,
      color: isLight ? '#252525' : '#f8fafc',
      fontSize: 13,
      paddingVertical: 0,
      outlineStyle: 'none'
    },
    countBadge: {
      backgroundColor: isLight ? '#f5f3ef' : '#1e293b',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isLight ? '#d8d4cb' : '#334155'
    },
    countBadgeText: {
      fontSize: 12,
      color: isLight ? '#475569' : '#d8d4cb',
      fontWeight: '600'
    },
    cachePill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: isLight ? '#ecfdf5' : 'rgba(52, 211, 153, 0.12)',
      paddingHorizontal: 9,
      paddingVertical: 4,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isLight ? '#a7f3d0' : 'rgba(52, 211, 153, 0.25)'
    },
    cachePillText: {
      fontSize: 11,
      color: isLight ? '#059669' : '#34d399',
      fontWeight: '600'
    },
    allFilesToggleBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: isLight ? '#f5f3ef' : '#1e293b',
      borderWidth: 1,
      borderColor: isLight ? '#d8d4cb' : '#334155',
      paddingVertical: 4,
      paddingHorizontal: 9,
      borderRadius: 8,
      cursor: 'pointer'
    },
    allFilesToggleBtnActive: {
      backgroundColor: isLight ? '#fef3eb' : 'rgba(244, 119, 33, 0.12)',
      borderColor: isLight ? '#f47721' : '#f47721'
    },
    allFilesToggleBtnText: {
      fontSize: 11,
      fontWeight: '600',
      color: isLight ? '#475569' : '#94a3b8'
    },
    allFilesToggleBtnTextActive: {
      color: isLight ? '#f47721' : '#f47721'
    },
    exportExcelBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: isLight ? '#ecfdf5' : 'rgba(16, 185, 129, 0.12)',
      borderWidth: 1,
      borderColor: isLight ? '#a7f3d0' : 'rgba(52, 211, 153, 0.35)',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
      cursor: 'pointer',
      transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    exportExcelBtnLight: {
      backgroundColor: '#ecfdf5',
      borderColor: '#a7f3d0'
    },
    exportExcelBtnText: {
      fontSize: 11,
      fontWeight: '700',
      color: isLight ? '#059669' : '#34d399'
    },
    exportExcelBtnTextLight: {
      color: '#059669'
    },
    treeFolderExportBtn: {
      paddingVertical: 2,
      paddingHorizontal: 5,
      borderRadius: 4,
      backgroundColor: isLight ? '#ecfdf5' : 'rgba(16, 185, 129, 0.1)',
      borderWidth: 1,
      borderColor: isLight ? '#a7f3d0' : 'rgba(52, 211, 153, 0.25)',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer'
    },
    sidebarToggleSwitch: {
      width: 32,
      height: 18,
      borderRadius: 9,
      backgroundColor: isLight ? '#e5e2dc' : '#1e293b',
      borderWidth: 1,
      borderColor: isLight ? '#d8d4cb' : '#334155',
      padding: 2,
      justifyContent: 'center',
      cursor: 'pointer'
    },
    sidebarToggleSwitchActive: {
      backgroundColor: '#e06412',
      borderColor: '#f47721'
    },
    sidebarToggleThumb: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: isLight ? '#94a3b8' : '#64748b'
    },
    sidebarToggleThumbActive: {
      backgroundColor: '#ffffff',
      alignSelf: 'flex-end'
    },
    btnToggleEmptyOn: {
      marginTop: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: '#f47721',
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: 8,
      cursor: 'pointer'
    },
    btnToggleEmptyOnText: {
      fontSize: 13,
      fontWeight: '700',
      color: '#252525'
    },
    // Table View
    tableHorizontal: {
      flex: 1,
      width: '100%'
    },
    tableVertical: {
      flex: 1,
      width: '100%'
    },
    table: {
      width: '100%',
      minWidth: 980,
      paddingHorizontal: 20,
      paddingVertical: 14
    },
    tableRowHeader: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isLight ? '#e5e2dc' : '#0c1322',
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 6,
      marginBottom: 4,
      borderBottomColor: isLight ? '#d8d4cb' : '#1e293b'
    },
    th: {
      fontSize: 11,
      fontWeight: '700',
      color: isLight ? '#475569' : '#94a3b8',
      letterSpacing: 0.5
    },
    tableRow: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor: isLight ? '#e5e2dc' : '#1e293b',
      backgroundColor: isLight ? '#ffffff' : '#252525',
      transition: 'background-color 0.15s ease, transform 0.15s ease'
    },
    tableRowAlt: {
      backgroundColor: isLight ? '#f8fafc' : '#131d31'
    },
    td: {
      fontSize: 12,
      color: isLight ? '#1e293b' : '#d8d4cb'
    },
    btnTableAction: {
      padding: 6,
      borderRadius: 4,
      backgroundColor: isLight ? '#f5f3ef' : '#1e293b',
      borderWidth: isLight ? 1 : 0,
      borderColor: isLight ? '#d8d4cb' : '#334155'
    },
    statusTag: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 12,
      alignSelf: 'flex-start',
      borderColor: isLight ? 'transparent' : undefined,
      backgroundColor: isLight ? '#f5f3ef' : '#1e293b'
    },
    statusTagSuccess: {
      backgroundColor: isLight ? '#ecfdf5' : 'rgba(52, 211, 153, 0.15)',
      borderWidth: 1,
      borderColor: isLight ? '#a7f3d0' : 'rgba(52, 211, 153, 0.3)'
    },
    statusTagDanger: {
      backgroundColor: isLight ? '#fef2f2' : 'rgba(239, 68, 68, 0.15)',
      borderWidth: 1,
      borderColor: isLight ? '#fecaca' : 'rgba(239, 68, 68, 0.3)'
    },
    statusTagInfo: {
      backgroundColor: isLight ? '#f0f9ff' : 'rgba(244, 119, 33, 0.12)',
      borderWidth: 1,
      borderColor: isLight ? '#fcd3b4' : 'rgba(244, 119, 33, 0.35)'
    },
    statusTagText: {
      fontSize: 10,
      fontWeight: '700',
      color: isLight ? '#252525' : '#e5e2dc'
    },
    // Loading & Empty states
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 12
    },
    loadingText: {
      color: isLight ? '#64748b' : '#94a3b8',
      fontSize: 14
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
      gap: 12
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: isLight ? '#252525' : '#f8fafc'
    },
    emptySubtitle: {
      fontSize: 13,
      color: isLight ? '#64748b' : '#94a3b8',
      textAlign: 'center',
      maxWidth: 480,
      lineHeight: 20
    },
    // Buttons in Modals
    btnPrimary: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: '#f47721',
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#f47721'
    },
    btnPrimaryText: {
      color: '#ffffff',
      fontSize: 13,
      fontWeight: '600'
    },
    btnSecondary: {
      paddingHorizontal: 16,
      paddingVertical: 9,
      borderRadius: 8,
      backgroundColor: isLight ? '#f5f3ef' : '#1e293b',
      borderWidth: 1,
      borderColor: isLight ? '#d8d4cb' : '#334155'
    },
    btnSecondaryText: {
      color: isLight ? '#475569' : '#94a3b8',
      fontSize: 13,
      fontWeight: '600'
    },
    btnOutline: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: isLight ? '#d8d4cb' : '#334155',
      backgroundColor: isLight ? '#f5f3ef' : '#1e293b'
    },
    btnOutlineText: {
      color: isLight ? '#334155' : '#d8d4cb',
      fontSize: 12,
      fontWeight: '600'
    },
    // Viewer Modal
    modalCard: {
      backgroundColor: isLight ? '#ffffff' : '#252525',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: isLight ? '#e5e2dc' : '#1e293b',
      boxShadow: elev.modal,
      overflow: 'hidden'
    },
    modalCardLight: {
      backgroundColor: '#ffffff',
      borderColor: '#e5e2dc',
      boxShadow: elev.modal
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: isLight ? 'rgba(15, 23, 42, 0.55)' : 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(4px)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
      animation: 'fadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
    },
    modalOverlayMobile: {
      padding: 8
    },
    modalContainerMobile: {
      width: '100%',
      maxWidth: '100%',
      maxHeight: '96%',
      borderRadius: 12
    },
    modalHeaderMobile: {
      paddingHorizontal: 14,
      paddingVertical: 12
    },
    viewerModalContainer: {
      width: '90%',
      maxWidth: 960,
      maxHeight: '90%',
      backgroundColor: isLight ? '#ffffff' : '#252525',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isLight ? '#d8d4cb' : '#1e293b',
      flexDirection: 'column',
      overflow: 'hidden',
      animation: 'modalSlideUp 0.26s cubic-bezier(0.16, 1, 0.3, 1)'
    },
    viewerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: isLight ? '#f8fafc' : '#0c1322',
      borderBottomWidth: 1,
      borderBottomColor: isLight ? '#e5e2dc' : '#1e293b'
    },
    viewerHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14
    },
    viewerBadge: {
      width: 48,
      height: 48,
      borderRadius: 10,
      backgroundColor: isLight ? '#fef3eb' : 'rgba(56, 189, 248, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: isLight ? '#fcd3b4' : 'rgba(244, 119, 33, 0.35)'
    },
    viewerTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: isLight ? '#252525' : '#f8fafc',
      fontFamily: 'JetBrains Mono, monospace'
    },
    viewerSubtitle: {
      fontSize: 12,
      color: isLight ? '#64748b' : '#94a3b8',
      marginTop: 2
    },
    viewerHeaderActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10
    },
    modalCloseBtn: {
      padding: 6,
      borderRadius: 6,
      backgroundColor: isLight ? '#f5f3ef' : '#1e293b'
    },
    viewerBody: {
      flex: 1,
      flexGrow: 1,
      flexShrink: 1,
      padding: 24,
      backgroundColor: isLight ? '#ffffff' : '#252525'
    },
    viewerStatsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 20
    },
    viewerStatBox: {
      flex: 1,
      minWidth: 130,
      backgroundColor: isLight ? '#f8fafc' : '#131d31',
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: isLight ? '#e5e2dc' : '#1e293b'
    },
    viewerStatLabel: {
      fontSize: 10,
      fontWeight: '700',
      color: isLight ? '#64748b' : '#94a3b8',
      marginBottom: 4
    },
    viewerStatValue: {
      fontSize: 14,
      fontWeight: '700',
      color: isLight ? '#252525' : '#f8fafc'
    },
    viewerSection: {
      marginBottom: 20,
      backgroundColor: isLight ? '#ffffff' : '#252525',
      borderColor: isLight ? '#e5e2dc' : '#1e293b'
    },
    viewerSectionTitle: {
      fontSize: 12,
      fontWeight: '800',
      color: isLight ? '#f47721' : '#f47721',
      letterSpacing: 0.5,
      marginBottom: 10
    },
    notesBox: {
      backgroundColor: isLight ? '#f8fafc' : '#0c1322',
      borderRadius: 8,
      padding: 14,
      borderWidth: 1,
      borderColor: isLight ? '#e5e2dc' : '#1e293b'
    },
    notesText: {
      fontSize: 13,
      color: isLight ? '#1e293b' : '#94a3b8',
      lineHeight: 20
    },
    previewHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8
    },
    previewBadge: {
      fontSize: 11,
      color: isLight ? '#059669' : '#34d399',
      backgroundColor: isLight ? '#ecfdf5' : 'rgba(52, 211, 153, 0.1)',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: isLight ? '#a7f3d0' : 'rgba(52, 211, 153, 0.3)'
    },
    previewTableContainer: {
      backgroundColor: isLight ? '#ffffff' : '#131d31',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: isLight ? '#e5e2dc' : '#1e293b',
      overflow: 'hidden'
    },
    previewTableRowHeader: {
      flexDirection: 'row',
      backgroundColor: isLight ? '#f5f3ef' : '#1e293b',
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderBottomWidth: isLight ? 1 : 0,
      borderBottomColor: isLight ? '#e5e2dc' : 'transparent'
    },
    previewTh: {
      fontSize: 11,
      fontWeight: '700',
      color: isLight ? '#475569' : '#94a3b8'
    },
    previewTableRow: {
      flexDirection: 'row',
      paddingVertical: 9,
      paddingHorizontal: 14,
      borderTopWidth: 1,
      borderTopColor: isLight ? '#e5e2dc' : '#1e293b',
      backgroundColor: isLight ? '#ffffff' : 'transparent'
    },
    previewTableRowAlt: {
      backgroundColor: isLight ? '#f8fafc' : 'rgba(30, 41, 59, 0.5)'
    },
    previewTd: {
      fontSize: 12,
      color: isLight ? '#1e293b' : '#d8d4cb'
    },
    previewSummaryBox: {
      backgroundColor: isLight ? '#f8fafc' : '#0c1322',
      padding: 12,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: isLight ? '#e5e2dc' : '#1e293b',
      marginTop: 10
    },
    previewSummaryTitle: {
      fontSize: 10,
      fontWeight: '700',
      color: '#64748b',
      marginBottom: 6,
      letterSpacing: 0.5
    },
    previewSummaryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16
    },
    previewSummaryItem: {
      flexDirection: 'row',
      gap: 6
    },
    summaryItemKey: {
      fontSize: 12,
      color: isLight ? '#64748b' : '#94a3b8'
    },
    summaryItemVal: {
      fontSize: 12,
      fontWeight: '700',
      color: isLight ? '#f47721' : '#f47721'
    },
    // ADD DOCUMENT MODAL STYLES (TWO OPTIONS)
    formModalContainer: {
      width: '90%',
      maxWidth: 680,
      maxHeight: '90%',
      backgroundColor: isLight ? '#ffffff' : '#252525',
      borderRadius: 14,
      borderWidth: 1,
      borderColor: isLight ? '#d8d4cb' : '#1e293b',
      flexDirection: 'column',
      overflow: 'hidden',
      animation: 'modalSlideUp 0.26s cubic-bezier(0.16, 1, 0.3, 1)'
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: isLight ? '#f8fafc' : '#0c1322',
      borderBottomWidth: 1,
      borderBottomColor: isLight ? '#e5e2dc' : '#1e293b'
    },
    backModalBtn: {
      padding: 6,
      borderRadius: 6,
      backgroundColor: isLight ? '#f5f3ef' : '#1e293b',
      borderWidth: isLight ? 1 : 0,
      borderColor: isLight ? '#d8d4cb' : 'transparent',
      marginRight: 6
    },
    modalTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: isLight ? '#252525' : '#f8fafc'
    },
    modalHeaderSub: {
      fontSize: 12,
      color: isLight ? '#64748b' : '#94a3b8',
      marginTop: 2
    },
    modalBody: {
      flex: 1,
      flexGrow: 1,
      flexShrink: 1,
      padding: 20,
      backgroundColor: isLight ? '#ffffff' : '#252525'
    },
    modalFooter: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 20,
      paddingVertical: 14,
      backgroundColor: isLight ? '#f8fafc' : '#0c1322',
      borderTopWidth: 1,
      borderTopColor: isLight ? '#e5e2dc' : '#1e293b'
    },
    // Options Screen (The Two Cards)
    optionsBody: {
      flex: 1,
      flexGrow: 1,
      flexShrink: 1,
      padding: 24,
      gap: 16
    },
    optionsBodyMobile: {
      padding: 12,
      gap: 12
    },
    optionCard: {
      flexDirection: 'column',
      alignItems: 'stretch',
      backgroundColor: isLight ? '#ffffff' : '#0c1322',
      borderRadius: 14,
      padding: 20,
      borderWidth: 1,
      borderColor: isLight ? '#e5e2dc' : '#1e293b',
      gap: 12
    },
    optionCardMobile: {
      padding: 14,
      gap: 10
    },
    optionCardTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12
    },
    optionCardHeaderMobile: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12
    },
    optionCardScan: {
      borderColor: '#1e293b'
    },
    optionIconBox: {
      width: 46,
      height: 46,
      borderRadius: 10,
      backgroundColor: 'rgba(56, 189, 248, 0.1)',
      borderWidth: 1,
      borderColor: 'rgba(244, 119, 33, 0.35)',
      justifyContent: 'center',
      alignItems: 'center'
    },
    optionIconBoxScan: {
      backgroundColor: 'rgba(52, 211, 153, 0.1)',
      borderColor: 'rgba(52, 211, 153, 0.3)'
    },
    optionContent: {
      flex: 1
    },
    optionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: isLight ? '#252525' : '#f8fafc',
      marginBottom: 2
    },
    optionSubtitle: {
      fontSize: 12,
      fontWeight: '600',
      color: isLight ? '#64748b' : '#94a3b8'
    },
    optionDescription: {
      fontSize: 12,
      color: isLight ? '#475569' : '#d8d4cb',
      lineHeight: 18
    },
    optionActionBadge: {
      alignSelf: 'flex-start',
      backgroundColor: 'rgba(56, 189, 248, 0.12)',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'rgba(244, 119, 33, 0.35)'
    },
    optionActionBadgeScan: {
      backgroundColor: 'rgba(52, 211, 153, 0.12)',
      borderColor: 'rgba(52, 211, 153, 0.3)'
    },
    optionActionText: {
      color: '#f47721',
      fontSize: 12,
      fontWeight: '700'
    },
    // Insert Document View
    dropzone: {
      borderWidth: 2,
      borderColor: isLight ? '#d8d4cb' : '#334155',
      borderStyle: 'dashed',
      borderRadius: 12,
      backgroundColor: isLight ? '#f8fafc' : '#0c1322',
      padding: 36,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 12
    },
    dropzoneIconBox: {
      width: 64,
      height: 64,
      borderRadius: 14,
      backgroundColor: 'rgba(56, 189, 248, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
    dropzoneTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: isLight ? '#252525' : '#f8fafc'
    },
    dropzoneSub: {
      fontSize: 13,
      color: isLight ? '#64748b' : '#94a3b8',
      textAlign: 'center'
    },
    supportedFormatsPill: {
      backgroundColor: isLight ? '#e5e2dc' : '#1e293b',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#334155',
      marginTop: 4
    },
    supportedFormatsText: {
      color: isLight ? '#475569' : '#94a3b8',
      fontSize: 11,
      fontWeight: '600'
    },
    selectedFileContainer: {
      backgroundColor: isLight ? '#f8fafc' : '#0c1322',
      borderRadius: 10,
      padding: 16,
      borderWidth: 1,
      borderColor: isLight ? '#d8d4cb' : '#1e293b'
    },
    selectedFileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      marginBottom: 14
    },
    fileIconBox: {
      width: 44,
      height: 44,
      borderRadius: 8,
      backgroundColor: '#1e293b',
      justifyContent: 'center',
      alignItems: 'center'
    },
    selectedFileName: {
      fontSize: 14,
      fontWeight: '700',
      color: isLight ? '#252525' : '#f8fafc',
      fontFamily: 'JetBrains Mono, monospace'
    },
    selectedFileSize: {
      fontSize: 12,
      color: isLight ? '#64748b' : '#94a3b8',
      marginTop: 2
    },
    removeFileBtn: {
      padding: 6,
      borderRadius: 6,
      backgroundColor: 'rgba(239, 68, 68, 0.1)'
    },
    insertMetaBox: {
      backgroundColor: isLight ? '#f8fafc' : '#0c1322',
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: isLight ? '#e5e2dc' : '#1e293b'
    },
    insertMetaLabel: {
      fontSize: 10,
      fontWeight: '700',
      color: isLight ? '#64748b' : '#94a3b8',
      marginBottom: 2
    },
    insertMetaValue: {
      fontSize: 13,
      fontWeight: '600',
      color: isLight ? '#252525' : '#f8fafc'
    },
    // Scan Document View
    scanSectionHeading: {
      fontSize: 11,
      fontWeight: '800',
      color: '#94a3b8',
      letterSpacing: 0.6,
      marginBottom: 10
    },
    receiptTypeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10
    },
    receiptTypeCard: {
      width: '48%',
      backgroundColor: isLight ? '#ffffff' : '#0c1322',
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: isLight ? '#e5e2dc' : '#1e293b'
    },
    receiptTypeCardActive: {
      borderColor: isLight ? '#f47721' : '#f47721',
      backgroundColor: isLight ? '#f0f9ff' : 'rgba(244, 119, 33, 0.12)'
    },
    receiptTypeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4
    },
    receiptTypeName: {
      fontSize: 13,
      fontWeight: '700',
      color: isLight ? '#252525' : '#d8d4cb'
    },
    receiptTypeNameActive: {
      color: '#f47721'
    },
    receiptTypeDesc: {
      fontSize: 11,
      color: isLight ? '#64748b' : '#64748b',
      lineHeight: 15,
      marginBottom: 8
    },
    receiptEntityBadge: {
      backgroundColor: isLight ? '#f5f3ef' : '#1e293b',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
      alignSelf: 'flex-start'
    },
    receiptEntityBadgeText: {
      fontSize: 10,
      color: isLight ? '#f47721' : '#f47721',
      fontWeight: '600'
    },
    scanMetaInputsCard: {
      backgroundColor: isLight ? '#f8fafc' : '#0c1322',
      borderRadius: 10,
      padding: 14,
      borderWidth: 1,
      borderColor: isLight ? '#e5e2dc' : '#1e293b',
      gap: 10,
      marginBottom: 16
    },
    scanTriggerGrid: {
      flexDirection: 'column',
      gap: 12,
      marginTop: 6
    },
    scanTriggerRow: {
      flexDirection: 'row',
      gap: 14,
      marginTop: 4
    },
    scanOptionBtn: {
      flex: 1,
      backgroundColor: isLight ? '#ffffff' : '#0c1322',
      borderRadius: 10,
      padding: 20,
      borderWidth: 1,
      borderColor: isLight ? '#d8d4cb' : '#1e293b',
      alignItems: 'center',
      gap: 8
    },
    scanOptionBtnNative: {
      borderColor: 'rgba(244, 119, 33, 0.35)'
    },
    scanOptionBtnUpload: {
      borderColor: 'rgba(148, 163, 184, 0.2)'
    },
    scanOptionIconBox: {
      width: 52,
      height: 52,
      borderRadius: 12,
      backgroundColor: 'rgba(52, 211, 153, 0.1)',
      borderWidth: 1,
      borderColor: 'rgba(52, 211, 153, 0.3)',
      justifyContent: 'center',
      alignItems: 'center'
    },
    scanOptionTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: isLight ? '#252525' : '#f8fafc'
    },
    scanOptionSub: {
      fontSize: 11,
      color: isLight ? '#64748b' : '#94a3b8',
      textAlign: 'center'
    },
    // Camera & Photo Preview
    cameraContainer: {
      position: 'relative',
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: '#000',
      alignItems: 'center',
      justifyContent: 'center'
    },
    cameraOverlayFrame: {
      position: 'absolute',
      top: 20,
      left: '10%',
      right: '10%',
      bottom: 60,
      borderWidth: 1,
      borderColor: 'rgba(52, 211, 153, 0.3)',
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none'
    },
    scannerCornerTL: {
      position: 'absolute',
      top: -2,
      left: -2,
      width: 20,
      height: 20,
      borderTopWidth: 3,
      borderLeftWidth: 3,
      borderColor: '#34d399'
    },
    scannerCornerTR: {
      position: 'absolute',
      top: -2,
      right: -2,
      width: 20,
      height: 20,
      borderTopWidth: 3,
      borderRightWidth: 3,
      borderColor: '#34d399'
    },
    scannerCornerBL: {
      position: 'absolute',
      bottom: -2,
      left: -2,
      width: 20,
      height: 20,
      borderBottomWidth: 3,
      borderLeftWidth: 3,
      borderColor: '#34d399'
    },
    scannerCornerBR: {
      position: 'absolute',
      bottom: -2,
      right: -2,
      width: 20,
      height: 20,
      borderBottomWidth: 3,
      borderRightWidth: 3,
      borderColor: '#34d399'
    },
    scannerGuideText: {
      position: 'absolute',
      bottom: 8,
      color: '#34d399',
      fontSize: 11,
      fontWeight: '700',
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 12,
      letterSpacing: 0.5
    },
    cameraActionRow: {
      position: 'absolute',
      bottom: 12,
      left: 0,
      right: 0,
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10
    },
    btnCaptureShutter: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: '#f47721',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 22,
      boxShadow: elev.md
    },
    btnCaptureShutterText: {
      color: '#fff',
      fontSize: 13,
      fontWeight: '700'
    },
    btnFlipCamera: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: isLight ? '#f5f3ef' : '#1e293b',
      paddingHorizontal: 12,
      paddingVertical: 9,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: isLight ? '#d8d4cb' : '#334155'
    },
    btnFlipCameraText: {
      color: isLight ? '#334155' : '#d8d4cb',
      fontSize: 12,
      fontWeight: '600'
    },
    btnCancelCamera: {
      backgroundColor: isLight ? '#f5f3ef' : '#1e293b',
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: isLight ? '#d8d4cb' : '#334155'
    },
    btnCancelCameraText: {
      color: isLight ? '#334155' : '#d8d4cb',
      fontSize: 12
    },
    scanSavingCard: {
      backgroundColor: isLight ? '#ffffff' : '#131d31',
      borderRadius: 10,
      padding: 30,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      marginVertical: 12,
      borderWidth: 1,
      borderColor: '#34d399'
    },
    scanSavingTitle: {
      color: '#34d399',
      fontSize: 15,
      fontWeight: '700'
    },
    scanSavingSub: {
      color: isLight ? '#64748b' : '#94a3b8',
      fontSize: 12,
      textAlign: 'center'
    },
    // OCR Scanning & Data Verification Styles
    ocrScanningCard: {
      backgroundColor: isLight ? '#ffffff' : '#131d31',
      borderRadius: 12,
      padding: 28,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 14,
      borderWidth: 1,
      borderColor: '#f47721',
      marginVertical: 12
    },
    ocrScanningTitle: {
      color: '#f47721',
      fontSize: 16,
      fontWeight: '700'
    },
    ocrScanningSub: {
      color: isLight ? '#64748b' : '#94a3b8',
      fontSize: 13,
      textAlign: 'center'
    },
    ocrProgressBarBg: {
      width: '100%',
      maxWidth: 320,
      height: 6,
      backgroundColor: isLight ? '#e5e2dc' : '#1e293b',
      borderRadius: 3,
      overflow: 'hidden',
      marginTop: 6
    },
    ocrProgressBarFill: {
      height: '100%',
      backgroundColor: '#f47721',
      borderRadius: 3,
      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    ocrErrorCard: {
      backgroundColor: isLight ? '#ffffff' : '#252525',
      borderRadius: 12,
      padding: 16,
      borderWidth: 1.5,
      borderColor: isLight ? '#fca5a5' : '#7f1d1d',
      gap: 14,
      marginVertical: 8
    },
    ocrErrorHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12
    },
    ocrErrorIconBox: {
      width: 44,
      height: 44,
      borderRadius: 10,
      backgroundColor: 'rgba(239, 68, 68, 0.15)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.3)'
    },
    ocrErrorTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: '#f87171'
    },
    ocrErrorSubtitle: {
      fontSize: 12,
      color: '#94a3b8',
      marginTop: 2
    },
    ocrErrorBody: {
      flexDirection: 'row',
      gap: 12,
      alignItems: 'center',
      backgroundColor: 'rgba(239, 68, 68, 0.08)',
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.2)'
    },
    ocrVerificationContainer: {
      backgroundColor: isLight ? '#f8fafc' : '#0c1322',
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: isLight ? '#d8d4cb' : '#1e293b',
      gap: 14,
      marginVertical: 8
    },
    ocrVerificationHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#1e293b'
    },
    ocrVerificationTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8
    },
    ocrVerificationTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: isLight ? '#252525' : '#f8fafc'
    },
    ocrPreviewRow: {
      flexDirection: 'row',
      gap: 14,
      alignItems: 'center',
      backgroundColor: isLight ? '#ffffff' : '#252525',
      padding: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: isLight ? '#e5e2dc' : '#1e293b'
    },
    ocrThumb: {
      width: 60,
      height: 75,
      borderRadius: 6,
      objectFit: 'cover'
    },
    ocrFieldsGrid: {
      gap: 10
    },
    ocrFieldItem: {
      gap: 4
    },
    ocrFieldLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6
    },
    ocrFieldLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: isLight ? '#475569' : '#d8d4cb'
    },
    ocrFieldInput: {
      backgroundColor: isLight ? '#ffffff' : '#0c1322',
      borderWidth: 1,
      borderColor: isLight ? '#d8d4cb' : '#334155',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 9,
      color: isLight ? '#252525' : '#f8fafc',
      fontSize: 13
    },
    ocrActionsRow: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 8
    },
    btnSaveVerified: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: '#f47721',
      paddingVertical: 12,
      borderRadius: 8
    },
    btnSaveVerifiedText: {
      color: '#ffffff',
      fontSize: 13,
      fontWeight: '700'
    },
    btnRetakeOcr: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      backgroundColor: isLight ? '#f5f3ef' : '#1e293b',
      borderWidth: 1,
      borderColor: isLight ? '#d8d4cb' : '#334155',
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderRadius: 8
    },
    btnRetakeOcrText: {
      color: isLight ? '#475569' : '#94a3b8',
      fontSize: 13,
      fontWeight: '600'
    },
    scannedImageViewerBox: {
      backgroundColor: isLight ? '#f8fafc' : '#0c1322',
      borderRadius: 8,
      padding: 8,
      borderWidth: 1,
      borderColor: isLight ? '#e5e2dc' : '#1e293b',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16
    },
    capturedContainer: {
      backgroundColor: isLight ? '#f8fafc' : '#131d31',
      borderRadius: 10,
      padding: 16,
      borderWidth: 1,
      borderColor: isLight ? '#e5e2dc' : '#1e293b'
    },
    capturedImageWrapper: {
      backgroundColor: isLight ? '#f5f3ef' : '#0c1322',
      borderRadius: 8,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14
    },
    scannedFormBox: {
      backgroundColor: isLight ? '#f8fafc' : '#0c1322',
      borderRadius: 8,
      padding: 14,
      borderWidth: 1,
      borderColor: isLight ? '#e5e2dc' : '#1e293b',
      gap: 10
    },
    scannedSuccessText: {
      fontSize: 12,
      fontWeight: '700',
      color: '#34d399'
    },
    scannedReceiptCategoryText: {
      fontSize: 12,
      color: '#94a3b8'
    },
    scannedFieldRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10
    },
    scannedFieldLabel: {
      width: 140,
      fontSize: 12,
      fontWeight: '600',
      color: isLight ? '#475569' : '#d8d4cb'
    },
    scannedInput: {
      flex: 1,
      backgroundColor: isLight ? '#ffffff' : '#1e293b',
      borderRadius: 6,
      paddingHorizontal: 10,
      paddingVertical: 6,
      color: isLight ? '#252525' : '#f8fafc',
      fontSize: 12,
      borderWidth: 1,
      borderColor: isLight ? '#d8d4cb' : '#334155',
      outlineStyle: 'none'
    },
    retakeBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 8,
      borderRadius: 6,
      backgroundColor: isLight ? '#f5f3ef' : '#1e293b',
      marginTop: 4
    },
    retakeBtnText: {
      color: isLight ? '#475569' : '#94a3b8',
      fontSize: 12,
      fontWeight: '600'
    },
    // Auth Styles
    authContainer: {
      flex: 1,
      minHeight: '100vh',
      backgroundColor: isLight ? '#f5f3ef' : '#0b1120',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    },
    authCard: {
      width: 440,
      maxWidth: '100%',
      backgroundColor: isLight ? '#ffffff' : '#252525',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: isLight ? '#e5e2dc' : '#1e293b',
      padding: 30,
      boxShadow: elev.xl
    },
    authHeader: {
      alignItems: 'center',
      marginBottom: 20
    },
    authShieldIconBox: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: isLight ? 'rgba(52, 211, 153, 0.15)' : 'rgba(52, 211, 153, 0.1)',
      borderWidth: 1,
      borderColor: isLight ? 'rgba(52, 211, 153, 0.35)' : 'rgba(52, 211, 153, 0.3)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12
    },
    authBadgePill: {
      backgroundColor: isLight ? '#fef3eb' : 'rgba(244, 119, 33, 0.12)',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 9999,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: isLight ? '#fcd3b4' : 'rgba(244, 119, 33, 0.35)'
    },
    authBadgePillText: {
      color: isLight ? '#f47721' : '#f47721',
      fontSize: 10,
      fontWeight: '800',
      letterSpacing: 0.8
    },
    authTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: isLight ? '#252525' : '#f8fafc',
      marginBottom: 6,
      textAlign: 'center'
    },
    authSubtitle: {
      fontSize: 13,
      color: isLight ? '#64748b' : '#94a3b8',
      textAlign: 'center',
      lineHeight: 18
    },
    authTabs: {
      flexDirection: 'row',
      backgroundColor: isLight ? '#f5f3ef' : '#0b1120',
      borderRadius: 8,
      padding: 4,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: isLight ? '#e5e2dc' : '#1e293b'
    },
    authTab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 8,
      borderRadius: 6
    },
    authTabActive: {
      backgroundColor: isLight ? '#ffffff' : '#1e293b'
    },
    authTabText: {
      fontSize: 12,
      fontWeight: '600',
      color: isLight ? '#64748b' : '#94a3b8'
    },
    authTabTextActive: {
      color: isLight ? '#f47721' : '#f47721',
      fontWeight: '700'
    },
    authErrorBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: 'rgba(239, 68, 68, 0.12)',
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.35)',
      padding: 10,
      borderRadius: 8,
      marginBottom: 16
    },
    authErrorText: {
      color: '#f87171',
      fontSize: 12,
      fontWeight: '600',
      flex: 1
    },
    authForm: {
      gap: 14
    },
    authFieldGroup: {
      gap: 6
    },
    authLabel: {
      fontSize: 11,
      fontWeight: '800',
      color: isLight ? '#334155' : '#94a3b8',
      letterSpacing: 0.5
    },
    authInputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isLight ? '#ffffff' : '#0b1120',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: isLight ? '#d8d4cb' : '#334155',
      paddingHorizontal: 12,
      gap: 8,
      position: 'relative'
    },
    authInputIcon: {
      marginRight: 8
    },
    authInput: {
      flex: 1,
      paddingVertical: 10,
      color: isLight ? '#252525' : '#f8fafc',
      fontSize: 13,
      outlineStyle: 'none'
    },
    authEyeBtn: {
      position: 'absolute',
      right: 12,
      padding: 4
    },
    authSubmitBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: '#f47721',
      paddingVertical: 13,
      borderRadius: 9999,
      marginTop: 8,
      cursor: 'pointer',
      borderWidth: 1,
      borderColor: '#e06412',
      boxShadow: '0 4px 14px rgba(244, 119, 33, 0.28)'
    },
    authSubmitBtnText: {
      color: '#fff',
      fontSize: 13,
      fontWeight: '700'
    },
    authFooter: {
      marginTop: 20,
      alignItems: 'center'
    },
    adminSecurityNotice: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: isLight ? 'rgba(16, 185, 129, 0.12)' : 'rgba(52, 211, 153, 0.08)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: isLight ? 'rgba(16, 185, 129, 0.25)' : 'rgba(52, 211, 153, 0.2)'
    },
    adminSecurityNoticeText: {
      color: isLight ? '#047857' : '#34d399',
      fontSize: 11,
      fontWeight: '600'
    },
    // Sidebar Admin User Styles
    sidebarAdminBox: {
      borderTopWidth: 1,
      borderTopColor: isLight ? '#e5e2dc' : '#1e293b',
      padding: 12,
      backgroundColor: isLight ? '#f8fafc' : '#0c1322',
      gap: 8
    },
    sidebarAdminRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8
    },
    adminAvatarCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: isLight ? '#fef3eb' : '#1e293b',
      borderWidth: 1,
      borderColor: isLight ? '#f47721' : '#f47721',
      alignItems: 'center',
      justifyContent: 'center'
    },
    adminAvatarInitials: {
      color: isLight ? '#f47721' : '#f47721',
      fontSize: 13,
      fontWeight: '800'
    },
    adminNameText: {
      color: isLight ? '#252525' : '#f8fafc',
      fontSize: 12,
      fontWeight: '700'
    },
    adminEmailText: {
      color: isLight ? '#64748b' : '#94a3b8',
      fontSize: 10
    },
    adminBadgePill: {
      backgroundColor: isLight ? '#fef3eb' : 'rgba(56, 189, 248, 0.12)',
      borderWidth: 1,
      borderColor: isLight ? '#fcd3b4' : 'rgba(56, 189, 248, 0.25)',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4
    },
    adminBadgePillText: {
      color: isLight ? '#f47721' : '#f47721',
      fontSize: 9,
      fontWeight: '800'
    },
    sidebarLogoutBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 6,
      borderRadius: 6,
      backgroundColor: isLight ? '#fee2e2' : 'rgba(239, 68, 68, 0.1)',
      borderWidth: 1,
      borderColor: isLight ? '#fca5a5' : 'rgba(239, 68, 68, 0.25)',
      cursor: 'pointer'
    },
    sidebarLogoutBtnText: {
      color: isLight ? '#dc2626' : '#f87171',
      fontSize: 11,
      fontWeight: '700'
    },
    // Mobile App Responsiveness Styles
    mobileTopBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 14,
      paddingVertical: 10,
      backgroundColor: isLight ? '#ffffff' : '#0c1322',
      borderBottomWidth: 1,
      borderBottomColor: isLight ? '#e5e2dc' : '#1e293b',
      zIndex: 100
    },
    mobileMenuBtn: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: isLight ? '#f5f3ef' : '#1e293b'
    },
    mobileTitleBlock: {
      alignItems: 'center',
      flex: 1,
      paddingHorizontal: 8
    },
    mobileAppTitle: {
      fontSize: 13,
      fontWeight: '800',
      color: isLight ? '#252525' : '#f8fafc',
      letterSpacing: 0.5
    },
    mobileAppSub: {
      fontSize: 11,
      color: isLight ? '#64748b' : '#94a3b8',
      fontWeight: '600'
    },
    mobileAddBtn: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: 'rgba(52, 211, 153, 0.15)'
    },
    mobileDrawerBackdrop: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(3px)',
      zIndex: 998,
      animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
    },
    mobileSidebarDrawer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      width: '85%',
      maxWidth: 320,
      height: '100%',
      backgroundColor: isLight ? '#ffffff' : '#252525',
      borderRightWidth: 1,
      borderRightColor: isLight ? '#e5e2dc' : '#1e293b',
      zIndex: 999,
      boxShadow: isLight ? '4px 0 24px rgba(0, 0, 0, 0.08)' : '6px 0 28px rgba(0, 0, 0, 0.5)',
      animation: 'slideInLeft 0.28s cubic-bezier(0.16, 1, 0.3, 1)'
    },
    mobileCloseDrawerBtn: {
      padding: 6,
      borderRadius: 6,
      backgroundColor: isLight ? '#f5f3ef' : '#1e293b'
    },
    controlBarMobile: {
      flexDirection: 'column',
      gap: 8,
      paddingHorizontal: 12,
      paddingVertical: 10
    },
    mobileCardList: {
      flex: 1,
      padding: 12
    },
    mobileCard: {
      backgroundColor: isLight ? '#ffffff' : '#252525',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isLight ? '#e5e2dc' : '#1e293b',
      padding: 14,
      marginBottom: 10,
      gap: 10,
      transition: 'transform 0.18s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.18s ease, border-color 0.18s ease'
    },
    mobileCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10
    },
    mobileCardIcon: {
      width: 38,
      height: 38,
      borderRadius: 8,
      backgroundColor: isLight ? '#f5f3ef' : '#1e293b',
      alignItems: 'center',
      justifyContent: 'center'
    },
    mobileCardTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: isLight ? '#252525' : '#f8fafc'
    },
    mobileCardCategory: {
      fontSize: 11,
      color: isLight ? '#64748b' : '#94a3b8'
    },
    mobileCardMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: isLight ? '#f8fafc' : '#0b1120',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: isLight ? '#e5e2dc' : '#1e293b'
    },
    mobileMetaItem: {
      alignItems: 'center'
    },
    mobileMetaLabel: {
      fontSize: 9,
      fontWeight: '800',
      color: isLight ? '#64748b' : '#64748b',
      letterSpacing: 0.5,
      marginBottom: 2
    },
    mobileMetaVal: {
      fontSize: 12,
      fontWeight: '600',
      color: isLight ? '#252525' : '#e5e2dc'
    },
    mobileCardActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingTop: 4
    },
    mobileBtnView: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      backgroundColor: isLight ? '#fef3eb' : 'rgba(56, 189, 248, 0.1)',
      paddingVertical: 8,
      borderRadius: 6,
      borderColor: isLight ? '#fcd3b4' : 'rgba(56, 189, 248, 0.25)'
    },
    mobileBtnViewText: {
      fontSize: 12,
      fontWeight: '700',
      color: isLight ? '#f47721' : '#f47721'
    },
    mobileBtnDelete: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderRadius: 6,
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.25)'
    },
    // --- SYSTEM LIGHT MODE STYLES ---
    containerLight: {
      backgroundColor: '#f5f3ef'
    },
    mainContentLight: {
      backgroundColor: '#f5f3ef'
    },
    contentAreaLight: {
      backgroundColor: '#f8fafc'
    },
    sidebarLight: {
      backgroundColor: '#ffffff',
      borderRightColor: '#e5e2dc'
    },
    sidebarTitleRowLight: {
      borderBottomColor: '#e5e2dc'
    },
    sidebarSectionTitleLight: {
      color: '#64748b'
    },
    sidebarCollapseBtnLight: {
      backgroundColor: '#f5f3ef'
    },
    treeItemActiveLight: {
      backgroundColor: '#fef3eb'
    },
    treeCategoryTitleLight: {
      color: '#252525'
    },
    treeTextLight: {
      color: '#334155'
    },
    treeTextActiveLight: {
      color: '#f47721'
    },
    sidebarAdminBoxLight: {
      backgroundColor: '#f8fafc',
      borderTopColor: '#e5e2dc'
    },
    adminNameTextLight: {
      color: '#252525'
    },
    adminEmailTextLight: {
      color: '#64748b'
    },
    adminBadgePillLight: {
      backgroundColor: '#fef3eb',
      borderColor: '#fcd3b4'
    },
    adminBadgePillTextLight: {
      color: '#f47721'
    },
    controlBarLight: {
      backgroundColor: '#ffffff',
      borderBottomColor: '#e5e2dc'
    },
    breadcrumbItemLight: {
      color: '#64748b'
    },
    breadcrumbActiveLight: {
      color: '#252525'
    },
    searchBoxLight: {
      backgroundColor: '#f5f3ef',
      borderColor: '#d8d4cb'
    },
    searchInputLight: {
      color: '#252525'
    },
    themeToggleBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: isLight ? '#f5f3ef' : '#1e293b',
      borderWidth: 1,
      borderColor: isLight ? '#d8d4cb' : '#334155',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 8,
      cursor: 'pointer'
    },
    themeToggleBtnLight: {
      backgroundColor: '#f5f3ef',
      borderColor: '#d8d4cb'
    },
    themeToggleBtnText: {
      fontSize: 11,
      fontWeight: '700',
      color: isLight ? '#475569' : '#d8d4cb'
    },
    themeToggleBtnTextLight: {
      color: '#6366f1'
    },
    allFilesToggleBtnLight: {
      backgroundColor: '#f5f3ef',
      borderColor: '#d8d4cb'
    },
    allFilesToggleBtnTextLight: {
      color: '#475569'
    },
    allFilesToggleBtnActiveLight: {
      backgroundColor: 'rgba(2, 132, 199, 0.1)',
      borderColor: 'rgba(244, 119, 33, 0.35)'
    },
    allFilesToggleBtnTextActiveLight: {
      color: '#f47721'
    },
    cachePillLight: {
      backgroundColor: '#f5f3ef',
      borderColor: '#d8d4cb'
    },
    cachePillTextLight: {
      color: '#475569'
    },
    countBadgeLight: {
      backgroundColor: '#f5f3ef',
      borderColor: '#d8d4cb'
    },
    countBadgeTextLight: {
      color: '#475569'
    },
    tableRowHeaderLight: {
      backgroundColor: '#e5e2dc'
    },
    thLight: {
      color: '#475569'
    },
    tableRowLight: {
      backgroundColor: '#ffffff',
      borderBottomColor: '#e5e2dc'
    },
    tableRowAltLight: {
      backgroundColor: '#f8fafc'
    },
    tdLight: {
      color: '#1e293b'
    },
    burgerToggleBtnLight: {
      backgroundColor: '#f5f3ef',
      borderColor: '#d8d4cb'
    },
    btnTableActionLight: {
      backgroundColor: '#f5f3ef',
      borderWidth: 1,
      borderColor: '#e5e2dc'
    },
    statusTagLight: {
      borderColor: 'transparent'
    },
    mobileTopBarLight: {
      backgroundColor: '#ffffff',
      borderBottomColor: '#e5e2dc'
    },
    mobileAppTitleLight: {
      color: '#252525'
    },
    mobileAppSubLight: {
      color: '#64748b'
    },
    mobileThemeBtn: {
      padding: 7,
      borderRadius: 8,
      backgroundColor: isLight ? '#f5f3ef' : '#1e293b',
      borderWidth: 1,
      borderColor: isLight ? '#d8d4cb' : '#334155',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    },
    mobileThemeBtnLight: {
      backgroundColor: '#f5f3ef',
      borderColor: '#d8d4cb'
    },
    mobileSidebarDrawerLight: {
      backgroundColor: '#ffffff',
      borderRightColor: '#e5e2dc'
    },
    mobileCardLight: {
      backgroundColor: '#ffffff',
      borderColor: '#e5e2dc'
    },
    mobileCardTitleLight: {
      color: '#252525'
    },
    mobileCardCategoryLight: {
      color: '#64748b'
    },
    mobileCardMetaLight: {
      backgroundColor: '#f8fafc',
      borderColor: '#e5e2dc'
    },
    mobileMetaLabelLight: {
      color: '#64748b'
    },
    mobileMetaValLight: {
      color: '#252525'
    },
    mobileBtnViewLight: {
      backgroundColor: '#f5f3ef'
    },
    modalDialogLight: {
      backgroundColor: '#ffffff',
      borderColor: '#d8d4cb'
    },
    modalHeaderLight: {
      backgroundColor: '#ffffff',
      borderBottomColor: '#e5e2dc'
    },
    viewerHeaderLight: {
      backgroundColor: '#ffffff',
      borderBottomColor: '#e5e2dc'
    },
    modalTitleLight: {
      color: '#252525'
    },
    modalCloseBtnLight: {
      backgroundColor: '#f5f3ef'
    },
    modalBodyLight: {
      backgroundColor: '#ffffff'
    },
    modalFooterLight: {
      borderTopColor: '#e5e2dc',
      backgroundColor: '#f8fafc'
    },
    viewerCardLight: {
      backgroundColor: '#ffffff',
      borderColor: '#e5e2dc'
    },
    viewerTitleLight: {
      color: '#252525'
    },
    viewerSubtitleLight: {
      color: '#64748b'
    },
    viewerSectionLight: {
      backgroundColor: '#f8fafc',
      borderColor: '#e5e2dc'
    },
    viewerSectionTitleLight: {
      color: '#334155'
    },
    viewerFieldLabelLight: {
      color: '#64748b'
    },
    viewerFieldValueLight: {
      color: '#252525'
    },
    notesBoxLight: {
      backgroundColor: '#f5f3ef',
      borderColor: '#e5e2dc'
    },
    notesTextLight: {
      color: '#334155'
    },
    formInputLight: {
      backgroundColor: '#f5f3ef',
      borderColor: '#d8d4cb',
      color: '#252525'
    },
    formLabelLight: {
      color: '#334155'
    },
    authCardLight: {
      backgroundColor: '#ffffff',
      borderColor: '#e5e2dc'
    },
    authTitleLight: {
      color: '#252525'
    },
    authSubtitleLight: {
      color: '#64748b'
    },
    formModalContainerLight: {
      backgroundColor: '#ffffff',
      borderColor: '#d8d4cb'
    },
    viewerModalContainerLight: {
      backgroundColor: '#ffffff',
      borderColor: '#d8d4cb'
    },
    optionCardLight: {
      backgroundColor: '#f8fafc',
      borderColor: '#e5e2dc'
    },
    optionTitleLight: {
      color: '#252525'
    },
    optionSubtitleLight: {
      color: '#64748b'
    },
    optionDescriptionLight: {
      color: '#475569'
    },
    receiptTypeCardLight: {
      backgroundColor: '#f8fafc',
      borderColor: '#e5e2dc'
    },
    receiptTypeCardActiveLight: {
      backgroundColor: '#f0fdf4',
      borderColor: '#e06412'
    },
    receiptTypeNameLight: {
      color: '#252525'
    },
    receiptTypeDescLight: {
      color: '#64748b'
    },
    receiptEntityBadgeLight: {
      backgroundColor: '#e5e2dc'
    },
    receiptEntityBadgeTextLight: {
      color: '#334155'
    },
    ocrVerificationContainerLight: {
      backgroundColor: '#f8fafc',
      borderColor: '#d8d4cb'
    },
    ocrPreviewRowLight: {
      backgroundColor: '#ffffff',
      borderColor: '#e5e2dc'
    },
    ocrFieldInputLight: {
      backgroundColor: '#ffffff',
      borderColor: '#d8d4cb',
      color: '#252525'
    },
    ocrFieldLabelLight: {
      color: '#334155'
    },
    ocrVerificationTitleLight: {
      color: '#252525'
    },
    ocrErrorCardLight: {
      backgroundColor: '#fef2f2',
      borderColor: '#fca5a5'
    },
    btnRetakeOcrLight: {
      backgroundColor: '#f5f3ef',
      borderColor: '#d8d4cb'
    },
    btnRetakeOcrTextLight: {
      color: '#334155'
    },
    // Rename Modal Styles
    renameModalContainer: {
      width: '90%',
      maxWidth: 480,
      backgroundColor: isLight ? '#ffffff' : '#252525',
      borderRadius: 14,
      borderWidth: 1,
      borderColor: isLight ? '#d8d4cb' : '#334155',
      flexDirection: 'column',
      overflow: 'hidden',
      boxShadow: elev.modal,
      animation: 'modalSlideUp 0.26s cubic-bezier(0.16, 1, 0.3, 1)'
    },
    renameModalContainerLight: {
      backgroundColor: '#ffffff',
      borderColor: '#d8d4cb'
    },
    renameModalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: isLight ? '#ffffff' : '#131d31',
      borderBottomWidth: 1,
      borderBottomColor: isLight ? '#e5e2dc' : '#1e293b'
    },
    renameIconBox: {
      width: 38,
      height: 38,
      borderRadius: 8,
      backgroundColor: isLight ? '#fef3eb' : 'rgba(56, 189, 248, 0.12)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: isLight ? '#fcd3b4' : 'rgba(56, 189, 248, 0.25)'
    },
    renameModalTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: isLight ? '#252525' : '#f8fafc'
    },
    renameModalTitleLight: {
      color: '#252525'
    },
    renameModalSubtitle: {
      fontSize: 12,
      color: isLight ? '#64748b' : '#94a3b8',
      marginTop: 2
    },
    renameModalBody: {
      padding: 20,
      backgroundColor: isLight ? '#ffffff' : '#252525'
    },
    renameFieldLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: isLight ? '#64748b' : '#94a3b8',
      letterSpacing: 0.5,
      marginBottom: 8
    },
    renameFieldLabelLight: {
      color: '#475569'
    },
    renameInput: {
      backgroundColor: isLight ? '#f8fafc' : '#1e293b',
      borderWidth: 1,
      borderColor: isLight ? '#d8d4cb' : '#334155',
      borderRadius: 8,
      paddingHorizontal: 14,
      paddingVertical: 10,
      fontSize: 14,
      fontWeight: '600',
      color: isLight ? '#252525' : '#f8fafc'
    },
    renameInputLight: {
      backgroundColor: '#f8fafc',
      borderColor: '#d8d4cb',
      color: '#252525'
    },
    renameHint: {
      fontSize: 11,
      color: isLight ? '#94a3b8' : '#64748b',
      marginTop: 8
    },
    renameModalFooter: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 20,
      paddingVertical: 14,
      backgroundColor: isLight ? '#f8fafc' : '#131d31',
      borderTopWidth: 1,
      borderTopColor: isLight ? '#e5e2dc' : '#1e293b'
    }
  });
}

