import { ProfileTheme } from '@/components/profile/theme';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EditProfileScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: 'Sharad Sharma',
    username: '@sharad_trades',
    email: 'sharad.sharma@example.com',
    phone: '+91 98765 43210',
    country: 'India'
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
            <Feather name="arrow-left" size={20} color={ProfileTheme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={styles.saveActionText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
              placeholderTextColor="#444"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={[styles.input, styles.monoText]}
              value={form.username}
              onChangeText={(text) => setForm({ ...form, username: text })}
              placeholderTextColor="#444"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={form.email}
              keyboardType="email-address"
              onChangeText={(text) => setForm({ ...form, email: text })}
              placeholderTextColor="#444"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={form.phone}
              keyboardType="phone-pad"
              onChangeText={(text) => setForm({ ...form, phone: text })}
              placeholderTextColor="#444"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Country</Text>
            <TextInput
              style={styles.input}
              value={form.country}
              onChangeText={(text) => setForm({ ...form, country: text })}
              placeholderTextColor="#444"
            />
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
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: ProfileTheme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#141414',
    paddingVertical: 10,
    fontSize: 15,
    color: '#ffffff',
  },
  monoText: {
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
  },
});