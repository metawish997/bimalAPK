import { FontAwesome5, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProfileTheme } from './theme';

const BADGES = [
  { id: '1', title: 'Market Beginner', icon: 'seedling', iconFamily: 'FontAwesome5', unlocked: true },
  { id: '2', title: 'First Course', icon: 'book-open', iconFamily: 'FontAwesome5', unlocked: true },
  { id: '3', title: 'Tech Analyst', icon: 'chart-line', iconFamily: 'FontAwesome5', unlocked: true },
  { id: '4', title: 'Risk Manager', icon: 'shield-alt', iconFamily: 'FontAwesome5', unlocked: true },
  { id: '5', title: 'Quiz Champ', icon: 'trophy', iconFamily: 'FontAwesome5', unlocked: false },
  { id: '6', title: 'Pro Trader', icon: 'crown', iconFamily: 'FontAwesome5', unlocked: false },
];

export const AchievementsSection = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Achievements</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {BADGES.map((badge) => {
          const IconComponent = badge.iconFamily === 'FontAwesome5' ? FontAwesome5 : MaterialCommunityIcons;

          return (
            <TouchableOpacity
              key={badge.id}
              style={[styles.badgePill, !badge.unlocked && styles.lockedPill]}
              activeOpacity={badge.unlocked ? 0.7 : 1}
            >
              {/* Left Side Status/Subject Icon */}
              <IconComponent
                name={badge.icon as any}
                size={13}
                color={badge.unlocked ? ProfileTheme.colors.warning : ProfileTheme.colors.textSecondary}
              />

              {/* Title Typography */}
              <Text style={[styles.badgeTitle, !badge.unlocked && styles.lockedText]}>
                {badge.title}
              </Text>

              {/* Right Side Conditional Status Indicators */}
              {badge.unlocked ? (
                <View style={styles.activeDot} />
              ) : (
                <Octicons name="lock" size={10} color={ProfileTheme.colors.textSecondary} style={styles.lockIcon} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
    marginBottom: 16,
  },
  scrollContent: {
    gap: 8,
    paddingRight: 16,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1F1F1F', // Ultra thin elegant boundary line
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
    backgroundColor: 'transparent',
  },
  lockedPill: {
    borderColor: '#141414',
    opacity: 0.45, // Elegant muted layer for locked assets
  },
  badgeTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#ffffff',
    letterSpacing: -0.1,
  },
  lockedText: {
    color: ProfileTheme.colors.textSecondary,
    fontWeight: '400',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: ProfileTheme.colors.warning, // Subtle elegance point
    marginLeft: 2,
  },
  lockIcon: {
    marginLeft: 2,
    opacity: 0.8,
  },
});