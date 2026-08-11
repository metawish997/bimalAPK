import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { ProfileTheme } from './theme';
import { subscriptionService } from '@/services/subscriptionService';
import { kycService } from '@/services/kycService';

export const SubscriptionSection = () => {
  const router = useRouter();
  const [activeSub, setActiveSub] = useState<any>(null);
  const [kycStatus, setKycStatus] = useState<string>('approved'); // Default to approved until loaded
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, kycRes] = await Promise.all([
          subscriptionService.getMySubscriptions().catch(() => ({ data: { data: [] } })),
          kycService.getStatus().catch(() => ({ kyc_status: 'pending' }))
        ]);
        
        const subs = subRes.data?.data || [];
        const active = subs.find((sub: any) => sub.status === 'active' && new Date(sub.end_date) > new Date());
        setActiveSub(active);
        setKycStatus(kycRes.kyc_status || 'pending');
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Subscription</Text>

      <View style={styles.subscriptionCard}>
        {isLoading ? (
          <ActivityIndicator size="small" color={ProfileTheme.colors.primary} style={{ padding: 20 }} />
        ) : !['approved', 'completed', 'success'].includes(kycStatus) ? (
          <>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.planLabel}>CURRENT STATUS</Text>
                <Text style={styles.planName}>KYC Required</Text>
              </View>

              <View style={styles.statusRow}>
                <View style={[styles.pulseDot, { backgroundColor: ProfileTheme.colors.warning }]} />
                <Text style={styles.statusText}>Pending</Text>
              </View>
            </View>

            <View style={styles.detailsContainer}>
              <Text style={styles.detailText}>Please complete your KYC verification first before upgrading to a premium node.</Text>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.inlineButton}
                onPress={() => router.push('/(student)/profile/kyc')}
                activeOpacity={0.7}
              >
                <Text style={[styles.actionText, { color: ProfileTheme.colors.warning }]}>Complete KYC</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : activeSub ? (
          <>
            {/* 1. Structural Header Block */}
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.planLabel}>CURRENT PLAN</Text>
                <Text style={styles.planName}>{activeSub.subscription_plan?.name || 'Unknown Plan'}</Text>
              </View>

              <View style={styles.statusRow}>
                <View style={styles.pulseDot} />
                <Text style={styles.statusText}>Active</Text>
              </View>
            </View>

            {/* 2. Flat Balanced Metadata Details */}
            <View style={styles.detailsContainer}>
              <Text style={styles.detailText}>Started: {formatDate(activeSub.start_date)}</Text>
              <Text style={styles.dividerBullet}>•</Text>
              <Text style={styles.detailText}>Renews: {formatDate(activeSub.end_date)}</Text>
            </View>

            {/* 3. Inline Typography Utilities */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.inlineButton}
                onPress={() => router.push('/(student)/profile/upgrade')}
                activeOpacity={0.7}
              >
                <Text style={[styles.actionText, { color: ProfileTheme.colors.warning }]}>Upgrade Plan</Text>
              </TouchableOpacity>

              <View style={styles.verticalDivider} />

              <TouchableOpacity style={styles.inlineButton} activeOpacity={0.7}>
                <Text style={styles.actionText}>Manage</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.planLabel}>CURRENT PLAN</Text>
                <Text style={styles.planName}>No Active Plan</Text>
              </View>

              <View style={styles.statusRow}>
                <View style={[styles.pulseDot, { backgroundColor: '#FF5252' }]} />
                <Text style={styles.statusText}>Not Active</Text>
              </View>
            </View>

            <View style={styles.detailsContainer}>
              <Text style={styles.detailText}>Subscribe to unlock premium features and metrics.</Text>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.inlineButton}
                onPress={() => router.push('/(student)/profile/upgrade')}
                activeOpacity={0.7}
              >
                <Text style={[styles.actionText, { color: ProfileTheme.colors.success }]}>Subscribe Now</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
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
    marginBottom: 20,
    opacity: 0.8,
  },
  subscriptionCard: {
    borderWidth: 1,
    borderColor: '#1A1A1A', // Ultra fine modern boundary wrapper
    borderRadius: 12,
    padding: 16,
    backgroundColor: 'transparent',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderColor: '#141414',
  },
  planLabel: {
    fontSize: 9,
    color: ProfileTheme.colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 2,
    fontWeight: '500',
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  pulseDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: ProfileTheme.colors.success,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
    color: ProfileTheme.colors.textSecondary,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  detailText: {
    fontSize: 12,
    color: ProfileTheme.colors.textSecondary,
    fontWeight: '400',
  },
  dividerBullet: {
    fontSize: 10,
    color: ProfileTheme.colors.textSecondary,
    opacity: 0.3,
    paddingHorizontal: 8,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  inlineButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: ProfileTheme.colors.textSecondary,
    letterSpacing: -0.1,
  },
  verticalDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#1F1F1F',
  },
});