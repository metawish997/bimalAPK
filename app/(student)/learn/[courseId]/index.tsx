import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../../../src/constants/Colors';
import { Typography } from '../../../../src/constants/Typography';
import { FontAwesome } from '@expo/vector-icons';
import { PrimaryButton } from '../../../../src/components/common/PrimaryButton';

const COURSE_MODULES = [
  {
    id: 'm1',
    title: 'Module 1: Market Fundamentals',
    chapters: [
      { id: 'c1', title: 'Understanding Market Structure', duration: '45m', completed: true },
      { id: 'c2', title: 'Support & Resistance Zones', duration: '50m', completed: true },
    ]
  },
  {
    id: 'm2',
    title: 'Module 2: Advanced Price Action',
    chapters: [
      { id: 'c3', title: 'Candlestick Psychology', duration: '1h 10m', completed: false },
      { id: 'c4', title: 'Volume Spread Analysis', duration: '1h 25m', completed: false },
    ]
  }
];

export default function CourseDetailsScreen() {
  const { courseId } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Course Content</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.heroSection}>
          <Text style={styles.courseTitle}>Advanced Price Action Mastery</Text>
          <Text style={styles.courseSubtitle}>By Bimal Institute • 12h 30m Total</Text>
          
          <View style={styles.progressRow}>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: '50%' }]} />
            </View>
            <Text style={styles.progressText}>50%</Text>
          </View>
        </View>

        <PrimaryButton 
          title="Continue Learning" 
          onPress={() => router.push(`/(student)/learn/${courseId}/video/c3`)} 
        />

        <View style={styles.modulesContainer}>
          {COURSE_MODULES.map(module => (
            <View key={module.id} style={styles.moduleCard}>
              <Text style={styles.moduleTitle}>{module.title}</Text>
              
              {module.chapters.map(chapter => (
                <TouchableOpacity 
                  key={chapter.id} 
                  style={styles.chapterRow}
                  onPress={() => router.push(`/(student)/learn/${courseId}/video/${chapter.id}`)}
                >
                  <View style={styles.chapterIconContainer}>
                    <FontAwesome 
                      name={chapter.completed ? "check-circle" : "play-circle"} 
                      size={20} 
                      color={chapter.completed ? Colors.success : Colors.textSecondary} 
                    />
                  </View>
                  <View style={styles.chapterInfo}>
                    <Text style={[styles.chapterTitle, chapter.completed && styles.chapterTitleCompleted]}>
                      {chapter.title}
                    </Text>
                    <Text style={styles.chapterDuration}>{chapter.duration}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.resourcesSection}>
          <Text style={styles.sectionTitle}>Resources</Text>
          <TouchableOpacity style={styles.resourceCard}>
            <FontAwesome name="file-pdf-o" size={24} color={Colors.primary} />
            <Text style={styles.resourceText}>Course Workbook.pdf</Text>
            <FontAwesome name="download" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.card,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  heroSection: {
    marginBottom: 24,
  },
  courseTitle: {
    ...Typography.h1,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  courseSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.cardSecondary,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  progressText: {
    ...Typography.body,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  modulesContainer: {
    marginTop: 32,
  },
  moduleCard: {
    marginBottom: 24,
  },
  moduleTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: Colors.cardSecondary,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chapterIconContainer: {
    marginRight: 12,
  },
  chapterInfo: {
    flex: 1,
  },
  chapterTitle: {
    ...Typography.body,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  chapterTitleCompleted: {
    color: Colors.textSecondary,
  },
  chapterDuration: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  resourcesSection: {
    marginTop: 32,
  },
  sectionTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardSecondary,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resourceText: {
    ...Typography.body,
    color: Colors.textPrimary,
    flex: 1,
    marginLeft: 12,
  },
});
