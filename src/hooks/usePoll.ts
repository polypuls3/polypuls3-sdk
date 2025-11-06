import { useReadContract } from 'wagmi'
import { polypuls3Abi } from '../core/abis/polypuls3'
import { getPolypuls3Address } from '../core/config/chains'
import type { Poll } from '../core/types'

export interface UsePollParams {
  pollId: bigint | string
  chainId?: number
}

export interface UsePollReturn {
  poll: Poll | undefined
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}

/**
 * Hook to fetch a single poll by ID
 *
 * @example
 * ```tsx
 * const { poll, isLoading, isError } = usePoll({ pollId: 1n })
 *
 * if (isLoading) return <div>Loading...</div>
 * if (isError) return <div>Error loading poll</div>
 * if (!poll) return null
 *
 * return <div>{poll.title}</div>
 * ```
 */
export function usePoll({ pollId, chainId }: UsePollParams): UsePollReturn {
  const contractAddress = chainId ? getPolypuls3Address(chainId) : undefined

  const {
    data: pollData,
    isLoading,
    isError,
    error,
    refetch,
  } = useReadContract({
    address: contractAddress,
    abi: polypuls3Abi,
    functionName: 'getPoll',
    args: [BigInt(pollId)],
    query: {
      enabled: !!contractAddress,
    },
  })

  // Transform the contract data to our Poll type
  const poll: Poll | undefined = pollData
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

  return {
    poll,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
  }
}
