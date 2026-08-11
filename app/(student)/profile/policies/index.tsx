import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PolicyLayout } from '@/components/profile/PolicyLayout';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { ProfileTheme } from '@/components/profile/theme';

const POLICY_LINKS = [
  { id: 'terms', title: 'Terms of Service', route: '/(student)/profile/policies/terms-of-service' },
  { id: 'privacy', title: 'Privacy Policy', route: '/(student)/profile/policies/privacy-policy' },
  { id: 'disclaimer', title: 'Disclaimer', route: '/(student)/profile/policies/disclaimer' },
  { id: 'fee', title: 'Fee Policy', route: '/(student)/profile/policies/fee-policy' },
  { id: 'refund', title: 'Refund Policy', route: '/(student)/profile/policies/refund-policy' },
  { id: 'grievance', title: 'Grievance Policy', route: '/(student)/profile/policies/grievance-policy' },
];

export default function PoliciesIndexScreen() {
  const router = useRouter();

  return (
    <PolicyLayout title="Legal & Policies">
      <View style={styles.listContainer}>
        {POLICY_LINKS.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.settingItem,
              index === POLICY_LINKS.length - 1 && styles.noBorder
            ]}
            onPress={() => router.push(item.route as any)}
            activeOpacity={0.6}
          >
            <Text style={styles.settingText}>{item.title}</Text>
            <Feather name="chevron-right" size={14} color="#333333" style={styles.arrowIcon} />
          </TouchableOpacity>
        ))}
      </View>
    </PolicyLayout>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: '#0A0A0A',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#1C1C1E',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#141414',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  settingText: {
    fontSize: 14,
    color: '#E5E5E5',
    fontWeight: '400',
  },
  arrowIcon: {
    marginLeft: 8,
  },
});
