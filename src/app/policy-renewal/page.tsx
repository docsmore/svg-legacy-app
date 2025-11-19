import { Suspense } from 'react';
import PolicyRenewalScreen from '@/screens/PolicyRenewalScreen';

function PolicyRenewalContent() {
  return <PolicyRenewalScreen />;
}

export default function PolicyRenewalPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PolicyRenewalContent />
    </Suspense>
  );
}
