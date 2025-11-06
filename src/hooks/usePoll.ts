import { useReadContract } from 'wagmi'
import { polypuls3Abi } from '../core/abis/polypuls3'
import { getPolypuls3Address } from '../core/config/chains'
import type { Poll } from '../core/types'
import type { DataSource } from '../core/config/dataSource'
import { usePolypulsConfig } from '../providers'
import { useSubgraphPoll } from '../subgraph/hooks'

export interface UsePollParams {
  pollId: bigint | string
  chainId?: number
  /**
   * Override the global data source configuration for this hook
   * - 'contract': Always fetch from contract (most authoritative)
   * - 'subgraph': Always fetch from subgraph (faster)
   * - 'auto': Try subgraph first, fallback to contract
   */
  dataSource?: DataSource
}

export interface UsePollReturn {
  poll: Poll | undefined
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
  /**
   * Which data source was actually used
   */
  activeSource: 'contract' | 'subgraph' | null
}

/**
 * Hook to fetch a single poll by ID
 *
 * Supports multiple data sources based on configuration.
 *
 * @example
 * ```tsx
 * // Use global config from provider
 * const { poll, isLoading, activeSource } = usePoll({ pollId: 1n })
 *
 * // Always use contract
 * const { poll } = usePoll({ pollId: 1n, dataSource: 'contract' })
 *
 * // Always use subgraph
 * const { poll } = usePoll({ pollId: 1n, dataSource: 'subgraph' })
 * ```
 */
export function usePoll({ pollId, chainId, dataSource: paramSource }: UsePollParams): UsePollReturn {
  const { dataSourceConfig } = usePolypulsConfig()
  const source = paramSource || dataSourceConfig.source

  const contractAddress = chainId ? getPolypuls3Address(chainId) : undefined

  // Contract data fetching
  const {
    data: pollData,
    isLoading: contractLoading,
    isError: contractError,
    error: contractErrorObj,
    refetch: contractRefetch,
  } = useReadContract({
    address: contractAddress,
    abi: polypuls3Abi,
    functionName: 'getPoll',
    args: [BigInt(pollId)],
    query: {
      enabled: !!contractAddress && (source === 'contract' || source === 'auto'),
    },
  })

  // Subgraph data fetching
  const {
    poll: subgraphPoll,
    isLoading: subgraphLoading,
    error: subgraphError,
  } = useSubgraphPoll(pollId.toString())

  // Determine which source to use and what data to return
  let poll: Poll | undefined
  let isLoading: boolean
  let isError: boolean
  let error: Error | null
  let refetch: () => void
  let activeSource: 'contract' | 'subgraph' | null = null

  if (source === 'contract') {
    // Use contract only
    poll = pollData
      ? {
          id: pollData.id,
          creator: pollData.creator,
          question: pollData.question,
          options: pollData.options,
          createdAt: pollData.createdAt,
          expiresAt: pollData.expiresAt,
          rewardPool: pollData.rewardPool,
          isActive: pollData.isActive,
          totalResponses: pollData.totalResponses,
          category: pollData.category,
          projectId: pollData.projectId,
          votingType: pollData.votingType,
          visibility: pollData.visibility,
          status: pollData.status,
          platformFeeAmount: pollData.platformFeeAmount,
          claimedRewards: pollData.claimedRewards,
        }
      : undefined
    isLoading = contractLoading
    isError = contractError
    error = contractErrorObj as Error | null
    refetch = contractRefetch
    activeSource = 'contract'
  } else if (source === 'subgraph') {
    // Use subgraph only
    poll = subgraphPoll || undefined
    isLoading = subgraphLoading
    isError = !!subgraphError
    error = subgraphError
    refetch = () => {} // Subgraph hook doesn't expose refetch
    activeSource = 'subgraph'
  } else {
    // Auto mode: try subgraph first, fallback to contract
    if (subgraphPoll && !subgraphError) {
      poll = subgraphPoll
      isLoading = subgraphLoading
      isError = false
      error = null
      refetch = () => {}
      activeSource = 'subgraph'
    } else {
      // Fallback to contract
      poll = pollData
        ? {
            id: pollData.id,
            creator: pollData.creator,
            question: pollData.question,
            options: pollData.options,
            createdAt: pollData.createdAt,
            expiresAt: pollData.expiresAt,
            rewardPool: pollData.rewardPool,
            isActive: pollData.isActive,
            totalResponses: pollData.totalResponses,
            category: pollData.category,
            projectId: pollData.projectId,
            votingType: pollData.votingType,
            visibility: pollData.visibility,
            status: pollData.status,
            platformFeeAmount: pollData.platformFeeAmount,
            claimedRewards: pollData.claimedRewards,
          }
        : undefined
      isLoading = contractLoading
      isError = contractError
      error = contractErrorObj as Error | null
      refetch = contractRefetch
      activeSource = 'contract'
    }
  }

  return {
    poll,
    isLoading,
    isError,
    error,
    refetch,
    activeSource,
  }
}
