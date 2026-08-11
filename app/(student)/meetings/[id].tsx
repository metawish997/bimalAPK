import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Alert, SafeAreaView, Animated, Easing, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { zoomService } from '../../../src/services/zoomService';
import { useZoom } from '../../../src/hooks/useZoom';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../src/constants/Colors';
import { Typography } from '../../../src/constants/Typography';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const ShimmerButton = ({ title, icon, onPress, isPrimary, disabled }: any) => {
  const animatedValue = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [-1, 1],
    outputRange: [-width, width],
  });

  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled}
      style={[styles.shimmerBtn, isPrimary ? styles.shimmerPrimary : styles.shimmerSecondary, disabled && { opacity: 0.5 }]}
      activeOpacity={0.8}
    >
      {!disabled && (
        <Animated.View style={[StyleSheet.absoluteFillObject, { transform: [{ translateX }] }]}>
          <LinearGradient
            colors={['transparent', isPrimary ? 'rgba(255,255,255,0.5)' : 'rgba(168,255,62,0.2)', 'transparent']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>
      )}
      <View style={styles.shimmerContent}>
        <Ionicons name={icon} size={16} color={isPrimary ? Colors.background : Colors.primary} />
        <Text style={[styles.shimmerText, isPrimary ? { color: Colors.background } : { color: Colors.primary }]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default function MeetingDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { joinMeeting, startMeeting, isInitializing } = useZoom();
  const [meeting, setMeeting] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeetingDetails();
  }, [id]);

  const fetchMeetingDetails = async () => {
    try {
      const res = await zoomService.getMeetingDetails(id as string);
      setMeeting(res.data);
    } catch (error) {
      console.error('Error fetching meeting:', error);
      Alert.alert('Error', 'Failed to load meeting details');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = () => {
    if (!meeting) return;
    router.push(`/(student)/learn/live/${meeting.zoomMeetingId}?pwd=${meeting.password}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!meeting) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={[styles.statusBadge, meeting.status === 'Live' ? styles.statusLive : styles.statusScheduled]}>
            <Text style={[styles.statusText, meeting.status === 'Live' ? styles.statusTextLive : styles.statusTextScheduled]}>
              {meeting.status}
            </Text>
          </View>
          <Text style={styles.topic}>{meeting.topic}</Text>
          <Text style={styles.date}>{new Date(meeting.startTime).toLocaleString()} • {meeting.duration} mins</Text>
        </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Meeting Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Meeting ID</Text>
          <Text style={styles.infoValue}>{meeting.zoomMeetingId}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Password</Text>
          <Text style={styles.infoValue}>{meeting.password || 'None'}</Text>
        </View>
        {meeting.agenda ? (
          <View style={[styles.infoRow, { flexDirection: 'column', alignItems: 'flex-start', borderBottomWidth: 0 }]}>
            <Text style={[styles.infoLabel, { marginBottom: 8 }]}>Agenda</Text>
            <Text style={styles.infoValue}>{meeting.agenda}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.actionsContainer}>
        <ShimmerButton 
          title="Join Meeting" 
          icon="log-in" 
          onPress={handleJoin} 
          isPrimary={true} 
          disabled={isInitializing} 
        />
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  header: { backgroundColor: Colors.card, padding: 24, paddingTop: 60, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: Colors.border, position: 'relative' },
  backBtn: { position: 'absolute', top: 20, left: 16, padding: 8, zIndex: 10 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginBottom: 16, borderWidth: 1 },
  statusScheduled: { backgroundColor: Colors.cardSecondary, borderColor: Colors.border },
  statusLive: { backgroundColor: 'rgba(255, 62, 62, 0.1)', borderColor: 'rgba(255, 62, 62, 0.3)' },
  statusText: { fontWeight: 'bold', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 },
  statusTextScheduled: { color: Colors.textSecondary },
  statusTextLive: { color: '#FF3E3E' },
  topic: { ...Typography.h2, color: Colors.textPrimary, textAlign: 'center', marginBottom: 8 },
  date: { ...Typography.caption, color: Colors.textSecondary, textAlign: 'center' },
  infoCard: { backgroundColor: Colors.card, margin: 16, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: Colors.border },
  sectionTitle: { ...Typography.h4, color: Colors.textPrimary, marginBottom: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.cardSecondary },
  infoLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600', letterSpacing: 0.5 },
  infoValue: { fontSize: 13, color: Colors.textPrimary, fontWeight: '500' },
  actionsContainer: { padding: 16, flexDirection: 'row', gap: 12, justifyContent: 'center' },
  shimmerBtn: { flex: 1, overflow: 'hidden', borderRadius: 8, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  shimmerPrimary: { backgroundColor: Colors.primary },
  shimmerSecondary: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  shimmerContent: { flexDirection: 'row', alignItems: 'center', gap: 6, zIndex: 1 },
  shimmerText: { fontSize: 14, fontWeight: '700', letterSpacing: 0.5 },
});
