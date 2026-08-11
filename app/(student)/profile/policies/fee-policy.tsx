import React from 'react';
import { PolicyLayout } from '@/components/profile/PolicyLayout';
import FeePolicyScreen from '@/components/profile/policy/fee-policy';

export default function FeePolicyScreenWrapper() {
  return (
    <PolicyLayout title="Fee Policy">
      <FeePolicyScreen />
    </PolicyLayout>
  );
}
