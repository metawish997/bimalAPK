import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProfileTheme } from './theme';

const PROGRESS_DATA = [
  { id: 1, title: 'Technical Analysis', completion: 85, lessons: '24/28', status: 'Mastered', color: ProfileTheme.colors.success },
  { id: 2, title: 'Fundamental Analysis', completion: 60, lessons: '15/25', status: 'In Progress', color: ProfileTheme.colors.primary },
  { id: 3, title: 'Risk Management', completion: 100, lessons: '12/12', status: 'Certified', color: ProfileTheme.colors.warning },
  { id: 4, title: 'Options Trading', completion: 30, lessons: '6/20', status: 'Beginner', color: ProfileTheme.colors.primary },
  { id: 5, title: 'Swing Trading', completion: 75, lessons: '15/20', status: 'Advanced', color: ProfileTheme.colors.success },
  { id: 6, title: 'Portfolio Management', completion: 45, lessons: '9/20', status: 'In Progress', color: ProfileTheme.colors.primary },
];

export const LearningProgress = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Course Progress</Text>
      
      <View style={styles.list}>
        {PROGRESS_DATA.map((item, index) => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.itemRow, index === PROGRESS_DATA.length - 1 && styles.noBorder]} 
            activeOpacity={0.7}
          >
            <View style={styles.header}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.lessonsText}>{item.lessons} lessons</Text>
            </View>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: `${item.completion}%`, backgroundColor: item.color }]} />
              </View>
              <Text style={styles.percentageText}>{item.completion}%</Text>
            </View>
          </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: ProfileTheme.colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 16,
    opacity: 0.8,
  },
  list: {
    gap: 0, // Handled cleanly via single row borders
  },
  itemRow: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#141414', // Hairline dark separator
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: '#ffffff',
    letterSpacing: -0.1,
  },
  lessonsText: {
    fontSize: 12,
    color: ProfileTheme.colors.textSecondary,
    fontWeight: '400',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBarBackground: {
    flex: 1,
    height: 3, // Ultra-thin luxury feel progress bar
    backgroundColor: '#1A1A1A',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '500',
    color: ProfileTheme.colors.textSecondary,
    width: 32,
    textAlign: 'right',
  },
});