import { useReadContract } from 'wagmi'
import { polypuls3Abi } from '../core/abis/polypuls3'
import { getPolypuls3Address } from '../core/config/chains'
import { calculateVotePercentages } from '../core/utils'
import type { PollOption } from '../core/types'

export interface UsePollResultsParams {
  pollId: bigint | string
  optionCount: number // Number of options in the poll
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
 *   optionCount: 3,
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
  optionCount,
  chainId,
}: UsePollResultsParams): UsePollResultsReturn {
  const contractAddress = chainId ? getPolypuls3Address(chainId) : undefined

  // Fetch vote counts for all options
  // Note: This is a simplified implementation. In practice, you might want to
  // batch these calls or fetch from subgraph for better performance
  const voteCountQueries = Array.from({ length: optionCount }, (_, i) => {
    return useReadContract({
      address: contractAddress,
      abi: polypuls3Abi,
      functionName: 'getVoteCount',
      args: [BigInt(pollId), BigInt(i)],
      query: {
        enabled: !!contractAddress,
      },
    })
  })

  const isLoading = voteCountQueries.some((q) => q.isLoading)
  const isError = voteCountQueries.some((q) => q.isError)
  const error = voteCountQueries.find((q) => q.error)?.error as Error | null

  // Build results array
  const rawResults: PollOption[] = voteCountQueries.map((query, index) => ({
    id: BigInt(index),
    text: `Option ${index + 1}`, // TODO: Fetch actual option text
    voteCount: query.data ? BigInt(query.data.toString()) : 0n,
  }))

  // Calculate percentages
  const results = calculateVotePercentages(rawResults)

  // Calculate total votes
  const totalVotes = results.reduce((sum, option) => sum + option.voteCount, 0n)

  const refetch = () => {
    voteCountQueries.forEach((query) => query.refetch())
  }

  return {
    results,
    totalVotes,
    isLoading,
    isError,
    error,
    refetch,
  }
}
