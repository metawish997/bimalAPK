const fs = require('fs');
const path = require('path');

const frontendPoliciesDir = path.join(__dirname, '../../frontend/src/pages/public/policies');
const mobilePoliciesDir = path.join(__dirname, '../app/(student)/profile/policies');
const componentsDir = path.join(__dirname, '../src/components/profile');

if (!fs.existsSync(mobilePoliciesDir)) {
  fs.mkdirSync(mobilePoliciesDir, { recursive: true });
}

// Create PolicyLayout component
const policyLayoutContent = `import { ProfileTheme } from '@/components/profile/theme';
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
`;
fs.writeFileSync(path.join(componentsDir, 'PolicyLayout.tsx'), policyLayoutContent);

const files = fs.readdirSync(frontendPoliciesDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const content = fs.readFileSync(path.join(frontendPoliciesDir, file), 'utf8');
  let title = file.replace('.jsx', '');
  const kebabName = title.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  
  // Extract content between <div className="space-y-4"> or similar and the end of the div
  // This is a naive extraction but works for typical static React pages
  let innerContent = '';
  const match = content.match(/<div className="space-y-4">([\s\S]*?)<\/div><\/div>\s*<\/motion.div>/) || content.match(/<h1[^>]*>.*?<\/h1>\s*<div[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/motion.div>/) || content.match(/<h1[^>]*>.*?<\/h1>\s*(<div[^>]*>[\s\S]*?)<\/div>\s*<\/div>\s*<\/motion.div>/);
  if (match) {
    innerContent = match[1] || match[2] || match[0];
  } else {
    // Just try to grab everything after the h1
    const parts = content.split(/<\/h1>/);
    if (parts.length > 1) {
      innerContent = parts[1].split(/<\/motion\.div>/)[0];
    }
  }

  // Convert HTML to JSX components
  let converted = innerContent
    .replace(/<p[^>]*>/g, '<PolicyText>')
    .replace(/<\/p>/g, '</PolicyText>')
    .replace(/<h2[^>]*>/g, '<PolicyHeading>')
    .replace(/<\/h2>/g, '</PolicyHeading>')
    .replace(/<h3[^>]*>/g, '<PolicyHeading style={{fontSize: 16}}>')
    .replace(/<\/h3>/g, '</PolicyHeading>')
    .replace(/<ul[^>]*>/g, '<View>')
    .replace(/<\/ul>/g, '</View>')
    .replace(/<ol[^>]*>/g, '<View>')
    .replace(/<\/ol>/g, '</View>')
    .replace(/<li[^>]*>/g, '<PolicyListItem>')
    .replace(/<\/li>/g, '</PolicyListItem>')
    .replace(/<section[^>]*>/g, '<View style={{marginBottom: 24}}>')
    .replace(/<\/section>/g, '</View>')
    .replace(/<a[^>]*>/g, '') // Remove a tags
    .replace(/<\/a>/g, '')
    .replace(/<strong[^>]*>/g, '') // Optionally remove strong tags if they cause issues
    .replace(/<\/strong>/g, '')
    .replace(/<div className="space-y-3">/g, '<View>')
    .replace(/<div className="space-y-4">/g, '<View>')
    .replace(/<div[^>]*>/g, '<View>')
    .replace(/<\/div>/g, '</View>')
    .replace(/className="[^"]*"/g, '') // Remove classNames
    .replace(/target="[^"]*"/g, '') // Remove targets
    .replace(/rel="[^"]*"/g, '') // Remove rels
    .replace(/href="[^"]*"/g, '');

  const tsxContent = `import React from 'react';
import { PolicyLayout, PolicyText, PolicyHeading, PolicyListItem } from '@/components/profile/PolicyLayout';
import { View } from 'react-native';

export default function ${title}Screen() {
  return (
    <PolicyLayout title="${title.replace(/([a-z])([A-Z])/g, '$1 $2')}">
      ${converted}
    </PolicyLayout>
  );
}
`;
  
  fs.writeFileSync(path.join(mobilePoliciesDir, `${kebabName}.tsx`), tsxContent);
  console.log(`Generated ${kebabName}.tsx`);
});
