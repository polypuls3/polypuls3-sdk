import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { polypuls3Abi } from '../core/abis/polypuls3'
import { getPolypuls3Address } from '../core/config/chains'
import type { CreatePollParams } from '../core/types'

export interface UseCreatePollReturn {
  createPoll: (params: CreatePollParams) => void
  isPending: boolean
  isSuccess: boolean
  isError: boolean
  error: Error | null
  transactionHash: `0x${string}` | undefined
  pollId: bigint | undefined
}

/**
 * Hook to create a new poll
 *
 * @example
 * ```tsx
 * const { createPoll, isPending, isSuccess, pollId } = useCreatePoll()
 *
 * const handleCreate = () => {
 *   createPoll({
 *     title: 'My Poll',
 *     description: 'What do you think?',
 *     options: ['Option 1', 'Option 2'],
 *     duration: 86400n, // 1 day
 *   })
 * }
 *
 * return (
 *   <button onClick={handleCreate} disabled={isPending}>
 *     {isPending ? 'Creating...' : 'Create Poll'}
 *   </button>
 * )
 * ```
 */
export function useCreatePoll(): UseCreatePollReturn {
  const {
    writeContract,
    data: hash,
    isPending: isWritePending,
    isError: isWriteError,
    error: writeError,
  } = useWriteContract()

  const {
    isLoading: isConfirming,
    isSuccess,
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash,
  })

  const createPoll = ({ title, options, duration, metadata }: CreatePollParams) => {
    const contractAddress = getPolypuls3Address(1) // Default to mainnet, should get from wagmi config

    if (!contractAddress) {
      throw new Error('Contract address not found for current chain')
    }

    // createPoll signature: (address _creator, string _question, string[] _options,
    // uint256 _durationInDays, string _category, uint256 _projectId, string _votingType, string _visibility)
    // Note: We'll use address(0) for _creator to let the contract use msg.sender
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: polypuls3Abi,
      functionName: 'createPoll',
      args: [
        contractAddress, // _creator (will be overridden by contract to msg.sender)
        title, // _question
        options, // _options
        duration, // _durationInDays
        metadata?.category || '', // _category
        BigInt(metadata?.projectId || 0), // _projectId (note: need to add to CreatePollParams)
        'standard', // _votingType
        'public', // _visibility
      ],
    })
  }

  // Extract pollId from transaction receipt logs if available
  // This would require parsing the PollCreated event
  const pollId = receipt?.logs?.[0] ? undefined : undefined // TODO: Parse event logs to get pollId

  return {
    createPoll,
    isPending: isWritePending || isConfirming,
    isSuccess,
    isError: isWriteError,
    error: writeError as Error | null,
    transactionHash: hash,
    pollId,
  }
}
