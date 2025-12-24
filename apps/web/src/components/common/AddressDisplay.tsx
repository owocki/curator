'use client';

import { formatAddress } from '@/lib/utils';

interface AddressDisplayProps {
  address: string;
  chars?: number;
  showCopy?: boolean;
}

export function AddressDisplay({ address, chars = 4, showCopy = true }: AddressDisplayProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(address);
  };

  return (
    <span className="inline-flex items-center gap-1 font-mono text-sm">
      <span className="text-gray-400">{formatAddress(address, chars)}</span>
      {showCopy && (
        <button
          onClick={handleCopy}
          className="text-gray-500 hover:text-gray-300 transition-colors"
          title="Copy address"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </button>
      )}
    </span>
  );
}
