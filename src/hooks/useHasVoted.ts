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

  const {
    data: hasVoted,
    isLoading: hasVotedLoading,
    isError: hasVotedError,
    error: hasVotedErrorObj,
    refetch: refetchHasVoted,
  } = useReadContract({
    address: contractAddress,
    abi: polypuls3Abi,
    functionName: 'hasVoted',
    args: voterAddress ? [BigInt(pollId), voterAddress] : undefined,
    query: {
      enabled: !!contractAddress && !!voterAddress,
    },
  })

  const {
    data: userVote,
    isLoading: userVoteLoading,
    isError: userVoteError,
    error: userVoteErrorObj,
    refetch: refetchUserVote,
  } = useReadContract({
    address: contractAddress,
    abi: polypuls3Abi,
    functionName: 'getUserVote',
    args: voterAddress ? [BigInt(pollId), voterAddress] : undefined,
    query: {
      enabled: !!contractAddress && !!voterAddress && hasVoted === true,
    },
  })

  const refetch = () => {
    refetchHasVoted()
    refetchUserVote()
  }

  return {
    hasVoted: hasVoted ?? false,
    userVote: userVote ? BigInt(userVote.toString()) : undefined,
    isLoading: hasVotedLoading || userVoteLoading,
    isError: hasVotedError || userVoteError,
    error: (hasVotedErrorObj || userVoteErrorObj) as Error | null,
    refetch,
  }
}
