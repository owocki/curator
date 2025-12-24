# Curator Studio - Implementation Plan

## Overview

Curator Studio is an on-chain capital allocation strategy platform that enables curators to design, publish, and operate funding strategies as transparent, copyable portfolios. This document outlines the technical implementation approach.

---

## Technology Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand or React Context
- **Web3 Integration**: wagmi v2 + viem
- **Wallet Connection**: RainbowKit or ConnectKit

### Smart Contracts
- **Language**: Solidity 0.8.x
- **Framework**: Foundry
- **Testing**: Foundry tests + fork testing
- **Target Chains**: Ethereum mainnet, Optimism, Base (multi-chain support)

### Backend (Indexing & API)
- **Indexer**: The Graph (subgraph) or Ponder
- **Database**: PostgreSQL (for off-chain metadata cache)
- **API**: Next.js API routes or separate Node.js service

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                        │
├─────────────────────────────────────────────────────────────────┤
│  Dashboard  │  Strategy Composer  │  Registry  │  Analytics     │
└──────┬──────────────┬─────────────────┬──────────────┬──────────┘
       │              │                 │              │
       ▼              ▼                 ▼              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Web3 Layer (wagmi/viem)                      │
└──────┬──────────────┬─────────────────┬──────────────┬──────────┘
       │              │                 │              │
       ▼              ▼                 ▼              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Smart Contracts                             │
├─────────────────────────────────────────────────────────────────┤
│  StrategyFactory  │  Strategy  │  Registry  │  FeeCollector     │
└─────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Indexer (The Graph/Ponder)                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Smart Contract Architecture

### Core Contracts

#### 1. StrategyFactory.sol
- Creates new Strategy instances
- Maintains registry of all strategies
- Emits events for indexing

```solidity
// Key functions
function createStrategy(
    string calldata name,
    string calldata metadataURI,
    Destination[] calldata destinations,
    uint256 curatorFeeBps
) external returns (address strategy);

function getStrategies() external view returns (address[] memory);
```

#### 2. Strategy.sol
- Holds strategy configuration (destinations + weights)
- Handles fund distribution
- Manages curator fees
- Non-custodial: funds flow through, not held

```solidity
struct Destination {
    address recipient;      // EOA, multisig, or contract
    uint256 weightBps;      // Basis points (100 = 1%)
    string label;           // Human-readable name
}

// Key functions
function fund() external payable;
function fundERC20(address token, uint256 amount) external;
function getDestinations() external view returns (Destination[] memory);
function getCuratorFee() external view returns (uint256);
```

#### 3. Registry.sol
- Canonical list of verified funding mechanisms
- Metadata and risk tags for destinations
- Governance-controlled additions

```solidity
struct MechanismEntry {
    address mechanism;
    string name;
    string category;        // "grants", "retropgf", "bounties", etc.
    string[] riskTags;
    bool verified;
}
```

#### 4. FeeCollector.sol
- Collects and distributes curator fees
- Supports fee withdrawal by curators

---

## Database Schema (Off-chain Metadata)

```sql
-- Strategies table (cached from on-chain)
CREATE TABLE strategies (
    id SERIAL PRIMARY KEY,
    address VARCHAR(42) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    curator_address VARCHAR(42) NOT NULL,
    curator_fee_bps INTEGER,
    metadata_uri TEXT,
    total_allocated NUMERIC(78, 0) DEFAULT 0,
    unique_donors INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Destinations table
CREATE TABLE destinations (
    id SERIAL PRIMARY KEY,
    strategy_address VARCHAR(42) NOT NULL,
    recipient_address VARCHAR(42) NOT NULL,
    weight_bps INTEGER NOT NULL,
    label VARCHAR(255),
    FOREIGN KEY (strategy_address) REFERENCES strategies(address)
);

-- Funding events table
CREATE TABLE funding_events (
    id SERIAL PRIMARY KEY,
    strategy_address VARCHAR(42) NOT NULL,
    donor_address VARCHAR(42) NOT NULL,
    amount NUMERIC(78, 0) NOT NULL,
    token_address VARCHAR(42),
    tx_hash VARCHAR(66) NOT NULL,
    block_number BIGINT NOT NULL,
    timestamp TIMESTAMP NOT NULL
);

-- Curators table
CREATE TABLE curators (
    address VARCHAR(42) PRIMARY KEY,
    ens_name VARCHAR(255),
    total_strategies INTEGER DEFAULT 0,
    total_capital_stewarded NUMERIC(78, 0) DEFAULT 0,
    reputation_score INTEGER DEFAULT 0
);
```

---

## Frontend Pages & Components

### Pages (based on wireframes)

#### 1. Dashboard (`/`)
- Hero section with platform stats (Total Allocated, Active Strategies, Curators)
- "Top Strategies" leaderboard table
- "Trending" strategies sidebar
- "+ Create Strategy" CTA button

#### 2. Strategy Composer (`/create`)
- Strategy Details form (name, description)
- Funding Destinations list with weight sliders
- "+ Add Destination" button
- Curator Fee input
- Live "Strategy Preview" with pie chart
- "Publish Strategy" button

#### 3. Strategy Detail View (`/strategy/[address]`)
- Strategy header (name, curator, description)
- Stats row (Total Allocated, Unique Donors, Subscribers, Curator Fee)
- "Copy" and "Fund" action buttons
- Allocation Breakdown with progress bars and amounts
- Transaction history

#### 4. Strategies List (`/strategies`)
- Filterable/sortable list of all strategies
- Search by name, curator, destination

#### 5. Registry (`/registry`)
- List of verified funding mechanisms
- Categories and risk tags
- Add new mechanism (governance)

#### 6. Analytics (`/analytics`)
- Platform-wide metrics and trends
- Charts for capital flow over time
- Top curators leaderboard

### Key Components

```
components/
├── layout/
│   ├── Header.tsx          # Navigation + Connect Wallet
│   └── Footer.tsx
├── strategy/
│   ├── StrategyCard.tsx    # Card for list views
│   ├── StrategyTable.tsx   # Leaderboard table
│   ├── AllocationChart.tsx # Pie chart visualization
│   ├── DestinationList.tsx # List with progress bars
│   └── FundModal.tsx       # Funding flow modal
├── composer/
│   ├── StrategyForm.tsx    # Main form container
│   ├── DestinationInput.tsx # Address + weight input
│   ├── WeightSlider.tsx    # Percentage slider
│   └── PreviewPanel.tsx    # Live preview
├── common/
│   ├── WalletButton.tsx
│   ├── AddressDisplay.tsx
│   ├── StatCard.tsx
│   └── TrendingCard.tsx
└── analytics/
    ├── MetricsChart.tsx
    └── LeaderboardTable.tsx
```

---

## Implementation Phases

### Phase 1: Foundation
**Goal**: Core infrastructure and basic strategy creation

1. **Project Setup**
   - Initialize Next.js project with TypeScript
   - Configure Tailwind CSS
   - Set up wagmi + viem
   - Configure wallet connection (RainbowKit)

2. **Smart Contracts - Core**
   - Implement Strategy.sol
   - Implement StrategyFactory.sol
   - Write comprehensive tests
   - Deploy to testnet (Sepolia/Base Sepolia)

3. **Basic Frontend**
   - Layout components (Header, Footer)
   - Dashboard page with mock data
   - Connect wallet flow

### Phase 2: Strategy Creation
**Goal**: Full strategy composer workflow

1. **Strategy Composer UI**
   - Strategy form with destinations
   - Weight allocation sliders
   - Live preview with pie chart
   - Form validation

2. **Contract Integration**
   - Create strategy transaction
   - Handle transaction states
   - Success/error handling

3. **Indexing Setup**
   - Set up The Graph subgraph or Ponder
   - Index strategy creation events
   - Index funding events

### Phase 3: Strategy Discovery & Funding
**Goal**: Browse, fund, and copy strategies

1. **Strategy List & Detail Pages**
   - Strategy list with filters
   - Strategy detail view
   - Real-time data from indexer

2. **Funding Flow**
   - Fund modal component
   - ETH and ERC20 support
   - Transaction confirmation

3. **Copy Strategy**
   - Fork existing strategy
   - Modify weights/destinations
   - Publish as new strategy

### Phase 4: Analytics & Registry
**Goal**: Platform-wide insights and mechanism registry

1. **Analytics Dashboard**
   - Total capital allocated over time
   - Top strategies by volume
   - Top curators leaderboard
   - Trend analysis

2. **Mechanism Registry**
   - List of verified destinations
   - Categories and tags
   - Search and filter

3. **Curator Profiles**
   - Curator reputation display
   - Historical performance
   - Strategy portfolio

### Phase 5: Production & Multi-chain
**Goal**: Mainnet deployment and scaling

1. **Security Audit**
   - Smart contract audit
   - Frontend security review

2. **Mainnet Deployment**
   - Deploy to Ethereum mainnet
   - Deploy to L2s (Optimism, Base)

3. **Performance Optimization**
   - Caching layer
   - Image optimization
   - API rate limiting

---

## API Endpoints

```
GET  /api/strategies              # List all strategies
GET  /api/strategies/[address]    # Get strategy details
GET  /api/strategies/top          # Get top strategies by allocation
GET  /api/strategies/trending     # Get trending strategies

GET  /api/curators                # List curators
GET  /api/curators/[address]      # Get curator profile

GET  /api/analytics/overview      # Platform-wide stats
GET  /api/analytics/trends        # Time-series data

GET  /api/registry/mechanisms     # List verified mechanisms
POST /api/registry/mechanisms     # Propose new mechanism (admin)

POST /api/metadata/upload         # Upload strategy metadata to IPFS
```

---

## Environment Variables

```env
# Web3
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=
NEXT_PUBLIC_ALCHEMY_API_KEY=
NEXT_PUBLIC_CHAIN_ID=

# Contract Addresses
NEXT_PUBLIC_STRATEGY_FACTORY_ADDRESS=
NEXT_PUBLIC_REGISTRY_ADDRESS=

# Backend
DATABASE_URL=
THE_GRAPH_API_KEY=

# IPFS
NEXT_PUBLIC_IPFS_GATEWAY=
PINATA_API_KEY=
PINATA_SECRET_KEY=
```

---

## File Structure

```
curator/
├── apps/
│   └── web/                      # Next.js frontend
│       ├── app/
│       │   ├── page.tsx          # Dashboard
│       │   ├── create/
│       │   ├── strategy/[address]/
│       │   ├── strategies/
│       │   ├── registry/
│       │   ├── analytics/
│       │   └── api/
│       ├── components/
│       ├── hooks/
│       ├── lib/
│       └── styles/
├── packages/
│   ├── contracts/                # Foundry project
│   │   ├── src/
│   │   ├── test/
│   │   └── script/
│   └── subgraph/                 # The Graph subgraph
│       ├── schema.graphql
│       ├── subgraph.yaml
│       └── src/
├── specs/
├── package.json
└── turbo.json                    # Turborepo config
```

---

## Key Technical Decisions

### 1. Non-Custodial Design
Strategies do not hold funds. When a user calls `fund()`, tokens are immediately distributed to all destinations according to weights. This eliminates custody risk and simplifies the trust model.

### 2. Basis Points for Weights
All percentages use basis points (1 bps = 0.01%) for precision without decimals. Weights must sum to 10,000 bps (100%).

### 3. Metadata Storage
Strategy metadata (name, description, images) stored on IPFS with URI stored on-chain. This keeps gas costs low while maintaining decentralization.

### 4. Multi-chain Strategy
Start with a single chain (Base recommended for low fees), then expand. Use same contract addresses across chains via CREATE2 for consistency.

### 5. Indexing Strategy
Use The Graph or Ponder for real-time indexing. Cache frequently-accessed data in PostgreSQL for faster API responses.

---

## Testing Strategy

### Smart Contracts
- Unit tests for all functions
- Integration tests for full flows
- Fork tests against mainnet state
- Fuzz testing for edge cases

### Frontend
- Component tests with React Testing Library
- E2E tests with Playwright
- Visual regression testing

### Integration
- Testnet deployment and manual testing
- Automated CI/CD pipeline

---

## Open Items for Discussion

1. **Curator Fee Limits**: Should there be a max curator fee (e.g., 10%)?
2. **Strategy Updates**: Can curators update weights after creation, or are strategies immutable?
3. **Destination Validation**: Should destinations be verified against the registry, or allow any address?
4. **Token Support**: Start with ETH only, or include ERC20 from day one?
5. **Governance**: How will registry additions be governed?

---

## Success Criteria for MVP

- [ ] Users can connect wallet and create a strategy
- [ ] Strategies are deployed on-chain and indexed
- [ ] Users can browse and view strategy details
- [ ] Users can fund strategies with ETH
- [ ] Basic analytics display (total allocated, donors)
- [ ] Copy strategy functionality works
