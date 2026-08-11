import React from 'react';
import { PolicyLayout } from '@/components/profile/PolicyLayout';
import DisclaimerScreen from '@/components/profile/policy/disclaimer';

export default function DisclaimerScreenWrapper() {
  return (
    <PolicyLayout title="Disclaimer">
      <DisclaimerScreen />
    </PolicyLayout>
  );
}
