import React from 'react';
import { PolicyLayout } from '@/components/profile/PolicyLayout';
import PrivacyPolicyScreen from '@/components/profile/policy/privacy-policy';

export default function PrivacyPolicyScreenWrapper() {
  return (
    <PolicyLayout title="Privacy Policy">
      <PrivacyPolicyScreen />
    </PolicyLayout>
  );
}
