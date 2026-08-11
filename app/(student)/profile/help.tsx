import { ProfileTheme } from '@/components/profile/theme';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const FAQS = [
  { question: 'How do I upgrade my subscription?', answer: 'You can upgrade your subscription by going to the Upgrade Plan page from your profile dashboard.' },
  { question: 'What is paper trading?', answer: 'Paper trading is simulated trading that allows you to practice buying and selling assets without risking real money.' },
  { question: 'How are my course certificates verified?', answer: 'All certificates are issued with a unique verification ID that employers can check on our portal.' },
  { question: 'Can I reset my paper trading portfolio?', answer: 'Yes, you can reset your virtual balance from the Paper Trading settings in the Journal tab.' },
];

export default function HelpScreen() {
  const router = useRouter();

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@bimalinstitute.com?subject=App Support Request');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color={ProfileTheme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Support Triggers */}
        <View style={styles.contactSection}>
          <TouchableOpacity style={styles.contactRow} onPress={handleEmailSupport} activeOpacity={0.6}>
            <View style={styles.metaInfo}>
              <Text style={styles.contactTitle}>Email Support</Text>
              <Text style={styles.contactDesc}>System response window sits within 24 hours.</Text>
            </View>
            <Feather name="arrow-up-right" size={14} color="#444444" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.contactRow, styles.noBorder]} activeOpacity={0.6}>
            <View style={styles.metaInfo}>
              <Text style={styles.contactTitle}>Community Forum</Text>
              <Text style={styles.contactDesc}>Coordinate with verified ecosystem participants.</Text>
            </View>
            <Feather name="arrow-up-right" size={14} color="#444444" />
          </TouchableOpacity>
        </View>

        {/* Clean Boxed FAQ Block Framework */}
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

        <View style={styles.faqContainer}>
          {FAQS.map((faq, index) => (
            <View key={index} style={styles.faqCardBox}>
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
            </View>
          ))}
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>System v2.1.0 • Build 1042</Text>
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
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  contactSection: {
    marginBottom: 28,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#121212',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  metaInfo: {
    flex: 1,
    paddingRight: 16,
  },
  contactTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 2,
    letterSpacing: -0.1,
  },
  contactDesc: {
    fontSize: 12,
    color: ProfileTheme.colors.textSecondary,
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: ProfileTheme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 16,
  },
  faqContainer: {
    gap: 10,
    marginBottom: 32,
  },
  faqCardBox: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1A1A1A', // Sharp minimal frame lines for structure
    borderRadius: 12,
    padding: 16,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.1,
    marginBottom: 6,
  },
  faqAnswer: {
    fontSize: 13,
    color: ProfileTheme.colors.textSecondary,
    lineHeight: 18,
    fontWeight: '400',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: '#121212',
  },
  versionText: {
    color: ProfileTheme.colors.textSecondary,
    fontSize: 12,
    opacity: 0.5,
  },
});