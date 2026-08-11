import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useFocusEffect } from 'expo-router';
import { zoomService } from '../../../src/services/zoomService';
import { subscriptionService } from '../../../src/services/subscriptionService';

const COURSE_MODULES = [
  {
    id: 'm1',
    title: 'Market Fundamentals',
    chapters: [
      { id: 'c1', title: 'Understanding Market Structure', duration: '45m', completed: true },
      { id: 'c2', title: 'Support & Resistance Zones', duration: '50m', completed: true },
    ],
  },
  {
    id: 'm2',
    title: 'Advanced Price Action',
    chapters: [
      { id: 'c3', title: 'Candlestick Psychology', duration: '1h 10m', completed: false },
      { id: 'c4', title: 'Volume Spread Analysis', duration: '1h 25m', completed: false },
    ],
  },
];

export default function LearnScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(true); // Default true so it doesn't flash
  const [isMeetingLive, setIsMeetingLive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkStatus = async () => {
    try {
      setIsLoading(true);
      const [meetRes, subRes] = await Promise.all([
        zoomService.getMeetings(),
        subscriptionService.getMySubscriptions()
      ]);
      
      const activeMeeting = meetRes.data?.find((m: any) => m.status === 'Live' || m.status === 'Scheduled');
      setIsMeetingLive(!!activeMeeting);

      if (subRes.data?.data && subRes.data.data.length > 0) {
        setHasSubscription(true);
      } else {
        setHasSubscription(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      checkStatus();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    checkStatus().finally(() => {
      setTimeout(() => setRefreshing(false), 800);
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* Editorial Navigation Header */}
      <View style={[styles.headerArea, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>My Learning</Text>
        <Text style={styles.headerSubtitle}>Advanced Price Action Mastery</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, (!hasSubscription) && { paddingBottom: 150 }]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={hasSubscription}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#A8FF3E"
            colors={['#A8FF3E']}
          />
        }
      >
        {/* Progress Tracker Strip */}
        <Animated.View entering={FadeInDown.duration(350).delay(100)} style={styles.heroSection}>
          <View style={styles.metaRow}>
            <Text style={styles.courseSubtitle}>By Bimal Institute • 12h 30m total</Text>
            <Text style={styles.progressText}>50% Completed</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: '50%' }]} />
          </View>
        </Animated.View>

        {/* Modules & Chapters Content List */}
        <Animated.View entering={FadeInDown.duration(350).delay(200)} style={styles.modulesContainer}>
          {COURSE_MODULES.map(module => (
            <View key={module.id} style={styles.moduleBlock}>
              <Text style={styles.moduleTitle}>{module.title}</Text>

              <View style={styles.chaptersList}>
                {module.chapters.map((chapter, index) => (
                  <TouchableOpacity
                    key={chapter.id}
                    style={[styles.chapterRow, index === module.chapters.length - 1 && styles.noBorder]}
                    onPress={() => {
                      if (!hasSubscription) {
                        router.push('/(student)/profile/upgrade');
                        return;
                      }
                      router.push(`/(student)/learn/1/video/${chapter.id}`)
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.chapterLeft}>
                      <View style={[styles.statusIndicatorDot, { backgroundColor: chapter.completed ? '#A8FF3E' : '#262626' }]} />
                      <View style={styles.chapterInfo}>
                        <Text style={[styles.chapterTitleText, chapter.completed && styles.titleCompleted]}>
                          {chapter.title}
                        </Text>
                        <Text style={styles.chapterDuration}>{chapter.duration}</Text>
                      </View>
                    </View>

                    <Feather
                      name={chapter.completed ? "check" : "play"}
                      size={12}
                      color={chapter.completed ? '#A8FF3E' : '#444444'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </Animated.View>

        <View style={styles.globalEndLine} />
      </ScrollView>

      {/* Blurred Overlay for No Subscription */}
      {!isLoading && !hasSubscription && (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} pointerEvents="auto" />
          <View style={styles.overlayContainer} pointerEvents="auto">
            <View style={styles.popupCard}>
              {isMeetingLive && (
                <View style={styles.liveIndicatorContainer}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>CLASS IN PROGRESS</Text>
                </View>
              )}
              <Text style={styles.popupTitle}>
                {isMeetingLive ? 'Learning Paused' : 'Premium Access Required'}
              </Text>
              <Text style={styles.popupSubtitle}>
                {isMeetingLive 
                  ? 'A live class is currently in session. Please subscribe to a premium plan to unlock live meetings and resume learning.'
                  : 'You need an active subscription to access the premium learning materials. Subscribe now to unlock all courses.'}
              </Text>
              <TouchableOpacity 
                style={styles.subscribeBtn} 
                onPress={() => router.push('/(student)/profile/upgrade')}
                activeOpacity={0.8}
              >
                <Text style={styles.subscribeBtnText}>Subscribe Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  headerArea: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderColor: '#141414',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '400',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  heroSection: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1A1A1A', // Ultra thin elegant card boundary line
    borderRadius: 12,
    padding: 14,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  courseSubtitle: {
    fontSize: 12,
    color: '#555555',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#A8FF3E',
  },
  progressBarContainer: {
    width: '100%',
    height: 2, // Luxury thin profile bar fill
    backgroundColor: '#141414',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#A8FF3E',
  },
  modulesContainer: {
    marginTop: 12,
  },
  moduleBlock: {
    marginBottom: 20,
  },
  moduleTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  chaptersList: {
    marginTop: 4,
  },
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#121212', // Subtle line dividing chapters
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  chapterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 16,
  },
  statusIndicatorDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 14,
  },
  chapterInfo: {
    flex: 1,
  },
  chapterTitleText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#ffffff',
    letterSpacing: -0.1,
    marginBottom: 3,
  },
  titleCompleted: {
    color: '#555555',
    fontWeight: '400',
  },
  chapterDuration: {
    fontSize: 12,
    color: '#444444',
  },
  globalEndLine: {
    height: 1,
    backgroundColor: '#1F1F1F',
    marginTop: 24,
    marginBottom: 20,
    opacity: 0.7,
  },
  overlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  popupCard: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  liveIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 16,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF3B30',
    marginRight: 6,
  },
  liveText: {
    color: '#FF3B30',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  popupTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  popupSubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  subscribeBtn: {
    backgroundColor: '#A8FF3E',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  subscribeBtnText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 15,
  }
});