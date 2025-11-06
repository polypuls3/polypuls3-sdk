import { readContracts } from '@wagmi/core'
import type { Config } from 'wagmi'
import { polypuls3Abi } from '../abis/polypuls3'
import { getPolypuls3Address } from '../config/chains'
import type { Poll, PollFilters, PollsQueryResult } from '../types'

/**
 * Fetch a list of polls directly from the contract
 * Uses multicall to batch fetch polls efficiently
 */
export async function fetchPollsFromContract(
  config: Config,
  chainId: number,
  filters: PollFilters = {}
): Promise<PollsQueryResult> {
  const contractAddress = getPolypuls3Address(chainId)
  if (!contractAddress) {
    throw new Error(`No contract address configured for chain ${chainId}`)
  }

  const { limit = 10, offset = 0, creator, status } = filters

  try {
    // First, get the total poll count
    const pollCountResult = await readContracts(config, {
      contracts: [
        {
          address: contractAddress,
          abi: polypuls3Abi,
          functionName: 'pollCount',
        },
      ],
    })

    const totalPolls = Number(pollCountResult[0].result || 0)

    if (totalPolls === 0) {
      return { polls: [], total: 0, hasMore: false }
    }

    // Calculate the range of poll IDs to fetch
    const startId = offset
    const endId = Math.min(offset + limit, totalPolls)

    if (startId >= totalPolls) {
      return { polls: [], total: totalPolls, hasMore: false }
    }

    // Generate poll IDs for the range
    const pollIds: bigint[] = []
    for (let i = startId; i < endId; i++) {
      pollIds.push(BigInt(i))
    }

    // Create contracts array for multicall
    const contracts = pollIds.map((pollId) => ({
      address: contractAddress,
      abi: polypuls3Abi,
      functionName: 'getPoll' as const,
      args: [pollId],
    }))

    // Batch fetch all polls using multicall
    const results = await readContracts(config, { contracts })

    // Transform contract results to Poll[] format
    let polls: Poll[] = results
      .map((result) => {
        if (result.status !== 'success' || !result.result) {
          return null
        }

        const pollData = result.result as any

        return {
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
      })
      .filter((poll): poll is Poll => poll !== null)

    // Apply client-side filters if specified
    if (creator) {
      polls = polls.filter((poll) => poll.creator.toLowerCase() === creator.toLowerCase())
    }

    if (status === 'active') {
      polls = polls.filter((poll) => poll.isActive)
    }

    return {
      polls,
      total: totalPolls,
      hasMore: endId < totalPolls,
    }
  } catch (error) {
    console.error('Error fetching polls from contract:', error)
    throw error
  }
}
