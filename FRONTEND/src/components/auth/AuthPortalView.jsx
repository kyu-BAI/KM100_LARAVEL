import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import {
  ShieldCheck,
  UserCheck,
  Building2,
  LogIn,
  UserPlus,
  Mail,
  Lock,
  Key,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  User
} from 'lucide-react';

export default function AuthPortalView({
  authPortal,
  switchAuthPortal,
  authMode,
  setAuthMode,
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  authConfirmPassword,
  setAuthConfirmPassword,
  authFullName,
  setAuthFullName,
  authAdminEmail,
  setAuthAdminEmail,
  authAdminPassword,
  setAuthAdminPassword,
  showPassword,
  setShowPassword,
  authLoading,
  authError,
  setAuthError,
  handleAuthSubmit,
  isLight,
  notification,
  styles,
  isMobile
}) {
  const isEmployeePortal = authPortal === 'employee';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isLight ? '#f5f3ef' : '#0b1120' }}
      contentContainerStyle={[styles.authContainer, isMobile && { padding: 12 }, { flexGrow: 1, position: 'relative' }]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {notification && (
        <View style={[styles.toast, notification.type === 'error' ? styles.toastError : styles.toastSuccess]}>
          {notification.type === 'error' ? <AlertTriangle size={18} color="#fff" /> : <CheckCircle2 size={18} color="#fff" />}
          <Text style={styles.toastText}>{notification.text}</Text>
        </View>
      )}

      <View
        accessibilityRole="main"
        style={[styles.authCard, isMobile && { padding: 18, borderRadius: 12 }, isLight && styles.authCardLight]}
      >
        {/* Top Brand Logo */}
        <View style={styles.authHeader}>
          <View style={{ alignItems: 'center', marginBottom: 12 }}>
            <View style={{
              width: 76,
              height: 76,
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isLight ? '0 8px 20px -4px rgba(0, 0, 0, 0.1), 0 3px 6px -2px rgba(0, 0, 0, 0.05)' : '0 8px 20px -4px rgba(0, 0, 0, 0.4), 0 3px 6px -2px rgba(0, 0, 0, 0.25)'
            }}>
              <Image
                source={{ uri: '/km100-logo.png' }}
                accessibilityLabel="KM100 Skills & Training Center Inc. Logo"
                alt="KM100 Skills & Training Center Inc. Logo"
                style={{ width: '100%', height: '100%' }}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Portal Badge */}
          <View style={[
            styles.authBadgePill,
            isEmployeePortal && {
              backgroundColor: isLight ? '#fef3eb' : 'rgba(244, 119, 33, 0.15)',
              borderColor: isLight ? '#fcd3b4' : 'rgba(244, 119, 33, 0.35)'
            }
          ]}>
            <Text style={[
              styles.authBadgePillText,
              isEmployeePortal && { color: '#f47721' }
            ]}>
              {isEmployeePortal ? 'STAFF & EMPLOYEE PORTAL' : 'OFFICIAL ADMINISTRATOR PORTAL'}
            </Text>
          </View>

          <Text
            style={[styles.authTitle, isLight && styles.authTitleLight]}
            accessibilityRole="header"
            aria-level="1"
          >
            <Text style={{ color: '#f47721', fontWeight: '800' }}>KM</Text>
            <Text style={{ color: isLight ? '#252525' : '#f8fafc', fontWeight: '800' }}>100 </Text>
            <Text style={{ color: isLight ? '#252525' : '#f8fafc', fontWeight: '700' }}>Skills & Training Center</Text>
          </Text>

          <Text style={[styles.authSubtitle, isLight && { color: '#666666' }]}>
            {isEmployeePortal
              ? 'Sign in with your employee account to view assigned branch records.'
              : authMode === 'login'
                ? 'Sign in with your Administrator credentials to access full system records.'
                : 'Register a new Administrator account with full system privileges.'}
          </Text>
        </View>

        {/* Portal Switcher Tabs: Admin Portal vs Employee Portal */}
        <View style={{
          flexDirection: 'row',
          backgroundColor: isLight ? '#f5f3ef' : '#1e293b',
          borderRadius: 9999,
          padding: 4,
          marginBottom: 18,
          borderWidth: 1,
          borderColor: isLight ? '#e5e2dc' : '#334155',
          gap: 4
        }}>
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 9,
              borderRadius: 9999,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              backgroundColor: !isEmployeePortal ? (isLight ? '#252525' : '#f47721') : 'transparent',
              boxShadow: !isEmployeePortal ? (isLight ? '0 1px 4px rgba(0,0,0,0.12)' : '0 1px 3px rgba(0,0,0,0.3)') : 'none'
            }}
            onPress={() => switchAuthPortal('admin')}
            accessibilityRole="tab"
            accessibilityLabel="Switch to Administrator Portal"
            accessibilityState={{ selected: !isEmployeePortal }}
          >
            <ShieldCheck size={14} color={!isEmployeePortal ? '#ffffff' : (isLight ? '#666666' : '#94a3b8')} />
            <Text style={{
              fontSize: 12,
              fontWeight: '700',
              color: !isEmployeePortal ? '#ffffff' : (isLight ? '#666666' : '#94a3b8')
            }}>
              Administrator
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 9,
              borderRadius: 9999,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              backgroundColor: isEmployeePortal ? (isLight ? '#252525' : '#f47721') : 'transparent',
              boxShadow: isEmployeePortal ? (isLight ? '0 1px 4px rgba(0,0,0,0.12)' : '0 1px 3px rgba(0,0,0,0.3)') : 'none'
            }}
            onPress={() => switchAuthPortal('employee')}
            accessibilityRole="tab"
            accessibilityLabel="Switch to Employee Staff Portal"
            accessibilityState={{ selected: isEmployeePortal }}
          >
            <UserCheck size={14} color={isEmployeePortal ? '#ffffff' : (isLight ? '#666666' : '#94a3b8')} />
            <Text style={{
              fontSize: 12,
              fontWeight: '700',
              color: isEmployeePortal ? '#ffffff' : (isLight ? '#666666' : '#94a3b8')
            }}>
              Employee Staff
            </Text>
          </TouchableOpacity>
        </View>

        {/* ADMIN PORTAL ONLY: Mode Switch Tabs (Sign In vs Create Admin) */}
        {!isEmployeePortal && (
          <View style={styles.authTabs}>
            <TouchableOpacity
              style={[styles.authTab, authMode === 'login' && styles.authTabActive]}
              onPress={() => {
                setAuthMode('login');
                if (setAuthError) setAuthError('');
              }}
              accessibilityRole="tab"
              accessibilityLabel="Admin Sign In Tab"
              accessibilityState={{ selected: authMode === 'login' }}
            >
              <LogIn size={15} color={authMode === 'login' ? '#f47721' : (isLight ? '#475569' : '#94a3b8')} />
              <Text style={[styles.authTabText, isLight && { color: '#475569' }, authMode === 'login' && styles.authTabTextActive]}>Admin Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.authTab, authMode === 'register' && styles.authTabActive]}
              onPress={() => {
                setAuthMode('register');
                if (setAuthError) setAuthError('');
              }}
              accessibilityRole="tab"
              accessibilityLabel="Create Admin Account Tab"
              accessibilityState={{ selected: authMode === 'register' }}
            >
              <UserPlus size={15} color={authMode === 'register' ? '#f47721' : (isLight ? '#475569' : '#94a3b8')} />
              <Text style={[styles.authTabText, isLight && { color: '#475569' }, authMode === 'register' && styles.authTabTextActive]}>Create Admin</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Error Message Box */}
        {authError ? (
          <View style={styles.authErrorBox}>
            <AlertTriangle size={16} color="#ef4444" />
            <Text style={styles.authErrorText}>{authError}</Text>
          </View>
        ) : null}

        {/* Form Fields */}
        <View style={styles.authForm}>
          {/* Full Name field (Only in Admin registration mode) */}
          {!isEmployeePortal && authMode === 'register' && (
            <View style={styles.authInputGroup}>
              <Text style={[styles.authLabel, isLight && styles.authLabelLight]}>ADMIN FULL NAME</Text>
              <View style={[styles.authInputWrapper, isLight && styles.authInputWrapperLight]}>
                <User size={16} color={isLight ? '#475569' : '#94a3b8'} />
                <TextInput
                  style={[styles.authInput, isLight && styles.authInputLight]}
                  placeholder="Enter your full name"
                  placeholderTextColor={isLight ? '#64748b' : '#94a3b8'}
                  value={authFullName}
                  onChangeText={setAuthFullName}
                  accessibilityLabel="Admin Full Name"
                  autoComplete="off"
                  autoCorrect={false}
                  spellCheck={false}
                />
              </View>
            </View>
          )}

          {/* Email Field */}
          <View style={styles.authInputGroup}>
            <Text style={[styles.authLabel, isLight && styles.authLabelLight]}>
              {isEmployeePortal ? 'EMPLOYEE EMAIL' : 'ADMIN EMAIL'}
            </Text>
            <View style={[styles.authInputWrapper, isLight && styles.authInputWrapperLight]}>
              <Mail size={16} color={isLight ? '#475569' : '#94a3b8'} />
              <TextInput
                style={[styles.authInput, isLight && styles.authInputLight]}
                placeholder={isEmployeePortal ? 'knoahmari@km100.ph' : 'admin@km100.ph'}
                placeholderTextColor={isLight ? '#64748b' : '#94a3b8'}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                spellCheck={false}
                value={authEmail}
                onChangeText={setAuthEmail}
                accessibilityLabel={isEmployeePortal ? "Employee Email Address" : "Administrator Email Address"}
              />
            </View>
          </View>

          {/* Password Field */}
          <View style={styles.authInputGroup}>
            <Text style={[styles.authLabel, isLight && styles.authLabelLight]}>PASSWORD</Text>
            <View style={[styles.authInputWrapper, isLight && styles.authInputWrapperLight]}>
              <Lock size={16} color={isLight ? '#475569' : '#94a3b8'} />
              <TextInput
                style={[styles.authInput, isLight && styles.authInputLight, { paddingRight: 36 }]}
                placeholder="Enter your password"
                placeholderTextColor={isLight ? '#64748b' : '#94a3b8'}
                secureTextEntry={!showPassword}
                autoComplete="new-password"
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
                value={authPassword}
                onChangeText={setAuthPassword}
                accessibilityLabel="Account Password"
              />
              <TouchableOpacity
                style={{ position: 'absolute', right: 10, minWidth: 32, minHeight: 32, alignItems: 'center', justifyContent: 'center' }}
                onPress={() => setShowPassword(p => !p)}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                {showPassword ? <EyeOff size={16} color="#94a3b8" /> : <Eye size={16} color="#94a3b8" />}
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password (Admin registration only) */}
          {!isEmployeePortal && authMode === 'register' && (
            <View style={styles.authInputGroup}>
              <Text style={[styles.authLabel, isLight && styles.authLabelLight]}>CONFIRM PASSWORD</Text>
              <View style={[styles.authInputWrapper, isLight && styles.authInputWrapperLight]}>
                <Key size={16} color={isLight ? '#475569' : '#94a3b8'} />
                <TextInput
                  style={[styles.authInput, isLight && styles.authInputLight]}
                  placeholder="Re-enter password"
                  placeholderTextColor={isLight ? '#64748b' : '#94a3b8'}
                  secureTextEntry={!showPassword}
                  autoComplete="new-password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  spellCheck={false}
                  value={authConfirmPassword}
                  onChangeText={setAuthConfirmPassword}
                  accessibilityLabel="Confirm Password"
                />
              </View>
            </View>
          )}

          {/* Authorizing Existing Admin Credentials (Required for registration when an admin already exists) */}
          {!isEmployeePortal && authMode === 'register' && (
            <View style={{ gap: 10, marginTop: 4, padding: 12, backgroundColor: isLight ? '#f1f5f9' : '#0f172a', borderRadius: 8, borderWidth: 1, borderColor: isLight ? '#cbd5e1' : '#1e293b' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={14} color="#f47721" />
                <Text style={{ fontSize: 11, fontWeight: '700', color: isLight ? '#334155' : '#e2e8f0' }}>
                  AUTHORIZING EXISTING ADMIN
                </Text>
              </View>
              <Text style={{ fontSize: 11, color: isLight ? '#64748b' : '#94a3b8', lineHeight: 15 }}>
                Enter credentials of an active administrator (e.g. admin@km100.ph / Admin123!) to authorize this new admin:
              </Text>
              <View style={styles.authInputGroup}>
                <Text style={[styles.authLabel, isLight && styles.authLabelLight, { fontSize: 10 }]}>EXISTING ADMIN EMAIL</Text>
                <View style={[styles.authInputWrapper, isLight && styles.authInputWrapperLight]}>
                  <Mail size={14} color={isLight ? '#475569' : '#94a3b8'} />
                  <TextInput
                    style={[styles.authInput, isLight && styles.authInputLight, { fontSize: 12 }]}
                    placeholder="admin@km100.ph"
                    placeholderTextColor={isLight ? '#64748b' : '#94a3b8'}
                    value={authAdminEmail}
                    onChangeText={setAuthAdminEmail}
                    autoCapitalize="none"
                    autoComplete="off"
                  />
                </View>
              </View>
              <View style={styles.authInputGroup}>
                <Text style={[styles.authLabel, isLight && styles.authLabelLight, { fontSize: 10 }]}>EXISTING ADMIN PASSWORD</Text>
                <View style={[styles.authInputWrapper, isLight && styles.authInputWrapperLight]}>
                  <Lock size={14} color={isLight ? '#475569' : '#94a3b8'} />
                  <TextInput
                    style={[styles.authInput, isLight && styles.authInputLight, { fontSize: 12 }]}
                    placeholder="Existing admin password (Admin123!)"
                    placeholderTextColor={isLight ? '#64748b' : '#94a3b8'}
                    secureTextEntry
                    value={authAdminPassword}
                    onChangeText={setAuthAdminPassword}
                    autoCapitalize="none"
                    autoComplete="off"
                  />
                </View>
              </View>
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.authSubmitBtn,
              authLoading && { opacity: 0.7 }
            ]}
            onPress={handleAuthSubmit}
            disabled={authLoading}
            accessibilityRole="button"
            accessibilityLabel={isEmployeePortal ? "Sign in to Employee Staff Portal" : (authMode === 'login' ? "Sign in as Administrator" : "Create New Administrator Account")}
          >
            {authLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                {isEmployeePortal ? (
                  <UserCheck size={18} color="#ffffff" />
                ) : authMode === 'login' ? (
                  <LogIn size={18} color="#ffffff" />
                ) : (
                  <UserPlus size={18} color="#ffffff" />
                )}
                <Text style={styles.authSubmitBtnText}>
                  {isEmployeePortal
                    ? 'Sign In to Employee Portal'
                    : authMode === 'login'
                      ? 'Sign In as Administrator'
                      : 'Create Administrator Account'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Bottom Portal Switcher Link */}
          <View style={{ alignItems: 'center', marginTop: 14 }}>
            <TouchableOpacity
              onPress={() => switchAuthPortal(isEmployeePortal ? 'admin' : 'employee')}
              style={{ paddingVertical: 4 }}
            >
              <Text style={{
                fontSize: 12,
                fontWeight: '600',
                color: isLight ? '#f47721' : '#f47721',
                textDecorationLine: 'underline'
              }}>
                {isEmployeePortal
                  ? '← Are you an Administrator? Switch to Admin Portal'
                  : 'Branch Staff Member? Switch to Employee Portal →'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
