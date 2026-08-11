import React from 'react';
import { PolicyLayout } from '@/components/profile/PolicyLayout';
import GrievancePolicyScreen from '@/components/profile/policy/grievance-policy';

export default function GrievancePolicyScreenWrapper() {
  return (
    <PolicyLayout title="Grievance Policy">
      <GrievancePolicyScreen />
    </PolicyLayout>
  );
}
