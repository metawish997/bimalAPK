import { ProfileTheme } from '@/components/profile/theme';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PolicyLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const PolicyLayout = ({ title, children }: PolicyLayoutProps) => {
  const router = useRouter();
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color={ProfileTheme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 20 }} />
      </View>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

export const PolicyText = ({ children, style }: { children: React.ReactNode, style?: any }) => (
  <Text style={[styles.paragraph, style]}>{children}</Text>
);

export const PolicyHeading = ({ children, style }: { children: React.ReactNode, style?: any }) => (
  <Text style={[styles.heading, style]}>{children}</Text>
);

export const PolicyListItem = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.listItem}>
    <Text style={styles.bullet}>•</Text>
    <Text style={styles.paragraph}>{children}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: ProfileTheme.colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderColor: '#1C1C1E',
  },
  backButton: { paddingVertical: 4 },
  headerTitle: { fontSize: 15, fontWeight: '600', color: '#ffffff', letterSpacing: -0.2 },
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  paragraph: { fontSize: 14, color: '#E5E5E5', lineHeight: 22, marginBottom: 16 },
  heading: { fontSize: 18, fontWeight: 'bold', color: '#ffffff', marginTop: 24, marginBottom: 12 },
  listItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8, paddingLeft: 8 },
  bullet: { fontSize: 14, color: '#E5E5E5', marginRight: 8, lineHeight: 22 },
});
