import { ProfileTheme } from '@/components/profile/theme';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function PrivacyScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    publicProfile: true,
    showPortfolio: false,
    showTrades: false,
    shareData: true,
    allowInvites: true
  });

  const toggleSwitch = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color={ProfileTheme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Visibility</Text>

          <View style={styles.switchRow}>
            <View style={styles.textBlock}>
              <Text style={styles.switchLabel}>Public Profile</Text>
              <Text style={styles.switchDesc}>Allow discovery via universal search protocols.</Text>
            </View>
            <Switch
              value={settings.publicProfile}
              onValueChange={() => toggleSwitch('publicProfile')}
              trackColor={{ false: '#1A1A1A', true: '#A8FF3E' }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.textBlock}>
              <Text style={styles.switchLabel}>Show Portfolio Balance</Text>
              <Text style={styles.switchDesc}>Display virtual metrics to verified users.</Text>
            </View>
            <Switch
              value={settings.showPortfolio}
              onValueChange={() => toggleSwitch('showPortfolio')}
              trackColor={{ false: '#1A1A1A', true: '#A8FF3E' }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={[styles.switchRow, styles.noBorder]}>
            <View style={styles.textBlock}>
              <Text style={styles.switchLabel}>Show Recent Trades</Text>
              <Text style={styles.switchDesc}>Broadcast logs to local community boards.</Text>
            </View>
            <Switch
              value={settings.showTrades}
              onValueChange={() => toggleSwitch('showTrades')}
              trackColor={{ false: '#1A1A1A', true: '#A8FF3E' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Communications</Text>

          <View style={styles.switchRow}>
            <View style={styles.textBlock}>
              <Text style={styles.switchLabel}>Share Analytics Data</Text>
              <Text style={styles.switchDesc}>Anonymously stream app execution details.</Text>
            </View>
            <Switch
              value={settings.shareData}
              onValueChange={() => toggleSwitch('shareData')}
              trackColor={{ false: '#1A1A1A', true: '#A8FF3E' }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={[styles.switchRow, styles.noBorder]}>
            <View style={styles.textBlock}>
              <Text style={styles.switchLabel}>Allow Study Invites</Text>
              <Text style={styles.switchDesc}>Receive group study triggers from peers.</Text>
            </View>
            <Switch
              value={settings.allowInvites}
              onValueChange={() => toggleSwitch('allowInvites')}
              trackColor={{ false: '#1A1A1A', true: '#A8FF3E' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.dangerZone} activeOpacity={0.7}>
          <Text style={styles.dangerText}>Delete Account Data</Text>
        </TouchableOpacity>
      </ScrollView>
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
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: ProfileTheme.colors.textSecondary,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
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
    fontWeight: '400',
    marginBottom: 2,
    letterSpacing: -0.1,
  },
  switchDesc: {
    fontSize: 12,
    color: ProfileTheme.colors.textSecondary,
    lineHeight: 16,
  },
  dangerZone: {
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: '#121212',
    marginTop: 16,
  },
  dangerText: {
    color: '#FF5252',
    fontWeight: '500',
    fontSize: 14,
  },
});