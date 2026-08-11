import { ProfileTheme } from '@/components/profile/theme';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const DAILY_GOALS = [15, 30, 45, 60, 120];

export default function LearningPreferencesScreen() {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [dailyGoal, setDailyGoal] = useState(45);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color={ProfileTheme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preferences</Text>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.saveActionText}>Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Difficulty Level</Text>
          <Text style={styles.sectionDesc}>Adjust the baseline complexity for analytical algorithms and tracking exercises.</Text>

          <View style={styles.optionsContainer}>
            {DIFFICULTIES.map((level) => {
              const isSelected = difficulty === level;
              return (
                <TouchableOpacity
                  key={level}
                  style={[styles.optionRow, isSelected && styles.optionSelected]}
                  onPress={() => setDifficulty(level)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{level}</Text>
                  {isSelected && <View style={styles.activeDot} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Target</Text>
          <Text style={styles.sectionDesc}>Allocate the systematic time window dedicated to execution tracking daily.</Text>

          <View style={styles.goalsGrid}>
            {DAILY_GOALS.map((mins) => {
              const isSelected = dailyGoal === mins;
              return (
                <TouchableOpacity
                  key={mins}
                  style={[styles.goalBadge, isSelected && styles.goalSelected]}
                  onPress={() => setDailyGoal(mins)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.goalText, isSelected && styles.goalTextSelected]}>
                    {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ProfileTheme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#1C1C1E',
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
  saveActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A8FF3E',
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: ProfileTheme.colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sectionDesc: {
    fontSize: 13,
    color: ProfileTheme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 0,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#121212',
  },
  optionSelected: {
    borderColor: '#1C1C1E',
  },
  optionText: {
    fontSize: 15,
    color: ProfileTheme.colors.textSecondary,
  },
  optionTextSelected: {
    color: '#ffffff',
    fontWeight: '500',
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#A8FF3E',
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalBadge: {
    flex: 1,
    minWidth: '18%',
    borderWidth: 1,
    borderColor: '#1F1F1F',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  goalSelected: {
    borderColor: '#A8FF3E',
  },
  goalText: {
    fontSize: 13,
    color: ProfileTheme.colors.textSecondary,
    fontWeight: '400',
  },
  goalTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
});