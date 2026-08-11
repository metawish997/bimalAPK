import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, SafeAreaView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { zoomService } from '../../../src/services/zoomService';
import { subscriptionService } from '../../../src/services/subscriptionService';
import { useZoom } from '../../../src/hooks/useZoom';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../src/constants/Colors';
import { Typography } from '../../../src/constants/Typography';

export default function MeetingsDashboard() {
  const router = useRouter();
  const { startMeeting } = useZoom();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(true);

  const checkStatus = async () => {
    try {
      setLoading(true);
      const [meetRes, subRes] = await Promise.all([
        zoomService.getMeetings(),
        subscriptionService.getMySubscriptions()
      ]);
      setMeetings(meetRes.data || []);
      
      if (subRes.data?.data && subRes.data.data.length > 0) {
        setHasSubscription(true);
      } else {
        setHasSubscription(false);
      }
    } catch (error) {
      console.error('Error fetching meetings status:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      checkStatus();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    checkStatus();
  }, []);

  const handleInstantMeeting = async () => {
    try {
      setLoading(true);
      const res = await zoomService.startInstantMeeting('Instant Meeting');
      if (res.data && res.data.zoomMeetingId) {
        // Start meeting as host
        await startMeeting(res.data.zoomMeetingId.toString(), 'Host');
        checkStatus(); // Refresh list after meeting
      }
    } catch (error) {
      console.error('Error creating instant meeting:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMeetingCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/(student)/meetings/${item._id}`)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.topic} numberOfLines={1}>{item.topic}</Text>
        <View style={[styles.statusBadge, item.status === 'Live' ? styles.statusLive : styles.statusScheduled]}>
          <Text style={[styles.statusText, item.status === 'Live' ? styles.statusTextLive : styles.statusTextScheduled]}>
            {item.status}
          </Text>
        </View>
      </View>
      <View style={styles.cardDetails}>
        <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
        <Text style={styles.detailText}>
          {new Date(item.startTime).toLocaleString()} ({item.duration} min)
        </Text>
      </View>
      <View style={styles.cardDetails}>
        <Ionicons name="videocam-outline" size={16} color={Colors.textSecondary} />
        <Text style={styles.detailText}>ID: {item.zoomMeetingId}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={styles.container}>
        <View style={styles.headerBar}>
          <Text style={styles.headerTitle}>Live Meetings</Text>
          <Text style={styles.headerSubtitle}>Join ongoing sessions directly</Text>
        </View>

        {loading && !refreshing ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 50 }} />
        ) : (
        <FlatList
          data={meetings}
          keyExtractor={(item) => item._id}
          renderItem={renderMeetingCard}
          scrollEnabled={hasSubscription}
          contentContainerStyle={styles.listContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-clear-outline" size={60} color={Colors.border} />
              <Text style={styles.emptyText}>No upcoming meetings found.</Text>
            </View>
          }
        />
      )}
      </View>

      {/* Blurred Overlay for No Subscription */}
      {!loading && !hasSubscription && (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} pointerEvents="auto" />
          <View style={styles.overlayContainer} pointerEvents="auto">
            <View style={styles.popupCard}>
              <Text style={styles.popupTitle}>Premium Access Required</Text>
              <Text style={styles.popupSubtitle}>
                You need an active subscription to join live meetings and learning sessions. Subscribe now to unlock full access.
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  headerBar: { padding: 16, backgroundColor: Colors.background },
  headerTitle: { ...Typography.h2, color: Colors.textPrimary },
  headerSubtitle: { ...Typography.caption, color: Colors.textSecondary, marginTop: 4 },
  listContainer: { padding: 16, paddingBottom: 100 },
  card: { backgroundColor: Colors.cardSecondary, padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: Colors.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  topic: { ...Typography.h3, color: Colors.textPrimary, flex: 1, marginRight: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusScheduled: { backgroundColor: Colors.border },
  statusLive: { backgroundColor: Colors.loss + '20' },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  statusTextScheduled: { color: Colors.textSecondary },
  statusTextLive: { color: Colors.loss },
  cardDetails: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 8 },
  detailText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { marginTop: 12, color: Colors.textSecondary, fontSize: 16, fontWeight: '500' },
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
