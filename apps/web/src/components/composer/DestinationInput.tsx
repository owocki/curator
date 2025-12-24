'use client';

interface DestinationInputProps {
  index: number;
  recipient: string;
  weightBps: number;
  label: string;
  onRecipientChange: (value: string) => void;
  onWeightChange: (value: number) => void;
  onLabelChange: (value: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function DestinationInput({
  index,
  recipient,
  weightBps,
  label,
  onRecipientChange,
  onWeightChange,
  onLabelChange,
  onRemove,
  canRemove,
}: DestinationInputProps) {
  const percent = weightBps / 100;

  return (
    <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm text-gray-400">Destination {index + 1}</span>
        {canRemove && (
          <button
            onClick={onRemove}
            className="text-gray-500 hover:text-red-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Label</label>
          <input
            type="text"
            value={label}
            onChange={(e) => onLabelChange(e.target.value)}
            placeholder="e.g., Protocol Guild"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Recipient Address</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => onRecipientChange(e.target.value)}
            placeholder="0x..."
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-gray-500">Weight</label>
            <span className="text-sm font-medium text-white">{percent}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={weightBps}
            onChange={(e) => onWeightChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}
