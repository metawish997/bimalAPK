import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProfileTheme } from './theme';

const TIMELINE_DATA = [
  { id: '1', title: 'Earned a Certificate', desc: 'Advanced Technical Analysis', time: '2h ago', color: ProfileTheme.colors.warning },
  { id: '2', title: 'Passed a Quiz', desc: 'Candlestick Patterns (Score: 95%)', time: '5h ago', color: ProfileTheme.colors.success },
  { id: '3', title: 'Completed Paper Trading', desc: '+2.4% Daily Return', time: 'Yesterday', color: ProfileTheme.colors.primary },
  { id: '4', title: 'Started a New Module', desc: 'Options Strategies Basics', time: '2d ago', color: ProfileTheme.colors.primary },
];

export const TimelineSection = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Recent Activity</Text>

      <View style={styles.timeline}>
        {TIMELINE_DATA.map((item, index) => (
          <TouchableOpacity key={item.id} style={styles.timelineItem} activeOpacity={0.7}>
            {/* Minimal Node and Thread Column */}
            <View style={styles.threadColumn}>
              <View style={[styles.statusDot, { backgroundColor: item.color }]} />
              {index !== TIMELINE_DATA.length - 1 && <View style={styles.verticalThread} />}
            </View>

            {/* Clean Editorial Content Column */}
            <View style={styles.contentColumn}>
              <View style={styles.headerRow}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemTime}>{item.time}</Text>
              </View>
              <Text style={styles.itemDesc}>{item.desc}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
    marginBottom: 24,
    opacity: 0.8,
  },
  timeline: {
    paddingHorizontal: 2,
  },
  timelineItem: {
    flexDirection: 'row',
  },
  threadColumn: {
    alignItems: 'center',
    width: 16,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    zIndex: 2,
  },
  verticalThread: {
    width: 1,
    flex: 1,
    backgroundColor: '#1A1A1A', // Ultra subtle timeline path
    marginVertical: 4,
  },
  contentColumn: {
    flex: 1,
    paddingLeft: 16,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#ffffff',
    letterSpacing: -0.1,
  },
  itemTime: {
    fontSize: 12,
    color: ProfileTheme.colors.textSecondary,
    fontWeight: '400',
  },
  itemDesc: {
    fontSize: 13,
    color: ProfileTheme.colors.textSecondary,
    lineHeight: 18,
  },
});