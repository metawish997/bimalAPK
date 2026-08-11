import React from 'react';
import { PolicyLayout } from '@/components/profile/PolicyLayout';
import RefundPolicyScreen from '@/components/profile/policy/refund-policy';

export default function RefundPolicyScreenWrapper() {
  return (
    <PolicyLayout title="Refund Policy">
      <RefundPolicyScreen />
    </PolicyLayout>
  );
}
