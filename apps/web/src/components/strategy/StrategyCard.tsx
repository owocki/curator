'use client';

import Link from 'next/link';
import { formatEther, formatAddress, bpsToPercent } from '@/lib/utils';
import type { Strategy } from '@/types';

interface StrategyCardProps {
  strategy: Strategy;
  rank?: number;
}

export function StrategyCard({ strategy, rank }: StrategyCardProps) {
  return (
    <Link
      href={`/strategy/${strategy.address}`}
      className="block bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-indigo-500/50 transition-all hover:bg-gray-800/70"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {rank && (
            <span className="text-2xl font-bold text-gray-600">#{rank}</span>
          )}
          <div>
            <h3 className="font-semibold text-white">{strategy.name}</h3>
            <p className="text-sm text-gray-400">
              by {formatAddress(strategy.curator)}
            </p>
          </div>
        </div>
        <span className="px-2 py-1 text-xs bg-indigo-500/20 text-indigo-400 rounded">
          {bpsToPercent(strategy.curatorFeeBps)}% fee
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <p className="text-xs text-gray-500 uppercase">Total Allocated</p>
          <p className="text-lg font-semibold text-white">
            {formatEther(strategy.totalAllocated)} ETH
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">Donors</p>
          <p className="text-lg font-semibold text-white">
            {strategy.totalDonors}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-500 mb-2">
          {strategy.destinations.length} destinations
        </p>
        <div className="flex gap-1">
          {strategy.destinations.slice(0, 4).map((dest, i) => (
            <div
              key={i}
              className="h-2 rounded-full bg-indigo-500"
              style={{ width: `${bpsToPercent(dest.weightBps)}%` }}
              title={`${dest.label}: ${bpsToPercent(dest.weightBps)}%`}
            />
          ))}
        </div>
      </div>
    </Link>
  );
}
