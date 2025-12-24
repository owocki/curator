'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { STRATEGY_ABI } from '@/lib/contracts';
import { useUIStore } from '@/lib/store';
import { formatEther, bpsToPercent } from '@/lib/utils';

export function FundModal() {
  const { isFundModalOpen, selectedStrategy, closeFundModal } = useUIStore();
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState('');

  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleFund = () => {
    if (!selectedStrategy || !amount) return;

    writeContract({
      address: selectedStrategy.address,
      abi: STRATEGY_ABI,
      functionName: 'fund',
      value: parseEther(amount),
    });
  };

  const handleClose = () => {
    setAmount('');
    closeFundModal();
  };

  if (!isFundModalOpen || !selectedStrategy) return null;

  const curatorFee = amount
    ? (parseFloat(amount) * bpsToPercent(selectedStrategy.curatorFeeBps)) / 100
    : 0;
  const distributable = amount ? parseFloat(amount) - curatorFee : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-bold text-white mb-2">
          Fund Strategy
        </h2>
        <p className="text-gray-400 mb-6">{selectedStrategy.name}</p>

        {isSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Successfully Funded!
            </h3>
            <p className="text-gray-400 mb-4">
              Your contribution has been distributed to the destinations.
            </p>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount (ETH)
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {amount && parseFloat(amount) > 0 && (
              <div className="bg-gray-800/50 rounded-lg p-4 mb-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Curator Fee ({bpsToPercent(selectedStrategy.curatorFeeBps)}%)</span>
                  <span className="text-gray-300">{curatorFee.toFixed(6)} ETH</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">To Destinations</span>
                  <span className="text-gray-300">{distributable.toFixed(6)} ETH</span>
                </div>
                <div className="border-t border-gray-700 pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <span className="text-white">Total</span>
                    <span className="text-white">{amount} ETH</span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-4">
                <p className="text-sm text-red-400">
                  {error.message.includes('User rejected')
                    ? 'Transaction rejected'
                    : 'Transaction failed. Please try again.'}
                </p>
              </div>
            )}

            <button
              onClick={handleFund}
              disabled={!isConnected || !amount || parseFloat(amount) <= 0 || isPending || isConfirming}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {!isConnected
                ? 'Connect Wallet'
                : isPending
                ? 'Confirm in Wallet...'
                : isConfirming
                ? 'Processing...'
                : 'Fund Strategy'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
