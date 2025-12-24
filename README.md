# Curator Studio

On-chain capital allocation strategy platform that enables curators to design, publish, and operate funding strategies as transparent, copyable portfolios.

## Features

- **Strategy Composer**: Visual interface to create allocation baskets with multiple funding destinations
- **Non-Custodial**: Funds flow through immediately to destinations, never held by contracts
- **Curator Fees**: Curators can set fees (up to 10%) on funds allocated through their strategies
- **Transparent**: All allocations, fees, and outcomes visible on-chain
- **Copy Strategies**: One-click replication of existing strategies

## Tech Stack

- **Frontend**: Next.js 14+, TypeScript, Tailwind CSS
- **Web3**: wagmi v2, viem, RainbowKit
- **Smart Contracts**: Solidity 0.8.x, Foundry
- **Charts**: Recharts
- **State**: Zustand

## Getting Started

### Prerequisites

- Node.js 18+
- [Foundry](https://getfoundry.sh/) for smart contract development

### Installation

```bash
# Install dependencies
npm install

# Install Foundry (if not already installed)
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### Local Development

1. **Start the local blockchain**:
```bash
cd packages/contracts
anvil
```

2. **Deploy contracts** (in a new terminal):
```bash
cd packages/contracts
forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast
```

3. **Start the frontend** (in a new terminal):
```bash
cd apps/web
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

5. Connect with a test wallet (import one of Anvil's test accounts)

### Test Accounts

When running with Anvil, you can use these test accounts:
- Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
- Address: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`

## Project Structure

```
curator/
├── apps/
│   └── web/                  # Next.js frontend
│       ├── src/
│       │   ├── app/          # Pages (App Router)
│       │   ├── components/   # React components
│       │   ├── hooks/        # Custom hooks
│       │   ├── lib/          # Utilities & config
│       │   └── types/        # TypeScript types
├── packages/
│   └── contracts/            # Foundry project
│       ├── src/              # Solidity contracts
│       ├── test/             # Contract tests
│       └── script/           # Deployment scripts
└── specs/                    # Product specs
```

## Smart Contracts

### StrategyFactory
Creates and tracks Strategy instances.

### Strategy
Non-custodial allocation contract that:
- Holds configuration (destinations + weights)
- Distributes funds immediately on deposit
- Manages curator fees (max 10%)
- Tracks total allocated and unique donors

### Registry
Canonical list of verified funding mechanisms.

## Scripts

```bash
# Run contract tests
cd packages/contracts && forge test

# Build frontend
cd apps/web && npm run build

# Run frontend dev server
cd apps/web && npm run dev
```

## Environment Variables

Create `apps/web/.env.local`:

```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_STRATEGY_FACTORY_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_CHAIN_ID=31337
```

## License

MIT
