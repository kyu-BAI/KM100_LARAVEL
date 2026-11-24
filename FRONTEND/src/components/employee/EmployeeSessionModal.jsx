import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { UserCheck, Building2, LogOut, X } from 'lucide-react';

export default function EmployeeSessionModal({
  visible,
  onClose,
  currentUser,
  onLogout,
  isLight,
  styles,
  isMobile
}) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, isMobile && styles.modalOverlayMobile]}>
        <View style={[
          styles.modalCard,
          {
            maxWidth: 440,
            width: '92%',
            padding: 24,
            borderRadius: 18,
            backgroundColor: isLight ? '#ffffff' : '#252525',
            borderColor: isLight ? '#e2e8f0' : '#1e293b',
            borderWidth: 1,
            boxShadow: isLight
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.06)'
              : '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08)'
          },
          isLight && styles.modalCardLight
        ]}>
          {/* Modal Header */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: isLight ? '#e2e8f0' : '#1e293b'
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: isLight ? '#fef3eb' : 'rgba(244, 119, 33, 0.15)',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <UserCheck size={18} color="#f47721" />
              </View>
              <Text style={{ fontSize: 16, fontWeight: '800', color: isLight ? '#252525' : '#f8fafc' }}>
                Employee Staff Session
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isLight ? '#f5f3ef' : '#1e293b'
              }}
            >
              <X size={16} color={isLight ? '#666666' : '#94a3b8'} />
            </TouchableOpacity>
          </View>

          <View style={{ gap: 16, paddingTop: 18 }}>
            {/* Profile Card */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View style={{
                width: 54,
                height: 54,
                borderRadius: 27,
                backgroundColor: '#f47721',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(244, 119, 33, 0.25)',
                flexShrink: 0
              }}>
                <Text style={{ fontSize: 22, fontWeight: '800', color: '#ffffff' }}>
                  {(currentUser?.fullName || 'E').charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                <Text style={{ fontSize: 17, fontWeight: '800', color: isLight ? '#252525' : '#f8fafc' }} numberOfLines={1}>
                  {currentUser?.fullName}
                </Text>
                <Text style={{ fontSize: 13, color: isLight ? '#475569' : '#94a3b8', fontWeight: '500' }} numberOfLines={1}>
                  {currentUser?.email}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <View style={{
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: 6,
                    backgroundColor: isLight ? '#fef3eb' : 'rgba(56, 189, 248, 0.15)',
                    borderWidth: 1,
                    borderColor: isLight ? '#fcd3b4' : 'rgba(56, 189, 248, 0.3)'
                  }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: isLight ? '#f47721' : '#f47721' }}>
                      {currentUser?.employeeRole || 'STAFF'}
                    </Text>
                  </View>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    paddingHorizontal: 7,
                    paddingVertical: 3,
                    borderRadius: 6,
                    backgroundColor: isLight ? '#dcfce7' : 'rgba(16, 185, 129, 0.15)',
                    borderWidth: 1,
                    borderColor: isLight ? '#bbf7d0' : 'rgba(16, 185, 129, 0.25)'
                  }}>
                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#10b981' }} />
                    <Text style={{ fontSize: 11, color: isLight ? '#15803d' : '#34d399', fontWeight: '700' }}>Active</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Branch Restriction Scope Card */}
            <View style={{
              backgroundColor: isLight ? '#f0fdf4' : 'rgba(16, 185, 129, 0.08)',
              borderWidth: 1,
              borderColor: isLight ? '#bbf7d0' : 'rgba(16, 185, 129, 0.25)',
              borderRadius: 12,
              padding: 14,
              gap: 6
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                <Building2 size={16} color="#059669" />
                <Text style={{ fontSize: 12, fontWeight: '800', color: isLight ? '#166534' : '#34d399', letterSpacing: 0.5 }}>
                  ASSIGNED SCOPE: {(currentUser?.department)}
                </Text>
              </View>
              <Text style={{ fontSize: 12, color: isLight ? '#166534' : '#a7f3d0', lineHeight: 18 }}>
                Access Level: Limited strictly to {(currentUser?.department)} records. Administrative tools and employee creation are restricted.
              </Text>
            </View>

            {/* Logout Button */}
            <View style={{ paddingTop: 4 }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  paddingVertical: 12,
                  borderRadius: 10,
                  backgroundColor: isLight ? '#fee2e2' : 'rgba(239, 68, 68, 0.15)',
                  borderWidth: 1,
                  borderColor: isLight ? '#fca5a5' : 'rgba(239, 68, 68, 0.3)',
                  cursor: 'pointer'
                }}
                onPress={() => {
                  onClose();
                  onLogout();
                }}
              >
                <LogOut size={16} color="#dc2626" />
                <Text style={{ fontSize: 13, fontWeight: '800', color: isLight ? '#dc2626' : '#f87171' }}>
                  Log Out of Staff Account
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
