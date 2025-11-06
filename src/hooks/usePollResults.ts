import { useReadContract } from 'wagmi'
import { polypuls3Abi } from '../core/abis/polypuls3'
import { getPolypuls3Address } from '../core/config/chains'
import { calculateVotePercentages } from '../core/utils'
import type { PollOption } from '../core/types'

export interface UsePollResultsParams {
  pollId: bigint | string
  options?: readonly string[] // Array of option texts
  chainId?: number
}

export interface UsePollResultsReturn {
  results: PollOption[]
  totalVotes: bigint
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}

/**
 * Hook to fetch poll results with vote counts and percentages
 *
 * @example
 * ```tsx
 * const { results, totalVotes, isLoading } = usePollResults({
 *   pollId: 1n,
 *   options: ['Yes', 'No', 'Maybe'],
 * })
 *
 * if (isLoading) return <div>Loading results...</div>
 *
 * return (
 *   <div>
 *     {results.map((option) => (
 *       <div key={option.id}>
 *         {option.text}: {option.voteCount.toString()} ({option.percentage}%)
 *       </div>
 *     ))}
 *   </div>
 * )
 * ```
 */
export function usePollResults({
  pollId,
  options,
  chainId,
}: UsePollResultsParams): UsePollResultsReturn {
  const contractAddress = chainId ? getPolypuls3Address(chainId) : undefined

  // Fetch vote counts for all options using getPollResults
  const {
    data: voteCounts,
    isLoading,
    isError,
    error,
    refetch,
  } = useReadContract({
    address: contractAddress,
    abi: polypuls3Abi,
    functionName: 'getPollResults',
    args: [BigInt(pollId)],
    query: {
      enabled: !!contractAddress,
    },
  })

  // Build results array
  const rawResults: PollOption[] =
    voteCounts && options
      ? options.map((text, index) => ({
          id: BigInt(index),
          text: typeof text === 'string' ? text : `Option ${index + 1}`,
          voteCount: voteCounts[index] || 0n,
        }))
      : []

  // Calculate percentages
  const results = calculateVotePercentages(rawResults)

  // Calculate total votes
  const totalVotes = results.reduce((sum, option) => sum + option.voteCount, 0n)

  return {
    results,
    totalVotes,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
  }
}
