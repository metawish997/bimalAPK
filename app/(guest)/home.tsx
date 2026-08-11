import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/Colors';
import { Typography } from '../../src/constants/Typography';
import { CourseCard } from '../../src/components/cards/CourseCard';
import { StatCard } from '../../src/components/cards/StatCard';
import { PrimaryButton } from '../../src/components/common/PrimaryButton';

const MOCK_COURSES = [
  { id: '1', title: 'Beginner to Pro: Forex Mastery', instructor: 'Bimal Institute', duration: '12h 30m', rating: 4.8 },
  { id: '2', title: 'Advanced Options Strategies', instructor: 'Bimal Institute', duration: '8h 15m', rating: 4.9 },
];

export default function GuestHomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero Banner */}
      <View style={styles.heroBanner}>
        <Text style={styles.heroTitle}>Master The Markets</Text>
        <Text style={styles.heroSubtitle}>Trade like a professional with elite mentorship and AI-driven insights.</Text>
      </View>

      {/* Community Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Impact</Text>
        <View style={styles.statsRow}>
          <StatCard title="Active Traders" value="17k+" iconName="users" trend="up" />
          <StatCard title="Win Rate Avg" value="68%" iconName="line-chart" trend="up" />
        </View>
      </View>

      {/* Featured Courses */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Courses</Text>
          <TouchableOpacity onPress={() => router.push('/(guest)/courses')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {MOCK_COURSES.map(course => (
          <CourseCard
            key={course.id}
            title={course.title}
            instructor={course.instructor}
            duration={course.duration}
            rating={course.rating}
            onPress={() => router.push(`/(guest)/courses/${course.id}` as any)}
          />
        ))}
      </View>

      {/* Testimonials / Success Stories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Success Stories</Text>
        <View style={styles.testimonialCard}>
          <Text style={styles.testimonialText}>
            "Bimal Institute didn't just teach me strategies; it completely rewired my trading psychology. The AI Coach feature is a game-changer."
          </Text>
          <Text style={styles.testimonialAuthor}>- Rahul S., Full-Time Trader</Text>
        </View>
      </View>

      {/* Upcoming Events */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        <View style={styles.eventCard}>
          <View style={styles.eventDateBox}>
            <Text style={styles.eventMonth}>OCT</Text>
            <Text style={styles.eventDay}>24</Text>
          </View>
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>Live Market Analysis Seminar</Text>
            <Text style={styles.eventLocation}>Mumbai & Online</Text>
          </View>
        </View>
      </View>

      {/* Join Community CTA */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Ready to transform your trading?</Text>
        <PrimaryButton 
          title="Join The Community" 
          onPress={() => router.push('/(auth)/register')} 
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  heroBanner: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  heroTitle: {
    ...Typography.h1,
    color: Colors.primary,
    marginBottom: 8,
  },
  heroSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  sectionTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  seeAll: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -4,
  },
  testimonialCard: {
    backgroundColor: Colors.cardSecondary,
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  testimonialText: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontStyle: 'italic',
    marginBottom: 12,
    lineHeight: 24,
  },
  testimonialAuthor: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  eventDateBox: {
    backgroundColor: Colors.cardSecondary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  eventMonth: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  eventDay: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  eventInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  eventTitle: {
    ...Typography.body,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  eventLocation: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  ctaSection: {
    marginTop: 16,
    marginBottom: 40,
    padding: 24,
    backgroundColor: Colors.cardSecondary,
    borderRadius: 16,
    alignItems: 'center',
  },
  ctaTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 24,
  },
});
