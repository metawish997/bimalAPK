import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProfileTheme } from './theme';

const INTERESTS = [
  'Stocks',
  'Options Trading',
  'Swing Trading',
  'Technical Analysis',
  'Long-Term Investing',
  'ETFs',
];

export const WatchlistInterests = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Watchlist & Interests</Text>
        <TouchableOpacity
          onPress={() => router.push('/(student)/profile/interests')}
          activeOpacity={0.7}
        >
          <Text style={styles.editActionText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tagsContainer}>
        {INTERESTS.map((interest, index) => (
          <View key={index} style={styles.tagWrapper}>
            {/* Added proper full rounded thin green bordered containers for chip layouts */}
            <View style={styles.chipContainer}>
              <Text style={styles.tagText}>{interest}</Text>
            </View>
            {index !== INTERESTS.length - 1 && (
              <Text style={styles.dividerBullet}>•</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: ProfileTheme.colors.background,
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: ProfileTheme.colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  editActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#A8FF3E', // Updated edit button to signature premium green layout
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 12,
    alignItems: 'center',
  },
  tagWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipContainer: {
    borderWidth: 1,
    borderColor: '#a8ff3e7b', // High-contrast clean thin green border line rule
    borderRadius: 20, // Fully rounded shape implementation
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'transparent',
  },
  tagText: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  dividerBullet: {
    fontSize: 12,
    color: '#A8FF3E', // Dots updated to custom matching green color rules perfectly
    fontWeight: 'bold',
    opacity: 0.8,
    paddingHorizontal: 8,
  },
});