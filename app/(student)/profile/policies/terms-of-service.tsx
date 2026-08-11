import React from 'react';
import { PolicyLayout } from '@/components/profile/PolicyLayout';
import TermsOfServiceScreen from '@/components/profile/policy/terms-of-service';

export default function TermsOfServiceScreenWrapper() {
  return (
    <PolicyLayout title="Terms of Service">
      <TermsOfServiceScreen />
    </PolicyLayout>
  );
}
