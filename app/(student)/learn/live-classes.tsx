import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const UPCOMING_CLASSES = [
  { id: '1', title: 'Options Greeks Deep Dive', date: 'Today, 7:00 PM', instructor: 'Bimal Institute', status: 'joining_soon' },
  { id: '2', title: 'Live Trade Execution', date: 'Tomorrow, 9:00 AM', instructor: 'Bimal Institute', status: 'scheduled' },
];

const PAST_RECORDINGS = [
  { id: '101', title: 'Market Structure Recap', date: 'Oct 20, 2023', duration: '1h 45m', availableUntil: 'Nov 20, 2023', watched: true },
  { id: '102', title: 'Support & Resistance Q&A', date: 'Oct 18, 2023', duration: '2h 10m', availableUntil: 'Nov 18, 2023', watched: false },
];

export default function LiveClassesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'recordings'>('upcoming');

  return (
    <View style={styles.container}>
      {/* Universal Terminal Header */}
      <View style={[styles.headerArea, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Sessions</Text>
        <View style={{ width: 20 }} />
      </View>

      {/* Flush Tabs Baseline Grid */}
      <View style={styles.tabsContainer}>
        {(['upcoming', 'recordings'] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={styles.tab}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab === 'upcoming' ? 'Live Stream Schedule' : 'Archived Records'}
              </Text>
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'upcoming' && (
          <View>
            {/* Minimal Calendar Sync Row */}
            <View style={styles.calendarBanner}>
              <View style={styles.bannerMeta}>
                <Text style={styles.bannerTitle}>Calendar Integration</Text>
                <Text style={styles.bannerSubtitle}>Sync sessions dynamically to engine scheduler</Text>
              </View>
              <TouchableOpacity style={styles.syncBtn} activeOpacity={0.7}>
                <Text style={styles.syncBtnText}>Sync Ledger</Text>
              </TouchableOpacity>
            </View>

            {/* Upcoming Classes Flat Stack */}
            {UPCOMING_CLASSES.map((cls, index) => {
              const isLiveNow = cls.status === 'joining_soon';
              return (
                <View key={cls.id} style={styles.terminalSessionCard}>
                  <View style={styles.sessionHeader}>
                    <View style={styles.badgeRow}>
                      <View style={[styles.statusDot, { backgroundColor: isLiveNow ? '#A8FF3E' : '#333333' }]} />
                      <Text style={styles.sessionMetaMono}>{cls.date.split(',')[0].toUpperCase()}</Text>
                    </View>

                    <TouchableOpacity style={styles.notifyBtn} activeOpacity={0.7}>
                      <Feather name="bell" size={13} color="#444444" />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.classTitle}>{cls.title}</Text>
                  <Text style={styles.classInstructor}>Instructor Stream: {cls.instructor}</Text>
                  <Text style={[styles.sessionMetaMono, styles.timeMargin]}>{cls.date.split(',')[1]}</Text>

                  <View style={styles.actionDividerLine} />

                  {isLiveNow ? (
                    <TouchableOpacity
                      style={styles.joinActiveBtn}
                      onPress={() => router.push(`/(student)/learn/live/${cls.id}`)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.joinActiveText}>Connect to Stream Now</Text>
                      <Feather name="arrow-up-right" size={12} color="#000000" />
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.disabledJoinBlock}>
                      <Text style={styles.disabledJoinText}>Stream window unlocks 10m prior to initialized runtime</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {activeTab === 'recordings' && (
          <View style={styles.recordingsContainer}>
            {PAST_RECORDINGS.map((rec, index) => (
              <TouchableOpacity
                key={rec.id}
                style={[styles.recordingRow, index === PAST_RECORDINGS.length - 1 && styles.noBorder]}
                onPress={() => router.push(`/(student)/learn/live/${rec.id}`)}
                activeOpacity={0.7}
              >
                <View style={styles.recLeft}>
                  <View style={styles.playFrameIndicator}>
                    <Feather name="play" size={12} color={rec.watched ? '#444444' : '#A8FF3E'} />
                  </View>

                  <View style={styles.recInfoBlock}>
                    <View style={styles.titleIdentityRow}>
                      <Text style={[styles.recordingTitle, rec.watched && styles.watchedTitleColor]}>
                        {rec.title}
                      </Text>
                      {rec.watched && <Text style={styles.miniInlineWatchedBadge}>[ SEEN ]</Text>}
                    </View>
                    <Text style={styles.recordingMetaMono}>
                      {rec.date} <Text style={styles.opaqueLabel}>• {rec.duration}</Text>
                    </Text>
                    <Text style={styles.recordingExpiry}>Retention window locks until {rec.availableUntil}</Text>
                  </View>
                </View>

                <Feather name="chevron-right" size={12} color="#222222" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  headerArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderColor: '#141414',
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
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#141414',
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 16,
    right: 16,
    height: 1.5,
    backgroundColor: '#A8FF3E',
  },
  tabText: {
    fontSize: 12,
    color: '#555555',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  calendarBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#1A1A1A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  bannerMeta: {
    flex: 1,
    paddingRight: 16,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 2,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#555555',
    lineHeight: 16,
  },
  syncBtn: {
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  syncBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#888888',
  },
  terminalSessionCard: {
    borderWidth: 1,
    borderColor: '#1A1A1A',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  sessionMetaMono: {
    fontSize: 11,
    color: '#555555',
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
    letterSpacing: 0.5,
  },
  timeMargin: {
    marginTop: 2,
    color: '#888888',
  },
  notifyBtn: {
    padding: 4,
  },
  classTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.1,
    marginBottom: 4,
  },
  classInstructor: {
    fontSize: 13,
    color: '#555555',
    marginBottom: 4,
  },
  actionDividerLine: {
    height: 1,
    backgroundColor: '#141414',
    marginVertical: 12,
  },
  joinActiveBtn: {
    flexDirection: 'row',
    backgroundColor: '#A8FF3E',
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  joinActiveText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
  disabledJoinBlock: {
    paddingVertical: 4,
  },
  disabledJoinText: {
    fontSize: 12,
    color: '#333333',
    lineHeight: 16,
  },
  recordingsContainer: {
    marginTop: 4,
  },
  recordingRow: {
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
  recLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 16,
  },
  playFrameIndicator: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#161616',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  recInfoBlock: {
    flex: 1,
  },
  titleIdentityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  recordingTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#ffffff',
    letterSpacing: -0.1,
  },
  watchedTitleColor: {
    color: '#444444',
    fontWeight: '400',
  },
  miniInlineWatchedBadge: {
    fontSize: 9,
    color: '#444444',
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
  },
  recordingMetaMono: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  recordingExpiry: {
    fontSize: 11,
    color: '#3A3A3C',
  },
  opaqueLabel: {
    opacity: 0.5,
  },
});