import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, ImageBackground, Platform, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatCard } from '../../src/components/cards/StatCard';
import { Colors } from '../../src/constants/Colors';
import { useAuthStore } from '../../src/store/useAuthStore';
import { zoomService } from '../../src/services/zoomService';
import { subscriptionService } from '../../src/services/subscriptionService';
import { useZoom } from '../../src/hooks/useZoom';

export default function StudentDashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const roleNameObj = typeof user?.role === 'string' ? user.role : user?.role?.name;
  const isTrader = roleNameObj?.toLowerCase() === 'trader';
  const [refreshing, setRefreshing] = useState(false);
  const [nextMeeting, setNextMeeting] = useState<any>(null);
  const [hasSubscription, setHasSubscription] = useState(false);

  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Premium Shimmer Effect Animation Instance
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Infinite looping shimmer translate protocol
    const startShimmer = () => {
      shimmerValue.setValue(0);
      Animated.loop(
        Animated.timing(shimmerValue, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        })
      ).start();
    };
    startShimmer();
  }, []);

  // Interpolate the shimmer position from left (-150% container offset) to right (150% container offset)
  const shimmerTranslateX = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-250, 250],
  });

  const fetchDashboardData = async () => {
    try {
      // Fetch meeting
      const res = await zoomService.getMeetings();
      if (res.data && res.data.length > 0) {
        const activeMeeting = res.data.find((m: any) => m.status === 'Live' || m.status === 'Scheduled');
        setNextMeeting(activeMeeting || res.data[0]);
      }

      // Fetch subscription status
      const subRes = await subscriptionService.getMySubscriptions();
      if (subRes.data?.data && subRes.data.data.length > 0) {
        setHasSubscription(true);
      } else {
        setHasSubscription(false);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
      slideAnim.setValue(50);
      fadeAnim.setValue(0);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        })
      ]).start();
    }, [slideAnim, fadeAnim])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboardData().finally(() => {
      setTimeout(() => setRefreshing(false), 800);
    });
  }, []);

  const handleJoinClass = () => {
    if (!nextMeeting) return;
    if (!hasSubscription) {
      router.push('/(student)/profile/upgrade');
      return;
    }
    router.push(`/(student)/learn/live/${nextMeeting.zoomMeetingId}?pwd=${nextMeeting.password}`);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} colors={[Colors.primary]} />
      }
    >
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        {/* Welcome Banner */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>
              {user?.name || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Trader')}
            </Text>
          </View>
          {(() => {
            const roleName = typeof user?.role === 'string' ? user.role : user?.role?.name;
            if (!roleName) return null;
            return (
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{String(roleName).toUpperCase()}</Text>
              </View>
            );
          })()}
        </View>

        {/* Batch & Live Class Info -> Full Green Card Block Layout */}
        {!isTrader && nextMeeting && (
          <View style={styles.alertCard}>
            {/* Animated Shimmer Overlay Mask */}
            <Animated.View
              style={[
                styles.shimmerMask,
                { transform: [{ translateX: shimmerTranslateX }, { rotate: '25deg' }] }
              ]}
            />
            <View style={styles.alertIconContainer}>
              <FontAwesome name="video-camera" size={14} color="#000000" />
            </View>
            <View style={styles.alertInfo}>
              <Text style={styles.alertTitle}>Live: {nextMeeting.topic}</Text>
              <Text style={styles.alertSubtitle}>Meeting ID: {nextMeeting.zoomMeetingId}</Text>
            </View>
            <TouchableOpacity
              style={styles.joinBtn}
              onPress={handleJoinClass}
              activeOpacity={0.7}
            >
              <Text style={styles.joinBtnText}>Join</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Promo Banner Container Block */}
        <View style={styles.promoBannerContainer}>
          <ImageBackground
            source={require('../../assets/images/promo-banner.jpg')}
            style={styles.promoBannerBg}
            imageStyle={styles.promoBannerImage}
          >
            <View style={styles.promoBannerOverlay}>
              <View style={styles.promoBannerContent}>
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>COMING SOON</Text>
                </View>
                <Text style={styles.promoBannerTitle}>Crypto & Forex Mastery</Text>
                <Text style={styles.promoBannerSubtitle}>Master both markets in our ultimate 5-day bootcamp</Text>
              </View>
              <TouchableOpacity
                style={styles.registerBtn}
                onPress={() => router.push('/(student)/events')}
                activeOpacity={0.7}
              >
                {/* Animated Shimmer Overlay Mask for Register Button */}
                <Animated.View
                  style={[
                    styles.shimmerMask,
                    { transform: [{ translateX: shimmerTranslateX }, { rotate: '25deg' }] }
                  ]}
                />
                <Text style={styles.registerBtnText}>Register Now</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        {/* Overview Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          {!isTrader && (
            <View style={styles.statsRow}>
              <StatCard title="Attendance" value="92%" iconName="calendar-check-o" trend="up" />
              <StatCard title="Rank" value="#14" iconName="trophy" trend="up" />
            </View>
          )}
          <View style={styles.statsRow}>
            <StatCard title="Win Rate" value="65%" iconName="line-chart" trend="up" />
            <StatCard title="Monthly PnL" value="+4.2%" iconName="money" trend="up" />
          </View>
        </View>

        {/* Learning Progress */}
        {!isTrader && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Learning Progress</Text>
              <TouchableOpacity onPress={() => router.push('/(student)/learn')} activeOpacity={0.7}>
                <Text style={styles.seeAll}>Resume</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.progressCard}>
              <Text style={styles.courseTitle}>Advanced Price Action</Text>
              <Text style={styles.courseModule}>Module 4: Market Structure</Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: '60%' }]} />
              </View>
              <Text style={styles.progressText}>60% Completed</Text>
            </View>
          </View>
        )}

        {/* AI Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Coach Insights</Text>
          <View style={styles.aiCard}>
            <FontAwesome name="magic" size={14} color={Colors.primary} style={styles.aiIcon} />
            <View style={styles.aiContent}>
              <Text style={styles.aiTitle}>Risk Management Alert</Text>
              <Text style={styles.aiText}>
                You've hit your max loss limit in 2 of your last 5 trades. Consider reducing your position sizing for the next session.
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Journal Entries */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Trades</Text>
            <TouchableOpacity onPress={() => router.push('/(student)/journal')} activeOpacity={0.7}>
              <Text style={styles.seeAll}>View Journal</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tradeCard}>
            <View style={styles.tradeHeader}>
              <Text style={styles.tradeInstrument}>BANKNIFTY 45000 CE</Text>
              <Text style={[styles.tradePnL, { color: Colors.success }]}>+₹4,500</Text>
            </View>
            <View style={styles.tradeDetails}>
              <Text style={styles.tradeDetailText}>LONG • 14:30 PM</Text>
              <Text style={styles.tradeDetailText}>RR: 1:2.5</Text>
            </View>
          </View>

          <View style={styles.tradeCard}>
            <View style={styles.tradeHeader}>
              <Text style={styles.tradeInstrument}>NIFTY 19500 PE</Text>
              <Text style={[styles.tradePnL, { color: Colors.loss }]}>-₹1,200</Text>
            </View>
            <View style={styles.tradeDetails}>
              <Text style={styles.tradeDetailText}>SHORT • 10:15 AM</Text>
              <Text style={styles.tradeDetailText}>Hit Stoploss</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 12,
    color: '#444444',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#A8FF3E',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  roleBadge: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  roleText: {
    color: '#A8FF3E',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: '#A8FF3E',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 28,
    position: 'relative', // Enforces boundary containment for absolute layers
    overflow: 'hidden', // Clips the shimmer flow perfectly within borders
  },
  alertIconContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    padding: 8,
    borderRadius: 6,
    marginRight: 12,
  },
  alertInfo: {
    flex: 1,
    zIndex: 2,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: -0.1,
  },
  alertSubtitle: {
    fontSize: 12,
    color: '#000000',
    opacity: 0.7,
    marginTop: 1,
  },
  joinBtn: {
    backgroundColor: '#000000',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 6,
    zIndex: 2,
  },
  joinBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#A8FF3E',
  },
  promoBannerContainer: {
    marginBottom: 28,
    borderRadius: 12,
    overflow: 'hidden',
    height: 140,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  promoBannerBg: {
    flex: 1,
  },
  promoBannerImage: {
    opacity: 0.35,
  },
  promoBannerOverlay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'transparent',
  },
  promoBannerContent: {
    flex: 1,
    paddingRight: 8,
  },
  comingSoonBadge: {
    backgroundColor: 'transparent',
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  comingSoonText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A8FF3E',
    letterSpacing: 0.5,
  },
  promoBannerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  promoBannerSubtitle: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
  },
  registerBtn: {
    backgroundColor: '#A8FF3E',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
    position: 'relative',
    overflow: 'hidden', // Clips the shimmer flow inside the register button layout scope
  },
  registerBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    zIndex: 2,
  },
  shimmerMask: {
    position: 'absolute',
    top: -50,
    bottom: -50,
    width: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.32)', // Soft glossy diagonal sweeping light overlay
    zIndex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#555555',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  seeAll: {
    fontSize: 12,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
  },
  progressCard: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1A1A1A',
    borderRadius: 12,
    padding: 14,
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#ffffff',
    letterSpacing: -0.1,
    marginBottom: 2,
  },
  courseModule: {
    fontSize: 12,
    color: '#555555',
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 2,
    backgroundColor: '#141414',
    borderRadius: 1,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#A8FF3E',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
    textAlign: 'right',
  },
  aiCard: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1A1A1A',
    borderRadius: 12,
    padding: 14,
  },
  aiIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  aiContent: {
    flex: 1,
  },
  aiTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  aiText: {
    fontSize: 13,
    color: '#888888',
    lineHeight: 18,
  },
  tradeCard: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderColor: '#121212',
    paddingVertical: 14,
    marginBottom: 0,
  },
  tradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  tradeInstrument: {
    fontSize: 15,
    fontWeight: '500',
    color: '#ffffff',
    letterSpacing: -0.1,
  },
  tradePnL: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
  },
  tradeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tradeDetailText: {
    fontSize: 12,
    color: '#555555',
  },
});