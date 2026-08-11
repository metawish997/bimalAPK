import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProfileTheme } from './theme';

const MOCK_PAYMENTS = [
  { id: 'INV-2024-001', date: 'Jan 15, 2024', amount: '₹4,999', status: 'Paid', plan: 'Pro Trader' },
  { id: 'INV-2023-012', date: 'Dec 15, 2023', amount: '₹4,999', status: 'Paid', plan: 'Pro Trader' },
  { id: 'INV-2023-011', date: 'Nov 15, 2023', amount: '₹4,999', status: 'Paid', plan: 'Pro Trader' },
];

export const PaymentHistorySection = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Payment History</Text>
        <TouchableOpacity
          onPress={() => router.push('/(student)/profile/payments')}
          activeOpacity={0.7}
        >
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {MOCK_PAYMENTS.map((payment, index) => (
          <View
            key={payment.id}
            style={[
              styles.paymentItem,
              index === MOCK_PAYMENTS.length - 1 && styles.noBorder
            ]}
          >
            {/* Left Column: Plan Information */}
            <View style={styles.paymentInfo}>
              <Text style={styles.planName}>{payment.plan}</Text>
              <Text style={styles.metaText}>
                {payment.date} <Text style={styles.invoiceId}>• {payment.id}</Text>
              </Text>
            </View>

            {/* Right Column: Pricing Log & Transaction Metadata */}
            <View style={styles.amountContainer}>
              <Text style={styles.amountText}>{payment.amount}</Text>
              <View style={styles.statusRow}>
                <View style={styles.activeIndicatorDot} />
                <Text style={styles.statusText}>{payment.status}</Text>
              </View>
            </View>
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
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: ProfileTheme.colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  viewAll: {
    fontSize: 12,
    fontWeight: '500',
    color: ProfileTheme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listContainer: {
    marginTop: 4,
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#141414', // Ultra thin horizontal razor cut line
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  paymentInfo: {
    flex: 1,
    justifyContent: 'center',
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
  },
  invoiceId: {
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }), // Monospace ledger style
    opacity: 0.6,
  },
  amountContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amountText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  activeIndicatorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: ProfileTheme.colors.success, // Subtle premium activation indicator
  },
  statusText: {
    fontSize: 12,
    fontWeight: '400',
    color: ProfileTheme.colors.textSecondary,
  },
});