import { Feather } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProfileTheme } from './theme';

export const ReferralSection = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 3, tension: 200, useNativeDriver: true }),
    ]).start();

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Referral Program</Text>

      {/* 1. Header Copy Block */}
      <View style={styles.headerInfo}>
        <Text style={styles.title}>Invite Friends & Earn</Text>
        <Text style={styles.subtitle}>Get 1 month free Premium for each friend who joins!</Text>
      </View>

      {/* 2. Premium Inline Metrics Block */}
      <View style={styles.metricsStrip}>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>3</Text>
          <Text style={styles.metricLabel}>Total Referrals</Text>
        </View>

        <View style={styles.verticalDivider} />

        <View style={styles.metricItem}>
          <Text style={[styles.metricValue, { color: ProfileTheme.colors.warning }]}>$45.00</Text>
          <Text style={styles.metricLabel}>Rewards Earned</Text>
        </View>
      </View>

      {/* 3. High-End Micro-Card Utility Box */}
      <View style={styles.codeCard}>
        <View style={styles.codeDetails}>
          <Text style={styles.codeLabel}>YOUR REFERRAL CODE</Text>
          <Text style={styles.codeText}>ALEX-TRD-2025</Text>
        </View>

        <View style={styles.actionGroup}>
          <TouchableOpacity activeOpacity={0.7} onPress={handleCopy}>
            <Animated.View style={[styles.utilityButton, { transform: [{ scale: scaleAnim }] }]}>
              <Feather name={copied ? "check" : "copy"} size={14} color={ProfileTheme.colors.primary} />
              <Text style={styles.utilityButtonText}>{copied ? "Copied" : "Copy"}</Text>
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.utilityButton, styles.shareBtn]} activeOpacity={0.7}>
            <Feather name="share-2" size={14} color="#ffffff" />
          </TouchableOpacity>
        </View>
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
    marginBottom: 20,
    opacity: 0.8,
  },
  headerInfo: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: ProfileTheme.colors.textSecondary,
    lineHeight: 18,
  },
  metricsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F0F0F', // Premium subtle depth box
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#161616',
    marginBottom: 16,
  },
  metricItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.2,
  },
  metricLabel: {
    fontSize: 12,
    color: ProfileTheme.colors.textSecondary,
    fontWeight: '400',
  },
  verticalDivider: {
    width: 1,
    height: 18,
    backgroundColor: '#1C1C1C',
  },
  codeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1A1A1A', // Razor-thin minimal containment line
    borderRadius: 12,
    padding: 12,
  },
  codeDetails: {
    justifyContent: 'center',
    paddingLeft: 4,
  },
  codeLabel: {
    fontSize: 9,
    color: ProfileTheme.colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 2,
    fontWeight: '500',
  },
  codeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
    letterSpacing: 0.5,
  },
  actionGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  utilityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#222222',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 6,
  },
  shareBtn: {
    paddingHorizontal: 10,
    borderColor: '#262626',
  },
  utilityButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: ProfileTheme.colors.primary,
  },
});