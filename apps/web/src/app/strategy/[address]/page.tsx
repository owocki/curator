'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStrategy } from '@/hooks/useStrategies';
import { useUIStore } from '@/lib/store';
import { StatCard } from '@/components/common/StatCard';
import { AddressDisplay } from '@/components/common/AddressDisplay';
import { AllocationChart } from '@/components/strategy/AllocationChart';
import { DestinationList } from '@/components/strategy/DestinationList';
import { formatEther, bpsToPercent } from '@/lib/utils';

export default function StrategyDetailPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = use(params);
  const router = useRouter();
  const { strategy, isLoading, error } = useStrategy(address as `0x${string}`);
  const { openFundModal } = useUIStore();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20 text-gray-400">
          Loading strategy...
        </div>
      </div>
    );
  }

  if (error || !strategy) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold text-white mb-2">
            Strategy not found
          </h2>
          <p className="text-gray-400 mb-6">
            The strategy you&apos;re looking for doesn&apos;t exist or couldn&apos;t be loaded.
          </p>
          <Link
            href="/strategies"
            className="text-indigo-400 hover:text-indigo-300"
          >
            Back to strategies
          </Link>
        </div>
      </div>
    );
  }

  const handleCopy = () => {
    router.push(`/create?copy=${address}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/strategies"
        className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1 mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Strategies
      </Link>

      {/* Header */}
      <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{strategy.name}</h1>
            <p className="text-gray-400 flex items-center gap-2">
              Curated by <AddressDisplay address={strategy.curator} chars={6} />
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="px-5 py-2.5 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-lg transition-colors"
            >
              Copy
            </button>
            <button
              onClick={() => openFundModal(strategy)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
            >
              Fund
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <StatCard
            label="Total Allocated"
            value={`${formatEther(strategy.totalAllocated)} ETH`}
          />
          <StatCard label="Unique Donors" value={strategy.totalDonors} />
          <StatCard
            label="Destinations"
            value={strategy.destinations.length}
          />
          <StatCard
            label="Curator Fee"
            value={`${bpsToPercent(strategy.curatorFeeBps)}%`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Allocation Chart */}
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-white mb-6">
            Allocation Breakdown
          </h2>
          <AllocationChart destinations={strategy.destinations} />
        </div>

        {/* Destination List */}
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-white mb-6">
            Funding Destinations
          </h2>
          <DestinationList
            destinations={strategy.destinations}
            totalAllocated={strategy.totalAllocated}
          />
        </div>
      </div>

      {/* Contract Info */}
      <div className="mt-6 bg-gray-900/50 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Contract Details
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Strategy Address</span>
            <AddressDisplay address={strategy.address} chars={8} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Curator Address</span>
            <AddressDisplay address={strategy.curator} chars={8} />
          </div>
        </div>
      </div>
    </div>
  );
}
