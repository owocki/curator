export interface Destination {
  recipient: `0x${string}`;
  weightBps: number;
  label: string;
}

export interface Strategy {
  address: `0x${string}`;
  name: string;
  metadataURI: string;
  curator: `0x${string}`;
  curatorFeeBps: number;
  destinations: Destination[];
  totalAllocated: bigint;
  totalDonors: number;
}

export interface StrategyFormData {
  name: string;
  description: string;
  destinations: {
    recipient: string;
    weightBps: number;
    label: string;
  }[];
  curatorFeeBps: number;
}

export interface FundingEvent {
  id: string;
  strategyAddress: `0x${string}`;
  donor: `0x${string}`;
  amount: bigint;
  token: `0x${string}` | null;
  txHash: `0x${string}`;
  blockNumber: bigint;
  timestamp: number;
}
