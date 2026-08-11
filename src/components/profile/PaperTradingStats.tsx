import { Entypo } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProfileTheme } from './theme';

export const PaperTradingStats = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Trading Performance</Text>

      {/* 1. Header Hero Performance Data */}
      <TouchableOpacity style={styles.portfolioRow} activeOpacity={0.7}>
        <View style={styles.metaContainer}>
          <Text style={styles.portfolioLabel}>Virtual Portfolio Value</Text>
          <Text style={styles.portfolioValue}>$114,200.50</Text>
        </View>
        <View style={styles.performanceContainer}>
          <View style={styles.inlineReturn}>
            <Entypo name="triangle-up" size={12} color={ProfileTheme.colors.success} style={styles.trendArrow} />
            <Text style={styles.growthText}>14.2%</Text>
          </View>
          <Text style={styles.portfolioSubtext}>+$14,200.50 all time</Text>
        </View>
      </TouchableOpacity>

      {/* 2. Pure Typography Metrics Layout */}
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Win Rate</Text>
          <Text style={[styles.statValue, { color: ProfileTheme.colors.primary }]}>68%</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total Trades</Text>
          <Text style={styles.statValue}>124</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Winning</Text>
          <Text style={[styles.statValue, { color: ProfileTheme.colors.success }]}>84</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Losing</Text>
          <Text style={[styles.statValue, { color: '#FF5252' }]}>40</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Avg Return</Text>
          <Text style={[styles.statValue, { color: ProfileTheme.colors.success }]}>+2.4%</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Best Trade</Text>
          <Text style={[styles.statValue, { color: ProfileTheme.colors.success }]}>+$3,450</Text>
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
  },
  portfolioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#141414',
  },
  metaContainer: {
    justifyContent: 'flex-end',
  },
  portfolioLabel: {
    fontSize: 12,
    color: ProfileTheme.colors.textSecondary,
    marginBottom: 4,
    fontWeight: '400',
  },
  portfolioValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  performanceContainer: {
    alignItems: 'flex-end',
  },
  inlineReturn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  trendArrow: {
    marginRight: 2,
  },
  growthText: {
    fontSize: 14,
    fontWeight: '600',
    color: ProfileTheme.colors.success,
  },
  portfolioSubtext: {
    fontSize: 12,
    color: ProfileTheme.colors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  statItem: {
    width: '33.33%', // Creates clean geometric columns with zero container clutter
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#141414',
    alignItems: 'flex-start',
  },
  statLabel: {
    fontSize: 12,
    color: ProfileTheme.colors.textSecondary,
    marginBottom: 4,
    fontWeight: '400',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.1,
  },
});