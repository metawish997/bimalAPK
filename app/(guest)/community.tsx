import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Colors } from '../../src/constants/Colors';
import { Typography } from '../../src/constants/Typography';

export default function GuestCommunityScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Elite Trader Community</Text>
        <Text style={styles.subtitle}>Join 17,000+ traders mastering the markets together.</Text>
      </View>

      {/* Announcements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Announcements</Text>
        <View style={styles.announcementCard}>
          <Text style={styles.announcementBadge}>NEW</Text>
          <Text style={styles.announcementText}>Bimal Institute is hosting a free webinar on Advanced Price Action this Friday. Don't miss it!</Text>
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
        <View style={styles.eventCard}>
          <View style={styles.eventDateBox}>
            <Text style={styles.eventMonth}>NOV</Text>
            <Text style={styles.eventDay}>05</Text>
          </View>
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>Options Trading Bootcamp</Text>
            <Text style={styles.eventLocation}>Online Exclusive</Text>
          </View>
        </View>
      </View>

      {/* Success Stories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Success Stories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          <View style={styles.storyCard}>
            <Text style={styles.storyQuote}>"I passed my funded challenge after just 3 months of mentorship."</Text>
            <Text style={styles.storyAuthor}>- Sarah M.</Text>
          </View>
          <View style={styles.storyCard}>
            <Text style={styles.storyQuote}>"The psychology modules literally saved my trading account."</Text>
            <Text style={styles.storyAuthor}>- Amit P.</Text>
          </View>
        </ScrollView>
      </View>

      {/* Photo Gallery Mock */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Community Meetups</Text>
        <View style={styles.galleryGrid}>
          <View style={styles.galleryPlaceholder}>
            <Text style={styles.placeholderText}>Photo 1</Text>
          </View>
          <View style={styles.galleryPlaceholder}>
             <Text style={styles.placeholderText}>Photo 2</Text>
          </View>
          <View style={styles.galleryPlaceholder}>
             <Text style={styles.placeholderText}>Photo 3</Text>
          </View>
          <View style={styles.galleryPlaceholder}>
             <Text style={styles.placeholderText}>Photo 4</Text>
          </View>
        </View>
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
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    ...Typography.h1,
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  announcementCard: {
    backgroundColor: Colors.cardSecondary,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
  },
  announcementBadge: {
    backgroundColor: Colors.primary,
    color: Colors.background,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontWeight: 'bold',
    fontSize: 10,
    marginBottom: 8,
  },
  announcementText: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
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
  horizontalScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  storyCard: {
    backgroundColor: Colors.cardSecondary,
    width: 250,
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    marginRight: 16,
  },
  storyQuote: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  storyAuthor: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  galleryPlaceholder: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: Colors.cardSecondary,
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  placeholderText: {
    color: Colors.textSecondary,
    ...Typography.caption,
  }
});
