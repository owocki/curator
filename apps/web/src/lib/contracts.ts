export const STRATEGY_FACTORY_ABI = [
  {
    type: "function",
    name: "createStrategy",
    inputs: [
      { name: "_name", type: "string", internalType: "string" },
      { name: "_metadataURI", type: "string", internalType: "string" },
      { name: "_curatorFeeBps", type: "uint256", internalType: "uint256" },
      {
        name: "_destinations",
        type: "tuple[]",
        internalType: "struct Strategy.Destination[]",
        components: [
          { name: "recipient", type: "address", internalType: "address" },
          { name: "weightBps", type: "uint256", internalType: "uint256" },
          { name: "label", type: "string", internalType: "string" },
        ],
      },
    ],
    outputs: [{ name: "strategy", type: "address", internalType: "address" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getStrategies",
    inputs: [],
    outputs: [{ name: "", type: "address[]", internalType: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getStrategyCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getStrategiesByCurator",
    inputs: [{ name: "curator", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "address[]", internalType: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getStrategiesPaginated",
    inputs: [
      { name: "offset", type: "uint256", internalType: "uint256" },
      { name: "limit", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "result", type: "address[]", internalType: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isStrategy",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "StrategyCreated",
    inputs: [
      { name: "strategy", type: "address", indexed: true, internalType: "address" },
      { name: "curator", type: "address", indexed: true, internalType: "address" },
      { name: "name", type: "string", indexed: false, internalType: "string" },
      { name: "curatorFeeBps", type: "uint256", indexed: false, internalType: "uint256" },
    ],
    anonymous: false,
  },
] as const;

export const STRATEGY_ABI = [
  {
    type: "constructor",
    inputs: [
      { name: "_name", type: "string", internalType: "string" },
      { name: "_metadataURI", type: "string", internalType: "string" },
      { name: "_curator", type: "address", internalType: "address" },
      { name: "_curatorFeeBps", type: "uint256", internalType: "uint256" },
      {
        name: "_destinations",
        type: "tuple[]",
        internalType: "struct Strategy.Destination[]",
        components: [
          { name: "recipient", type: "address", internalType: "address" },
          { name: "weightBps", type: "uint256", internalType: "uint256" },
          { name: "label", type: "string", internalType: "string" },
        ],
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "fund",
    inputs: [],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "fundERC20",
    inputs: [
      { name: "token", type: "address", internalType: "address" },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "name",
    inputs: [],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "metadataURI",
    inputs: [],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "curator",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "curatorFeeBps",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalAllocated",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalDonors",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getDestinations",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct Strategy.Destination[]",
        components: [
          { name: "recipient", type: "address", internalType: "address" },
          { name: "weightBps", type: "uint256", internalType: "uint256" },
          { name: "label", type: "string", internalType: "string" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getDestinationCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getInfo",
    inputs: [],
    outputs: [
      { name: "_name", type: "string", internalType: "string" },
      { name: "_metadataURI", type: "string", internalType: "string" },
      { name: "_curator", type: "address", internalType: "address" },
      { name: "_curatorFeeBps", type: "uint256", internalType: "uint256" },
      { name: "_totalAllocated", type: "uint256", internalType: "uint256" },
      { name: "_totalDonors", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hasDonated",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "Funded",
    inputs: [
      { name: "donor", type: "address", indexed: true, internalType: "address" },
      { name: "amount", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "token", type: "address", indexed: false, internalType: "address" },
      { name: "curatorFee", type: "uint256", indexed: false, internalType: "uint256" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "DestinationFunded",
    inputs: [
      { name: "recipient", type: "address", indexed: true, internalType: "address" },
      { name: "amount", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "token", type: "address", indexed: false, internalType: "address" },
    ],
    anonymous: false,
  },
] as const;

// Chain IDs
export const CHAIN_IDS = {
  base: 8453,
  baseSepolia: 84532,
  foundry: 31337,
} as const;

// Contract addresses per chain
// Set via environment variables for each deployment
export const CONTRACT_ADDRESSES_BY_CHAIN: Record<number, { strategyFactory: `0x${string}` }> = {
  [CHAIN_IDS.base]: {
    strategyFactory: (process.env.NEXT_PUBLIC_STRATEGY_FACTORY_ADDRESS_BASE || "0x0000000000000000000000000000000000000000") as `0x${string}`,
  },
  [CHAIN_IDS.baseSepolia]: {
    strategyFactory: (process.env.NEXT_PUBLIC_STRATEGY_FACTORY_ADDRESS_BASE_SEPOLIA || "0x0000000000000000000000000000000000000000") as `0x${string}`,
  },
  [CHAIN_IDS.foundry]: {
    strategyFactory: (process.env.NEXT_PUBLIC_STRATEGY_FACTORY_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3") as `0x${string}`,
  },
};

// Helper to get contract address for current chain
export function getContractAddress(chainId: number | undefined): { strategyFactory: `0x${string}` } {
  if (!chainId || !CONTRACT_ADDRESSES_BY_CHAIN[chainId]) {
    // Default to foundry for development
    return CONTRACT_ADDRESSES_BY_CHAIN[CHAIN_IDS.foundry];
  }
  return CONTRACT_ADDRESSES_BY_CHAIN[chainId];
}

// Legacy export for backwards compatibility (uses env var or foundry default)
export const CONTRACT_ADDRESSES = {
  strategyFactory: (process.env.NEXT_PUBLIC_STRATEGY_FACTORY_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3") as `0x${string}`,
} as const;
