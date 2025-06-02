"use client";

import BeneficiaryManagementScreen from '@/screens/BeneficiaryManagementScreen';
import { Suspense } from 'react';

export default function BeneficiaryManagementPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BeneficiaryManagementScreen />
    </Suspense>
  );
}
