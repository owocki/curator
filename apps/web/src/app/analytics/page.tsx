'use client';

import { useStrategies } from '@/hooks/useStrategies';
import { StatCard } from '@/components/common/StatCard';
import { formatEther, formatAddress, bpsToPercent } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function AnalyticsPage() {
  const { strategies, isLoading } = useStrategies();

  const totalAllocated = strategies.reduce(
    (sum, s) => sum + s.totalAllocated,
    0n
  );
  const totalDonors = strategies.reduce((sum, s) => sum + s.totalDonors, 0);
  const uniqueCurators = new Set(strategies.map((s) => s.curator)).size;

  // Prepare chart data
  const chartData = strategies.slice(0, 10).map((s) => ({
    name: s.name.length > 15 ? s.name.slice(0, 15) + '...' : s.name,
    allocated: Number(s.totalAllocated) / 1e18,
    donors: s.totalDonors,
  }));

  // Top curators by strategies created
  const curatorStats = strategies.reduce((acc, s) => {
    if (!acc[s.curator]) {
      acc[s.curator] = { count: 0, totalAllocated: 0n };
    }
    acc[s.curator].count++;
    acc[s.curator].totalAllocated += s.totalAllocated;
    return acc;
  }, {} as Record<string, { count: number; totalAllocated: bigint }>);

  const topCurators = Object.entries(curatorStats)
    .sort((a, b) => {
      if (b[1].totalAllocated > a[1].totalAllocated) return 1;
      if (b[1].totalAllocated < a[1].totalAllocated) return -1;
      return 0;
    })
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-gray-400 mt-1">
          Platform-wide metrics and trends
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Allocated"
          value={`${formatEther(totalAllocated)} ETH`}
        />
        <StatCard label="Total Strategies" value={strategies.length} />
        <StatCard label="Total Donors" value={totalDonors} />
        <StatCard label="Active Curators" value={uniqueCurators} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Strategies Chart */}
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-white mb-6">
            Top Strategies by Allocation
          </h2>
          {isLoading ? (
            <div className="h-80 flex items-center justify-center text-gray-400">
              Loading...
            </div>
          ) : chartData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="name"
                    stroke="#9ca3af"
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    tickFormatter={(value) => `${value} ETH`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#fff' }}
                    itemStyle={{ color: '#9ca3af' }}
                    formatter={(value) => value !== undefined ? [`${Number(value).toFixed(4)} ETH`, 'Allocated'] : ['N/A', 'Allocated']}
                  />
                  <Bar dataKey="allocated" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>

        {/* Top Curators */}
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-white mb-6">
            Top Curators
          </h2>
          {isLoading ? (
            <div className="text-center py-12 text-gray-400">Loading...</div>
          ) : topCurators.length > 0 ? (
            <div className="space-y-4">
              {topCurators.map(([curator, stats], index) => (
                <div
                  key={curator}
                  className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-500">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="font-mono text-sm text-white">
                        {formatAddress(curator, 6)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {stats.count} {stats.count === 1 ? 'strategy' : 'strategies'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">
                      {formatEther(stats.totalAllocated)} ETH
                    </p>
                    <p className="text-xs text-gray-400">total allocated</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              No curators yet
            </div>
          )}
        </div>
      </div>

      {/* Strategy Distribution */}
      <div className="mt-6 bg-gray-900/50 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-6">
          Fee Distribution
        </h2>
        {strategies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[0, 100, 200, 300, 500].map((fee) => {
              const count = strategies.filter(
                (s) => s.curatorFeeBps >= fee && s.curatorFeeBps < fee + (fee === 500 ? 600 : 100)
              ).length;
              return (
                <div
                  key={fee}
                  className="bg-gray-800/30 rounded-lg p-4 border border-gray-700 text-center"
                >
                  <p className="text-2xl font-bold text-white">{count}</p>
                  <p className="text-sm text-gray-400">
                    {fee === 500 ? '5%+' : `${fee / 100}-${(fee + 100) / 100}%`} fee
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            No strategies to analyze
          </div>
        )}
      </div>
    </div>
  );
}
