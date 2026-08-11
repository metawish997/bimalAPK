import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, ImageBackground, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const UPCOMING_WORKSHOPS = [
  { id: '1', title: 'Mastering Crypto Trading', date: 'Oct 28, 2024', time: '18:00 PM', instructor: 'Bimal Institute', status: 'FILLING FAST' },
  { id: '2', title: 'Options Greek Seminar', date: 'Nov 05, 2024', time: '17:00 PM', instructor: 'Bimal Institute', status: 'OPEN' },
];

const FEATURED_COURSES = [
  { id: 'c1', title: 'Advanced Price Action Mastery', modules: 12, hours: '15h', price: '₹4,999' },
  { id: 'c2', title: 'Algorithmic Trading 101', modules: 8, hours: '10h', price: '₹3,499' },
];

const EVENT_VIDEOS = [
  { id: 'v1', title: 'Delhi Trading Conclave 2023', duration: '45m' },
  { id: 'v2', title: 'Live Trading Session Highlight', duration: '12m' },
  { id: 'v3', title: 'Q&A with Bimal Sir', duration: '1h 05m' },
];

export default function EventsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Premium Core Shimmer Automation Sequence
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerValue, {
        toValue: 1,
        duration: 1200, // Kept fast & responsive
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const shimmerTranslateX = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-260, 260],
  });

  return (
    <View style={styles.container}>
      {/* 1. Technical Low-Profile Header */}
      <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={20} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terminal Events Registry</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* 2. Hero Section with Restored Background Image */}
        <View style={styles.heroContainer}>
          <ImageBackground
            source={require('../../assets/images/promo-banner.jpg')}
            style={styles.heroBg}
            imageStyle={styles.heroImage}
          >
            <View style={styles.heroOverlay}>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>NEXT MAJOR LIVE BROADCAST</Text>
              </View>
              <Text style={styles.heroTitle}>Mastering Crypto Trading Matrix</Text>
              <Text style={styles.heroSubtitle}>Initialize access protocol alongside 5,000+ streaming market traders.</Text>

              <TouchableOpacity style={styles.heroBtn} activeOpacity={0.8}>
                {/* Dynamic Glossy Shimmer Mask over Green Button */}
                <Animated.View
                  style={[
                    styles.shimmerLayer,
                    { backgroundColor: 'rgba(255, 255, 255, 0.4)', transform: [{ translateX: shimmerTranslateX }, { rotate: '20deg' }] }
                  ]}
                />
                <Text style={styles.heroBtnText}>Reserve Your Seat</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        {/* 3. Horizontal Streaming Workshop Stack */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Live Streams</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {UPCOMING_WORKSHOPS.map(workshop => (
              <View key={workshop.id} style={styles.workshopCard}>
                <View style={styles.workshopHeader}>
                  <Text style={styles.sessionMetaMono}>{workshop.date.split(',')[0].toUpperCase()}</Text>
                  <Text style={[styles.statusBadge, { color: workshop.status === 'OPEN' ? '#38BDF8' : '#FB923C' }]}>
                    // {workshop.status}
                  </Text>
                </View>
                <Text style={styles.workshopTitle}>{workshop.title}</Text>
                <Text style={styles.workshopTime}>{workshop.date} • {workshop.time}</Text>

                <TouchableOpacity style={styles.registerBtn} activeOpacity={0.8}>
                  {/* Shimmer Effect added to Register Button */}
                  <Animated.View
                    style={[
                      styles.shimmerLayer,
                      { backgroundColor: 'rgba(255, 255, 255, 0.15)', transform: [{ translateX: shimmerTranslateX }, { rotate: '20deg' }] }
                    ]}
                  />
                  <Text style={styles.registerBtnText}>Secure Stream Node</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 4. Structured Course Statement Ledger */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Curriculums</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.seeAll}>Browse Index</Text>
            </TouchableOpacity>
          </View>

          {FEATURED_COURSES.map(course => (
            <View key={course.id} style={styles.courseCard}>
              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.courseMetaMono}>MODULES: {course.modules} <Text style={styles.opaqueLabel}>• DURATION: {course.hours}</Text></Text>

                <View style={styles.courseFooter}>
                  <Text style={styles.coursePrice}>{course.price}</Text>
                  <TouchableOpacity style={styles.enrollBtn} activeOpacity={0.8}>
                    {/* Active Shimmer Wave on Enroll Button */}
                    <Animated.View
                      style={[
                        styles.shimmerLayer,
                        { backgroundColor: 'rgba(255, 255, 255, 0.4)', transform: [{ translateX: shimmerTranslateX }, { rotate: '20deg' }] }
                      ]}
                    />
                    <Text style={styles.enrollBtnText}>Enroll Node</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* 5. Flat Media Recording Logs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Archived Event Recaps</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {EVENT_VIDEOS.map(video => (
              <TouchableOpacity key={video.id} style={styles.videoCard} activeOpacity={0.75}>
                <View style={styles.videoThumbnail}>
                  <FontAwesome name="play" size={14} color="#A8FF3E" />
                  <View style={styles.durationBadge}>
                    <Text style={styles.durationText}>{video.duration}</Text>
                  </View>
                </View>
                <Text style={styles.videoTitle} numberOfLines={2}>{video.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
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
  content: {
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 110 : 88,
  },
  heroContainer: {
    borderWidth: 1,
    borderColor: 'rgba(168, 255, 62, 0.25)',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 24,
    overflow: 'hidden',
    height: 200,
  },
  heroBg: {
    flex: 1,
  },
  heroImage: {
    opacity: 0.35,
  },
  heroOverlay: {
    flex: 1,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 2,
    marginBottom: 6,
  },
  liveDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FF5252',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FF5252',
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#888888',
    lineHeight: 18,
    marginBottom: 14,
  },
  heroBtn: {
    backgroundColor: '#A8FF3E',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    alignItems: 'center',
  },
  heroBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
    zIndex: 2,
  },
  shimmerLayer: {
    position: 'absolute',
    top: -24,
    bottom: -24,
    width: 48,
    zIndex: 1,
  },
  section: {
    marginBottom: 28,
    paddingHorizontal: 20,
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
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 12,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  horizontalScroll: {
    gap: 12,
    paddingRight: 20,
  },
  workshopCard: {
    width: 260,
    borderWidth: 1,
    borderColor: 'rgba(168, 255, 62, 0.25)',
    borderRadius: 12,
    padding: 14,
    backgroundColor: 'transparent',
  },
  workshopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  sessionMetaMono: {
    fontSize: 11,
    color: '#444444',
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
  },
  statusBadge: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
  },
  workshopTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.1,
    marginBottom: 4,
  },
  workshopTime: {
    fontSize: 12,
    color: '#555555',
    marginBottom: 14,
  },
  registerBtn: {
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#222222',
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  registerBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    zIndex: 2,
  },
  courseCard: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(168, 255, 62, 0.25)',
    padding: 14,
    marginBottom: 12,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.1,
    marginBottom: 4,
  },
  courseMetaMono: {
    fontSize: 11,
    color: '#555555',
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
    marginBottom: 14,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#121212',
  },
  coursePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
  },
  enrollBtn: {
    backgroundColor: '#A8FF3E',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  enrollBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    zIndex: 2,
  },
  videoCard: {
    width: 180,
  },
  videoThumbnail: {
    height: 100,
    backgroundColor: '#050505',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(168, 255, 62, 0.15)',
    position: 'relative',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: '#000000',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#141414',
  },
  durationText: {
    fontSize: 9,
    color: '#666666',
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
  },
  videoTitle: {
    fontSize: 12,
    color: '#888888',
    lineHeight: 16,
  },
  opaqueLabel: {
    color: '#333333',
  },
});