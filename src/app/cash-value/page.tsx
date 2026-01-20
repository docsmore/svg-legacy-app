"use client";

import { Suspense } from 'react';
import CashValueScreen from '@/screens/CashValueScreen';

export default function CashValuePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CashValueScreen />
    </Suspense>
  );
}
