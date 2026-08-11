import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { ProfileTheme } from './theme';

const SETTINGS_ITEMS = [
  { id: '1', title: 'Edit Profile', route: '/(student)/profile/edit' },
  { id: '2', title: 'Security & Password', route: '/(student)/profile/security' },
  { id: '3', title: 'Notification Preferences', route: '/(student)/profile/notifications' },
  { id: '4', title: 'Learning Preferences', route: '/(student)/profile/learning-preferences' },
  { id: '5', title: 'Privacy Settings', route: '/(student)/profile/privacy' },
  { id: 'policies', title: 'Legal & Policies', route: '/(student)/profile/policies' },
  { id: '6', title: 'Help & Support', route: '/(student)/profile/help' },
];

export const SettingsSection = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const isTrader = user?.role === 'trader';

  const visibleSettings = SETTINGS_ITEMS.filter(item => {
    if (isTrader && item.id === '4') return false; // Hide Learning Preferences for traders
    return true;
  });

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Account Settings</Text>

      <View style={styles.listContainer}>
        {visibleSettings.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.settingItem,
              index === visibleSettings.length - 1 && styles.noBorder
            ]}
            onPress={() => item.route && router.push(item.route as any)}
            activeOpacity={0.6}
          >
            <Text style={styles.settingText}>{item.title}</Text>
            {/* Minimal interaction touch point */}
            <Feather name="chevron-right" size={14} color="#333333" style={styles.arrowIcon} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Discrete Premium Borderless Log Out Area */}
      <View style={styles.logoutWrapper}>
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: ProfileTheme.colors.background,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: ProfileTheme.colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    opacity: 0.8,
  },
  listContainer: {
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#121212', // Pure deep sleek hairline cutout
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  settingText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#E5E5E5',
    letterSpacing: -0.1,
  },
  arrowIcon: {
    paddingLeft: 8,
  },
  logoutWrapper: {
    borderTopWidth: 1,
    borderColor: '#121212',
    marginTop: 8,
  },
  logoutButton: {
    alignItems: 'flex-start',
    paddingVertical: 16,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF5252',
    letterSpacing: -0.1,
  },
});