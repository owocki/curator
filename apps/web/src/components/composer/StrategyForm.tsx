'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { isAddress } from 'viem';
import { DestinationInput } from './DestinationInput';
import { AllocationChart } from '../strategy/AllocationChart';
import { STRATEGY_FACTORY_ABI, getContractAddress } from '@/lib/contracts';
import { getTotalWeightBps, isValidWeights } from '@/lib/utils';

interface DestinationForm {
  recipient: string;
  weightBps: number;
  label: string;
}

export function StrategyForm() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { strategyFactory } = getContractAddress(chainId);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [curatorFeeBps, setCuratorFeeBps] = useState(200); // 2% default
  const [destinations, setDestinations] = useState<DestinationForm[]>([
    { recipient: '', weightBps: 5000, label: '' },
    { recipient: '', weightBps: 5000, label: '' },
  ]);

  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const totalWeight = getTotalWeightBps(destinations.map((d) => d.weightBps));
  const isWeightsValid = isValidWeights(destinations.map((d) => d.weightBps));

  const isFormValid = () => {
    if (!name.trim()) return false;
    if (!isWeightsValid) return false;
    if (destinations.some((d) => !isAddress(d.recipient))) return false;
    if (destinations.some((d) => !d.label.trim())) return false;
    return true;
  };

  const addDestination = () => {
    if (destinations.length >= 10) return;
    setDestinations([...destinations, { recipient: '', weightBps: 0, label: '' }]);
  };

  const removeDestination = (index: number) => {
    if (destinations.length <= 1) return;
    setDestinations(destinations.filter((_, i) => i !== index));
  };

  const updateDestination = (
    index: number,
    field: keyof DestinationForm,
    value: string | number
  ) => {
    const updated = [...destinations];
    updated[index] = { ...updated[index], [field]: value };
    setDestinations(updated);
  };

  const normalizeWeights = () => {
    const total = getTotalWeightBps(destinations.map((d) => d.weightBps));
    if (total === 0) return;

    const normalized = destinations.map((d) => ({
      ...d,
      weightBps: Math.round((d.weightBps / total) * 10000),
    }));

    // Adjust last item to ensure exactly 10000
    const newTotal = getTotalWeightBps(normalized.map((d) => d.weightBps));
    if (newTotal !== 10000) {
      normalized[normalized.length - 1].weightBps += 10000 - newTotal;
    }

    setDestinations(normalized);
  };

  const handleSubmit = async () => {
    if (!isFormValid()) return;

    const metadataURI = `data:application/json,${encodeURIComponent(
      JSON.stringify({ name, description })
    )}`;

    writeContract({
      address: strategyFactory,
      abi: STRATEGY_FACTORY_ABI,
      functionName: 'createStrategy',
      args: [
        name,
        metadataURI,
        BigInt(curatorFeeBps),
        destinations.map((d) => ({
          recipient: d.recipient as `0x${string}`,
          weightBps: BigInt(d.weightBps),
          label: d.label,
        })),
      ],
    });
  };

  if (isSuccess) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Strategy Created!</h2>
        <p className="text-gray-400 mb-6">
          Your strategy has been deployed on-chain.
        </p>
        <button
          onClick={() => router.push('/strategies')}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
        >
          View All Strategies
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form */}
      <div className="space-y-6">
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Strategy Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Strategy Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Ethereum Core Dev Fund"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your strategy..."
                rows={3}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Funding Destinations</h2>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm ${
                  isWeightsValid ? 'text-green-400' : 'text-yellow-400'
                }`}
              >
                Total: {totalWeight / 100}%
              </span>
              {!isWeightsValid && (
                <button
                  onClick={normalizeWeights}
                  className="text-xs px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors"
                >
                  Normalize
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {destinations.map((dest, index) => (
              <DestinationInput
                key={index}
                index={index}
                recipient={dest.recipient}
                weightBps={dest.weightBps}
                label={dest.label}
                onRecipientChange={(value) =>
                  updateDestination(index, 'recipient', value)
                }
                onWeightChange={(value) =>
                  updateDestination(index, 'weightBps', value)
                }
                onLabelChange={(value) =>
                  updateDestination(index, 'label', value)
                }
                onRemove={() => removeDestination(index)}
                canRemove={destinations.length > 1}
              />
            ))}
          </div>

          {destinations.length < 10 && (
            <button
              onClick={addDestination}
              className="mt-4 w-full py-2 border border-dashed border-gray-600 rounded-lg text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
            >
              + Add Destination
            </button>
          )}
        </div>

        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Curator Fee</h2>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Fee percentage</span>
            <span className="text-lg font-medium text-white">
              {curatorFeeBps / 100}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            step="50"
            value={curatorFeeBps}
            onChange={(e) => setCuratorFeeBps(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <p className="text-xs text-gray-500 mt-2">
            Maximum 10%. You&apos;ll receive this percentage of all funds allocated to this strategy.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
            <p className="text-sm text-red-400">
              {error.message.includes('User rejected')
                ? 'Transaction rejected'
                : 'Failed to create strategy. Please try again.'}
            </p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!isConnected || !isFormValid() || isPending || isConfirming}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
        >
          {!isConnected
            ? 'Connect Wallet to Continue'
            : isPending
            ? 'Confirm in Wallet...'
            : isConfirming
            ? 'Creating Strategy...'
            : 'Publish Strategy'}
        </button>
      </div>

      {/* Preview */}
      <div className="lg:sticky lg:top-24 h-fit">
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-6">Strategy Preview</h2>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-white">
              {name || 'Your Strategy Name'}
            </h3>
            <p className="text-gray-400 mt-1">
              {description || 'Strategy description will appear here...'}
            </p>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-400 mb-4">
              Allocation Breakdown
            </h4>
            {destinations.some((d) => d.weightBps > 0) ? (
              <AllocationChart destinations={destinations} />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                Add destinations to see the allocation chart
              </div>
            )}
          </div>

          <div className="border-t border-gray-700 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Curator Fee</span>
              <span className="text-white">{curatorFeeBps / 100}%</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-400">Destinations</span>
              <span className="text-white">{destinations.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
