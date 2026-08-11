import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProfileTheme } from '../../../src/components/profile/theme';

const ALL_PAYMENTS = [
  { id: 'INV-2024-004', date: 'Apr 15, 2024', amount: '₹4,999', status: 'Paid', plan: 'Pro Trader', method: 'UPI' },
  { id: 'INV-2024-003', date: 'Mar 15, 2024', amount: '₹4,999', status: 'Paid', plan: 'Pro Trader', method: 'Credit Card' },
  { id: 'INV-2024-002', date: 'Feb 15, 2024', amount: '₹4,999', status: 'Paid', plan: 'Pro Trader', method: 'UPI' },
  { id: 'INV-2024-001', date: 'Jan 15, 2024', amount: '₹4,999', status: 'Paid', plan: 'Pro Trader', method: 'Debit Card' },
  { id: 'INV-2023-012', date: 'Dec 15, 2023', amount: '₹4,999', status: 'Paid', plan: 'Pro Trader', method: 'UPI' },
];

export default function PaymentsHistoryScreen() {
  const router = useRouter();

  const renderPaymentItem = ({ item, index }: { item: any, index: number }) => (
    <View style={[styles.paymentItem, index === ALL_PAYMENTS.length - 1 && styles.noBorder]}>
      <View style={styles.mainInfo}>
        <Text style={styles.planName}>{item.plan}</Text>
        <Text style={styles.metaText}>
          {item.date} <Text style={styles.invoiceId}>• {item.id}</Text>
        </Text>
        <Text style={styles.methodText}>Via {item.method}</Text>
      </View>

      <View style={styles.amountContainer}>
        <Text style={styles.amountText}>{item.amount}</Text>
        <TouchableOpacity style={styles.inlineAction} activeOpacity={0.7}>
          <Feather name="download" size={12} color={ProfileTheme.colors.textSecondary} />
          <Text style={styles.actionText}>Invoice</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={ProfileTheme.colors.background} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color={ProfileTheme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Ledger</Text>
        <TouchableOpacity style={styles.filterBtn} activeOpacity={0.7}>
          <Feather name="sliders" size={16} color={ProfileTheme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={ALL_PAYMENTS}
        keyExtractor={item => item.id}
        renderItem={renderPaymentItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  backBtn: {
    paddingVertical: 4,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.2,
  },
  filterBtn: {
    paddingVertical: 4,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: '#141414',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  mainInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#ffffff',
    letterSpacing: -0.1,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: ProfileTheme.colors.textSecondary,
    marginBottom: 2,
  },
  invoiceId: {
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
    opacity: 0.6,
  },
  methodText: {
    fontSize: 11,
    color: ProfileTheme.colors.textSecondary,
    opacity: 0.7,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  inlineAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    color: ProfileTheme.colors.textSecondary,
    fontWeight: '500',
  },
});