'use client';

import Link from 'next/link';
import { formatEther, formatAddress, bpsToPercent } from '@/lib/utils';
import type { Strategy } from '@/types';

interface StrategyTableProps {
  strategies: Strategy[];
}

export function StrategyTable({ strategies }: StrategyTableProps) {
  if (strategies.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        No strategies found. Be the first to create one!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
              Rank
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
              Strategy
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
              Curator
            </th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">
              Allocated
            </th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">
              Donors
            </th>
          </tr>
        </thead>
        <tbody>
          {strategies.map((strategy, index) => (
            <tr
              key={strategy.address}
              className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
            >
              <td className="py-4 px-4 text-gray-400">{index + 1}</td>
              <td className="py-4 px-4">
                <Link
                  href={`/strategy/${strategy.address}`}
                  className="text-white hover:text-indigo-400 transition-colors font-medium"
                >
                  {strategy.name}
                </Link>
              </td>
              <td className="py-4 px-4 font-mono text-sm text-gray-400">
                {formatAddress(strategy.curator)}
              </td>
              <td className="py-4 px-4 text-right text-white">
                {formatEther(strategy.totalAllocated)} ETH
              </td>
              <td className="py-4 px-4 text-right text-gray-300">
                {strategy.totalDonors}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
