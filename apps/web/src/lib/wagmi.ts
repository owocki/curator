'use client';

import { http, createConfig } from 'wagmi';
import { base, baseSepolia, foundry } from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'demo';
const isProd = process.env.NEXT_PUBLIC_ENV === 'production';

// In production, only show Base mainnet
// In development, show all networks
const chains = isProd ? [base] as const : [base, baseSepolia, foundry] as const;

export const config = createConfig({
  chains,
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'Curator Studio' }),
    walletConnect({ projectId }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
    [foundry.id]: http('http://127.0.0.1:8545'),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
