import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CircularProgress } from '../ui/CircularProgress';
import { ProfileTheme } from './theme';

export const LearningOverview = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Learning Overview</Text>

      {/* 1. Transparent Progress Row */}
      <TouchableOpacity style={styles.mainRow} activeOpacity={0.7}>
        <View style={styles.progressTextContainer}>
          <Text style={styles.mainLabel}>Overall Progress</Text>
          <Text style={styles.mainValue}>Excellent performance</Text>
        </View>
        <CircularProgress percentage={78} radius={24} strokeWidth={3.5} color="#A8FF3E">
          <Text style={styles.progressText}>78%</Text>
        </CircularProgress>
      </TouchableOpacity>

      {/* 2. Premium Green Bordered Cards Grid */}
      <View style={styles.metricsContainer}>
        <View style={styles.cardItem}>
          <View style={styles.cardHeader}>
            {/* Electric Blue for Library */}
            <Ionicons name="library-outline" size={14} color="#38BDF8" />
            <Text style={styles.statLabel}>Enrolled</Text>
          </View>
          <Text style={styles.statValue}>12</Text>
        </View>

        <View style={styles.cardItem}>
          <View style={styles.cardHeader}>
            {/* Emerald Green for Completed Certification */}
            <MaterialCommunityIcons name="check-decagram-outline" size={14} color="#34D399" />
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <Text style={styles.statValue}>08</Text>
        </View>

        <View style={styles.cardItem}>
          <View style={styles.cardHeader}>
            {/* Vivid Neon Orange for Streak Flame */}
            <FontAwesome5 name="fire" size={12} color="#FB923C" />
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <Text style={styles.statValue}>14d</Text>
        </View>

        <View style={styles.cardItem}>
          <View style={styles.cardHeader}>
            {/* Fuchsia Orchid Pink for Time Tracker */}
            <Ionicons name="time-outline" size={14} color="#F472B6" />
            <Text style={styles.statLabel}>Learning</Text>
          </View>
          <Text style={styles.statValue}>45h</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: ProfileTheme.colors.background,
    paddingVertical: 8,
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
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#1F1F1F',
  },
  progressTextContainer: {
    justifyContent: 'center',
  },
  mainLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 2,
  },
  mainValue: {
    fontSize: 13,
    color: ProfileTheme.colors.textSecondary,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 20,
  },
  cardItem: {
    flex: 1,
    minWidth: '45%',
    borderWidth: 1,
    borderColor: '#a8ff3e69', // High-contrast clean premium green border line
    borderRadius: 12,
    padding: 12,
    backgroundColor: 'transparent',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 12,
    color: ProfileTheme.colors.textSecondary,
    fontWeight: '400',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.2,
  },
});