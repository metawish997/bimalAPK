import { AchievementsSection } from '@/components/profile/AchievementsSection';
import { CertificationsSection } from '@/components/profile/CertificationsSection';
import { LearningOverview } from '@/components/profile/LearningOverview';
import { LearningProgress } from '@/components/profile/LearningProgress';
import { PaperTradingStats } from '@/components/profile/PaperTradingStats';
import { PaymentHistorySection } from '@/components/profile/PaymentHistorySection';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ReferralSection } from '@/components/profile/ReferralSection';
import { SettingsSection } from '@/components/profile/SettingsSection';
import { SubscriptionSection } from '@/components/profile/SubscriptionSection';
import { ProfileTheme } from '@/components/profile/theme';
import { TimelineSection } from '@/components/profile/TimelineSection';
import { WatchlistInterests } from '@/components/profile/WatchlistInterests';
import { useAuthStore } from '@/store/useAuthStore';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { Animated, RefreshControl, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TABS = [
  { id: 'Overview' },
  { id: 'Achievements' },
  { id: 'Trading' },
  { id: 'Account' },
];

export default function ProfileIndex() {
  const { user } = useAuthStore();
  const roleNameObj = typeof user?.role === 'string' ? user.role : user?.role?.name;
  const isTrader = roleNameObj?.toLowerCase() === 'trader';

  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');

  const availableTabs = TABS.filter(t => isTrader ? t.id !== 'Achievements' : true);

  const slideAnim = useRef(new Animated.Value(30)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const tabSlideAnim = useRef(new Animated.Value(15)).current;
  const tabFadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      slideAnim.setValue(30);
      fadeAnim.setValue(0);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        })
      ]).start();
    }, [slideAnim, fadeAnim])
  );

  React.useEffect(() => {
    tabSlideAnim.setValue(15);
    tabFadeAnim.setValue(0);
    Animated.parallel([
      Animated.timing(tabSlideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(tabFadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      })
    ]).start();
  }, [activeTab, tabSlideAnim, tabFadeAnim]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <View style={styles.tabContentGap}>
            {!isTrader && (
              <>
                <LearningOverview />
                <View style={styles.sectionDividerLine} />
                <LearningProgress />
                <View style={styles.sectionDividerLine} />
              </>
            )}
            <TimelineSection />
          </View>
        );
      case 'Achievements':
        return (
          <View style={styles.tabContentGap}>
            <AchievementsSection />
            <View style={styles.sectionDividerLine} />
            <CertificationsSection />
          </View>
        );
      case 'Trading':
        return (
          <View style={styles.tabContentGap}>
            <PaperTradingStats />
            <View style={styles.sectionDividerLine} />
            <WatchlistInterests />
          </View>
        );
      case 'Account':
        return (
          <View style={styles.tabContentGap}>
            <SubscriptionSection />
            <View style={styles.sectionDividerLine} />
            <PaymentHistorySection />
            <View style={styles.sectionDividerLine} />
            <ReferralSection />
            <View style={styles.sectionDividerLine} />
            <SettingsSection />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={ProfileTheme.colors.background} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={ProfileTheme.colors.primary}
            colors={[ProfileTheme.colors.primary]}
          />
        }
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <ProfileHeader />

          {/* Updated Modern Tabs Framework */}
          <View style={styles.tabsContainer}>
            {availableTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  style={styles.tab}
                  onPress={() => setActiveTab(tab.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                    {tab.id}
                  </Text>
                  {isActive && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
              );
            })}
          </View>

          <Animated.View style={{ opacity: tabFadeAnim, transform: [{ translateY: tabSlideAnim }] }}>
            {renderTabContent()}
          </Animated.View>

          {/* Main Global Layout Footer End Line */}
          <View style={styles.globalEndLine} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ProfileTheme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: ProfileTheme.colors.background,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#1C1C1E', // Sleek gray continuous full-width underlying line
    paddingHorizontal: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: ProfileTheme.colors.textSecondary,
    letterSpacing: 0.3,
  },
  activeTabText: {
    color: '#A8FF3E', // Active state transitions typography cleanly to green
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -1, // Sits perfectly flat flush on top of the gray background line
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: '#A8FF3E', // Beautiful minimal crisp green indicator underline
  },
  tabContentGap: {
    gap: 16,
  },
  sectionDividerLine: {
    height: 1,
    backgroundColor: '#141414',
    marginVertical: 12,
  },
  globalEndLine: {
    height: 1,
    backgroundColor: '#1F1F1F',
    marginTop: 40,
    marginBottom: 20,
    opacity: 0.7,
  },
});