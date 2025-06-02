"use client";

import LoanQuoteScreen from '@/screens/LoanQuoteScreen';
import { Suspense } from 'react';

export default function LoanQuotePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoanQuoteScreen />
    </Suspense>
  );
}
