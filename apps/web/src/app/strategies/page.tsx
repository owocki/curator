'use client';

import Link from 'next/link';
import { useStrategies } from '@/hooks/useStrategies';
import { StrategyCard } from '@/components/strategy/StrategyCard';

export default function StrategiesPage() {
  const { strategies, isLoading } = useStrategies();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">All Strategies</h1>
          <p className="text-gray-400 mt-1">
            Browse and discover capital allocation strategies
          </p>
        </div>
        <Link
          href="/create"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
        >
          + Create Strategy
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-gray-400">
          Loading strategies...
        </div>
      ) : strategies.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-xl font-semibold text-white mb-2">
            No strategies yet
          </h3>
          <p className="text-gray-400 mb-6">
            Be the first to create a capital allocation strategy
          </p>
          <Link
            href="/create"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
          >
            Create Strategy
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {strategies.map((strategy, index) => (
            <StrategyCard
              key={strategy.address}
              strategy={strategy}
              rank={index + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
