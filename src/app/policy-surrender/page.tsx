"use client";

import { Suspense } from 'react';
import PolicySurrenderScreen from '@/screens/PolicySurrenderScreen';

export default function PolicySurrenderPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PolicySurrenderScreen />
    </Suspense>
  );
}
