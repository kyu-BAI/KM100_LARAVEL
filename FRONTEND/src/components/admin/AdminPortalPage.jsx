import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import {
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  LogOut,
  UserPlus,
  AlertTriangle,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  Trash2
} from 'lucide-react';

export default function AdminPortalPage({
  currentUser,
  onLogout,
  onBackToInventory,
  employees,
  handleCreateEmployee,
  handleDeleteEmployee,
  empFullName,
  setEmpFullName,
  empEmail,
  setEmpEmail,
  empPassword,
  setEmpPassword,
  empConfirmPassword,
  setEmpConfirmPassword,
  empRole,
  setEmpRole,
  empDepartment,
  setEmpDepartment,
  showEmpPassword,
  setShowEmpPassword,
  empLoading,
  empError,
  EMPLOYEE_ROLES,
  EMPLOYEE_DEPARTMENTS,
  isLight,
  isMobile,
  styles
}) {
  return (
    <ScrollView
      style={[styles.contentArea, isLight && styles.contentAreaLight]}
      contentContainerStyle={{ padding: isMobile ? 14 : 26, gap: 22, maxWidth: 1200, width: '100%', alignSelf: 'center' }}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Navigation Bar of Admin Page */}
      <View style={[styles.adminPortalHeader, isLight && styles.adminPortalHeaderLight]}>
        <View style={{ gap: 4, flex: 1, minWidth: 260 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <ShieldCheck size={24} color={isLight ? '#f47721' : '#f47721'} />
            <Text style={[styles.adminPortalTitle, isLight && styles.adminPortalTitleLight]}>
              Administrator & Staff Management
            </Text>
          </View>
          <Text style={[styles.adminPortalSub, isLight && styles.adminPortalSubLight]}>
            Manage admin credentials, sign out securely, and register employee staff accounts.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.adminBackBtn, isLight && styles.adminBackBtnLight]}
          onPress={onBackToInventory}
          title="Return to documents inventory"
        >
          <ArrowLeft size={16} color={isLight ? '#f47721' : '#f47721'} />
          <Text style={[styles.adminBackBtnText, isLight && styles.adminBackBtnTextLight]}>
            Back to Inventory Records
          </Text>
        </TouchableOpacity>
      </View>

      {/* Top Grid: Admin Account Info on Left + Employee Creation Form on Right */}
      <View style={[styles.adminGrid, isMobile && { flexDirection: 'column' }]}>
        {/* Card 1: Admin Profile & Secure Logout */}
        <View style={[styles.adminProfileCard, isLight && styles.adminProfileCardLight]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={styles.adminLargeAvatarCircle}>
              <Text style={styles.adminLargeAvatarInitials}>
                {(currentUser?.fullName || currentUser?.email || 'A').charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
              <Text style={[styles.adminProfileName, isLight && styles.adminProfileNameLight]} numberOfLines={1}>
                {currentUser?.fullName || 'System Administrator'}
              </Text>
              <Text style={[styles.adminProfileEmail, isLight && styles.adminProfileEmailLight]} numberOfLines={1}>
                {currentUser?.email}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <View style={[styles.adminBadgePill, isLight && styles.adminBadgePillLight]}>
                  <Text style={[styles.adminBadgePillText, isLight && styles.adminBadgePillTextLight]}>
                    {currentUser?.role ? currentUser.role.toUpperCase() : 'ADMINISTRATOR'}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#10b981' }} />
                  <Text style={{ fontSize: 11, color: '#10b981', fontWeight: '700' }}>Active</Text>
                </View>
              </View>
            </View>
          </View>

          {/* System Privileges Box */}
          <View style={[styles.adminPrivilegesBox, isLight && styles.adminPrivilegesBoxLight]}>
            <Text style={[styles.adminPrivilegesHeading, isLight && styles.adminPrivilegesHeadingLight]}>
              ADMINISTRATOR PRIVILEGES
            </Text>
            <View style={{ gap: 8, marginTop: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={14} color="#10b981" />
                <Text style={[styles.privilegeItemText, isLight && styles.privilegeItemTextLight]}>
                  Full Document CRUD & Database Sync
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={14} color="#10b981" />
                <Text style={[styles.privilegeItemText, isLight && styles.privilegeItemTextLight]}>
                  Executive Excel (.xlsx) Audit Reports
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={14} color="#10b981" />
                <Text style={[styles.privilegeItemText, isLight && styles.privilegeItemTextLight]}>
                  Optical Character Recognition (OCR)
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={14} color="#10b981" />
                <Text style={[styles.privilegeItemText, isLight && styles.privilegeItemTextLight]}>
                  Staff Account Provisioning & Roles
                </Text>
              </View>
            </View>
          </View>

          {/* The Secure Logout Option */}
          <View style={{ marginTop: 'auto', paddingTop: 14 }}>
            <Text style={{ fontSize: 11, color: isLight ? '#94a3b8' : '#64748b', marginBottom: 8 }}>
              Session Security:
            </Text>
            <TouchableOpacity
              style={[styles.adminLogoutBtn, isLight && styles.adminLogoutBtnLight]}
              onPress={onLogout}
              title="End your session and sign out"
            >
              <LogOut size={16} color="#ef4444" />
              <Text style={styles.adminLogoutBtnText}>Log Out of Administrator Account</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Card 2: Employee Account Creation System */}
        <View style={[styles.employeeFormCard, isLight && styles.employeeFormCardLight]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingBottom: 4 }}>
            <View style={[styles.empIconBadge, { backgroundColor: isLight ? '#fef3eb' : 'rgba(2, 132, 199, 0.15)' }]}>
              <UserPlus size={20} color={isLight ? '#f47721' : '#f47721'} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, isLight && styles.cardTitleLight]}>
                {empRole === 'Admin' ? 'Register New Administrator Account' : 'Register New Employee Account'}
              </Text>
              <Text style={[styles.cardSubtitle, isLight && styles.cardSubtitleLight]}>
                {empRole === 'Admin'
                  ? 'Add credentials for a new full-access system administrator.'
                  : 'Add credentials and assign access branches for staff members.'}
              </Text>
            </View>
          </View>

          {empError ? (
            <View style={styles.authErrorBox}>
              <AlertTriangle size={15} color="#ef4444" />
              <Text style={styles.authErrorText}>{empError}</Text>
            </View>
          ) : null}

          <View style={{ gap: 12 }}>
            {/* Name Input */}
            <View style={{ gap: 4 }}>
              <Text style={[styles.formFieldLabel, isLight && styles.formFieldLabelLight]}>EMPLOYEE FULL NAME</Text>
              <View style={[styles.formInputWrapper, isLight && styles.formInputWrapperLight]}>
                <User size={15} color={isLight ? '#64748b' : '#94a3b8'} />
                <TextInput
                  style={[styles.formFieldInput, isLight && styles.formFieldInputLight]}
                  placeholder="e.g. Maria Santos"
                  placeholderTextColor={isLight ? '#94a3b8' : '#64748b'}
                  autoComplete="off"
                  autoCorrect={false}
                  spellCheck={false}
                  value={empFullName}
                  onChangeText={setEmpFullName}
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={{ gap: 4 }}>
              <Text style={[styles.formFieldLabel, isLight && styles.formFieldLabelLight]}>EMPLOYEE EMAIL ADDRESS</Text>
              <View style={[styles.formInputWrapper, isLight && styles.formInputWrapperLight]}>
                <Mail size={15} color={isLight ? '#64748b' : '#94a3b8'} />
                <TextInput
                  style={[styles.formFieldInput, isLight && styles.formFieldInputLight]}
                  placeholder="employee@km100.ph"
                  placeholderTextColor={isLight ? '#94a3b8' : '#64748b'}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect={false}
                  spellCheck={false}
                  value={empEmail}
                  onChangeText={setEmpEmail}
                />
              </View>
            </View>

            {/* Password & Confirm Inputs */}
            <View style={[styles.passwordGridRow, isMobile && { flexDirection: 'column', gap: 10 }]}>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={[styles.formFieldLabel, isLight && styles.formFieldLabelLight]}>INITIAL PASSWORD</Text>
                <View style={[styles.formInputWrapper, isLight && styles.formInputWrapperLight]}>
                  <Lock size={15} color={isLight ? '#64748b' : '#94a3b8'} />
                  <TextInput
                    style={[styles.formFieldInput, isLight && styles.formFieldInputLight, { paddingRight: 32 }]}
                    placeholder="Min. 6 chars"
                    placeholderTextColor={isLight ? '#94a3b8' : '#64748b'}
                    secureTextEntry={!showEmpPassword}
                    autoComplete="new-password"
                    autoCapitalize="none"
                    autoCorrect={false}
                    spellCheck={false}
                    value={empPassword}
                    onChangeText={setEmpPassword}
                  />
                  <TouchableOpacity
                    style={{ position: 'absolute', right: 8 }}
                    onPress={() => setShowEmpPassword(p => !p)}
                  >
                    {showEmpPassword ? <EyeOff size={14} color="#94a3b8" /> : <Eye size={14} color="#94a3b8" />}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ flex: 1, gap: 4 }}>
                <Text style={[styles.formFieldLabel, isLight && styles.formFieldLabelLight]}>CONFIRM PASSWORD</Text>
                <View style={[styles.formInputWrapper, isLight && styles.formInputWrapperLight]}>
                  <Lock size={15} color={isLight ? '#64748b' : '#94a3b8'} />
                  <TextInput
                    style={[styles.formFieldInput, isLight && styles.formFieldInputLight]}
                    placeholder="Re-enter password"
                    placeholderTextColor={isLight ? '#94a3b8' : '#64748b'}
                    secureTextEntry={!showEmpPassword}
                    autoComplete="new-password"
                    autoCapitalize="none"
                    autoCorrect={false}
                    spellCheck={false}
                    value={empConfirmPassword}
                    onChangeText={setEmpConfirmPassword}
                  />
                </View>
              </View>
            </View>

            {/* Role Selector */}
            <View style={{ gap: 6 }}>
              <Text style={[styles.formFieldLabel, isLight && styles.formFieldLabelLight]}>ASSIGNED ROLE</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {EMPLOYEE_ROLES.map(role => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.empRoleChip,
                      isLight && styles.empRoleChipLight,
                      empRole === role && styles.empRoleChipActive
                    ]}
                    onPress={() => {
                      setEmpRole(role);
                      if (role === 'Admin') {
                        setEmpDepartment('Administration');
                      } else if (empDepartment === 'Administration') {
                        setEmpDepartment('PETC');
                      }
                    }}
                  >
                    <Text style={[
                      styles.empRoleChipText,
                      isLight && styles.empRoleChipTextLight,
                      empRole === role && styles.empRoleChipTextActive
                    ]}>
                      {role}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Department Assignment (Hidden when Admin is selected, since Admins have access to All branches) */}
            {empRole !== 'Admin' && (
              <View style={{ gap: 6 }}>
                <Text style={[styles.formFieldLabel, isLight && styles.formFieldLabelLight]}>ASSIGNED BRANCH / DEPARTMENT</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {EMPLOYEE_DEPARTMENTS.map(dept => (
                    <TouchableOpacity
                      key={dept}
                      style={[
                        styles.empRoleChip,
                        isLight && styles.empRoleChipLight,
                        empDepartment === dept && styles.empRoleChipActive
                      ]}
                      onPress={() => setEmpDepartment(dept)}
                    >
                      <Text style={[
                        styles.empRoleChipText,
                        isLight && styles.empRoleChipTextLight,
                        empDepartment === dept && styles.empRoleChipTextActive
                      ]}>
                        {dept}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.btnCreateEmployee, empLoading && { opacity: 0.6 }]}
              onPress={handleCreateEmployee}
              disabled={empLoading}
            >
              {empLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <UserPlus size={16} color="#ffffff" />
                  <Text style={styles.btnCreateEmployeeText}>
                    {empRole === 'Admin' ? 'Create Administrator Account' : 'Create Employee Account'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Bottom Card: Registered Employee Accounts Directory */}
      <View style={[styles.accountsListCard, isLight && styles.accountsListCardLight]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <View style={{ gap: 2 }}>
            <Text style={[styles.cardTitle, isLight && styles.cardTitleLight]}>
              Employee Staff Directory ({employees.length})
            </Text>
            <Text style={[styles.cardSubtitle, isLight && styles.cardSubtitleLight]}>
              Active staff members with granted portal access credentials.
            </Text>
          </View>
        </View>

        <View style={{ gap: 8, marginTop: 4 }}>
          {employees.map(emp => (
            <View key={emp.id} style={[styles.employeeRowCard, isLight && styles.employeeRowCardLight]}>
              <View style={styles.empAvatarCircle}>
                <Text style={styles.empAvatarInitials}>
                  {emp.fullName ? emp.fullName.charAt(0).toUpperCase() : 'E'}
                </Text>
              </View>
              <View style={{ flex: 1, minWidth: 150, gap: 2 }}>
                <Text style={[styles.empNameText, isLight && styles.empNameTextLight]}>
                  {emp.fullName}
                </Text>
                <Text style={[styles.empEmailText, isLight && styles.empEmailTextLight]}>
                  {emp.email}
                </Text>
              </View>

              <View style={{ gap: 3, minWidth: 140 }}>
                <View style={[styles.empRoleBadge, isLight && styles.empRoleBadgeLight]}>
                  <Text style={[styles.empRoleBadgeText, isLight && styles.empRoleBadgeTextLight]}>
                    {emp.role}
                  </Text>
                </View>
                <Text style={{ fontSize: 10, color: isLight ? '#64748b' : '#94a3b8' }}>
                  {emp.department}
                </Text>
              </View>

              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#10b981' }} />
                  <Text style={{ fontSize: 11, color: '#10b981', fontWeight: '700' }}>Active</Text>
                </View>
                <Text style={{ fontSize: 10, color: isLight ? '#94a3b8' : '#64748b' }}>
                  Joined {emp.createdAt}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.empDeleteBtn}
                onPress={() => handleDeleteEmployee(emp.id, emp.fullName)}
                title={`Revoke account for ${emp.fullName}`}
              >
                <Trash2 size={14} color="#f87171" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
