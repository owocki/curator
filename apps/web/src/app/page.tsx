'use client';

import Link from 'next/link';
import { useStrategies, useStrategyCount } from '@/hooks/useStrategies';
import { StatCard } from '@/components/common/StatCard';
import { StrategyTable } from '@/components/strategy/StrategyTable';
import { StrategyCard } from '@/components/strategy/StrategyCard';
import { formatEther } from '@/lib/utils';

export default function HomePage() {
  const { strategies, isLoading } = useStrategies();
  const { data: strategyCount } = useStrategyCount();

  const totalAllocated = strategies.reduce(
    (sum, s) => sum + s.totalAllocated,
    0n
  );
  const totalDonors = strategies.reduce((sum, s) => sum + s.totalDonors, 0);
  const uniqueCurators = new Set(strategies.map((s) => s.curator)).size;

  const topStrategies = strategies.slice(0, 5);
  const trendingStrategies = [...strategies]
    .sort((a, b) => b.totalDonors - a.totalDonors)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Public Goods Funding Marketplace
            </h1>
            <p className="text-gray-400">
              Design, publish, and operate capital allocation strategies
            </p>
          </div>
          <Link
            href="/create"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
          >
            + Create Strategy
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Allocated"
            value={`${formatEther(totalAllocated)} ETH`}
          />
          <StatCard
            label="Active Strategies"
            value={strategyCount?.toString() || '0'}
          />
          <StatCard label="Total Donors" value={totalDonors} />
          <StatCard label="Curators" value={uniqueCurators} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Strategies */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Top Strategies</h2>
              <Link
                href="/strategies"
                className="text-sm text-indigo-400 hover:text-indigo-300"
              >
                View all
              </Link>
            </div>
            {isLoading ? (
              <div className="text-center py-12 text-gray-400">
                Loading strategies...
              </div>
            ) : (
              <StrategyTable strategies={topStrategies} />
            )}
          </div>
        </div>

        {/* Trending */}
        <div>
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Trending</h2>
            {isLoading ? (
              <div className="text-center py-12 text-gray-400">Loading...</div>
            ) : trendingStrategies.length > 0 ? (
              <div className="space-y-4">
                {trendingStrategies.map((strategy, i) => (
                  <StrategyCard key={strategy.address} strategy={strategy} rank={i + 1} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                No strategies yet.
                <br />
                <Link href="/create" className="text-indigo-400 hover:text-indigo-300">
                  Create the first one!
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
