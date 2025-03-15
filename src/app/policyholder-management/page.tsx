"use client";

import React, { Suspense } from 'react';
import PolicyholderManagementScreen from '@/screens/PolicyholderManagementScreen';

// Loading component to show while the main component is loading
function Loading() {
  return <div className="text-green-500 bg-black p-4">Loading policyholder data...</div>;
}

export default function PolicyholderManagementPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PolicyholderManagementScreen />
    </Suspense>
  );
}
