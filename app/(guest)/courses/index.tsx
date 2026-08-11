import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../../src/constants/Colors';
import { Typography } from '../../../src/constants/Typography';
import { CourseCard } from '../../../src/components/cards/CourseCard';

const FILTERS = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Forex', 'Crypto', 'Options', 'Equity'];

const MOCK_COURSES = [
  { id: '1', title: 'Beginner to Pro: Forex Mastery', instructor: 'Bimal Institute', duration: '12h 30m', rating: 4.8, category: 'Forex' },
  { id: '2', title: 'Advanced Options Strategies', instructor: 'Bimal Institute', duration: '8h 15m', rating: 4.9, category: 'Options' },
  { id: '3', title: 'Crypto Trading Fundamentals', instructor: 'Bimal Institute', duration: '5h 45m', rating: 4.6, category: 'Crypto' },
  { id: '4', title: 'Price Action Masterclass', instructor: 'Bimal Institute', duration: '15h 00m', rating: 5.0, category: 'Intermediate' },
  { id: '5', title: 'Equity Intraday Setups', instructor: 'Bimal Institute', duration: '6h 20m', rating: 4.7, category: 'Equity' },
];

export default function GuestCourseListingScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredCourses = activeFilter === 'All' 
    ? MOCK_COURSES 
    : MOCK_COURSES.filter(course => course.category === activeFilter || course.title.includes(activeFilter));

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Explore Courses</Text>
      <Text style={styles.subtitle}>Level up your trading skills</Text>
      
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                activeFilter === filter && styles.activeFilterChip
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[
                styles.filterText,
                activeFilter === filter && styles.activeFilterText
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CourseCard
            title={item.title}
            instructor={item.instructor}
            duration={item.duration}
            rating={item.rating}
            onPress={() => router.push(`/(guest)/courses/${item.id}` as any)}
          />
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: 16,
    paddingTop: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  filterContainer: {
    marginBottom: 8,
    marginHorizontal: -16, // Bleed to edges for scroll
    paddingHorizontal: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.cardSecondary,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    ...Typography.caption,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  activeFilterText: {
    color: Colors.background,
  },
});
