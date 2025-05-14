'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import the SimpleStripeGuide component
const StripeGuide = dynamic(() => import('./SimpleStripeGuide'), {
  ssr: false,
  loading: () => <p className="text-slate-400 p-4 text-center">Loading guide...</p>
});

export default function DynamicStripeGuide() {
  return <StripeGuide />;
}