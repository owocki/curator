'use client';

import { formatEther, bpsToPercent } from '@/lib/utils';
import type { Destination } from '@/types';

interface DestinationListProps {
  destinations: Destination[];
  totalAllocated?: bigint;
}

const COLORS = [
  'bg-indigo-500',
  'bg-violet-500',
  'bg-purple-500',
  'bg-fuchsia-500',
  'bg-pink-500',
  'bg-rose-500',
];

export function DestinationList({ destinations, totalAllocated = 0n }: DestinationListProps) {
  return (
    <div className="space-y-4">
      {destinations.map((dest, index) => {
        const percent = bpsToPercent(dest.weightBps);
        const allocated = totalAllocated > 0n
          ? (totalAllocated * BigInt(dest.weightBps)) / 10000n
          : 0n;

        return (
          <div
            key={index}
            className="bg-gray-800/30 rounded-lg p-4 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-medium text-white">{dest.label}</h4>
                <p className="text-sm text-gray-400 font-mono break-all">
                  {dest.recipient}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-white">{percent}%</p>
                {totalAllocated > 0n && (
                  <p className="text-sm text-gray-400">
                    {formatEther(allocated)} ETH
                  </p>
                )}
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${COLORS[index % COLORS.length]}`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
