import { useReadContract, useAccount } from 'wagmi'
import { polypuls3Abi } from '../core/abis/polypuls3'
import { getPolypuls3Address } from '../core/config/chains'

export interface UseHasVotedParams {
  pollId: bigint | string
  voter?: `0x${string}`
  chainId?: number
}

export interface UseHasVotedReturn {
  hasVoted: boolean
  userVote: bigint | undefined
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}

/**
 * Hook to check if a user has voted on a poll and get their vote
 *
 * @example
 * ```tsx
 * const { hasVoted, userVote, isLoading } = useHasVoted({ pollId: 1n })
 *
 * if (isLoading) return <div>Checking...</div>
 * if (hasVoted) return <div>You voted for option {userVote?.toString()}</div>
 *
 * return <VoteButton pollId={pollId} />
 * ```
 */
export function useHasVoted({
  pollId,
  voter,
  chainId,
}: UseHasVotedParams): UseHasVotedReturn {
  const { address: connectedAddress } = useAccount()
  const voterAddress = voter || connectedAddress
  const contractAddress = chainId ? getPolypuls3Address(chainId) : undefined

  // Note: The contract uses pollResponses mapping to track votes
  // We read the user's response from the mapping
  const {
    data: responseData,
    isLoading,
    isError,
    error,
    refetch,
  } = useReadContract({
    address: contractAddress,
    abi: polypuls3Abi,
    functionName: 'pollResponses',
    args: voterAddress ? [BigInt(pollId), voterAddress] : undefined,
    query: {
      enabled: !!contractAddress && !!voterAddress,
    },
  })

  // pollResponses returns a tuple: [pollId, respondent, optionIndex, timestamp, rewardClaimed]
  // If pollId === 0, the user hasn't voted
  const hasVoted = responseData && responseData[0] !== 0n
  const userVote = hasVoted && responseData ? responseData[2] : undefined

  return {
    hasVoted: hasVoted ?? false,
    userVote,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
  }
}
