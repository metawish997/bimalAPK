import { ProfileTheme } from '@/components/profile/theme';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SecurityScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
            <Feather name="arrow-left" size={20} color={ProfileTheme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Security</Text>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={styles.saveActionText}>Update</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Change Password</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Current Password</Text>
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                placeholderTextColor="#333"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                placeholderTextColor="#333"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Confirm New Password</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholderTextColor="#333"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Biometrics & Authorization</Text>

            <View style={styles.switchRow}>
              <View style={styles.textBlock}>
                <Text style={styles.switchLabel}>Biometric Access</Text>
                <Text style={styles.switchDesc}>Authenticate secure sessions via local hardware layers.</Text>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
                trackColor={{ false: '#1A1A1A', true: '#A8FF3E' }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={[styles.switchRow, styles.noBorder]}>
              <View style={styles.textBlock}>
                <Text style={styles.switchLabel}>Two-Factor Authentication</Text>
                <Text style={styles.switchDesc}>Enforce additional validation checkpoints during runtime.</Text>
              </View>
              <Switch
                value={twoFactorEnabled}
                onValueChange={setTwoFactorEnabled}
                trackColor={{ false: '#1A1A1A', true: '#A8FF3E' }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ProfileTheme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#1C1C1E',
  },
  backButton: {
    paddingVertical: 4,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.2,
  },
  saveActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A8FF3E',
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: ProfileTheme.colors.textSecondary,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: ProfileTheme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#141414',
    paddingVertical: 8,
    fontSize: 15,
    color: '#ffffff',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#121212',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  textBlock: {
    flex: 1,
    paddingRight: 16,
  },
  switchLabel: {
    fontSize: 15,
    color: '#E5E5E5',
    marginBottom: 2,
    letterSpacing: -0.1,
  },
  switchDesc: {
    fontSize: 12,
    color: ProfileTheme.colors.textSecondary,
    lineHeight: 16,
  },
});