import { ProfileTheme } from '@/components/profile/theme';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ALL_INTERESTS = [
  'Stocks', 'Options Trading', 'Swing Trading', 'Technical Analysis',
  'Long-Term Investing', 'ETFs', 'Mutual Funds', 'Crypto', 'Forex',
  'Day Trading', 'Fundamental Analysis', 'Value Investing', 'Growth Investing'
];

export default function EditInterestsScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([
    'Stocks', 'Options Trading', 'Swing Trading', 'Technical Analysis', 'Long-Term Investing', 'ETFs'
  ]);

  const toggleInterest = (interest: string) => {
    if (selected.includes(interest)) {
      setSelected(selected.filter(i => i !== interest));
    } else {
      setSelected([...selected, interest]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color={ProfileTheme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Interests</Text>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.saveActionText}>Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Choose topics to structure your training path and refine personal tracking algorithms.</Text>

        <View style={styles.tagsGrid}>
          {ALL_INTERESTS.map((interest) => {
            const isSelected = selected.includes(interest);
            return (
              <TouchableOpacity
                key={interest}
                style={[styles.tag, isSelected && styles.tagSelected]}
                onPress={() => toggleInterest(interest)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>{interest}</Text>
                {isSelected && <View style={styles.activeDot} />}
              </TouchableOpacity>
            );
          })}
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
  subtitle: {
    fontSize: 13,
    color: ProfileTheme.colors.textSecondary,
    marginBottom: 24,
    lineHeight: 18,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1F1F1F',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 6,
    backgroundColor: 'transparent',
  },
  tagSelected: {
    borderColor: '#A8FF3E',
  },
  tagText: {
    fontSize: 13,
    color: ProfileTheme.colors.textSecondary,
    fontWeight: '400',
  },
  tagTextSelected: {
    color: '#ffffff',
    fontWeight: '500',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#A8FF3E',
  },
});