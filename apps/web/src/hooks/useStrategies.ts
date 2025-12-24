'use client';

import { useReadContract, useReadContracts, useChainId } from 'wagmi';
import { STRATEGY_FACTORY_ABI, STRATEGY_ABI, getContractAddress } from '@/lib/contracts';
import type { Strategy, Destination } from '@/types';

interface RawDestination {
  recipient: `0x${string}`;
  weightBps: bigint;
  label: string;
}

function convertDestinations(raw: readonly RawDestination[]): Destination[] {
  return raw.map((d) => ({
    recipient: d.recipient,
    weightBps: Number(d.weightBps),
    label: d.label,
  }));
}

export function useStrategyCount() {
  const chainId = useChainId();
  const { strategyFactory } = getContractAddress(chainId);

  return useReadContract({
    address: strategyFactory,
    abi: STRATEGY_FACTORY_ABI,
    functionName: 'getStrategyCount',
  });
}

export function useStrategies() {
  const chainId = useChainId();
  const { strategyFactory } = getContractAddress(chainId);

  const { data: addresses, isLoading: isLoadingAddresses, error: addressError } = useReadContract({
    address: strategyFactory,
    abi: STRATEGY_FACTORY_ABI,
    functionName: 'getStrategies',
  });

  const strategyContracts = (addresses || []).flatMap((addr) => [
    {
      address: addr,
      abi: STRATEGY_ABI,
      functionName: 'getInfo',
    },
    {
      address: addr,
      abi: STRATEGY_ABI,
      functionName: 'getDestinations',
    },
  ]);

  const { data: strategyData, isLoading: isLoadingData } = useReadContracts({
    contracts: strategyContracts as any,
  });

  const strategies: Strategy[] = [];

  if (addresses && strategyData) {
    for (let i = 0; i < addresses.length; i++) {
      const infoResult = strategyData[i * 2];
      const destResult = strategyData[i * 2 + 1];

      if (infoResult?.status === 'success' && destResult?.status === 'success') {
        const [name, metadataURI, curator, curatorFeeBps, totalAllocated, totalDonors] =
          infoResult.result as [string, string, `0x${string}`, bigint, bigint, bigint];
        const rawDestinations = destResult.result as readonly RawDestination[];

        strategies.push({
          address: addresses[i],
          name,
          metadataURI,
          curator,
          curatorFeeBps: Number(curatorFeeBps),
          totalAllocated,
          totalDonors: Number(totalDonors),
          destinations: convertDestinations(rawDestinations),
        });
      }
    }
  }

  // Sort by total allocated (descending)
  strategies.sort((a, b) => {
    if (b.totalAllocated > a.totalAllocated) return 1;
    if (b.totalAllocated < a.totalAllocated) return -1;
    return 0;
  });

  return {
    strategies,
    isLoading: isLoadingAddresses || isLoadingData,
    error: addressError,
  };
}

export function useStrategy(address: `0x${string}`) {
  const { data: info, isLoading: isLoadingInfo, error: infoError } = useReadContract({
    address,
    abi: STRATEGY_ABI,
    functionName: 'getInfo',
  });

  const { data: destinations, isLoading: isLoadingDest } = useReadContract({
    address,
    abi: STRATEGY_ABI,
    functionName: 'getDestinations',
  });

  let strategy: Strategy | null = null;

  if (info && destinations) {
    const [name, metadataURI, curator, curatorFeeBps, totalAllocated, totalDonors] = info;

    strategy = {
      address,
      name,
      metadataURI,
      curator,
      curatorFeeBps: Number(curatorFeeBps),
      totalAllocated,
      totalDonors: Number(totalDonors),
      destinations: convertDestinations(destinations as readonly RawDestination[]),
    };
  }

  return {
    strategy,
    isLoading: isLoadingInfo || isLoadingDest,
    error: infoError,
  };
}
