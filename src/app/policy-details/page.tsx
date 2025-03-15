"use client";

import React, { Suspense } from 'react';
import PolicyDetailsScreen from '@/screens/PolicyDetailsScreen';

// Loading component to show while the main component is loading
function Loading() {
  return <div className="text-green-500 bg-black p-4">Loading policy details...</div>;
}

export default function PolicyDetailsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PolicyDetailsScreen />
    </Suspense>
  );
}
