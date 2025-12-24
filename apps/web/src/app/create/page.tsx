'use client';

import Link from 'next/link';
import { StrategyForm } from '@/components/composer/StrategyForm';

export default function CreatePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
        <h1 className="text-3xl font-bold text-white mt-4">Create New Strategy</h1>
        <p className="text-gray-400 mt-2">
          Design your capital allocation strategy by adding funding destinations and setting weights.
        </p>
      </div>

      <StrategyForm />
    </div>
  );
}
