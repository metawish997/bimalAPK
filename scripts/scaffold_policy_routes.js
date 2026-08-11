const fs = require('fs');
const path = require('path');

const policies = [
  { file: 'terms-of-service.tsx', name: 'TermsOfServiceScreen', title: 'Terms of Service' },
  { file: 'privacy-policy.tsx', name: 'PrivacyPolicyScreen', title: 'Privacy Policy' },
  { file: 'disclaimer.tsx', name: 'DisclaimerScreen', title: 'Disclaimer' },
  { file: 'fee-policy.tsx', name: 'FeePolicyScreen', title: 'Fee Policy' },
  { file: 'refund-policy.tsx', name: 'RefundPolicyScreen', title: 'Refund Policy' },
  { file: 'grievance-policy.tsx', name: 'GrievancePolicyScreen', title: 'Grievance Policy' },
];

const destDir = path.join(__dirname, '../app/(student)/profile/policies');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

for (const policy of policies) {
  const content = `import React from 'react';
import { PolicyLayout } from '@/components/profile/PolicyLayout';
import ${policy.name} from '@/components/profile/policy/${policy.file.replace('.tsx', '')}';

export default function ${policy.name}Wrapper() {
  return (
    <PolicyLayout title="${policy.title}">
      <${policy.name} />
    </PolicyLayout>
  );
}
`;
  fs.writeFileSync(path.join(destDir, policy.file), content);
  console.log(`Created route for ${policy.file}`);
}
