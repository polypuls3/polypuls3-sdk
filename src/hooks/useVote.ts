import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { polypuls3Abi } from '../core/abis/polypuls3'
import { getPolypuls3Address } from '../core/config/chains'
import type { VoteParams } from '../core/types'

export interface UseVoteReturn {
  vote: (params: VoteParams) => void
  isPending: boolean
  isSuccess: boolean
  isError: boolean
  error: Error | null
  transactionHash: `0x${string}` | undefined
}

/**
 * Hook to vote on a poll
 *
 * @example
 * ```tsx
 * const { vote, isPending, isSuccess, isError } = useVote()
 *
 * const handleVote = () => {
 *   vote({ pollId: 1n, optionId: 0n })
 * }
 *
 * return (
 *   <button onClick={handleVote} disabled={isPending}>
 *     {isPending ? 'Voting...' : 'Vote'}
 *   </button>
 * )
 * ```
 */
export function useVote(): UseVoteReturn {
  const {
    writeContract,
    data: hash,
    isPending: isWritePending,
    isError: isWriteError,
    error: writeError,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const vote = ({ pollId, optionId }: VoteParams) => {
    const address = getPolypuls3Address(1) // Default to mainnet, should get from wagmi config

    if (!address) {
      throw new Error('Contract address not found for current chain')
    }

    // Note: respondToPoll requires _respondent address as first param
    // This should be called from a contract that passes msg.sender
    // For direct user calls, use a different pattern
    writeContract({
      address,
      abi: polypuls3Abi,
      functionName: 'respondToPoll',
      args: [address, BigInt(pollId), BigInt(optionId)],
    })
  }

  return {
    vote,
    isPending: isWritePending || isConfirming,
    isSuccess,
    isError: isWriteError,
    error: writeError as Error | null,
    transactionHash: hash,
  }
}
